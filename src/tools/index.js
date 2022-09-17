/**
 * 生成一个整数数组
 * @param  {...number} arg => 包含三个参数 start stop step
 *  start: 计数从 start 开始。默认是从 0 开始。
 *  stop: 计数到 stop 结束，但不包括 stop。
 *  step: 步长，默认为1。
 * @return {number[]} 返回一个整数数组
 */
export const range = (...arg) => {
  let [start = 0, stop, step = 1] = arg;
  // 如果没有 stop 参数 则返回 start 长度的数组
  if (Number.isNaN(Number(stop))) {
    start = start < 0 ? 0 : start;
    return [...Array(start).keys()];
  } else {
    if (Math.abs(stop) <= Math.abs(start)) return [];
    let len = Math.abs(Math.ceil((stop - start) / step));
    return [...Array(len).keys()].map((i) => (i + start) * step);
  }
};

/**
 * 判断是不是大写字母
 * @param { string } word => 字母
 * @return { boolean } 返回是否大写字母
 */
export const isUpper = (word) => {
  return /^[A-Z]$/.test(word[0]);
};

/**
 * 字符串转大小写
 * @param { string } str
 * @param { boolean } isUpper
 * @return { string } 返回转换后的字符串
 */
export const toUpperOrLower = (str, isUpper) => {
  return isUpper ? str.toLocaleUpperCase() : str.toLocaleLowerCase();
};

/**
 * 进制转换
 * @param { array } arr => 转换的编码
 * @param { number } num => 转换的值
 * @param { number } len => 进制数
 * @return { string } 返回转换后的字符串
 */
export const convert = (num, len) => {
  if (len === 10) return num;
  let arr = convertObj[len];
  let word = "";
  while (num > 0) {
    num--;
    word = arr[num % len] + word;
    num = ~~(num / len);
  }
  return word;
};

// 生成进制数
export const convertObj = {
  26: range(26).map((i) => String.fromCharCode(65 + i)),
};
