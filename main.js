const { app, BrowserWindow, protocol } = require('electron')
const path = require('path')
const fs = require('fs') // Importa el módulo fs para manejar archivos
function registerFileProtocol() {
    protocol.registerFileProtocol('app', (request, callback) => {
        const url = request.url.replace('app://', '')
        const filePath = path.join(__dirname, 'dist', url)
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Si no existe, redirige a index.html
                const indexPath = path.join(__dirname, 'dist', 'index.html')
                callback({ path: indexPath })
            } else {
                // Si existe, sirve el archivo normalmente
                callback({ path: filePath })
            }
        })
    })
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: true
      }
  })
    registerFileProtocol()
    mainWindow.loadURL('app://./index.html')
    mainWindow.webContents.openDevTools()
}
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit()})



// function registerFileProtocol() {
//     protocol.registerFileProtocol('app', (request, callback) => {
//         const url = request.url.replace('app://', '')
//         const filePath = path.join(__dirname, 'dist', url)
//         callback({ path: filePath })
//     })
// }
