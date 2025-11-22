# 1 简介：
## 1.1 功能介绍
这是通过命令行查询单词 ，记录生词本 的简单工具， 目前为了限制软件尺寸，只提供前2万个常用单词的查询。

## 1.2 安装
### 1.2.1 安装nodejs npm
[nodejs 下载安装方法](https://nodejs.org/zh-cn/download)

### 1.2.2 安装qline
```shell
npm i -g qline
```

# 2 功能
## 2.1 查询单词
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