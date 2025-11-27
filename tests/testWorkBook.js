const {WordBook,WordData} = require('../lib/wordBook');
// ------------------------------ 测试代码 ------------------------------
console.log('=== 初始化生词本 ===');
const vocabBook = new WordBook();

console.log('\n=== 添加单词（apple/banana/orange） ===');
vocabBook.addWord(new WordData({word:'apple'}));
vocabBook.addWord(new WordData({word:'banana'}));
vocabBook.addWord('orange');
vocabBook.print(); // 分值相同，后添加的排在前面：orange:100 -> banana:100 -> apple:100

console.log('\n=== 学习apple（正确） ===');
vocabBook.studyWord(new WordData({word:'apple'}), true); // apple分值99
vocabBook.print(); // orange:100 -> banana:100 -> apple:99

console.log('\n=== 学习apple（正确×4，分值95） ===');
vocabBook.studyWord(new WordData({word:'apple'}), true); // 98
vocabBook.studyWord(new WordData({word:'apple'}), true); // 97
vocabBook.studyWord(new WordData({word:'apple'}), true); // 96
vocabBook.studyWord(new WordData({word:'apple'}), true); // 95
vocabBook.print(); // orange:100 -> banana:100 -> apple:95

console.log('\n=== 学习apple（正确×1，分值94，移除） ===');
vocabBook.studyWord(new WordData({word:'apple'}), true); // 94<95，移除
vocabBook.print(); // orange:100 -> banana:100

console.log('\n=== 学习banana（错误，分值101） ===');
vocabBook.studyWord(new WordData({word:'banana'}), false); // 101
vocabBook.print(); // banana:101 -> orange:100

console.log('\n=== 获取下一个要背的单词 ===');
console.log('下一个单词：', vocabBook.getNextWord()); // banana

vocabBook.addWords([new WordData({word:'peach'}), new WordData({word:'grape'})]);
vocabBook.print(); // banana:101 -> orange:100 -> grape:100 -> peach:100