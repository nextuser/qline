//# 高考单词
const gkQuery = "select * from stardict where tag like '%gk%' order by random() limit ${0};"

//中考单词
const zkQuery = "select * from stardict where tag like '%gk%' order by random() limit ${0};"

//#//# 大学单词 cet4
// tag 属于cet4 ，不属于高考单词
const cet4Query = "select * from stardict where not(tag like '%zk%') and tag like 'cet4' order by random() limit ${0};"

//#//# 大学单词 cet6
// tag 属于cet6 ，不属于cet4
const cet6Query = "select * from stardict where not(tag like '%cet4%') and tag like 'cet6' order by random() limit ${0};"


//#//# 考研
//- 考研单词，排除高考单词
const kyQuery ="select * from stardict where  not(tag like '%gk%') and tag like '%ky%' order by random() limit ${0};"

//#//#//# toffel 
const toffelQuery = "select * from stardict where not(tag like '%cet6%')  and not(tag like '%cet4%')  and tag like '%toefl%' order by random() limit ${0};"

//#//#//# gre 
const greQuery = "select * from stardict where not(tag like '%cet6%') and not(tag like '%cet4%')  and tag like '%gre%' order by random() limit ${0};"


//#//#//# ielts 
const ieltsQuery = "select * from stardict where not(tag like '%cet6%') and not(tag like '%cet4%') and tag like '%ielts%' order by random() limit ${0};"

const tags = ['zk','gk','cet4','cet6','ky','toffel','gre','ielts'];

const tagQueryMap = {
  "zk" : zkQuery,
  "gk" : gkQuery,
  "cet4" : cet4Query,
  "cet6" : cet6Query,
  "ky" : kyQuery,
  "toffel" : toffelQuery,
  "gre" : greQuery,
  "ielts": ieltsQuery

}

function getTagQuery(tag,count = 1) {
  const queryTemplate =  tagQueryMap[tag];
  if(queryTemplate && typeof(count) == 'number'){
     return queryTemplate.replace("${0}", count)
  }
  return undefined;
} 

function test_query(){  
  console.log(getTagQuery('cet6',1))
}

module.exports = {
  getTagQuery,
  tags
};