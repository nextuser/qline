function showWord(record,showWord = true){ 
    const chalk = require('chalk');
    const {convertTags } = require('../lib/tags')
    // 格式化输出结果
    if(showWord){
        console.log(chalk.green.bold(`【${record.word}】`) + (record.phonetic ? chalk.gray(` ${record.phonetic}`) : ''));
    } else if(record.phonetic){
        console.log(chalk.green.bold( ` ${record.phonetic}`));
    }
    

    console.log(chalk.blue(`释义：`));
    // 拆分释义（ECDICT 用 / 分隔多个释义）
    const translations = record.translation.split('/').filter(t => t.trim());
    translations.forEach((t, i) => {
        console.log(`${t.trim()}`);
    });
    if (record.bnc || record.frq) {
        console.log(chalk.cyan(`词频：BNC ${record.bnc || '无'} | FRQ ${record.frq || '无'}`));
    }
    if (record.exchange) {
        console.log(chalk.magenta(`变形：`) + record.exchange);
    }

    if (record.tag){
        console.log(chalk.green(`标签：`) + convertTags(record.tag));
    }

}

module.exports = {showWord};