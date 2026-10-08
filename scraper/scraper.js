import { chromium } from 'playwright'
import { CONFIG } from './config.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { extraerRedCompleta, filasAWorkbookBuffer, cerrarModalesIniciales } from './extraer-afiliados.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const carpetaDescargas = path.resolve(__dirname, CONFIG.carpetaDescargas)
const browserDataDir = path.resolve(__dirname, 'browser-data')
const CREDS_FILE = path.resolve(__dirname, 'credentials.json')
const rutaApp = path.resolve(__dirname, CONFIG.rutaApp)
const urlApp = `file:///${rutaApp.replace(/\\/g, '/')}`
const skipOpen = process.env.REDNICE_SKIP_OPEN === 'true'

async function main() {
  console.log('RedNICE Scraper - iniciando...')
  if (!fs.existsSync(carpetaDescargas)) fs.mkdirSync(carpetaDescargas, { recursive: true })

  // ── 1. Obtener credenciales ──
  let creds = leerCredsArchivo()

  if (!creds && !skipOpen) {
    // Modo manual: abrir la app y esperar que el usuario ingrese credenciales
    console.log('')
    console.log('Sin credenciales. Abriendo la app para que ingreses tus datos...')
    const context = await chromium.launchPersistentContext(browserDataDir, {
      headless: false, slowMo: 200, locale: 'es-MX', timezoneId: 'America/Mexico_City',
    })
    const page = await context.newPage()
    await page.goto(urlApp, { waitUntil: 'load', timeout: 15000 })
    await page.waitForTimeout(2000)
    creds = await leerCredsApp(page)
    if (!creds) {
      console.log('Esperando que guardes tus credenciales en la app (hasta 5 min)...')
      const limite = Date.now() + 5 * 60 * 1000
      while (!creds && Date.now() < limite) {
        await page.waitForTimeout(2000)
        creds = await leerCredsApp(page)
      }
    }
    await context.close()
  }

  if (!creds) {
    console.log('Error: No hay credenciales disponibles. Conéctate desde la app primero.')
    process.exit(1)
  }

  console.log(`Credenciales: ${creds.email} (${creds.usuario || CONFIG.usuario})`)

  // URLs dinámicas basadas en el usuario
  const usuario = creds.usuario || CONFIG.usuario
  const urlLogin = `https://backoffice.niceonline.com/${usuario}/Account/Login`

  // ── 2. Login en Backoffice ──
  console.log('Iniciando sesion en Backoffice...')
  const context = await chromium.launchPersistentContext(browserDataDir, {
    headless: false, slowMo: 150, locale: 'es-MX', timezoneId: 'America/Mexico_City',
    acceptDownloads: true,
  })
  const page = await context.newPage()

  await page.goto(urlLogin, { waitUntil: 'networkidle' })
  await cerrarModalesIniciales(page)
  await page.fill('#LoginName', creds.email)
  await page.fill('#LoginPassword', creds.password)
  await page.click('#loginButton')
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 })
    .catch(() => console.log('  (continuando tras login...)'))
  console.log('Sesion iniciada')

  // ── 3. Leer tabla de Afiliados (nunca clicar el botón "Excel": crashea la sesión) ──
  console.log('Navegando a Afiliados...')
  const periodo = process.env.REDNICE_PERIODO || null // ej. "agosto - 2026"; vacío = periodo actual
  const filas = await extraerRedCompleta(page, { usuario, periodo })
  console.log(`  ${filas.length} afiliados leídos${periodo ? ` (periodo: ${periodo})` : ' (periodo actual)'}`)

  if (filas.length === 0) {
    throw new Error('No se leyó ninguna fila de la tabla de afiliados — revisa que la sesión haya iniciado correctamente.')
  }

  const buffer = await filasAWorkbookBuffer(filas)
  const rutaArchivo = path.join(carpetaDescargas, 'afiliados.xlsx')
  fs.writeFileSync(rutaArchivo, buffer)
  console.log(`Excel guardado: ${rutaArchivo}`)

  await context.close()
  console.log('')
  console.log('Sincronizacion completada.')
}

function leerCredsArchivo() {
  if (!fs.existsSync(CREDS_FILE)) return null
  try {
    const c = JSON.parse(fs.readFileSync(CREDS_FILE, 'utf8'))
    if (c?.email && c?.password) return c
  } catch (e) {}
  return null
}

async function leerCredsApp(page) {
  return page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('rednice-backoffice-creds') || 'null') } catch (e) { return null }
  })
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
