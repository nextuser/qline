const {debug} = require('./log');
const DEFAULT_SCORE = 100;
const REMOVE_SORE  = 94;
class WordData {


  constructor(rowData) {
    this.word = rowData.word;
    this.tag = rowData.tag;
    this.phonetic = rowData.phonetic;
    this.translation = rowData.translation;
  }

  valueOf(){
    return this.word;
  }
  toString(){
    return `${this.word}`;
  }
}
/**
 * 单词节点类（双向链表节点）
 */
class WordNode {
  constructor(wordData, score = DEFAULT_SCORE) {
    this.wordData = wordData;    // 单词内容
    this.score = score;  // 分值（初始100）
    this.prev = null;    // 前驱节点
    this.next = null;    // 后继节点
  }
}

/**
 * 生词本类（基于双向链表实现）
 */
class WordBook {
  constructor() {
    // 哨兵节点（简化边界处理）
    this.head = new WordNode('HEAD_SENTINEL');
    this.tail = new WordNode('TAIL_SENTINEL');
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 插入节点到正确位置（按分值降序）
   * @param {WordNode} node - 待插入的节点
   */
  insertNode(node) {
    let curr = this.head;
    // 找到第一个分值 ≤ 当前节点的前驱位置
    while (curr.next !== this.tail && curr.next.score > node.score) {
      curr = curr.next;
    }
    // 双向链表插入操作
    node.prev = curr;
    node.next = curr.next;
    curr.next.prev = node;
    curr.next = node;
  }

  /**
   * 移除指定节点
   * @param {WordNode} node - 待移除的节点
   */
  removeNode(node) {
    const prevNode = node.prev;
    const nextNode = node.next;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
    // 清除节点引用（避免内存泄漏）
    node.prev = null;
    node.next = null;
  }

  /**
   * 查找单词对应的节点
   * @param {string} wordData - 目标单词
   * @returns {WordNode|null} 找到的节点或null
   */
  findWordNode(wordData) {
    let curr = this.head.next;
    while (curr !== this.tail) {
      if (curr.wordData === wordData) return curr;
      curr = curr.next;
    }
    return null;
  }

  /**
   * 添加新单词（初始分值100）
   * @param {string} wordData - 新单词
   */
  addWord(wordData) {
    if (this.findWordNode(wordData)) {

      return false;
    }
    const newNode = new WordNode(wordData);
    this.insertNode(newNode);
    return true;
  }

  addWords(words) {
    let count = 0
    words.forEach(wordData =>{
       this.addWord(wordData)
       if (this.addWord(wordData)) {
        count++;
      }
    });
    return count;
  }

  /**
   * 学习单词（更新分值并调整位置）
   * @param {string} wordData - 目标单词
   * @param {boolean} isCorrect - 是否回答正确
   */
  studyWord(wordData, isCorrect) {
    const node = this.findWordNode(wordData);
    if (!node) {
      return false;
    }

    // 更新分值
    node.score += isCorrect ? -2 : 1;

    // 先移除节点（准备重新排序）
    this.removeNode(node);

    // 分值<=REMOVE_SCORE则直接移除，否则重新插入
    if (node.score > REMOVE_SORE) {
      this.insertNode(node);
    }
    return true;
  }

  /**
   * 获取下一个要背的单词（链表头部）
   * @returns {string|null} 目标单词或null（无单词时）
   */
  getNextWord() {
    return this.head.next === this.tail ? null : this.head.next.wordData;
  }

   /**
   * 获取下一个要背的单词（链表头部）
   * @returns {string|null} 目标单词或null（无单词时）
   */
  getNextNode() {
    return this.head.next === this.tail ? null : this.head.next;
  }

  /**
   * 打印链表内容（用于测试）
   */
  print() {
    const result = [];
    let curr = this.head.next;
    while (curr !== this.tail) {
      result.push(`${curr.wordData}:${curr.score}`);
      curr = curr.next;
    }
    console.log(`链表状态：${result.join(' -> ')}`);
  }
}

module.exports = {
  WordBook,
  WordData
};
