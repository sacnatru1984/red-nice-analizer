import { chromium } from 'playwright'
import { CONFIG } from './config.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const carpetaDescargas = path.resolve(__dirname, CONFIG.carpetaDescargas)
const browserDataDir = path.resolve(__dirname, 'browser-data')
const urlApp = `file:///${CONFIG.rutaApp.replace(/\\/g, '/')}`

async function main() {
  console.log('🚀 RedNICE Scraper — iniciando...')
  if (!fs.existsSync(carpetaDescargas)) fs.mkdirSync(carpetaDescargas, { recursive: true })

  // Usar contexto persistente para recordar credenciales entre ejecuciones
  const context = await chromium.launchPersistentContext(browserDataDir, {
    headless: false,
    slowMo: 200,
    locale: 'es-MX',
    timezoneId: 'America/Mexico_City',
    acceptDownloads: true,
  })

  const page = await context.newPage()

  // ── 1. Abrir RedNICE y obtener credenciales ──
  console.log('🔍 Buscando credenciales guardadas...')
  await page.goto(urlApp, { waitUntil: 'load', timeout: 15000 })
  await page.waitForTimeout(2000)

  let creds = await leerCreds(page)

  if (!creds) {
    console.log('')
    console.log('⚠️  No hay credenciales guardadas.')
    console.log('   → En la ventana del navegador que se abrió:')
    console.log('      Haz clic en "Conectar Backoffice NICE" e ingresa tu email y contraseña.')
    console.log('   Esperando que guardes tus credenciales...')
    console.log('')

    // Esperar hasta 5 minutos a que el usuario guarde credenciales
    const limite = Date.now() + 5 * 60 * 1000
    while (!creds && Date.now() < limite) {
      await page.waitForTimeout(2000)
      creds = await leerCreds(page)
    }
  }

  if (!creds) {
    console.log('❌ No se guardaron credenciales. Cerrando.')
    await context.close()
    process.exit(1)
  }

  console.log(`✅ Credenciales encontradas: ${creds.email}`)

  // ── 2. Login en Backoffice ──
  console.log('🔑 Iniciando sesión en Backoffice...')
  await page.goto(CONFIG.urlLogin, { waitUntil: 'networkidle' })
  await page.fill('input[name="UserName"], input[type="text"], #UserName', creds.email)
  await page.fill('input[name="Password"], input[type="password"], #Password', creds.password)
  await page.click('button[type="submit"], input[type="submit"], .btn-login, .btn-primary')
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 })
    .catch(() => console.log('  (continuando...)'))
  console.log('✅ Sesión iniciada')

  // ── 3. Ir a Afiliados ──
  console.log('📋 Navegando a Afiliados...')
  await page.goto(CONFIG.urlAfiliados, { waitUntil: 'networkidle', timeout: 20000 })
  await page.waitForSelector('table, .affiliates, #affiliates-table, .datatable', { timeout: 15000 })
    .catch(() => console.log('  (tabla no encontrada por selector, continuando...)'))
  await page.waitForTimeout(2000)

  // ── 4. Descargar Excel ──
  console.log('📥 Descargando Excel...')
  const botonesExportar = [
    'text=EXCEL',
    'text=Excel',
    'button:has-text("EXCEL")',
    'button:has-text("Excel")',
    'a:has-text("EXCEL")',
    'a:has-text("Excel")',
    '.export-excel', '#btnExcel', '#exportExcel',
    '[href*="excel"]', '[href*="Export"]',
  ]

  let downloadPromise = null
  let clickOk = false
  for (const selector of botonesExportar) {
    const btn = page.locator(selector).first()
    const visible = await btn.isVisible().catch(() => false)
    if (visible) {
      console.log(`  Botón encontrado: ${selector}`)
      downloadPromise = page.waitForEvent('download', { timeout: 30000 })
      await btn.click()
      clickOk = true
      break
    }
  }

  if (!clickOk) {
    console.log('⚠️  No encontré el botón automáticamente — haz clic en Exportar manualmente.')
    downloadPromise = page.waitForEvent('download', { timeout: 120000 })
  }

  const download = await downloadPromise
  const rutaArchivo = path.join(carpetaDescargas, 'afiliados.xlsx')
  await download.saveAs(rutaArchivo)
  console.log(`✅ Excel guardado en: ${rutaArchivo}`)

  // ── 5. Cargar datos en RedNICE ──
  if (CONFIG.abrirApp) {
    console.log('🖥️  Cargando datos en RedNICE...')
    await page.goto(urlApp, { waitUntil: 'load', timeout: 15000 })
    await page.waitForTimeout(3000)
    const fileInput = page.locator('input[type="file"]').first()
    const inputVisible = await fileInput.isVisible().catch(() => false)
    if (inputVisible) {
      await fileInput.setInputFiles(rutaArchivo)
      console.log('✅ Datos cargados automáticamente')
      await page.waitForTimeout(2000)
    } else {
      console.log('ℹ️  Carga el archivo manualmente:', rutaArchivo)
    }
  }

  console.log('\n🎉 ¡Listo! Los datos de tu red están actualizados.')
}

async function leerCreds(page) {
  return page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('rednice-backoffice-creds') || 'null') } catch (e) { return null }
  })
}

function fecha() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
