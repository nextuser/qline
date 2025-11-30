// __tests__/unit/tags.test.js
const { expect } = require('chai');
const { convertTags } = require('../../lib/tags');

describe('tags.js', () => {
  describe('convertTags()', () => {
    it('应该转换单个标签', () => {
      expect(convertTags('gk')).to.equal('高考');
    });

    it('应该转换多个标签', () => {
      expect(convertTags('gk cet4')).to.equal('高考,大学英语四级');
    });

    it('应该处理未知标签', () => {
      expect(convertTags('unknown')).to.equal('UNKNOWN');
    });

    it('应该处理空输入', () => {
      expect(convertTags('')).to.equal('');
      expect(convertTags(null)).to.equal('');
    });
  });
});