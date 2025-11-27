#!/usr/bin/env node
const { program } = require('commander');

const { version } = require('../package.json');

const {debug} = require('../lib/log')
const queryWord = require('../commands/queryWord');
const listNewWord = require('../commands/listNewWord');
const showExample = require('../commands/example');

// 配置版本和帮助信息
program
  .version(version, '-v, --version')
  .description('英中词典：支持查单词 背单词');

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
  .description('保存生词')
  .alias('s')
  .action(async (word) => {
      const saveNewWord = require('../commands/saveNewWord');
      await saveNewWord(word);
  });

// 3. 复习生词：qline r/recall
program.command('recall')
  .alias('r')
  .description('复习生词')
  .action(async () => {
     const recallNewWord = require('../commands/recallNewWord');
     await recallNewWord();

  });

  // 3. 复习生词：qline r/recall
program.command('recall-by-pronunciation')
  .alias('rp')
  .description('根据中文含义复习生词')
  .action(async () => {
     const recallNewWord = require('../commands/recallNewWord');
     await recallNewWord(false,true);

  });


  program.command('recall-by-chinese')
  .alias('rc')
  .description('根据中文含义复习生词')
  .action(async () => {
     const recallNewWord = require('../commands/recallNewWord');
     await recallNewWord(true,false);

  });
// 可选参数用中括号
// 4. 查看生词列表：qline l/list [count]   
program
  .command('list [count]')
  .alias('l')
  .description('查看生词列表')
  .action(async (count) => {
    const listNewWord = require('../commands/listNewWord');
    await listNewWord(count);
    
  });

program
  .command('delete <word>')
  .alias('d')
  .description('删除生词')
  .action(async (word) => {
    const deleteNewWord = require('../commands/deleteNewWord');
    await deleteNewWord(word);
    
  });


  program
  .command('clear')
  .alias('c')
  .description('清空生词本')
  .action(async (word) => {
    const resetVocabulary = require('../commands/resetVocabulary');
    await resetVocabulary();
    
  });


  // 定义子命令 `t`（可理解为 `train/study` 缩写）
const tCommand = program.command('train')
  .alias('t')
  .description('单词学习/训练模式') // 子命令描述
  .option('-tag, --tag <tag>', '指定单词标签（ky:考研, cet4:四级, cet6:六级, gk:高考, toffel:托福, ielts:雅思）', (value) => {
    // 验证 tag 合法性
    const validTags = ['ky', 'cet4', 'cet6', 'gk','toffel', 'ielts']; // 扩展其他标签
    if (!validTags.includes(value)) {
      console.error(`无效标签：${value}，仅支持 ${validTags.join('/')}`);
      return null;
    }
    return value;
  }).option ('-c, --count [count]', '指定单词数量', (value) => {
    debug("tCommand.option count:",value);
    if(!value ){
      return 10
    }
    return parseInt(value);
  });

// 子命令执行逻辑（解析参数后触发）
tCommand.action((options) => {
  // 获取 -tag 选项的值
  const tag = options.tag;
  let count = options.count;
  if(!count ){
    count = 10;
  }
  if (!tag ) {
    // 未指定 tag 时提示帮助
    tCommand.outputHelp();
    return;
  }

  const reviewByTag = require('../commands/reviewByTag');
  reviewByTag(tag,count);
});

  program.on('--help', () => {
    showExample();
    process.exit(1);
  });

// 解析命令行参数
program.parse(process.argv);
// 处理无参数情况（显示帮助）
if (process.argv.length === 2) {
  program.help();//program.outputHelp();
}