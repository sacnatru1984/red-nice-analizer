// Extracción robusta de la tabla "Mis Afiliados" del Backoffice NICE.
//
// Por qué existe este archivo: el método viejo (clic en el botón "Excel" de esa
// página) crashea la sesión de Playwright — confirmado en septiembre 2026
// (TypeError: Cannot read properties of undefined (reading 'url'), tronó todo
// el navegador). En su lugar, leemos la tabla ya renderizada directamente del
// DOM. Compartido entre scraper.js (servidor local) y server-cloud.js (cloud)
// para no duplicar esta lógica en dos lugares.

import ExcelJS from 'exceljs'

export const COLUMNAS = [
  'Generación', 'EIN', 'Nombre', 'Fecha contrato', 'Fecha registro', 'Rango',
  'Rango venta', 'Teléfono', 'País', 'PP', 'PG', 'PND',
  'Número de presentador', 'Presentador', 'Estado', 'Ciudad',
]

// El backoffice abre con un modal de idioma/país que tapa el formulario de
// login, y a veces también un popup promocional ("Buenas noticias"). Sin
// cerrarlos, cualquier fill() sobre el formulario de login falla por timeout
// porque los inputs reales quedan ocultos detrás.
export async function cerrarModalesIniciales(page) {
  const cerrarSiExiste = async (locator, timeout = 3000) => {
    try {
      await locator.waitFor({ state: 'visible', timeout })
      await locator.click()
      await page.waitForTimeout(400)
      return true
    } catch (e) { return false }
  }
  // Modal de idioma/país (id="modal-language") — el botón de cerrar es un ícono sin texto.
  await cerrarSiExiste(page.locator('#modal-language .close'))
  await cerrarSiExiste(page.getByRole('button', { name: 'Cerrar', exact: true }))
  // Banner de cookies — tapa el botón de login e intercepta los clics.
  await cerrarSiExiste(page.locator('#btnAcceptCookies'))
}

export async function irAAfiliados(page, usuario) {
  await page.goto(`https://backoffice.niceonline.com/${usuario}/BackOffice/Affiliates`, {
    waitUntil: 'networkidle', timeout: 30000,
  })
  await page.waitForSelector('table', { timeout: 20000 })
}

// El combo "Mostrar registros" se resetea a 10 cada vez que cambias de periodo,
// así que hay que volver a ponerlo en 100 después de cada cambio de periodo.
export async function ponerRegistros100(page) {
  const select = page.locator('select').filter({ has: page.locator('option[value="100"]') }).first()
  if (await select.count() === 0) return false
  await select.selectOption('100')
  return true
}

// Espera a que la tabla termine de recargar tras un cambio de periodo o de
// página: el AJAX de DataTables no avisa con un evento fiable, así que
// esperamos a que el número de filas se mantenga estable un rato.
export async function esperarTablaEstable(page, { maxWaitMs = 15000, quietMs = 700 } = {}) {
  const start = Date.now()
  let prevCount = -1
  let stableSince = null
  while (Date.now() - start < maxWaitMs) {
    const count = await page.evaluate(() => document.querySelectorAll('table tbody tr').length)
    if (count === prevCount && count > 0) {
      if (!stableSince) stableSince = Date.now()
      if (Date.now() - stableSince >= quietMs) return count
    } else {
      stableSince = null
    }
    prevCount = count
    await page.waitForTimeout(250)
  }
  return prevCount
}

// Selecciona un periodo histórico ("agosto - 2026") en el combo de periodos,
// si existe esa página con historial (ej. "Mis Afiliados" sí lo tiene). Si no
// se pasa `textoPeriodo`, se deja el periodo que la página traiga por defecto
// (el actual).
export async function seleccionarPeriodo(page, textoPeriodo) {
  if (!textoPeriodo) return true
  let combo = page.locator('#cboPeriods')
  if (await combo.count() === 0) combo = page.locator('select').filter({ hasText: /\d{4}/ }).first()
  if (await combo.count() === 0) return false
  const opciones = await combo.locator('option').allTextContents()
  const match = opciones.find(o => o.trim().toLowerCase() === textoPeriodo.trim().toLowerCase())
  if (!match) return false
  await combo.selectOption({ label: match })
  // Primer settle tras el cambio de periodo (el AJAX tarda en arrancar).
  await page.waitForTimeout(4000)
  await esperarTablaEstable(page)
  return true
}

// Lee todas las filas de la tabla, paginando con "Siguiente" hasta agotar los
// registros. Usa el DOM directo (td.textContent), no el árbol de accesibilidad
// — mucho más simple y fiable dentro de un script Node/Playwright real.
export async function leerTablaCompleta(page) {
  const filas = []
  let vueltas = 0
  while (vueltas++ < 50) {
    await esperarTablaEstable(page)
    const nuevas = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('table tbody tr'))
      return trs
        .map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim()))
        .filter(cells => cells.length === 16 && cells.some(c => c !== ''))
    })
    filas.push(...nuevas)

    const siguiente = page.locator('a', { hasText: 'Siguiente' }).first()
    if (await siguiente.count() === 0) break
    const li = siguiente.locator('xpath=..')
    const clase = await li.getAttribute('class').catch(() => '')
    if (!clase || clase.includes('disabled')) break
    await siguiente.click()
  }
  return filas
}

export async function extraerRedCompleta(page, { usuario, periodo } = {}) {
  await irAAfiliados(page, usuario)
  await esperarTablaEstable(page)
  if (periodo) await seleccionarPeriodo(page, periodo)
  await ponerRegistros100(page)
  await esperarTablaEstable(page)
  return leerTablaCompleta(page)
}

export async function filasAWorkbookBuffer(filas) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Afiliados')
  ws.addRow(['Tablero - Nice de México'])
  ws.addRow(COLUMNAS)
  for (const fila of filas) {
    const tipada = [...fila]
    for (const i of [9, 10, 11]) {
      const n = parseInt(tipada[i], 10)
      if (!Number.isNaN(n)) tipada[i] = n
    }
    ws.addRow(tipada)
  }
  return wb.xlsx.writeBuffer()
}
