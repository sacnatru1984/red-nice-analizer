// ===== utils (NICE business logic) =====
// ── Imágenes de rangos ──
const _MED = (typeof window !== 'undefined' && window.RANGO_MEDALS) || {}
const _mi = (file, key) => _MED[key] || './rangos/' + file
const RANGO_IMG = {
  SIN: _mi('empresario.png', 'empresario'),
  EIN: _mi('empresario.png', 'empresario'),
  COBRE: _mi('cobre.png', 'cobre'),
  BRONCE: _mi('bronce.png', 'bronce'),
  PLATA: _mi('plata.png', 'plata'),
  ORO: _mi('oro.png', 'oro'),
  ORO_EXPERTO: _mi('oro_experto.png', 'oro_experto'),
  ORO_PREMIER: _mi('oro_premier.png', 'oro_premier'),
  ORO_ELITE: _mi('oro_elite.png', 'oro_elite'),
  PLATINO: _mi('platino.png', 'platino'),
  ORO_EJECUTIVO: _mi('oro_ejecutivo.png', 'oro_ejecutivo'),
  ORO_SENIOR: _mi('oro_senior.png', 'oro_senior'),
  ORO_MASTER: _mi('oro_master.png', 'oro_master'),
  DIAMANTE: _mi('diamante.png', 'diamante'),
  DIAMANTE_MASTER: _mi('diamante.png', 'diamante'),
  DOBLE_DIAMANTE: _mi('diamante.png', 'diamante'),
}

// ── Rangos NICE según plan de carrera oficial ──
const RANGOS = [
  { id: 'SIN', label: 'Sin Descuento', pct: 0, color: '#9CA3AF', bg: '#F3F4F6', tipo: 'desc' },
  { id: 'EIN', label: 'Empresario', pct: 25, color: '#6B7280', bg: '#F3F4F6', tipo: 'desc' },
  { id: 'COBRE', label: 'Cobre', pct: 30, color: '#B45309', bg: '#FEF9EC', tipo: 'desc' },
  { id: 'BRONCE', label: 'Bronce', pct: 35, color: '#EA580C', bg: '#FFF5ED', tipo: 'desc' },
  { id: 'PLATA', label: 'Plata', pct: 40, color: '#1D4ED8', bg: '#EFF4FF', tipo: 'desc' },
  { id: 'ORO', label: 'Oro', pct: 45, color: '#C47F17', bg: '#FEF7E6', tipo: 'desc' },
  // Por esfuerzo personal (3 meses consecutivos)
  { id: 'ORO_EXPERTO', label: 'Oro Experto', pct: 45, color: '#C47F17', bg: '#FEF7E6', tipo: 'personal', ppReq: 1650 },
  { id: 'ORO_PREMIER', label: 'Oro Premier', pct: 45, color: '#C47F17', bg: '#FEF7E6', tipo: 'personal', ppReq: 2300 },
  { id: 'ORO_ELITE', label: 'Oro Elite', pct: 45, color: '#C47F17', bg: '#FEF7E6', tipo: 'personal', ppReq: 3500 },
  { id: 'PLATINO', label: 'Platino', pct: 45, color: '#7C3AED', bg: '#F5F0FF', tipo: 'personal', ppReq: 4500 },
  // Por esfuerzo con equipo
  { id: 'ORO_EJECUTIVO', label: 'Oro Ejecutivo', pct: 45, color: '#C47F17', bg: '#FEF7E6', tipo: 'equipo', frontalesOro: 1 },
  { id: 'ORO_SENIOR', label: 'Oro Senior', pct: 45, color: '#C47F17', bg: '#FEF7E6', tipo: 'equipo', frontalesOro: 2 },
  { id: 'ORO_MASTER', label: 'Oro Master', pct: 45, color: '#C47F17', bg: '#FEF7E6', tipo: 'equipo', frontalesOro: 3 },
  { id: 'DIAMANTE', label: 'Diamante', pct: 45, color: '#7C3AED', bg: '#F5F0FF', tipo: 'equipo', frontalesOro: 4 },
  { id: 'DIAMANTE_MASTER', label: 'Diamante Master', pct: 45, color: '#7C3AED', bg: '#F5F0FF', tipo: 'equipo', frontalesOro: 8 },
  { id: 'DOBLE_DIAMANTE', label: 'Doble Diamante SL', pct: 45, color: '#7C3AED', bg: '#F5F0FF', tipo: 'equipo', frontalesOro: 16 },
]

function getRango(rangoStr) {
  if (!rangoStr) return RANGOS[0]
  const s = rangoStr.toString().toUpperCase().trim()
  if (s.includes('DOBLE')) return RANGOS.find(r => r.id === 'DOBLE_DIAMANTE')
  if (s.includes('DIAMANTE MASTER') || s.includes('DIAMANTE_MASTER')) return RANGOS.find(r => r.id === 'DIAMANTE_MASTER')
  if (s.includes('DIAMANTE')) return RANGOS.find(r => r.id === 'DIAMANTE')
  if (s.includes('PLATINO')) return RANGOS.find(r => r.id === 'PLATINO')
  if (s.includes('ELITE')) return RANGOS.find(r => r.id === 'ORO_ELITE')
  if (s.includes('PREMIER')) return RANGOS.find(r => r.id === 'ORO_PREMIER')
  if (s.includes('EXPERTO')) return RANGOS.find(r => r.id === 'ORO_EXPERTO')
  if (s.includes('EJECUTIVO')) return RANGOS.find(r => r.id === 'ORO_EJECUTIVO')
  if (s.includes('SENIOR')) return RANGOS.find(r => r.id === 'ORO_SENIOR')
  if (s.includes('MASTER')) return RANGOS.find(r => r.id === 'ORO_MASTER')
  if (s.includes('ORO')) return RANGOS.find(r => r.id === 'ORO')
  if (s.includes('PLATA') || s.includes('SILVER')) return RANGOS.find(r => r.id === 'PLATA')
  if (s.includes('BRONCE') || s.includes('BRONZE')) return RANGOS.find(r => r.id === 'BRONCE')
  if (s.includes('COBRE')) return RANGOS.find(r => r.id === 'COBRE')
  if (s.includes('EIN') || s.includes('EMPRESARIO')) return RANGOS.find(r => r.id === 'EIN')
  return RANGOS[0]
}

// Después de Oro hay 2 escaleras independientes (ver plan de carrera NICE):
// esfuerzo personal (Oro Experto → Platino) y esfuerzo con equipo (Oro Ejecutivo → Doble Diamante).
// Si el afiliado ya está en una de las dos, se le sigue esa misma escalera.
// Desde "Oro" a secas, el equipo es el camino por defecto (comportamiento previo).
const ORDEN_DESC = ['EIN', 'COBRE', 'BRONCE', 'PLATA', 'ORO']
const ORDEN_PERSONAL = ['ORO_EXPERTO', 'ORO_PREMIER', 'ORO_ELITE', 'PLATINO']
const ORDEN_EQUIPO = ['ORO_EJECUTIVO', 'ORO_SENIOR', 'ORO_MASTER', 'DIAMANTE', 'DIAMANTE_MASTER', 'DOBLE_DIAMANTE']
function getSiguienteRango(rangoId) {
  if (rangoId === 'ORO') return RANGOS.find(r => r.id === 'ORO_EJECUTIVO')
  const idxP = ORDEN_PERSONAL.indexOf(rangoId)
  if (idxP >= 0) return idxP < ORDEN_PERSONAL.length - 1 ? RANGOS.find(r => r.id === ORDEN_PERSONAL[idxP + 1]) : null
  const idxE = ORDEN_EQUIPO.indexOf(rangoId)
  if (idxE >= 0) return idxE < ORDEN_EQUIPO.length - 1 ? RANGOS.find(r => r.id === ORDEN_EQUIPO[idxE + 1]) : null
  const idx = ORDEN_DESC.indexOf(rangoId)
  if (idx < 0 || idx >= ORDEN_DESC.length - 1) return null
  return RANGOS.find(r => r.id === ORDEN_DESC[idx + 1])
}

// ¿El afiliado ya cumple por completo un rango de equipo?
function cumpleRangoEquipo(afiliado, rango) {
  const tieneF = afiliado.frontalesOro || 0
  if ((rango.frontalesOro || 0) > tieneF) return false
  if (['DIAMANTE', 'DIAMANTE_MASTER', 'DOBLE_DIAMANTE'].includes(rango.id)) {
    if (((afiliado.pp || 0) + (afiliado.pg || 0)) < 2000) return false
  }
  return true
}
// Rango objetivo real: SIEMPRE el siguiente escalón oficial, uno a la vez.
// El ascenso ocurre paso a paso conforme NICE actualiza el rango oficial del
// afiliado — no se saltan rangos aunque ya cumpla numéricamente varios adelante
// (eso se muestra aparte como "potencial", ver getPotencialEquipo).
function getSiguienteRangoObjetivo(afiliado) {
  const r = getRango(afiliado.rango)
  return getSiguienteRango(r.id)
}
// Potencial de equipo: el rango de equipo MÁS ALTO que el afiliado ya cumple
// numéricamente con sus frontales Oro y puntos actuales, aunque su rango oficial
// todavía no haya avanzado hasta ahí. Es una observación informativa, no la meta.
function getPotencialEquipo(afiliado) {
  const r = getRango(afiliado.rango)
  let sig = getSiguienteRango(r.id)
  let potencial = null
  let guard = 0
  while (sig && sig.tipo === 'equipo' && cumpleRangoEquipo(afiliado, sig) && guard < 12) {
    potencial = sig
    sig = getSiguienteRango(sig.id)
    guard++
  }
  return potencial
}

// Meta de Ventas: escalera de esfuerzo personal (Oro Experto → Platino, ver
// plan de carrera NICE), basada en el campo "Rango venta" del Excel — es un
// eje independiente del rango de equipo/red que se muestra como "Meta".
function getSiguienteRangoVenta(afiliado) {
  const rv = getRango(afiliado.rangoVenta)
  const idx = ORDEN_PERSONAL.indexOf(rv.id)
  if (idx < 0) return RANGOS.find(r => r.id === 'ORO_EXPERTO')
  return idx < ORDEN_PERSONAL.length - 1 ? RANGOS.find(r => r.id === ORDEN_PERSONAL[idx + 1]) : null
}

function getProgresoPct(afiliado, siguiente) {
  if (!siguiente) return 100
  const pp = afiliado.pp || 0
  const pg = afiliado.pg || 0
  const combinado = pp + pg
  if (siguiente.id === 'COBRE') return Math.min(100, Math.round((combinado / 700) * 100))
  if (siguiente.id === 'BRONCE') return Math.min(100, Math.round((combinado / 1000) * 100))
  if (siguiente.id === 'PLATA') return Math.min(100, Math.round((combinado / 2000) * 100))
  if (siguiente.id === 'ORO') return Math.min(100, Math.round((combinado / 3000) * 100))
  if (siguiente.tipo === 'personal') return Math.min(100, Math.round((pp / siguiente.ppReq) * 100))
  if (siguiente.tipo === 'equipo') {
    const frontalesActivos = afiliado.frontalesOro || 0
    return Math.min(100, Math.round((frontalesActivos / siguiente.frontalesOro) * 100))
  }
  return 0
}

function esOroPlus(a) {
  const id = getRango(a.rango).id
  return id.includes('ORO') || id === 'PLATINO' || id.includes('DIAMANTE')
}

// ── Cálculo de Descuento por Red (Reembolso por Diferencial) ──
// Valor del punto en MXN según el % de descuento de cada rango (tabla de Factores de Inversión).
const VALOR_ORO = 12.06          // valor del punto a 45% (Oro y superiores)
const UMBRAL_DESC_USD = 200      // requisito oficial NICE para contar como frontal Oro
const TC_FALLBACK = 18.0         // tipo de cambio de respaldo si no carga el dólar en vivo
function valorPuntoDe(rangoId) {
  if (rangoId === 'PLATA') return 12.96   // 40%
  if (rangoId === 'BRONCE') return 13.86  // 35%
  if (rangoId === 'COBRE') return 14.76   // 30%
  if (rangoId === 'EIN' || rangoId === 'SIN') return 15.66 // 25%
  return VALOR_ORO // Oro+ (45%) — no generan diferencial hacia arriba
}
// Suma el diferencial que un frontal Oro gana sobre su red descendente NO-Oro
// (se detiene al encontrar otro Oro, que inicia su propio Nivel Oro).
function descRedMXNde(frontal, childrenByEin, volBase) {
  let mxn = 0, personas = 0
  const stack = [...(childrenByEin[frontal.ein] || [])]
  while (stack.length) {
    const m = stack.pop()
    if (esOroPlus(m)) continue // límite de Nivel Oro: ese Oro y su red no cuentan para este frontal
    const dif = valorPuntoDe(getRango(m.rango).id) - VALOR_ORO
    const vol = volBase === 'pg' ? (m.pg || 0) : volBase === 'ppg' ? ((m.pp || 0) + (m.pg || 0)) : (m.pp || 0)
    if (dif > 0 && vol > 0) { mxn += dif * vol; personas++ }
    for (const c of (childrenByEin[m.ein] || [])) stack.push(c)
  }
  return { mxn, personas }
}
function enrichDescRed(afiliados, volBase) {
  const childrenByEin = {}
  afiliados.forEach(a => { if (a.einPresentador) { (childrenByEin[a.einPresentador] = childrenByEin[a.einPresentador] || []).push(a) } })
  afiliados.forEach(a => {
    if (esOroPlus(a)) { const r = descRedMXNde(a, childrenByEin, volBase); a.descRedMXN = r.mxn; a.descRedPersonas = r.personas }
    else { a.descRedMXN = 0; a.descRedPersonas = 0 }
  })
  return afiliados
}
// ¿Este frontal CALIFICA como "frontal Oro" para el rango de su patrocinador?
// Definición fiel al plan y CONSISTENTE: rango Oro+ y activo este mes (PP+PG > 0).
// (Antes dependía del volumen de su red para llegar a $200 USD, lo que hacía el
//  conteo volátil: un Oro con poca red abajo daba $0 y no contaba. Ya no.)
function frontalOroCalifica(a) {
  return esOroPlus(a) && ((a.pp || 0) + (a.pg || 0)) > 0
}
// Desc. por Red (Reembolso por Diferencial) que genera un Oro — INFORMATIVO.
// Usa los valores de punto de la tabla de Factores de Inversión (Rangos NICE).
function frontalGenera(a, tc, umbral) {
  const t = tc || TC_FALLBACK
  const u = umbral || UMBRAL_DESC_USD
  const mxn = a.descRedMXN || 0
  const usd = mxn / t
  return { mxn, usd, tc: t, genera: frontalOroCalifica(a), sobreUmbral: usd >= u }
}

// ── Simulador de "Cheque del mes" (Descuento por Red — tabla oficial NICE) ──
// Requiere rango Oro+ propio. El % depende de tus PROPIOS PP+PG del periodo,
// y se aplica sobre el PP+PG combinado de TODOS tus descendientes en Generación
// 1, 2 y 3 (sin importar su rango — confirmado por Isaac, no solo los Oro+).
const DR_TRAMOS = [
  { min: 2000, l1: .05, l2: .04, l3: .04 },
  { min: 1500, l1: .03, l2: .03, l3: .03 },
  { min: 1000, l1: .02, l2: .02, l3: .02 },
  { min: 500, l1: .01, l2: .01, l3: .01 },
  { min: 0, l1: 0, l2: 0, l3: 0 },
]
function simularChequeDR(self, afiliados, metaPropios) {
  const byPresentador = {}
  afiliados.forEach(a => { if (a.einPresentador != null) (byPresentador[a.einPresentador] = byPresentador[a.einPresentador] || []).push(a) })
  function personasNivel(ein, n) {
    let actuales = byPresentador[ein] || []
    for (let i = 1; i < n; i++) actuales = actuales.flatMap(a => byPresentador[a.ein] || [])
    return actuales
  }
  const propiosReales = (self.pp || 0) + (self.pg || 0)
  const propios = (metaPropios != null && metaPropios >= 0) ? metaPropios : propiosReales
  const califica = esOroPlus(self)
  const tramo = DR_TRAMOS.find(t => propios >= t.min)
  const niveles = [1, 2, 3].map(n => {
    const delNivel = personasNivel(self.ein, n)
    const puntos = delNivel.reduce((s, a) => s + (a.pp || 0) + (a.pg || 0), 0)
    const pct = !califica ? 0 : (n === 1 ? tramo.l1 : n === 2 ? tramo.l2 : tramo.l3)
    return { nivel: n, personas: delNivel.length, puntos, pct, importePuntos: puntos * pct }
  })
  const totalPuntosDR = niveles.reduce((s, n) => s + n.importePuntos, 0)
  const totalMXN = totalPuntosDR * VALOR_ORO
  return { propios, propiosReales, califica, tramoMin: tramo.min, niveles, totalMXN }
}

function computeFrontalesOro(afiliados, tc, volBase, umbral) {
  enrichDescRed(afiliados, volBase)
  const childrenOf = {}
  afiliados.forEach(a => { if (a.einPresentador) { (childrenOf[a.einPresentador] = childrenOf[a.einPresentador] || []).push(a) } })
  afiliados.forEach(a => {
    const kids = childrenOf[a.ein] || []
    a.frontalesOro = kids.filter(k => frontalOroCalifica(k)).length
  })
  return afiliados
}

function analizarFrontales(afiliado, afiliados, tc, umbral) {
  const ORO_REQ = 3000
  const frontales = (afiliados || []).filter(a => a.einPresentador === afiliado.ein)
  const orosActivos = frontales.filter(a => frontalOroCalifica(a))
  const orosInactivos = frontales.filter(a => esOroPlus(a) && !frontalOroCalifica(a))
  const candidatos = frontales
    .filter(a => !esOroPlus(a))
    .map(a => ({ a, pts: (a.pp || 0) + (a.pg || 0), falta: Math.max(0, ORO_REQ - ((a.pp || 0) + (a.pg || 0))) }))
    .filter(x => x.pts > 0)
    .sort((x, y) => y.pts - x.pts)
  return { frontales, orosActivos, orosInactivos, candidatos, ORO_REQ }
}

const RECOMPENSA_PERSONAL = {
  ORO_EXPERTO: 'Cupón de $2,000 en producto',
  ORO_PREMIER: 'Cupón de $5,000 en producto',
  ORO_ELITE: 'Cupón de $7,500 en producto',
  PLATINO: 'Cupón de $20,000 en producto o $10,000 en efectivo',
}

// Plan de acción: siempre con UN objetivo claro (paso 1, numérico y verificable)
// y como máximo 2 pasos más de apoyo — solo cuando hay algo específico que decir
// (datos reales de la red o la recompensa), nunca relleno genérico.
function getPlanAccion(afiliado, siguiente, afiliados, tc, umbral) {
  if (!siguiente) return []
  const pp = afiliado.pp || 0
  const pg = afiliado.pg || 0

  // Rangos por descuento (Cobre/Bronce/Plata): un solo objetivo de puntos combinados
  if (siguiente.tipo === 'desc' && siguiente.id !== 'ORO') {
    const req = siguiente.id === 'COBRE' ? 700 : siguiente.id === 'BRONCE' ? 1000 : 2000
    const falta = Math.max(0, req - (pp + pg))
    const directos = (afiliados || []).filter(a => a.einPresentador === afiliado.ein)
    const activos = directos.filter(a => ((a.pp || 0) + (a.pg || 0)) > 0).length
    return [
      {
        num: 1, color: '#DC2626',
        title: falta > 0 ? `Objetivo: ${req.toLocaleString()} PP/PG combinados · vas ${(pp + pg).toLocaleString()}/${req.toLocaleString()}` : `Ya cumples ${req.toLocaleString()} PP/PG combinados`,
        desc: falta > 0 ? `Te faltan ${falta.toLocaleString()} puntos para calificar a ${siguiente.label} (${siguiente.pct}%).` : `Sostenlo hasta el cierre del período para calificar a ${siguiente.label} (${siguiente.pct}%).`
      },
      {
        num: 2, color: '#16A34A', title: 'Cómo cerrar la brecha',
        desc: directos.length > 0
          ? `Tienes ${directos.length} persona${directos.length > 1 ? 's' : ''} en tu línea directa, ${activos} activa${activos !== 1 ? 's' : ''} este mes. Haz tu pedido y empuja a que el resto haga el suyo — sus puntos suman como PG.`
          : `Haz un pedido propio que cierre la diferencia, e invita a tu primer afiliado — sus puntos también sumarán como PG.`
      },
    ]
  }

  // Oro (45%): un solo camino recomendado (el más rápido), la alternativa de equipo como nota breve
  if (siguiente.id === 'ORO') {
    const falta = Math.max(0, 3000 - (pp + pg))
    return [
      {
        num: 1, color: '#DC2626',
        title: falta > 0 ? `Objetivo: 3,000 PP/PG combinados · vas ${(pp + pg).toLocaleString()}/3,000` : 'Ya alcanzaste los 3,000 PP/PG combinados',
        desc: falta > 0 ? `Te faltan ${falta.toLocaleString()} puntos. Es el camino más directo a Oro (45%), en 1 o 2 períodos consecutivos.` : 'Sostenlo el período que falte (si lo hiciste en 2 meses) para calificar a Oro (45%).'
      },
      {
        num: 2, color: '#16A34A', title: 'Si no llegas sola/o, súmate en equipo',
        desc: 'Con 1,000 PP propios + 3 líneas activas generando 1,000 PG cada una (o 2 líneas con 500 PG en 2 períodos), también calificas a Oro.'
      },
    ]
  }

  // Rangos por esfuerzo personal (Oro Experto/Premier/Elite, Platino): meta de PP × 3 períodos
  if (siguiente.tipo === 'personal') {
    const req = siguiente.ppReq
    const falta = Math.max(0, req - pp)
    return [
      {
        num: 1, color: '#DC2626',
        title: falta > 0 ? `Objetivo: ${req.toLocaleString()} PP este mes · vas ${pp.toLocaleString()}/${req.toLocaleString()}` : `Ya llegaste a ${req.toLocaleString()} PP este mes`,
        desc: `Debes sostener ${req.toLocaleString()} PP durante 3 períodos consecutivos para calificar a ${siguiente.label}.`
      },
      {
        num: 2, color: '#16A34A', title: 'Recompensa al calificar',
        desc: `${RECOMPENSA_PERSONAL[siguiente.id] || ''} al completar los 3 períodos consecutivos.`
      },
    ]
  }

  // Rangos por esfuerzo con equipo (Oro Ejecutivo → Doble Diamante): frontales Oro activos
  if (siguiente.tipo === 'equipo') {
    const { orosActivos, orosInactivos, candidatos } = analizarFrontales(afiliado, afiliados, tc, umbral)
    const tiene = orosActivos.length
    const req = siguiente.frontalesOro
    const faltan = Math.max(0, req - tiene)
    const top = candidatos[0]
    const segundo = candidatos[1]
    const necesitaPropio = ['DIAMANTE', 'DIAMANTE_MASTER', 'DOBLE_DIAMANTE'].includes(siguiente.id)
    const recompensa = {
      ORO_EJECUTIVO: 'Cupón de $5,000 en productos NICE + Desc. por Red 1-5% (niveles 1-3)',
      ORO_SENIOR: 'Cupón de $7,500 en productos NICE',
      ORO_MASTER: 'Cheque de $10,000 pesos',
      DIAMANTE: 'Cupón de $5,000 + 3% del 4° Nivel Oro',
      DIAMANTE_MASTER: '3% del 4° y 5° Nivel Oro',
      DOBLE_DIAMANTE: 'Cheque de $100,000 pesos',
    }[siguiente.id]
    const detalleActivos = orosActivos.slice(0, 3).map(a => a.nombre.split(' ').slice(0, 2).join(' ')).join(', ') + (orosActivos.length > 3 ? ` y ${orosActivos.length - 3} más` : '')
    const pasos = [{
      num: 1, color: '#DC2626',
      title: faltan > 0 ? `Objetivo: ${faltan} frontal${faltan > 1 ? 'es' : ''} Oro más · vas ${tiene}/${req}` : `Mantén tus ${req} frontal${req > 1 ? 'es' : ''} Oro activos · ${tiene}/${req}`,
      desc: faltan > 0
        ? (top
          ? `Tu mejor candidato es ${top.a.nombre} (${getRango(top.a.rango).label}, ${top.pts.toLocaleString()} pts) — le faltan ${top.falta.toLocaleString()} pts para ser Oro y contar como tu frontal.`
          : `Necesitas ${req} frontal${req > 1 ? 'es' : ''} Oro activo${req > 1 ? 's' : ''} en tu gen.1. Invita y activa nuevas líneas directas.`)
        : `${detalleActivos} ${orosActivos.length > 1 ? 'ya son Oro activos' : 'ya es Oro activo'}. Recompensa al llegar a ${siguiente.label}: ${recompensa}.`
    }]
    if (orosInactivos.length > 0) {
      pasos.push({
        num: 2, color: '#EA580C',
        title: `Reactiva ${orosInactivos.length} frontal${orosInactivos.length > 1 ? 'es' : ''} Oro sin movimiento`,
        desc: `${orosInactivos.slice(0, 2).map(a => a.nombre.split(' ').slice(0, 2).join(' ')).join(', ')}${orosInactivos.length > 2 ? ` y ${orosInactivos.length - 2} más` : ''} ${orosInactivos.length > 1 ? 'son Oro' : 'es Oro'} pero no ${orosInactivos.length > 1 ? 'registran' : 'registra'} PP/PG este mes, así que no ${orosInactivos.length > 1 ? 'cuentan' : 'cuenta'} como frontal Oro.`
      })
    } else if (faltan > 0 && segundo) {
      pasos.push({
        num: 2, color: '#EA580C',
        title: `Tu 2° candidato: ${segundo.a.nombre}`,
        desc: `${getRango(segundo.a.rango).label}, ${segundo.pts.toLocaleString()} pts — le faltan ${segundo.falta.toLocaleString()} pts para Oro. Trabaja 2 líneas en paralelo para no depender de una sola.`
      })
    }
    if (necesitaPropio) {
      const propio = pp + pg
      pasos.push({
        num: pasos.length + 1, color: '#16A34A',
        title: `Genera 2,000 PP/PG propios · vas ${propio.toLocaleString()}/2,000`,
        desc: propio >= 2000
          ? `Ya cumples tu volumen personal. Recompensa al subir a ${siguiente.label}: ${recompensa}.`
          : `Además de los frontales, te faltan ${(2000 - propio).toLocaleString()} pts propios. Recompensa al subir: ${recompensa}.`
      })
    }
    return pasos
  }

  return []
}

// ── Parser de Excel ──
// Normaliza texto: quita acentos, espacios extra, pasa a minúsculas
function norm(s) {
  return (s ?? '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

// Diccionario de sinónimos → clave canónica
const HEADER_MAP = {
  gen: ['gen', 'generacion', 'nivel', 'level', 'n'],
  ein: ['ein', 'id', 'codigo', 'numero empresario', 'no empresario', 'empresario'],
  nombre: ['nombre', 'afiliado', 'nombre completo', 'name', 'distribuidor'],
  fechaContrato: ['fecha contrato', 'contrato', 'fecha de contrato'],
  fechaRegistro: ['fecha registro', 'registro', 'fecha de registro', 'fecha alta', 'alta'],
  rango: ['rango', 'rango actual', 'rango calificado', 'rank'],
  rangoVenta: ['rango venta', 'rango de venta', 'descuento', 'rango descuento'],
  telefono: ['telefono', 'tel', 'celular', 'movil', 'phone'],
  pais: ['pais', 'country'],
  pp: ['pp', 'puntos personales', 'p p', 'puntos p'],
  pg: ['pg', 'puntos grupales', 'p g', 'puntos g', 'puntos de grupo'],
  pnd: ['pnd', 'pne', 'puntos nuevos', 'puntos nuevos empresarios'],
  einPresentador: ['ein presentador', 'ein patrocinador', 'presentador ein', 'patrocinador ein', 'id presentador', 'id patrocinador', 'numero de presentador', 'numero presentador', 'número de presentador'],
  presentador: ['presentador', 'patrocinador', 'sponsor', 'upline', 'enroller'],
  estado: ['estado', 'state', 'provincia'],
  ciudad: ['ciudad', 'city', 'municipio'],
}

function buildHeaderIndex(headerRow) {
  const idx = {}
  const normed = headerRow.map(norm)
  const used = new Set()
  const entries = Object.entries(HEADER_MAP)
  // Pasada 1: solo coincidencias exactas (evita que "Rango venta" se confunda con "Rango"
  // si el orden de columnas cambia entre exportaciones de NICE).
  for (const [key, synonyms] of entries) {
    for (let i = 0; i < normed.length; i++) {
      if (used.has(i) || !normed[i]) continue
      if (synonyms.includes(normed[i])) { idx[key] = i; used.add(i); break }
    }
  }
  // Pasada 2: coincidencias parciales para las claves que quedaron sin columna.
  for (const [key, synonyms] of entries) {
    if (idx[key] != null) continue
    for (let i = 0; i < normed.length; i++) {
      if (used.has(i) || !normed[i]) continue
      if (synonyms.some(syn => normed[i].includes(syn))) { idx[key] = i; used.add(i); break }
    }
  }
  return idx
}

// Detecta cuál fila contiene los encabezados (busca en las primeras 10 filas)
function detectHeaderRow(data) {
  const max = Math.min(data.length, 10)
  let best = { row: 0, score: 0, idx: {} }
  for (let i = 0; i < max; i++) {
    const row = data[i] || []
    const idx = buildHeaderIndex(row)
    const score = Object.keys(idx).length
    if (score > best.score) best = { row: i, score, idx }
  }
  return best
}

const num = v => {
  if (v == null || v === '') return 0
  if (typeof v === 'number') return v
  const s = v.toString().replace(/[^\d.,-]/g, '').replace(/,/g, '')
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}
const str = v => (v == null ? '' : v.toString().trim())

function parseExcel(data) {
  if (!data || data.length === 0) return []
  const { row: headerRowIdx, idx, score } = detectHeaderRow(data)

  // Fallback a posiciones fijas si no se detectaron encabezados útiles
  const useFixed = score < 3
  const get = (r, key, fixedIdx) => {
    const i = useFixed ? fixedIdx : idx[key]
    return i == null ? undefined : r[i]
  }

  const rows = []
  for (let i = headerRowIdx + 1; i < data.length; i++) {
    const r = data[i]
    if (!r) continue
    const ein = str(get(r, 'ein', 1))
    const nombre = str(get(r, 'nombre', 2))
    if (!ein && !nombre) continue
    rows.push({
      gen: parseInt(get(r, 'gen', 0)) || 0,
      ein,
      nombre,
      fechaContrato: get(r, 'fechaContrato', 3),
      fechaRegistro: get(r, 'fechaRegistro', 4),
      rango: str(get(r, 'rango', 5)),
      rangoVenta: str(get(r, 'rangoVenta', 6)),
      telefono: str(get(r, 'telefono', 7)),
      pais: str(get(r, 'pais', 8)) || 'MX',
      pp: num(get(r, 'pp', 9)),
      pg: num(get(r, 'pg', 10)),
      pnd: num(get(r, 'pnd', 11)),
      einPresentador: str(get(r, 'einPresentador', 12)),
      presentador: str(get(r, 'presentador', 13)),
      estado: str(get(r, 'estado', 14)),
      ciudad: str(get(r, 'ciudad', 15)),
    })
  }
  return rows
}

function detectarDuplicados(afiliados) {
  const duplicados = []
  const einMap = {}
  afiliados.forEach(a => {
    if (!a.ein) return
    if (einMap[a.ein]) {
      duplicados.push({ tipo: 'EIN duplicado', ein: a.ein, nombres: [einMap[a.ein].nombre, a.nombre] })
    } else {
      einMap[a.ein] = a
    }
  })
  // Nombres similares
  const nombres = afiliados.map(a => ({ ein: a.ein, nombre: a.nombre?.toLowerCase().replace(/\s+/g, ' ').trim() }))
  const vistos = {}
  nombres.forEach(n => {
    if (!n.nombre) return
    const key = n.nombre.split(' ').slice(0, 2).join(' ')
    if (vistos[key] && vistos[key].ein !== n.ein) {
      const yaRegistrado = duplicados.some(d => d.nombres?.includes(n.nombre))
      if (!yaRegistrado) {
        duplicados.push({ tipo: 'Nombre similar', ein: n.ein, nombres: [vistos[key].nombre, n.nombre] })
      }
    } else {
      vistos[key] = n
    }
  })
  return duplicados
}

function buildTree(afiliados) {
  const byEin = {}
  afiliados.forEach(a => { byEin[a.ein] = { ...a, children: [] } })
  const roots = []
  afiliados.forEach(a => {
    if (a.einPresentador && byEin[a.einPresentador]) {
      byEin[a.einPresentador].children.push(byEin[a.ein])
    } else if (a.gen === 0 || !a.einPresentador) {
      roots.push(byEin[a.ein])
    }
  })
  return roots.length > 0 ? roots : Object.values(byEin).filter(a => a.gen === 0)
}

function getInitials(nombre) {
  if (!nombre) return '??'
  const parts = nombre.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// ── Detecta pantallas angostas (celular) para adaptar layouts de columnas
// fijas que no pueden resolverse solo con CSS del archivo host. ──
function useIsMobile(breakpoint = 720) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < breakpoint)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return isMobile
}

function contarPorRango(afiliados) {
  const counts = {}
  afiliados.forEach(a => {
    const r = getRango(a.rango)
    counts[r.label] = (counts[r.label] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}


// ===== App =====
const { useState, useRef, useCallback, useEffect, useMemo } = React

async function parseWorkbookFile(file) {
  const buffer = await file.arrayBuffer()
  const workbook = new window.ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const worksheet = workbook.worksheets[0]
  const data = worksheet.getSheetValues().slice(1).map((row) => Array.isArray(row) ? row.slice(1) : [])
  return normalizeAfiliados(parseExcel(data))
}

async function parseWorkbookBuffer(buffer) {
  const workbook = new window.ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const worksheet = workbook.worksheets[0]
  const data = worksheet.getSheetValues().slice(1).map((row) => Array.isArray(row) ? row.slice(1) : [])
  return normalizeAfiliados(parseExcel(data))
}

// Si el Excel no trae EIN ni "Número de presentador" (ej. exportes anonimizados),
// reconstruimos la red por NOMBRE: EIN sintético, presentador por nombre, generación por BFS.
function normalizeAfiliados(afs) {
  if (!afs || !afs.length) return afs || []
  const faltanEin = afs.filter(a => !a.ein).length
  if (faltanEin < afs.length * 0.5) return afs // exporte real con EINs: no tocar
  const byName = {}
  afs.forEach((a, i) => {
    a.ein = 'N' + String(i + 1).padStart(4, '0')
    const k = (a.nombre || '').toUpperCase().trim()
    if (k && !byName[k]) byName[k] = a.ein
  })
  afs.forEach(a => {
    const p = (a.presentador || '').toUpperCase().trim()
    a.einPresentador = (p && byName[p]) ? byName[p] : ''
  })
  const byEin = {}; afs.forEach(a => byEin[a.ein] = a)
  const childrenOf = {}
  afs.forEach(a => { if (a.einPresentador && byEin[a.einPresentador]) { (childrenOf[a.einPresentador] = childrenOf[a.einPresentador] || []).push(a.ein) } })
  afs.forEach(a => a.gen = null)
  const roots = afs.filter(a => !a.einPresentador || !byEin[a.einPresentador])
  roots.forEach(r => { r.einPresentador = ''; r.gen = 0 })
  let frontier = roots.map(r => r.ein)
  while (frontier.length) {
    const next = []
    for (const e of frontier) for (const c of (childrenOf[e] || [])) { if (byEin[c].gen == null) { byEin[c].gen = byEin[e].gen + 1; next.push(c) } }
    frontier = next
  }
  const rootEin = roots[0] ? roots[0].ein : null
  afs.forEach(a => { if (a.gen == null) { a.gen = 1; if (rootEin && !a.einPresentador && a.ein !== rootEin) a.einPresentador = rootEin } })
  afs.forEach(a => {
    const kids = (childrenOf[a.ein] || []).map(e => byEin[e])
    a.frontalesOro = kids.filter(k => { const t = getRango(k.rango).id; const oro = t.includes('ORO') || t === 'PLATINO' || t.includes('DIAMANTE'); return oro && (k.pp + k.pg) > 0 }).length
  })
  afs.sort((a, b) => a.gen - b.gen)
  return afs
}

const Icons = {
  Network: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/></svg>,
  Tree: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Plan: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><polyline points="8 1 8 8 12 12 16 8 16 1"/><line x1="8" y1="1" x2="16" y2="1"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Sliders: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  File: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ChevRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:'100%',height:'100%'}}><polyline points="9 18 15 12 9 6"/></svg>,
  ChevDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:'100%',height:'100%'}}><polyline points="6 9 12 15 18 9"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:'100%',height:'100%'}}><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:'100%',height:'100%'}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'100%',height:'100%'}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'100%',height:'100%'}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Megaphone: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  GitBranch: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Target: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
}

const s = (styles) => styles
const S = {
  card: { background:'var(--win-surface)', border:'1px solid var(--win-border)', borderRadius:10, boxShadow:'0 1px 3px rgba(0,0,0,.08)' },
  cardHeader: { padding:'12px 16px', borderBottom:'1px solid var(--win-border)', display:'flex', alignItems:'center', gap:8 },
  cardBody: { padding:'14px 16px' },
  cardTitle: { fontSize:13, fontWeight:600, color:'var(--win-title)' },
}

function RankBadge({ rangoStr, maxWidth }) {
  const r = getRango(rangoStr)
  const overflowStyle = maxWidth ? { maxWidth, overflow:'hidden', textOverflow:'ellipsis' } : null
  return <span style={{ background:r.bg, color:r.color, padding:'2px 9px', borderRadius:20, fontSize:11, fontWeight:600, display:'inline-block', whiteSpace:'nowrap', verticalAlign:'middle', ...overflowStyle }}>{r.label}</span>
}

// ── Exportar reportes como imagen PNG ──
// Fondo de red: en el archivo autónomo se inyecta como blob (window.__resources);
// en desarrollo cae a la ruta de la carpeta.
function fondoRedSrc() {
  return (typeof window !== 'undefined' && window.__resources && window.__resources.fondoRed) || './assets/fondo-red.jpg'
}
function loadImgReport(src) {
  return new Promise(res => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = () => res(null); i.src = src })
}
// Descarga el canvas como PDF (se envía/imprime como documento, sin la
// recompresión que WhatsApp aplica a las fotos). Si jsPDF no cargó, cae
// a PNG para no dejar al usuario sin descarga.
function downloadCanvasPNG(canvas, filename) {
  canvas.toBlob(blob => {
    if (!blob) { alert('No se pudo generar la imagen para descargar. Intenta de nuevo.'); return }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }, 'image/png')
}
function downloadCanvas(canvas, filename) {
  const pdfName = filename.replace(/\.png$/i, '.pdf')
  const JsPDFCtor = typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF
  if (!JsPDFCtor) { downloadCanvasPNG(canvas, filename); return }
  try {
    const W = canvas.width / EXPORT_SCALE, H = canvas.height / EXPORT_SCALE
    const doc = new JsPDFCtor({ orientation: W >= H ? 'landscape' : 'portrait', unit: 'px', format: [W, H], compress: true })
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, W, H)
    doc.save(pdfName)
  } catch (e) {
    console.error('No se pudo generar el PDF, se descarga como PNG:', e)
    downloadCanvasPNG(canvas, filename)
  }
}
// Canvas en alta resolución (2x) para que las imágenes descargadas se vean nítidas
// al hacer zoom en WhatsApp o al imprimirlas. El resto del código de dibujo no cambia:
// sigue usando las coordenadas lógicas W/H, ctx.scale() multiplica los píxeles reales.
const EXPORT_SCALE = 2
function makeHiDPICanvas(W, H) {
  const c = document.createElement('canvas')
  c.width = Math.round(W * EXPORT_SCALE); c.height = Math.round(H * EXPORT_SCALE)
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error(`No se pudo crear el canvas de ${c.width}x${c.height}px (posible límite de memoria del navegador)`)
  ctx.scale(EXPORT_SCALE, EXPORT_SCALE)
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'
  return { c, ctx }
}
const REP = { bg:'#0B1A2E', card:'#15263D', cardBorder:'rgba(120,170,230,.16)', text:'#F1F4FA', muted:'#93A6C0', accent:'#3A8FF2', cyan:'#4FD0F5', gold:'#E0A93C', purple:'#A78BFA', green:'#34D399', red:'#F87171' }
function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function wrapText(ctx, text, maxWidth) {
  const words = (text || '').split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w }
    else line = test
  }
  if (line) lines.push(line)
  return lines
}

async function exportNetworkReport(afiliados) {
  const self = afiliados[0]
  const total = afiliados.length
  const activos = afiliados.filter(a => (a.pp||0)+(a.pg||0)>0).length
  const totalPP = afiliados.reduce((s,a)=>s+(a.pp||0),0)
  const totalPG = afiliados.reduce((s,a)=>s+(a.pg||0),0)
  const orosPlus = afiliados.filter(a=>{const r=getRango(a.rango);return r.id.includes('ORO')||r.id.includes('DIAMANTE')||r.id==='PLATINO'}).length
  const profundidad = afiliados.reduce((m,a)=>Math.max(m,a.gen||0),0)
  const conteos = contarPorRango(afiliados)
  const maxN = Math.max(...conteos.map(([,n])=>n),1)
  const W=1080, H=1500
  const { c, ctx } = makeHiDPICanvas(W, H)
  ctx.fillStyle=REP.bg; ctx.fillRect(0,0,W,H)
  // header
  const hH=300
  const img=await loadImgReport(fondoRedSrc())
  if(img){ const ar=img.width/img.height, tr=W/hH; let sw,sh,sx,sy; if(ar>tr){sh=img.height;sw=sh*tr;sx=(img.width-sw)/2;sy=0}else{sw=img.width;sh=sw/tr;sx=0;sy=(img.height-sh)/2}; ctx.drawImage(img,sx,sy,sw,sh,0,0,W,hH) }
  const g=ctx.createLinearGradient(0,0,0,hH); g.addColorStop(0,'rgba(11,26,46,.45)'); g.addColorStop(1,'rgba(11,26,46,.95)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,hH)
  ctx.fillStyle='#3A8FF2'; rrect(ctx,60,70,52,52,13); ctx.fill()
  ctx.strokeStyle='rgba(255,255,255,.9)'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(86,90,11,0,7); ctx.stroke()
  ctx.fillStyle=REP.text; ctx.font='700 38px DM Sans, sans-serif'; ctx.textBaseline='middle'; ctx.fillText('RedNICE', 128, 96)
  ctx.fillStyle=REP.cyan; ctx.font='600 17px DM Sans, sans-serif'; ctx.fillText('REPORTE DE RED', 62, 168)
  ctx.fillStyle=REP.text; ctx.font='700 44px DM Sans, sans-serif'; ctx.fillText(self?self.nombre:'Mi red', 62, 212)
  ctx.fillStyle=REP.muted; ctx.font='400 20px DM Sans, sans-serif'; ctx.fillText(`${self?`EIN ${self.ein} · `:''}${new Date().toLocaleDateString('es-MX',{day:'2-digit',month:'long',year:'numeric'})}`, 62, 252)
  // stat cards 3x2
  const stats=[{l:'Total afiliados',v:total.toLocaleString(),c:REP.accent},{l:'Activos',v:`${activos} · ${total>0?Math.round(activos/total*100):0}%`,c:REP.green},{l:'Rangos Oro+',v:orosPlus.toLocaleString(),c:REP.gold},{l:'PP totales',v:totalPP.toLocaleString(),c:REP.gold},{l:'PG totales',v:totalPG.toLocaleString(),c:REP.purple},{l:'Profundidad',v:`${profundidad} gen.`,c:REP.cyan}]
  const m=60, gap=24, cw=(W-m*2-gap*2)/3, ch=140
  stats.forEach((s,i)=>{ const col=i%3, row=Math.floor(i/3); const x=m+col*(cw+gap), y=hH+40+row*(ch+gap)
    ctx.fillStyle=REP.card; ctx.strokeStyle=REP.cardBorder; ctx.lineWidth=1.5; rrect(ctx,x,y,cw,ch,16); ctx.fill(); ctx.stroke()
    ctx.fillStyle=REP.muted; ctx.font='600 15px DM Sans, sans-serif'; ctx.textBaseline='alphabetic'; ctx.fillText(s.l.toUpperCase(),x+22,y+40)
    ctx.fillStyle=s.c; ctx.font='700 40px DM Sans, sans-serif'; ctx.fillText(s.v,x+22,y+95) })
  // distribución
  let dy=hH+40+2*(ch+gap)+24
  ctx.fillStyle=REP.card; ctx.strokeStyle=REP.cardBorder; ctx.lineWidth=1.5; rrect(ctx,m,dy,W-m*2,H-dy-90,18); ctx.fill(); ctx.stroke()
  ctx.fillStyle=REP.text; ctx.font='700 24px DM Sans, sans-serif'; ctx.fillText('Distribución por rango',m+28,dy+48)
  const RCOLS={'Oro Ejecutivo':REP.gold,'Oro Senior':REP.gold,'Oro Master':REP.gold,'Oro':REP.gold,'Oro Experto':REP.gold,'Oro Premier':REP.gold,'Oro Elite':REP.gold,'Platino':REP.purple,'Diamante':REP.purple,'Plata':REP.accent,'Bronce':'#EA580C','Cobre':'#B45309','Empresario':'#8593AB','Sin Descuento':'#8593AB'}
  const rows=conteos.slice(0,9); const rowH=Math.min(54,(H-dy-160)/rows.length); const barX=m+260, barW=W-m*2-260-90
  rows.forEach(([label,count],i)=>{ const y=dy+88+i*rowH
    ctx.fillStyle=REP.muted; ctx.font='500 18px DM Sans, sans-serif'; ctx.textAlign='right'; ctx.fillText(label,barX-20,y+rowH/2+6); ctx.textAlign='left'
    ctx.fillStyle='rgba(255,255,255,.06)'; rrect(ctx,barX,y+8,barW,rowH-20,8); ctx.fill()
    const w=Math.max(40,(count/maxN)*barW); ctx.fillStyle=RCOLS[label]||'#8593AB'; rrect(ctx,barX,y+8,w,rowH-20,8); ctx.fill()
    ctx.fillStyle='#fff'; ctx.font='700 16px DM Sans, sans-serif'; ctx.fillText(String(count),barX+14,y+rowH/2+6) })
  ctx.fillStyle=REP.muted; ctx.font='400 17px DM Sans, sans-serif'; ctx.textAlign='center'; ctx.fillText('Generado con RedNICE · seguimiento de red NICE',W/2,H-40); ctx.textAlign='left'
  downloadCanvas(c,`RedNICE-reporte-${(self?self.nombre.split(' ')[0]:'red').toLowerCase()}.png`)
}

async function exportAffiliateReport(sel, sig, pct, checks, acciones, pasos) {
  const r=getRango(sel.rango)
  const W=1080, hH=280
  const mc=document.createElement('canvas').getContext('2d')
  const descW=W-120-46
  mc.font='400 17px DM Sans, sans-serif'
  const planLines=(pasos||[]).map(p=>({ p, lines: wrapText(mc, p.desc, descW) }))
  // alto dinámico según contenido
  let H=hH+50
  if(sig) H+=190
  H+=40+(checks||[]).length*72+10
  if((acciones||[]).length) H+=70+acciones.length*78+30
  if(planLines.length){ H+=50; planLines.forEach(({lines})=>{ H+=34+lines.length*24+22 }); H+=20 }
  H+=90
  const { c, ctx } = makeHiDPICanvas(W, H)
  ctx.fillStyle=REP.bg; ctx.fillRect(0,0,W,H)
  const img=await loadImgReport(fondoRedSrc())
  if(img){ const ar=img.width/img.height, tr=W/hH; let sw,sh,sx,sy; if(ar>tr){sh=img.height;sw=sh*tr;sx=(img.width-sw)/2;sy=0}else{sw=img.width;sh=sw/tr;sx=0;sy=(img.height-sh)/2}; ctx.drawImage(img,sx,sy,sw,sh,0,0,W,hH) }
  const g=ctx.createLinearGradient(0,0,0,hH); g.addColorStop(0,'rgba(11,26,46,.5)'); g.addColorStop(1,'rgba(11,26,46,.96)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,hH)
  ctx.fillStyle=REP.cyan; ctx.font='600 17px DM Sans, sans-serif'; ctx.textBaseline='alphabetic'; ctx.fillText('PLAN DE CARRERA · NICE',62,80)
  ctx.fillStyle=REP.text; ctx.font='700 46px DM Sans, sans-serif'; ctx.fillText(sel.nombre.length>26?sel.nombre.slice(0,26)+'…':sel.nombre,62,135)
  ctx.fillStyle=REP.muted; ctx.font='400 20px DM Sans, sans-serif'; ctx.fillText(`EIN ${sel.ein} · Gen. ${sel.gen}${sel.ciudad?` · ${sel.ciudad}`:''}`,62,172)
  ctx.fillStyle=r.color; ctx.font='700 24px DM Sans, sans-serif'; ctx.fillText(`Rango actual: ${r.label}`,62,222)
  // logo del rango (medalla)
  const medalSrc = RANGO_IMG[r.id]
  const medalImg = medalSrc ? await loadImgReport(medalSrc) : null
  if (medalImg) {
    const ms = 150, cx = W - 70 - ms / 2, cy = hH / 2 + 4
    const glow = ctx.createRadialGradient(cx, cy, 8, cx, cy, ms / 2 + 22)
    glow.addColorStop(0, 'rgba(120,200,255,.22)'); glow.addColorStop(1, 'rgba(120,200,255,0)')
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, ms / 2 + 22, 0, 7); ctx.fill()
    ctx.drawImage(medalImg, cx - ms / 2, cy - ms / 2, ms, ms)
  }
  let y=hH+50
  if(sig){
    ctx.fillStyle=REP.card; ctx.strokeStyle=REP.cardBorder; ctx.lineWidth=1.5; rrect(ctx,60,y,W-120,150,18); ctx.fill(); ctx.stroke()
    ctx.fillStyle=REP.text; ctx.font='700 24px DM Sans, sans-serif'; ctx.fillText(`Progreso hacia ${sig.label}`,90,y+50)
    ctx.fillStyle=pct>=100?REP.green:REP.accent; ctx.font='700 40px DM Sans, sans-serif'; ctx.textAlign='right'; ctx.fillText(`${pct}%`,W-90,y+55); ctx.textAlign='left'
    ctx.fillStyle='rgba(255,255,255,.08)'; rrect(ctx,90,y+85,W-180,22,11); ctx.fill()
    ctx.fillStyle=pct>=100?REP.green:REP.accent; rrect(ctx,90,y+85,Math.max(22,(W-180)*pct/100),22,11); ctx.fill()
    y+=190
  }
  // requisitos
  ctx.fillStyle=REP.text; ctx.font='700 26px DM Sans, sans-serif'; ctx.fillText('Requisitos del siguiente rango',62,y+10); y+=40
  ;(checks||[]).forEach(it=>{ ctx.fillStyle=it.ok?REP.green:REP.red; ctx.beginPath(); ctx.arc(78,y+14,13,0,7); ctx.fill(); ctx.fillStyle='#0B1A2E'; ctx.font='700 16px DM Sans, sans-serif'; ctx.fillText(it.ok?'✓':'!',73,y+20)
    ctx.fillStyle=REP.text; ctx.font='600 20px DM Sans, sans-serif'; ctx.fillText(it.txt.length>62?it.txt.slice(0,62)+'…':it.txt,104,y+12)
    ctx.fillStyle=REP.muted; ctx.font='400 16px DM Sans, sans-serif'; ctx.fillText((it.sub||'').length>72?it.sub.slice(0,72)+'…':(it.sub||''),104,y+38); y+=72 })
  y+=10
  // esta semana
  if((acciones||[]).length){
    ctx.fillStyle=REP.card; ctx.strokeStyle=REP.cardBorder; ctx.lineWidth=1.5; const cardH=70+acciones.length*78; rrect(ctx,60,y,W-120,cardH,18); ctx.fill(); ctx.stroke()
    const grad=ctx.createLinearGradient(60,y,W-60,y+56); grad.addColorStop(0,'#0E7FB8'); grad.addColorStop(1,'#2563EB')
    ctx.save(); rrect(ctx,60,y,W-120,56,18); ctx.clip(); ctx.fillStyle=grad; ctx.fillRect(60,y,W-120,56); ctx.restore()
    ctx.fillStyle='#fff'; ctx.font='700 21px DM Sans, sans-serif'; ctx.fillText('Personas a contactar',90,y+36)
    let ay=y+90
    acciones.forEach((a,i)=>{ ctx.fillStyle='rgba(58,143,242,.18)'; rrect(ctx,90,ay-22,34,34,9); ctx.fill(); ctx.fillStyle=REP.accent; ctx.font='700 18px DM Sans, sans-serif'; ctx.fillText(String(i+1),101,ay+2)
      ctx.fillStyle=REP.text; ctx.font='600 20px DM Sans, sans-serif'; ctx.fillText(a.t.length>58?a.t.slice(0,58)+'…':a.t,140,ay-2)
      ctx.fillStyle=REP.muted; ctx.font='400 16px DM Sans, sans-serif'; ctx.fillText((a.s||'').length>70?a.s.slice(0,70)+'…':(a.s||''),140,ay+24); ay+=78 })
    y+=cardH+30
  }
  // plan de acción personalizado
  if(planLines.length){
    ctx.fillStyle=REP.text; ctx.font='700 26px DM Sans, sans-serif'; ctx.textBaseline='alphabetic'; ctx.fillText('Plan de acción personalizado',62,y+10); y+=46
    planLines.forEach(({p,lines},i)=>{
      ctx.fillStyle=p.color||'#2563EB'; ctx.beginPath(); ctx.arc(78,y+10,15,0,7); ctx.fill()
      ctx.fillStyle='#fff'; ctx.font='700 17px DM Sans, sans-serif'; ctx.textAlign='center'; ctx.fillText(String(p.num||i+1),78,y+16); ctx.textAlign='left'
      ctx.fillStyle=REP.text; ctx.font='700 20px DM Sans, sans-serif'; ctx.fillText(p.title.length>54?p.title.slice(0,54)+'…':p.title,108,y+16)
      let ly=y+44
      ctx.fillStyle=REP.muted; ctx.font='400 17px DM Sans, sans-serif'
      lines.forEach(ln=>{ ctx.fillText(ln,108,ly); ly+=24 })
      y=ly+12
    })
    y+=8
  }
  ctx.fillStyle=REP.muted; ctx.font='400 17px DM Sans, sans-serif'; ctx.textAlign='center'; ctx.fillText('Generado con RedNICE · plan de carrera NICE 2025',W/2,H-40); ctx.textAlign='left'
  downloadCanvas(c,`RedNICE-plan-${sel.nombre.split(' ')[0].toLowerCase()}.png`)
}

// ── Exportar el árbol genealógico visible (horizontal/landscape, multi-página si es grande) ──
function contarHojasFiltrado(node, pasaFiltro) {
  const kids = (node.children || []).filter(c => !pasaFiltro || pasaFiltro(c))
  if (!kids.length) return 1
  return kids.reduce((s, k) => s + contarHojasFiltrado(k, pasaFiltro), 0)
}
function contarNodosFiltrado(node, pasaFiltro) {
  const kids = (node.children || []).filter(c => !pasaFiltro || pasaFiltro(c))
  return 1 + kids.reduce((s, k) => s + contarNodosFiltrado(k, pasaFiltro), 0)
}

// Dibuja UNA página del árbol (una o varias ramas lado a lado) y devuelve su canvas.
// header.tipo === 'completo' → encabezado grande con foto de red y datos del afiliado raíz (solo 1ª página).
// header.tipo === 'continuacion' → encabezado angosto indicando de qué raíz original viene y en qué página va.
async function drawArbolPagina(raicesPagina, pasaFiltro, header) {
  const placed = []
  const byEin = {}
  const counter = { v: 0 }
  function layout(node, depth) {
    const kids = (node.children || []).filter(c => !pasaFiltro || pasaFiltro(c))
    let gx
    if (!kids.length) { gx = counter.v; counter.v += 1 }
    else { const xs = kids.map(k => layout(k, depth + 1)); gx = (xs[0] + xs[xs.length - 1]) / 2 }
    const rec = { a: node, depth, gx, kids }
    placed.push(rec); byEin[node.ein] = rec
    return gx
  }
  raicesPagina.forEach(r => layout(r, 0))
  const leaves = Math.max(1, counter.v)
  const maxDepth = placed.reduce((m, p) => Math.max(m, p.depth), 0)

  const PAD = 90
  const HEADER = header.tipo === 'completo' ? 240 : 110
  let spacingX = 150
  let treeW = leaves * spacingX
  const MAXW = 14000 / EXPORT_SCALE // límite en px lógicos: el canvas físico final (×EXPORT_SCALE) se mantiene ≤14000px para no exceder límites de canvas/memoria en navegadores móviles
  if (treeW > MAXW) { spacingX = MAXW / leaves; treeW = MAXW }
  const radius = Math.max(12, Math.min(28, spacingX * 0.3))
  const levelH = 165
  const W = Math.max(1400, Math.round(treeW + PAD * 2))
  const H = HEADER + (maxDepth + 1) * levelH + PAD
  const X = gx => PAD + (gx + 0.5) * spacingX
  const Y = depth => HEADER + 50 + depth * levelH

  const srcs = [...new Set(placed.map(p => RANGO_IMG[getRango(p.a.rango).id]).filter(Boolean))]
  const medals = {}
  await Promise.all(srcs.map(async s => { medals[s] = await loadImgReport(s) }))

  const { c, ctx } = makeHiDPICanvas(W, H)
  ctx.fillStyle = REP.bg; ctx.fillRect(0, 0, W, H)
  ctx.textBaseline = 'alphabetic'

  if (header.tipo === 'completo') {
    const raiz = header.raiz
    const r = getRango(raiz.rango)
    const img = await loadImgReport(fondoRedSrc())
    if (img) { const ar = img.width / img.height, tr = W / HEADER; let sw, sh, sx, sy; if (ar > tr) { sh = img.height; sw = sh * tr; sx = (img.width - sw) / 2; sy = 0 } else { sw = img.width; sh = sw / tr; sx = 0; sy = (img.height - sh) / 2 } ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, HEADER) }
    const g = ctx.createLinearGradient(0, 0, 0, HEADER); g.addColorStop(0, 'rgba(11,26,46,.55)'); g.addColorStop(1, 'rgba(11,26,46,.94)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HEADER)
    ctx.fillStyle = REP.cyan; ctx.font = '600 17px DM Sans, sans-serif'; ctx.fillText('GENEALOGÍA · NICE', PAD, 74)
    ctx.fillStyle = REP.text; ctx.font = '700 44px DM Sans, sans-serif'; ctx.fillText(raiz.nombre.length > 32 ? raiz.nombre.slice(0, 32) + '…' : raiz.nombre, PAD, 126)
    ctx.fillStyle = REP.muted; ctx.font = '400 20px DM Sans, sans-serif'; ctx.fillText(`EIN ${raiz.ein} · Gen. ${raiz.gen}${raiz.ciudad ? ` · ${raiz.ciudad}` : ''}`, PAD, 162)
    ctx.fillStyle = r.color; ctx.font = '700 23px DM Sans, sans-serif'; ctx.fillText(`Rango actual: ${r.label}`, PAD, 200)
    ctx.font = '600 18px DM Sans, sans-serif'
    const chip = (txt, cx, col) => { const w = ctx.measureText(txt).width + 32; ctx.fillStyle = 'rgba(13,30,48,.55)'; ctx.strokeStyle = 'rgba(120,200,255,.3)'; ctx.lineWidth = 1.5; rrect(ctx, cx, 60, w, 36, 18); ctx.fill(); ctx.stroke(); ctx.fillStyle = col; ctx.fillText(txt, cx + 16, 84); return cx + w + 10 }
    let chx = W - PAD - 360
    const medalRaiz = RANGO_IMG[r.id] ? medals[RANGO_IMG[r.id]] || await loadImgReport(RANGO_IMG[r.id]) : null
    if (medalRaiz) { const ms = 130, mcx = W - PAD - ms / 2, mcy = HEADER / 2; const glow = ctx.createRadialGradient(mcx, mcy, 6, mcx, mcy, ms / 2 + 18); glow.addColorStop(0, 'rgba(120,200,255,.22)'); glow.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(mcx, mcy, ms / 2 + 18, 0, 7); ctx.fill(); ctx.drawImage(medalRaiz, mcx - ms / 2, mcy - ms / 2, ms, ms); chx = W - PAD - ms - 380 }
    chip(`${header.totalNodos.toLocaleString()} afiliados en el árbol`, chx, REP.text)
    if (header.totalPaginas > 1) {
      ctx.fillStyle = REP.muted; ctx.font = '600 14px DM Sans, sans-serif'; ctx.textAlign = 'right'
      ctx.fillText(`Red grande — dividida en ${header.totalPaginas} páginas · página 1`, W - PAD, HEADER - 14)
      ctx.textAlign = 'left'
    }
  } else {
    ctx.fillStyle = REP.card; ctx.fillRect(0, 0, W, HEADER)
    ctx.fillStyle = REP.cyan; ctx.font = '600 15px DM Sans, sans-serif'; ctx.fillText('GENEALOGÍA · NICE — continuación', PAD, 40)
    ctx.fillStyle = REP.text; ctx.font = '700 22px DM Sans, sans-serif'
    ctx.fillText(`${header.raizOriginal.nombre} · página ${header.paginaNum} de ${header.totalPaginas}`, PAD, 74)
    ctx.fillStyle = REP.muted; ctx.font = '400 14px DM Sans, sans-serif'
    ctx.fillText(`Continúa la(s) rama(s) de: ${raicesPagina.map(r => r.nombre.split(' ')[0]).join(', ')}`, PAD, 96)
  }

  // Conectores (cian) — de cada padre a sus hijos visibles
  ctx.strokeStyle = 'rgba(79,208,245,.5)'; ctx.lineWidth = Math.max(1.5, radius * 0.12)
  placed.forEach(p => {
    if (!p.kids.length) return
    const px = X(p.gx), py = Y(p.depth) + radius
    const midY = py + (levelH - radius * 2) * 0.5
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, midY); ctx.stroke()
    p.kids.forEach(k => { const kr = byEin[k.ein]; const kx = X(kr.gx), ky = Y(kr.depth) - radius
      ctx.beginPath(); ctx.moveTo(kx, midY); ctx.lineTo(kx, ky); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(px, midY); ctx.lineTo(kx, midY); ctx.stroke() })
  })

  // Nodos
  const raizPrincipalEin = header.tipo === 'completo' ? header.raiz.ein : null
  placed.forEach(p => {
    const rr = getRango(p.a.rango)
    const cx = X(p.gx), cy = Y(p.depth)
    const activo = ((p.a.pp || 0) + (p.a.pg || 0)) > 0
    const esOro = rr.id.includes('ORO') || rr.id === 'PLATINO' || rr.id.includes('DIAMANTE')
    if (esOro || activo) { const glow = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius + 10); const gc = esOro ? rr.color : '#4FD0F5'; glow.addColorStop(0, gc + '55'); glow.addColorStop(1, gc + '00'); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, radius + 10, 0, 7); ctx.fill() }
    ctx.fillStyle = '#16263B'; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, 7); ctx.fill()
    ctx.lineWidth = 2.5; ctx.strokeStyle = p.a.ein === raizPrincipalEin ? '#4FD0F5' : (activo ? rr.color : '#41506A'); ctx.stroke()
    const medal = RANGO_IMG[rr.id] ? medals[RANGO_IMG[rr.id]] : null
    if (medal) { const ms = radius * 1.7; ctx.drawImage(medal, cx - ms / 2, cy - ms / 2, ms, ms) }
    else { ctx.fillStyle = rr.color; ctx.font = `700 ${Math.round(radius * 0.7)}px DM Sans, sans-serif`; ctx.textAlign = 'center'; ctx.fillText(getInitials(p.a.nombre), cx, cy + radius * 0.25); ctx.textAlign = 'left' }
    ctx.fillStyle = activo ? '#34D399' : '#41506A'; ctx.beginPath(); ctx.arc(cx + radius * 0.72, cy + radius * 0.72, radius * 0.22, 0, 7); ctx.fill()
    ctx.textAlign = 'center'
    ctx.fillStyle = rr.color; ctx.font = `700 ${Math.max(10, Math.round(radius * 0.42))}px DM Sans, sans-serif`; ctx.fillText(rr.label, cx, cy + radius + 18)
    ctx.fillStyle = REP.text; ctx.font = `600 ${Math.max(10, Math.round(radius * 0.44))}px DM Sans, sans-serif`
    const nm = p.a.nombre.split(' ').slice(0, 2).join(' ')
    ctx.fillText(nm.length > 18 ? nm.slice(0, 18) + '…' : nm, cx, cy + radius + 18 + Math.max(13, radius * 0.5))
    ctx.textAlign = 'left'
  })

  ctx.fillStyle = REP.muted; ctx.font = '400 17px DM Sans, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Generado con RedNICE · genealogía NICE', W / 2, H - 34); ctx.textAlign = 'left'
  return { c, W, H }
}

async function exportTreeReport(raiz, pasaFiltro, extra) {
  if (!raiz) return
  const SAFE_LEAVES = 22 // hojas por página: mantiene cada canvas dentro de límites seguros de memoria/GPU en celulares
  const hijosRaiz = (raiz.children || []).filter(c => !pasaFiltro || pasaFiltro(c))
  const hojasTotales = contarHojasFiltrado(raiz, pasaFiltro)
  const totalNodos = contarNodosFiltrado(raiz, pasaFiltro)

  let gruposRamas = null
  if (hojasTotales > SAFE_LEAVES && hijosRaiz.length > 0) {
    gruposRamas = []
    let bucket = [], hojasBucket = 0
    for (const hijo of hijosRaiz) {
      const hj = contarHojasFiltrado(hijo, pasaFiltro)
      if (bucket.length && (hojasBucket + hj) > SAFE_LEAVES) { gruposRamas.push(bucket); bucket = []; hojasBucket = 0 }
      bucket.push(hijo); hojasBucket += hj
    }
    if (bucket.length) gruposRamas.push(bucket)
  }

  const paginas = []
  if (!gruposRamas) {
    paginas.push({ raices: [raiz], header: { tipo: 'completo', raiz, totalNodos, totalPaginas: 1 } })
  } else {
    const totalPaginas = gruposRamas.length
    paginas.push({ raices: [{ ...raiz, children: gruposRamas[0] }], header: { tipo: 'completo', raiz, totalNodos, totalPaginas } })
    for (let i = 1; i < gruposRamas.length; i++) {
      paginas.push({ raices: gruposRamas[i], header: { tipo: 'continuacion', raizOriginal: raiz, paginaNum: i + 1, totalPaginas } })
    }
  }

  const canvases = []
  for (const pg of paginas) canvases.push(await drawArbolPagina(pg.raices, pasaFiltro, pg.header))

  const filenameBase = `RedNICE-arbol-${raiz.nombre.split(' ')[0].toLowerCase()}`
  if (canvases.length === 1) { downloadCanvas(canvases[0].c, `${filenameBase}.png`); return }

  // Varias páginas: se arma un solo PDF con una página por imagen.
  // Si jsPDF no cargó o falla, se descarga cada página como PNG por separado (nunca se queda sin nada).
  const JsPDFCtor = typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF
  const descargarPorSeparado = () => canvases.forEach((pg, i) => downloadCanvasPNG(pg.c, `${filenameBase}-pagina-${i + 1}-de-${canvases.length}.png`))
  if (!JsPDFCtor) { descargarPorSeparado(); return }
  try {
    const first = canvases[0]
    const doc = new JsPDFCtor({ orientation: first.W >= first.H ? 'landscape' : 'portrait', unit: 'px', format: [first.W, first.H], compress: true })
    doc.addImage(first.c.toDataURL('image/png'), 'PNG', 0, 0, first.W, first.H)
    for (let i = 1; i < canvases.length; i++) {
      const pg = canvases[i]
      doc.addPage([pg.W, pg.H], pg.W >= pg.H ? 'landscape' : 'portrait')
      doc.addImage(pg.c.toDataURL('image/png'), 'PNG', 0, 0, pg.W, pg.H)
    }
    doc.save(`${filenameBase}.pdf`)
  } catch (e) {
    console.error('No se pudo generar el PDF multi-página, se descarga cada página como PNG:', e)
    descargarPorSeparado()
  }
}

// ════════════ CERTIFICADOS NICE ════════════
function certTheme(rangoId) {
  const T = {
    empresario: { metal:['#4E6C88','#CFE2F2','#36506A'], accent:'#C4DDF2', tier:'empresario', glow:'rgba(60,110,160,' },
    cobre:      { metal:['#7C3A12','#ECB98C','#5E2C0E'], accent:'#F0C49A', tier:'cobre', glow:'rgba(150,80,30,' },
    bronce:     { metal:['#8A5A2B','#F0D3A8','#6B421C'], accent:'#F2D6AE', tier:'bronce', glow:'rgba(160,100,45,' },
    plata:      { metal:['#6B7B8C','#E6EEF6','#46535F'], accent:'#E0EAF4', tier:'plata', glow:'rgba(120,140,165,' },
    oro:        { metal:['#8A6A1E','#F8E9AC','#B8901F'], accent:'#F6E3A2', tier:'oro', glow:'rgba(210,170,60,' },
    platino:    { metal:['#6E5E8C','#E8DEF4','#4A3C64'], accent:'#E6D8F4', tier:'platino', glow:'rgba(140,110,190,' },
    diamante:   { metal:['#3A4F8C','#D4E4FB','#243466'], accent:'#C6DDFB', tier:'diamante', glow:'rgba(90,130,230,' },
  }
  const id = rangoId
  if (id === 'SIN' || id === 'EIN') return T.empresario
  if (id === 'COBRE') return T.cobre
  if (id === 'BRONCE') return T.bronce
  if (id === 'PLATA') return T.plata
  if (id === 'PLATINO') return T.platino
  if (id.includes('DIAMANTE')) return T.diamante
  return T.oro
}

function drawRosette(ctx, cx, cy, R, col) {
  ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = col; ctx.strokeStyle = col
  ctx.lineWidth = R * 0.1
  ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.stroke()
  for (let i = 0; i < 8; i++) {
    ctx.save(); ctx.rotate(i * Math.PI / 4)
    ctx.beginPath(); ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(R * 0.27, -R * 0.34, 0, -R * 0.80)
    ctx.quadraticCurveTo(-R * 0.27, -R * 0.34, 0, 0)
    ctx.fill(); ctx.restore()
  }
  ctx.beginPath(); ctx.arc(0, 0, R * 0.17, 0, 7); ctx.fill()
  ctx.restore()
}

function fitFont(ctx, text, build, startPx, maxW, minPx) {
  let px = startPx
  while (px > (minPx || 14)) { ctx.font = build(px); if (ctx.measureText(text).width <= maxW) break; px -= 2 }
  return px
}

// Pequeño adorno de filigrana (línea con punto rómbico) a los lados de un texto
function flourish(ctx, cx, y, w, col) {
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.2
  ;[-1, 1].forEach(s => {
    ctx.beginPath(); ctx.moveTo(cx + s * 26, y); ctx.lineTo(cx + s * (26 + w), y); ctx.stroke()
    ctx.save(); ctx.translate(cx + s * (26 + w + 7), y); ctx.rotate(Math.PI / 4); ctx.fillRect(-3, -3, 6, 6); ctx.restore()
  })
}

function drawGem(ctx, x, y, s, col) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'
  const top = y - s * 0.5, bot = y + s * 0.62, ty = y - s * 0.16
  const l = x - s * 0.5, r = x + s * 0.5
  ctx.beginPath(); ctx.moveTo(l, ty); ctx.lineTo(x - s * 0.28, top); ctx.lineTo(x + s * 0.28, top); ctx.lineTo(r, ty); ctx.lineTo(x, bot); ctx.closePath(); ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(l, ty); ctx.lineTo(r, ty)
  ctx.moveTo(x - s * 0.28, top); ctx.lineTo(x - s * 0.1, ty); ctx.lineTo(x, bot)
  ctx.moveTo(x + s * 0.28, top); ctx.lineTo(x + s * 0.1, ty); ctx.lineTo(x, bot)
  ctx.moveTo(x - s * 0.1, ty); ctx.lineTo(x + s * 0.1, ty)
  ctx.stroke(); ctx.restore()
}

function drawRibbon(ctx, cx, y, w, h, metal, text, textCol) {
  const g = ctx.createLinearGradient(cx - w / 2, y, cx + w / 2, y)
  g.addColorStop(0, metal[2]); g.addColorStop(0.5, metal[1]); g.addColorStop(1, metal[2])
  // colas laterales (más oscuras)
  ctx.fillStyle = metal[2]
  ctx.beginPath(); ctx.moveTo(cx - w / 2 + 6, y - h / 2); ctx.lineTo(cx - w / 2 - 26, y - h / 2 - 7); ctx.lineTo(cx - w / 2 - 16, y); ctx.lineTo(cx - w / 2 - 26, y + h / 2 + 7); ctx.lineTo(cx - w / 2 + 6, y + h / 2); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx + w / 2 - 6, y - h / 2); ctx.lineTo(cx + w / 2 + 26, y - h / 2 - 7); ctx.lineTo(cx + w / 2 + 16, y); ctx.lineTo(cx + w / 2 + 26, y + h / 2 + 7); ctx.lineTo(cx + w / 2 - 6, y + h / 2); ctx.closePath(); ctx.fill()
  // banda principal
  ctx.fillStyle = g
  ctx.beginPath(); ctx.moveTo(cx - w / 2, y - h / 2); ctx.lineTo(cx + w / 2, y - h / 2); ctx.lineTo(cx + w / 2 - 12, y); ctx.lineTo(cx + w / 2, y + h / 2); ctx.lineTo(cx - w / 2, y + h / 2); ctx.lineTo(cx - w / 2 + 12, y); ctx.closePath(); ctx.fill()
  ctx.fillStyle = textCol; ctx.font = '700 16px "DM Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  try { ctx.letterSpacing = '4px' } catch (e) {}
  ctx.fillText(text, cx + 2, y + 1)
  try { ctx.letterSpacing = '0px' } catch (e) {}
  ctx.textBaseline = 'alphabetic'
}

async function generarCertificadoCanvas(afiliado, rangoId, fotoDataUrl, coemp) {
  const W = 1240, H = 900
  const { c, ctx } = makeHiDPICanvas(W, H)
  const r = RANGOS.find(x => x.id === rangoId) || getRango(afiliado.rango)
  const th = certTheme(r.id)
  const cx = W / 2
  const ink = '#F5EEDA', inkSoft = '#A9B7CC'
  const mg = (x0, y0, x1, y1) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, th.metal[0]); g.addColorStop(0.5, th.metal[1]); g.addColorStop(1, th.metal[2]); return g }
  try {
    await Promise.all([
      document.fonts.load('700 60px "Playfair Display"'),
      document.fonts.load('italic 700 60px "Playfair Display"'),
      document.fonts.load('400 40px "Playfair Display"'),
      document.fonts.load('400 70px "Great Vibes"'),
    ]); await document.fonts.ready
  } catch (e) {}

  // 1) Fondo de red premium oscuro con viñeta y tinte
  const bg = await loadImgReport(fondoRedSrc())
  if (bg) { const ar = bg.width / bg.height, tr = W / H; let sw, sh, sx, sy; if (ar > tr) { sh = bg.height; sw = sh * tr; sx = (bg.width - sw) / 2; sy = 0 } else { sw = bg.width; sh = sw / tr; sx = 0; sy = (bg.height - sh) / 2 }; ctx.drawImage(bg, sx, sy, sw, sh, 0, 0, W, H) }
  else { ctx.fillStyle = '#0B1A2E'; ctx.fillRect(0, 0, W, H) }
  let ov = ctx.createLinearGradient(0, 0, 0, H); ov.addColorStop(0, 'rgba(7,13,26,.52)'); ov.addColorStop(0.5, 'rgba(6,11,22,.74)'); ov.addColorStop(1, 'rgba(5,9,20,.92)'); ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H)
  let cgl = ctx.createRadialGradient(cx, H * 0.52, 60, cx, H * 0.52, W * 0.62); cgl.addColorStop(0, 'rgba(5,10,22,.5)'); cgl.addColorStop(1, 'rgba(5,10,22,0)'); ctx.fillStyle = cgl; ctx.fillRect(0, 0, W, H)
  let tgl = ctx.createRadialGradient(cx, 90, 20, cx, 90, W * 0.55); tgl.addColorStop(0, th.glow + '.24)'); tgl.addColorStop(1, th.glow + '0)'); ctx.fillStyle = tgl; ctx.fillRect(0, 0, W, H)

  // 2) Marco metálico doble + filigrana
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  const i1 = 30
  ctx.strokeStyle = mg(i1, i1, W - i1, H - i1); ctx.lineWidth = 3.5; rrect(ctx, i1, i1, W - i1 * 2, H - i1 * 2, 8); ctx.stroke()
  ctx.strokeStyle = th.accent; ctx.globalAlpha = 0.55; ctx.lineWidth = 1; rrect(ctx, i1 + 9, i1 + 9, W - (i1 + 9) * 2, H - (i1 + 9) * 2, 5); ctx.stroke(); ctx.globalAlpha = 1
  ;[[i1 + 30, i1 + 30], [W - i1 - 30, i1 + 30], [i1 + 30, H - i1 - 30], [W - i1 - 30, H - i1 - 30]].forEach(([x, y]) => drawRosette(ctx, x, y, 11, th.metal[1]))

  const hasPhoto = !!fotoDataUrl

  // 3) Wordmark NICE arriba a la derecha
  ctx.font = '700 30px "Playfair Display", Georgia, serif'
  const nmW = ctx.measureText('NICE').width
  drawRosette(ctx, W - i1 - 60 - nmW - 16, 96, 15, th.accent)
  ctx.fillStyle = ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('NICE', W - i1 - 56 - nmW, 98)
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'

  // 4) Medalla con listón
  const mcx = hasPhoto ? 792 : cx, mcy = 226, ms = 200
  const medalSrc = RANGO_IMG[r.id]
  const medal = medalSrc ? await loadImgReport(medalSrc) : null
  const mglow = ctx.createRadialGradient(mcx, mcy, 10, mcx, mcy, ms * 0.62); mglow.addColorStop(0, th.glow + '.38)'); mglow.addColorStop(1, th.glow + '0)'); ctx.fillStyle = mglow; ctx.beginPath(); ctx.arc(mcx, mcy, ms * 0.62, 0, 7); ctx.fill()
  if (medal) ctx.drawImage(medal, mcx - ms / 2, mcy - ms / 2, ms, ms)
  else { ctx.fillStyle = mg(mcx - 70, mcy - 70, mcx + 70, mcy + 70); ctx.beginPath(); ctx.arc(mcx, mcy, 70, 0, 7); ctx.fill(); drawRosette(ctx, mcx, mcy, 34, '#fff') }
  drawRibbon(ctx, mcx, mcy + ms / 2 + 6, 150, 30, th.metal, 'NICE', '#1A2238')

  // 5) Foto ovalada grande, aro delgado, fondo transparente
  if (hasPhoto) {
    const foto = await loadImgReport(fotoDataUrl)
    if (foto) {
      const ox = 322, oy = 256, rx = 126, ry = 156
      ctx.save(); ctx.beginPath(); ctx.ellipse(ox, oy, rx, ry, 0, 0, 7); ctx.clip()
      const ar = foto.width / foto.height, tr = rx / ry; let sw, sh, sx, sy
      if (ar > tr) { sh = foto.height; sw = sh * tr; sx = (foto.width - sw) / 2; sy = 0 } else { sw = foto.width; sh = sw / tr; sx = 0; sy = (foto.height - sh) / 2 }
      ctx.drawImage(foto, sx, sy, sw, sh, ox - rx, oy - ry, rx * 2, ry * 2); ctx.restore()
      ctx.strokeStyle = mg(ox - rx, oy - ry, ox + rx, oy + ry); ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(ox, oy, rx, ry, 0, 0, 7); ctx.stroke()
    }
  }

  // 6) Bloque central: Felicidades · nombre · leyenda · rango
  let y = 492
  ctx.save(); ctx.shadowColor = th.glow + '.5)'; ctx.shadowBlur = 16
  ctx.font = '400 72px "Great Vibes", cursive'; ctx.fillStyle = mg(0, y - 56, 0, y + 12); ctx.fillText('Felicidades', cx, y); ctx.restore()
  // nombre (+ coempresario)
  y += 76
  const base = (afiliado.nombre || '').split(' ').slice(0, 2).map(s => s.charAt(0) + s.slice(1).toLowerCase()).join(' ')
  const nombre = coemp && coemp.trim() ? `${base} & ${coemp.trim()}` : base
  const npx = fitFont(ctx, nombre, p => `400 ${p}px "Playfair Display", Georgia, serif`, 46, W - 320, 24)
  ctx.fillStyle = ink; ctx.font = `400 ${npx}px "Playfair Display", Georgia, serif`; ctx.fillText(nombre, cx, y)
  // subrayado
  const lw = Math.min(440, ctx.measureText(nombre).width / 2 + 60)
  y += 20; ctx.strokeStyle = mg(cx - lw, y, cx + lw, y); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - lw, y); ctx.lineTo(cx + lw, y); ctx.stroke()
  // leyenda
  y += 38; ctx.fillStyle = inkSoft; ctx.font = '400 22px "Playfair Display", Georgia, serif'; ctx.fillText('Por alcanzar el Rango de', cx, y)
  // rango (italic serif metálico con resplandor)
  y += 64; const rlabel = r.label
  const rpx = fitFont(ctx, rlabel, p => `italic 700 ${p}px "Playfair Display", Georgia, serif`, 58, W - 340, 30)
  ctx.font = `italic 700 ${rpx}px "Playfair Display", Georgia, serif`
  ctx.save(); ctx.shadowColor = th.glow + '.55)'; ctx.shadowBlur = 22; ctx.fillStyle = mg(0, y - rpx, 0, y + 6); ctx.fillText(rlabel, cx, y); ctx.restore()
  // adorno bajo el rango
  y += 26; flourish(ctx, cx, y, 130, th.accent); drawRosette(ctx, cx, y, 6, th.accent)

  // 7) Branding Mentes Maestras (abajo izquierda)
  const lx = i1 + 56, ly = H - i1 - 70
  drawGem(ctx, lx, ly + 2, 40, th.metal[1])
  ctx.textAlign = 'left'
  ctx.fillStyle = ink; ctx.font = '700 26px "DM Sans", sans-serif'
  try { ctx.letterSpacing = '1px' } catch (e) {}
  ctx.fillText('MENTES', lx + 34, ly - 4)
  ctx.fillStyle = inkSoft; ctx.font = '500 15px "DM Sans", sans-serif'
  try { ctx.letterSpacing = '7px' } catch (e) {}
  ctx.fillText('MAESTRAS', lx + 35, ly + 18)
  try { ctx.letterSpacing = '0px' } catch (e) {}
  ctx.textAlign = 'center'

  // 8) Firma (abajo derecha) + folio
  const sx = W - 256, sy = H - i1 - 64
  ctx.fillStyle = ink; ctx.font = '400 40px "Great Vibes", cursive'; ctx.fillText('Alejandro Litchi', sx, sy)
  ctx.strokeStyle = inkSoft; ctx.globalAlpha = 0.6; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx - 96, sy + 16); ctx.lineTo(sx + 96, sy + 16); ctx.stroke(); ctx.globalAlpha = 1
  ctx.fillStyle = ink; ctx.font = '700 14px "DM Sans", sans-serif'
  try { ctx.letterSpacing = '1px' } catch (e) {}
  ctx.fillText('ALEJANDRO LITCHI', sx, sy + 36)
  ctx.fillStyle = inkSoft; ctx.font = '600 10.5px "DM Sans", sans-serif'; ctx.fillText('PRESIDENTE EJECUTIVO', sx, sy + 53)
  try { ctx.letterSpacing = '0px' } catch (e) {}
  ctx.fillStyle = th.accent; ctx.globalAlpha = 0.7; ctx.font = '500 10px "DM Sans", sans-serif'; ctx.textAlign = 'center'
  ctx.fillText(`FOLIO NICE-${(afiliado.ein || '').replace(/\D/g, '') || '0000'}-${new Date().getFullYear()}`, cx, H - i1 - 14)
  ctx.globalAlpha = 1; ctx.textAlign = 'center'

  return c
}

const ANUNCIO_TIPOS = ['Collar', 'Anillo', 'Pulsera', 'Aretes', 'Dije', 'Esclava', 'Juego/Set', 'Tobillera', 'Otro']
const ANUNCIO_PLATAFORMAS = ['Instagram', 'Facebook', 'TikTok', 'WhatsApp']
const ANUNCIO_TONOS = ['Elegante y emocional', 'Juvenil y fresco', 'Lujo y exclusividad', 'Cercano y amigable', 'Directo y vendedor']
const ANUNCIO_URGENCIA = ['Sin urgencia', 'Disponible hasta agotar existencias', 'Oferta por tiempo limitado', 'Solo esta semana']
const ANUNCIO_OCASIONES = ['Regalo o uso diario', 'Regalo de cumpleaños', 'Día de las Madres', 'San Valentín / amor', 'Aniversario', 'Navidad y fin de año', 'Graduación', 'Bodas y XV años', 'Regalo para consentirse', 'Uso diario / oficina', 'Eventos y fiestas']
const ANUNCIO_EMOCIONES = ['Elegancia y seguridad', 'Amor y cariño', 'Sentirse especial y única', 'Confianza y empoderamiento', 'Lujo y exclusividad', 'Nostalgia y recuerdos', 'Alegría y celebración', 'Feminidad y delicadeza', 'Estatus y éxito', 'Gratitud y aprecio']
const ANUNCIO_BENEFICIOS = ['Resalta el estilo sin gastar demasiado', 'Combina con cualquier outfit', 'No se oxida ni se decolora', 'Resistente al agua y al uso diario', 'Te hace lucir elegante al instante', 'Un regalo que siempre queda bien', 'Calidad de joyería fina a precio accesible', 'Realza tu belleza natural', 'Cómoda y ligera todo el día', 'Hipoalergénica, ideal para piel sensible']
const ANUNCIO_DIFERENCIADORES = ['Diseño moderno, empaque bonito y precio accesible', 'Acero inoxidable que no se oxida ni mancha la piel', 'Garantía de calidad NICE', 'Diseños exclusivos de temporada', 'Empaque premium listo para regalar', 'Joyería resistente al agua y duradera', 'Estilo europeo a precio mexicano', 'Materiales hipoalergénicos de alta calidad', 'Piezas únicas y de edición limitada']
const ANUNCIO_PROMOCIONES = ['Sin promoción', 'Envío gratis por tiempo limitado', '2x1 en piezas seleccionadas', '10% de descuento en tu primera compra', '3 piezas con precio especial', 'Regalo sorpresa en tu compra', 'Meses sin intereses', 'Descuento por apartado anticipado']

function PanelAnuncios() {
  const [form, setForm] = useState({
    tipo_joyeria: 'Collar',
    material: 'Acero inoxidable, resistente al agua',
    cliente_ideal: 'Mujeres jóvenes que buscan accesorios elegantes',
    ocasion: 'Regalo o uso diario',
    emocion: 'Elegancia y seguridad',
    beneficio: 'Resalta el estilo sin gastar demasiado',
    diferenciador: 'Diseño moderno, empaque bonito y precio accesible',
    promocion: 'Envío gratis por tiempo limitado',
    urgencia: 'Disponible hasta agotar existencias',
    plataforma: 'Instagram',
    tono: 'Elegante y emocional',
    cta: 'Escríbenos por WhatsApp para apartar el tuyo',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copiado, setCopiado] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const copiar = (key, texto) => {
    try {
      navigator.clipboard.writeText(texto)
      setCopiado(key); setTimeout(() => setCopiado(''), 1600)
    } catch (e) {}
  }

  const generar = async () => {
    setLoading(true); setError(''); setResult(null)
    const incluyeHashtags = ['Instagram', 'Facebook', 'TikTok'].includes(form.plataforma)
    const prompt = `Actúa como un experto en marketing, copywriting y ventas para joyería de la marca NICE.

Crea anuncios de texto persuasivos para vender esta joyería. Genera deseo, confianza y acción inmediata con marketing emocional, beneficios claros, diferenciación, urgencia (solo si aplica) y un llamado a la acción.

Datos:
- Tipo de joyería: ${form.tipo_joyeria}
- Material o característica principal: ${form.material}
- Cliente ideal: ${form.cliente_ideal}
- Ocasión de compra: ${form.ocasion}
- Emoción que debe transmitir: ${form.emocion}
- Beneficio principal: ${form.beneficio}
- Diferenciador: ${form.diferenciador}
- Promoción u oferta: ${form.promocion === 'Sin promoción' ? '(ninguna)' : (form.promocion || '(ninguna)')}
- Nivel de urgencia: ${form.urgencia}
- Plataforma: ${form.plataforma}
- Tono: ${form.tono}
- Acción deseada (CTA): ${form.cta}

Reglas estrictas:
1. No inventes características que no estén en los datos.
2. Si no hay promoción, no menciones descuentos.
3. Si la urgencia es "Sin urgencia", no uses frases falsas como "últimas piezas" o "solo hoy".
4. Debe sonar natural, atractivo y vendedor.
5. Evita textos genéricos como "la mejor joyería del mercado".
6. Enfócate en el deseo del cliente: verse bien, regalar algo especial, sentirse elegante, destacar, demostrar amor.
7. Lenguaje emocional, claro y fácil de entender, en español.
8. Adapta el texto a la plataforma indicada.
9. El CTA debe ser directo y fácil de seguir.
10. Estilo de la marca NICE: elegante, confiable y deseable.

Responde ÚNICAMENTE con un objeto JSON válido (sin texto adicional, sin markdown), con esta forma exacta:
{
  "corto": "anuncio breve para historias o WhatsApp",
  "emocional": "anuncio más persuasivo que conecte con la emoción",
  "venta": "anuncio directo con beneficio, oferta (si hay) y CTA",
  "gancho": "una frase inicial poderosa para captar atención",
  "cta": "una frase clara de llamado a la acción",
  "hashtags": ${incluyeHashtags ? '"lista de 6-10 hashtags relevantes separados por espacio, cada uno con #"' : '""'}
}`
    try {
      const raw = await window.claude.complete({ messages: [{ role: 'user', content: prompt }] })
      let txt = (raw || '').trim()
      const a = txt.indexOf('{'), b = txt.lastIndexOf('}')
      if (a >= 0 && b > a) txt = txt.slice(a, b + 1)
      const data = JSON.parse(txt)
      setResult(data)
    } catch (e) {
      setError('No se pudo generar el anuncio. Verifica tu conexión e inténtalo de nuevo. (La generación con IA funciona estando en línea.)')
    }
    setLoading(false)
  }

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--win-border2)', background: 'var(--win-surface)', fontSize: 13, fontFamily: 'inherit', color: 'var(--win-text)', outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--win-muted)', marginBottom: 5, display: 'block' }
  const campo = (k, label, ph, full) => (
    <div key={k} style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={labelStyle}>{label}</label>
      <input value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} style={inputStyle}/>
    </div>
  )
  const selector = (k, label, opts, full) => (
    <div key={k} style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={labelStyle}>{label}</label>
      <select value={form[k]} onChange={e => set(k, e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  const bloques = result ? [
    { key: 'gancho', label: 'Frase gancho', icon: '✨', big: true },
    { key: 'corto', label: 'Anuncio corto', icon: '⚡', sub: 'Historias / WhatsApp' },
    { key: 'emocional', label: 'Anuncio emocional', icon: '💖', sub: 'Conecta con la emoción' },
    { key: 'venta', label: 'Anuncio de venta', icon: '🛍️', sub: 'Beneficio + CTA' },
    { key: 'cta', label: 'Llamado a la acción', icon: '👉' },
    ...(result.hashtags ? [{ key: 'hashtags', label: 'Hashtags', icon: '#️⃣' }] : []),
  ] : []

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: 18, alignItems: 'start' }} className="rn-anuncios">
      {/* Formulario */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={{ width: 16, height: 16, color: 'var(--win-accent)' }}><Icons.Megaphone/></div>
          <span style={S.cardTitle}>Datos del producto</span>
        </div>
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {selector('tipo_joyeria', 'Tipo de joyería', ANUNCIO_TIPOS)}
          {campo('material', 'Material / característica', 'Acero inoxidable…')}
          {campo('cliente_ideal', 'Cliente ideal', 'Mujeres jóvenes…', true)}
          {selector('ocasion', 'Ocasión', ANUNCIO_OCASIONES)}
          {selector('emocion', 'Emoción', ANUNCIO_EMOCIONES)}
          {selector('beneficio', 'Beneficio principal', ANUNCIO_BENEFICIOS, true)}
          {selector('diferenciador', 'Diferenciador', ANUNCIO_DIFERENCIADORES, true)}
          {selector('promocion', 'Promoción', ANUNCIO_PROMOCIONES, true)}
          {selector('urgencia', 'Urgencia', ANUNCIO_URGENCIA)}
          {selector('plataforma', 'Plataforma', ANUNCIO_PLATAFORMAS)}
          {selector('tono', 'Tono', ANUNCIO_TONOS)}
          {campo('cta', 'Acción deseada (CTA)', 'Escríbenos por WhatsApp…')}
          <div style={{ gridColumn: '1 / -1' }}>
            <button onClick={generar} disabled={loading} style={{ width: '100%', marginTop: 4, padding: '12px', borderRadius: 9, border: 'none', cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, color: '#fff', background: loading ? 'var(--win-muted)' : 'linear-gradient(135deg, #2E8FF0, #1E6FE0)', boxShadow: loading ? 'none' : '0 6px 18px rgba(37,99,235,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? 'Generando anuncio…' : '✨ Generar anuncio con IA'}
            </button>
            {error && <div style={{ marginTop: 10, fontSize: 12, color: 'var(--win-red)', background: 'var(--win-red-l)', padding: '8px 11px', borderRadius: 7, lineHeight: 1.5 }}>{error}</div>}
          </div>
        </div>
      </div>

      {/* Resultado */}
      <div>
        {!result && !loading && (
          <div style={{ ...S.card, padding: '48px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--win-accent-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--win-accent)', marginBottom: 18 }}>
              <div style={{ width: 30, height: 30 }}><Icons.Megaphone/></div>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--win-title)', marginBottom: 8 }}>Tu anuncio aparecerá aquí</div>
            <div style={{ fontSize: 13, color: 'var(--win-muted)', maxWidth: 380, lineHeight: 1.6 }}>Completa los datos del producto y la IA creará 6 versiones listas para publicar: frase gancho, anuncio corto, emocional, de venta, CTA y hashtags.</div>
          </div>
        )}
        {loading && (
          <div style={{ ...S.card, padding: '48px 30px', textAlign: 'center', minHeight: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 38, height: 38, border: '3px solid var(--win-border)', borderTopColor: 'var(--win-accent)', borderRadius: '50%', animation: 'rnspin 0.8s linear infinite', marginBottom: 18 }}/>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--win-title)' }}>Creando tu anuncio NICE…</div>
            <div style={{ fontSize: 12, color: 'var(--win-muted)', marginTop: 6 }}>Redactando con técnicas de copywriting</div>
          </div>
        )}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bloques.map(b => (
              <div key={b.key} style={{ ...S.card, padding: 0, overflow: 'hidden', border: b.big ? '1.5px solid var(--win-accent)' : '1px solid var(--win-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--win-border)', background: b.big ? 'var(--win-accent-l)' : 'var(--win-surface2)' }}>
                  <span style={{ fontSize: 14 }}>{b.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--win-title)' }}>{b.label}</span>
                  {b.sub && <span style={{ fontSize: 11, color: 'var(--win-muted)' }}>· {b.sub}</span>}
                  <button onClick={() => copiar(b.key, result[b.key])} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 6, border: '1px solid var(--win-border2)', background: 'var(--win-surface)', color: copiado === b.key ? 'var(--win-green)' : 'var(--win-text)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {copiado === b.key ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
                <div style={{ padding: '13px 16px', fontSize: b.big ? 16 : 13.5, fontWeight: b.big ? 600 : 400, lineHeight: 1.6, color: b.key === 'hashtags' ? 'var(--win-accent)' : 'var(--win-text)', whiteSpace: 'pre-wrap' }}>{result[b.key]}</div>
              </div>
            ))}
            <button onClick={generar} disabled={loading} style={{ alignSelf: 'flex-start', padding: '9px 18px', borderRadius: 8, border: '1px solid var(--win-border2)', background: 'var(--win-surface)', color: 'var(--win-text)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              🔄 Generar otra versión
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ChequeModal({ afiliados, onClose }) {
  const isMobile = useIsMobile()
  const self = afiliados[0]
  const r = getRango(self.rango)
  const propiosReales = (self.pp || 0) + (self.pg || 0)
  const [meta, setMeta] = useState(propiosReales)
  const esSimulado = meta !== propiosReales
  const c = simularChequeDR(self, afiliados, meta)
  const hoy = new Date()
  const mesLabel = hoy.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
  const fmtMXN = v => v.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 })

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(8,16,28,.62)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 12 : 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--win-surface)', borderRadius: 16, boxShadow: '0 24px 70px rgba(0,0,0,.45)', width: '100%', maxWidth: 620, maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--win-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, fontSize: 18 }}>💵</div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--win-title)' }}>Simulación de tu cheque</div>
            <div style={{ fontSize: 11.5, color: 'var(--win-muted)', textTransform: 'capitalize' }}>{mesLabel} · Descuento por Red</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--win-border)', background: 'var(--win-surface2)', color: 'var(--win-muted)', cursor: 'pointer', fontSize: 16, fontFamily: 'inherit', flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ padding: isMobile ? 16 : 24 }}>
          {/* Meta editable: simula qué pasaría con otro monto de puntos propios */}
          <div style={{ marginBottom: 16, padding: '14px 16px', borderRadius: 12, background: 'var(--win-surface2)', border: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--win-title)' }}>🎯 Mi meta de puntos para este mes</div>
              <div style={{ fontSize: 10.5, color: 'var(--win-muted)', marginTop: 2 }}>Cambia el número y mira cómo se mueve tu cheque. Ahora llevas {propiosReales.toLocaleString()} pts.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <input
                type="number" min={0} value={meta}
                onChange={e => setMeta(Math.max(0, Number(e.target.value) || 0))}
                style={{ width: 110, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--win-border2)', background: 'var(--win-surface)', color: 'var(--win-text)', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', textAlign: 'right' }}
              />
              {esSimulado && (
                <button onClick={() => setMeta(propiosReales)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--win-border2)', background: 'var(--win-surface)', color: 'var(--win-muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  Restablecer
                </button>
              )}
            </div>
            <div style={{ width: '100%' }}>
              <input
                type="range" min={0} max={2000} step={10} value={Math.min(2000, meta)}
                onChange={e => setMeta(Math.max(0, Number(e.target.value) || 0))}
                className={'rn-slider' + (meta >= 2000 ? ' rn-slider-full' : '')}
                style={{ '--rn-slider-pct': Math.min(100, (meta / 2000) * 100) + '%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontSize: 10.5, color: 'var(--win-muted)' }}>
                <span>0</span>
                <span style={{ fontWeight: 700, color: meta >= 2000 ? 'var(--win-green)' : 'var(--win-text)' }}>{meta.toLocaleString()} de 2,000 pts</span>
                <span>2,000</span>
              </div>
            </div>
          </div>

          {/* Cheque visual */}
          <div style={{ background: 'linear-gradient(135deg,#FDF8ED,#F5EFDC)', border: '2px solid #D4B96A', borderRadius: 14, padding: isMobile ? '18px 16px' : '22px 26px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(212,185,106,.18)' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '.06em', color: '#8A6D1D' }}>NICE · CHEQUE SIMULADO</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#8A6D1D', textTransform: 'capitalize' }}>{mesLabel}</div>
                {esSimulado && <div style={{ marginTop: 3, fontSize: 9.5, fontWeight: 800, letterSpacing: '.06em', color: '#fff', background: '#B8860B', padding: '2px 8px', borderRadius: 20, display: 'inline-block' }}>CON META</div>}
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#8A6D1D', fontWeight: 600, marginBottom: 3 }}>PÁGUESE A LA ORDEN DE</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: '#3A2E0B', marginBottom: 16 }}>{self.nombre}</div>
            <div style={{ fontSize: 11, color: '#8A6D1D', fontWeight: 600, marginBottom: 4 }}>IMPORTE ESTIMADO</div>
            <div style={{ fontSize: isMobile ? 36 : 44, fontWeight: 800, color: '#3A2E0B', letterSpacing: '-.02em', lineHeight: 1 }}>{fmtMXN(c.totalMXN)}</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: r.color, background: r.bg, padding: '3px 10px', borderRadius: 20 }}>{r.label}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: '#8A6D1D' }}>EIN {self.ein} · {c.propios.toLocaleString()} pts propios{esSimulado ? ' (meta)' : ''} ({c.propios >= 2000 ? '5/4/4%' : c.propios >= 1500 ? '3%' : c.propios >= 1000 ? '2%' : c.propios >= 500 ? '1%' : '0%'})</span>
            </div>
          </div>

          {!c.califica && (
            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'var(--win-red-l)', color: 'var(--win-red)', fontSize: 12, fontWeight: 600 }}>
              Tu rango actual ({r.label}) todavía no es Oro+, así que el Descuento por Red no aplica todavía. Esta simulación muestra $0.
            </div>
          )}

          {/* Desglose por nivel */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--win-title)', marginBottom: 8 }}>Desglose por generación</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--win-surface2)' }}>
                  {['Nivel', 'Personas', 'Puntos', '%', 'Importe'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: h==='Nivel'||h==='Personas'?'center':'right', fontSize: 10, fontWeight: 700, letterSpacing: '.05em', color: 'var(--win-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--win-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.niveles.map(n => (
                  <tr key={n.nivel} style={{ borderBottom: '1px solid var(--win-border)' }}>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: 'var(--win-title)' }}>Nivel {n.nivel}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--win-text)' }}>{n.personas}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--win-gold)', fontWeight: 600 }}>{n.puntos.toLocaleString()}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--win-muted)' }}>{(n.pct*100).toFixed(0)}%</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--win-accent)' }}>{fmtMXN(n.importePuntos*VALOR_ORO)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16, fontSize: 11, color: 'var(--win-muted)', lineHeight: 1.6 }}>
            <strong>Cálculo aproximado</strong> — cuenta el PP+PG combinado de TODOS tus descendientes en Generación 1, 2 y 3, sin importar su rango. El % depende de tus propios PP+PG de este periodo (500 → 1%, 1,000 → 2%, 1,500 → 3%, 2,000+ → 5%/4%/4% por nivel). No es tu pago oficial de NICE — solo una estimación para planear.
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelMiRed({ afiliados }) {
  const isMobile = useIsMobile()
  const [showDB, setShowDB] = useState(false)
  const [showCheque, setShowCheque] = useState(false)
  const total = afiliados.length
  const activos = afiliados.filter(a => (a.pp||0)+(a.pg||0)>0).length
  const totalPP = afiliados.reduce((s,a) => s+(a.pp||0), 0)
  const totalPG = afiliados.reduce((s,a) => s+(a.pg||0), 0)
  const conteos = contarPorRango(afiliados)
  const maxN = Math.max(...conteos.map(([,n])=>n), 1)
  const RCOLS = {'Oro Ejecutivo':'#C47F17','Oro Senior':'#C47F17','Oro Master':'#C47F17','Oro':'#C47F17','Oro Experto':'#C47F17','Oro Premier':'#C47F17','Oro Elite':'#C47F17','Platino':'#7C3AED','Diamante':'#7C3AED','Diamante Master':'#7C3AED','Doble Diamante SL':'#7C3AED','Plata':'#1D4ED8','Bronce':'#EA580C','Cobre':'#B45309','Empresario':'#6B7280','Sin Descuento':'#9CA3AF'}
  const self = afiliados[0]
  const rSelf = self ? getRango(self.rango) : null
  const lideres = [...afiliados].filter(a=>a.ein!==self?.ein).sort((a,b)=>(b.pg||0)-(a.pg||0)).slice(0,5)
  const enRiesgo = afiliados.filter(a=>((a.pp||0)+(a.pg||0))===0)
  const frontalesLider = self ? afiliados.filter(a=>a.einPresentador===self.ein) : []
  const profundidad = afiliados.reduce((m,a)=>Math.max(m,a.gen||0),0)
  // Cadena ascendente (red): de quién depende cada afiliado, subiendo hasta la raíz.
  const byEin = {}
  afiliados.forEach(a => { byEin[a.ein] = a })
  const cadenaAscendente = (a, maxNiveles = 2) => {
    const chain = []
    let actual = a
    let guard = 0
    while (actual && actual.einPresentador && byEin[actual.einPresentador] && guard < maxNiveles) {
      const up = byEin[actual.einPresentador]
      chain.push(up.nombre.split(' ').slice(0, 2).join(' '))
      actual = up
      guard++
    }
    return chain
  }
  return (
    <div>
      {showDB && <BaseDatosModal afiliados={afiliados} onClose={()=>setShowDB(false)}/>}
      {showCheque && <ChequeModal afiliados={afiliados} onClose={()=>setShowCheque(false)}/>}
      <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginBottom:12}}>
        <button onClick={()=>setShowDB(true)} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 16px',borderRadius:8,background:'var(--win-accent)',border:'1px solid var(--win-accent)',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
          <div style={{width:15,height:15}}><Icons.Grid/></div>
          Base de datos
        </button>
      </div>
      <button onClick={()=>setShowCheque(true)} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,width:'100%',padding:'18px 20px',marginBottom:16,borderRadius:14,border:'none',background:'linear-gradient(135deg,#D4AF37,#B8860B)',color:'#fff',cursor:'pointer',fontFamily:'inherit',boxShadow:'0 8px 24px rgba(184,134,11,.35)'}}>
        <span style={{fontSize:26}}>💵</span>
        <span style={{textAlign:'left'}}>
          <span style={{display:'block',fontSize:16,fontWeight:800}}>Simula tu cheque de este mes</span>
          <span style={{display:'block',fontSize:11.5,opacity:.9,fontWeight:500}}>Descuento por Red · Generación 1 a 3</span>
        </span>
      </button>
      {/* Hero: total · líder · rango */}
      {self && (
        <div className="rn-hero">
          <div>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:6}}>TOTAL AFILIADOS</div>
            <div style={{fontSize:32,fontWeight:700,color:'var(--win-accent)',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{total}</div>
            <div style={{fontSize:11,color:'var(--win-muted)',marginTop:4}}>{activos} activos · {total>0?Math.round(activos/total*100):0}%</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:6}}>LÍDER DE LA RED</div>
            <div style={{fontSize:18,fontWeight:700,color:'var(--win-title)',lineHeight:1.2}}>{self.nombre}</div>
            <div style={{fontSize:11,color:'var(--win-muted)',marginTop:4}}>EIN {self.ein}{self.ciudad?` · ${self.ciudad}`:''}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:14}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:6}}>RANGO NICE</div>
              <div style={{fontSize:16,fontWeight:700,color:rSelf.color,lineHeight:1.1}}>{rSelf.label}</div>
              <div style={{fontSize:11,color:'var(--win-muted)',marginTop:4}}>{(self.pp||0)} PP · {(self.pg||0)} PG</div>
            </div>
            <div style={{width:64,height:64,borderRadius:'50%',background:rSelf.bg,border:`3px solid ${rSelf.color}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:`0 0 0 4px ${rSelf.color}22`,overflow:'hidden'}}>
              {RANGO_IMG[rSelf.id]
                ? <img src={RANGO_IMG[rSelf.id]} alt={rSelf.label} style={{width:56,height:56,objectFit:'contain'}}/>
                : <span style={{fontSize:14,fontWeight:700,color:rSelf.color}}>{getInitials(self.nombre)}</span>}
            </div>
          </div>
        </div>
      )}
      <div className="rn-stats-grid">
        {[{l:'Activos este mes',v:activos,c:'var(--win-green)',sub:`${total>0?Math.round(activos/total*100):0}% actividad`},{l:'PP totales',v:totalPP.toLocaleString(),c:'var(--win-gold)'},{l:'PG totales',v:totalPG.toLocaleString(),c:'var(--win-purple)'},{l:'Rangos Oro+',v:afiliados.filter(a=>{const r=getRango(a.rango);return r.id.includes('ORO')||r.id.includes('DIAMANTE')||r.id==='PLATINO'}).length,c:'var(--win-gold)'}].map(k=>(
          <div key={k.l} style={{...S.card, padding:'14px 16px'}}>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:6}}>{k.l.toUpperCase()}</div>
            <div style={{fontSize:26,fontWeight:700,color:k.c,fontVariantNumeric:'tabular-nums',letterSpacing:'-.01em',lineHeight:1}}>{k.v}</div>
            {k.sub && <div style={{fontSize:11,color:'var(--win-muted)',marginTop:4}}>{k.sub}</div>}
          </div>
        ))}
      </div>
      <div className="rn-twocol">
        <div style={S.card}>
          <div style={S.cardHeader}><span style={S.cardTitle}>Distribución por rango</span></div>
          <div style={S.cardBody}>
            {conteos.map(([label,count])=>(
              <div key={label} style={{display:'flex',alignItems:'center',gap:10,marginBottom:7}}>
                <div style={{width:88,fontSize:11,color:'var(--win-muted)',textAlign:'right',fontWeight:500,flexShrink:0}}>{label}</div>
                <div style={{flex:1,height:22,background:'var(--win-surface2)',borderRadius:4,overflow:'hidden',border:'1px solid var(--win-border)'}}>
                  <div style={{width:`${Math.max(6,(count/maxN)*100)}%`,height:'100%',background:RCOLS[label]||'#6B7280',borderRadius:3,display:'flex',alignItems:'center',paddingLeft:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:'white'}}>{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardHeader}><span style={S.cardTitle}>Actividad de la red</span></div>
          <div style={S.cardBody}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <svg width="88" height="88" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="34" fill="none" stroke="var(--win-border)" strokeWidth="13"/>
                <circle cx="44" cy="44" r="34" fill="none" stroke="#16A34A" strokeWidth="13" strokeDasharray={`${total>0?(activos/total)*213.6:0} 213.6`} strokeDashoffset="53" strokeLinecap="round"/>
                <text x="44" y="48" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--win-title)">{total>0?Math.round(activos/total*100):0}%</text>
              </svg>
              <div>
                {[{l:'Con PP/PG',n:activos,c:'#16A34A'},{l:'Sin movimiento',n:total-activos,c:'#9CA3AF'}].map(item=>(
                  <div key={item.l} style={{display:'flex',alignItems:'center',gap:7,marginBottom:8,fontSize:12}}>
                    <div style={{width:10,height:10,borderRadius:'50%',background:item.c,flexShrink:0}}/>
                    <span style={{color:'var(--win-text)'}}>{item.l}</span>
                    <span style={{marginLeft:'auto',fontWeight:700,color:'var(--win-title)'}}>{item.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rn-twocol">
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Líderes de la red</span>
            <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>por Puntos de Grupo</span>
          </div>
          <div style={{padding:'6px 10px'}}>
            {lideres.map((a,i)=>{
              const ar=getRango(a.rango)
              return (
                <div key={a.ein} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 6px',borderBottom:i<lideres.length-1?'1px solid var(--win-border)':'none'}}>
                  <div style={{width:20,fontSize:12,fontWeight:700,color:'var(--win-muted)',textAlign:'center',flexShrink:0}}>{i+1}</div>
                  <div style={{width:34,height:34,borderRadius:'50%',background:ar.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden',boxShadow:`0 0 0 2px ${ar.color}33`}}>{RANGO_IMG[ar.id]?<img src={RANGO_IMG[ar.id]} alt='' style={{width:30,height:30,objectFit:'contain'}}/>:<span style={{fontSize:10,fontWeight:700,color:ar.color}}>{getInitials(a.nombre)}</span>}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--win-title)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.nombre}</div>
                    <div style={{fontSize:11,color:'var(--win-muted)'}}>{ar.label} · Gen. {a.gen}</div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:'#7C3AED',fontVariantNumeric:'tabular-nums'}}>{(a.pg||0).toLocaleString()}</div>
                    <div style={{fontSize:10,color:'var(--win-muted)'}}>PG</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Afiliados en riesgo</span>
            <span style={{marginLeft:'auto',background:enRiesgo.length>0?'var(--win-red-l)':'var(--win-green-l)',color:enRiesgo.length>0?'var(--win-red)':'var(--win-green)',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700}}>{enRiesgo.length}</span>
          </div>
          <div style={{padding:'12px 16px'}}>
            <div style={{fontSize:11,color:'var(--win-muted)',marginBottom:enRiesgo.length>0?12:0,lineHeight:1.5}}>Sin movimiento este período (0 PP y 0 PG). Contáctalos para reactivar su actividad.</div>
            {enRiesgo.length===0
              ? <div style={{display:'flex',alignItems:'center',gap:8,color:'var(--win-green)',fontSize:13,fontWeight:600}}><div style={{width:16,height:16}}><Icons.Check/></div>Toda la red tiene actividad este período.</div>
              : (
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {enRiesgo.slice(0,5).map(a=>{
                    const ar=getRango(a.rango)
                    return (
                      <div key={a.ein} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 8px',borderRadius:8,background:'var(--win-surface2)',border:'1px solid var(--win-border)'}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:ar.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden',opacity:.75}}>{RANGO_IMG[ar.id]?<img src={RANGO_IMG[ar.id]} alt='' style={{width:24,height:24,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:ar.color}}>{getInitials(a.nombre)}</span>}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:'var(--win-title)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.nombre}</div>
                          <div style={{fontSize:10,color:'var(--win-muted)'}}>{ar.label}{a.ciudad?` · ${a.ciudad}`:''}</div>
                        </div>
                        {a.telefono && <span style={{fontSize:11,color:'var(--win-muted)',flexShrink:0}}>{a.telefono}</span>}
                      </div>
                    )
                  })}
                  {enRiesgo.length>5 && <div style={{fontSize:11,color:'var(--win-muted)',textAlign:'center',marginTop:2}}>+{enRiesgo.length-5} más sin movimiento</div>}
                </div>
              )
            }
          </div>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardHeader}><span style={S.cardTitle}>Top 10 afiliados por PP este mes</span></div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,tableLayout:'fixed'}}>
          <colgroup>
            <col style={{width:'auto'}}/>
            <col style={{width:isMobile?86:110}}/>
            <col style={{width:isMobile?34:60}}/>
            <col style={{width:isMobile?34:60}}/>
            {!isMobile && <col style={{width:120}}/>}
          </colgroup>
          <thead><tr style={{borderBottom:'1px solid var(--win-border)',background:'var(--win-surface2)'}}>
            {(isMobile?['Afiliado','Rango','PP','PG']:['Afiliado','Rango','PP','PG','Ciudad']).map(h=><th key={h} style={{padding:isMobile?'7px 8px':'7px 14px',textAlign:'left',fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {[...afiliados].sort((a,b)=>(b.pp||0)-(a.pp||0)).slice(0,10).map((a,i)=>(
              <tr key={a.ein} style={{borderBottom:'1px solid var(--win-border)',background:i%2===0?'transparent':'var(--win-surface2)'}}>
                <td style={{padding:isMobile?'8px 8px':'9px 14px',overflow:'hidden'}}>
                  <div style={{display:'flex',alignItems:'center',gap:isMobile?6:8,minWidth:0}}>
                    <div style={{width:isMobile?24:30,height:isMobile?24:30,borderRadius:'50%',background:getRango(a.rango).bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>{RANGO_IMG[getRango(a.rango).id]?<img src={RANGO_IMG[getRango(a.rango).id]} alt='' style={{width:isMobile?20:26,height:isMobile?20:26,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:getRango(a.rango).color}}>{getInitials(a.nombre)}</span>}</div>
                    <div style={{minWidth:0,overflow:'hidden'}}>
                      <div style={{fontWeight:600,color:'var(--win-title)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{isMobile?a.nombre.split(' ').slice(0,2).join(' '):a.nombre}</div>
                      <div style={{fontSize:10,color:'var(--win-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{[a.nombre.split(' ').slice(0,2).join(' '), ...cadenaAscendente(a)].join(' / ')}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:isMobile?'8px 8px':'9px 14px',overflow:'hidden'}}><RankBadge rangoStr={a.rango} maxWidth={isMobile?70:undefined}/></td>
                <td style={{padding:isMobile?'8px 8px':'9px 14px',fontWeight:700,color:'var(--win-gold)'}}>{a.pp}</td>
                <td style={{padding:isMobile?'8px 8px':'9px 14px',fontWeight:600,color:'#7C3AED'}}>{a.pg}</td>
                {!isMobile && <td style={{padding:'9px 14px',color:'var(--win-muted)',fontSize:11,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.ciudad}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function fmtFecha(v) {
  if (v == null || v === '') return '—'
  if (v instanceof Date) return isNaN(v.getTime()) ? '—' : v.toLocaleDateString('es-MX')
  if (typeof v === 'number') {
    const d = new Date(Math.round((v - 25569) * 86400 * 1000))
    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('es-MX')
  }
  return String(v)
}

const BASE_DATOS_COLS = [
  { key: 'gen', label: 'Generación', align: 'center' },
  { key: 'ein', label: 'EIN' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'fechaContrato', label: 'Fecha contrato' },
  { key: 'fechaRegistro', label: 'Fecha registro' },
  { key: 'rango', label: 'Rango' },
  { key: 'rangoVenta', label: 'Rango venta' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'pp', label: 'PP', align: 'right' },
  { key: 'pg', label: 'PG', align: 'right' },
  { key: 'pnd', label: 'PND', align: 'right' },
  { key: 'einPresentador', label: 'Número de presentador' },
  { key: 'presentador', label: 'Presentador' },
  { key: 'estado', label: 'Estado' },
  { key: 'ciudad', label: 'Ciudad' },
]

async function exportBaseDatosExcel(afiliados) {
  const wb = new window.ExcelJS.Workbook()
  wb.creator = 'RedNICE'
  const ws = wb.addWorksheet('Base de Datos NICE')

  ws.columns = [
    { header: 'Generación', key: 'gen', width: 10 },
    { header: 'EIN', key: 'ein', width: 12 },
    { header: 'Nombre', key: 'nombre', width: 28 },
    { header: 'Fecha contrato', key: 'fechaContrato', width: 14 },
    { header: 'Fecha registro', key: 'fechaRegistro', width: 14 },
    { header: 'Rango', key: 'rango', width: 20 },
    { header: 'Rango venta', key: 'rangoVenta', width: 14 },
    { header: 'Teléfono', key: 'telefono', width: 14 },
    { header: 'PP', key: 'pp', width: 9 },
    { header: 'PG', key: 'pg', width: 9 },
    { header: 'PND', key: 'pnd', width: 9 },
    { header: 'Número de presentador', key: 'einPresentador', width: 18 },
    { header: 'Presentador', key: 'presentador', width: 24 },
    { header: 'Estado', key: 'estado', width: 16 },
    { header: 'Ciudad', key: 'ciudad', width: 16 },
  ]

  const headerRow = ws.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A2E' } }
  headerRow.alignment = { vertical: 'middle' }
  headerRow.height = 20

  const fechaVal = (v) => {
    if (v == null || v === '') return ''
    if (v instanceof Date) return v
    if (typeof v === 'number') return new Date(Math.round((v - 25569) * 86400 * 1000))
    return String(v)
  }

  const imgIdCache = {}
  afiliados.forEach((a, i) => {
    const rowIndex = i + 2
    const r = getRango(a.rango)
    const row = ws.addRow({
      gen: a.gen ?? '',
      ein: a.ein || '',
      nombre: a.nombre || '',
      fechaContrato: fechaVal(a.fechaContrato),
      fechaRegistro: fechaVal(a.fechaRegistro),
      rango: r.label,
      rangoVenta: a.rangoVenta || '',
      telefono: a.telefono || '',
      pp: a.pp || 0,
      pg: a.pg || 0,
      pnd: a.pnd || 0,
      einPresentador: a.einPresentador || '',
      presentador: a.presentador || '',
      estado: a.estado || '',
      ciudad: a.ciudad || '',
    })
    row.height = 18
    const rangoCell = row.getCell('rango')
    rangoCell.alignment = { indent: 3, vertical: 'middle' }
    rangoCell.font = { color: { argb: 'FF' + (r.color || '#555').replace('#', '') } }

    const src = RANGO_IMG[r.id]
    if (src && src.startsWith('data:image')) {
      let imgId = imgIdCache[r.id]
      if (imgId == null) {
        const base64 = src.split(',')[1]
        imgId = wb.addImage({ base64, extension: 'png' })
        imgIdCache[r.id] = imgId
      }
      ws.addImage(imgId, { tl: { col: 5, row: rowIndex - 1 }, ext: { width: 15, height: 15 } })
    }
  })

  ws.getColumn('pp').numFmt = '#,##0'
  ws.getColumn('pg').numFmt = '#,##0'
  ws.getColumn('pnd').numFmt = '#,##0'
  ws.getColumn('fechaContrato').numFmt = 'dd/mm/yyyy'
  ws.getColumn('fechaRegistro').numFmt = 'dd/mm/yyyy'
  ws.autoFilter = { from: 'A1', to: 'O1' }
  ws.views = [{ state: 'frozen', ySplit: 1 }]

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Base-de-datos-NICE-${new Date().toISOString().slice(0, 10)}.xlsx`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

// Orden jerárquico de rangos (de menor a mayor) para poder ordenar las columnas
// "Rango" / "Rango venta" por jerarquía real, no alfabéticamente.
const RANGO_ORDEN = RANGOS.map(r => r.id)
function valorOrdenCol(a, key) {
  if (key === 'rango' || key === 'rangoVenta') return RANGO_ORDEN.indexOf(getRango(a[key]).id)
  if (key === 'gen' || key === 'pp' || key === 'pg' || key === 'pnd') return Number(a[key]) || 0
  if (key === 'fechaContrato' || key === 'fechaRegistro') {
    const v = a[key]
    if (v instanceof Date) return v.getTime()
    if (typeof v === 'number') return v
    const d = new Date(v)
    return isNaN(d.getTime()) ? 0 : d.getTime()
  }
  return (a[key] ?? '').toString().toLowerCase()
}

// Filtro por rango de selección múltiple (mismos buckets que en Genealogía).
const RANGO_FILTRO_OPCIONES = [
  { id: 'ORO_EJECUTIVO', label: 'Oro Ejecutivo' },
  { id: 'ORO', label: 'Oro' },
  { id: 'PLATA', label: 'Plata' },
  { id: 'BRONCE', label: 'Bronce' },
  { id: 'COBRE', label: 'Cobre' },
  { id: 'EIN', label: 'Empresario' },
]
function bucketRangoFiltro(id) {
  if (['ORO_MASTER', 'ORO_SENIOR', 'ORO_EJECUTIVO', 'PLATINO', 'DIAMANTE', 'DIAMANTE_MASTER', 'DOBLE_DIAMANTE'].includes(id)) return 'ORO_EJECUTIVO'
  if (['ORO', 'ORO_EXPERTO', 'ORO_PREMIER', 'ORO_ELITE'].includes(id)) return 'ORO'
  return id
}

function BaseDatosModal({ afiliados, onClose }) {
  const isMobile = useIsMobile()
  const [q, setQ] = useState('')
  const [exportando, setExportando] = useState(false)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('desc')
  const [rangosSel, setRangosSel] = useState(() => new Set(RANGO_FILTRO_OPCIONES.map(o => o.id)))
  const [showFiltro, setShowFiltro] = useState(false)
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const toggleRango = (id) => setRangosSel(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  const filtrados = afiliados
    .filter(a => rangosSel.has(bucketRangoFiltro(getRango(a.rango).id)))
    .filter(a => !q.trim() || (a.nombre || '').toLowerCase().includes(q.toLowerCase()) || (a.ein || '').toLowerCase().includes(q.toLowerCase()))
  const ordenados = sortKey
    ? [...filtrados].sort((a, b) => {
        const va = valorOrdenCol(a, sortKey), vb = valorOrdenCol(b, sortKey)
        if (va < vb) return sortDir === 'asc' ? -1 : 1
        if (va > vb) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    : filtrados

  const descargar = async () => {
    setExportando(true)
    try { await exportBaseDatosExcel(ordenados) } finally { setExportando(false) }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(8,16,28,.62)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--win-surface)', borderRadius: isMobile ? 0 : 14, boxShadow: '0 24px 70px rgba(0,0,0,.45)', width: '100%', maxWidth: 1400, height: isMobile ? '100%' : '92vh', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--win-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}><div style={{ width: 18, height: 18 }}><Icons.Grid/></div></div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--win-title)' }}>Base de datos de la red</div>
            <div style={{ fontSize: 11.5, color: 'var(--win-muted)' }}>{filtrados.length} de {afiliados.length} afiliados</div>
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => setShowFiltro(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 8, background: rangosSel.size < RANGO_FILTRO_OPCIONES.length ? 'var(--win-accent-l)' : 'var(--win-surface2)', border: '1px solid var(--win-border2)', color: rangosSel.size < RANGO_FILTRO_OPCIONES.length ? 'var(--win-accent)' : 'var(--win-text)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              <div style={{ width: 14, height: 14 }}><Icons.Sliders/></div>
              Filtrar por rango{rangosSel.size < RANGO_FILTRO_OPCIONES.length ? ` (${rangosSel.size})` : ''}
            </button>
            {showFiltro && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 20, background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 12px 32px rgba(0,0,0,.18)', padding: 10, minWidth: 190 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--win-border)' }}>
                  <button onClick={() => setRangosSel(new Set(RANGO_FILTRO_OPCIONES.map(o => o.id)))} style={{ fontSize: 11, fontWeight: 600, color: 'var(--win-accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Todos</button>
                  <button onClick={() => setRangosSel(new Set())} style={{ fontSize: 11, fontWeight: 600, color: 'var(--win-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Ninguno</button>
                </div>
                {RANGO_FILTRO_OPCIONES.map(o => (
                  <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 4px', cursor: 'pointer', fontSize: 12.5, color: 'var(--win-text)' }}>
                    <input type="checkbox" checked={rangosSel.has(o.id)} onChange={() => toggleRango(o.id)} style={{ accentColor: 'var(--win-accent)' }}/>
                    {o.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o EIN…" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--win-border2)', background: 'var(--win-surface2)', fontSize: 12.5, fontFamily: 'inherit', color: 'var(--win-text)', outline: 'none', width: isMobile ? '100%' : 220, boxSizing: 'border-box' }}/>
          <button onClick={descargar} disabled={exportando} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, background: 'var(--win-accent)', border: '1px solid var(--win-accent)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: exportando ? 'default' : 'pointer', fontFamily: 'inherit', opacity: exportando ? .7 : 1, flexShrink: 0 }}>
            <div style={{ width: 14, height: 14 }}><Icons.Download/></div>
            {exportando ? 'Generando…' : 'Exportar a Excel'}
          </button>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--win-border)', background: 'var(--win-surface2)', color: 'var(--win-muted)', cursor: 'pointer', fontSize: 16, fontFamily: 'inherit', flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', minWidth: 1300, borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, background: 'var(--win-surface2)', zIndex: 1 }}>
                {BASE_DATOS_COLS.map(c => (
                  <th key={c.key} onClick={() => toggleSort(c.key)} style={{ padding: '10px 12px', textAlign: c.align || 'left', fontSize: 10.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: sortKey === c.key ? 'var(--win-accent)' : 'var(--win-muted)', borderBottom: '1px solid var(--win-border)', whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none' }}>
                    {c.label} <span style={{ fontSize: 9, opacity: sortKey === c.key ? 1 : .35 }}>{sortKey === c.key ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordenados.map((a, i) => {
                const r = getRango(a.rango)
                return (
                  <tr key={a.ein || i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--win-surface2)' }}>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: 'var(--win-muted)' }}>{a.gen ?? ''}</td>
                    <td style={{ padding: '8px 12px', fontVariantNumeric: 'tabular-nums', color: 'var(--win-text)' }}>{a.ein}</td>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--win-title)', whiteSpace: 'nowrap' }}>{a.nombre}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--win-muted)', whiteSpace: 'nowrap' }}>{fmtFecha(a.fechaContrato)}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--win-muted)', whiteSpace: 'nowrap' }}>{fmtFecha(a.fechaRegistro)}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {RANGO_IMG[r.id] && <img src={RANGO_IMG[r.id]} alt={r.label} style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }}/>}
                        <span style={{ color: r.color, fontWeight: 600, whiteSpace: 'nowrap' }}>{r.label}</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 12px', color: 'var(--win-muted)', whiteSpace: 'nowrap' }}>{a.rangoVenta || '—'}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--win-text)', whiteSpace: 'nowrap' }}>{a.telefono || '—'}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--win-gold)', fontVariantNumeric: 'tabular-nums' }}>{(a.pp || 0).toLocaleString()}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#7C3AED', fontVariantNumeric: 'tabular-nums' }}>{(a.pg || 0).toLocaleString()}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--win-muted)', fontVariantNumeric: 'tabular-nums' }}>{(a.pnd || 0).toLocaleString()}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--win-muted)', whiteSpace: 'nowrap' }}>{a.einPresentador || '—'}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--win-text)', whiteSpace: 'nowrap' }}>{a.presentador || '—'}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--win-muted)', whiteSpace: 'nowrap' }}>{a.estado || '—'}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--win-muted)', whiteSpace: 'nowrap' }}>{a.ciudad || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function FactoresInversion() {
  const factores = [
    { id: 'EIN', pct: '25%', factor: 0.7828, valor: 15.66, util: '28%' },
    { id: 'COBRE', pct: '30%', factor: 0.7378, valor: 14.76, util: '36%' },
    { id: 'BRONCE', pct: '35%', factor: 0.6928, valor: 13.86, util: '44%' },
    { id: 'PLATA', pct: '40%', factor: 0.6478, valor: 12.96, util: '54%' },
    { id: 'ORO', pct: '45%', factor: 0.6028, valor: 12.06, util: '66%' },
  ]
  const [tc, setTc] = useState(null)
  const [fecha, setFecha] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const cargarTC = useCallback(async () => {
    setLoading(true); setError(false)
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD')
      const data = await res.json()
      if (data && data.rates && data.rates.MXN) {
        setTc(data.rates.MXN)
        setFecha(data.time_last_update_utc || new Date().toUTCString())
      } else { setError(true) }
    } catch (e) { setError(true) }
    setLoading(false)
  }, [])

  useEffect(() => { cargarTC() }, [cargarTC])

  return (
    <div style={{...S.card, marginBottom: 16}}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.cardTitle}>Factores de Inversión</div>
          <div style={{fontSize:11,color:'var(--win-muted)',marginTop:2}}>Factor y valor por punto según rango de descuento</div>
        </div>
        <button onClick={cargarTC} style={{marginLeft:'auto',padding:'6px 12px',borderRadius:6,background:'var(--win-accent-l)',color:'var(--win-accent)',fontSize:11,fontWeight:600,border:'none',cursor:'pointer',fontFamily:'inherit'}}>
          {loading ? 'Actualizando…' : '↻ Actualizar TC'}
        </button>
      </div>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
        <thead><tr style={{borderBottom:'1px solid var(--win-border)',background:'var(--win-surface2)'}}>
          {['Rango NICE','% Descuento','% Utilidad','Factor','Valor PTO (MXN)','Tipo de cambio'].map(h=>(
            <th key={h} style={{padding:'8px 14px',textAlign:'left',fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)'}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {factores.map((row,i)=>{
            const r = RANGOS.find(x=>x.id===row.id)
            return (
              <tr key={row.id} style={{borderBottom:i<factores.length-1?'1px solid var(--win-border)':'none'}}>
                <td style={{padding:'10px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    {RANGO_IMG[row.id] && <img src={RANGO_IMG[row.id]} alt={r?.label||row.id} style={{width:36,height:36,objectFit:'contain',flexShrink:0}}/>}
                    <RankBadge rangoStr={r?.label||row.id}/>
                  </div>
                </td>
                <td style={{padding:'10px 14px',fontWeight:700,color:r?.color,fontSize:13}}>{row.pct}</td>
                <td style={{padding:'10px 14px',fontWeight:700,color:'var(--win-green)',fontSize:13}}>{row.util}</td>
                <td style={{padding:'10px 14px',fontFamily:'monospace',color:'var(--win-text)'}}>{row.factor.toFixed(4)}</td>
                <td style={{padding:'10px 14px',fontWeight:700,color:'var(--win-green)'}}>${row.valor.toFixed(2)} MXN</td>
                <td style={{padding:'10px 14px',color:'var(--win-muted)'}}>{tc ? `$${tc.toFixed(4)} MXN` : (error ? '—' : '…')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{padding:'12px 16px',borderTop:'1px solid var(--win-border)',background:'var(--win-surface2)',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'.05em',color:'var(--win-muted)',textTransform:'uppercase'}}>Tipo de cambio actualizado</div>
        {error ? (
          <div style={{fontSize:12,color:'#B45309'}}>No se pudo actualizar el tipo de cambio. Intenta más tarde.</div>
        ) : tc ? (
          <>
            <div style={{fontSize:14,fontWeight:700,color:'var(--win-title)'}}>1 USD = ${tc.toFixed(4)} MXN</div>
            <div style={{fontSize:11,color:'var(--win-muted)',marginLeft:'auto'}}>Actualizado: {fecha ? new Date(fecha).toLocaleString('es-MX') : '—'} · Fuente: open.er-api.com</div>
          </>
        ) : (
          <div style={{fontSize:12,color:'var(--win-muted)'}}>Cargando tipo de cambio…</div>
        )}
      </div>
    </div>
  )
}

function ConceptosPlan() {
  const conceptos = [
    { sigla: 'PP', nombre: 'Puntos Personales', desc: 'Cada pieza que compras tiene un valor en puntos. Los que acumulas en un periodo calendario son tus PP.', c: 'var(--win-gold)' },
    { sigla: 'PNE', nombre: 'Puntos de Nuevos Empresarios', desc: 'Puntos generados por tu línea descendente durante sus primeros 15 días naturales tras afiliarse.', c: 'var(--win-cyan)' },
    { sigla: 'PG', nombre: 'Puntos de Grupo', desc: 'Puntos de tu línea descendente que está entre 25% y 40% de descuento. Todo cuenta como PG hasta encontrar un rango Oro.', c: 'var(--win-purple)' },
    { sigla: 'PC', nombre: 'Periodo Calendario', desc: 'El periodo entre el día 1° y el último de cada mes. Tus puntos se cuentan dentro de este periodo.', c: 'var(--win-accent)' },
  ]
  return (
    <div style={{...S.card, marginBottom:16}}>
      <div style={S.cardHeader}>
        <div><div style={S.cardTitle}>Conceptos clave del plan</div><div style={{fontSize:11,color:'var(--win-muted)',marginTop:2}}>Los términos que necesitas entender antes de leer los rangos</div></div>
      </div>
      <div style={{padding:'16px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
        {conceptos.map(c=>(
          <div key={c.sigla} style={{display:'flex',gap:12,padding:'14px',borderRadius:10,background:'var(--win-surface2)',border:'1px solid var(--win-border)'}}>
            <div style={{width:46,height:46,borderRadius:10,background:c.c,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,flexShrink:0,letterSpacing:'.02em'}}>{c.sigla}</div>
            <div><div style={{fontSize:13,fontWeight:700,color:'var(--win-title)',marginBottom:3}}>{c.nombre}</div><div style={{fontSize:11.5,color:'var(--win-muted)',lineHeight:1.55}}>{c.desc}</div></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CuponesBienvenida() {
  const cupones = [
    { n:1, monto:'$1,000', req:'100 Puntos Personales', cuando:'dentro del 1er mes de tu afiliación' },
    { n:2, monto:'$1,000', req:'350 PP y/o de nuevos empresarios', cuando:'en tu 2do mes' },
    { n:3, monto:'$1,500', req:'500 PP y/o de nuevos empresarios', cuando:'en tu 3er mes' },
  ]
  return (
    <div style={{...S.card, marginBottom:16}}>
      <div style={S.cardHeader}>
        <div><div style={S.cardTitle}>Cupones de bienvenida</div><div style={{fontSize:11,color:'var(--win-muted)',marginTop:2}}>Tu Kit Empresario incluye $3,500 en productos, en 3 cupones por cumplir puntos</div></div>
        <span style={{marginLeft:'auto',background:'var(--win-gold)',color:'#fff',padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:700}}>$3,500 total</span>
      </div>
      <div style={{padding:'16px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
        {cupones.map(c=>(
          <div key={c.n} style={{padding:'16px',borderRadius:12,background:'var(--win-surface2)',border:'1px solid var(--win-border)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-12,right:-12,width:64,height:64,borderRadius:'50%',background:'var(--win-accent-l)'}}/>
            <div style={{position:'relative'}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:4}}>CUPÓN {c.n}</div>
              <div style={{fontSize:30,fontWeight:700,color:'var(--win-gold)',lineHeight:1,marginBottom:10}}>{c.monto}</div>
              <div style={{fontSize:13,fontWeight:600,color:'var(--win-title)',marginBottom:3}}>Acumula {c.req}</div>
              <div style={{fontSize:11.5,color:'var(--win-muted)',lineHeight:1.5}}>{c.cuando}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:'12px 16px',borderTop:'1px solid var(--win-border)',background:'var(--win-surface2)',fontSize:11.5,color:'var(--win-muted)',lineHeight:1.6}}>
        <b style={{color:'var(--win-text)'}}>¿Cómo se cuentan los meses?</b> Si te afilias del 1 al 20, los meses corren normal (ene · feb · mar). Si te afilias del 21 en adelante, el mes en curso y el siguiente cuentan como tu 1er mes (ene+feb · mar · abr). Los cupones no son acumulables y se canjean dentro de 15 días naturales a partir de su activación.
      </div>
    </div>
  )
}

function ReembolsosDiferencial() {
  const cadena = [
    { id:'ORO', label:'Oro', pct:'45%' },
    { id:'PLATA', label:'Plata', pct:'40%' },
    { id:'BRONCE', label:'Bronce', pct:'35%' },
    { id:'COBRE', label:'Cobre', pct:'30%' },
    { id:'EIN', label:'Empresario', pct:'25%' },
  ]
  return (
    <div style={{...S.card, marginBottom:16}}>
      <div style={S.cardHeader}>
        <div><div style={S.cardTitle}>Reembolsos por Diferencial de Descuento</div><div style={{fontSize:11,color:'var(--win-muted)',marginTop:2}}>Ganas la diferencia de descuento entre tu rango y tu línea descendente no calificada Oro</div></div>
      </div>
      <div style={{padding:'16px',display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:16,alignItems:'center'}} className="rn-reemb">
        <div style={{background:'var(--win-surface2)',border:'1px solid var(--win-border)',borderRadius:12,padding:'18px'}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:14}}>EJEMPLO</div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14}}>
            <div style={{textAlign:'center'}}>
              <div style={{width:54,height:54,borderRadius:'50%',background:getRango('Bronce').bg,border:`2px solid ${getRango('Bronce').color}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 6px',overflow:'hidden'}}>{RANGO_IMG.BRONCE&&<img src={RANGO_IMG.BRONCE} alt='' style={{width:46,height:46,objectFit:'contain'}}/>}</div>
              <div style={{fontSize:12,fontWeight:700,color:'var(--win-title)'}}>María</div>
              <div style={{fontSize:11,color:getRango('Bronce').color,fontWeight:600}}>Bronce · 35%</div>
            </div>
            <div style={{textAlign:'center',color:'var(--win-muted)'}}>
              <div style={{fontSize:11,marginBottom:2}}>patrocina a</div>
              <div style={{fontSize:22}}>→</div>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{width:54,height:54,borderRadius:'50%',background:getRango('Empresario').bg,border:`2px solid ${getRango('Empresario').color}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 6px',overflow:'hidden'}}>{RANGO_IMG.EIN&&<img src={RANGO_IMG.EIN} alt='' style={{width:46,height:46,objectFit:'contain'}}/>}</div>
              <div style={{fontSize:12,fontWeight:700,color:'var(--win-title)'}}>Laura</div>
              <div style={{fontSize:11,color:getRango('Empresario').color,fontWeight:600}}>Empresario · 25%</div>
            </div>
          </div>
          <div style={{marginTop:16,textAlign:'center',padding:'12px',borderRadius:10,background:'var(--win-green-l)',border:'1px solid var(--win-green)'}}>
            <div style={{fontSize:12,color:'var(--win-text)'}}>María recibe el</div>
            <div style={{fontSize:26,fontWeight:700,color:'var(--win-green)',lineHeight:1.1}}>10%</div>
            <div style={{fontSize:11,color:'var(--win-muted)'}}>de reembolso (35% − 25%)</div>
          </div>
        </div>
        <div>
          <div style={{fontSize:13,color:'var(--win-text)',lineHeight:1.65,marginBottom:14}}>Recibes un porcentaje igual a la diferencia de descuento entre tu rango y cada persona de tu organización que aún no califica como Oro. Empiezas a generarlos desde que alcanzas <b>Cobre</b>.</div>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:8}}>ESCALA DE DESCUENTO POR RANGO</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {cadena.map(c=>(
              <div key={c.id} style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:90,fontSize:12,fontWeight:600,color:getRango(c.label).color}}>{c.label}</div>
                <div style={{flex:1,height:14,background:'var(--win-surface2)',borderRadius:7,overflow:'hidden',border:'1px solid var(--win-border)'}}>
                  <div style={{width:`${parseInt(c.pct)/45*100}%`,height:'100%',background:getRango(c.label).color,borderRadius:6}}/>
                </div>
                <div style={{width:40,fontSize:12,fontWeight:700,color:'var(--win-title)',textAlign:'right'}}>{c.pct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DescuentosPorRed() {
  const niveles = [
    { nivel:'1er Nivel Oro', oro:'5%', dia:'5%', dm:'5%' },
    { nivel:'2do Nivel Oro', oro:'4%', dia:'4%', dm:'4%' },
    { nivel:'3er Nivel Oro', oro:'4%', dia:'4%', dm:'4%' },
    { nivel:'4to Nivel Oro', oro:'—', dia:'3%', dm:'3%' },
    { nivel:'5to Nivel Oro', oro:'—', dia:'—', dm:'3%' },
  ]
  return (
    <div style={{...S.card, marginBottom:16}}>
      <div style={S.cardHeader}>
        <div><div style={S.cardTitle}>Descuentos por Red</div><div style={{fontSize:11,color:'var(--win-muted)',marginTop:2}}>Disponible al alcanzar Oro (45%). Se paga según el valor de cálculo de hasta 5 Niveles Oro</div></div>
      </div>
      <div style={{padding:'14px 16px',background:'var(--win-surface2)',borderBottom:'1px solid var(--win-border)',fontSize:12,color:'var(--win-text)',lineHeight:1.65}}>
        <b style={{color:'var(--win-title)'}}>¿Qué es un Nivel Oro?</b> El 1er Nivel Oro empieza en cada frontal Oro y continúa hacia abajo hasta encontrar a otro Oro — ahí inicia el 2do Nivel, y así sucesivamente. Puedes crear tantas líneas como desees.
      </div>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
        <thead><tr style={{borderBottom:'1px solid var(--win-border)',background:'var(--win-surface2)'}}>
          {['Nivel Oro','Rangos 45%','Diamante','Diamante Master / Doble Diamante'].map(h=><th key={h} style={{padding:'9px 14px',textAlign:'left',fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)'}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {niveles.map((row,i)=>(
            <tr key={row.nivel} style={{borderBottom:i<niveles.length-1?'1px solid var(--win-border)':'none'}}>
              <td style={{padding:'11px 14px',fontWeight:600,color:'var(--win-title)'}}>{row.nivel}</td>
              {[row.oro,row.dia,row.dm].map((v,j)=>(
                <td key={j} style={{padding:'11px 14px'}}>
                  <span style={{fontSize:13,fontWeight:700,color:v==='—'?'var(--win-muted)':'var(--win-green)'}}>{v}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{padding:'12px 16px',borderTop:'1px solid var(--win-border)',background:'var(--win-surface2)',fontSize:11.5,color:'var(--win-muted)',lineHeight:1.6}}>
        Los <b style={{color:'var(--win-text)'}}>Diamante</b> reciben además el 3% del 4° Nivel Oro; los <b style={{color:'var(--win-text)'}}>Diamante Master</b> y <b style={{color:'var(--win-text)'}}>Doble Diamante SL</b>, el 3% del 4° y 5° Nivel Oro.
      </div>
    </div>
  )
}

function CertificadoModal({ afiliados, onClose }) {
  const isMobile = useIsMobile()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(null)
  const [rangoId, setRangoId] = useState(null)
  const [foto, setFoto] = useState(null)
  const [tieneCoemp, setTieneCoemp] = useState(false)
  const [coemp, setCoemp] = useState('')
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)
  const tokenRef = useRef(0)

  const filtrados = q.trim()
    ? afiliados.filter(a => (a.nombre || '').toLowerCase().includes(q.toLowerCase()) || (a.ein || '').toLowerCase().includes(q.toLowerCase())).slice(0, 8)
    : []

  const elegir = (a) => { setSel(a); setRangoId(getRango(a.rango).id); setQ('') }

  useEffect(() => {
    if (!sel || !rangoId) { setPreview(null); return }
    const t = ++tokenRef.current
    setBusy(true)
    generarCertificadoCanvas(sel, rangoId, foto, tieneCoemp ? coemp : '').then(c => {
      if (t !== tokenRef.current) return
      setPreview(c.toDataURL('image/png')); setBusy(false)
    }).catch(() => { if (t === tokenRef.current) setBusy(false) })
  }, [sel, rangoId, foto, tieneCoemp, coemp])

  const onFoto = (e) => {
    const f = e.target.files && e.target.files[0]; if (!f) return
    const reader = new FileReader(); reader.onload = () => setFoto(reader.result); reader.readAsDataURL(f)
    e.target.value = ''
  }
  const descargar = async () => {
    if (!sel || !rangoId) return
    try {
      const c = await generarCertificadoCanvas(sel, rangoId, foto, tieneCoemp ? coemp : '')
      const filename = `Certificado-NICE-${(sel.nombre || '').split(' ')[0]}-${(RANGOS.find(r => r.id === rangoId) || {}).label || ''}.png`.replace(/\s+/g, '-')
      downloadCanvas(c, filename)
    } catch (e) {
      console.error(e); alert('No se pudo generar el certificado.\n\nDetalle técnico:\n' + (e && (e.stack || e.message) ? (e.stack || e.message) : String(e)))
    }
  }

  const rSel = rangoId ? RANGOS.find(r => r.id === rangoId) : null

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(8,16,28,.62)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--win-surface)', borderRadius: 14, boxShadow: '0 24px 70px rgba(0,0,0,.45)', width: '100%', maxWidth: 1080, maxHeight: '92vh', overflow: isMobile ? 'auto' : 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#C9A227,#8A6A1E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><div style={{ width: 17, height: 17 }}><Icons.Award/></div></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--win-title)' }}>Crear Certificado NICE</div>
            <div style={{ fontSize: 11.5, color: 'var(--win-muted)' }}>Busca al afiliado, sube su foto y descarga su reconocimiento de rango</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--win-border)', background: 'var(--win-surface2)', color: 'var(--win-muted)', cursor: 'pointer', fontSize: 16, fontFamily: 'inherit' }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', flex: isMobile ? 'none' : 1, minHeight: 0 }} className="rn-cert-grid">
          {/* Panel de controles */}
          <div style={{ borderRight: '1px solid var(--win-border)', padding: 18, overflowY: 'auto', background: 'var(--win-surface2)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: 'var(--win-muted)', textTransform: 'uppercase', marginBottom: 8 }}>1 · Afiliado</div>
            <div style={{ position: 'relative', marginBottom: 6 }}>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o EIN…" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--win-border2)', background: 'var(--win-surface)', fontSize: 13, fontFamily: 'inherit', color: 'var(--win-text)', outline: 'none', boxSizing: 'border-box' }}/>
              {filtrados.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'var(--win-surface)', border: '1px solid var(--win-border2)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,.15)', zIndex: 5, overflow: 'hidden', maxHeight: 280, overflowY: 'auto' }}>
                  {filtrados.map(a => { const ar = getRango(a.rango); return (
                    <div key={a.ein} onClick={() => elegir(a)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', cursor: 'pointer', borderBottom: '1px solid var(--win-border)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--win-surface2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: ar.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>{RANGO_IMG[ar.id] ? <img src={RANGO_IMG[ar.id]} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }}/> : <span style={{ fontSize: 9, fontWeight: 700, color: ar.color }}>{getInitials(a.nombre)}</span>}</div>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--win-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nombre}</div><div style={{ fontSize: 10.5, color: 'var(--win-muted)' }}>{ar.label}</div></div>
                    </div>
                  )})}
                </div>
              )}
            </div>
            {sel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 8, background: 'var(--win-accent-l)', border: '1px solid var(--win-accent)', marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>{RANGO_IMG[getRango(sel.rango).id] && <img src={RANGO_IMG[getRango(sel.rango).id]} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }}/>}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--win-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sel.nombre}</div><div style={{ fontSize: 10.5, color: 'var(--win-accent)' }}>EIN {sel.ein}</div></div>
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: sel ? 'pointer' : 'not-allowed', opacity: sel ? 1 : 0.5, padding: '8px 11px', borderRadius: 8, background: tieneCoemp ? 'var(--win-accent-l)' : 'var(--win-surface)', border: '1px solid ' + (tieneCoemp ? 'var(--win-accent)' : 'var(--win-border2)') }}>
                <input type="checkbox" checked={tieneCoemp} disabled={!sel} onChange={e => setTieneCoemp(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--win-accent)', cursor: 'inherit' }}/>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)' }}>Tiene Coempresario</span>
              </label>
              {tieneCoemp && (
                <input value={coemp} onChange={e => setCoemp(e.target.value)} placeholder="Nombre del coempresario…" style={{ width: '100%', marginTop: 8, padding: '9px 12px', borderRadius: 8, border: '1px solid var(--win-border2)', background: 'var(--win-surface)', fontSize: 13, fontFamily: 'inherit', color: 'var(--win-text)', outline: 'none', boxSizing: 'border-box' }}/>
              )}
              {tieneCoemp && coemp.trim() && <div style={{ fontSize: 10.5, color: 'var(--win-muted)', marginTop: 6 }}>En el certificado: <b style={{ color: 'var(--win-text)' }}>{(sel ? sel.nombre.split(' ').slice(0, 2).map(s => s.charAt(0) + s.slice(1).toLowerCase()).join(' ') : '')} &amp; {coemp.trim()}</b></div>}
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: 'var(--win-muted)', textTransform: 'uppercase', marginBottom: 8 }}>3 · Rango del certificado</div>
            <select value={rangoId || ''} onChange={e => setRangoId(e.target.value)} disabled={!sel} style={{ width: '100%', padding: '9px 11px', borderRadius: 8, border: '1px solid var(--win-border2)', background: sel ? 'var(--win-surface)' : 'var(--win-surface2)', fontSize: 13, fontFamily: 'inherit', color: 'var(--win-text)', marginBottom: 18, cursor: sel ? 'pointer' : 'not-allowed' }}>
              {RANGOS.filter(r => r.id !== 'SIN').map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: 'var(--win-muted)', textTransform: 'uppercase', marginBottom: 8 }}>4 · Foto (opcional)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div onClick={() => fileRef.current && fileRef.current.click()} style={{ width: 62, height: 78, borderRadius: '50%/50%', border: '2px solid var(--win-border2)', background: 'var(--win-surface)', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '50%' }}>
                {foto ? <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <div style={{ width: 20, height: 20, color: 'var(--win-muted)' }}><Icons.Upload/></div>}
              </div>
              <div style={{ flex: 1 }}>
                <button onClick={() => fileRef.current && fileRef.current.click()} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1px solid var(--win-border2)', background: 'var(--win-surface)', color: 'var(--win-text)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 6 }}>{foto ? 'Cambiar foto' : 'Subir foto'}</button>
                {foto && <button onClick={() => setFoto(null)} style={{ width: '100%', padding: '6px 12px', borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--win-red)', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Quitar foto</button>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFoto} style={{ display: 'none' }}/>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--win-muted)', lineHeight: 1.5 }}>La foto se mostrará en un marco ovalado, recortada al centro.</div>
          </div>

          {/* Vista previa */}
          <div style={{ padding: 22, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--win-bg)', gap: 16 }}>
            {!sel ? (
              <div style={{ textAlign: 'center', color: 'var(--win-muted)', maxWidth: 320 }}>
                <div style={{ width: 52, height: 52, margin: '0 auto 14px', color: 'var(--win-border2)' }}><Icons.Award/></div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--win-text)', marginBottom: 6 }}>Busca un afiliado para empezar</div>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>El certificado se genera con su rango actual y un diseño temático según el nivel alcanzado.</div>
              </div>
            ) : (
              <>
                <div style={{ position: 'relative', width: '100%', maxWidth: 680, aspectRatio: '1120 / 864', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,.25)' }}>
                  {preview && <img src={preview} alt="Certificado" style={{ width: '100%', height: '100%', display: 'block' }}/>}
                  {busy && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--win-text)' }}>Generando…</div>}
                </div>
                <button onClick={descargar} disabled={busy} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 26px', borderRadius: 9, border: 'none', background: rSel ? rSel.color : 'var(--win-accent)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 18px rgba(0,0,0,.18)' }}>
                  <div style={{ width: 16, height: 16 }}><Icons.Download/></div>
                  Descargar certificado
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelRangos({ afiliados = [] }) {
  const [certOpen, setCertOpen] = useState(false)
  const grupos = [
    { t:'Rangos de Descuento', s:'Por PP/PG acumulados en el período', rangos:[
      {id:'EIN',req:'Kit de afiliación vigente',pct:'25%',ben:'Pedidos al 25%'},
      {id:'COBRE',req:'700 PP/PG o combinados',pct:'30%',ben:'Reembolsos por Diferencial de Descuento'},
      {id:'BRONCE',req:'1,000 PP/PG o combinados',pct:'35%',ben:'Reembolsos por Diferencial de Descuento'},
      {id:'PLATA',req:'2,000 PP/PG o combinados',pct:'40%',ben:'Reembolsos por Diferencial de Descuento'},
      {id:'ORO',req:'3,000 PP combinados en 1-2 meses  /  4,000 PP+PG en 2 meses  /  1,000 PP + 3 líneas con 1,000 PG',pct:'45%',ben:'Reembolsos + Desc. por Red 1-5% (niveles 1-3)'},
    ]},
    { t:'Por Esfuerzo Personal', s:'3 períodos consecutivos con los PP requeridos', rangos:[
      {id:'ORO_EXPERTO',req:'1,650 PP × 3 meses consecutivos',pct:'45%',ben:'Cupón $2,000 en productos NICE'},
      {id:'ORO_PREMIER',req:'2,300 PP × 3 meses consecutivos',pct:'45%',ben:'Cupón $5,000 en productos NICE'},
      {id:'ORO_ELITE',req:'3,500 PP × 3 meses consecutivos',pct:'45%',ben:'Cupón $7,500 en productos NICE'},
      {id:'PLATINO',req:'4,500 PP × 3 meses consecutivos',pct:'45%',ben:'Cupón $20,000 en productos o $10,000 pesos en efectivo'},
    ]},
    { t:'Por Esfuerzo con Equipo', s:'Frontales Oro generando $200 USD en Desc. por Red', rangos:[
      {id:'ORO_EJECUTIVO',req:'1 frontal Oro generando $200 USD',pct:'45%',ben:'Cupón $5,000 + Desc. por Red 1-5% niveles 1-3'},
      {id:'ORO_SENIOR',req:'2 frontales Oro generando $200 USD c/u',pct:'45%',ben:'Cupón $7,500 + Desc. por Red 1-5% niveles 1-3'},
      {id:'ORO_MASTER',req:'3 frontales Oro generando $200 USD c/u',pct:'45%',ben:'Cheque $10,000 + Desc. por Red 1-5% niveles 1-3'},
      {id:'DIAMANTE',req:'4 frontales Oro + 2,000 PP/PG propios',pct:'45%',ben:'Reembolsos + Desc. por Red + 3% del 4to nivel'},
      {id:'DIAMANTE_MASTER',req:'8 frontales Oro + 2,000 PP/PG propios',pct:'45%',ben:'Reembolsos + Desc. por Red + 3% del 4to y 5to nivel'},
      {id:'DOBLE_DIAMANTE',req:'16 frontales Oro + 2,000 PP/PG propios',pct:'45%',ben:'Todo lo anterior + Cheque $100,000 pesos'},
    ]},
  ]
  return (
    <div>
      {certOpen && <CertificadoModal afiliados={afiliados} onClose={() => setCertOpen(false)}/>}
      <div style={{ ...S.card, marginBottom: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(120deg, var(--win-surface) 60%, var(--win-accent-l))' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--win-title)' }}>Plan de Carrera NICE</div>
          <div style={{ fontSize: 12, color: 'var(--win-muted)', marginTop: 2 }}>Rangos, requisitos y beneficios. Genera certificados de reconocimiento por rango alcanzado.</div>
        </div>
        <button onClick={() => setCertOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 22px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#C9A227,#8A6A1E)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 18px rgba(138,106,30,.32)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <div style={{ width: 17, height: 17 }}><Icons.Award/></div>
          Crear Certificado
        </button>
      </div>
      <ConceptosPlan/>
      <CuponesBienvenida/>
      {grupos.map(g=>(
        <div key={g.t} style={{...S.card,marginBottom:16}}>
          <div style={S.cardHeader}>
            <div><div style={S.cardTitle}>{g.t}</div><div style={{fontSize:11,color:'var(--win-muted)',marginTop:2}}>{g.s}</div></div>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr style={{borderBottom:'1px solid var(--win-border)',background:'var(--win-surface2)'}}>
              {['Rango','Desc.','Requisito','Beneficio al ascender'].map(h=><th key={h} style={{padding:'8px 14px',textAlign:'left',fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)'}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {g.rangos.map((row,i)=>{const r=RANGOS.find(x=>x.id===row.id);return(
                <tr key={row.id} style={{borderBottom:i<g.rangos.length-1?'1px solid var(--win-border)':'none'}}>
                  <td style={{padding:'10px 14px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      {RANGO_IMG[row.id] && <img src={RANGO_IMG[row.id]} alt={r?.label||row.id} style={{width:36,height:36,objectFit:'contain',flexShrink:0}}/>}
                      <RankBadge rangoStr={r?.label||row.id} size={18}/>
                    </div>
                  </td>
                  <td style={{padding:'10px 14px',fontWeight:700,color:r?.color,fontSize:13}}>{row.pct}</td>
                  <td style={{padding:'10px 14px',color:'var(--win-text)',lineHeight:1.6,maxWidth:240}}>{row.req}</td>
                  <td style={{padding:'10px 14px',color:'var(--win-muted)',lineHeight:1.6}}>{row.ben}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      ))}
      <ReembolsosDiferencial/>
      <DescuentosPorRed/>
      <FactoresInversion/>
    </div>
  )
}

function PanelArchivos({ archivos, onCargar, duplicados }) {
  const [drag, setDrag] = useState(false)
  const fileRef = useRef()
  const procesar = async (file) => {
    const afiliados = await parseWorkbookFile(file)
    const dups = detectarDuplicados(afiliados)
    onCargar(file.name, afiliados, dups)
  }
  return (
    <div style={{maxWidth:700}}>
      <div style={{...S.card,marginBottom:16}}>
        <div style={S.cardBody}>
          <div onClick={()=>fileRef.current.click()} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)procesar(f)}} style={{border:`2px dashed ${drag?'var(--win-accent)':'var(--win-border2)'}`,borderRadius:12,padding:'40px 20px',textAlign:'center',cursor:'pointer',transition:'.2s',background:drag?'var(--win-accent-l)':'var(--win-surface)'}}>
            <div style={{width:52,height:52,background:'var(--win-accent-l)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',color:'var(--win-accent)'}}>
              <div style={{width:28,height:28}}><Icons.Upload/></div>
            </div>
            <div style={{fontSize:15,fontWeight:700,color:'var(--win-title)',marginBottom:5}}>Subir tablero Excel de NICE</div>
            <div style={{fontSize:12,color:'var(--win-muted)',marginBottom:14}}>Arrastra el archivo aquí o haz clic para seleccionar · Formato .xlsx del portal NICE</div>
            <button style={{display:'inline-flex',alignItems:'center',gap:8,padding:'9px 22px',borderRadius:8,background:'var(--win-accent)',color:'white',fontSize:13,fontWeight:600,border:'none',cursor:'pointer',fontFamily:'inherit'}}>
              <div style={{width:16,height:16}}><Icons.Upload/></div> Seleccionar archivo
            </button>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f)procesar(f)}}/>
          </div>
        </div>
      </div>
      {archivos.length>0 && (
        <div style={{...S.card,marginBottom:16}}>
          <div style={S.cardHeader}><span style={S.cardTitle}>Archivos cargados</span></div>
          <div>
            {archivos.map((f,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:i<archivos.length-1?'1px solid var(--win-border)':'none'}}>
                <div style={{width:38,height:38,background:'#ECFDF5',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--win-green)',flexShrink:0}}><div style={{width:20,height:20}}><Icons.File/></div></div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:'var(--win-title)'}}>{f.nombre}</div><div style={{fontSize:11,color:'var(--win-muted)',marginTop:2}}>{f.afiliados} afiliados · {f.dups} duplicados · {f.fecha}</div></div>
                <span style={{padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600,background:f.dups>0?'#FEF9EC':'var(--win-green-l)',color:f.dups>0?'#B45309':'var(--win-green)'}}>{f.dups>0?`${f.dups} duplicados`:'Sin duplicados'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {duplicados.length>0 && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{width:18,height:18,color:'#B45309'}}><Icons.Alert/></div>
            <span style={S.cardTitle}>Duplicados detectados</span>
            <span style={{marginLeft:'auto',background:'#FEF9EC',color:'#B45309',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:600}}>{duplicados.length}</span>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr style={{borderBottom:'1px solid var(--win-border)',background:'var(--win-surface2)'}}>
              {['Tipo','EIN','Nombres involucrados'].map(h=><th key={h} style={{padding:'7px 14px',textAlign:'left',fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)'}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {duplicados.map((d,i)=>(
                <tr key={i} style={{borderBottom:i<duplicados.length-1?'1px solid var(--win-border)':'none'}}>
                  <td style={{padding:'9px 14px'}}><span style={{background:'#FEF9EC',color:'#B45309',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:600}}>{d.tipo}</span></td>
                  <td style={{padding:'9px 14px',fontFamily:'monospace',color:'var(--win-muted)',fontSize:11}}>{d.ein}</td>
                  <td style={{padding:'9px 14px',color:'var(--win-text)',lineHeight:1.6}}>{d.nombres?.join(' / ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const MESES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MESES_CORTO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

// ════════════════════════════════════════════════════
// Utilidades compartidas con los paneles cargados por separado
// (PanelReportes.jsx, PanelPlan.jsx, PanelGenealogia.jsx, PanelSemana.jsx)
// vía x-import — se exponen en window porque ese runtime no soporta
// import/require entre archivos .jsx.
// ════════════════════════════════════════════════════

// Días transcurridos desde una fecha que puede venir como Date, número de Excel o texto
function diasDesde(v) {
  let d = null
  if (v instanceof Date) d = v
  else if (typeof v === 'number') d = new Date(Math.round((v - 25569) * 86400 * 1000))
  else if (v) { const p = new Date(v); if (!isNaN(p.getTime())) d = p }
  if (!d || isNaN(d.getTime())) return null
  return Math.floor((Date.now() - d.getTime()) / 86400000)
}

// A quién debe contactar el dueño de `ein` esta semana: oros sin movimiento (urgente),
// candidatos cercanos a Oro (oportunidad), nuevos en sus primeros 15 días, y el resto sin movimiento.
// Compartido entre Plan (por afiliado consultado) y Mi Semana (siempre sobre uno mismo).
function getContactosDirectos(afiliados, ein) {
  const directos = afiliados.filter(a => a.einPresentador === ein)
  const orosInactivos = directos.filter(a => esOroPlus(a) && (a.pp || 0) + (a.pg || 0) === 0)
  const candidatosOro = directos
    .filter(a => !esOroPlus(a) && (a.pp || 0) + (a.pg || 0) > 0)
    .map(a => ({ a, total: (a.pp || 0) + (a.pg || 0), falta: Math.max(0, 3000 - ((a.pp || 0) + (a.pg || 0))) }))
    .sort((x, y) => x.falta - y.falta)
    .slice(0, 5)
  const nuevos15 = directos
    .map(a => ({ a, dias: diasDesde(a.fechaContrato) }))
    .filter(x => x.dias !== null && x.dias >= 0 && x.dias <= 15)
    .sort((x, y) => x.dias - y.dias)
  const einsNuevos = new Set(nuevos15.map(x => x.a.ein))
  const sinMovimiento = directos.filter(a => !esOroPlus(a) && (a.pp || 0) + (a.pg || 0) === 0 && !einsNuevos.has(a.ein))
  return { directos, orosInactivos, candidatosOro, nuevos15, sinMovimiento }
}

Object.assign(window, {
  getRango, getSiguienteRangoObjetivo, getProgresoPct, esOroPlus, valorPuntoDe, frontalGenera, getPlanAccion,
  computeFrontalesOro, buildTree, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, S,
  parseWorkbookFile, MESES_ES, MESES_CORTO, exportAffiliateReport, diasDesde, getContactosDirectos,
})

function ModalBackoffice({ onClose, onSaved }) {
  const saved = useMemo(() => { try { return JSON.parse(localStorage.getItem('rednice-backoffice-creds') || 'null') } catch (e) { return null } }, [])
  const [email, setEmail] = useState(saved?.email || '')
  const [pass, setPass] = useState(saved?.password || '')
  const [usuario, setUsuario] = useState(saved?.usuario || '')
  const [serverUrl, setServerUrl] = useState(() => localStorage.getItem('rednice-server-url') || '')
  const [showPass, setShowPass] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const canSave = email.trim() && pass && usuario.trim()
  const urlFinal = serverUrl.trim() || 'http://localhost:7432'
  const esCloud = urlFinal !== 'http://localhost:7432'

  const guardar = async () => {
    if (!canSave) return
    setGuardando(true)
    const creds = { email: email.trim(), password: pass, usuario: usuario.trim().toLowerCase() }
    localStorage.setItem('rednice-backoffice-creds', JSON.stringify(creds))
    if (serverUrl.trim()) localStorage.setItem('rednice-server-url', serverUrl.trim())
    else localStorage.removeItem('rednice-server-url')
    // Notificar al servidor local si está corriendo
    if (!esCloud) {
      try {
        await fetch('http://localhost:7432/credenciales', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creds),
        })
      } catch (e) {}
    }
    setGuardando(false)
    setGuardado(true)
    onSaved()
  }

  const inp = { width:'100%', boxSizing:'border-box', padding:'10px 14px', borderRadius:10, border:'1px solid var(--win-border)', background:'var(--win-surface2)', color:'var(--win-text)', fontSize:13, fontFamily:'inherit', outline:'none' }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.72)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={onClose}>
      <div style={{background:'var(--win-surface)',borderRadius:16,padding:32,width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,.5)',maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'.15em',color:'var(--win-muted)',marginBottom:8}}>BACKOFFICE NICE</div>
          <div style={{fontSize:22,fontWeight:700,color:'var(--win-title)'}}>Conectar cuenta</div>
          <div style={{fontSize:12,color:'var(--win-muted)',marginTop:4}}>niceonline.com · Tu red personal</div>
        </div>

        {guardado ? (
          <div>
            <div style={{background:'var(--win-green-l)',border:'1px solid var(--win-green)',borderRadius:10,padding:'16px',marginBottom:16,textAlign:'center'}}>
              <div style={{fontSize:18,marginBottom:6}}>✅</div>
              <div style={{color:'var(--win-green)',fontSize:13,fontWeight:700,marginBottom:6}}>Cuenta conectada</div>
              <div style={{color:'var(--win-text)',fontSize:12,lineHeight:1.7}}>
                {esCloud
                  ? 'Haz clic en Sincronizar ahora. Los datos se descargarán automáticamente desde cualquier dispositivo.'
                  : <>Cierra esta ventana y haz clic en <strong>Sincronizar ahora</strong>.<br/><span style={{opacity:.7}}>Asegúrate de tener <strong>iniciar-servidor.bat</strong> corriendo.<br/>(o configura un servidor cloud en Avanzado)</span></>
                }
              </div>
            </div>
            <button onClick={onClose} style={{width:'100%',padding:'11px',borderRadius:10,background:'var(--win-accent)',color:'white',border:'none',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Listo</button>
          </div>
        ) : (
          <>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,fontWeight:600,color:'var(--win-muted)',display:'block',marginBottom:6}}>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@gmail.com" style={inp} autoFocus/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,fontWeight:600,color:'var(--win-muted)',display:'block',marginBottom:6}}>Contraseña</label>
              <div style={{position:'relative'}}>
                <input type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" style={{...inp,paddingRight:44}}/>
                <button onClick={()=>setShowPass(v=>!v)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--win-muted)',fontSize:15,padding:0,lineHeight:1}}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:11,fontWeight:600,color:'var(--win-muted)',display:'block',marginBottom:4}}>Usuario del Backoffice</label>
              <div style={{fontSize:10.5,color:'var(--win-muted)',marginBottom:7,lineHeight:1.5}}>
                El nombre en tu URL: backoffice.niceonline.com/<strong style={{color:'var(--win-accent)'}}>tunombre</strong>/...
              </div>
              <input value={usuario} onChange={e=>setUsuario(e.target.value)} placeholder="ej: abrilservin" style={inp}/>
            </div>

            {/* Sección avanzada: URL del servidor */}
            <button onClick={()=>setShowAdvanced(v=>!v)} style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'none',color:'var(--win-muted)',fontSize:11.5,cursor:'pointer',fontFamily:'inherit',padding:'0 0 12px',fontWeight:600}}>
              <span style={{fontSize:9,transform:showAdvanced?'rotate(90deg)':'rotate(0)',transition:'.15s',display:'inline-block'}}>▶</span>
              Configuración avanzada {esCloud&&'· ✅ Servidor cloud activo'}
            </button>
            {showAdvanced && (
              <div style={{marginBottom:20,padding:'14px',borderRadius:10,background:'var(--win-surface2)',border:'1px solid var(--win-border)'}}>
                <label style={{fontSize:11,fontWeight:600,color:'var(--win-muted)',display:'block',marginBottom:4}}>URL del servidor cloud</label>
                <div style={{fontSize:10.5,color:'var(--win-muted)',marginBottom:8,lineHeight:1.55}}>
                  Déjalo vacío para usar tu PC local (<code>localhost:7432</code>).<br/>
                  Si tienes un servidor en Railway, pega la URL aquí para que funcione desde cualquier dispositivo.
                </div>
                <input value={serverUrl} onChange={e=>setServerUrl(e.target.value)} placeholder="https://rednice-server.up.railway.app" style={{...inp,fontSize:12}}/>
              </div>
            )}

            <button onClick={guardar} disabled={!canSave||guardando} style={{width:'100%',padding:'11px',borderRadius:10,background:'var(--win-accent)',color:'white',border:'none',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit',opacity:(!canSave||guardando)?0.4:1}}>
              {guardando ? 'Guardando...' : 'Guardar y conectar'}
            </button>
          </>
        )}
        <button onClick={onClose} style={{width:'100%',padding:'8px',borderRadius:10,background:'none',color:'var(--win-muted)',border:'none',fontSize:12,cursor:'pointer',fontFamily:'inherit',marginTop:8}}>Cancelar</button>
      </div>
    </div>
  )
}

function useExternal(name) {
  const [v, setV] = useState(() => (typeof window !== 'undefined' ? window[name] : undefined))
  useEffect(() => {
    if (v) return
    const id = setInterval(() => { if (window[name]) { setV(() => window[name]); clearInterval(id) } }, 30)
    return () => clearInterval(id)
  }, [v, name])
  return v
}

function PanelCargando() {
  return <div style={{padding:'40px',textAlign:'center',color:'var(--win-muted)',fontSize:13}}>Cargando…</div>
}

function App() {
  const isMobile = useIsMobile()
  const PanelReportes = useExternal('PanelReportes')
  const PanelPlan = useExternal('PanelPlan')
  const PanelArbol = useExternal('PanelArbol')
  const PanelGenealogia = useExternal('PanelGenealogia')
  const PanelSemana = useExternal('PanelSemana')
  const [tab, setTab] = useState('red')
  const [afiliados, setAfiliados] = useState([])
  const [archivos, setArchivos] = useState([])
  const [duplicados, setDuplicados] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [cargado, setCargado] = useState(false)
  const [genealogiaEin, setGenealogiaEin] = useState(null)
  const [planEin, setPlanEin] = useState(null)
  const [showBackoffice, setShowBackoffice] = useState(false)
  const [backofficeConectado, setBackofficeConectado] = useState(() => {
    try { return !!localStorage.getItem('rednice-backoffice-creds') } catch (e) { return false }
  })
  const [sincronizando, setSincronizando] = useState(false)
  const [syncEstado, setSyncEstado] = useState(null)
  const [syncMsg, setSyncMsg] = useState('')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('rednice-theme') || 'light'
  })
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rednice-theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  const [fontScale, setFontScale] = useState(() => {
    if (typeof window === 'undefined') return 100
    return parseInt(localStorage.getItem('rednice-fontscale'), 10) || 100
  })
  useEffect(() => {
    try { localStorage.setItem('rednice-fontscale', String(fontScale)) } catch (e) {}
  }, [fontScale])
  const zoomOutTexto = () => setFontScale(z => Math.max(80, z - 10))
  const zoomInTexto = () => setFontScale(z => Math.min(140, z + 10))
  const fileRef = useRef()
  const [menuTabsAbierto, setMenuTabsAbierto] = useState(false)

  const irAGenealogia = useCallback((ein) => {
    setGenealogiaEin(ein)
    setTab('genealogia')
  }, [])

  const irAPlan = useCallback((ein) => {
    setPlanEin(ein)
    setTab('plan')
  }, [])

  const onCargar = useCallback((nombre, nuevos, dups) => {
    const procesados = computeFrontalesOro(nuevos)
    setAfiliados(procesados); setDuplicados(dups)
    const now = new Date()
    setArchivos(prev => [{nombre, afiliados:nuevos.length, dups:dups.length, fecha:now.toLocaleDateString('es-MX')}, ...prev])
    const mes = now.getMonth()+1, año = now.getFullYear()
    setPeriodos(prev => {
      const sin = prev.filter(x => !(x.mes===mes && x.año===año))
      return [...sin, {id:`${año}-${String(mes).padStart(2,'0')}-main`, nombre, afiliados:procesados, mes, año, label:`${MESES_CORTO[mes-1]} ${año}`, labelLargo:`${MESES_ES[mes-1]} ${año}`, fecha:now.toLocaleDateString('es-MX')}].sort((a,b)=>a.año*12+a.mes-(b.año*12+b.mes))
    })
    setCargado(true); setTab('red')
  }, [])

  const onAgregarPeriodo = useCallback((p) => {
    setPeriodos(prev => { const sin = prev.filter(x => !(x.mes===p.mes && x.año===p.año)); return [...sin, p].sort((a,b)=>a.año*12+a.mes-(b.año*12+b.mes)) })
  }, [])

  const onEliminarPeriodo = useCallback((id) => {
    setPeriodos(prev => prev.filter(x => x.id !== id))
  }, [])

  const [demoLoading, setDemoLoading] = useState(false)

  // Tipo de cambio USD→MXN en vivo (para el cálculo de Desc. por Red)
  const [tc, setTc] = useState(null)
  // Ajustes del cálculo de Desc. por Red (para afinar contra la regla real de NICE)
  const [volBase, setVolBase] = useState('pp')   // 'pp' | 'ppg' | 'pg'
  const [umbralUSD, setUmbralUSD] = useState(200)
  useEffect(() => {
    let alive = true
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => { if (alive && d && d.rates && d.rates.MXN) setTc(d.rates.MXN) })
      .catch(() => {})
    return () => { alive = false }
  }, [])
  const afiliadosCalc = useMemo(() => computeFrontalesOro(afiliados, tc, volBase, umbralUSD), [afiliados, tc, volBase, umbralUSD])

  const cargarDemo = useCallback(async () => {
    setDemoLoading(true)
    try {
      const res = await fetch('./demo/afiliados.json')
      const data = await res.json()
      onCargar('Datos de ejemplo · red NICE.xlsx', data, detectarDuplicados(data))
    } catch (e) { console.error('No se pudo cargar el ejemplo', e) }
    setDemoLoading(false)
  }, [onCargar])

  const sincronizar = useCallback(async () => {
    setSincronizando(true)
    setSyncEstado(null)
    setSyncMsg('Iniciando...')

    const savedCreds = (() => { try { return JSON.parse(localStorage.getItem('rednice-backoffice-creds')||'null') } catch(e) { return null } })()
    if (!savedCreds) { setShowBackoffice(true); setSincronizando(false); return }

    const serverUrl = localStorage.getItem('rednice-server-url') || 'http://localhost:7432'
    const esCloud = serverUrl !== 'http://localhost:7432'

    const cargarExcel = async (url) => {
      const xlsRes = await fetch(url)
      if (!xlsRes.ok) throw new Error('No se pudo descargar el Excel')
      const buf = await xlsRes.arrayBuffer()
      const afiliados = await parseWorkbookBuffer(buf)
      onCargar('Backoffice NICE · ' + new Date().toLocaleDateString('es-MX'), afiliados, detectarDuplicados(afiliados))
    }

    try {
      let body, urlEstado, urlExcel

      if (esCloud) {
        // Modo cloud: credenciales van en el cuerpo, responde con jobId
        body = JSON.stringify(savedCreds)
        const r = await fetch(`${serverUrl}/sincronizar`, { method:'POST', headers:{'Content-Type':'application/json'}, body })
        if (!r.ok) throw new Error(`Sin respuesta del servidor (${r.status})`)
        const d = await r.json()
        if (!d.ok) { setSyncEstado('error'); setSyncMsg(d.mensaje||'Error'); setSincronizando(false); return }
        const jobId = d.jobId
        urlEstado = `${serverUrl}/estado/${jobId}`
        urlExcel = `${serverUrl}/datos/${jobId}/afiliados.xlsx`
        setSyncMsg('Conectando con el backoffice...')
      } else {
        // Modo local: enviar creds al servidor, usar API global
        try { await fetch(`${serverUrl}/credenciales`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(savedCreds) }) } catch(e) {}
        const r = await fetch(`${serverUrl}/sincronizar`, { method:'POST' })
        if (!r.ok) throw new Error('Sin respuesta del servidor local')
        const d = await r.json()
        if (!d.ok) { setSyncEstado('error'); setSyncMsg(d.mensaje||'Error'); setSincronizando(false); return }
        urlEstado = `${serverUrl}/estado`
        urlExcel = `${serverUrl}/datos/afiliados.xlsx`
        setSyncMsg('Descargando datos del Backoffice NICE...')
      }

      // Polling hasta que termine (máx 10 min)
      let intentos = 0
      const poll = setInterval(async () => {
        intentos++
        if (intentos > 120) {
          clearInterval(poll)
          setSyncEstado('error'); setSyncMsg('Tiempo agotado. Verifica tus credenciales e intenta de nuevo.'); setSincronizando(false); return
        }
        try {
          const est = await fetch(urlEstado)
          const estData = await est.json()
          if (estData.progreso) setSyncMsg(estData.progreso)
          if (estData.error) { clearInterval(poll); setSyncEstado('error'); setSyncMsg(estData.error); setSincronizando(false); return }
          // Local: terminó cuando sincronizando=false y ultimaSync != null
          // Cloud: terminó cuando status === 'listo'
          const termino = esCloud ? estData.status === 'listo' : (!estData.sincronizando && estData.ultimaSync)
          if (termino) {
            clearInterval(poll)
            setSyncMsg('Cargando datos en la app...')
            await cargarExcel(urlExcel)
            setSyncEstado('ok'); setSyncMsg('Red actualizada correctamente'); setSincronizando(false)
          }
        } catch(e) {}
      }, 5000)
    } catch(e) {
      setSyncEstado('error')
      setSyncMsg(esCloud
        ? `No se pudo conectar al servidor cloud. Verifica la URL en Configuración avanzada.`
        : 'El servidor local no responde. Ejecuta iniciar-servidor.bat primero.')
      setSincronizando(false)
    }
  }, [onCargar])

  const handleFile = (e) => {
    const f = e.target.files[0]; if(!f) return
    parseWorkbookFile(f).then((nuevos) => {
      onCargar(f.name, nuevos, detectarDuplicados(nuevos))
    })
  }

  const TABS = [{id:'red',l:'Mi Red',I:Icons.BarChart},{id:'genealogia',l:'Genealogía',I:Icons.GitBranch},{id:'plan',l:'Plan',I:Icons.Plan},{id:'reportes',l:'Reportes',I:Icons.TrendUp},{id:'rangos',l:'Rangos NICE',I:Icons.Trophy},{id:'anuncios',l:'Anuncios',I:Icons.Megaphone},{id:'archivos',l:'Archivos',I:Icons.Upload}]
  // Las pestañas 'arbol' y 'semana' se ocultan a propósito (no se borran) — 'arbol' sigue en
  // PanelGenealogia.jsx y 'semana' en PanelSemana.jsx, por si se reactivan más adelante.
  const curTab = TABS.find(t=>t.id===tab)||TABS[0]
  const self = afiliadosCalc[0]

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',fontFamily:"'DM Sans',system-ui,sans-serif",background:'var(--win-bg)'}}>
      {showBackoffice&&<ModalBackoffice onClose={()=>setShowBackoffice(false)} onSaved={()=>setBackofficeConectado(true)}/>}
      {/* Taskbar */}
      <div className="rn-taskbar" style={{height:isMobile?56:48,background:'var(--win-surface)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--win-border)',display:'flex',alignItems:'center',padding:isMobile?'0 10px':'0 16px',gap:isMobile?8:12,flexShrink:0,zIndex:100}}>
        <div style={{position:'relative',flexShrink:0}}>
          <button onClick={()=>setMenuTabsAbierto(v=>!v)} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 10px 5px 5px',borderRadius:8,border:'1px solid transparent',background:menuTabsAbierto?'var(--win-surface2)':'none',cursor:'pointer',fontFamily:'inherit'}}>
            <div style={{width:26,height:26,background:'var(--win-accent)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'white',boxShadow:'0 0 0 1px rgba(120,200,255,.25), 0 4px 14px rgba(37,99,235,.45)',flexShrink:0}}>
              <div style={{width:14,height:14}}><Icons.Network/></div>
            </div>
            {!isMobile && <span style={{fontSize:14,fontWeight:700,color:'var(--win-title)'}}>Red<span style={{color:'var(--win-accent)'}}>NICE</span></span>}
            <span style={{fontSize:9,color:'var(--win-muted)',transform:menuTabsAbierto?'rotate(180deg)':'none',transition:'transform .15s'}}>▾</span>
          </button>
          {menuTabsAbierto && (
            <>
              <div onClick={()=>setMenuTabsAbierto(false)} style={{position:'fixed',inset:0,zIndex:150,background:'rgba(0,0,0,.35)'}}/>
              <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,zIndex:151,background:'var(--win-surface)',border:'1px solid var(--win-border)',borderRadius:10,boxShadow:'0 14px 34px rgba(0,0,0,.28)',overflow:'hidden',width:230,maxWidth:'calc(100vw - 20px)',maxHeight:'70vh',overflowY:'auto'}}>
                {TABS.map((t,i)=>(
                  <button key={t.id} onClick={()=>{setTab(t.id);setMenuTabsAbierto(false)}} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'11px 14px',border:'none',borderTop:i===0?'none':'1px solid var(--win-border)',background:tab===t.id?'var(--win-accent-l)':'var(--win-surface)',color:tab===t.id?'var(--win-accent)':'var(--win-text)',fontSize:13,fontWeight:tab===t.id?700:500,fontFamily:'inherit',cursor:'pointer',textAlign:'left'}}>
                    <div style={{width:15,height:15,flexShrink:0}}><t.I/></div>
                    <span style={{flex:1}}>{t.l}</span>
                    {t.id==='archivos'&&duplicados.length>0&&<span style={{background:'var(--win-red)',color:'white',fontSize:9,fontWeight:700,borderRadius:10,padding:'1px 6px',flexShrink:0}}>{duplicados.length}</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div style={{flex:'1 1 0',minWidth:0,display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:600,color:'var(--win-text)'}}>
          <div style={{width:14,height:14,flexShrink:0,color:'var(--win-accent)'}}><curTab.I/></div>
          <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{curTab.l}</span>
        </div>
        <div className="rn-actions">
          {self&&<div className="rn-user-chip" style={{display:'flex',alignItems:'center',gap:8,padding:'5px 10px',borderRadius:6,background:'var(--win-surface2)',border:'1px solid var(--win-border)',fontSize:12,color:'var(--win-text)',fontWeight:500}}>
            <div style={{width:22,height:22,borderRadius:'50%',background:'var(--win-accent)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700}}>{getInitials(self.nombre)}</div>
            {self.nombre.split(' ').slice(0,2).join(' ')}
          </div>}
          <button onClick={()=>fileRef.current.click()} title="Cargar Excel" style={{display:'flex',alignItems:'center',gap:6,padding:isMobile?'0':'6px 14px',width:isMobile?38:'auto',height:isMobile?38:'auto',justifyContent:'center',borderRadius:6,background:'var(--win-accent)',color:'white',fontSize:12,fontWeight:600,border:'none',cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>
            <div style={{width:14,height:14}}><Icons.Upload/></div>
            {!isMobile && 'Cargar Excel'}
          </button>
          <div style={{display:'flex',alignItems:'center',borderRadius:6,background:'var(--win-surface2)',border:'1px solid var(--win-border)',flexShrink:0,overflow:'hidden'}}>
            <button onClick={zoomOutTexto} disabled={fontScale<=80} title="Achicar letra" style={{display:'flex',alignItems:'center',justifyContent:'center',width:isMobile?38:30,height:isMobile?38:32,border:'none',background:'none',cursor:fontScale<=80?'default':'pointer',color:fontScale<=80?'var(--win-muted)':'var(--win-text)',fontSize:12,fontWeight:700,padding:0,fontFamily:'inherit'}}>A−</button>
            <button onClick={()=>setFontScale(100)} title="Restablecer tamaño de letra" style={{border:'none',borderLeft:'1px solid var(--win-border)',borderRight:'1px solid var(--win-border)',background:'none',cursor:'pointer',color:'var(--win-muted)',fontSize:10,fontWeight:600,padding:isMobile?'0 8px':'0 6px',height:isMobile?38:32,fontFamily:'inherit',fontVariantNumeric:'tabular-nums'}}>{fontScale}%</button>
            <button onClick={zoomInTexto} disabled={fontScale>=140} title="Agrandar letra" style={{display:'flex',alignItems:'center',justifyContent:'center',width:isMobile?38:30,height:isMobile?38:32,border:'none',background:'none',cursor:fontScale>=140?'default':'pointer',color:fontScale>=140?'var(--win-muted)':'var(--win-text)',fontSize:14,fontWeight:700,padding:0,fontFamily:'inherit'}}>A+</button>
          </div>
          <button onClick={toggleTheme} title={theme==='dark'?'Modo claro':'Modo oscuro'} style={{display:'flex',alignItems:'center',justifyContent:'center',width:isMobile?38:32,height:isMobile?38:32,borderRadius:6,background:'var(--win-surface2)',border:'1px solid var(--win-border)',cursor:'pointer',color:'var(--win-text)',fontSize:14,padding:0,flexShrink:0}}>
            {theme==='dark'?'☀️':'🌙'}
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={handleFile}/>
        </div>
      </div>

      {/* Contenido escalable según preferencia de tamaño de letra */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0,zoom:fontScale/100}}>
      {/* Panel header */}
      <div style={{padding:'14px 24px 12px',background:'var(--win-surface)',borderBottom:'1px solid var(--win-border)',flexShrink:0}}>
        <div style={{fontSize:18,fontWeight:700,color:'var(--win-title)'}}>{curTab.l}</div>
        <div style={{fontSize:12,color:'var(--win-muted)',marginTop:2}}>
          {!cargado&&tab!=='rangos'&&tab!=='archivos'&&tab!=='anuncios'&&tab!=='reportes'&&'Carga un archivo Excel del portal NICE para comenzar'}
          {cargado&&tab==='red'&&`${afiliados.length} afiliados · ${archivos[0]?.fecha}`}
          {cargado&&tab==='arbol'&&`Árbol jerárquico · ${afiliados.length} afiliados`}
          {cargado&&tab==='genealogia'&&`Genealogía visual ramificada · ${afiliados.length} afiliados`}
          {(cargado||tab==='plan')&&tab==='plan'&&'Plan personalizado según el plan de carrera oficial NICE 2025'}
          {tab==='rangos'&&'Plan de carrera NICE oficial · Actualización Enero 2025'}
          {tab==='anuncios'&&'Generador de anuncios con IA · vende más joyería NICE'}
          {tab==='archivos'&&`${archivos.length} archivo${archivos.length!==1?'s':''} cargado${archivos.length!==1?'s':''}`}
          {tab==='reportes'&&`Análisis comparativo multi-período · ${periodos.length} período${periodos.length!==1?'s':''} cargado${periodos.length!==1?'s':''}`}
          {tab==='semana'&&'Metas y planeación semanal · progreso guardado automáticamente'}
        </div>
      </div>

      {/* Body */}
      <div className="rn-body" style={{flex:1,overflowY:'auto',background:'var(--win-bg)'}}>
        {tab==='reportes'&&(PanelReportes?<PanelReportes periodos={periodos} onAgregarPeriodo={onAgregarPeriodo} onEliminarPeriodo={onEliminarPeriodo} tc={tc}/>:<PanelCargando/>)}
        {tab==='semana'&&(PanelSemana?<PanelSemana afiliados={afiliadosCalc}/>:<PanelCargando/>)}
        {!cargado&&tab!=='rangos'&&tab!=='archivos'&&tab!=='anuncios'&&tab!=='reportes'&&(
          <div className="rn-welcome">
            <div className="rn-welcome__bg"/>
            <div className="rn-welcome__scrim"/>
            <div className="rn-welcome__content">
              <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',borderRadius:20,background:'rgba(13,30,48,.55)',border:'1px solid rgba(120,200,255,.28)',backdropFilter:'blur(6px)',marginBottom:22}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:'#4FD0F5',boxShadow:'0 0 10px #4FD0F5'}}/>
                <span style={{fontSize:11,fontWeight:600,letterSpacing:'.12em',color:'#BFE4FB'}}>SEGUIMIENTO DE RED NICE</span>
              </div>
              <div style={{fontSize:38,fontWeight:700,color:'#fff',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:14,textShadow:'0 2px 30px rgba(0,0,0,.5)'}}>
                Visualiza y haz crecer<br/>tu red de mercadeo
              </div>
              <div style={{fontSize:15,color:'rgba(220,235,250,.82)',marginBottom:30,maxWidth:440,marginLeft:'auto',marginRight:'auto',lineHeight:1.65}}>
                Carga el Excel del portal NICE para ver tu árbol de afiliados, genealogía y planes de carrera personalizados — todo en segundos.
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
                <button onClick={()=>fileRef.current.click()} className="rn-glass-btn">
                  <div style={{width:18,height:18,flexShrink:0}}><Icons.Upload/></div>
                  <span style={{display:'flex',flexDirection:'column',alignItems:'flex-start',textAlign:'left',lineHeight:1.35}}>
                    <span style={{fontSize:15,fontWeight:700}}>Seleccionar Archivo Excel</span>
                    <span style={{fontSize:11.5,fontWeight:500,opacity:.85,marginTop:2}}>de la sección de afiliados del portal NICE</span>
                  </span>
                </button>
                {/* Botón de datos de ejemplo oculto a propósito (no borrado) — cargarDemo() sigue disponible más abajo. */}
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginTop:34}}>
                {['Árbol de afiliados','Genealogía visual','Plan de carrera','Reportes para tu equipo'].map(f=>(
                  <div key={f} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 13px',borderRadius:20,background:'rgba(13,30,48,.4)',border:'1px solid rgba(120,200,255,.18)',backdropFilter:'blur(6px)',fontSize:12,fontWeight:500,color:'rgba(220,235,250,.9)'}}>
                    <div style={{width:5,height:5,borderRadius:'50%',background:'#4FD0F5',flexShrink:0}}/>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {(cargado||tab==='rangos'||tab==='archivos'||tab==='anuncios')&&tab!=='reportes'&&(
          <>
            {tab==='red'&&<PanelMiRed afiliados={afiliadosCalc}/>}
            {tab==='arbol'&&(PanelArbol?<PanelArbol afiliados={afiliadosCalc} onGenealogia={irAGenealogia} onPlanAccion={irAPlan} periodos={periodos}/>:<PanelCargando/>)}
            {tab==='genealogia'&&(PanelGenealogia?<PanelGenealogia afiliados={afiliadosCalc} rootEin={genealogiaEin} onChangeRoot={setGenealogiaEin} tc={tc} periodos={periodos} onPlanAccion={irAPlan}/>:<PanelCargando/>)}
            {tab==='plan'&&(PanelPlan?<PanelPlan afiliados={afiliadosCalc} tc={tc} umbralUSD={umbralUSD} preselectEin={planEin} periodos={periodos}/>:<PanelCargando/>)}
            {tab==='rangos'&&<PanelRangos afiliados={afiliadosCalc}/>}
            {tab==='anuncios'&&<PanelAnuncios/>}
            {tab==='archivos'&&<PanelArchivos archivos={archivos} onCargar={onCargar} duplicados={duplicados}/>}
          </>
        )}
      </div>
      </div>
    </div>
  )
}
// Estas funciones se usan desde otros archivos (PanelGenealogia.jsx, PanelPlan.jsx).
// El runtime expone automáticamente las declaraciones "function" de nivel superior,
// pero no las "async function" — por eso hay que exponerlas a mano aquí.
window.exportAffiliateReport = exportAffiliateReport
window.exportTreeReport = exportTreeReport
window.getPotencialEquipo = getPotencialEquipo
window.getSiguienteRangoVenta = getSiguienteRangoVenta
window.esOroPlus = esOroPlus
window.App = App
