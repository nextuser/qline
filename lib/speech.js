const { debug } = require('./log');
const os = require('os');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const { speechConfigPath } = require('./config');
 
const execPromise = util.promisify(exec);
 
// 默认配置
const defaultSpeechConfig = {
  enabled: false
};
 

/**
 * 跨平台语音合成模块
 * 支持 Windows、Linux、Mac OS
 */
class Speech {
  constructor() {
    this.platform = os.platform();
    this.config = this.loadConfig();
    this.availableEngine = null; // 记录可用的语音引擎
    this.hasShownHint = false; // 避免重复提示安装信息
    debug(`当前平台: ${this.platform}`);
    debug(`语音合成配置: ${JSON.stringify(this.config)}`);
  }

  /**
   * 加载语音合成配置
   * @returns {Object} 语音合成配置
   */
  loadConfig() {
    try {
      if (fs.existsSync(speechConfigPath)) {
        const configData = fs.readFileSync(speechConfigPath, 'utf8');
        return JSON.parse(configData);
      }
    } catch (error) {
      debug(`加载语音配置失败: ${error.message}`);
    }
    return { ...defaultSpeechConfig };
  }

  /**
   * 保存语音合成配置
   */
  saveConfig() {
    try {
      fs.writeFileSync(speechConfigPath, JSON.stringify(this.config, null, 2), 'utf8');
      debug(`语音配置已保存: ${JSON.stringify(this.config)}`);
    } catch (error) {
      debug(`保存语音配置失败: ${error.message}`);
    }
  }

  /**
   * 设置语音合成开关状态
   * @param {boolean} enabled - 是否启用语音合成
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
    this.saveConfig();
  }

  /**
   * 获取语音合成开关状态
   * @returns {boolean} 语音合成是否启用
   */
  isEnabled() {
    return this.config.enabled;
  }

  /**
   * 显示安装提示信息
   */
  showInstallHint() {
    debug('如需启用语音合成，请在配置中开启');
  }

  /**
   * 检查当前平台是否支持语音合成
   * @returns {Promise<boolean>} 是否支持语音合成
   */
  async checkSupport() {
    try {
      switch (this.platform) {
        case 'win32':
          // Windows 检查 SAPI 是否可用
          await execPromise('powershell -Command "Add-Type -AssemblyName System.Speech; $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speak.Dispose()"');
          // 语音引擎成功，启用语音合成
          this.availableEngine = 'sapi';
          this.setEnabled(true);
          debug('Windows SAPI语音引擎可用');
          return true;
        case 'darwin':
          // Mac OS 检查 say 命令是否可用
          await execPromise('which say');
          // 语音引擎成功，启用语音合成
          this.availableEngine = 'say';
          this.setEnabled(true);
          debug('Mac OS say语音引擎可用');
          return true;
        case 'linux':
          // Linux 检查 festival 或 espeak 是否可用
          try {
            await execPromise('which festival');
            // 语音引擎成功，启用语音合成
            this.availableEngine = 'festival';
            this.setEnabled(true);
            debug('Linux festival语音引擎可用');
            return true;
          } catch (e) {
            try {
              await execPromise('which espeak');
              // 语音引擎成功，启用语音合成
              this.availableEngine = 'espeak';
              this.setEnabled(true);
              debug('Linux espeak语音引擎可用');
              return true;
            } catch (e2) {
              this.availableEngine = null;
              debug('Linux 没有可用的语音引擎');
              return false;
            }
          }
        default:
          this.availableEngine = null;
          debug(`当前平台 ${this.platform} 不支持语音合成`);
          return false;
      }
    } catch (error) {
      debug(`语音合成检查失败: ${error.message}`);
      this.availableEngine = null;
      return false;
    }
  }

  /**config
   * 播放英文单词
   * @param {string} word - 要播放的英文单词
   * @returns {Promise<void>} 播放完成后的 Promise
   */
  async speakWord(word) {
    if (!word) {
    debug('没有提供要播放的单词');
    return;
  }

  // 检查语音合成是否启用
  if (!this.isEnabled()) {
    debug('语音合成未启用，跳过播放');
    // 显示安装提示信息
    this.showInstallHint();
    return;
  }

  try {
      switch (this.platform) {
        case 'win32':
          // Windows 使用 PowerShell 和 SAPI
          await execPromise(`powershell -Command "Add-Type -AssemblyName System.Speech; $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speak.Speak('${word}'); $speak.Dispose()"`);
          break;
        case 'darwin':
          // Mac OS 使用 say 命令
          await execPromise(`say -v Samantha "${word}"`);
          break;
        case 'linux':
          // Linux 使用预检测的语音引擎
          if (this.availableEngine === 'festival') {
            await execPromise(`echo '${word}' | festival --tts --language english`);
          } else if (this.availableEngine === 'espeak') {
            await execPromise(`espeak -s 140 -v en ${word}`);
          } else {
            debug('Linux 没有可用的语音引擎');
          }
          break;
        default:
          debug(`当前平台 ${this.platform} 不支持语音合成`);
      }
    } catch (error) {
      debug(`语音播放失败: ${error.message}`);
      // 如果播放失败，尝试重新检测引擎
      await this.checkSupport();
    }
  }
  }

  /**
   * 显示语音引擎安装提示信息
   */
  function showInstallHint() {
    // 只在首次提示时显示，避免重复提示
    if (this.hasShownHint) {
      return;
    }
    
    const chalk = require('chalk');
    console.log(chalk.yellow('\n💡 提示：语音合成功能未启用，如需使用请安装相应的语音引擎。'));
    console.log(chalk.yellow('   运行 `qline cs` 命令可检查语音合成支持情况并获取安装指导。'));
    
    this.hasShownHint = true;
  }

// 导出单例实例
module.exports = new Speech();