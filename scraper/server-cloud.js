import { chromium } from 'playwright'
import { createServer } from 'http'
import { randomBytes } from 'crypto'

const PORT = process.env.PORT || 3000

// Jobs en memoria: Map<jobId, { status, excel, error, progreso, createdAt }>
const jobs = new Map()

// Limpiar jobs viejos cada 5 minutos
setInterval(() => {
  const limite = Date.now() - 15 * 60 * 1000
  for (const [id, job] of jobs) {
    if (job.createdAt < limite) jobs.delete(id)
  }
}, 5 * 60 * 1000)

async function ejecutarSync(jobId, { email, password, usuario }) {
  const job = jobs.get(jobId)
  let browser

  try {
    job.progreso = 'Abriendo navegador...'
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    job.progreso = 'Iniciando sesión en tu backoffice...'
    await page.goto(
      `https://backoffice.niceonline.com/${usuario}/Account/Login`,
      { waitUntil: 'networkidle', timeout: 30000 }
    )
    await page.fill('input[name="UserName"], #UserName, input[type="text"]', email)
    await page.fill('input[name="Password"], #Password, input[type="password"]', password)
    await page.click('button[type="submit"], input[type="submit"], .btn-primary, .btn-login')
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 })
      .catch(() => {})

    job.progreso = 'Cargando lista de afiliados...'
    await page.goto(
      `https://backoffice.niceonline.com/${usuario}/BackOffice/Affiliates`,
      { waitUntil: 'networkidle', timeout: 30000 }
    )
    await page.waitForTimeout(3000)

    job.progreso = 'Descargando Excel...'
    const selectores = [
      'text=EXCEL', 'text=Excel',
      'button:has-text("EXCEL")', 'button:has-text("Excel")',
      'a:has-text("EXCEL")', 'a:has-text("Excel")',
      '.export-excel', '#btnExcel', '#exportExcel',
      '[href*="excel"]', '[href*="Export"]',
    ]

    let excelBuffer = null
    for (const sel of selectores) {
      const btn = page.locator(sel).first()
      const visible = await btn.isVisible().catch(() => false)
      if (visible) {
        const dlPromise = page.waitForEvent('download', { timeout: 30000 })
        await btn.click()
        const dl = await dlPromise
        const stream = await dl.createReadStream()
        const chunks = []
        for await (const chunk of stream) chunks.push(chunk)
        excelBuffer = Buffer.concat(chunks)
        break
      }
    }

    if (!excelBuffer) {
      job.status = 'error'
      job.error = 'No se encontró el botón de exportar Excel. Verifica tus credenciales y que tengas acceso a afiliados.'
    } else {
      job.status = 'listo'
      job.excel = excelBuffer
      job.progreso = 'Datos descargados correctamente'
    }
  } catch (e) {
    job.status = 'error'
    job.error = e.message || 'Error desconocido durante la sincronización'
  } finally {
    if (browser) await browser.close().catch(() => {})
  }
}

// ── HTTP helpers ──

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
  return new Promise(resolve => {
    let b = ''
    req.on('data', d => { b += d })
    req.on('end', () => resolve(b))
  })
}

// ── Servidor ──

const server = createServer(async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return }

  // GET /health — verificar que el servidor está activo
  if (req.url === '/health' && req.method === 'GET') {
    return json(res, 200, { ok: true, mensaje: 'RedNICE Cloud Server activo' })
  }

  // POST /sincronizar { email, password, usuario }
  // Inicia una sincronización y devuelve un jobId
  if (req.url === '/sincronizar' && req.method === 'POST') {
    const body = await readBody(req)
    let creds
    try { creds = JSON.parse(body) } catch (e) {
      return json(res, 400, { ok: false, mensaje: 'Cuerpo JSON inválido' })
    }
    if (!creds.email || !creds.password || !creds.usuario) {
      return json(res, 400, { ok: false, mensaje: 'Faltan campos: email, password, usuario' })
    }
    const jobId = randomBytes(8).toString('hex')
    jobs.set(jobId, {
      status: 'corriendo',
      excel: null,
      error: null,
      progreso: 'Iniciando...',
      createdAt: Date.now(),
    })
    ejecutarSync(jobId, creds) // sin await — corre en background
    return json(res, 200, { ok: true, jobId })
  }

  // GET /estado/:jobId — estado de una sincronización
  const matchEstado = req.url.match(/^\/estado\/([a-f0-9]+)$/)
  if (matchEstado && req.method === 'GET') {
    const job = jobs.get(matchEstado[1])
    if (!job) return json(res, 404, { ok: false, mensaje: 'Sincronización no encontrada' })
    return json(res, 200, {
      ok: true,
      status: job.status,       // 'corriendo' | 'listo' | 'error'
      progreso: job.progreso,
      error: job.error,
    })
  }

  // GET /datos/:jobId/afiliados.xlsx — descargar el Excel resultado
  const matchDatos = req.url.match(/^\/datos\/([a-f0-9]+)\/afiliados\.xlsx$/)
  if (matchDatos && req.method === 'GET') {
    const job = jobs.get(matchDatos[1])
    if (!job || !job.excel) return json(res, 404, { ok: false, mensaje: 'Excel no disponible aún' })
    cors(res)
    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    res.end(job.excel)
    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, () => {
  console.log(`RedNICE Cloud Server activo en puerto ${PORT}`)
})
