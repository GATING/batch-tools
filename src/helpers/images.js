import sharp from 'sharp'
import imagemin from 'imagemin';
import { splitFilename, getFile, getFileExt } from '@/tools/file'
import { currentPath } from './file'
// 额外的
const extPlugins = (quality) => {
    const imageminSvgo = require('imagemin-svgo')
    const imageminGifsicle = require('imagemin-gifsicle')
    return [
        imageminSvgo({
            plugins: [
                { removeViewBox: false }
            ]
        }),
        imageminGifsicle({
            optimizationLevel: 2 / 100 * quality + 1
        })
    ]
}

// 无损插件
const losslessPlugins = (quality) => {

    // 无损压缩插件
    const imageminJpegtran = require('imagemin-jpegtran')
    const imageminOptipng = require('imagemin-optipng')

    return [
        imageminJpegtran(),
        imageminOptipng({
            optimizationLevel: ~~(7 / 100 * quality)
        }),
        ...extPlugins(quality)
    ]
}


// 有损插件
const LossyPlugins = (quality) => {
    // 有损压缩插件
    const imageminMozjpeg = require('imagemin-mozjpeg')
    const imageminPngquant = require('imagemin-pngquant')
    return [
        imageminMozjpeg({
            quality
        }),
        imageminPngquant({
            quality: generateQualityArr(quality)
        }),
        ...extPlugins(quality)
    ]
}

function generateQualityArr(quality) {
    quality = quality / 100
    let min = quality - 0.1
    let max = quality + 0.1
    return [min < 0 ? 0 : min, max > 1 ? 1 : max]
}
export async function compress(paths, quality, isLossy, destination) {
    let plugins = isLossy ? LossyPlugins(quality) : losslessPlugins(quality)
    let sourcePaths = getPath(paths)



    try {
        for (let i = 0, len = paths.length; i < len; i++) {
            let path = sourcePaths[i]
            console.log(123, getDestination(paths[i], destination));
            await imagemin([path], {
                destination: getDestination(paths[i], destination),
                plugins
            })
            console.log(123);

        }
        return Promise.resolve()
    } catch (err) {
        console.log(err);
        return Promise.reject(err)

    }
}

function getDestination(pathObj, destination) {
    const { path, name } = pathObj
    let output = path.replace(new RegExp(`(.*)${name}`), "$1").slice(0, -1)
    return destination ? replacePath(destination) : replacePath(output)
}

function getPath(paths) {
    // window 问题 \\ 要转成 / 才能识别
    return paths.map(i => replacePath(i.path))
}


function replacePath(path) {
    return path.replace(/\\/g, "/")
}

export function getImagesList(paths, sourcePath, fileExt, enable) {
    const [oldExt, newExt] = getFileExt(fileExt);
    return paths.map(item => {
        let [filename, fileExt] = splitFilename(item.name);
        return getFile(fileExt, filename, item, oldExt, newExt, enable, sourcePath)
    })

}

// // 无损
// export async function lossless(paths, quality, isCover) {
//     let destination = isCover ? paths : paths
//     return imagemin(paths, {
//         destination,
//         plugins: losslessPlugins(quality)
//     })
// }

// // 有损
// export async function lossy(paths, isCover) {
//     let destination = isCover ? paths : paths
//     return imagemin(paths, {
//         destination,
//         plugins: LossyPlugins(quality)
//     })
// }


// 批量修改尺寸
export async function resize(oldFiles, newFiles, diyArr) {
    let resizeOptions = diyArr.filter(i => ~~i)
    oldFiles = getPath(oldFiles)
    newFiles = getPath(newFiles)
    try {
        for (let i = 0, len = oldFiles.length; i < len; i++) {
            let oldPath = oldFiles[i]
            let newPath = currentPath(newFiles[i])
            await sharp(oldPath).resize(...resizeOptions).toFile(newPath)

        }
        return Promise.resolve()
    } catch (err) {
        console.log(err);
        return Promise.reject(err)

    }
}