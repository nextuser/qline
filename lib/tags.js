// 用 Map 创建缩写-中文映射（键：英文缩写，值：中文翻译）
const tagMap = new Map([
  ['gk', '高考'],
  ['cet4', '大学英语四级'],
  ['cet6', '大学英语六级'],
  ['ky', '考研'],
  ['toefl', '托福'],
  ['gre', '美国研究生入学考试'],
  ['zk','中考'],
  ['ielts', '雅思']
]);

// 转换标签为中文（支持多标签分隔）
function convertTags(tags) {
  if (!tags) return '';
  
  //console.log('tags:',tags)
  // 分割多标签（如 "cet4,cet6,toefl" → ["cet4", "cet6", "toefl"]）
  return tags.split(' ')
    .map(tag => {
      const trimmedTag = tag.trim().toLowerCase();
      // Map.get(key)：查询键对应的 value，未找到则返回原标签
      return tagMap.get(trimmedTag) || trimmedTag.toUpperCase();
    })
    .join(','); // 用中文顿号连接结果
}

module.exports = {
  convertTags
};

