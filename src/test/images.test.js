const { resolve } = require('path');
const imagemin = require('imagemin');
// 无损压缩插件
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminGifsicle = require('imagemin-gifsicle');


// 有损压缩插件
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

// 额外的
const extPlugins = (quality) => [
    imageminSvgo({
        plugins: [
            { removeViewBox: false }
        ]
    }),
    imageminGifsicle({
        optimizationLevel: 2 / 100 * quality + 1
    })
]

// 无损插件
const losslessPlugins = (quality) => [
    imageminJpegtran(),
    imageminOptipng({
        optimizationLevel: ~~(7 / 100 * quality)
    }),

    ...extPlugins(quality)
]

// 有损插件
const LossyPlugins = (quality) => [
    imageminMozjpeg({
        quality
    }),
    imageminPngquant({
        quality: generateQualityArr(quality)
    }),
    ...extPlugins(quality)
]

function generateQualityArr(quality) {
    quality = quality / 100
    let min = quality - 0.1
    let max = quality + 0.1
    return [min < 0 ? 0 : min, max > 1 ? 1 : max]
}


async function compress(paths, quality, isLossy, destination) {

    return await imagemin(paths, {
        destination: destination.replace(/\\/g, "/"),
        plugins: isLossy ? LossyPlugins(quality) : losslessPlugins(quality)
    })
}

function getPath(paths) {
    return paths.map(i => i.path.replace(/\\/g, "/"))
}

let paths = ["./256.png"];
// paths = getPath(paths);
(async function () {
    try {
        let files = await compress(paths, 70, true, "C:/Users/gating/Desktop/test")
        console.log(paths, files)

    } catch (err) {
        console.log(err)
    }
})()