const {join} = require('path')
const { app, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const menuTemplate = require('./src/menuTemplate.js')
const AppWindow = require('./src/AppWindow.js')


let mainWindow;
app.on('ready', () => {
  // mainWindow = new BrowserWindow({
  //   width: 1024,
  //   height: 680,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     enableRemoteModule: true
  //   }
  // })
  const mainWindowConfig = {
    width: 1440,
    height: 768
  }
  const urlLocation = isDev ? 'http://localhost:3000' : `file://${join(__dirname,'./index.html')}`
  // mainWindow.loadURL(urlLocation)

  mainWindow = new AppWindow(mainWindowConfig, urlLocation)
  mainWindow.on('closed',() => {
    mainWindow = null
  })
  // hook up main events
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow
    }
    const settingsFileLocation = `file://${join(__dirname,'./settings/settings.html')}`
    let settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)

    settingsWindow.on('closed', () => {
      settingsWindow = null
    })
  })

  // 同步至云端
  ipcMain.on('upload-all-to-github', () => {
    console.log('自动同步至云端')
  })

  // 从云端下载到本地
  ipcMain.on('download-all-from-github', () => {
    console.log('从云端下载到本地')
  })

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})