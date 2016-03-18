var chalk = require('chalk');

module.exports.AlpineTest = function AlpineTest(testDescription){
    return {
      mName: testDescription.name,
      mFinish: undefined,
      mRunCommand: undefined,
      mListenAssert: undefined,
      mInstruction: undefined,
      mInstructions: testDescription.instructions,
      mCurrentInst: 0,

      checkResult: function checkResult(result){
          if('pass' == result){
              this.pass();
              return true;
          }
          if('fail' == result){
              this.fail();
              return false;
          }

          console.log(chalk.red("Did not understand result!"));
          return false;
      },

      pass: function pass(){
      },

      fail: function fail(){
          console.log(chalk.red('\t\t'+this.mInstruction.name+" failed."));
          this.cleanUp();
          this.mFinish('fail');
          this.mFinish = undefined;
      },

      onCommandDone: function onCommandDone(result){
          var res = this.checkResult(result);
          if(res){
              if(this.mInstruction.assertion)
                  this.mListenAssert(this.mInstruction.assertion, this.mInstruction.timeout, this.onAssertDone);
              else // If we dont have any assertion then just return pass
                  this.onAssertDone('pass');
          }
      },

      onAssertDone: function onAssertDone(result){
          this.checkResult(result);
          this.runInstruction();
      },

      runInstruction: function runInstruction(){
          if(!this.mInstructions){
            return;
          }
          
          if(this.mCurrentInst < this.mInstructions.length){
              this.mInstruction = this.mInstructions[this.mCurrentInst];
          }else{
              this.cleanUp();
              this.mFinish('pass');
              this.mFinish = undefined;
          }

          if(!this.mInstruction){ // Somehow we're getting rogue calls into here. Squash it
              return;
          }

          console.log("\tRunning instruction "+ (this.mCurrentInst+1) +" of "+ this.mInstructions.length +": "+ chalk.blue(this.mInstruction.name));

          this.mCurrentInst++;
          this.mRunCommand(this.mInstruction.command, this.mInstruction.timeout, this.onCommandDone);
      },

      getName: function getName(){
          return this.mName;
      },

      run: function run(runCommand, listenAssert, finishCallback){
          this.mFinish = finishCallback;
          this.mRunCommand = runCommand;
          this.mListenAssert = listenAssert;
          this.runInstruction();
      },

      cleanUp: function cleanUp(){
        this.mRunCommand = undefined;
        this.mListenAssert = undefined;
        this.mInstruction = undefined;
        this.mInstructions = undefined;
        this.mCurrentInst = undefined;
      }
  };
};
