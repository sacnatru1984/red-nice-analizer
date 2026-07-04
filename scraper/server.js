import { createServer } from 'http'
import { spawn } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 7432
const CREDS_FILE = path.join(__dirname, 'credentials.json')
const EXCEL_FILE = path.join(__dirname, 'downloads', 'afiliados.xlsx')

let estado = { sincronizando: false, ultimaSync: null, error: null, progreso: '' }

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function json(res, code, data) {
  cors(res)
  res.writeHead(code, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', d => { body += d })
    req.on('end', () => resolve(body))
  })
}

function runScraper() {
  if (estado.sincronizando) return
  estado.sincronizando = true
  estado.error = null
  estado.ultimaSync = null
  estado.progreso = 'Iniciando scraper...'

  const child = spawn('node', ['scraper.js'], {
    cwd: __dirname,
    env: { ...process.env, REDNICE_SKIP_OPEN: 'true' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  child.stdout.on('data', d => {
    const line = d.toString().trim()
    estado.progreso = line
    process.stdout.write(d)
  })
  child.stderr.on('data', d => process.stderr.write(d))

  child.on('close', code => {
    if (code === 0) {
      estado.ultimaSync = new Date().toISOString()
      estado.progreso = 'Sincronización completa'
      estado.error = null
      console.log('\n✅ Scraper terminado correctamente')
    } else {
      estado.error = `Error en el scraper (código ${code}). Revisa la ventana del servidor.`
      console.log(`\n❌ Scraper terminó con código ${code}`)
    }
    estado.sincronizando = false
  })
}

const server = createServer(async (req, res) => {
  cors(res)

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  // GET /estado — estado actual de la sincronización
  if (req.url === '/estado' && req.method === 'GET') {
    return json(res, 200, estado)
  }

  // POST /credenciales — guardar credenciales del backoffice
  if (req.url === '/credenciales' && req.method === 'POST') {
    const body = await readBody(req)
    try {
      const creds = JSON.parse(body)
      if (!creds.email || !creds.password || !creds.usuario) {
        return json(res, 400, { ok: false, mensaje: 'Faltan campos: email, password, usuario' })
      }
      writeFileSync(CREDS_FILE, JSON.stringify(creds, null, 2))
      console.log(`✅ Credenciales guardadas: ${creds.email} (${creds.usuario})`)
      return json(res, 200, { ok: true })
    } catch (e) {
      return json(res, 500, { ok: false, mensaje: 'Error al guardar credenciales: ' + e.message })
    }
  }

  // POST /sincronizar — iniciar descarga de datos
  if (req.url === '/sincronizar' && req.method === 'POST') {
    if (estado.sincronizando) {
      return json(res, 200, { ok: false, mensaje: 'Ya hay una sincronización en curso' })
    }
    if (!existsSync(CREDS_FILE)) {
      return json(res, 400, { ok: false, mensaje: 'No hay credenciales guardadas. Conecta tu cuenta primero.' })
    }
    runScraper()
    return json(res, 200, { ok: true, mensaje: 'Sincronización iniciada' })
  }

  // GET /datos/afiliados.xlsx — servir el Excel descargado
  if (req.url === '/datos/afiliados.xlsx' && req.method === 'GET') {
    if (!existsSync(EXCEL_FILE)) {
      return json(res, 404, { ok: false, mensaje: 'Excel aún no descargado. Sincroniza primero.' })
    }
    cors(res)
    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'inline; filename="afiliados.xlsx"',
    })
    res.end(readFileSync(EXCEL_FILE))
    return
  }

  res.writeHead(404)
  res.end()
})

if (!existsSync(path.join(__dirname, 'downloads'))) {
  mkdirSync(path.join(__dirname, 'downloads'), { recursive: true })
}

server.listen(PORT, '127.0.0.1', () => {
  console.log('')
  console.log('  ==========================================')
  console.log('   RedNICE — Servidor Local de Sincronización')
  console.log('  ==========================================')
  console.log('')
  console.log(`  Activo en http://localhost:${PORT}`)
  console.log('  Mantén esta ventana abierta mientras usas la app.')
  console.log('  Para cerrar: presiona Ctrl+C')
  console.log('')
  if (existsSync(CREDS_FILE)) {
    const c = JSON.parse(readFileSync(CREDS_FILE, 'utf8'))
    console.log(`  Cuenta guardada: ${c.email} (${c.usuario})`)
  } else {
    console.log('  Sin credenciales — conéctate desde la app primero.')
  }
  console.log('')
})
