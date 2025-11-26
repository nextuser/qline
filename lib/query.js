//# 高考单词
const gkQuery = `
select word,tag,translation from stardict where tag like '%gk%' order by random() limit ${n};
`

//#//# 大学单词 cet4
// tag 属于cet4 ，不属于高考单词
const cet4Query = `
select word,tag,translation from stardict where not(tag like '%zk%') and tag like 'cet4' order by random() limit ${n};
`

//#//# 大学单词 cet6
// tag 属于cet6 ，不属于cet4
const cet6Query = `
select word,tag,translation from stardict where not(tag like '%cet4%') and tag like 'cet6' order by random() limit ${n};
`


//#//# 考研
//- 考研单词，排除高考单词
const kyQuery =
`
select word,tag,translation from stardict where  not(tag like '%gk%') and tag like '%ky%' order by random() limit ${n};
`

//#//#//# toffel 
const toffelQuery = `
select word,tag,translation from stardict where not(tag like '%cet6%')  and not(tag like '%cet4%')  and tag like '%toefl%' order by random() limit ${n};
`

//#//#//# gre 
const greQuery = `
select word,tag,translation from stardict where not(tag like '%cet6%') and not(tag like '%cet4%')  and tag like '%gre%' order by random() limit ${n};
`


//#//#//# ielts 
const ieltsQuery = `
select word,tag,translation from stardict where not(tag like '%cet6%') and not(tag like '%cet4%') and tag like '%ielts%' order by random() limit ${n};
`
module.exports = {
  gkQuery,
  cet4Query,
  cet6Query,
  kyQuery,
  toffelQuery,
  greQuery,
  ieltsQuery,
}