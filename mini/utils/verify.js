/**
 * 验证类
 */
module.exports = {

  /**
   * 是否为空
   */
  isEmpty(str) {
    return str.trim() == '';
  },

  /**
   * 匹配phone
   */
  isPhone(str) {
    let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
    return reg.test(str);
  },

  /**
   * 匹配Email地址
   */
  isEmail(str) {
    if (str == null || str == "") return false;
    var result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (result == null) return false;
    return true;
  },

  /**
   * 判断数值类型，包括整数和浮点数
   */
  isNumber(str) {
    if (isDouble(str) || isInteger(str)) return true;
    return false;
  },

  /**
   * 判断是否为正整数(只能输入数字[0-9])
   */
  isPositiveInteger(str) {
    return /(^[0-9]\d*$)/.test(str);
  },

  /**
   * 匹配integer
   */
  isInteger(str) {
    if (str == null || str == "") return false;
    var result = str.match(/^[-\+]?\d+$/);
    if (result == null) return false;
    return true;
  },

  /**
   * 匹配double或float
   */
  isDouble(str) {
    if (str == null || str == "") return false;
    var result = str.match(/^[-\+]?\d+(\.\d+)?$/);
    if (result == null) return false;
    return true;
  },


};