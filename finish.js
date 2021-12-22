const io = require('console-read-write');
class RulesGames{
rullGams = [];
compareChoice(myChoice,pcChoice,p){
 if (myAnser == pcAnser){
     console.log("Draw");}
    let half = (p - 1)/2;
    if (pcChoice>myChoice){
        if(pcChoice - myChoice <= half){
            console.log("You lose");
        }else {console.log("You win")}
    }else if (myChoice > pcChoice){
         if(myChoice - pcChoice <= half){
             console.log("You win")
    }else{console.log("You lose");}
    }
}

createrDataForTable (inOne,inTwo,p){
    if (inOne == inTwo){
        return "Draw";}
       let half = (p - 1)/2;
       if (inTwo>inOne){
           if(inTwo - inOne <= half){
               return "Lose";
           }else {return "Win";}
       }else if (inOne > inTwo){
            if(inOne - inTwo <= half){
                return "Win"
       }else{return "Lose";}
       }
   }
helpTable(mas){
       let str = ("0 |   ");
    for (let i = 0; i<mas.length; i++ ){
        str +=("   " + mas[i] + "   |   ");
    }
io.write(str);

for (let c = 0; c<mas.length; c++ ){
    let s = "";
     s = s +  mas[c] + "   | ";
for (let j = 0; j<mas.length; j++ ){
    s= s +  this.createrDataForTable(c,j,mas.length) + "    |     ";
}   io.write("-----------------------------------------------------------------------------------------------------------")
    io.write(s)
}
}
}

class PleyerAndPc{
    answerData = [];
    cryptoAnser = [];
    data =[];

    addDataPleyer(data){
        this.answerData.push(data);
   }
      getDataPleyer(){
        return this.answerData[this.answerData.length-1];
   }
   async addCryptoKey(data){
       this.cryptoAnser.push(data);
   }
  async getCryptoKey(){
      this.cryptoAnser[this.cryptoAnser.length-1];
  }
     computersChoice(max){
         let min = 1;
         min = Math.ceil(min);
         max = Math.floor(max);
         let a =  Math.floor(Math.random() * (max - min + 1)) + min;
         this.data.push(a);
    }
    getDataPc(){
        return this.data[this.data.length-1];
    }

}

class GeneratorHmac{
    key ;
    constructor(){
        this.cheng();
    }

    async cheng(){
        let text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        this.key = text;
    }
    async cryptoKey(key , choice){
        const { createHmac } = await import('crypto');
        const hash = createHmac('sha256', key)
        .update(choice)
        .digest('hex');
        return hash;
        }
    async getHachKey(){
        let a = await this.cryptoKey(this.key , "");
        return a;
    }
     async getHeshWithData(inerKey, choice){
          let a = await this.cryptoKey(inerKey, choice);
          return a;
     }
}

class Hendler{
    dataUser = [];
    answerOptions = [];
    flag;
    flagMasive;

constructor(){
        this.answerOptions = process.argv;
        this.answerOptions = this.answerOptions.slice(2);
        this.flagMasive = this.answerOptions.length;
        this.flag= this.answerOptions.length%2 ? true : false ;
        if(!this.flag){
            console.log("An even number of parameters.\nThe result of the game will be incorrect.\n It should be like this - node finish.js rock paper scissors lizard spock ") 
        }else if (this.flagMasive ===1){
            console.log("You only have one parameter. This is not enough for the continuation of the game.");   
            this.flag = false;
    }
    }
   
async showMeny(){
        if (this.flag){
       let n= 1;
        for (const i of this.answerOptions) {
            console.log(n + " " + i);
            n ++;
        } console.log("0 exit \n? help"); 
    }
}

async readConsole(){
  if (this.flag){
  io.write(`Enter your move:`);
  let str  = (await io.read());
  if (str === String(0)){
      io.write("your choice: " + str + " Exit");
      return 1;
  }else if(str === '?'){
    io.write("your choice: " + str + " Help");
    return 2;
  }else if(Number (str) > this.flagMasive ) { 
    io.write("Your choice is greater than allowed. You are trying to cheat.")
    return 1;
  }else{
    this.dataUser.push(str);
    io.write("your choice: " + str + " " + this.answerOptions[str -1] )
    return 3;
  }
}
}

async answerLenthMasiv(){
    return  this.answerOptions.length;
}

getDataFromMasiv(chois){
    return this.answerOptions[chois-1]
}

getUserData(){
    return this.dataUser[this.dataUser.length-1];
}

getFlag(){return this.flag;}

getAllAnswer(){
    return this.answerOptions;
}
}

const hehdler = new Hendler();
const pleyer = new PleyerAndPc();
const generatorHmac = new GeneratorHmac();
const rulesGames = new RulesGames();
let replay = hehdler.getFlag();
let a;
let pcAnser;
let myAnser;

async function startOne(){
    for(;replay;){
        pleyer.computersChoice(await hehdler.answerLenthMasiv());
        a =await generatorHmac.getHachKey();
        let pcHmac = await generatorHmac.getHeshWithData(a,String (pcAnser));
        console.log("HMAC PC:" + pcHmac );    
    pcAnser =await pleyer.getDataPc()
    hehdler.showMeny();
    const fg =  await hehdler.readConsole();
    if (fg === 3){await startSecond();
        console.log("HMAC KEY: " + a + " \n\n ");
        replay =true;
    }else if(fg ===2){
        console.log("help");
        rulesGames.helpTable(hehdler.getAllAnswer());
    }else if(fg === 1){
        replay = false;
        thanks();
    }
    }  
}

async function startSecond(){
    let c = hehdler.answerLenthMasiv();
    myAnser = Number(hehdler.getUserData());
    pleyer.computersChoice(c);
    console.log("PC choice: " + pcAnser + " " + hehdler.getDataFromMasiv(pcAnser));
    rulesGames.compareChoice(myAnser,pcAnser,c);
    generatorHmac.cheng();
    a =await generatorHmac.getHachKey();    
}

async function thanks(){
    console.log("Thanks for playing");
}

startOne();
