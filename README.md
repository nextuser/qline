# 1 简介：
## 1.1 功能介绍
这是通过命令行查询单词 ，记录生词本 的简单工具， 目前为了限制软件尺寸，只提供前2万个常用单词的查询。

## 1.2 安装
### 1.2.1 安装nodejs npm
[nodejs 下载安装方法](https://nodejs.org/zh-cn/download)



### 1.2.2 安装qline
```shell
 # 由于qline文件比较大，首次安装可能会比较慢， 最新版本在mirror站点未必有更新
 # 可以先设置npm registry 为官方站点， 再安装最新版本
 npm config set registry https://registry.npmjs.org/
 npm i -g qline@latest

```


## 1.2.3 如果安装下载有问题，建议如此处理
 - 原因，因为qline 依赖的cdict_query 模块 比较大，首次安装可能会比较慢， 最新版本在mirror站点未必有更新
 - 有些人的本地设置了proxy，导致下载失败，可以自行下面脚本来下载
```shell
npm config set registry https://registry.npmjs.org/
unset https_proxy
unset http_proxy
unset all_proxyq
unset HTTPS_PROXY
unset HTTP_PROXY
unset ALL_PROXY
npm i -g qline@latest
```

# 2 功能
## 2.1 查询
### 2.1.1 查询单词
```shell
# 查询单词   qline q <word>

$ qline q ownership

【ownership】 'әunәʃip
释义：
  1. n. 所有权, 物主身份
[经] 所有权, 所有制
词频：BNC 2672 | FRQ 3585
变形：s:ownerships
标签：高考,大学英语四级,大学英语六级,考研,雅思
```

### 2.1.2 查询词组 短语 
```shell
$ qline q 'work around'
【work around】
释义：
  1. [网络] 绕过；来绕开；绕个弯解决
```
## 2.2 记录生词
```shell
# 不输入参数的时候，记录上次查询的单词
$ qline s
 
$ qline s ownership

```


## 2.3 查看生词列表
```shell
$ qline list

```

## 2.4 回忆生词  
- 随机从生词本中抽取一个单词
```shell

$ qline r

📖 请回忆单词：ownership
按回车查看释义...

```

## 2.5 删除生词
```shell
qline d ownership
```


# 3 开发调试
## 3.1 下载代码
```
git clone git@github.com:nextuser/qline.git
cd qline
npm install

```

## 3.2 执行代码
```shell
$ node  bin/index.js q china
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`

【China】 'tʃainә
释义：
  1. n. 中国, 瓷器
a. 中国的
词频：BNC 1973 | FRQ 7946
变形：s:chinas
标签：中考,高考
```

# 4. 使用示例：
```shell
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
    # 清空生词本
    qline c

    # 测试考验词汇
    qline t -tag ky -c 20
    # 测试cet4 词汇
    qline t -tag cet4 -c 20
    # 测试托福词汇
    qlin t -tag toefl
    
```

