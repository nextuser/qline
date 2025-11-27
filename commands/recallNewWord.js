const {debug} = require('../lib/log');
const vocab = require('../lib/vocab');
const {readlineAsync} = require('../lib/util');
const {WordData,WordBook} = require('../lib/wordBook');
const chalk = require('chalk');
const cq = require('cdict_query');
async function recall(byChinese=true,byPonenic=true){
    const book = new WordBook();
    let needBreak = false;
    await cq.connect();
    await vocab.connect();
    try {
       
       const words = await vocab.getRandomWords(20);
       debug("vocab.getRandomWords result:  ",words);
       for(  w of words){
            debug("query word:",w);
            if(!w) continue;
           let record = await cq.queryWord(w);
           const data = new WordData(record);
           if(!book.addWord(data)){
             debug("add word fail:" , data.word);
           } else {
             console.log(" book addWord succ",data.word)
           }
       }
       while(!needBreak){ 
            book.print();
            let randomWord = book.getNextWord();
            if(!randomWord){
                console.log(chalk.green("\n 完成任务"));
                break;
            }
            console.log(chalk.cyan("\n 根据提示拼写单词，按Ctrl+C退出"))

            console.log(chalk.gray('\n===============================================\n'));
            
            if(byPonenic && randomWord.phonetic){
              
              console.log(chalk.cyan("读音："),chalk.bold(randomWord.phonetic));
            }
            if( (byChinese && randomWord.translation) || !randomWord.phonetic){
                
                console.log(chalk.cyan("释义："),chalk.bold(randomWord.translation));
            }
           
            // 显示单词，等待用户确认
            process.stdout.write(chalk.blue(`\n请输入单词：`));
            process.stdin.setEncoding('utf8');
            process.stdin.resume();
            const input = await readlineAsync();
            const userInput = input.trim().toLowerCase();
            let wordShow ;
            if(userInput.toLowerCase() == randomWord.word.toLowerCase()){
                book.studyWord(randomWord,true);
                console.log(chalk.bold(chalk.green('\n恭喜你，回答正确！')));
                wordShow = chalk.green(randomWord.word);
            }else{
                book.studyWord(randomWord,false);
                console.log(chalk.bold(chalk.red('\n很遗憾，回答错误！')));
                wordShow = chalk.red(randomWord.word);
                //await vocab.recordWord(randomWord.word);
            }

            // 格式化输出释义
            console.log('\n' + chalk.green.bold(`【${wordShow}】`) + (randomWord.phonetic ? chalk.gray(` ${randomWord.phonetic}`) : ''));
            console.log(chalk.blue(`释义：`));
            const translations = randomWord.translation.split('/').filter(t => t.trim());
            translations.forEach((t, i) => {
                console.log(`  ${i + 1}. ${t.trim()}`);
            });
        }

    }
    catch (err) {
        throw err;
        //console.log(chalk.red( err.message));
    }
    // vocab.close();
    // cq.close();
}

module.exports=recall
