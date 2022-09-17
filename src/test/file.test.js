const { promises, constants, existsSync } = require('fs')
const { resolve, parse, dirname, name, extname } = require('path')
const { writeFile, mkdir } = promises
async function confirmPath(path, isFile) {
    if (!existsSync(path)) {
        try {
            isFile ? await writeFile(path, '') : await mkdir(path)
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err)
        }
    }
    const { dir, name, ext } = parse(path)
    return confirmPath(`${dir}\\${name}(01)${ext}`)
}


(async () => {

    // let path = resolve(__dirname, './aaa')
    // await confirmPath(path)

})()