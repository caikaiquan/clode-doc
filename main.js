const {join} = require('path')
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
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
  const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl'
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
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)

    settingsWindow.on('closed', () => {
      settingsWindow = null
    })
  })
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})