# stardict 
## 下载
[stardict](https://github.com/skywind3000/ECDICT/releases/download/1.0.28/ecdict-sqlite-28.zip)
解压之后又800MB
## 精简VACUUM
```shell
# 1. 进入 SQLite 命令行（需安装 sqlite3 工具）
sqlite3 my_database.db

# 2. 执行 VACUUM 命令（需等待，视文件大小而定）
VACUUM;

# 3. 退出
.quit
```

# 下载之后的stardict文件太大，需要精简一下, 提取部分内容
## 现有数据库中的表格stardict 结构

```sqlite
.schema stardict
CREATE TABLE IF NOT EXISTS "stardict" (
"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
"word" VARCHAR(64) COLLATE NOCASE NOT NULL UNIQUE,
"sw" VARCHAR(64) COLLATE NOCASE NOT NULL,
"phonetic" VARCHAR(64),
"translation" TEXT,
"pos" VARCHAR(16),
"collins" INTEGER DEFAULT(0),
"oxford" INTEGER DEFAULT(0),
"tag" VARCHAR(64),
"bnc" INTEGER DEFAULT(NULL),
"frq" INTEGER DEFAULT(NULL),
"exchange" TEXT,
"detail" TEXT,
"audio" TEXT
);
CREATE UNIQUE INDEX "stardict_1" ON stardict (id);
CREATE UNIQUE INDEX "stardict_2" ON stardict (word);
CREATE INDEX "stardict_3" ON stardict (sw, word collate nocase);
CREATE INDEX "sd_1" ON stardict (word collate nocase);
```
## table 字段描述
| 字段        | 解释                                                       |
| ----------- | ---------------------------------------------------------- |
| word        | 单词名称                                                   |
| phonetic    | 音标，以英语英标为主                                       |
| translation | 单词释义（中文），每行一个释义                             |
| pos         | 词语位置，用 "/" 分割不同位置                              |
| collins     | 柯林斯星级                                                 |
| oxford      | 是否是牛津三千核心词汇                                     |
| tag         | 字符串标签：zk/中考，gk/高考，cet4/四级 等等标签，空格分割 |
| bnc         | 英国国家语料库词频顺序                                     |
| frq         | 当代语料库词频顺序                                         |
| exchange    | 时态复数等变换，使用 "/" 分割不同项目，见后面表格          |
| detail      | json 扩展信息，字典形式保存例句（待添加）                  |
| audio       | 读音音频 url （待添加）                                    |


## 简化后的表格


```sql
CREATE TABLE IF NOT EXISTS "stardict" (
"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
"word" VARCHAR(64) COLLATE NOCASE NOT NULL UNIQUE,
"phonetic" VARCHAR(64),
"translation" TEXT,
"tag" VARCHAR(64),
"bnc" INTEGER DEFAULT(NULL),
"frq" INTEGER DEFAULT(NULL),
"exchange" TEXT,
);
CREATE UNIQUE INDEX "stardict_1" ON stardict (id);
CREATE UNIQUE INDEX "stardict_2" ON stardict (word);
CREATE INDEX "stardict_3" ON stardict (sw, word collate nocase);
CREATE INDEX "sd_1" ON stardict (word collate nocase);
```

## 查询部分字段 ,提取stardict 的部分字段
```sql
select id, word,phonetic,translation,tag,frq,bnc, exchange  from stardict where (frq !=0 and frq < 9000) or (bnc != 0 and bnc < 9000) and sw <> word;

select id, word,phonetic,translation,tag,frq,bnc, exchange from stardict
where (frq !=0 and frq < 9000) or (bnc != 0 and bnc < 9000) and sw <> word limit 20;
```

## 随机查询多条数据
```sql
select * from cdict order by random() limit 10;
```