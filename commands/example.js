async function showExample(){
    const chalk = require('chalk');
    const example = `
    示例：
    # 查询单词
    qline q ownership
    # 查询词组
    qline q  'work around'
    # 记录最新查询的单词或词组到生词本
    qline s
    # 记录指定单词到生词本
    qline s ownership
    # 查看10个生词列表
    qline l
    # 查看20个生词列表
    qline l 20
    # 随机回顾生词本中单词
    qline r
    `
    let msg = ""
    example.split('\n').forEach(line => {
        if(line.trim().startsWith('#')){
            msg += chalk.gray(line.trim()) + '\n';
        } else {
            msg += chalk.cyan(line.trim()) + '\n';
        }
    })
    console.log(msg);
}

module.exports = showExample;