import { promises, existsSync } from "fs"
import { parse, dirname } from 'path'
const { rename, writeFile, mkdir, copyFile } = promises
import utimes from '@ronomon/utimes'

const utimesPromise = (path, btime, mtime, atime) => new Promise((resolve, reject) => {
    utimes(path, btime, mtime, atime, (err) => (err ? reject(err) : resolve()));
})


/**
 * 批量创建空白文件或文件夹
 * @param { string[] } paths => 创建的文件路径
 * @param { boolean } isFiles => 是否创建文件
 */
export async function createFilesOrFolders(paths, isFile = true) {
    for (let i = 0, len = paths.length; i < len; i++) {
        let { path } = paths[i]
        await confirmPath(path, isFile)
    }
}

export const currentPath = path => {
    if (!existsSync(path)) {
        return path;
    }
    const { dir, name, ext } = parse(path)
    return currentPath(`${dir}\\${name}(01)${ext}`)
}

/**
 * 判断文件是否存在， 存在则创建 `${filename}(01)` 以此类推
 * @param { string } path => 文件的绝对路径
 * @param { boolean } isFile => 是否创建文件
 */
export async function confirmPath(path, isFile) {
    path = currentPath(path)
    try {
        isFile ? await mkdir(path) : await writeFile(path, '')
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err)
    }

}


/**
 * 批量创建空白文件或文件夹
 * @param { string[] } oldPaths => 创建的文件路径
 * @param { string[] } newPaths => 创建的文件路径
 * @param { boolean } isFiles => 是否创建文件
 */
export async function renameFiles(oldPaths, newPaths) {
    try {
        for (let i = 0, len = oldPaths.length; i < len; i++) {
            let { path: oldPath } = oldPaths[i]
            let newPath = currentPath(newPaths[i].path)
            if (dirname(oldPath) === dirname(newPath)) {
                await rename(oldPath, newPath)
            } else {
                await copyFile(oldPath, newPath)
            }
        }
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err)
    }
}


/**
 * 修改文件的访问时间和修改时间
 * @param { Array } paths => 创建的文件路径 
 * @param { number[] | string[] | Date[] } ...arg => 单位是秒
 *  btime => 创建时间，原生node不支持，需要借助其他的库
 *  atime => 访问时间
 *  mtime => 修改时间
 */
export async function modifyFileTime(paths, ...arg) {
    try {
        for (let i = 0, len = paths.length; i < len; i++) {
            let { path } = paths[i]
            await utimesPromise(path, ...arg)
        }
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err)
    }
}