#!/usr/bin/env node
const { program } = require('commander');

const { version } = require('../package.json');

const {debug} = require('../lib/log')
const queryWord = require('../commands/queryWord');
const listNewWord = require('../commands/listNewWord');

// 配置版本和帮助信息
program
  .version(version, '-v, --version')
  .description('基于 SQLite + ECDICT 的命令行中英文词典工具');

// 1. 查询单词：cdict <word>（作为子命令）
program
  .command('query <word>')
  .alias('q')
  .description('查询单词')
  .action(async (word) => {
    await queryWord(word);
  });

// 2. qline r/record [word]
program
  .command('save [word]')
  .alias('s')
  .action(async (word) => {
      const saveNewWord = require('../commands/saveNewWord');
      await saveNewWord(word);
  });

// 3. 复习生词：qline r/recall
program.command('recall')
  .alias('r')
  .action(async () => {
     const recallNewWord = require('../commands/recallNewWord');
     await recallNewWord();

  });

// 可选参数用中括号
// 4. 查看生词列表：qline l/list [count]   
program
  .command('list [count]')
  .alias('l')
  .action(async (count) => {
    const listNewWord = require('../commands/listNewWord');
    await listNewWord(count);
    
  });

program
  .command('delete <word>')
  .alias('d')
  .action(async (word) => {
    const deleteNewWord = require('../commands/deleteNewWord');
    await deleteNewWord(word);
    
  });

// 解析命令行参数
program.parse(process.argv);

// 处理无参数情况（显示帮助）
if (process.argv.length === 2) {
  program.outputHelp();
}