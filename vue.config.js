module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "appId": "gatings.cn",
                "productName": "batch-tools", //项目名，也是生成的安装文件名，即aDemo.exe
                "copyright": "Copyright © 2020 by gating", //版权信息
                "publish": [{
                    provider: 'github',
                    owner: 'GATING',
                    repo: 'batch-tools',
                    releaseType: 'draft'
                }],
                "asar": false,
                dmg: {
                    contents: [{
                        x: 410,
                        y: 150,
                        type: 'link',
                        path: '/Applications'
                    },
                    {
                        x: 130,
                        y: 150,
                        type: 'file'
                    }
                    ]
                },
                mac: {
                    extendInfo: {
                        LSUIElement: 1
                    }
                },
                win: {
                    target: 'nsis',
                },
                nsis: {
                    shortcutName: 'batch-tools',
                    oneClick: false,
                    allowToChangeInstallationDirectory: true
                },
                snap: {
                    publish: ['github']
                }
            },
            externals: ["sharp"]
        }
    }
    // chainWebpack: config => {
    //     let externals = config.store.get("externals")
    //     externals = { ...externals, sharp: 'require("sharp")' }
    //     config.store.set("externals", externals)
    // }
}