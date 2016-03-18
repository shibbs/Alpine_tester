var chalk = require('chalk');

module.exports.AlpineTest = function AlpineTest(testDescription){
    var mName = testDescription.name;
    var mFinish, mRunCommand, mListenAssert;
    var mInstruction;
    var mInstructions = testDescription.instructions;
    var mCurrentInst = 0;

    function checkResult(result){
        if('pass' == result){
            pass();
            return true;
        }
        if('fail' == result){
            fail();
            return false;
        }

        console.log(chalk.red("Did not understand result!"));
        return false;
    }

    function pass(){
    }

    function fail(){
        console.log(chalk.red('\t\t'+mInstruction.name+" failed."));
        mFinish('fail');
    }

    function onCommandDone(result){
        var res = checkResult(result);
        if(res){
            if(mInstruction.assertion)
                mListenAssert(mInstruction.assertion, mInstruction.timeout, onAssertDone);
            else // If we dont have any assertion then just return pass
                onAssertDone('pass');
        }
    }

    function onAssertDone(result){
        checkResult(result)
        runInstruction();
    }

    function runInstruction(){
        if(mCurrentInst < mInstructions.length){
            mInstruction = mInstructions[mCurrentInst];
        }else{
            mFinish('pass');
        }
        mRunCommand(mInstruction.command, mInstruction.timeout, onCommandDone);
        mCurrentInst++;
    }

    this.getName = function getName(){
        return mName;
    };

    this.run = function run(runCommand, listenAssert, finishCallback){
        mFinish = finishCallback;
        mRunCommand = runCommand;
        mListenAssert = listenAssert;
        runInstruction();
    };
}
