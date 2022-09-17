import { testNum, testWord, testOrderNum, extReg, testDot } from './regexp'
import { isUpper, convertObj, toUpperOrLower, convert } from './index'

export const getNewFiles = (fileExt, fileList, enable, fileSettings, sourcePath) => {
    // 根据规则生成文件后缀序号
    const {
        filename: { value: newFilename },
        orderNum: { value: orderNum },
        increment: { value: increment },
        preReplaceWord,
        replaceWord
    } = fileSettings

    if(testDot(newFilename)) {
        return []
    }
    /**
     * start => 表示起始序号
     * padNum => 序号的补位字符
     * rangeLen => 进制数，数字为10进制，字母为26进制
     * len => 补多少位
     */
    let len = orderNum.length,
        preReplaceWordStr = '',
        replaceWordStr = '',
        isUpperWord = isUpper(orderNum)

    if(preReplaceWord) {
        preReplaceWordStr = preReplaceWord.value
        replaceWordStr = replaceWord.value
    }

    // 如果不符合
    if(testOrderNum(orderNum) && orderNum) {
        return fileList
    }
    let { start, padNum, rangeLen } = getOptions(orderNum, len, isUpperWord)


    // 获取文件修改的后缀名
    const [oldExt, newExt] = getFileExt(fileExt);

    return fileList.map(item => {
        let [filename, fileExt] = splitFilename(item.name);
        filename = newFilename ? newFilename : filename
        const suffix = toUpperOrLower((convert(start, rangeLen) + '').padStart(len, padNum), isUpperWord)
        filename += suffix
        start += increment
        
        return getFile(fileExt, filename, item, oldExt, newExt, enable, sourcePath)
    });
}

export const getFile = (fileExt, filename, item, oldExt, newExt, enable, sourcePath) => {
    fileExt = getNewFileExt(fileExt, oldExt, newExt, enable)
    const name = [filename, fileExt].join("");
    let path = item.path.replace(new RegExp(`(.*)${item.name}`), `$1${name}`)
    if(sourcePath) {
        path = `${sourcePath}\\${name}`
    }
    return {
        ...item,
        path,
        name
    }
}

export const getFileExt = (fileExt) => fileExt.map(i => i ? (i.startsWith('.') || i === '*' ? i : '.' + i) : '')

const getNewFileExt = (fileExt, oldExt, newExt, enable) => {
    if((oldExt === '*' || fileExt === oldExt) && enable) {
        return newExt;
    } else {
        return fileExt
    }
}

export const splitFilename = (filename, preReplaceWordStr = "", replaceWordStr = "") => {
    return filename.replace(extReg, "$1,$2")
        .replace(preReplaceWordStr, replaceWordStr)
        .split(",")
}

export const getOptions = (orderNum, len, isUpperWord) => {
    let start, padNum, rangeLen
    if(testNum(orderNum)) {
        start = ~~orderNum
        padNum = '0'
        rangeLen = 10
    } else if(testWord(orderNum)) {
        // 如果是字母,判断补位是大写字母 A，还是小写字母 a
        isUpperWord ? padNum = 'A' : padNum = 'a'
        const rangeNums = convertObj["26"]
        // 根据26进制，字母转数字
        // 运算规则：
        // eg: baa = 26**2*2 + 26**1*1+ 26**0*1
        start = [...orderNum].reduce((res, val, idx) => (res + indexOf(rangeNums, val, len - 1 - idx)), 0)
        rangeLen = 26
    }

    return {
        start,
        padNum,
        rangeLen
    }
}

export const getFileList = (fileList, oldFiles) => {
    const resFiles = [];
    fileList.forEach(file => {
        let isNew = oldFiles.every(old => old.name !== file.name);
        if(isNew) {
            resFiles.push(file);
        }
    })
    return [...oldFiles, ...resFiles];
}

/**
 * 计算第n位26进制数的十进制值
 * @param {*} rangeNums => 26进制数组
 * @param {*} val => 当前值
 * @param {*} idx => 当前的位置
 * @returns { number } 第n位26进制数的十进制值
 */
function indexOf(rangeNums, val, idx) {
    let word = rangeNums.indexOf(val.toLocaleUpperCase())
    return word === -1 ? 0 : (word + 1) * (26 ** idx)
}