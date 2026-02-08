const speech = require('../lib/speech');
const chalk = require('chalk');

/**
 * 检查语音合成支持情况的命令
 */
async function checkSpeechSupport() {
  console.log(chalk.blue('正在检查语音合成支持情况...'));
  
  const isSupported = await speech.checkSupport();
  
  if (isSupported) {
    console.log(chalk.green('✓ 当前平台支持语音合成功能'));
    console.log(chalk.gray('提示：在单词记忆过程中，将自动播放单词读音'));
  } else {
    console.log(chalk.red('✗ 当前平台不支持语音合成功能'));
    console.log(chalk.gray('请按照以下说明安装相应的语音引擎：'));
    
    // 根据不同平台提供安装指导
    const os = require('os');
    const platform = os.platform();
    
    switch (platform) {
      case 'win32':
        console.log(chalk.gray('- Windows: 系统已内置语音引擎，可能需要启用'));
        console.log(chalk.gray('  控制面板 → 语音识别 → 文本到语音转换'));
        break;
      case 'darwin':
        console.log(chalk.gray('- Mac OS: 系统已内置语音引擎，请确保音量已开启'));
        break;
      case 'linux':
        console.log(chalk.gray('- Linux: 请安装以下语音引擎之一：'));
        console.log(chalk.gray('  - Festival: sudo apt-get install festival festival-english (Debian/Ubuntu)'));
        console.log(chalk.gray('  - eSpeak: sudo apt-get install espeak (Debian/Ubuntu)'));
        console.log(chalk.gray('  - 或在其他发行版上使用相应的包管理器安装'));
        break;
      default:
        console.log(chalk.gray('- 其他平台: 请安装兼容的语音合成引擎'));
    }
  }
}

module.exports = checkSpeechSupport;
