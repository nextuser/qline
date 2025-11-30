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
program.command('recall [count]')
  .alias('r')
  .description('复习生词')
  .action(async (count) => {
     const recallNewWord = require('../commands/recallNewWord');
     await recallNewWord(true,true,count);

  });

  // 3. 复习生词：qline r/recall
program.command('recall-by-pronunciation [count]')
  .alias('rp')
  .description('根据中文含义复习生词')
  .action(async () => {
     const recallNewWord = require('../commands/recallNewWord');
     await recallNewWord(false,true,count);

  });


  program.command('recall-by-chinese [count]')
  .alias('rc')
  .description('根据中文含义复习生词')
  .action(async (count) => {
     const recallNewWord = require('../commands/recallNewWord');
     await recallNewWord(true,false,count);

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
  .command('clear ')
  .alias('c')
  .option('-y, --yes', '直接确认清空，无需确认提示')
  .description('清空生词本')
  .action(async (options) => {
    const resetVocabulary = require('../commands/resetVocabulary');
    await resetVocabulary(!options.yes);
    
  });


  // 定义子命令 `t`（可理解为 `train/study` 缩写）
const tCommand = program.command('train')
  .alias('t')
  .description('单词学习/训练模式') // 子命令描述
  .option('-tag, --tag <tag>', '指定单词标签（zk:中考,gk:高考,cet4:四级,cet6:六级,ky:考研,toefl:托福,ielts:雅思）', (value) => {
    // 验证 tag 合法性
    const {tags} = require('../lib/getTagQuery'); // 扩展其他标签
    if (!tags.includes(value)) {
      console.error(`无效标签：${value}，仅支持 ${tags.join('/')}`);
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
    console.log("version:" ,version);
    showExample();
    process.exit(1);
  });

 program
  .command('*', { isDefault: true })
  .description('显示版本信息')
  .action(() => {
    console.log("version:",version);
  });

    // 在解析命令行参数之前添加未知命令处理
  program.on('command:*', function () {
    console.error('See --help for a list of available commands.', program.args.join(' '));
    program.help();//program.outputHelp();
    process.exit(1);
  });

// 解析命令行参数
program.parse(process.argv);
// 处理无参数情况（显示帮助）
if (process.argv.length === 2) {
  
  program.help();//program.outputHelp();
}

