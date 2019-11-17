import { app, BrowserWindow, ipcMain } from 'electron'
var shell = require('shelljs')
var fs = require('fs')
import findIconPaths from './find_icon_paths'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

var mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
var appCommands = {}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    // frame: false,
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })




  mainWindow.webContents.on('did-finish-load', () => {

    // shell.exec('wmctrl -a "electron-desktop" -b add,maximized_vert,maximized_horz', {async: true})
    // shell.exec('wmctrl -a "electron-desktop" -b add,below', {async: true})

    fs.readFile('/home/kevin/.kiora/gradients.json', (err, data) => {
      if (err) return;

      mainWindow.webContents.send('gradients', JSON.parse(data.toString('utf8')))
    });

    fs.readdir('/usr/share/applications', (err, filenames) => {
      // console.log(mainWindow);


      for (let filename of filenames) {
        // console.log(filename)
        fs.readFile('/usr/share/applications/' + filename, (err, data) => {

          if (data && data.toString) {
            let desktopEntryLines = data.toString('utf8').split(/\r?\n/)

            appCommands[filename] = {}
            for (let line of desktopEntryLines) {

              let [property, value] = line.split('=')
              if  (property) {

                if (property.indexOf('[Desktop Action') >= 0) break;

                if (property.trim().toLowerCase() == 'exec') {
                  if (value) appCommands[filename].exec = value
                }
                if (property.trim().toLowerCase() == 'nodisplay') {
                  if (value) appCommands[filename].hidden = Boolean(value)
                }
                if (property.trim().toLowerCase() == 'name') {
                  if (value) appCommands[filename].name = value
                }
                if (property.trim().toLowerCase() == 'icon') {
                  if (value) appCommands[filename].icon = value
                }
              }
            }
          }

          let iconLocations = findIconPaths()
          // console.log(iconLocations)

          const iconExtensions = [
            'svg',
            'png'
          ];

          // for (let appCommandKey in appCommands) {
            let appDescription = appCommands[filename]
            if (appDescription && appDescription.icon) {

              for (let iconLocation of iconLocations) {
                for (let ext of iconExtensions) {
                  fs.readFile(iconLocation+'/'+appDescription.icon+'.'+ext, (err,data) => {
                    if (err) return;

                    mainWindow.webContents.send('icon', {
                      app: filename,
                      data: data,
                      ext: ext
                    })

                  });
                }


                // console.log(iconLocation)
              }
            // }
          }

          mainWindow.webContents.send('desktopentries', appCommands)
        })
      }
    })


  })


}

function createSearchWindow(searchQuery) {
  let searchWindow = new BrowserWindow({
    // frame: false,
    height: 563,
    width: 1000
  })

  searchWindow.loadURL('https://duckduckgo.com/?q='+searchQuery)

  searchWindow.on('closed', () => {
    searchWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('open:konsole', (e, item) => {
  shell.exec('konsole',{async:true})
})

ipcMain.on('open:filezilla', (e, item) => {
  shell.exec('filezilla',{async:true})
})

ipcMain.on('open:app', (e, appname) => {

  let exec = appCommands[appname].exec.replace('%f','').replace('%F','').replace('%u','').replace('%U','').replace('%i','').replace('%c','').replace('%k','')
  shell.exec(exec,{async:true})
})

ipcMain.on('websearch', (e, query) => {
  createSearchWindow(query);
  // shell.exec('chromium-browser app=https://duckduckgo.com/?q='+query,{async:true})
})

ipcMain.on('shutdown', (e, appname) => {
  shell.exec('shutdown -h now',{async:true})
})



/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
