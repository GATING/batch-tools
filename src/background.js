'use strict'

import { app, protocol, BrowserWindow, dialog } from 'electron'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
// import { autoUpdater } from 'electron-updater'
// const { resolve } = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1600,
        height: 900,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => {
        win = null
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    // if (isDevelopment) {
    //     autoUpdater.updateConfigPath = resolve(__dirname, '../dev-app-update.yml')
    // }
    // autoUpdater.autoDownload = false
    // autoUpdater.checkForUpdates()
    // autoUpdater.on('error', err => {
    //     dialog.showErrorBox('更新失败', err == null ? "未知" : err.stack)
    // })

    // autoUpdater.on('checking-for-update', () => {
    //     console.log('检查更新')
    // })

    // autoUpdater.on('download-progress', (progress) => {
    //     let log_message = "Download speed: " + progressObj.bytesPerSecond;
    //     log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    //     log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    //     console.log(log_message)
    // })
    // autoUpdater.on('update-available', () => {
    //     dialog.showMessageBox({
    //         type: 'info',
    //         title: '应用有新的版本',
    //         message: '发现新版本，是否更新',
    //         buttons: ['是', '否']
    //     }, (buttonIndex) => {
    //         if (buttonIndex === 0) {
    //             autoUpdater.downloadUpdate()
    //         }
    //     })
    // })

    // autoUpdater.on('update-downloaded', () => {
    //     dialog.showMessageBox({
    //         title: '安装更新',
    //         message: '更新下载完成,应用将重启并进行安装',
    //         buttons: ['是', '否']
    //     }, () => {
    //         setImmediate(() => autoUpdater.quitAndInstall())
    //     })
    // })

    // autoUpdater.on('update-not-available', () => {
    //     dialog.showMessageBox({
    //         title: '没有新版本',
    //         message: '当前已经是最新版本啦'
    //     })
    // })

    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        // Devtools extensions are broken in Electron 6.0.0 and greater
        // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
        // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
        // If you are not using Windows 10 dark mode, you may uncomment these lines
        // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
        // try {
        //   await installVueDevtools()
        // } catch (e) {
        //   console.error('Vue Devtools failed to install:', e.toString())
        // }

    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}