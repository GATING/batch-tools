const numReg = /^\d+$/
export const testNum = str => numReg.test(str)

const wordReg = /^[a-zA-Z]+$/
export const testWord = str => wordReg.test(str)

const ordeNumReg = /(^\d+$)|(^[a-zA-Z]+$)/
export const testOrderNum = str => !ordeNumReg.test(str)
export const extReg = /(.+)(\..+)$/

const isEmpty = /^\s*$/
export const testEmpty = (...arg) => arg.some((item = '') => isEmpty.test(item))

const dotReg = /^\s*\.+\s*$/;
export const testDot = item => dotReg.test(item)