// __tests__/integration/cli.test.js
const { expect } = require('chai');
const { spawn } = require('child_process');
const path = require('path');
const version = require('../../package.json').version;

describe('CLI Integration', () => {
  it('应该显示版本信息', (done) => {
    const cli = spawn('node', [path.resolve(__dirname, '../../bin/index.js'), '--version']);
    
    cli.stdout.on('data', (data) => {
      expect(data.toString()).to.contain(version);
      done();
    });
    
    cli.on('error', (error) => {
      done(error);
    });
  });


    it('应该显示帮助信息', (done) => {
    const cli = spawn('node', [path.resolve(__dirname, '../../bin/index.js'), '--help']);
    let outMsg = ''
    //由于输出信息比较长，这个on('data' ) 会被调用多次，所以需要在on('end' ) 中判断done， done只能被调用一次
    cli.stdout.on('data', (data) => {
      outMsg += data.toString()
    });

    cli.stdout.on('end', (data) => {
      expect(outMsg).to.contain('Usage:');
      done();
    });
    
    cli.on('error', (error) => {
      done(error);
    });
  });


    it('查词组', (done) => {
    const cli = spawn('node', [path.resolve(__dirname, '../../bin/index.js'), 'q' ,'work around']);
        let outMsg = ''
        //由于输出信息比较长，这个on('data' ) 会被调用多次，所以需要在on('end' ) 中判断done， done只能被调用一次
        cli.stdout.on('data', (data) => {
        outMsg += data.toString()
        });

        cli.stdout.on('end', (data) => {
        //console.log(outMsg);
        expect(outMsg).to.contain('绕个弯解决');
        done();
        });
        
        cli.on('error', (error) => {
        done(error);
        });
  });

  const cliPath = path.resolve(__dirname, '../../bin/index.js');

    // 测试查询单词
  it('应该能查询单词 ownership', (done) => {
    const cli = spawn('node', [cliPath, 'q', 'ownership']);
    let outMsg = '';
    
    cli.stdout.on('data', (data) => {
      outMsg += data.toString();
    });

    cli.stdout.on('end', () => {
      expect(outMsg).to.contain('所有权');
      done();
    });
    
    cli.on('error', (error) => {
      done(error);
    });
  });

      // 测试查询单词
  it('记录生词  qline s ownership', (done) => {
    const cli = spawn('node', [cliPath, 's', 'ownership']);
    let outMsg = '';
    
    cli.stdout.on('data', (data) => {
      outMsg += data.toString();
    });

    cli.stdout.on('end', () => {
      expect(outMsg).to.contain('已记录生词');
      expect(outMsg).to.contain('ownership');
      expect(outMsg).to.contain('释义');
      done();
    });
    
    cli.on('error', (error) => {
      done(error);
    });
  });

it('记录生词  qline s wwsx', (done) => {
    const cli = spawn('node', [cliPath, 's', 'wwsx']);
    let outMsg = '';
    
    cli.stdout.on('data', (data) => {
      outMsg += data.toString();
    });

    cli.stdout.on('end', () => {
      expect(outMsg).to.contain('未找到');
      done();
    });
    
    cli.on('error', (error) => {
      done(error);
    });
  });

    // 测试查看生词列表
  it('应该能查看生词列表', (done) => {
    const cli = spawn('node', [cliPath, 'l']);
    let outMsg = '';
    
    cli.stdout.on('data', (data) => {
      outMsg += data.toString();
    });

    cli.stdout.on('end', () => {
      // 可能为空或包含生词列表
      expect(outMsg).to.contain('生词列表');
      expect(outMsg).to.contain('1.');
      done();
    });
    
    cli.on('error', (error) => {
      done(error);
    });
  });


  it('复习生词并通过Ctrl+C退出', function(done) {
  this.timeout(10000); // 增加超时时间
  
  const cli = spawn('node', [cliPath, 'r', '1']);
  let output = '';
  let hasSentCtrlC = false;

  cli.stdout.on('data', (data) => {
    output += data.toString();
    
    // 当出现输入提示时发送 Ctrl+C
    if (output.includes('请输入单词：') && !hasSentCtrlC) {
      hasSentCtrlC = true;
      cli.kill('SIGINT'); // 发送中断信号
    }
  });

  cli.stderr.on('data', (data) => {
    console.error('stderr:', data.toString());
  });

  cli.on('exit', (code, signal) => {
    // 验证程序正确响应了中断信号
    expect(signal).to.equal('SIGINT');
    expect(output).to.contain('根据提示拼写单词');
    done();
  });

  cli.on('error', (error) => {
    done(error);
  });
});

   // 测试训练模式 - 考研词汇
  it('应该能进行考研词汇训练', (done) => {
    const cli = spawn('node', [cliPath, 't']);
    let outMsg = '';
    
    cli.stdout.on('data', (data) => {
      outMsg += data.toString();
    });

    cli.stdout.on('end', () => {
      expect(outMsg).to.contain('-tag');
      expect(outMsg).to.contain('-c');
      done();
    });
    
    cli.on('error', (error) => {
      done(error);
    });


  });

    // 清空写字本 - 考研词汇
  it('清空写字本', (done) => {
    const cli = spawn('node', [cliPath, 'clear' ,'--yes']);
    let outMsg = '';
    
    cli.stdout.on('data', (data) => {
      outMsg += data.toString();
    });

    cli.stdout.on('end', () => {
      expect(outMsg).to.contain('生词本已清空');
      done();
    });
    
    cli.on('error', (error) => {
      done(error);
    });

  });


  it('应该能进行中考词汇训练并通过Ctrl+C退出', function(done) {
  this.timeout(10000); // 增加超时时间
  
  const cli = spawn('node', [cliPath, 't', '-tag', 'zk', '-c', '2']);
  let output = '';
  let hasSentCtrlC = false;

  cli.stdout.on('data', (data) => {
    output += data.toString();
    
    // 当出现输入提示时发送 Ctrl+C
    if (output.includes('请输入单词：') && !hasSentCtrlC) {
      hasSentCtrlC = true;
      cli.kill('SIGINT'); // 发送中断信号
    }
  });

  cli.stderr.on('data', (data) => {
    console.error('stderr:', data.toString());
  });

  cli.on('exit', (code, signal) => {
    // 验证程序正确响应了中断信号
    expect(signal).to.equal('SIGINT');
    expect(output).to.contain('根据提示拼写单词');
    done();
  });

  cli.on('error', (error) => {
    done(error);
  });
});


});

