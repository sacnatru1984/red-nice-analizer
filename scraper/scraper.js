import { chromium } from 'playwright'
import { CONFIG } from './config.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const carpetaDescargas = path.resolve(__dirname, CONFIG.carpetaDescargas)

async function main() {
  console.log('🚀 RedNICE Scraper — iniciando...')

  // Asegura que la carpeta de descargas existe
  if (!fs.existsSync(carpetaDescargas)) fs.mkdirSync(carpetaDescargas, { recursive: true })

  const browser = await chromium.launch({
    headless: false,  // false = ves el navegador, útil para depurar
    slowMo: 300,
  })

  const context = await browser.newContext({
    acceptDownloads: true,
    locale: 'es-MX',
    timezoneId: 'America/Mexico_City',
  })

  const page = await context.newPage()

  // ── 1. Login ──
  console.log('🔑 Iniciando sesión...')
  await page.goto(CONFIG.urlLogin, { waitUntil: 'networkidle' })

  // Llenar usuario y contraseña
  // Si los selectores no funcionan, usa: await page.pause() para inspeccionarlos
  await page.fill('input[name="UserName"], input[type="text"], #UserName', CONFIG.usuario)
  await page.fill('input[name="Password"], input[type="password"], #Password', CONFIG.password)
  await page.click('button[type="submit"], input[type="submit"], .btn-login, .btn-primary')

  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 })
    .catch(() => console.log('  (navegación sin redirect, continuando...)'))

  console.log('✅ Sesión iniciada')

  // ── 2. Ir a la página de Afiliados ──
  console.log('📋 Navegando a Afiliados...')
  await page.goto(CONFIG.urlAfiliados, { waitUntil: 'networkidle', timeout: 20000 })

  // Esperar a que cargue la tabla de afiliados
  await page.waitForSelector('table, .affiliates, #affiliates-table, .datatable', {
    timeout: 15000,
  }).catch(() => console.log('  (tabla no encontrada por selector, continuando...)'))

  await page.waitForTimeout(2000)

  // ── 3. Descargar el Excel ──
  console.log('📥 Descargando Excel...')

  // Esperar el botón de exportar/descargar
  // El backoffice puede tener: "Exportar", "Excel", "Descargar", "Export"
  const botonesExportar = [
    'text=Excel',
    'text=Exportar',
    'text=Export',
    'text=Download',
    'button:has-text("Excel")',
    'a:has-text("Excel")',
    '.export-excel',
    '#btnExcel',
    '#exportExcel',
    '[href*="excel"]',
    '[href*="Export"]',
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
    console.log('⚠️  No encontré el botón de exportar automáticamente.')
    console.log('   Abriendo navegador para que hagas clic manualmente...')
    console.log('   Presiona Ctrl+C cuando hayas descargado el archivo.')
    downloadPromise = page.waitForEvent('download', { timeout: 120000 })
    // El usuario descargará manualmente
  }

  // Esperar la descarga
  const download = await downloadPromise
  const nombreArchivo = download.suggestedFilename() || `afiliados-${fecha()}.xlsx`
  const rutaArchivo = path.join(carpetaDescargas, 'afiliados.xlsx')

  await download.saveAs(rutaArchivo)
  console.log(`✅ Excel guardado en: ${rutaArchivo}`)

  // ── 4. Abrir RedNICE y cargar el archivo automáticamente ──
  if (CONFIG.abrirApp) {
    console.log('🖥️  Abriendo RedNICE...')
    const urlApp = `file:///${CONFIG.rutaApp.replace(/\\/g, '/')}`
    await page.goto(urlApp, { waitUntil: 'load', timeout: 15000 })
    await page.waitForTimeout(3000)

    // Buscar el input de archivo en la app y cargar el Excel
    const fileInput = page.locator('input[type="file"]').first()
    const inputVisible = await fileInput.isVisible().catch(() => false)

    if (inputVisible) {
      await fileInput.setInputFiles(rutaArchivo)
      console.log('✅ Datos cargados en RedNICE automáticamente')
      await page.waitForTimeout(2000)
    } else {
      // Intentar hacer clic en el botón de carga de la app
      const btnCargar = page.locator('button:has-text("Cargar"), button:has-text("Subir"), button:has-text("archivo")').first()
      const btnVisible = await btnCargar.isVisible().catch(() => false)
      if (btnVisible) {
        await btnCargar.click()
        await page.waitForTimeout(500)
        const input2 = page.locator('input[type="file"]').first()
        await input2.setInputFiles(rutaArchivo)
        console.log('✅ Datos cargados en RedNICE')
      } else {
        console.log('ℹ️  Abre RedNICE y carga manualmente:', rutaArchivo)
      }
    }
  }

  console.log('\n🎉 ¡Listo! Los datos de tu red están actualizados.')
  console.log('   Cierra este script cuando hayas terminado.')

  // Mantener el navegador abierto para que el usuario lo use
  // await browser.close()
}

function fecha() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
