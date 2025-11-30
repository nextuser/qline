
async function resetVocabulary(needConfirm = false) {
  if (needConfirm) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('此操作将清空整个生词本，确定要继续吗？(yes/no): ', async (answer) => {
    const normalizedAnswer = answer.trim().toLowerCase();
    if (normalizedAnswer === 'yes' || normalizedAnswer === 'y') {
        await performReset(); // 实际的清空操作
    } else {
        console.log('操作已取消');
    }
    rl.close();
    });
  } else {
    await performReset(); // 直接执行清空操作
  }
}

async function performReset() {
  // 原有的清空生词本逻辑
    const chalk = require('chalk');
    const vocabBook = require('../lib/vocab');

    try {
        await vocabBook.reset();
        console.log('生词本已清空');

    } catch (err) {
        console.log(chalk.red('清空生词列表失败：'), err.message);
    } finally {
        vocabBook.close();
    }
}

module.exports = resetVocabulary;