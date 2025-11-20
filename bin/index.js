#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const dictDB = require('../lib/db');
const vocabBook = require('../lib/vocab');
const { version } = require('../package.json');
const {convertTags } = require('../lib/tags')


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
    try {
      // 连接数据库
      await dictDB.connect();
      // 查询单词
      const result = await dictDB.queryWord(word);

      if (result) {
        // 格式化输出结果
        console.log('\n' + chalk.green.bold(`【${result.word}】`) + (result.phonetic ? chalk.gray(` ${result.phonetic}`) : ''));

        console.log(chalk.blue(`释义：`));
        // 拆分释义（ECDICT 用 / 分隔多个释义）
        const translations = result.translation.split('/').filter(t => t.trim());
        translations.forEach((t, i) => {
          console.log(`  ${i + 1}. ${t.trim()}`);
        });
        if (result.bnc || result.frq) {
          console.log(chalk.gray(`词频：BNC ${result.bnc || '无'} | FRQ ${result.frq || '无'}`));
        }
        if (result.exchange) {
          console.log(chalk.magenta(`变形：`) + result.exchange);
        }

        if (result.tag) console.log(chalk.cyan(`标签：`) + convertTags(result.tag));
        // 保存上次查询的单词
        vocabBook.saveLastQuery(result.word);
      } else {
        console.log(chalk.red(`未找到单词 "${word}" 的记录`));
      }
    } catch (err) {
      throw err;
      //console.log(chalk.red('查询失败：'), err.message);
    } finally {
      // 关闭连接
      dictDB.close();
      vocabBook.close();
    }
  });

// 2. qline r/record [word]
program
  .command('save [word]')
  .alias('s')
  .action(async (word) => {
      try {
        await dictDB.connect();

        // 无参数时，获取上次查询的单词
        if (!word || word.length == 0) {
          word = vocabBook.getLastQuery();
          if (!word) {
            console.log(chalk.red('未找到上一次查询的单词，请指定单词或先查询一个单词'));
            return;
          }
        }

        // 记录生词
        const { success, msg } = await vocabBook.recordWord(word);
        if (success) {
          console.log(chalk.green(msg));
        } else {
          console.log(chalk.yellow(msg));
        }
      } catch (err) {
        console.log(chalk.red('记录生词失败：'), err.message);
      } finally {
        dictDB.close();
        vocabBook.close();
      }
  });

// 3. 复习生词：qline r/recall
program.command('recall')
  .alias('r')
  .action(async () => {

      try {
        await dictDB.connect();
        const randomWord = await vocabBook.getRandomWord();

        if (!randomWord) {
          console.log(chalk.yellow('生词本为空，先使用 qline -s <word> 记录生词吧！'));
          return;
        }

        // 显示单词，等待用户确认
        console.log(chalk.cyan(`\n📖 请回忆单词：`) + chalk.bold(randomWord.word));
        console.log(chalk.gray('按回车查看释义...'));

        // 监听回车事件
        process.stdin.once('data', () => {
          // 格式化输出释义
          console.log('\n' + chalk.green.bold(`【${randomWord.word}】`) + (randomWord.phonetic ? chalk.gray(` ${randomWord.phonetic}`) : ''));
          console.log(chalk.blue(`释义：`));
          const translations = randomWord.translation.split('/').filter(t => t.trim());
          translations.forEach((t, i) => {
            console.log(`  ${i + 1}. ${t.trim()}`);
          });
          process.exit(0);
        });
      } catch (err) {
        console.log(chalk.red('复习失败：'), err.message);
        dictDB.close();
        vocabBook.close();
      }

  });

// 可选参数用中括号
// 4. 查看生词列表：qline l/list [count]   
program
  .command('list [count]')
  .alias('l')
  .action(async (count) => {
    count = count ? count :  10;
    
      try {
        const limit = parseInt(count, 10) || 10;
        const vocabList = await vocabBook.getVocabList(limit);

        if (vocabList.length === 0) {
          console.log(chalk.yellow('生词本为空'));
          return;
        }

        // 格式化输出列表
        console.log(chalk.cyan(`\n📚 生词列表（共 ${vocabList.length} 个，最近 ${limit} 个）：`));
        vocabList.forEach((item, index) => {
          const time = new Date(item.record_time).toLocaleString();
          console.log(`${index + 1}. ${chalk.bold(item.word)} ${chalk.gray(`(${time})`)}`);
        });
      } catch (err) {
        console.log(chalk.red('查看生词列表失败：'), err.message);
      } finally {
        vocabBook.close();
      }
    
  });

// 解析命令行参数
program.parse(process.argv);

// 处理无参数情况（显示帮助）
if (process.argv.length === 2) {
  program.outputHelp();
}