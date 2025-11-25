// 工具函数：异步读取一行输入
async function readlineAsync() {
  return new Promise((resolve, reject) => {
        // 设置输入编码
        process.stdin.setEncoding('utf8');
        // 启动输入流
        process.stdin.resume();

        // 监听输入事件
        const onData = (input) => {
        // 去除输入中的首尾空格和换行符
        const line = input.trim();
        // 移除事件监听（避免重复触发）
        process.stdin.off('data', onData);
        process.stdin.off('error', onError);
        process.stdin.off('close', onClose);
        // 暂停输入流
        process.stdin.pause();
        // 返回读取的内容
        resolve(line);
        };

        const onClose = () => {
            process.stdin.off('data', onData);
            process.stdin.off('error', onError);
            process.stdin.off('close', onClose);
            process.exit();
            console.log(chalk.gray('\n输入流已关闭'));
        }

        // 监听错误事件
        const onError = (err) => {
            process.stdin.off('data', onData);
            process.stdin.off('error', onError);
            process.stdin.off('close',onClose);
            process.stdin.pause();
            reject(err);
        };

        process.stdin.on('data', onData);
        process.stdin.on('error', onError);
        process.stdin.on('close', onClose);
    });
}

module.exports = {
    readlineAsync
};