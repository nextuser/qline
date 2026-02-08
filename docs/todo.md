# 将生词本保存到 $HOME/.qline/new_words.db
避免发布的时候覆盖本地生词本

# 考虑增加中文词典


# 背单词的功能

##  根据中文含义，回顾单词
```shell
qline recall-by-chinese 
qline rc
````
- 显示中文含义，下面显示4个英文选项
## 显示英文含义，下面显示4 个中文含义 
```shell
qline recall-by-engilsh 
qline  re
```
## 显示中文含义，下面需要输入英文单词word，提示对错
```shell
qline fill-by-chinese 
qline  fc
```
  
### qline 根据读音默写单词
```shell
qline recall-by-pronunciation 
qline  rp
```

## qline 设置如果查询某个tag的单词，自动记录进生词本
  比如 qline save-tag  -ilts -no-gk
## qline 显示生词的时候，显示读音和含义
-finished： qline 添加生词  ok
  有序只要查询带有雅思 tag ilts，又不带gk tag 的单词，自动计入生词本
  qline q intuition # 查询单词含义
  qline list # 列出生词能查到intuition
-finished： qline 变体 使用完整ecdict数据库的例子， 是否能查更多单词，使用例子

## qline 自己增加新词，更新到ecdict数据库
## 简化输入命令， 查字典的时候，省略掉command


# 被指定领域单词
## 高考单词
```sql
select word,tag,translation from stardict where tag like '%gk%' order by random() limit 20;
```

## 大学单词 cet4
- tag 属于cet4 ，不属于高考单词
```sql
select word,tag,translation from stardict where not(tag like '%zk%') and tag like 'cet4' order by random() limit 20;
```

## 大学单词 cet6
- tag 属于cet6 ，不属于cet4
```sql
select word,tag,translation from stardict where not(tag like '%cet4%') and tag like 'cet6' order by random() limit 20;

``` 

## 考研
- 考研单词，排除高考单词
```sql
select word,tag,translation from stardict where  not(tag like '%gk%') and tag like '%ky%' order by random() limit 20;
```

#### cet6
```sql
select word,tag,translation from stardict where not(tag like '%cet4%') and tag like '%cet6%' order by random() limit 20;
```

### toefl 
```sql
select word,tag,translation from stardict where not(tag like '%cet6%')  and not(tag like '%cet4%')  and tag like '%toefl%' order by random() limit 5;
```

### gre 
```sql
select word,tag,translation from stardict where not(tag like '%cet6%') and not(tag like '%cet4%')  and tag like '%gre%' order by random() limit 5;
```


### ielts 
```sql
select word,tag,translation from stardict where not(tag like '%cet6%') and not(tag like '%cet4%') and tag like '%ielts%' order by random() limit 5;
```
## 维克多3500词
```sql
select word,tag,translation from stardict where  tag like '%vk%' order by random() limit 5;
```

# 考虑记忆曲线和背单词结合。 根据第几次记忆，生成单词的下次回顾的时间。

# 考虑单词的关联关系来背单词，找到一个单词，再找到和这个单词有关联的单词。如果这个单词没有背过，哪来作为生词背诵。

# 保存生词的时候，应该显示生词的含义
# qline command erorr 时提示帮助
:
