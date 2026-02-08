async function showExample(){
    const chalk = require('chalk');
    const example = `
    Usage:
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
    # 随机回顾生词本中10个单词
    qline r 10
    #清空生词本
    qline c

    # 随机抽取20个考研词汇反复练习  -tag 指定单词标签（zk:中考,gk:高考,ky:考研,cet4:四级, cet6:六级,toefl:托福,ielts:雅思,vk:维克多3500词） -c 练习单词个数，缺省是10个
    qline t -tag ky -c 20
    # 随机抽取20个cet4词汇反复练习 -tag 指定单词标签（zk:中考,gk:高考,ky:考研,cet4:四级, cet6:六级,toefl:托福,ielts:雅思,vk:维克多3500词） -c 练习单词个数，缺省是10个
    qline t -tag cet4 -c 20
    # 随机抽取10个托福词汇反复练习 -tag 指定单词标签（zk:中考,gk:高考,ky:考研,cet4:四级, cet6:六级,toefl:托福,ielts:雅思,vk:维克多3500词）-c 练习单词个数，缺省是10个
    qline t -tag toefl
    # 检查语音引擎
    qline cs 
    
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