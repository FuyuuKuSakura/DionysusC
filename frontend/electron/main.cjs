const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs')

const PROJECT_ROOT = path.resolve(__dirname, '..', '..')
const BACKEND_DIR = path.join(PROJECT_ROOT, 'backend')
const FRONTEND_DIST = path.join(PROJECT_ROOT, 'frontend', 'dist')
const PYTHON = path.join(BACKEND_DIR, '.venv', 'bin', 'python')

let mainWindow = null
let backendProcess = null

function waitForBackend(url, timeoutMs = 30000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = () => {
      fetch(url)
        .then((res) => {
          if (res.ok) {
            resolve()
          } else {
            throw new Error('not ok')
          }
        })
        .catch(() => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error('Backend failed to start'))
          } else {
            setTimeout(check, 300)
          }
        })
    }
    check()
  })
}

function startBackend() {
  if (!fs.existsSync(PYTHON)) {
    throw new Error(`Python venv not found at ${PYTHON}`)
  }

  const env = {
    ...process.env,
    Dionysus_server__static_dir: FRONTEND_DIST,
    Dionysus_server__host: '127.0.0.1',
    Dionysus_server__port: '8765',
  }

  backendProcess = spawn(
    PYTHON,
    ['-m', 'uvicorn', 'dionysus_server.main:app', '--host', '127.0.0.1', '--port', '8765'],
    {
      cwd: BACKEND_DIR,
      env,
      stdio: 'inherit',
    }
  )

  backendProcess.on('error', (err) => {
    console.error('Backend process error:', err)
  })
}

function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill('SIGTERM')
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.loadURL('http://127.0.0.1:8765')

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  try {
    startBackend()
    await waitForBackend('http://127.0.0.1:8765/api/server/info')
    createWindow()
  } catch (err) {
    console.error('Failed to start Dionysus:', err)
    app.quit()
  }
})

app.on('window-all-closed', () => {
  stopBackend()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', () => {
  stopBackend()
})
