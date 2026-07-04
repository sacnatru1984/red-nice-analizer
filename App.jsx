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

function getSiguienteRango(rangoId) {
  const orden = ['EIN','COBRE','BRONCE','PLATA','ORO','ORO_EJECUTIVO','ORO_SENIOR','ORO_MASTER','DIAMANTE','DIAMANTE_MASTER','DOBLE_DIAMANTE']
  const idx = orden.indexOf(rangoId)
  if (idx < 0 || idx >= orden.length - 1) return null
  return RANGOS.find(r => r.id === orden[idx + 1])
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
// Rango objetivo real: el siguiente rango que el afiliado AÚN NO cumple.
// Para rangos de equipo, salta los que ya satisface (evita "tienes 3 de 1").
function getSiguienteRangoObjetivo(afiliado) {
  const r = getRango(afiliado.rango)
  let sig = getSiguienteRango(r.id)
  let guard = 0
  while (sig && sig.tipo === 'equipo' && cumpleRangoEquipo(afiliado, sig) && guard < 12) {
    const next = getSiguienteRango(sig.id)
    if (!next) break
    sig = next; guard++
  }
  return sig
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

function getPlanAccion(afiliado, siguiente, afiliados, tc, umbral) {
  if (!siguiente) return []
  const pp = afiliado.pp || 0
  const pg = afiliado.pg || 0

  if (siguiente.id === 'COBRE') return [
    { num: 1, color: '#DC2626', title: `Alcanzar 700 PP/PG este mes`, desc: `Tienes ${pp + pg} de 700 puntos combinados. Faltan ${Math.max(0, 700 - (pp + pg))} puntos para calificar a Cobre (30%).` },
    { num: 2, color: '#EA580C', title: 'Hacer pedidos personales constantes', desc: 'Cada pieza que compras suma PP. Mantén pedidos regulares durante el mes para no quedarte sin puntos al final del período.' },
    { num: 3, color: '#16A34A', title: 'Invitar a nuevos empresarios', desc: 'Los PNE (puntos de nuevos empresarios en sus primeros 15 días) también cuentan para tu calificación.' },
  ]

  if (siguiente.id === 'BRONCE') return [
    { num: 1, color: '#DC2626', title: `Alcanzar 1,000 PP/PG este mes`, desc: `Tienes ${pp + pg} de 1,000 puntos combinados. Faltan ${Math.max(0, 1000 - (pp + pg))} puntos para Bronce (35%).` },
    { num: 2, color: '#EA580C', title: 'Activar afiliados de tu línea descendente', desc: 'Sus puntos suman como PG mientras estén en rango Empresario a Plata (25%-40%). Apóyalos a hacer pedidos.' },
    { num: 3, color: '#16A34A', title: 'Mantener pedidos propios arriba de 500 PP', desc: 'Tener PP propios sólidos asegura que tu rango no dependa solo de tu línea descendente.' },
  ]

  if (siguiente.id === 'PLATA') return [
    { num: 1, color: '#DC2626', title: `Alcanzar 2,000 PP/PG combinados`, desc: `Tienes ${pp + pg} de 2,000. Faltan ${Math.max(0, 2000 - (pp + pg))} puntos para Plata (40%).` },
    { num: 2, color: '#EA580C', title: 'Desarrollar 2-3 líneas activas', desc: 'Tener varias personas en tu línea descendente haciendo pedidos distribuye el esfuerzo y acumula PG más rápido.' },
    { num: 3, color: '#16A34A', title: 'Ayudar a tus Empresarios a calificar Cobre', desc: 'Cuando alguien en tu red sube de rango, ambos se benefician. Un equipo activo es más estable que depender solo de tus PP.' },
  ]

  if (siguiente.id === 'ORO') return [
    { num: 1, color: '#DC2626', title: 'Opción rápida: 3,000 PP combinados en 1-2 meses', desc: `Tienes ${pp + pg} puntos. Alcanzar 3,000 PP combinados en 1 o 2 meses consecutivos es el camino más directo a Oro (45%).` },
    { num: 2, color: '#EA580C', title: 'Opción equipo: 1,000 PP + 3 líneas con 1,000 PG c/u', desc: 'Si tienes 3 líneas activas generando PG, puedes calificar a Oro con menos PP personales. Coordina pedidos simultáneos.' },
    { num: 3, color: '#16A34A', title: 'Opción 2 meses: 4,000 PP y PG en 2 meses consecutivos', desc: 'También puedes acumular 4,000 PP y PG combinados en dos meses seguidos. Planea tus pedidos mes a mes.' },
  ]

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
    const pasos = []
    const U = umbral || UMBRAL_DESC_USD
    const detalleActivos = orosActivos.slice(0, 3).map(a => { const g = frontalGenera(a, tc, umbral); return `${a.nombre.split(' ').slice(0, 2).join(' ')} (Desc. Red ~$${Math.round(g.usd).toLocaleString()} USD)` }).join(', ') + (orosActivos.length > 3 ? ` y ${orosActivos.length - 3} más` : '')
    pasos.push({
      num: 1, color: '#DC2626',
      title: faltan > 0 ? `Desarrolla ${faltan} frontal${faltan > 1 ? 'es' : ''} Oro más · vas ${tiene}/${req}` : `Mantén activos tus ${req} frontal${req > 1 ? 'es' : ''} Oro · ${tiene}/${req}`,
      desc: faltan > 0
        ? (top
          ? `Tu mejor candidato en gen.1 es ${top.a.nombre} (${getRango(top.a.rango).label}, ${top.pts.toLocaleString()} pts). Le faltan ${top.falta.toLocaleString()} pts para llegar a Oro (3,000 combinados) y contar como tu frontal Oro.`
          : `Necesitas ${req} frontal${req > 1 ? 'es' : ''} Oro activo${req > 1 ? 's' : ''} en tu gen.1 (rango Oro y con movimiento este mes). Aún no hay candidatos con actividad — invita y activa nuevas líneas directas.`)
        : `${detalleActivos} ya ${orosActivos.length > 1 ? 'son Oro activos' : 'es Oro activo'} en tu gen.1. Mantén su actividad cada mes para conservar ${siguiente.label}.`
    })
    const proximo = faltan > 0 ? segundo : top
    if (orosInactivos.length > 0) {
      pasos.push({
        num: 2, color: '#EA580C',
        title: `Reactiva ${orosInactivos.length} frontal${orosInactivos.length > 1 ? 'es' : ''} Oro sin movimiento`,
        desc: `${orosInactivos.slice(0, 2).map(a => a.nombre.split(' ').slice(0, 2).join(' ')).join(', ')}${orosInactivos.length > 2 ? ` y ${orosInactivos.length - 2} más` : ''} ${orosInactivos.length > 1 ? 'son Oro' : 'es Oro'} pero este mes no ${orosInactivos.length > 1 ? 'registran' : 'registra'} PP/PG, así que no ${orosInactivos.length > 1 ? 'cuentan' : 'cuenta'} como frontal Oro. Ayúdalos a reactivar su actividad.`
      })
    } else if (proximo) {
      pasos.push({
        num: 2, color: '#EA580C',
        title: faltan > 0 ? `Tu 2° candidato: ${proximo.a.nombre}` : `Empuja a tu próximo Oro: ${proximo.a.nombre}`,
        desc: `${getRango(proximo.a.rango).label}, ${proximo.pts.toLocaleString()} pts — le faltan ${proximo.falta.toLocaleString()} pts para Oro. ${faltan > 0 ? 'Trabaja 2 líneas en paralelo para no depender de una sola.' : `Apoyarlo te acerca a ${getSiguienteRango(siguiente.id)?.label || 'tu siguiente rango'}.`}`
      })
    } else {
      pasos.push({
        num: 2, color: '#EA580C',
        title: 'Mantén activos a tus frontales Oro',
        desc: 'Cada frontal Oro debe mantener su actividad (PP/PG) cada mes para seguir contando. Acompaña el crecimiento del volumen de su red — eso también sube su Desc. por Red.'
      })
    }
    if (necesitaPropio) {
      const propio = (afiliado.pp || 0) + (afiliado.pg || 0)
      pasos.push({
        num: 3, color: '#16A34A',
        title: `Genera 2,000 PP/PG propios · vas ${propio.toLocaleString()}/2,000`,
        desc: propio >= 2000
          ? `Ya cumples tu volumen personal. Recompensa al subir a ${siguiente.label}: ${recompensa}.`
          : `Te faltan ${(2000 - propio).toLocaleString()} pts propios, además de los ${req} frontales Oro. Recompensa al subir: ${recompensa}.`
      })
    } else {
      pasos.push({
        num: 3, color: '#16A34A',
        title: `Recompensa al alcanzar ${siguiente.label}`,
        desc: `${recompensa}. Mientras más PP acumule tu red en los niveles Oro, mayores serán tus Descuentos por Red.`
      })
    }
    return pasos
  }

  return [
    { num: 1, color: '#2563EB', title: 'Continúa creciendo tu red', desc: 'Sigue desarrollando más frontales Oro y manteniendo tu volumen de PP/PG cada mes.' },
    { num: 2, color: '#16A34A', title: 'Apoya a tu línea descendente', desc: 'Tu éxito está ligado al de tu equipo. Mantén comunicación constante y apóyalos a subir de rango.' },
    { num: 3, color: '#C47F17', title: 'Consulta tu cuenta en niceonline.com', desc: 'Para información actualizada sobre tus Descuentos por Red y estado de calificación.' },
  ]
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
  headerRow.forEach((cell, i) => {
    const n = norm(cell)
    if (!n) return
    for (const [key, synonyms] of Object.entries(HEADER_MAP)) {
      if (idx[key] != null) continue
      if (synonyms.some(syn => n === syn || n.includes(syn))) {
        idx[key] = i
        break
      }
    }
  })
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
}

const s = (styles) => styles
const S = {
  card: { background:'var(--win-surface)', border:'1px solid var(--win-border)', borderRadius:10, boxShadow:'0 1px 3px rgba(0,0,0,.08)' },
  cardHeader: { padding:'12px 16px', borderBottom:'1px solid var(--win-border)', display:'flex', alignItems:'center', gap:8 },
  cardBody: { padding:'14px 16px' },
  cardTitle: { fontSize:13, fontWeight:600, color:'var(--win-title)' },
}

function RankBadge({ rangoStr }) {
  const r = getRango(rangoStr)
  return <span style={{ background:r.bg, color:r.color, padding:'2px 9px', borderRadius:20, fontSize:11, fontWeight:600, display:'inline-block', whiteSpace:'nowrap' }}>{r.label}</span>
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
function downloadCanvas(canvas, filename) {
  canvas.toBlob(blob => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }, 'image/png')
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
  const W=1080, H=1500, c=document.createElement('canvas'); c.width=W; c.height=H
  const ctx=c.getContext('2d')
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
  const c=document.createElement('canvas'); c.width=W; c.height=H
  const ctx=c.getContext('2d'); ctx.fillStyle=REP.bg; ctx.fillRect(0,0,W,H)
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
    ctx.fillStyle='#fff'; ctx.font='700 21px DM Sans, sans-serif'; ctx.fillText('Tu enfoque esta semana',90,y+36)
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

// ── Exportar el árbol genealógico visible (horizontal/landscape) ──
async function exportTreeReport(raiz, pasaFiltro, extra) {
  if (!raiz) return
  // 1) Layout tipo árbol: hojas ocupan slots, padres se centran sobre sus hijos
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
  layout(raiz, 0)
  const leaves = Math.max(1, counter.v)
  const maxDepth = placed.reduce((m, p) => Math.max(m, p.depth), 0)

  // 2) Geometría
  const PAD = 90, HEADER = 240
  let spacingX = 150
  let treeW = leaves * spacingX
  const MAXW = 14000
  if (treeW > MAXW) { spacingX = MAXW / leaves; treeW = MAXW }
  const radius = Math.max(12, Math.min(28, spacingX * 0.3))
  const levelH = 165
  const W = Math.max(1400, Math.round(treeW + PAD * 2))
  const H = HEADER + (maxDepth + 1) * levelH + PAD
  const X = gx => PAD + (gx + 0.5) * spacingX
  const Y = depth => HEADER + 50 + depth * levelH

  // 3) Precargar medallas
  const srcs = [...new Set(placed.map(p => RANGO_IMG[getRango(p.a.rango).id]).filter(Boolean))]
  const medals = {}
  await Promise.all(srcs.map(async s => { medals[s] = await loadImgReport(s) }))

  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d'); ctx.fillStyle = REP.bg; ctx.fillRect(0, 0, W, H)
  ctx.textBaseline = 'alphabetic'

  // 4) Header con imagen de red + datos del afiliado raíz
  const r = getRango(raiz.rango)
  const img = await loadImgReport(fondoRedSrc())
  if (img) { const ar = img.width / img.height, tr = W / HEADER; let sw, sh, sx, sy; if (ar > tr) { sh = img.height; sw = sh * tr; sx = (img.width - sw) / 2; sy = 0 } else { sw = img.width; sh = sw / tr; sx = 0; sy = (img.height - sh) / 2 } ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, HEADER) }
  const g = ctx.createLinearGradient(0, 0, 0, HEADER); g.addColorStop(0, 'rgba(11,26,46,.55)'); g.addColorStop(1, 'rgba(11,26,46,.94)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HEADER)
  ctx.fillStyle = REP.cyan; ctx.font = '600 17px DM Sans, sans-serif'; ctx.fillText('GENEALOGÍA · NICE', PAD, 74)
  ctx.fillStyle = REP.text; ctx.font = '700 44px DM Sans, sans-serif'; ctx.fillText(raiz.nombre.length > 32 ? raiz.nombre.slice(0, 32) + '…' : raiz.nombre, PAD, 126)
  ctx.fillStyle = REP.muted; ctx.font = '400 20px DM Sans, sans-serif'; ctx.fillText(`EIN ${raiz.ein} · Gen. ${raiz.gen}${raiz.ciudad ? ` · ${raiz.ciudad}` : ''}`, PAD, 162)
  ctx.fillStyle = r.color; ctx.font = '700 23px DM Sans, sans-serif'; ctx.fillText(`Rango actual: ${r.label}`, PAD, 200)
  // chips de resumen (afiliados mostrados + PG)
  const totalNodos = placed.length
  const pgTotal = (extra && typeof extra.pg === 'number') ? extra.pg : placed.reduce((s, p) => s + (p.a.pg || 0), 0)
  ctx.font = '600 18px DM Sans, sans-serif'
  const chip = (txt, cx, col) => { const w = ctx.measureText(txt).width + 32; ctx.fillStyle = 'rgba(13,30,48,.55)'; ctx.strokeStyle = 'rgba(120,200,255,.3)'; ctx.lineWidth = 1.5; rrect(ctx, cx, 60, w, 36, 18); ctx.fill(); ctx.stroke(); ctx.fillStyle = col; ctx.fillText(txt, cx + 16, 84); return cx + w + 10 }
  let chx = W - PAD - 360
  // medalla del rango raíz a la derecha
  const medalRaiz = RANGO_IMG[r.id] ? medals[RANGO_IMG[r.id]] || await loadImgReport(RANGO_IMG[r.id]) : null
  if (medalRaiz) { const ms = 130, mcx = W - PAD - ms / 2, mcy = HEADER / 2; const glow = ctx.createRadialGradient(mcx, mcy, 6, mcx, mcy, ms / 2 + 18); glow.addColorStop(0, 'rgba(120,200,255,.22)'); glow.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(mcx, mcy, ms / 2 + 18, 0, 7); ctx.fill(); ctx.drawImage(medalRaiz, mcx - ms / 2, mcy - ms / 2, ms, ms); chx = W - PAD - ms - 380 }
  chip(`${totalNodos.toLocaleString()} afiliados en el árbol`, chx, REP.text)

  // 5) Conectores (cian) — de cada padre a sus hijos visibles
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

  // 6) Nodos
  placed.forEach(p => {
    const rr = getRango(p.a.rango)
    const cx = X(p.gx), cy = Y(p.depth)
    const activo = ((p.a.pp || 0) + (p.a.pg || 0)) > 0
    const esOro = rr.id.includes('ORO') || rr.id === 'PLATINO' || rr.id.includes('DIAMANTE')
    // halo
    if (esOro || activo) { const glow = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius + 10); const gc = esOro ? rr.color : '#4FD0F5'; glow.addColorStop(0, gc + '55'); glow.addColorStop(1, gc + '00'); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, radius + 10, 0, 7); ctx.fill() }
    // disco
    ctx.fillStyle = '#16263B'; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, 7); ctx.fill()
    ctx.lineWidth = 2.5; ctx.strokeStyle = p.a.ein === raiz.ein ? '#4FD0F5' : (activo ? rr.color : '#41506A'); ctx.stroke()
    const medal = RANGO_IMG[rr.id] ? medals[RANGO_IMG[rr.id]] : null
    if (medal) { const ms = radius * 1.7; ctx.drawImage(medal, cx - ms / 2, cy - ms / 2, ms, ms) }
    else { ctx.fillStyle = rr.color; ctx.font = `700 ${Math.round(radius * 0.7)}px DM Sans, sans-serif`; ctx.textAlign = 'center'; ctx.fillText(getInitials(p.a.nombre), cx, cy + radius * 0.25); ctx.textAlign = 'left' }
    // punto de actividad
    ctx.fillStyle = activo ? '#34D399' : '#41506A'; ctx.beginPath(); ctx.arc(cx + radius * 0.72, cy + radius * 0.72, radius * 0.22, 0, 7); ctx.fill()
    // etiquetas
    ctx.textAlign = 'center'
    ctx.fillStyle = rr.color; ctx.font = `700 ${Math.max(10, Math.round(radius * 0.42))}px DM Sans, sans-serif`; ctx.fillText(rr.label, cx, cy + radius + 18)
    ctx.fillStyle = REP.text; ctx.font = `600 ${Math.max(10, Math.round(radius * 0.44))}px DM Sans, sans-serif`
    const nm = p.a.nombre.split(' ').slice(0, 2).join(' ')
    ctx.fillText(nm.length > 18 ? nm.slice(0, 18) + '…' : nm, cx, cy + radius + 18 + Math.max(13, radius * 0.5))
    ctx.textAlign = 'left'
  })

  ctx.fillStyle = REP.muted; ctx.font = '400 17px DM Sans, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Generado con RedNICE · genealogía NICE', W / 2, H - 34); ctx.textAlign = 'left'
  downloadCanvas(c, `RedNICE-arbol-${raiz.nombre.split(' ')[0].toLowerCase()}.png`)
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
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d')
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

function PanelMiRed({ afiliados }) {
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
  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
        <button onClick={()=>exportNetworkReport(afiliados)} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 16px',borderRadius:8,background:'var(--win-surface)',border:'1px solid var(--win-border2)',color:'var(--win-text)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
          <div style={{width:15,height:15}}><Icons.Download/></div>
          Exportar reporte
        </button>
      </div>
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
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr style={{borderBottom:'1px solid var(--win-border)',background:'var(--win-surface2)'}}>
            {['Afiliado','Rango','PP','PG','Ciudad'].map(h=><th key={h} style={{padding:'7px 14px',textAlign:'left',fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)'}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {[...afiliados].sort((a,b)=>(b.pp+b.pg)-(a.pp+a.pg)).slice(0,10).map((a,i)=>(
              <tr key={a.ein} style={{borderBottom:'1px solid var(--win-border)',background:i%2===0?'transparent':'var(--win-surface2)'}}>
                <td style={{padding:'9px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:30,height:30,borderRadius:'50%',background:getRango(a.rango).bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>{RANGO_IMG[getRango(a.rango).id]?<img src={RANGO_IMG[getRango(a.rango).id]} alt='' style={{width:26,height:26,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:getRango(a.rango).color}}>{getInitials(a.nombre)}</span>}</div>
                    <span style={{fontWeight:600,color:'var(--win-title)'}}>{a.nombre}</span>
                  </div>
                </td>
                <td style={{padding:'9px 14px'}}><RankBadge rangoStr={a.rango}/></td>
                <td style={{padding:'9px 14px',fontWeight:700,color:'var(--win-gold)'}}>{a.pp}</td>
                <td style={{padding:'9px 14px',fontWeight:600,color:'#7C3AED'}}>{a.pg}</td>
                <td style={{padding:'9px 14px',color:'var(--win-muted)',fontSize:11}}>{a.ciudad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TreeNode({ nodo, depth=0, onGenealogia }) {
  const [open, setOpen] = useState(depth<2)
  const r = getRango(nodo.rango)
  const hasKids = nodo.children?.length > 0
  const esOro = r.id.includes('ORO')||r.id==='PLATINO'||r.id.includes('DIAMANTE')
  return (
    <div style={{marginBottom:3}}>
      <div onClick={()=>hasKids&&setOpen(o=>!o)} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 12px',borderRadius:7,border:`1px solid ${esOro?r.color+'55':'var(--win-border)'}`,background:esOro?r.bg:'var(--win-surface)',cursor:hasKids?'pointer':'default',transition:'.1s'}}>
        <div style={{width:16,height:16,color:'var(--win-muted)',flexShrink:0}}>
          {hasKids ? (open ? <Icons.ChevDown/> : <Icons.ChevRight/>) : null}
        </div>
        <div style={{width:32,height:32,borderRadius:'50%',background:r.bg,border:'1px solid '+r.color+'44',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>{RANGO_IMG[r.id]?<img src={RANGO_IMG[r.id]} alt={r.label} style={{width:28,height:28,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:r.color}}>{getInitials(nodo.nombre)}</span>}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:700,color:esOro?'#1A2540':'var(--win-title)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{nodo.nombre}</div>
          <div style={{fontSize:10,color:esOro?'#5A6A87':'var(--win-muted)',marginTop:1}}>EIN {nodo.ein} · {nodo.ciudad||nodo.estado||''}</div>
        </div>
        {onGenealogia && (
          <button
            title="Ver genealogía desde este afiliado"
            onClick={e=>{e.stopPropagation(); onGenealogia(nodo.ein)}}
            style={{display:'flex',alignItems:'center',justifyContent:'center',width:26,height:26,borderRadius:6,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-accent)',cursor:'pointer',flexShrink:0,padding:0}}>
            <div style={{width:14,height:14}}><Icons.GitBranch/></div>
          </button>
        )}
        <RankBadge rangoStr={nodo.rango}/>
        <div style={{textAlign:'right',flexShrink:0,minWidth:52}}>
          <div style={{fontSize:12,fontWeight:700,color:'var(--win-gold)'}}>{nodo.pp} PP</div>
          {nodo.pg>0 && <div style={{fontSize:10,color:'#7C3AED'}}>{nodo.pg} PG</div>}
        </div>
        {hasKids && <div style={{fontSize:10,color:'var(--win-muted)',flexShrink:0,minWidth:16,textAlign:'right'}}>{nodo.children.length}</div>}
      </div>
      {open && hasKids && (
        <div style={{marginLeft:26,borderLeft:'2px solid var(--win-border)',paddingLeft:12,paddingTop:2}}>
          {nodo.children.map(c=><TreeNode key={c.ein} nodo={c} depth={depth+1} onGenealogia={onGenealogia}/>)}
        </div>
      )}
    </div>
  )
}

function PanelArbol({ afiliados, onGenealogia }) {
  const [q, setQ] = useState('')
  const tree = buildTree(afiliados)
  const filtrados = q ? afiliados.filter(a=>a.nombre.toLowerCase().includes(q.toLowerCase())||a.ein.includes(q)) : null
  return (
    <div>
      <div style={{...S.card,marginBottom:14}}>
        <div style={{...S.cardBody,padding:'10px 14px'}}>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'var(--win-muted)'}}><Icons.Search/></div>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar afiliado..." style={{width:'100%',padding:'8px 12px 8px 34px',border:'1px solid var(--win-border)',borderRadius:6,background:'var(--win-surface2)',fontSize:13,color:'var(--win-text)',fontFamily:'inherit',outline:'none'}}/>
          </div>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={S.cardTitle}>{q ? `${filtrados.length} resultados` : 'Árbol de red'}</span>
          {!q && <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>{afiliados.length} afiliados · clic para expandir · icono <span style={{display:'inline-block',width:11,height:11,verticalAlign:'-2px',color:'var(--win-accent)'}}><Icons.GitBranch/></span> para ver genealogía</span>}
        </div>
        <div style={S.cardBody}>
          {q ? filtrados.map(a=>(
            <div key={a.ein} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid var(--win-border)'}}>
              <div style={{width:30,height:30,borderRadius:'50%',background:getRango(a.rango).bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>{RANGO_IMG[getRango(a.rango).id]?<img src={RANGO_IMG[getRango(a.rango).id]} alt='' style={{width:26,height:26,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:getRango(a.rango).color}}>{getInitials(a.nombre)}</span>}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:'var(--win-title)'}}>{a.nombre}</div><div style={{fontSize:11,color:'var(--win-muted)'}}>EIN {a.ein} · Gen. {a.gen} · {a.ciudad}</div></div>
              {onGenealogia && (
                <button
                  title="Ver genealogía desde este afiliado"
                  onClick={()=>onGenealogia(a.ein)}
                  style={{display:'flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:6,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-accent)',cursor:'pointer',flexShrink:0,padding:0}}>
                  <div style={{width:15,height:15}}><Icons.GitBranch/></div>
                </button>
              )}
              <RankBadge rangoStr={a.rango}/>
              <div style={{fontWeight:700,color:'var(--win-gold)',fontSize:12,flexShrink:0}}>{a.pp} PP</div>
            </div>
          )) : tree.map(n=><TreeNode key={n.ein} nodo={n} onGenealogia={onGenealogia}/>)}
        </div>
      </div>
    </div>
  )
}

// ── Panel Genealogía: árbol visual ramificado (bolitas compactas) ──
function GenealogiaNodo({ nodo, depth=0, onHover, onLeave, pasaFiltro, onSelect, selectedEin }) {
  const r = getRango(nodo.rango)
  const esOro = r.id.includes('ORO')||r.id==='PLATINO'||r.id.includes('DIAMANTE')
  const activo = (nodo.pp + nodo.pg) > 0
  const hijosFiltrados = (nodo.children || []).filter(c => !pasaFiltro || pasaFiltro(c))
  const hasKids = hijosFiltrados.length > 0
  const size = Math.max(28, 42 - depth*3)
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 4px'}}>
      <div
        onMouseEnter={e=>onHover && onHover(nodo, e)}
        onMouseLeave={()=>onLeave && onLeave()}
        onClick={(e)=>{ e.stopPropagation(); onSelect && onSelect(nodo) }}
        title={`Ver genealogía de ${nodo.nombre}`}
        style={{
          position:'relative',width:size,height:size,borderRadius:'50%',
          background:r.bg,
          border: selectedEin===nodo.ein ? `3px solid #2563EB` : `2px solid ${activo?r.color:'#D1D5DB'}`,
          display:'flex',alignItems:'center',justifyContent:'center',
          cursor:'pointer',
          boxShadow: selectedEin===nodo.ein
            ? '0 0 0 4px rgba(56,198,244,.30), 0 0 18px rgba(56,198,244,.6)'
            : esOro ? `0 0 0 3px ${r.color}44, 0 0 12px ${r.color}55`
            : activo ? '0 0 9px var(--win-glow-cyan)' : 'none',
          transition:'.15s'
        }}>
        {RANGO_IMG[r.id]
          ? <img src={RANGO_IMG[r.id]} alt={r.label} style={{width:size-6,height:size-6,objectFit:'contain'}}/>
          : <span style={{fontSize:Math.max(8,size/4),fontWeight:700,color:r.color}}>{getInitials(nodo.nombre)}</span>}
        <div style={{position:'absolute',bottom:-1,right:-1,width:9,height:9,borderRadius:'50%',background:activo?'#16A34A':'#D1D5DB',border:'1.5px solid var(--win-surface)'}}/>
      </div>
      <div style={{fontSize:8,fontWeight:600,color:r.color,marginTop:3,maxWidth:70,textAlign:'center',lineHeight:1.1}}>{r.label}</div>
      <div style={{fontSize:9,fontWeight:600,color:'var(--win-title)',marginTop:2,maxWidth:70,textAlign:'center',lineHeight:1.15,wordBreak:'break-word'}}>{nodo.nombre.split(' ').slice(0,2).join(' ')}</div>
      {hasKids && (
        <>
          <div style={{width:2,height:12,background:'var(--win-link)',boxShadow:'var(--win-link-glow)'}}/>
          <div style={{position:'relative',display:'flex',alignItems:'flex-start',justifyContent:'center'}}>
            {hijosFiltrados.length>1 && (
              <div style={{position:'absolute',top:0,left:'8px',right:'8px',height:2,background:'var(--win-link)',boxShadow:'var(--win-link-glow)'}}/>
            )}
            {hijosFiltrados.map(c=>(
              <div key={c.ein} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div style={{width:2,height:10,background:'var(--win-link)',boxShadow:'var(--win-link-glow)'}}/>
                <GenealogiaNodo nodo={c} depth={depth+1} onHover={onHover} onLeave={onLeave} pasaFiltro={pasaFiltro} onSelect={onSelect} selectedEin={selectedEin}/>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const RANGOS_FILTRO_GEN = [
  { id: 'ORO_EJECUTIVO', label: 'Oro Ejecutivo' },
  { id: 'ORO', label: 'Oro' },
  { id: 'PLATA', label: 'Plata' },
  { id: 'BRONCE', label: 'Bronce' },
  { id: 'COBRE', label: 'Cobre' },
  { id: 'EIN', label: 'Empresario' },
]
function bucketRangoGen(id) {
  if (['ORO_MASTER','ORO_SENIOR','ORO_EJECUTIVO','PLATINO','DIAMANTE','DIAMANTE_MASTER','DOBLE_DIAMANTE'].includes(id)) return 'ORO_EJECUTIVO'
  if (['ORO','ORO_EXPERTO','ORO_PREMIER','ORO_ELITE'].includes(id)) return 'ORO'
  return id
}

function PanelGenealogia({ afiliados, rootEin, onChangeRoot, tc }) {
  const tree = buildTree(afiliados)
  const [q, setQ] = useState('')
  const [drop, setDrop] = useState(false)
  const [tooltip, setTooltip] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [history, setHistory] = useState([]) // pila de EINs anteriores
  const scrollRef = useRef(null)
  const [filtroRangos, setFiltroRangos] = useState(() => new Set(RANGOS_FILTRO_GEN.map(x => x.id)))
  const toggleFiltro = (id) => setFiltroRangos(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const pasaFiltro = (n) => filtroRangos.has(bucketRangoGen(getRango(n.rango).id))

  const findInTree = (nodos, ein) => {
    for (const n of nodos) {
      if (n.ein === ein) return n
      const found = n.children?.length ? findInTree(n.children, ein) : null
      if (found) return found
    }
    return null
  }
  const raiz = rootEin ? findInTree(tree, rootEin) : null

  // breadcrumb: historial + raíz actual
  const breadcrumb = history
    .map(ein => { const n = findInTree(tree, ein); return n ? { ein, nombre: n.nombre } : null })
    .filter(Boolean)
  if (raiz) breadcrumb.push({ ein: raiz.ein, nombre: raiz.nombre })

  // Encuentra la ruta de ancestros (EINs) desde la raíz hasta el EIN dado (sin incluirlo)
  const findPath = (nodos, ein, acc=[]) => {
    for (const n of nodos || []) {
      if (n.ein === ein) return acc
      const sub = findPath(n.children, ein, [...acc, n.ein])
      if (sub) return sub
    }
    return null
  }

  const navegarA = (ein) => {
    if (ein === rootEin) return
    // Siempre reconstruir el historial con la ruta completa de ancestros,
    // para que el breadcrumb muestre "Árbol principal › ... › NOMBRE"
    // tanto si se navega por clic como si se selecciona desde el buscador.
    const path = findPath(tree, ein) || []
    setHistory(path)
    onChangeRoot(ein)
  }
  const regresar = () => {
    setHistory(h => {
      if (h.length === 0) { onChangeRoot(null); return h }
      const nuevo = h.slice(0, -1)
      onChangeRoot(h[h.length - 1])
      return nuevo
    })
  }
  const irPrincipal = () => { setHistory([]); onChangeRoot(null) }

  const sugerencias = q.trim()
    ? afiliados.filter(a =>
        a.nombre.toLowerCase().includes(q.toLowerCase()) ||
        String(a.ein).includes(q.trim())
      ).slice(0, 8)
    : []

  const seleccionar = (a) => {
    // Desde el buscador: reconstruir el breadcrumb con la ruta real de ancestros
    // para que se vea "Árbol principal › ANCESTRO1 › ... › NOMBRE".
    const path = findPath(tree, a.ein) || []
    setHistory(path)
    if (a.ein !== rootEin) onChangeRoot(a.ein)
    setQ(a.nombre)
    setDrop(false)
  }

  // centrar árbol al cambiar de raíz
  useEffect(() => {
    if (!scrollRef.current || !raiz) return
    const el = scrollRef.current
    requestAnimationFrame(() => {
      el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2)
      el.scrollTop = 0
    })
  }, [rootEin, zoom])

  const zoomIn = () => setZoom(z => Math.min(3, +(z + 0.15).toFixed(2)))
  const zoomOut = () => setZoom(z => Math.max(0.4, +(z - 0.15).toFixed(2)))
  const zoomReset = () => setZoom(1)


  return (
    <div>
      <div style={{...S.card,marginBottom:14}}>
        <div style={{...S.cardBody,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:1,minWidth:240,maxWidth:420}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 10px',border:'1px solid var(--win-border)',borderRadius:6,background:'var(--win-surface2)'}}>
              <div style={{width:14,height:14,color:'var(--win-muted)'}}><Icons.Search/></div>
              <input
                value={q}
                onChange={e=>{setQ(e.target.value); setDrop(true)}}
                onFocus={()=>setDrop(true)}
                onBlur={()=>setTimeout(()=>setDrop(false),150)}
                placeholder="Buscar afiliado por nombre o EIN..."
                style={{flex:1,border:'none',background:'transparent',fontSize:13,color:'var(--win-text)',fontFamily:'inherit',outline:'none'}}/>
              {(q || rootEin) && (
                <button onClick={()=>{setQ(''); irPrincipal(); setDrop(false)}} style={{border:'none',background:'transparent',color:'var(--win-muted)',cursor:'pointer',fontSize:14,fontWeight:700}}>×</button>
              )}
            </div>
            {drop && sugerencias.length>0 && (
              <div style={{position:'absolute',top:'100%',left:0,right:0,marginTop:4,background:'var(--win-surface)',border:'1px solid var(--win-border)',borderRadius:6,boxShadow:'var(--shadow-md)',maxHeight:280,overflowY:'auto',zIndex:50}}>
                {sugerencias.map(a=>{
                  const r = getRango(a.rango)
                  return (
                    <div key={a.ein} onMouseDown={()=>seleccionar(a)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',cursor:'pointer',borderBottom:'1px solid var(--win-border)'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--win-surface2)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <div style={{width:28,height:28,borderRadius:'50%',background:r.bg,border:`1.5px solid ${r.color}66`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {RANGO_IMG[r.id]?<img src={RANGO_IMG[r.id]} alt="" style={{width:24,height:24,objectFit:'contain'}}/>:<span style={{fontSize:10,fontWeight:700,color:r.color}}>{getInitials(a.nombre)}</span>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:600,color:'var(--win-title)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.nombre}</div>
                        <div style={{fontSize:10,color:'var(--win-muted)'}}>EIN {a.ein} · {r.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>
            {raiz ? `${raiz.nombre} · ${countDescendants(raiz)+1} afiliados` : 'Selecciona una persona'}
          </div>
        </div>
        <div style={{padding:'12px 16px',borderTop:'1px solid var(--win-border)',background:'var(--win-surface2)',display:'flex',flexWrap:'wrap',gap:14,alignItems:'flex-end'}}>
          <span style={{fontSize:10,fontWeight:700,letterSpacing:'.06em',color:'var(--win-muted)',textTransform:'uppercase',alignSelf:'center'}}>Filtrar rangos:</span>
          {RANGOS_FILTRO_GEN.map(f => {
            const rDef = RANGOS.find(rr => rr.id === f.id)
            const checked = filtroRangos.has(f.id)
            return (
              <label key={f.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,cursor:'pointer',userSelect:'none',opacity:checked?1:0.5}}>
                {RANGO_IMG[f.id] && <img src={RANGO_IMG[f.id]} alt={f.label} style={{width:36,height:36,objectFit:'contain'}}/>}
                <span style={{background:rDef?.bg,color:rDef?.color,padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:600,whiteSpace:'nowrap'}}>{f.label}</span>
                <input type="checkbox" checked={checked} onChange={()=>toggleFiltro(f.id)} style={{cursor:'pointer',accentColor:'var(--win-accent)'}}/>
              </label>
            )
          })}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardHeader}>
          <button onClick={regresar} disabled={!rootEin && history.length===0}
            title="Regresar a la vista anterior"
            style={{height:28,padding:'0 10px',marginRight:6,border:'1px solid var(--win-border)',borderRadius:6,background:(!rootEin && history.length===0)?'var(--win-surface)':'var(--win-surface2)',cursor:(!rootEin && history.length===0)?'not-allowed':'pointer',fontSize:11,fontWeight:600,color:'var(--win-title)',opacity:(!rootEin && history.length===0)?0.5:1,display:'flex',alignItems:'center',gap:4}}>
            ← Regresar
          </button>
          <button onClick={irPrincipal} disabled={!rootEin && history.length===0}
            title="Volver al árbol principal"
            style={{height:28,padding:'0 10px',marginRight:10,border:'1px solid var(--win-border)',borderRadius:6,background:(!rootEin && history.length===0)?'var(--win-surface)':'var(--win-surface2)',cursor:(!rootEin && history.length===0)?'not-allowed':'pointer',fontSize:11,fontWeight:600,color:'var(--win-title)',opacity:(!rootEin && history.length===0)?0.5:1}}>
            ⌂ Árbol principal
          </button>
          <span style={S.cardTitle}>{raiz ? `Ramificaciones de ${raiz.nombre}` : 'Ramificaciones'}</span>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
            <button onClick={zoomOut} title="Alejar" style={{width:28,height:28,border:'1px solid var(--win-border)',borderRadius:6,background:'var(--win-surface2)',cursor:'pointer',fontSize:16,fontWeight:700,color:'var(--win-title)',display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
            <button onClick={zoomReset} title="Restablecer zoom" style={{minWidth:50,height:28,padding:'0 8px',border:'1px solid var(--win-border)',borderRadius:6,background:'var(--win-surface2)',cursor:'pointer',fontSize:11,fontWeight:600,color:'var(--win-title)',fontVariantNumeric:'tabular-nums'}}>{Math.round(zoom*100)}%</button>
            <button onClick={zoomIn} title="Acercar" style={{width:28,height:28,border:'1px solid var(--win-border)',borderRadius:6,background:'var(--win-surface2)',cursor:'pointer',fontSize:16,fontWeight:700,color:'var(--win-title)',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:6,padding:'8px 16px',borderBottom:'1px solid var(--win-border)',background:'var(--win-surface2)',fontSize:11}}>
          <button onClick={irPrincipal} style={{border:'none',background:'transparent',color:rootEin?'var(--win-accent)':'var(--win-title)',cursor:'pointer',fontWeight:700,padding:0,fontSize:11}}>
            Árbol principal
          </button>
          {breadcrumb.map((b, i) => {
            const esUltimo = i === breadcrumb.length - 1
            return (
              <span key={b.ein+'-'+i} style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{color:'var(--win-muted)'}}>›</span>
                {esUltimo ? (
                  <span style={{color:'var(--win-title)',fontWeight:700}}>{b.nombre}</span>
                ) : (
                  <button onClick={()=>{
                    // saltar a un ancestro: recortar history hasta ese índice
                    setHistory(history.slice(0, i))
                    onChangeRoot(b.ein)
                  }} style={{border:'none',background:'transparent',color:'var(--win-accent)',cursor:'pointer',padding:0,fontSize:11,fontWeight:600}}>
                    {b.nombre}
                  </button>
                )}
              </span>
            )
          })}
        </div>

        {/* Tarjeta de info de la persona seleccionada */}
        {raiz && (() => {
          const rr = getRango(raiz.rango)
          const directos = (raiz.children || []).length
          const total = countDescendants(raiz)
          const pgVis = sumarPGVisible(raiz, pasaFiltro)
          return (
            <div style={{display:'flex',alignItems:'center',gap:14,padding:'12px 16px',borderBottom:'1px solid var(--win-border)',background:'var(--win-surface)'}}>
              <div style={{width:52,height:52,borderRadius:'50%',background:rr.bg,border:`2px solid ${rr.color}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 0 0 3px rgba(37,99,235,.18)'}}>
                {RANGO_IMG[rr.id]
                  ? <img src={RANGO_IMG[rr.id]} alt={rr.label} style={{width:44,height:44,objectFit:'contain'}}/>
                  : <span style={{fontSize:14,fontWeight:700,color:rr.color}}>{getInitials(raiz.nombre)}</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:'var(--win-title)'}}>{raiz.nombre}</div>
                <div style={{display:'flex',gap:6,marginTop:4,flexWrap:'wrap'}}>
                  <span style={{background:rr.bg,color:rr.color,padding:'2px 8px',borderRadius:10,fontSize:10,fontWeight:700}}>{rr.label}</span>
                  <span style={{fontSize:10,color:'var(--win-muted)'}}>EIN {raiz.ein}</span>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:14,fontSize:11}}>
                <div style={{textAlign:'center',padding:'8px 16px',borderRadius:12,background:'linear-gradient(135deg, rgba(124,58,237,.14), rgba(124,58,237,.05))',border:'1.5px solid rgba(124,58,237,.4)',boxShadow:'0 0 0 3px rgba(124,58,237,.07)'}}>
                  <div style={{fontSize:24,fontWeight:800,color:'#7C3AED',lineHeight:1,fontVariantNumeric:'tabular-nums',letterSpacing:'-.01em'}}>{pgVis.pg.toLocaleString()}</div>
                  <div style={{color:'#7C3AED',fontWeight:700,letterSpacing:'.04em',fontSize:10,marginTop:3}}>PG EN EL ÁRBOL</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:700,color:'var(--win-title)'}}>{directos}</div>
                  <div style={{color:'var(--win-muted)'}}>Directos</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:700,color:'var(--win-accent)'}}>{total}</div>
                  <div style={{color:'var(--win-muted)'}}>Total ramificación</div>
                </div>
                <button onClick={()=>exportTreeReport(raiz, pasaFiltro, {pg: pgVis.pg})} title="Descargar el árbol visible como imagen" style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:9,background:'var(--win-accent)',border:'none',color:'#fff',fontSize:12.5,fontWeight:600,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 2px 8px rgba(37,99,235,.35)',whiteSpace:'nowrap'}}>
                  <div style={{width:15,height:15}}><Icons.Download/></div>
                  Descargar Árbol
                </button>
              </div>
            </div>
          )
        })()}

        {/* ── Tabla de puntos y valor por nivel ── */}
        {raiz && (() => {
          const tcVal = tc || TC_FALLBACK
          const nivelStats = {}
          const walkNivel = (n, d) => {
            if (d > 0) {
              const rangoId = getRango(n.rango).id
              if (!nivelStats[d]) nivelStats[d] = { personas: 0, pp: 0, pg: 0, mxn: 0 }
              nivelStats[d].personas++
              nivelStats[d].pp += (n.pp || 0)
              nivelStats[d].pg += (n.pg || 0)
              nivelStats[d].mxn += (n.pp || 0) * valorPuntoDe(rangoId)
            }
            const hijos = (n.children || []).filter(c => !pasaFiltro || pasaFiltro(c))
            for (const c of hijos) walkNivel(c, d + 1)
          }
          walkNivel(raiz, 0)
          const niveles = Object.keys(nivelStats).map(Number).sort((a, b) => a - b)
          if (!niveles.length) return null
          const tot = niveles.reduce((acc, d) => {
            acc.personas += nivelStats[d].personas
            acc.pp += nivelStats[d].pp
            acc.pg += nivelStats[d].pg
            acc.mxn += nivelStats[d].mxn
            return acc
          }, { personas: 0, pp: 0, pg: 0, mxn: 0 })
          const fMXN = v => '$' + Math.round(v).toLocaleString('es-MX')
          const fUSD = v => 'USD $' + Math.round(v / tcVal).toLocaleString('en-US')
          const TH = ({ children, right }) => (
            <th style={{ padding: '5px 10px', textAlign: right ? 'right' : 'left', color: 'var(--win-muted)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap', background: 'var(--win-surface2)', borderBottom: '2px solid var(--win-border)' }}>{children}</th>
          )
          return (
            <div style={{ borderBottom: '1px solid var(--win-border)', background: 'var(--win-surface)', padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#C47F17', boxShadow: '0 0 6px #C47F17' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--win-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Puntos y valor por nivel</span>
                <span style={{ fontSize: 10, color: 'var(--win-muted)', marginLeft: 4 }}>· TC: ${tcVal.toFixed(2)} MXN/USD</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 520 }}>
                  <thead>
                    <tr>
                      <TH>Nivel</TH>
                      <TH right>Personas</TH>
                      <TH right>PP</TH>
                      <TH right>PG</TH>
                      <TH right>Valor MXN</TH>
                      <TH right>Valor USD</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {niveles.map((d, i) => {
                      const s = nivelStats[d]
                      return (
                        <tr key={d} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--win-surface2)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--win-accent-l)'}
                          onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--win-surface2)'}>
                          <td style={{ padding: '7px 10px', fontWeight: 700, color: 'var(--win-title)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--win-border)' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                              <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--win-accent-l)', color: 'var(--win-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{d}</span>
                              Nivel {d}
                            </span>
                          </td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--win-text)', fontVariantNumeric: 'tabular-nums', borderBottom: '1px solid var(--win-border)' }}>{s.personas}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 600, color: 'var(--win-gold)', fontVariantNumeric: 'tabular-nums', borderBottom: '1px solid var(--win-border)' }}>{s.pp.toLocaleString()}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 600, color: '#7C3AED', fontVariantNumeric: 'tabular-nums', borderBottom: '1px solid var(--win-border)' }}>{s.pg.toLocaleString()}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 600, color: '#16A34A', fontVariantNumeric: 'tabular-nums', borderBottom: '1px solid var(--win-border)' }}>{fMXN(s.mxn)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--win-accent)', fontVariantNumeric: 'tabular-nums', borderBottom: '1px solid var(--win-border)' }}>{fUSD(s.mxn)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: 'var(--win-surface2)', borderTop: '2px solid var(--win-border)' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 800, color: 'var(--win-title)', fontSize: 12 }}>Total</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--win-title)', fontVariantNumeric: 'tabular-nums' }}>{tot.personas}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: 'var(--win-gold)', fontVariantNumeric: 'tabular-nums' }}>{tot.pp.toLocaleString()}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#7C3AED', fontVariantNumeric: 'tabular-nums' }}>{tot.pg.toLocaleString()}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#16A34A', fontVariantNumeric: 'tabular-nums' }}>{fMXN(tot.mxn)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--win-accent)', fontVariantNumeric: 'tabular-nums' }}>{fUSD(tot.mxn)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )
        })()}

        <div ref={scrollRef} style={{...S.cardBody,overflow:'auto',padding:'24px 16px',position:'relative'}}>
          {!raiz ? (
            <div style={{padding:'48px 16px',textAlign:'center',color:'var(--win-muted)',fontSize:13}}>
              Selecciona una persona para ver su genealogía.
              <div style={{marginTop:6,fontSize:11}}>Usa el buscador de arriba o haz clic en un nodo.</div>
            </div>
          ) : (
            <div style={{display:'inline-flex',justifyContent:'center',minWidth:'100%',transform:`scale(${zoom})`,transformOrigin:'top center',transition:'transform .15s ease'}}>
              <GenealogiaNodo
                nodo={raiz}
                pasaFiltro={pasaFiltro}
                selectedEin={rootEin}
                onSelect={(n)=>navegarA(n.ein)}
                onHover={(n,e)=>setTooltip({a:n,x:e.clientX,y:e.clientY})}
                onLeave={()=>setTooltip(null)}/>
            </div>
          )}
        </div>
      </div>

      {tooltip && (
        <div style={{
          position:'fixed',zIndex:999,
          left:Math.min(tooltip.x+12,window.innerWidth-240),
          top:Math.max(tooltip.y-100,12),
          background:'var(--win-tooltip-bg)',color:'var(--win-tooltip-fg)',
          borderRadius:8,padding:'10px 14px',
          fontSize:12,minWidth:200,maxWidth:260,pointerEvents:'none',
          boxShadow:'0 4px 16px rgba(0,0,0,.3)'
        }}>
          <div style={{fontWeight:700,marginBottom:4}}>{tooltip.a.nombre}</div>
          <div style={{opacity:.8,marginBottom:6,fontSize:11}}>EIN {tooltip.a.ein}</div>
          <div style={{display:'flex',gap:8,marginBottom:6}}>
            <span style={{background:getRango(tooltip.a.rango).bg,color:getRango(tooltip.a.rango).color,padding:'1px 7px',borderRadius:10,fontSize:10,fontWeight:600}}>{getRango(tooltip.a.rango).label}</span>
          </div>
          <div style={{display:'flex',gap:10,fontSize:11,marginBottom:4}}>
            <span><b>{tooltip.a.pp}</b> PP</span>
            <span><b>{tooltip.a.pg}</b> PG</span>
          </div>
          <div style={{opacity:.7,fontSize:11}}>{[tooltip.a.ciudad,tooltip.a.estado].filter(Boolean).join(', ')||'Sin dirección'}</div>
        </div>
      )}
    </div>
  )
}

function countDescendants(nodo) {
  if (!nodo.children?.length) return 0
  return nodo.children.reduce((acc,c)=>acc+1+countDescendants(c),0)
}

// Suma los PG de la rama visible según el filtro de rangos (incluye la raíz)
function sumarPGVisible(nodo, pasaFiltro) {
  let pg = (nodo.pg || 0), nodos = 1
  for (const c of (nodo.children || [])) {
    if (pasaFiltro && !pasaFiltro(c)) continue
    const r = sumarPGVisible(c, pasaFiltro)
    pg += r.pg; nodos += r.nodos
  }
  return { pg, nodos }
}

// ── Red visual de 5 generaciones ──
function RedVisual({ sel, afiliados, filtroRangos, bucketRango }) {
  const [tooltip, setTooltip] = useState(null)

  const pasaFiltro = (a) => {
    if (!filtroRangos || !bucketRango) return true
    const id = getRango(a.rango).id
    return filtroRangos.has(bucketRango(id))
  }

  // Obtener descendientes hasta 3 generaciones
  const getDescendientes = (einRaiz, maxGen) => {
    const resultado = []
    const buscar = (ein, genActual) => {
      if (genActual > maxGen) return
      const hijos = afiliados.filter(a => a.einPresentador === ein)
      hijos.forEach(h => {
        resultado.push({ ...h, genRelativa: genActual })
        buscar(h.ein, genActual + 1)
      })
    }
    buscar(einRaiz, 1)
    return resultado
  }

  const descAll = getDescendientes(sel.ein, 5)
  const desc = descAll.filter(pasaFiltro)
  const gen1 = desc.filter(d => d.genRelativa === 1)
  const gen2 = desc.filter(d => d.genRelativa === 2)
  const gen3 = desc.filter(d => d.genRelativa === 3)
  const gen4 = desc.filter(d => d.genRelativa === 4)
  const gen5 = desc.filter(d => d.genRelativa === 5)
  const rSel = getRango(sel.rango)

  const Bolita = ({ a, size=36 }) => {
    const r = getRango(a.rango)
    const activo = (a.pp + a.pg) > 0
    const esOro = r.id.includes('ORO') || r.id === 'PLATINO' || r.id.includes('DIAMANTE')
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}
        onMouseEnter={e => setTooltip({ a, x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setTooltip(null)}>
        <div style={{
          width: size, height: size, borderRadius: '50%',
          background: r.bg, border: `2px solid ${activo ? r.color : '#D1D5DB'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size > 30 ? 10 : 8, fontWeight: 700, color: r.color,
          cursor: 'pointer', transition: '.15s', position: 'relative',
          boxShadow: esOro ? `0 0 0 3px ${r.color}33` : 'none'
        }}>
          {RANGO_IMG[r.id] ? <img src={RANGO_IMG[r.id]} alt={r.label} style={{ width: size - 6, height: size - 6, objectFit: 'contain' }}/> : <span style={{ fontSize: size > 30 ? 10 : 8, fontWeight: 700, color: r.color }}>{getInitials(a.nombre)}</span>}
          {/* Indicador de actividad */}
          <div style={{
            position: 'absolute', bottom: -1, right: -1,
            width: 10, height: 10, borderRadius: '50%',
            background: activo ? '#16A34A' : '#D1D5DB',
            border: '1.5px solid var(--win-surface)'
          }}/>
        </div>
      </div>
    )
  }

  const totalActivos = desc.filter(d => (d.pp + d.pg) > 0).length
  const orosEnRed = desc.filter(d => {
    const r = getRango(d.rango)
    return r.id.includes('ORO') || r.id.includes('DIAMANTE') || r.id === 'PLATINO'
  }).length

  return (
    <div style={{ ...S.card, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ ...S.cardHeader, justifyContent: 'space-between' }}>
        <span style={S.cardTitle}>Red de apoyo</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#F0FDF4', color: '#16A34A', fontWeight: 600 }}>{totalActivos} activos</span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#FEF7E6', color: '#C47F17', fontWeight: 600 }}>{orosEnRed} Oro+</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>

        {/* Leyenda */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { color: '#16A34A', label: 'Activo (PP>0)' },
            { color: '#D1D5DB', label: 'Sin movimiento' },
            { color: '#C47F17', label: 'Rango Oro+' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--win-muted)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Nodo raíz */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: rSel.bg, border: `3px solid ${rSel.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: rSel.color,
              margin: '0 auto 6px',
              boxShadow: `0 0 0 4px ${rSel.color}22`
            }}>
              {RANGO_IMG[rSel.id] ? <img src={RANGO_IMG[rSel.id]} alt={rSel.label} style={{ width: 42, height: 42, objectFit: 'contain' }}/> : <span style={{ fontSize: 13, fontWeight: 700, color: rSel.color }}>{getInitials(sel.nombre)}</span>}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--win-title)', maxWidth: 120, textAlign: 'center', lineHeight: 1.3 }}>
              {sel.nombre.split(' ').slice(0, 2).join(' ')}
            </div>
            <div style={{ fontSize: 10, color: 'var(--win-muted)', marginTop: 2 }}>{getRango(sel.rango).label}</div>
          </div>

          {/* Línea hacia gen1 */}
          {gen1.length > 0 && <div style={{ width: 2, height: 20, background: 'var(--win-border)' }}/>}

          {/* Gen 1 */}
          {gen1.length > 0 && (
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.08em', color: 'var(--win-muted)', textAlign: 'center', marginBottom: 8 }}>GEN. 1 — {gen1.length} personas</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 8 }}>
                {gen1.map(a => (
                  <div key={a.ein} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <Bolita a={a} size={38}/>
                    <div style={{ fontSize: 9, color: 'var(--win-muted)', textAlign: 'center', maxWidth: 60, lineHeight: 1.2 }}>
                      {a.nombre.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Línea hacia gen2 */}
          {gen2.length > 0 && (
            <>
              <div style={{ width: 2, height: 16, background: 'var(--win-border)' }}/>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.08em', color: 'var(--win-muted)', textAlign: 'center', marginBottom: 8 }}>GEN. 2 — {gen2.length} personas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                  {gen2.map(a => (
                    <div key={a.ein} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <Bolita a={a} size={32}/>
                      <div style={{ fontSize: 8, color: 'var(--win-muted)', textAlign: 'center', maxWidth: 52, lineHeight: 1.2 }}>
                        {a.nombre.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Gen 3 */}
          {gen3.length > 0 && (
            <>
              <div style={{ width: 2, height: 16, background: 'var(--win-border)' }}/>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.08em', color: 'var(--win-muted)', textAlign: 'center', marginBottom: 8 }}>GEN. 3 — {gen3.length} personas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 8 }}>
                  {gen3.map(a => (
                    <div key={a.ein} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <Bolita a={a} size={26}/>
                      <div style={{ fontSize: 8, color: 'var(--win-muted)', textAlign: 'center', maxWidth: 44, lineHeight: 1.2 }}>
                        {a.nombre.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Gen 4 */}
          {gen4.length > 0 && (
            <>
              <div style={{ width: 2, height: 16, background: 'var(--win-border)' }}/>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.08em', color: 'var(--win-muted)', textAlign: 'center', marginBottom: 8 }}>GEN. 4 — {gen4.length} personas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 8 }}>
                  {gen4.map(a => (
                    <div key={a.ein} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Bolita a={a} size={22}/>
                      <div style={{ fontSize: 7, color: 'var(--win-muted)', textAlign: 'center', maxWidth: 40, lineHeight: 1.2 }}>
                        {a.nombre.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Gen 5 */}
          {gen5.length > 0 && (
            <>
              <div style={{ width: 2, height: 16, background: 'var(--win-border)' }}/>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.08em', color: 'var(--win-muted)', textAlign: 'center', marginBottom: 8 }}>GEN. 5 — {gen5.length} personas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                  {gen5.map(a => (
                    <div key={a.ein} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Bolita a={a} size={20}/>
                      <div style={{ fontSize: 7, color: 'var(--win-muted)', textAlign: 'center', maxWidth: 36, lineHeight: 1.2 }}>
                        {a.nombre.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {desc.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--win-muted)', fontSize: 12 }}>
              Sin afiliados en línea descendente
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed', zIndex: 999,
          left: tooltip.x + 12, top: tooltip.y - 80,
          background: 'var(--win-tooltip-bg)', color: 'var(--win-tooltip-fg)',
          borderRadius: 8, padding: '10px 14px',
          fontSize: 12, minWidth: 180, pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,.3)'
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{tooltip.a.nombre}</div>
          <div style={{ opacity: .8, marginBottom: 2 }}>EIN {tooltip.a.ein}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <span style={{ background: getRango(tooltip.a.rango).bg, color: getRango(tooltip.a.rango).color, padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{getRango(tooltip.a.rango).label}</span>
            <span style={{ opacity: .7 }}>{tooltip.a.pp} PP · {tooltip.a.pg} PG</span>
          </div>
          <div style={{ opacity: .6, marginTop: 4, fontSize: 11 }}>{tooltip.a.ciudad}, {tooltip.a.estado}</div>
        </div>
      )}
    </div>
  )
}

function PanelPlan({ afiliados, tc, volBase, setVolBase, umbralUSD, setUmbralUSD }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(null)
  const [drop, setDrop] = useState(false)
  const RANGOS_FILTRO = [
    { id: 'ORO_EJECUTIVO', label: 'Oro Ejecutivo' },
    { id: 'ORO', label: 'Oro' },
    { id: 'PLATA', label: 'Plata' },
    { id: 'BRONCE', label: 'Bronce' },
    { id: 'COBRE', label: 'Cobre' },
    { id: 'EIN', label: 'Empresario' },
  ]
  const [filtroRangos, setFiltroRangos] = useState(() => new Set(RANGOS_FILTRO.map(x => x.id)))
  const toggleFiltro = (id) => setFiltroRangos(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const bucketRango = (id) => {
    if (['ORO_MASTER', 'ORO_SENIOR', 'ORO_EJECUTIVO', 'PLATINO', 'DIAMANTE', 'DIAMANTE_MASTER', 'DOBLE_DIAMANTE'].includes(id)) return 'ORO_EJECUTIVO'
    if (['ORO', 'ORO_EXPERTO', 'ORO_PREMIER', 'ORO_ELITE'].includes(id)) return 'ORO'
    return id
  }
  const res = q.length > 1 ? afiliados.filter(a => a.nombre.toLowerCase().includes(q.toLowerCase()) || a.ein.includes(q)).slice(0, 8) : []
  const elegir = (a) => { setSel(a); setQ(a.nombre); setDrop(false) }
  const limpiar = () => { setSel(null); setQ(''); setDrop(false) }
  const hasData = afiliados.length > 0
  useEffect(() => {
    if (hasData && !sel) {
      const yo = afiliados.find(a => a.gen === 0) || afiliados[0]
      if (yo) { setSel(yo); setQ(yo.nombre) }
    }
  }, [hasData])
  const r = sel ? getRango(sel.rango) : null
  const sig = sel ? getSiguienteRangoObjetivo(sel) : null
  const pct = sel && sig ? getProgresoPct(sel, sig) : 0
  const pasos = sel ? getPlanAccion(sel, sig, afiliados, tc, umbralUSD) : []

  const getReqText = () => {
    if (!sig) return ''
    if (sig.tipo === 'personal') return sel.pp + ' de ' + sig.ppReq.toLocaleString() + ' PP × 3 meses consecutivos'
    if (sig.tipo === 'equipo') return (sel.frontalesOro || 0) + ' de ' + sig.frontalesOro + ' frontales Oro activos'
    const req = sig.id === 'COBRE' ? 700 : sig.id === 'BRONCE' ? 1000 : sig.id === 'PLATA' ? 2000 : 3000
    return (sel.pp + sel.pg).toLocaleString() + ' de ' + req.toLocaleString() + ' PP/PG combinados'
  }

  const getChecks = () => {
    if (!sig) return []
    const checks = [{ ok: (sel.pp + sel.pg) > 0, txt: 'Tiene actividad este período (PP o PG > 0)', sub: sel.pp.toLocaleString() + ' PP + ' + sel.pg.toLocaleString() + ' PG = ' + (sel.pp + sel.pg).toLocaleString() + ' puntos combinados' }]
    if (sig.tipo === 'desc') {
      const req = sig.id === 'COBRE' ? 700 : sig.id === 'BRONCE' ? 1000 : sig.id === 'PLATA' ? 2000 : 3000
      checks.push({ ok: (sel.pp + sel.pg) >= req, txt: 'Alcanzar ' + req.toLocaleString() + ' PP/PG combinados', sub: 'Tiene ' + (sel.pp + sel.pg).toLocaleString() + ' de ' + req.toLocaleString() + ' puntos' })
    }
    if (sig.tipo === 'personal') checks.push({ ok: sel.pp >= sig.ppReq, txt: 'Alcanzar ' + sig.ppReq.toLocaleString() + ' PP × 3 meses consecutivos', sub: 'Este mes: ' + sel.pp + ' PP de ' + sig.ppReq.toLocaleString() + ' requeridos' })
    if (sig.tipo === 'equipo') {
      const tieneF = sel.frontalesOro || 0
      const faltanF = Math.max(0, sig.frontalesOro - tieneF)
      checks.push({ ok: tieneF >= sig.frontalesOro, txt: sig.frontalesOro + ' frontal' + (sig.frontalesOro > 1 ? 'es' : '') + ' Oro activo' + (sig.frontalesOro > 1 ? 's' : '') + ' en tu gen.1', sub: 'Tienes ' + tieneF + ' de ' + sig.frontalesOro + ' frontal' + (sig.frontalesOro > 1 ? 'es' : '') + ' Oro (rango Oro+ y con movimiento este mes)' + (faltanF > 0 ? ' · te ' + (faltanF > 1 ? 'faltan ' : 'falta ') + faltanF : ' · completo') })
      if (['DIAMANTE','DIAMANTE_MASTER','DOBLE_DIAMANTE'].includes(sig.id)) {
        const propioPts = sel.pp + sel.pg
        checks.push({ ok: propioPts >= 2000, txt: 'Generar 2,000 PP/PG propios combinados', sub: 'Tienes ' + propioPts.toLocaleString() + ' de 2,000' + (propioPts < 2000 ? ' · te faltan ' + (2000 - propioPts).toLocaleString() : ' · completo') })
      }
    }
    return checks
  }

  const getAcciones = () => {
    if (!sig) return []
    const frontales = afiliados.filter(a => a.einPresentador === sel.ein)
    const activosF = frontales.filter(a => (a.pp + a.pg) > 0)
    const frontalTop = [...activosF].sort((a, b) => (b.pp + b.pg) - (a.pp + a.pg))[0]
    const frontalRiesgo = frontales.find(a => (a.pp + a.pg) === 0)
    const acciones = []
    if (sig.tipo === 'personal') {
      const falta = Math.max(0, sig.ppReq - sel.pp)
      acciones.push({ t: falta > 0 ? `Genera ${falta.toLocaleString()} PP más este mes` : `Sostén tus ${sig.ppReq.toLocaleString()} PP 3 meses seguidos`, s: falta > 0 ? `Vas en ${sel.pp.toLocaleString()} de ${sig.ppReq.toLocaleString()} PP requeridos` : 'Ya alcanzas el mínimo — mantenlo para calificar' })
    } else if (sig.tipo === 'desc') {
      const req = sig.id === 'COBRE' ? 700 : sig.id === 'BRONCE' ? 1000 : sig.id === 'PLATA' ? 2000 : 3000
      const falta = Math.max(0, req - (sel.pp + sel.pg))
      acciones.push({ t: falta > 0 ? `Suma ${falta.toLocaleString()} PP/PG más` : `Ya cubres los ${req.toLocaleString()} puntos`, s: `${(sel.pp + sel.pg).toLocaleString()} de ${req.toLocaleString()} combinados` })
    } else if (sig.tipo === 'equipo') {
      const falta = Math.max(0, sig.frontalesOro - (sel.frontalesOro || 0))
      acciones.push({ t: `Desarrolla ${falta || sig.frontalesOro} frontal${(falta || sig.frontalesOro) > 1 ? 'es' : ''} Oro`, s: `Tienes ${sel.frontalesOro || 0} de ${sig.frontalesOro} frontales Oro activos` })
    }
    if (frontalTop) acciones.push({ t: `Impulsa a ${frontalTop.nombre.split(' ').slice(0, 2).join(' ')}`, s: `Tu frontal más fuerte (${(frontalTop.pp + frontalTop.pg).toLocaleString()} pts) — ayúdalo a subir de rango` })
    if (frontalRiesgo) acciones.push({ t: `Reactiva a ${frontalRiesgo.nombre.split(' ').slice(0, 2).join(' ')}`, s: `Frontal sin movimiento este mes${frontalRiesgo.telefono ? ` · ${frontalRiesgo.telefono}` : ''}` })
    return acciones.slice(0, 3)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: sel ? '1fr 320px' : '1fr', gap: 16, alignItems: 'start' }}>
      <div>
        <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 14 }}>
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 12, color: 'var(--win-muted)', marginBottom: 8 }}>Selecciona un afiliado para ver su plan personalizado con los requisitos exactos del plan de carrera NICE</div>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', border: '1px solid var(--win-border)', borderRadius: 8, background: 'var(--win-surface2)' }}>
                <div style={{ width: 16, height: 16, color: 'var(--win-muted)', flexShrink: 0 }}><Icons.Search/></div>
                <input value={q} onChange={ev => { setQ(ev.target.value); setDrop(true); if (!ev.target.value) setSel(null) }} placeholder="Buscar por nombre o EIN..." style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--win-text)', fontFamily: 'inherit', outline: 'none' }}/>
                {q && <div style={{ width: 16, height: 16, color: 'var(--win-muted)', cursor: 'pointer' }} onClick={limpiar}><Icons.X/></div>}
              </div>
              {drop && res.length > 0 && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,.10)', zIndex: 50, overflow: 'hidden' }}>
                  {res.map(a => {
                    const ar = getRango(a.rango)
                    return (
                      <div key={a.ein} onClick={() => elegir(a)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--win-border)' }} onMouseEnter={ev => ev.currentTarget.style.background = 'var(--win-accent-l)'} onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: ar.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>{RANGO_IMG[ar.id]?<img src={RANGO_IMG[ar.id]} alt='' style={{width:24,height:24,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:ar.color}}>{getInitials(a.nombre)}</span>}</div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)' }}>{a.nombre}</div><div style={{ fontSize: 11, color: 'var(--win-muted)' }}>EIN {a.ein} · Gen. {a.gen} · {a.ciudad}</div></div>
                        <RankBadge rangoStr={a.rango}/>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 14, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 15, height: 15, color: 'var(--win-accent)' }}><Icons.Sliders/></div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--win-title)' }}>Desc. por Red (informativo)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--win-muted)' }}>Base del volumen:</span>
            <div style={{ display: 'flex', background: 'var(--win-surface2)', border: '1px solid var(--win-border)', borderRadius: 7, padding: 2 }}>
              {[{ k: 'pp', l: 'PP' }, { k: 'ppg', l: 'PP+PG' }, { k: 'pg', l: 'PG' }].map(o => (
                <button key={o.k} onClick={() => setVolBase(o.k)} style={{ padding: '4px 11px', borderRadius: 5, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, background: volBase === o.k ? 'var(--win-accent)' : 'transparent', color: volBase === o.k ? '#fff' : 'var(--win-text)' }}>{o.l}</button>
              ))}
            </div>
          </div>
          <span style={{ fontSize: 10.5, color: 'var(--win-muted)', marginLeft: 'auto', maxWidth: 280, lineHeight: 1.4 }}>Un frontal <b style={{ color: 'var(--win-text)' }}>cuenta como Oro</b> si es rango Oro+ y está activo este mes. El monto en USD es solo informativo del Reembolso por Diferencial.</span>
        </div>

        {!sel && (
          <div style={{ textAlign: 'center', padding: '52px 24px', background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10 }}>
            <div style={{ width: 56, height: 56, background: 'var(--win-accent-l)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: 'var(--win-accent)' }}>
              <div style={{ width: 30, height: 30 }}><Icons.Search/></div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--win-title)', marginBottom: 8 }}>Busca a cualquier afiliado</div>
            <div style={{ fontSize: 13, color: 'var(--win-muted)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>Escribe el nombre o EIN para ver su plan personalizado con requisitos exactos del plan de carrera NICE 2025</div>
          </div>
        )}

        {sel && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#1E3A8A 0%,#2563EB 100%)', borderRadius: 10, padding: '18px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(255,255,255,.3)' }}>{RANGO_IMG[r?.id] ? <img src={RANGO_IMG[r?.id]} alt={r?.label} style={{ width: 46, height: 46, objectFit: 'contain' }}/> : <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{getInitials(sel.nombre)}</span>}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 3 }}>{sel.nombre}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>EIN {sel.ein} · Gen. {sel.gen} · {sel.ciudad}, {sel.estado}</div></div>
              <RankBadge rangoStr={sel.rango}/>
              <button onClick={() => exportAffiliateReport(sel, sig, pct, getChecks(), getAcciones(), pasos)} title="Descargar plan como imagen" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                <div style={{ width: 14, height: 14 }}><Icons.Download/></div>
                Descargar
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
              {[{ l: 'PP este mes', v: sel.pp.toLocaleString(), c: 'var(--win-gold)' }, { l: 'Puntos Grupo', v: sel.pg.toLocaleString(), c: '#7C3AED' }, { l: 'Generación', v: sel.gen, c: 'var(--win-accent)' }].map(k => (
                <div key={k.l} style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: k.c, fontVariantNumeric: 'tabular-nums' }}>{k.v}</div>
                  <div style={{ fontSize: 11, color: 'var(--win-muted)', marginTop: 3 }}>{k.l}</div>
                </div>
              ))}
            </div>

            {sig && (() => {
              const top3 = getAcciones()
              if (!top3.length) return null
              return (
                <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 12, border: '1px solid var(--win-border)', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
                  <div style={{ background: 'linear-gradient(120deg,#0E7FB8 0%,#2563EB 100%)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7FE3FF', boxShadow: '0 0 9px #7FE3FF', flexShrink: 0 }}/>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '.01em' }}>Tu enfoque esta semana</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,.8)' }}>Camino a {sig.label}</span>
                  </div>
                  <div style={{ background: 'var(--win-surface)', padding: '6px 16px' }}>
                    {top3.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < top3.length - 1 ? '1px solid var(--win-border)' : 'none', alignItems: 'flex-start' }}>
                        <div style={{ width: 24, height: 24, borderRadius: 7, background: 'var(--win-accent-l)', color: 'var(--win-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)', marginBottom: 2 }}>{a.t}</div><div style={{ fontSize: 11.5, color: 'var(--win-muted)', lineHeight: 1.5 }}>{a.s}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* ── Seguimiento prioritario · Red directa ── */}
            {(() => {
              const directos = afiliados.filter(a => a.einPresentador === sel.ein)
              if (!directos.length) return null
              const orosInactivos = directos.filter(a => esOroPlus(a) && (a.pp || 0) + (a.pg || 0) === 0)
              const sinMovimiento = directos.filter(a => !esOroPlus(a) && (a.pp || 0) + (a.pg || 0) === 0)
              const candidatosOro = directos
                .filter(a => !esOroPlus(a) && (a.pp || 0) + (a.pg || 0) > 0)
                .map(a => ({ a, total: (a.pp || 0) + (a.pg || 0), falta: Math.max(0, 3000 - ((a.pp || 0) + (a.pg || 0))) }))
                .sort((x, y) => x.falta - y.falta)
                .slice(0, 5)
              if (!orosInactivos.length && !sinMovimiento.length && !candidatosOro.length) return null
              return (
                <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 10, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 6px #F59E0B', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--win-title)' }}>Seguimiento prioritario · Gen. 1 directa</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--win-muted)' }}>{directos.length} personas en tu primera generación</span>
                  </div>
                  {orosInactivos.length > 0 && (
                    <div style={{ borderBottom: '1px solid var(--win-border)' }}>
                      <div style={{ padding: '8px 16px', background: '#FEF2F2', display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '.06em' }}>🔴 Oros sin movimiento ({orosInactivos.length}) — contacto urgente</span>
                      </div>
                      {orosInactivos.map((a, i) => {
                        const rr = getRango(a.rango)
                        return (
                          <div key={a.ein} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < orosInactivos.length - 1 ? '1px solid var(--win-border)' : 'none', background: i % 2 === 0 ? 'transparent' : 'var(--win-surface2)' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: rr.bg, border: `2px solid ${rr.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                              {RANGO_IMG[rr.id] ? <img src={RANGO_IMG[rr.id]} alt='' style={{ width: 26, height: 26, objectFit: 'contain' }} /> : <span style={{ fontSize: 9, fontWeight: 700, color: rr.color }}>{getInitials(a.nombre)}</span>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nombre}</div>
                              <div style={{ fontSize: 11, color: 'var(--win-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ background: rr.bg, color: rr.color, padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{rr.label}</span>
                                {a.telefono && <span>{a.telefono}</span>}
                              </div>
                            </div>
                            <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600, flexShrink: 0 }}>0 pts este mes</span>
                            {a.telefono && <a href={`https://wa.me/52${a.telefono.toString().replace(/\D/g, '')}`} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7, background: '#25D36620', color: '#128C7E', fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #25D36640', flexShrink: 0 }}>📲 WA</a>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {candidatosOro.length > 0 && (
                    <div style={{ borderBottom: sinMovimiento.length > 0 ? '1px solid var(--win-border)' : 'none' }}>
                      <div style={{ padding: '8px 16px', background: '#FEF7E6', display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#C47F17', textTransform: 'uppercase', letterSpacing: '.06em' }}>⭐ Candidatos a Oro — empújalos esta semana</span>
                      </div>
                      {candidatosOro.map(({ a, total, falta }, i) => {
                        const rr = getRango(a.rango)
                        const pct = Math.min(100, Math.round(total / 3000 * 100))
                        return (
                          <div key={a.ein} style={{ padding: '10px 16px', borderBottom: i < candidatosOro.length - 1 ? '1px solid var(--win-border)' : 'none', background: i % 2 === 0 ? 'transparent' : 'var(--win-surface2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: rr.bg, border: `2px solid ${rr.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                {RANGO_IMG[rr.id] ? <img src={RANGO_IMG[rr.id]} alt='' style={{ width: 26, height: 26, objectFit: 'contain' }} /> : <span style={{ fontSize: 9, fontWeight: 700, color: rr.color }}>{getInitials(a.nombre)}</span>}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)' }}>{a.nombre}</span>
                                  <span style={{ background: rr.bg, color: rr.color, padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{rr.label}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ flex: 1, height: 6, background: 'var(--win-surface2)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--win-border)' }}>
                                    <div style={{ width: pct + '%', height: '100%', background: '#C47F17', borderRadius: 2 }} />
                                  </div>
                                  <span style={{ fontSize: 11, color: 'var(--win-muted)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{total.toLocaleString()} / 3,000 · faltan {falta.toLocaleString()}</span>
                                </div>
                              </div>
                              {a.telefono && <a href={`https://wa.me/52${a.telefono.toString().replace(/\D/g, '')}`} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7, background: '#25D36620', color: '#128C7E', fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #25D36640', flexShrink: 0 }}>📲 WA</a>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {sinMovimiento.length > 0 && (
                    <div>
                      <div style={{ padding: '8px 16px', background: 'var(--win-surface2)', borderBottom: '1px solid var(--win-border)' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--win-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>⚪ Sin movimiento este mes ({sinMovimiento.length})</span>
                      </div>
                      <div style={{ padding: '0 16px' }}>
                        {sinMovimiento.slice(0, 8).map((a, i) => {
                          const rr = getRango(a.rango)
                          return (
                            <div key={a.ein} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < Math.min(7, sinMovimiento.length - 1) ? '1px solid var(--win-border)' : 'none' }}>
                              <div style={{ width: 26, height: 26, borderRadius: '50%', background: rr.bg, border: `1.5px solid ${rr.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                {RANGO_IMG[rr.id] ? <img src={RANGO_IMG[rr.id]} alt='' style={{ width: 22, height: 22, objectFit: 'contain' }} /> : <span style={{ fontSize: 8, fontWeight: 700, color: rr.color }}>{getInitials(a.nombre)}</span>}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--win-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{a.nombre}</span>
                                {a.telefono && <span style={{ fontSize: 10, color: 'var(--win-muted)' }}>{a.telefono}</span>}
                              </div>
                              {a.telefono && <a href={`https://wa.me/52${a.telefono.toString().replace(/\D/g, '')}`} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7, background: '#25D36620', color: '#128C7E', fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #25D36640', flexShrink: 0 }}>📲 WA</a>}
                            </div>
                          )
                        })}
                        {sinMovimiento.length > 8 && <div style={{ padding: '8px 0', fontSize: 11, color: 'var(--win-muted)' }}>... y {sinMovimiento.length - 8} más sin movimiento este mes</div>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}

            {/* ── Colaboradores de PG ── */}
            {sel.pg > 0 && (() => {
              // Obtener descendientes directos que aportan PG
              // PG = afiliados en línea descendente con rango 25%-40% (Empresario a Plata)
              // PG = todos los rangos del 25% al 45% en línea descendente
              const RANGOS_PG = ['EIN','COBRE','BRONCE','PLATA','ORO','ORO_EXPERTO','ORO_PREMIER','ORO_ELITE','PLATINO','ORO_EJECUTIVO','ORO_SENIOR','ORO_MASTER']
              const ORDEN_RANGO = ['ORO_MASTER','ORO_SENIOR','ORO_EJECUTIVO','PLATINO','ORO_ELITE','ORO_PREMIER','ORO_EXPERTO','ORO','PLATA','BRONCE','COBRE','EIN']
              const base = afiliados.filter(a => {
                if (a.ein === sel.ein) return false
                if (a.gen <= sel.gen) return false
                const r = getRango(a.rango)
                return RANGOS_PG.includes(r.id) && (a.pp + a.pg) > 0
              })
              if (base.length === 0) return null
              const colaboradores = base
                .filter(a => filtroRangos.has(bucketRango(getRango(a.rango).id)))
                .sort((a, b) => {
                  const ra = getRango(a.rango)
                  const rb = getRango(b.rango)
                  const orderA = ORDEN_RANGO.indexOf(ra.id)
                  const orderB = ORDEN_RANGO.indexOf(rb.id)
                  if (orderA !== orderB) return orderA - orderB
                  return (b.pp + b.pg) - (a.pp + a.pg)
                })
              return (
                <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 10 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)' }}>Colaboradores a tus Puntos de Grupo</span>
                    <span style={{ marginLeft: 'auto', background: '#F5F0FF', color: '#7C3AED', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{colaboradores.length} personas</span>
                  </div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)', background: 'var(--win-surface2)', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: 'var(--win-muted)', textTransform: 'uppercase', alignSelf: 'center' }}>Filtrar rangos:</span>
                    {RANGOS_FILTRO.map(f => {
                      const rDef = RANGOS.find(rr => rr.id === f.id)
                      const checked = filtroRangos.has(f.id)
                      return (
                        <label key={f.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', userSelect: 'none', opacity: checked ? 1 : 0.5 }}>
                          {RANGO_IMG[f.id] && <img src={RANGO_IMG[f.id]} alt={f.label} style={{ width: 36, height: 36, objectFit: 'contain' }}/>}
                          <span style={{ background: rDef?.bg, color: rDef?.color, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>{f.label}</span>
                          <input type="checkbox" checked={checked} onChange={() => toggleFiltro(f.id)} style={{ cursor: 'pointer', accentColor: 'var(--win-accent)' }}/>
                        </label>
                      )
                    })}
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--win-border)', background: 'var(--win-surface2)' }}>
                        {['Rango', 'Nombre', 'PP', 'PG', 'Total', 'Gen.'].map(h => (
                          <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '.05em', color: 'var(--win-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const grupos = {}
                        colaboradores.forEach(a => { (grupos[a.gen] = grupos[a.gen] || []).push(a) })
                        const gens = Object.keys(grupos).map(Number).sort((a, b) => a - b)
                        const rows = []
                        gens.forEach((g, gi) => {
                          const lista = grupos[g]
                          rows.push(
                            <tr key={`gen-${g}`} style={{ background: 'var(--win-surface2)', borderTop: gi > 0 ? '2px solid var(--win-border)' : 'none', borderBottom: '1px solid var(--win-border)' }}>
                              <td colSpan={6} style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: 'var(--win-accent)', textTransform: 'uppercase' }}>
                                Generación {g} · {lista.length} {lista.length === 1 ? 'persona' : 'personas'}
                              </td>
                            </tr>
                          )
                          lista.forEach((a, i) => {
                            const r = getRango(a.rango)
                            rows.push(
                              <tr key={a.ein} style={{ borderBottom: '1px solid var(--win-border)', background: i % 2 === 0 ? 'transparent' : 'var(--win-surface2)' }}>
                                <td style={{ padding: '8px 12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {RANGO_IMG[r.id] && <img src={RANGO_IMG[r.id]} alt={r.label} style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0 }}/>}
                                    <span style={{ background: r.bg, color: r.color, padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>{r.label}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '8px 12px', fontWeight: 500, color: 'var(--win-title)' }}>{a.nombre}</td>
                                <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--win-gold)' }}>{a.pp.toLocaleString()}</td>
                                <td style={{ padding: '8px 12px', fontWeight: 600, color: '#7C3AED' }}>{a.pg.toLocaleString()}</td>
                                <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--win-accent)' }}>{(a.pp + a.pg).toLocaleString()}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--win-muted)', fontSize: 11 }}>Gen. {a.gen}</td>
                              </tr>
                            )
                          })
                        })
                        return rows
                      })()}
                    </tbody>
                  </table>
                </div>
              )
            })()}

            {sig && (
              <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 10 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)' }}>Progreso hacia {sig.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: pct >= 100 ? 'var(--win-green)' : 'var(--win-accent)' }}>{pct}%</span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ height: 10, background: 'var(--win-surface2)', borderRadius: 5, overflow: 'hidden', border: '1px solid var(--win-border)', marginBottom: 8 }}>
                    <div style={{ width: pct + '%', height: '100%', background: pct >= 100 ? 'var(--win-green)' : 'var(--win-accent)', borderRadius: 4, transition: '.6s ease' }}/>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--win-muted)' }}>{getReqText()}</div>
                </div>
              </div>
            )}

            <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 10 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)' }}><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)' }}>Requisitos del siguiente rango</span></div>
              <div style={{ padding: '0 16px' }}>
                {getChecks().map((item, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--win-border)' : 'none' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: item.ok ? 'var(--win-green-l)' : 'var(--win-red-l)', color: item.ok ? 'var(--win-green)' : 'var(--win-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <div style={{ width: 12, height: 12 }}>{item.ok ? <Icons.Check/> : <Icons.X/>}</div>
                    </div>
                    <div><div style={{ fontSize: 13, fontWeight: 500, color: 'var(--win-title)', marginBottom: 2 }}>{item.txt}</div><div style={{ fontSize: 11, color: 'var(--win-muted)' }}>{item.sub}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)' }}><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)' }}>Plan de acción personalizado</span></div>
              <div style={{ padding: '14px 16px' }}>
                {pasos.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < pasos.length - 1 ? 16 : 0 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: p.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{p.num}</div>
                    <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)', marginBottom: 4 }}>{p.title}</div><div style={{ fontSize: 12, color: 'var(--win-muted)', lineHeight: 1.6 }}>{p.desc}</div></div>
                  </div>
                ))}
              </div>
              {sig && sig.tipo === 'equipo' && (() => {
                const tcUse = tc || TC_FALLBACK
                const frontalesDir = afiliados.filter(a => a.einPresentador === sel.ein)
                const orosFrontales = frontalesDir.filter(a => esOroPlus(a))
                  .map(a => ({ a, g: frontalGenera(a, tc, umbralUSD), act: (a.pp || 0) + (a.pg || 0) }))
                  .sort((x, y) => (y.g.genera - x.g.genera) || (y.g.usd - x.g.usd))
                const candidatos = frontalesDir
                  .filter(a => !esOroPlus(a))
                  .map(a => ({ a, total: (a.pp || 0) + (a.pg || 0) }))
                  .filter(x => x.total > 0)
                  .sort((x, y) => y.total - x.total)
                  .slice(0, 5)
                if (orosFrontales.length === 0 && candidatos.length === 0) return null
                return (
                  <div style={{ borderTop: '1px solid var(--win-border)' }}>
                    {orosFrontales.length > 0 && (
                      <div style={{ padding: '12px 16px', background: 'var(--win-surface2)', borderBottom: '1px solid var(--win-border)' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--win-accent)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Frontales Oro de {sel.nombre.split(' ').slice(0, 2).join(' ')}</div>
                        <div style={{ fontSize: 11, color: 'var(--win-muted)', marginBottom: 10, lineHeight: 1.5 }}>Cuenta como <b style={{ color: 'var(--win-text)' }}>frontal Oro</b> quien es rango Oro o superior <b style={{ color: 'var(--win-text)' }}>y está activo</b> este mes (PP+PG&gt;0). La columna <b style={{ color: 'var(--win-text)' }}>Desc. Red</b> es informativa: (valor del punto de su rango − $12.06 del punto Oro) × {volBase === 'pg' ? 'PG' : volBase === 'ppg' ? 'PP+PG' : 'PP'} de su red ÷ ${tcUse.toFixed(2)} MXN/USD.</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--win-border)' }}>
                              {['Frontal', 'Actividad', 'Desc. Red (USD)', '¿Cuenta?'].map(h => (
                                <th key={h} style={{ padding: '6px 10px', textAlign: h === 'Frontal' ? 'left' : 'right', fontSize: 10, fontWeight: 600, letterSpacing: '.05em', color: 'var(--win-muted)' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {orosFrontales.map(({ a, g, act }, i) => {
                              const rr = getRango(a.rango)
                              return (
                                <tr key={a.ein} style={{ borderBottom: i < orosFrontales.length - 1 ? '1px solid var(--win-border)' : 'none', opacity: g.genera ? 1 : 0.62 }}>
                                  <td style={{ padding: '8px 10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                      {RANGO_IMG[rr.id] && <img src={RANGO_IMG[rr.id]} alt={rr.label} style={{ width: 24, height: 24, objectFit: 'contain', flexShrink: 0 }}/>}
                                      <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, color: 'var(--win-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{a.nombre}</div>
                                        <div style={{ fontSize: 10, color: rr.color, fontWeight: 600 }}>{rr.label}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: act > 0 ? 'var(--win-text)' : 'var(--win-muted)' }}>{act > 0 ? act.toLocaleString() + ' pts' : 'sin mov.'}</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--win-muted)' }}>${Math.round(g.usd).toLocaleString()} <span style={{ fontSize: 9 }}>({a.descRedPersonas || 0}p)</span></td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: g.genera ? 'var(--win-green-l)' : 'var(--win-red-l)', color: g.genera ? 'var(--win-green)' : 'var(--win-red)', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                                      <div style={{ width: 12, height: 12 }}>{g.genera ? <Icons.Check/> : <Icons.X/>}</div>
                                      {g.genera ? 'Sí cuenta' : 'Inactivo'}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {candidatos.length > 0 && (
                      <div style={{ padding: '12px 16px', background: 'var(--win-surface2)' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--win-accent)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Candidatos más probables a frontal Oro</div>
                        <div style={{ fontSize: 11, color: 'var(--win-muted)', marginBottom: 10 }}>Frontales directos con mayor volumen — prioriza apoyarlos para que alcancen Oro (3,000 pts combinados) y cuenten como tu frontal Oro.</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--win-border)' }}>
                              {['Rango','Nombre','PP','PG','Total','Gen.'].map(h => (
                                <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '.05em', color: 'var(--win-muted)' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {candidatos.map(({ a, total }, i) => {
                              const rr = getRango(a.rango)
                              return (
                                <tr key={a.ein} style={{ borderBottom: i < candidatos.length - 1 ? '1px solid var(--win-border)' : 'none' }}>
                                  <td style={{ padding: '7px 10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      {RANGO_IMG[rr.id] && <img src={RANGO_IMG[rr.id]} alt={rr.label} style={{ width: 24, height: 24, objectFit: 'contain' }}/>}
                                      <span style={{ background: rr.bg, color: rr.color, padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>{rr.label}</span>
                                    </div>
                                  </td>
                                  <td style={{ padding: '7px 10px', fontWeight: 500, color: 'var(--win-title)' }}>{a.nombre}</td>
                                  <td style={{ padding: '7px 10px', fontWeight: 600, color: 'var(--win-gold)' }}>{(a.pp || 0).toLocaleString()}</td>
                                  <td style={{ padding: '7px 10px', fontWeight: 600, color: '#7C3AED' }}>{(a.pg || 0).toLocaleString()}</td>
                                  <td style={{ padding: '7px 10px', fontWeight: 700, color: 'var(--win-accent)' }}>{total.toLocaleString()}</td>
                                  <td style={{ padding: '7px 10px', color: 'var(--win-muted)', fontSize: 11 }}>Gen. {a.gen}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
      {sel && <RedVisual sel={sel} afiliados={afiliados} filtroRangos={filtroRangos} bucketRango={bucketRango}/>}
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
    } catch { setError(true) }
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
    const c = await generarCertificadoCanvas(sel, rangoId, foto, tieneCoemp ? coemp : '')
    c.toBlob(blob => { if (!blob) return; const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `Certificado-NICE-${(sel.nombre || '').split(' ')[0]}-${(RANGOS.find(r => r.id === rangoId) || {}).label || ''}.png`.replace(/\s+/g, '-'); a.click(); setTimeout(() => URL.revokeObjectURL(url), 2000) }, 'image/png')
  }

  const rSel = rangoId ? RANGOS.find(r => r.id === rangoId) : null

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(8,16,28,.62)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--win-surface)', borderRadius: 14, boxShadow: '0 24px 70px rgba(0,0,0,.45)', width: '100%', maxWidth: 1080, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#C9A227,#8A6A1E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><div style={{ width: 17, height: 17 }}><Icons.Award/></div></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--win-title)' }}>Crear Certificado NICE</div>
            <div style={{ fontSize: 11.5, color: 'var(--win-muted)' }}>Busca al afiliado, sube su foto y descarga su reconocimiento de rango</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--win-border)', background: 'var(--win-surface2)', color: 'var(--win-muted)', cursor: 'pointer', fontSize: 16, fontFamily: 'inherit' }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', flex: 1, minHeight: 0 }} className="rn-cert-grid">
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

// ════════════════════════════════════════════════════
// PANEL REPORTES COMPARATIVOS
// ════════════════════════════════════════════════════

const MESES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MESES_CORTO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function detectarMesDeNombre(nombre) {
  const n = nombre.toLowerCase()
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  for (let i = 0; i < meses.length; i++) { if (n.includes(meses[i])) return i + 1 }
  const m = nombre.match(/[-_\s](\d{1,2})[-_\s]/)
  if (m) { const v = parseInt(m[1]); if (v >= 1 && v <= 12) return v }
  return new Date().getMonth() + 1
}
function detectarAnioDeNombre(nombre) {
  const m = nombre.match(/20\d{2}/)
  return m ? parseInt(m[0]) : new Date().getFullYear()
}

const RANGO_ORDEN_LIST = ['SIN','EIN','COBRE','BRONCE','PLATA','ORO','ORO_EXPERTO','ORO_PREMIER','ORO_ELITE','PLATINO','ORO_EJECUTIVO','ORO_SENIOR','ORO_MASTER','DIAMANTE','DIAMANTE_MASTER','DOBLE_DIAMANTE']
function rangoOrden(id) { const i = RANGO_ORDEN_LIST.indexOf(id); return i < 0 ? 0 : i }

function computePeriodStats(afs) {
  const total = afs.length
  const activos = afs.filter(a => (a.pp||0)+(a.pg||0) > 0).length
  const totalPP = afs.reduce((s,a) => s+(a.pp||0), 0)
  const totalPG = afs.reduce((s,a) => s+(a.pg||0), 0)
  const orosPlus = afs.filter(a => esOroPlus(a)).length
  const frontales1 = afs.filter(a => (a.gen||0) === 1).length
  return { total, activos, totalPP, totalPG, volumen: totalPP+totalPG, orosPlus, frontales1, pctActividad: total > 0 ? Math.round(activos/total*100) : 0 }
}

function computeComparativo(anterior, actual) {
  if (!anterior || !actual) return null
  const mapAnt = {}
  anterior.forEach(a => { if (a.ein) mapAnt[a.ein] = a })
  const nuevos = actual.filter(a => a.ein && !mapAnt[a.ein])
  const reactivados = [], desactivados = [], ascensos = [], descensos = []
  actual.forEach(curr => {
    const prev = mapAnt[curr.ein]
    if (!prev) return
    const rBef = rangoOrden(getRango(prev.rango).id), rAft = rangoOrden(getRango(curr.rango).id)
    if (rAft > rBef) ascensos.push({ a: curr, de: getRango(prev.rango), a2: getRango(curr.rango) })
    if (rAft < rBef) descensos.push({ a: curr, de: getRango(prev.rango), a2: getRango(curr.rango) })
    const pAct = (prev.pp||0)+(prev.pg||0) > 0, cAct = (curr.pp||0)+(curr.pg||0) > 0
    if (!pAct && cAct) reactivados.push(curr)
    if (pAct && !cAct) desactivados.push(curr)
  })
  const retenidos = actual.filter(c => { const p = mapAnt[c.ein]; return p && (p.pp||0)+(p.pg||0)>0 && (c.pp||0)+(c.pg||0)>0 })
  const activosAnt = anterior.filter(a => (a.pp||0)+(a.pg||0)>0).length
  return { nuevos, reactivados, desactivados, ascensos, descensos, retenidos, retencion: activosAnt>0 ? Math.round(retenidos.length/activosAnt*100) : 0 }
}

function EvolucionBars({ datos }) {
  const [tipIdx, setTipIdx] = useState(null)
  if (!datos || datos.length === 0) return null
  const W = 500, H = 130, padL = 44, padB = 24, padT = 10, padR = 12
  const gW = W - padL - padR, gH = H - padT - padB
  const maxV = Math.max(...datos.map(d => Math.max(d.pp, d.pg)), 1)
  const ticks = [0, 0.25, 0.5, 0.75, 1]
  const xOf = i => datos.length <= 1 ? padL + gW/2 : padL + (i / (datos.length-1)) * gW
  const yOf = v => padT + gH - (v / maxV) * gH
  const mkPath = key => datos.map((d,i) => `${i===0?'M':'L'}${xOf(i).toFixed(1)},${yOf(d[key]).toFixed(1)}`).join(' ')
  const mkArea = key => {
    const p = mkPath(key)
    return `${p} L${xOf(datos.length-1).toFixed(1)},${(padT+gH).toFixed(1)} L${xOf(0).toFixed(1)},${(padT+gH).toFixed(1)} Z`
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'160px',overflow:'visible',display:'block'}}>
      {ticks.map((t,i) => {
        const v = Math.round(maxV * t)
        const y = yOf(v)
        return (
          <g key={i}>
            <line x1={padL} x2={W-padR} y1={y} y2={y} stroke='var(--win-border)' strokeWidth={i===0?1:0.5} strokeDasharray={i===0?'none':'3,3'}/>
            <text x={padL-5} y={y+3} textAnchor='end' fontSize='7.5' fill='var(--win-muted)'>{v>=1000?`${(v/1000).toFixed(v%1000===0?0:1)}k`:v}</text>
          </g>
        )
      })}
      <path d={mkArea('pg')} fill='#7C3AED' fillOpacity={0.07}/>
      <path d={mkArea('pp')} fill='#3A8FF2' fillOpacity={0.10}/>
      <path d={mkPath('pg')} fill='none' stroke='#7C3AED' strokeWidth={1.5} strokeLinejoin='round' strokeLinecap='round'/>
      <path d={mkPath('pp')} fill='none' stroke='#3A8FF2' strokeWidth={2} strokeLinejoin='round' strokeLinecap='round'/>
      {datos.map((d,i) => {
        const x = xOf(i), ypp = yOf(d.pp), ypg = yOf(d.pg)
        const isTip = tipIdx === i
        return (
          <g key={i} style={{cursor:'default'}} onMouseEnter={() => setTipIdx(i)} onMouseLeave={() => setTipIdx(null)}>
            <rect x={x - (datos.length>1?(xOf(1)-xOf(0))/2:20)} y={0} width={datos.length>1?(xOf(1)-xOf(0)):40} height={H} fill='transparent'/>
            <circle cx={x} cy={ypg} r={isTip?4:2.5} fill='#7C3AED' style={{transition:'r .1s'}}/>
            <circle cx={x} cy={ypp} r={isTip?5:3} fill='#3A8FF2' style={{transition:'r .1s'}}/>
            <text x={x} y={H-4} textAnchor='middle' fontSize='7.5' fill={isTip?'var(--win-text)':'var(--win-muted)'} fontWeight={isTip?'700':'400'}>{d.label}</text>
            {isTip && (
              <g transform={`translate(${Math.min(Math.max(x, padL+42), W-padR-42)},${padT+2})`}>
                <rect x={-42} y={-4} width={84} height={56} rx={6} fill='var(--win-surface)' stroke='var(--win-border)' strokeWidth={1}/>
                <text x={0} y={9} textAnchor='middle' fontSize={8.5} fontWeight='700' fill='var(--win-text)'>{d.label}</text>
                <line x1={-36} x2={36} y1={14} y2={14} stroke='var(--win-border)' strokeWidth={0.7}/>
                <circle cx={-28} cy={22} r={3} fill='#3A8FF2'/>
                <text x={-22} y={26} fontSize={8} fill='var(--win-text)'>PP</text>
                <text x={34} y={26} textAnchor='end' fontSize={8} fontWeight='700' fill='#3A8FF2'>{d.pp.toLocaleString()}</text>
                <circle cx={-28} cy={34} r={3} fill='#7C3AED'/>
                <text x={-22} y={38} fontSize={8} fill='var(--win-text)'>PG</text>
                <text x={34} y={38} textAnchor='end' fontSize={8} fontWeight='700' fill='#7C3AED'>{d.pg.toLocaleString()}</text>
                <line x1={-36} x2={36} y1={43} y2={43} stroke='var(--win-border)' strokeWidth={0.5}/>
                <text x={-28} y={51} fontSize={7.5} fill='var(--win-muted)'>Total</text>
                <text x={34} y={51} textAnchor='end' fontSize={7.5} fontWeight='700' fill='var(--win-muted)'>{(d.pp+d.pg).toLocaleString()}</text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function PanelReportes({ periodos, onAgregarPeriodo, onEliminarPeriodo, tc }) {
  const fileRef = useRef()
  const [pendiente, setPendiente] = useState(null)
  const [pMes, setPMes] = useState(new Date().getMonth()+1)
  const [pAnio, setPAnio] = useState(new Date().getFullYear())
  const [vista, setVista] = useState('resumen')
  const [fichaQ, setFichaQ] = useState('')
  const [fichaEin, setFichaEin] = useState(null)
  const [resumeQ, setResumeQ] = useState('')
  const [resumeEin, setResumeEin] = useState(null)
  const [rangoFiltros, setRangoFiltros] = useState(null)

  const ordenados = [...periodos].sort((a,b) => a.año*12+a.mes - (b.año*12+b.mes))
  const periodoActual = ordenados[ordenados.length-1]
  const periodoAnterior = ordenados.length > 1 ? ordenados[ordenados.length-2] : null
  const statsActual = periodoActual ? computePeriodStats(periodoActual.afiliados) : null
  const statsAnterior = periodoAnterior ? computePeriodStats(periodoAnterior.afiliados) : null
  const comp = periodoActual && periodoAnterior ? computeComparativo(periodoAnterior.afiliados, periodoActual.afiliados) : null
  const datosBars = ordenados.map(p => { const s = computePeriodStats(p.afiliados); return { label: p.label, pp: s.totalPP, pg: s.totalPG } })

  const procesarFile = async (file) => {
    try {
      const afs = await parseWorkbookFile(file)
      setPMes(detectarMesDeNombre(file.name)); setPAnio(detectarAnioDeNombre(file.name))
      setPendiente({ nombre: file.name, afiliados: computeFrontalesOro(afs) })
    } catch(e) { console.error('Error al cargar período:', e) }
  }

  const confirmar = () => {
    if (!pendiente) return
    onAgregarPeriodo({ id:`${pAnio}-${String(pMes).padStart(2,'0')}-${Date.now()}`, nombre:pendiente.nombre, afiliados:pendiente.afiliados, mes:pMes, año:pAnio, label:`${MESES_CORTO[pMes-1]} ${pAnio}`, labelLargo:`${MESES_ES[pMes-1]} ${pAnio}`, fecha:new Date().toLocaleDateString('es-MX') })
    setPendiente(null)
  }

  const mkSparkline = (data, color, w=80, h=26) => {
    if (!data || data.length < 2) return <div style={{width:w,height:h,background:'var(--win-border)',borderRadius:3,opacity:0.2,flexShrink:0}}/>
    const max = Math.max(...data, 1), min = Math.min(...data)
    const range = Math.max(max - min, 1)
    const pts = data.map((v,i) => [Math.round(i/(data.length-1)*(w-4))+2, Math.round((h-8)-(v-min)/range*(h-8))+2])
    const poly = pts.map(([x,y]) => `${x},${y}`).join(' ')
    const area = `M${pts[0][0]},${h} ` + pts.map(([x,y]) => `L${x},${y}`).join(' ') + ` L${pts[pts.length-1][0]},${h} Z`
    const [lx,ly] = pts[pts.length-1]
    return (
      <svg width={w} height={h} style={{overflow:'visible',flexShrink:0,display:'block'}}>
        <path d={area} fill={color} fillOpacity={0.12}/>
        <polyline points={poly} fill='none' stroke={color} strokeWidth={1.5} strokeLinejoin='round' strokeLinecap='round'/>
        <circle cx={lx} cy={ly} r={2.5} fill={color}/>
      </svg>
    )
  }

  const VISTAS = [
    {id:'resumen', l:'Resumen'},
    {id:'evolucion', l:'Evolución'},
    {id:'ascensos', l:'Ascensos'},
    {id:'lideres', l:'Líderes'},
    {id:'retencion', l:'Retención'},
    {id:'porRango', l:'Por Rango'},
    {id:'pipeline', l:'Pipeline Oro'},
    {id:'ficha', l:'Ficha Persona'},
    {id:'salud', l:'Salud'},
  ]

  if (periodos.length === 0 && !pendiente) return (
    <div style={{maxWidth:680}}>
      <div style={{...S.card, marginBottom:16, padding:'20px 24px', background:'linear-gradient(120deg,var(--win-surface) 60%, var(--win-accent-l))'}}>
        <div style={{fontSize:15,fontWeight:700,color:'var(--win-title)',marginBottom:4}}>Reportes Comparativos de Red</div>
        <div style={{fontSize:12,color:'var(--win-muted)',lineHeight:1.7,marginBottom:14}}>Sube los tableros Excel de NICE de cada mes para generar reportes de crecimiento, ascensos, retención y análisis histórico de tu red.</div>
        <div style={{fontSize:12,color:'var(--win-text)',background:'var(--win-surface2)',border:'1px solid var(--win-border)',borderRadius:8,padding:'12px 16px',marginBottom:14,lineHeight:1.8}}>
          <strong>¿Cómo obtener los archivos?</strong><br/>
          1. Entra a tu backoffice en <strong>niceonline.com</strong><br/>
          2. Ve a tu tablero de red / afiliados y descarga el Excel mensual<br/>
          3. Sube aquí un archivo por mes para comparar períodos
        </div>
        <div style={{fontSize:11,color:'var(--win-muted)',background:'var(--win-surface2)',border:'1px solid var(--win-border)',borderRadius:7,padding:'10px 14px',marginBottom:20,display:'flex',gap:8,alignItems:'flex-start'}}>
          <span style={{color:'#F59E0B',fontSize:14,flexShrink:0}}>ℹ</span>
          <span>La conexión directa al backoffice no es posible desde el navegador (restricción CORS de seguridad). Los archivos Excel descargados manualmente funcionan perfectamente para el análisis comparativo.</span>
        </div>
        <div onClick={()=>fileRef.current.click()} style={{border:'2px dashed var(--win-border2)',borderRadius:12,padding:'32px 20px',textAlign:'center',cursor:'pointer',background:'var(--win-surface)',transition:'.2s'}}>
          <div style={{width:44,height:44,background:'var(--win-accent-l)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',color:'var(--win-accent)'}}><div style={{width:24,height:24}}><Icons.Upload/></div></div>
          <div style={{fontSize:14,fontWeight:700,color:'var(--win-title)',marginBottom:4}}>Subir primer período (mes)</div>
          <div style={{fontSize:12,color:'var(--win-muted)'}}>Arrastra o haz clic · formato .xlsx del portal NICE</div>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f)procesarFile(f)}}/>
      </div>
      <div style={{...S.card, padding:'16px 20px'}}>
        <div style={{fontSize:13,fontWeight:700,color:'var(--win-title)',marginBottom:10}}>Qué incluye cada reporte</div>
        {[
          {icon:'📊', t:'Resumen ejecutivo', d:'KPIs clave del período con comparativo vs. mes anterior: afiliados, actividad, volumen PP+PG, Oros+.'},
          {icon:'📈', t:'Evolución mensual', d:'Gráficas de tendencia de volumen y actividad a lo largo de todos los períodos cargados.'},
          {icon:'⬆️', t:'Ascensos de rango', d:'Quién subió de rango, nuevos ingresos, reactivados y afiliados que se desactivaron.'},
          {icon:'🏆', t:'Líderes de la red', d:'Top 10 por PP y PG en el período actual, con comparativo vs. período anterior.'},
          {icon:'🔄', t:'Retención y riesgo', d:'Tasa de retención del equipo e identificación de afiliados en riesgo (2+ meses sin movimiento).'},
        ].map(item => (
          <div key={item.t} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid var(--win-border)'}}>
            <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
            <div><div style={{fontSize:12,fontWeight:700,color:'var(--win-title)',marginBottom:2}}>{item.t}</div><div style={{fontSize:11,color:'var(--win-muted)'}}>{item.d}</div></div>
          </div>
        ))}
      </div>
    </div>
  )

  if (pendiente) return (
    <div style={{maxWidth:480}}>
      <div style={{...S.card, padding:'24px'}}>
        <div style={{fontSize:15,fontWeight:700,color:'var(--win-title)',marginBottom:4}}>Asignar período al archivo</div>
        <div style={{fontSize:12,color:'var(--win-muted)',marginBottom:20}}>{pendiente.nombre} · {pendiente.afiliados.length} afiliados detectados</div>
        <div style={{display:'flex',gap:12,marginBottom:20}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:600,color:'var(--win-muted)',marginBottom:6}}>MES</div>
            <select value={pMes} onChange={e=>setPMes(+e.target.value)} style={{width:'100%',padding:'9px 10px',borderRadius:7,border:'1px solid var(--win-border)',background:'var(--win-surface)',color:'var(--win-text)',fontSize:13,fontFamily:'inherit'}}>
              {MESES_ES.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:600,color:'var(--win-muted)',marginBottom:6}}>AÑO</div>
            <select value={pAnio} onChange={e=>setPAnio(+e.target.value)} style={{width:'100%',padding:'9px 10px',borderRadius:7,border:'1px solid var(--win-border)',background:'var(--win-surface)',color:'var(--win-text)',fontSize:13,fontFamily:'inherit'}}>
              {[2023,2024,2025,2026].map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={()=>setPendiente(null)} style={{flex:1,padding:'10px',borderRadius:8,border:'1px solid var(--win-border)',background:'var(--win-surface)',color:'var(--win-text)',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Cancelar</button>
          <button onClick={confirmar} style={{flex:2,padding:'10px',borderRadius:8,border:'none',background:'var(--win-accent)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            Guardar: {MESES_ES[pMes-1]} {pAnio}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Barra de períodos */}
      <div style={{...S.card, marginBottom:14, padding:'12px 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <span style={{fontSize:11,fontWeight:600,color:'var(--win-muted)',flexShrink:0,letterSpacing:'.05em'}}>PERÍODOS:</span>
          {ordenados.map(p => (
            <div key={p.id} style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:20,background:p===periodoActual?'var(--win-accent-l)':'var(--win-surface2)',border:`1px solid ${p===periodoActual?'var(--win-accent)':'var(--win-border)'}`,fontSize:12,fontWeight:600,color:p===periodoActual?'var(--win-accent)':'var(--win-text)'}}>
              {p.label}
              <button onClick={()=>onEliminarPeriodo(p.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--win-muted)',padding:0,fontSize:13,lineHeight:1,marginLeft:1}}>×</button>
            </div>
          ))}
          <button onClick={()=>fileRef.current.click()} style={{display:'flex',alignItems:'center',gap:5,padding:'4px 11px',borderRadius:20,border:'1px dashed var(--win-border2)',background:'none',color:'var(--win-accent)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
            <div style={{width:12,height:12}}><Icons.Upload/></div>+ Agregar mes
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f){procesarFile(f);e.target.value=''}}}/>
          {periodoActual && <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>{periodoActual.labelLargo||periodoActual.label} · {statsActual?.total} afiliados</span>}
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{display:'flex',gap:2,marginBottom:14,background:'var(--win-surface)',borderRadius:10,padding:4,border:'1px solid var(--win-border)',overflowX:'auto',scrollbarWidth:'none'}}>
        {VISTAS.map(v => (
          <button key={v.id} onClick={()=>setVista(v.id)} style={{flex:'0 0 auto',padding:'7px 10px',borderRadius:7,border:'none',background:vista===v.id?'var(--win-accent)':'none',color:vista===v.id?'#fff':'var(--win-text)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit',transition:'.12s',whiteSpace:'nowrap'}}>
            {v.l}
          </button>
        ))}
      </div>

      {/* ── VISTA: RESUMEN EJECUTIVO ── */}
      {vista==='resumen' && statsActual && (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:14}}>
            {[
              {l:'Total afiliados', v:statsActual.total, d:comp?statsActual.total-statsAnterior.total:null, c:'var(--win-accent)'},
              {l:'Activos este mes', v:statsActual.activos, d:comp?statsActual.activos-statsAnterior.activos:null, c:'var(--win-green)'},
              {l:'% Actividad', v:`${statsActual.pctActividad}%`, d:comp?statsActual.pctActividad-statsAnterior.pctActividad:null, c:'var(--win-green)', sfx:'pp'},
              {l:'PP + PG total', v:statsActual.volumen.toLocaleString(), d:comp?statsActual.volumen-statsAnterior.volumen:null, c:'var(--win-gold)'},
              {l:'Líderes Oro+', v:statsActual.orosPlus, d:comp?statsActual.orosPlus-statsAnterior.orosPlus:null, c:'var(--win-gold)'},
              {l:'Gen. 1 (directos)', v:statsActual.frontales1, d:comp?statsActual.frontales1-statsAnterior.frontales1:null, c:'var(--win-cyan)'},
            ].map(k => {
              const pos = k.d > 0, neu = k.d === 0 || k.d === null || k.d === undefined
              const dStr = k.d !== null && k.d !== undefined ? `${pos?'+':''}${typeof k.d==='number'&&k.d>999?k.d.toLocaleString():k.d}${k.sfx||''}` : null
              return (
                <div key={k.l} style={{...S.card, padding:'14px 16px'}}>
                  <div style={{fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:5}}>{k.l.toUpperCase()}</div>
                  <div style={{fontSize:24,fontWeight:800,color:k.c,lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{k.v}</div>
                  {dStr && !neu && <div style={{fontSize:11,fontWeight:600,color:pos?'var(--win-green)':'var(--win-red)',marginTop:5}}>{pos?'▲ ':'▼ '}{dStr} vs. anterior</div>}
                  {k.d===0 && <div style={{fontSize:11,color:'var(--win-muted)',marginTop:5}}>= sin cambio</div>}
                </div>
              )
            })}
          </div>
          {periodoActual && (() => {
            const tcVal = tc || TC_FALLBACK
            const totalMXN = periodoActual.afiliados.reduce((s, a) => s + (a.pp||0) * valorPuntoDe(getRango(a.rango).id), 0)
            const totalUSD = totalMXN / tcVal
            return (
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:14}}>
                <div style={{...S.card,padding:'14px 16px',background:'linear-gradient(120deg,var(--win-surface),#F0FDF4)'}}>
                  <div style={{fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:5}}>VALOR DEL EQUIPO EN MXN</div>
                  <div style={{fontSize:22,fontWeight:800,color:'var(--win-green)',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>${Math.round(totalMXN).toLocaleString('es-MX')}</div>
                  <div style={{fontSize:11,color:'var(--win-muted)',marginTop:5}}>PP x factor de inversion por rango</div>
                </div>
                <div style={{...S.card,padding:'14px 16px',background:'linear-gradient(120deg,var(--win-surface),#EFF4FF)'}}>
                  <div style={{fontSize:10,fontWeight:600,letterSpacing:'.05em',color:'var(--win-muted)',marginBottom:5}}>VALOR DEL EQUIPO EN USD</div>
                  <div style={{fontSize:22,fontWeight:800,color:'var(--win-accent)',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>USD ${Math.round(totalUSD).toLocaleString('en-US')}</div>
                  <div style={{fontSize:11,color:'var(--win-muted)',marginTop:5}}>TC: ${tcVal.toFixed(2)} MXN/USD</div>
                </div>
              </div>
            )
          })()}
          {/* Buscador rápido por afiliado */}
          <div style={{...S.card, marginBottom:14}}>
            <div style={{...S.cardHeader, marginBottom:10}}>
              <span style={{fontSize:14}}>🔍</span>
              <span style={S.cardTitle}>Buscar afiliado — tendencia personal</span>
            </div>
            <div style={{position:'relative'}}>
            <input
              value={resumeQ}
              onChange={e => { setResumeQ(e.target.value); setResumeEin(null) }}
              placeholder='Nombre o EIN...'
              style={{width:'100%',boxSizing:'border-box',padding:'9px 13px',borderRadius:8,border:'1.5px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-text)',fontSize:13,fontFamily:'inherit',outline:'none'}}
            />
            {resumeQ.trim().length >= 2 && !resumeEin && periodoActual && (() => {
              const todos = periodoActual.afiliados
              const encontrados = todos.filter(a =>
                a.nombre?.toLowerCase().includes(resumeQ.toLowerCase()) ||
                String(a.ein).includes(resumeQ.trim())
              ).slice(0, 8)
              if (encontrados.length === 0) return <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:20,marginTop:2,background:'var(--win-surface)',border:'1px solid var(--win-border)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'var(--win-muted)',boxShadow:'0 8px 24px rgba(0,0,0,.18)'}}>Sin resultados.</div>
              return (
                <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:20,marginTop:2,background:'var(--win-surface)',border:'1px solid var(--win-border)',borderRadius:10,overflow:'hidden',boxShadow:'0 8px 28px rgba(0,0,0,.2)'}}>
                  {encontrados.map((a,i) => {
                    const r = getRango(a.rango)
                    return (
                      <div key={a.ein} onClick={() => { setResumeEin(a.ein); }} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderBottom:i<encontrados.length-1?'1px solid var(--win-border)':'none',cursor:'pointer',background:'var(--win-surface)',transition:'.1s'}}
                        onMouseEnter={e => e.currentTarget.style.background='var(--win-surface2)'}
                        onMouseLeave={e => e.currentTarget.style.background='var(--win-surface)'}
                      >
                        <div style={{width:28,height:28,borderRadius:'50%',background:r.bg,display:'flex',alignItems:'center',justifyContent:'center',border:`1.5px solid ${r.color}`,fontSize:9,fontWeight:700,color:r.color,flexShrink:0}}>{getInitials(a.nombre)}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:'var(--win-title)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.nombre}</div>
                          <div style={{fontSize:10,color:'var(--win-muted)'}}><span style={{color:r.color,fontWeight:600}}>{r.label}</span> · EIN {a.ein} · Gen {a.gen}</div>
                        </div>
                        <div style={{textAlign:'right',flexShrink:0}}>
                          <div style={{fontSize:11,fontWeight:700,color:(a.pp||0)>0?'var(--win-accent)':'var(--win-muted)'}}>{(a.pp||0).toLocaleString()} PP</div>
                          <div style={{fontSize:9,color:'var(--win-muted)'}}>{(a.pg||0).toLocaleString()} PG</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
            </div>
            {resumeEin && periodoActual && (() => {
              const encontrados = [periodoActual.afiliados.find(a => a.ein === resumeEin)].filter(Boolean)
              if (encontrados.length === 0) return null
              return (
                <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:10}}>
                  {encontrados.map(a => {
                    const r = getRango(a.rango)
                    const histPP = ordenados.map(p => (p.afiliados.find(x=>x.ein===a.ein)?.pp)||0)
                    const histPG = ordenados.map(p => (p.afiliados.find(x=>x.ein===a.ein)?.pg)||0)
                    const maxAll = Math.max(...histPP, ...histPG, 1)
                    const W=320, H=64, padB=18
                    const gH = H - padB - 4
                    const xOf = i => ordenados.length <= 1 ? W/2 : (i / (ordenados.length-1)) * W
                    const yOf = v => 4 + gH - (v/maxAll)*gH
                    const mkL = arr => arr.map((v,i) => `${i===0?'M':'L'}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ')
                    const linePP = mkL(histPP), linePG = mkL(histPG)
                    const areaPP = `${linePP} L${xOf(ordenados.length-1).toFixed(1)},${(4+gH).toFixed(1)} L0,${(4+gH).toFixed(1)} Z`
                    return (
                      <div key={a.ein} style={{borderRadius:10,border:`1.5px solid ${r.color}50`,padding:'12px 14px',background:'var(--win-surface2)'}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,flexWrap:'wrap'}}>
                          <span style={{fontWeight:700,color:r.color,fontSize:11,padding:'2px 7px',borderRadius:20,background:r.bg}}>{r.label}</span>
                          <span style={{fontWeight:700,fontSize:13,color:'var(--win-title)'}}>{a.nombre}</span>
                          <span style={{fontSize:11,color:'var(--win-muted)'}}>EIN {a.ein} · Gen. {a.gen}</span>
                          {a.telefono && <a href={`https://wa.me/52${a.telefono.toString().replace(/\D/g,'')}`} target='_blank' rel='noopener noreferrer' style={{display:'inline-flex',alignItems:'center',gap:4,padding:'4px 9px',borderRadius:7,background:'#25D36620',color:'#128C7E',fontSize:10,fontWeight:700,textDecoration:'none',border:'1px solid #25D36640'}}>📲 WA</a>}
                          <button onClick={() => { setResumeEin(null); setResumeQ('') }} style={{marginLeft:'auto',background:'none',border:'1px solid var(--win-border)',borderRadius:6,padding:'3px 8px',fontSize:10,color:'var(--win-muted)',cursor:'pointer',fontFamily:'inherit'}}>✕ cerrar</button>
                        </div>
                        {ordenados.length >= 2 ? (
                          <>
                            <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'72px',overflow:'visible',display:'block',marginBottom:4}}>
                              {[0,0.5,1].map((t,gi) => <line key={gi} x1={0} x2={W} y1={yOf(maxAll*t)} y2={yOf(maxAll*t)} stroke='var(--win-border)' strokeWidth={0.6} strokeDasharray={gi===0?'none':'3,3'}/>)}
                              <path d={areaPP} fill={r.color} fillOpacity={0.09}/>
                              <path d={linePP} fill='none' stroke={r.color} strokeWidth={2} strokeLinejoin='round'/>
                              <path d={linePG} fill='none' stroke='#7C3AED' strokeWidth={1.3} strokeLinejoin='round' strokeDasharray='4,2'/>
                              {ordenados.map((p,i) => {
                                const af = p.afiliados.find(x=>x.ein===a.ein)
                                const x = parseFloat(xOf(i).toFixed(1))
                                return (
                                  <g key={i}>
                                    <circle cx={x} cy={yOf(af?.pp||0)} r={2.8} fill={r.color}/>
                                    <circle cx={x} cy={yOf(af?.pg||0)} r={2} fill='#7C3AED'/>
                                    <text x={x} y={H-2} textAnchor='middle' fontSize='7' fill='var(--win-muted)'>{p.label.slice(0,6)}</text>
                                  </g>
                                )
                              })}
                            </svg>
                            <div style={{display:'flex',gap:14,fontSize:10,color:'var(--win-muted)',marginBottom:8}}>
                              <span style={{display:'inline-flex',alignItems:'center',gap:4}}><svg width={16} height={4} style={{display:'block'}}><line x1={0} y1={2} x2={16} y2={2} stroke={r.color} strokeWidth={2}/></svg>PP</span>
                              <span style={{display:'inline-flex',alignItems:'center',gap:4}}><svg width={16} height={4} style={{display:'block'}}><line x1={0} y1={2} x2={16} y2={2} stroke='#7C3AED' strokeWidth={1.5} strokeDasharray='4,2'/></svg>PG</span>
                            </div>
                          </>
                        ) : <div style={{fontSize:11,color:'var(--win-muted)',marginBottom:8}}>Carga más periodos para ver tendencia.</div>}
                        <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(ordenados.length,6)},1fr)`,gap:5}}>
                          {ordenados.slice(-6).map(p => {
                            const af = p.afiliados.find(x=>x.ein===a.ein)
                            const pp = af?.pp||0, pg = af?.pg||0
                            const activo = pp+pg > 0
                            return (
                              <div key={p.label} style={{textAlign:'center',padding:'5px 3px',borderRadius:6,background:activo?'var(--win-accent-l)':'var(--win-surface)',border:`1px solid ${activo?'var(--win-accent)40':'var(--win-border)'}`}}>
                                <div style={{fontSize:12,fontWeight:700,color:activo?'var(--win-accent)':'var(--win-muted)',fontVariantNumeric:'tabular-nums'}}>{pp.toLocaleString()}</div>
                                <div style={{fontSize:8,color:'var(--win-muted)',lineHeight:1.2}}>{p.label.slice(0,6)}<br/>PP</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
          {comp && (() => {
            const grupos = [
              {l:'Nuevos ingresos', lista:comp.nuevos, c:'var(--win-green)', icon:'🆕',
                getInfo: a => ({nombre:a.nombre, sub:`${getRango(a.rango).label} · EIN ${a.ein} · Gen ${a.gen}`, tel:a.telefono, dot:'var(--win-green)'})},
              {l:'Ascensos de rango', lista:comp.ascensos, c:'#C47F17', icon:'⬆️',
                getInfo: x => ({nombre:x.a.nombre, sub:`${x.de.label} → ${x.a2.label} · EIN ${x.a.ein}`, tel:x.a.telefono, dot:x.a2.color})},
              {l:'Reactivados', lista:comp.reactivados, c:'var(--win-accent)', icon:'⚡',
                getInfo: a => ({nombre:a.nombre, sub:`${getRango(a.rango).label} · EIN ${a.ein} · ${(a.pp||0).toLocaleString()} PP`, tel:a.telefono, dot:'var(--win-accent)'})},
              {l:'Se desactivaron', lista:comp.desactivados, c:'var(--win-red)', icon:'⚠️',
                getInfo: a => ({nombre:a.nombre, sub:`${getRango(a.rango).label} · EIN ${a.ein}`, tel:a.telefono, dot:'var(--win-red)'})},
            ]
            return (
              <div style={{...S.card, marginBottom:14}}>
                <div style={S.cardHeader}><span style={S.cardTitle}>Comparativo: {periodoAnterior.label} → {periodoActual.label}</span></div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:1,background:'var(--win-border)'}}>
                  {grupos.map(g => (
                    <div key={g.l} style={{padding:'14px 16px',background:'var(--win-surface)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:g.lista.length?10:0}}>
                        <span style={{fontSize:20}}>{g.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:11,color:'var(--win-muted)'}}>{g.l}</div>
                          <div style={{fontSize:20,fontWeight:800,color:g.c,fontVariantNumeric:'tabular-nums'}}>{g.lista.length}</div>
                        </div>
                      </div>
                      {g.lista.slice(0,5).map((item,i) => {
                        const {nombre,sub,tel,dot} = g.getInfo(item)
                        return (
                          <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'5px 0',borderTop:'1px solid var(--win-border)'}}>
                            <div style={{width:6,height:6,borderRadius:'50%',background:dot,flexShrink:0}}/>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:11,fontWeight:600,color:'var(--win-text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{nombre}</div>
                              <div style={{fontSize:9,color:'var(--win-muted)',lineHeight:1.3}}>{sub}</div>
                            </div>
                            {tel && <a href={`https://wa.me/52${tel.toString().replace(/\D/g,'')}`} target='_blank' rel='noopener noreferrer' style={{fontSize:13,textDecoration:'none',flexShrink:0}}>📲</a>}
                          </div>
                        )
                      })}
                      {g.lista.length > 5 && <div style={{fontSize:10,color:'var(--win-muted)',marginTop:5,paddingTop:4,borderTop:'1px solid var(--win-border)'}}>... y {g.lista.length-5} más</div>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
          {ordenados.length >= 2 && (
            <div style={{...S.card, marginBottom:14}}>
              <div style={S.cardHeader}><span style={S.cardTitle}>Evolución de volumen PP+PG</span></div>
              <div style={{padding:'16px 16px 8px'}}>
                <EvolucionBars datos={datosBars}/>
                <div style={{display:'flex',gap:16,marginTop:8,justifyContent:'center'}}>
                  {[{c:'#3A8FF2',l:'PP (Puntos Personales)'},{c:'#A78BFA',l:'PG (Puntos de Grupo)'}].map(x=>(
                    <div key={x.l} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--win-muted)'}}><div style={{width:10,height:10,borderRadius:2,background:x.c,flexShrink:0}}/>{x.l}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── VISTA: EVOLUCIÓN ── */}
      {vista==='evolucion' && (
        <div>
          <div style={{...S.card, marginBottom:14}}>
            <div style={S.cardHeader}><span style={S.cardTitle}>Evolución mensual</span></div>
            <div style={{padding:'16px'}}>
              {ordenados.length < 2 ? (
                <div style={{textAlign:'center',padding:'32px',color:'var(--win-muted)',fontSize:13}}>Agrega al menos 2 períodos para ver la evolución.</div>
              ) : (
                <>
                  <EvolucionBars datos={datosBars}/>
                  <div style={{display:'flex',gap:16,margin:'10px 0 20px',justifyContent:'center'}}>
                    {[{c:'#3A8FF2',l:'PP (Puntos Personales)'},{c:'#A78BFA',l:'PG (Puntos de Grupo)'}].map(x=>(
                      <div key={x.l} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--win-muted)'}}><div style={{width:10,height:10,borderRadius:2,background:x.c,flexShrink:0}}/>{x.l}</div>
                    ))}
                  </div>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                    <thead><tr style={{borderBottom:'1px solid var(--win-border)',background:'var(--win-surface2)'}}>
                      {['Período','Afiliados','Activos','%Act','PP','PG','Volumen total'].map(h=>(
                        <th key={h} style={{padding:'7px 12px',textAlign:h==='Período'?'left':'right',fontSize:10,fontWeight:600,color:'var(--win-muted)',letterSpacing:'.04em'}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {ordenados.map((p,i) => {
                        const s = computePeriodStats(p.afiliados)
                        const prev = ordenados[i-1] ? computePeriodStats(ordenados[i-1].afiliados) : null
                        const diff = prev ? s.volumen - prev.volumen : null
                        return (
                          <tr key={p.id} style={{borderBottom:'1px solid var(--win-border)',background:p===periodoActual?'var(--win-accent-l)':'none'}}>
                            <td style={{padding:'9px 12px',fontWeight:600,color:'var(--win-title)'}}>{p.labelLargo||p.label}</td>
                            <td style={{padding:'9px 12px',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{s.total}</td>
                            <td style={{padding:'9px 12px',textAlign:'right',fontVariantNumeric:'tabular-nums',color:'var(--win-green)',fontWeight:600}}>{s.activos}</td>
                            <td style={{padding:'9px 12px',textAlign:'right',color:'var(--win-muted)'}}>{s.pctActividad}%</td>
                            <td style={{padding:'9px 12px',textAlign:'right',fontVariantNumeric:'tabular-nums',color:'#3A8FF2'}}>{s.totalPP.toLocaleString()}</td>
                            <td style={{padding:'9px 12px',textAlign:'right',fontVariantNumeric:'tabular-nums',color:'#7C3AED'}}>{s.totalPG.toLocaleString()}</td>
                            <td style={{padding:'9px 12px',textAlign:'right',fontWeight:700,fontVariantNumeric:'tabular-nums'}}>
                              {s.volumen.toLocaleString()}
                              {diff !== null && <span style={{fontSize:10,marginLeft:5,color:diff>0?'var(--win-green)':diff<0?'var(--win-red)':'var(--win-muted)'}}>{diff>0?'▲+':'▼'}{Math.abs(diff).toLocaleString()}</span>}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── VISTA: ASCENSOS ── */}
      {vista==='ascensos' && (
        <div>
          {!comp ? (
            <div style={{...S.card,padding:'40px',textAlign:'center',color:'var(--win-muted)',fontSize:13}}>Agrega al menos 2 períodos para ver los cambios de rango.</div>
          ) : (
            <>
              {comp.ascensos.length > 0 && (
                <div style={{...S.card, marginBottom:14}}>
                  <div style={S.cardHeader}>
                    <span style={{fontSize:15}}>⬆️</span>
                    <span style={S.cardTitle}>Ascensos de rango ({comp.ascensos.length})</span>
                    <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>{periodoAnterior?.label} → {periodoActual?.label}</span>
                  </div>
                  {comp.ascensos.map((item,i) => (
                    <div key={item.a.ein} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:i<comp.ascensos.length-1?'1px solid var(--win-border)':'none'}}>
                      <div style={{width:36,height:36,borderRadius:'50%',background:item.a2.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`2px solid ${item.a2.color}`,overflow:'hidden'}}>
                        {RANGO_IMG[item.a2.id]?<img src={RANGO_IMG[item.a2.id]} alt={item.a2.label} style={{width:30,height:30,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:item.a2.color}}>{getInitials(item.a.nombre)}</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:'var(--win-title)'}}>{item.a.nombre}</div>
                        <div style={{fontSize:11,color:'var(--win-muted)',marginTop:2}}>EIN {item.a.ein} · Gen. {item.a.gen}</div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:7}}>
                        <RankBadge rangoStr={item.de.label}/>
                        <span style={{color:'var(--win-green)',fontWeight:700,fontSize:16}}>→</span>
                        <RankBadge rangoStr={item.a2.label}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {comp.nuevos.length > 0 && (
                <div style={{...S.card, marginBottom:14}}>
                  <div style={S.cardHeader}>
                    <span style={{fontSize:15}}>🆕</span>
                    <span style={S.cardTitle}>Nuevos ingresos ({comp.nuevos.length})</span>
                  </div>
                  {comp.nuevos.slice(0,12).map((a,i) => (
                    <div key={a.ein} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',borderBottom:i<Math.min(11,comp.nuevos.length-1)?'1px solid var(--win-border)':'none'}}>
                      <div style={{width:30,height:30,borderRadius:'50%',background:getRango(a.rango).bg,border:`1.5px solid ${getRango(a.rango).color}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>
                        {RANGO_IMG[getRango(a.rango).id]?<img src={RANGO_IMG[getRango(a.rango).id]} alt='' style={{width:24,height:24,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:getRango(a.rango).color}}>{getInitials(a.nombre)}</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--win-title)'}}>{a.nombre}</div>
                        <div style={{fontSize:11,color:'var(--win-muted)'}}>EIN {a.ein} · Gen. {a.gen}</div>
                      </div>
                      <RankBadge rangoStr={a.rango}/>
                      <div style={{fontSize:12,fontWeight:700,color:'var(--win-gold)',minWidth:50,textAlign:'right'}}>{((a.pp||0)+(a.pg||0)).toLocaleString()} pts</div>
                    </div>
                  ))}
                  {comp.nuevos.length > 12 && <div style={{padding:'8px 16px',fontSize:11,color:'var(--win-muted)'}}>... y {comp.nuevos.length-12} más</div>}
                </div>
              )}
              {comp.reactivados.length > 0 && (
                <div style={{...S.card, marginBottom:14}}>
                  <div style={S.cardHeader}>
                    <span style={{fontSize:15}}>⚡</span>
                    <span style={S.cardTitle}>Reactivados ({comp.reactivados.length})</span>
                    <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>Tenían 0 pts el mes anterior y ahora tienen actividad</span>
                  </div>
                  {comp.reactivados.slice(0,8).map((a,i) => (
                    <div key={a.ein} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',borderBottom:i<Math.min(7,comp.reactivados.length-1)?'1px solid var(--win-border)':'none'}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:'var(--win-accent)',flexShrink:0}}/>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:'var(--win-title)'}}>{a.nombre}</div><div style={{fontSize:11,color:'var(--win-muted)'}}>EIN {a.ein} · {getRango(a.rango).label}</div></div>
                      <div style={{fontSize:12,fontWeight:700,color:'var(--win-green)'}}>{((a.pp||0)+(a.pg||0)).toLocaleString()} pts</div>
                    </div>
                  ))}
                  {comp.reactivados.length > 8 && <div style={{padding:'8px 16px',fontSize:11,color:'var(--win-muted)'}}>... y {comp.reactivados.length-8} más</div>}
                </div>
              )}
              {comp.desactivados.length > 0 && (
                <div style={{...S.card}}>
                  <div style={S.cardHeader}>
                    <span style={{fontSize:15}}>⚠️</span>
                    <span style={S.cardTitle}>Se desactivaron ({comp.desactivados.length})</span>
                    <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>Tenían PP/PG el mes anterior · 0 este mes</span>
                  </div>
                  {comp.desactivados.slice(0,10).map((a,i) => (
                    <div key={a.ein} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',borderBottom:i<Math.min(9,comp.desactivados.length-1)?'1px solid var(--win-border)':'none'}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:'var(--win-red)',flexShrink:0}}/>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:'var(--win-title)'}}>{a.nombre}</div><div style={{fontSize:11,color:'var(--win-muted)'}}>EIN {a.ein} · {getRango(a.rango).label}</div></div>
                      <span style={{fontSize:11,color:'var(--win-red)',fontWeight:600,padding:'2px 8px',borderRadius:20,background:'var(--win-red-l)'}}>Sin movimiento</span>
                    </div>
                  ))}
                  {comp.desactivados.length > 10 && <div style={{padding:'8px 16px',fontSize:11,color:'var(--win-muted)'}}>... y {comp.desactivados.length-10} más</div>}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── VISTA: LÍDERES ── */}
      {vista==='lideres' && periodoActual && (
        <div>
          {[{campo:'pg',label:'PG',color:'#7C3AED',titulo:'Puntos de Grupo'},{campo:'pp',label:'PP',color:'var(--win-accent)',titulo:'Puntos Personales'}].map(({campo,label,color,titulo}) => (
            <div key={campo} style={{...S.card, marginBottom:14}}>
              <div style={S.cardHeader}><span style={S.cardTitle}>Top 20 — {titulo} · tendencia · {periodoActual.label}</span></div>
              {[...periodoActual.afiliados]
                .filter(a => (a[campo]||0) > 0)
                .sort((a,b) => (b[campo]||0)-(a[campo]||0))
                .slice(0,20)
                .map((a,i) => {
                  const prevP = periodoAnterior?.afiliados.find(p=>p.ein===a.ein)
                  const diff = prevP ? (a[campo]||0)-(prevP[campo]||0) : null
                  return (
                    <div key={a.ein} style={{display:'flex',alignItems:'center',gap:11,padding:'11px 16px',borderBottom:i<19?'1px solid var(--win-border)':'none'}}>
                      <div style={{width:22,height:22,borderRadius:'50%',background:i<3?'#FEF9EC':'var(--win-surface2)',border:i<3?'1.5px solid #C47F17':'1px solid var(--win-border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:i<3?'#C47F17':'var(--win-muted)',flexShrink:0}}>{i+1}</div>
                      <div style={{width:30,height:30,borderRadius:'50%',background:getRango(a.rango).bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden',border:`1.5px solid ${getRango(a.rango).color}`}}>
                        {RANGO_IMG[getRango(a.rango).id]?<img src={RANGO_IMG[getRango(a.rango).id]} alt='' style={{width:24,height:24,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:getRango(a.rango).color}}>{getInitials(a.nombre)}</span>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--win-title)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.nombre}</div>
                        <div style={{fontSize:11,color:'var(--win-muted)'}}>{getRango(a.rango).label} · EIN {a.ein}</div>
                      </div>
                      {(() => {
                        const hist = ordenados.map(p => (p.afiliados.find(x=>x.ein===a.ein)?.[campo]||0))
                        return mkSparkline(hist, color, 72, 26)
                      })()}
                      <div style={{textAlign:'right',flexShrink:0}}>
                        <div style={{fontSize:14,fontWeight:800,color,fontVariantNumeric:'tabular-nums'}}>{(a[campo]||0).toLocaleString()} {label}</div>
                        {diff!==null && <div style={{fontSize:10,color:diff>0?'var(--win-green)':diff<0?'var(--win-red)':'var(--win-muted)'}}>{diff>0?'▲+':'▼'}{Math.abs(diff).toLocaleString()}</div>}
                      </div>
                      {a.telefono && <a href={`https://wa.me/52${a.telefono.toString().replace(/\D/g,'')}`} target='_blank' rel='noopener noreferrer' style={{display:'inline-flex',alignItems:'center',gap:4,padding:'4px 9px',borderRadius:7,background:'#25D36620',color:'#128C7E',fontSize:10,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap',border:'1px solid #25D36640',flexShrink:0}}>📲 WA</a>}
                    </div>
                  )
                })}
            </div>
          ))}
        </div>
      )}

      {/* ── VISTA: RETENCIÓN ── */}
      {vista==='retencion' && (
        <div>
          {!comp ? (
            <div style={{...S.card,padding:'40px',textAlign:'center',color:'var(--win-muted)',fontSize:13}}>Agrega al menos 2 períodos para ver el análisis de retención.</div>
          ) : (
            <>
              <div style={{...S.card, marginBottom:14, padding:'20px 24px'}}>
                <div style={{display:'flex',alignItems:'center',gap:22,flexWrap:'wrap'}}>
                  <div>
                    <svg width="86" height="86" viewBox="0 0 86 86">
                      <circle cx="43" cy="43" r="34" fill="none" stroke="var(--win-border)" strokeWidth="11"/>
                      <circle cx="43" cy="43" r="34" fill="none" stroke={comp.retencion>=70?'var(--win-green)':comp.retencion>=50?'#F59E0B':'var(--win-red)'} strokeWidth="11"
                        strokeDasharray={`${(comp.retencion/100)*213.6} 213.6`} strokeDashoffset="53.4" strokeLinecap="round"/>
                      <text x="43" y="48" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--win-title)">{comp.retencion}%</text>
                    </svg>
                  </div>
                  <div style={{flex:1,minWidth:180}}>
                    <div style={{fontSize:16,fontWeight:700,color:'var(--win-title)',marginBottom:4}}>Tasa de retención</div>
                    <div style={{fontSize:12,color:'var(--win-muted)',lineHeight:1.7,marginBottom:8}}>
                      {comp.retenidos.length} afiliados activos en {periodoAnterior.label} siguieron activos en {periodoActual.label}.
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:comp.retencion>=70?'var(--win-green)':comp.retencion>=50?'#F59E0B':'var(--win-red)'}}>
                      {comp.retencion>=70?'Excelente retención 💪':comp.retencion>=50?'Retención media · hay oportunidad de mejora':'Retención baja · priorizar acompañamiento y seguimiento'}
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,minWidth:200}}>
                    {[
                      {l:'Se mantuvieron activos', v:comp.retenidos.length, c:'var(--win-green)'},
                      {l:'Se desactivaron', v:comp.desactivados.length, c:'var(--win-red)'},
                      {l:'Se reactivaron', v:comp.reactivados.length, c:'var(--win-accent)'},
                      {l:'Nuevos ingresos', v:comp.nuevos.length, c:'var(--win-muted)'},
                    ].map(k => (
                      <div key={k.l} style={{textAlign:'center'}}>
                        <div style={{fontSize:20,fontWeight:800,color:k.c,fontVariantNumeric:'tabular-nums'}}>{k.v}</div>
                        <div style={{fontSize:10,color:'var(--win-muted)',lineHeight:1.3}}>{k.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Afiliados en riesgo: inactivos en los últimos 2+ períodos */}
              {ordenados.length >= 2 && (() => {
                const periodosRev = [...ordenados].reverse()
                const einRiesgoMap = {}
                periodosRev[0].afiliados.forEach(a => {
                  einRiesgoMap[a.ein] = { curr: a, meses: (a.pp||0)+(a.pg||0)===0 ? 1 : 0 }
                })
                for (let pi = 1; pi < periodosRev.length; pi++) {
                  periodosRev[pi].afiliados.forEach(a => {
                    if (einRiesgoMap[a.ein] && einRiesgoMap[a.ein].meses === pi && (a.pp||0)+(a.pg||0)===0) {
                      einRiesgoMap[a.ein].meses++
                    }
                  })
                }
                const enRiesgo = Object.values(einRiesgoMap)
                  .filter(({meses}) => meses >= 2)
                  .sort((a,b) => b.meses - a.meses)
                if (enRiesgo.length === 0) return null
                return (
                  <div style={S.card}>
                    <div style={S.cardHeader}>
                      <span style={{fontSize:15}}>🔴</span>
                      <span style={S.cardTitle}>En riesgo: inactivos 2+ meses ({enRiesgo.length})</span>
                      <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-red)',fontWeight:600,padding:'2px 8px',borderRadius:20,background:'var(--win-red-l)'}}>Requieren contacto urgente</span>
                    </div>
                    {enRiesgo.slice(0,12).map(({curr,meses},i) => (
                      <div key={curr.ein} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',borderBottom:i<Math.min(11,enRiesgo.length-1)?'1px solid var(--win-border)':'none'}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:meses>=3?'#B91C1C':'var(--win-red)',flexShrink:0}}/>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:600,color:'var(--win-title)'}}>{curr.nombre}</div>
                          <div style={{fontSize:11,color:'var(--win-muted)'}}>EIN {curr.ein} · {getRango(curr.rango).label} · Gen. {curr.gen}</div>
                        </div>
                        <span style={{fontSize:11,color:'var(--win-red)',fontWeight:600,padding:'2px 8px',borderRadius:20,background:'var(--win-red-l)',whiteSpace:'nowrap'}}>{meses} mes{meses!==1?'es':''} sin movimiento</span>
                        {curr.telefono && <a href={`https://wa.me/52${curr.telefono.toString().replace(/\D/g,'')}`} target='_blank' rel='noopener noreferrer' style={{display:'inline-flex',alignItems:'center',gap:4,padding:'4px 9px',borderRadius:7,background:'#25D36620',color:'#128C7E',fontSize:10,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap',border:'1px solid #25D36640',flexShrink:0}}>📲 WA</a>}
                      </div>
                    ))}
                    {enRiesgo.length > 12 && <div style={{padding:'8px 16px',fontSize:11,color:'var(--win-muted)'}}>... y {enRiesgo.length-12} mas</div>}
                  </div>
                )
              })()}
            </>
          )}
          {/* ── Vista: Por Rango ── */}
          {vista==='porRango' && periodoActual && (() => {
            const tcVal = tc || TC_FALLBACK
            // Rangos presentes en el periodo actual
            const todosRangosArr = [...new Set(periodoActual.afiliados.map(a => getRango(a.rango).id))]
              .sort((a,b) => rangoOrden(b) - rangoOrden(a)).map(id => getRango(id))
            // Seleccion activa
            const selSet = rangoFiltros ?? new Set(todosRangosArr.map(r => r.id))
            const toggleRF = (id) => {
              const full = new Set(todosRangosArr.map(r => r.id))
              const curr = rangoFiltros ?? new Set(full)
              const next = new Set(curr)
              if (next.has(id)) { next.delete(id) } else { next.add(id) }
              if (next.size === 0) return
              setRangoFiltros([...full].every(r => next.has(r)) ? null : next)
            }
            // Afiliados filtrados
            const filtrados = periodoActual.afiliados.filter(a => selSet.has(getRango(a.rango).id))
            // Por nivel (gen)
            const byGen = {}
            filtrados.forEach(a => { const g = a.gen??0; if(!byGen[g]) byGen[g]=[]; byGen[g].push(a) })
            const genNiveles = Object.keys(byGen).map(Number).sort((a,b)=>a-b).slice(0,12)
            // Totales
            const totalPP = filtrados.reduce((s,a)=>s+(a.pp||0),0)
            const totalPG = filtrados.reduce((s,a)=>s+(a.pg||0),0)
            const totalMXN = filtrados.reduce((s,a)=>s+(a.pp||0)*valorPuntoDe(getRango(a.rango).id),0)
            // Stats por rango (solo seleccionados)
            const rangoStats = {}
            todosRangosArr.forEach(r => { rangoStats[r.id] = {r, personas:0, pp:0, pg:0, mxn:0, hist:[]} })
            filtrados.forEach(a => {
              const r = getRango(a.rango)
              if (!rangoStats[r.id]) rangoStats[r.id] = {r, personas:0, pp:0, pg:0, mxn:0, hist:[]}
              rangoStats[r.id].personas++
              rangoStats[r.id].pp += (a.pp||0)
              rangoStats[r.id].pg += (a.pg||0)
              rangoStats[r.id].mxn += (a.pp||0) * valorPuntoDe(r.id)
            })
            const rangoFilas = Object.values(rangoStats).filter(f => selSet.has(f.r.id) && f.personas > 0)
            // Tendencia por rango sobre todos los periodos
            rangoFilas.forEach(f => {
              f.hist = ordenados.map(p => p.afiliados.filter(a => getRango(a.rango).id === f.r.id).reduce((s,a)=>s+(a.pp||0),0))
            })
            // Stats por gen
            const genStats = genNiveles.filter(g=>g>0).map(g => {
              const afs = byGen[g]||[]
              const pp = afs.reduce((s,a)=>s+(a.pp||0),0)
              const pg = afs.reduce((s,a)=>s+(a.pg||0),0)
              const mxn = afs.reduce((s,a)=>s+(a.pp||0)*valorPuntoDe(getRango(a.rango).id),0)
              const histPP = ordenados.map(p => {
                const gs = p.afiliados.filter(a => (a.gen??0)===g && selSet.has(getRango(a.rango).id))
                return gs.reduce((s,a)=>s+(a.pp||0),0)
              })
              return {g, personas:afs.length, pp, pg, mxn, histPP, afs}
            })
            return (
              <div style={{display:'flex',flexDirection:'column',gap:14}}>

                {/* 1 — Filtros de rango */}
                <div style={S.card}>
                  <div style={{...S.cardHeader,marginBottom:10}}>
                    <span style={{fontSize:15}}>🎯</span>
                    <span style={S.cardTitle}>Filtrar por Rango</span>
                    {rangoFiltros && <button onClick={()=>setRangoFiltros(null)} style={{marginLeft:'auto',fontSize:11,color:'var(--win-accent)',background:'none',border:'none',cursor:'pointer',fontWeight:600,padding:0}}>Ver todos</button>}
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
                    {todosRangosArr.map(r => {
                      const sel = selSet.has(r.id)
                      const cnt = periodoActual.afiliados.filter(a => getRango(a.rango).id === r.id).length
                      return (
                        <button key={r.id} onClick={()=>toggleRF(r.id)} style={{display:'inline-flex',alignItems:'center',gap:5,padding:'5px 12px',borderRadius:20,border:`1.5px solid ${sel?r.color:'var(--win-border)'}`,background:sel?r.bg:'transparent',color:sel?r.color:'var(--win-muted)',fontSize:11,fontWeight:700,cursor:'pointer',transition:'.15s',fontFamily:'inherit',opacity:sel?1:0.55}}>
                          <div style={{width:7,height:7,borderRadius:'50%',background:sel?r.color:'var(--win-border)',flexShrink:0}}/>
                          {r.label}
                          <span style={{fontWeight:400,opacity:0.75}}>({cnt})</span>
                        </button>
                      )
                    })}
                  </div>
                  <div style={{display:'flex',gap:16,fontSize:11,color:'var(--win-muted)',borderTop:'1px solid var(--win-border)',paddingTop:8}}>
                    <span><b style={{color:'var(--win-text)'}}>{filtrados.length}</b> afiliados</span>
                    <span><b style={{color:'#3A8FF2'}}>{totalPP.toLocaleString()}</b> PP</span>
                    <span><b style={{color:'var(--win-green)'}}>${Math.round(totalMXN).toLocaleString('es-MX')}</b> MXN</span>
                    <span><b style={{color:'var(--win-accent)'}}>USD ${Math.round(totalMXN/tcVal).toLocaleString('en-US')}</b></span>
                  </div>
                </div>

                {/* 2 — Arbol de Red: mapa de niveles */}
                <div style={S.card}>
                  <div style={{...S.cardHeader,marginBottom:12}}>
                    <span style={{fontSize:15}}>🌐</span>
                    <span style={S.cardTitle}>Árbol de Red — Mapa por Nivel de Profundidad</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:5}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 12px',borderRadius:8,background:'var(--win-accent-l)',border:'1px solid var(--win-accent)30'}}>
                      <div style={{width:22,height:22,borderRadius:'50%',background:'var(--win-accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff',flexShrink:0}}>0</div>
                      <span style={{fontSize:12,fontWeight:700,color:'var(--win-accent)'}}>Isaac Nava — tú (Gen 0)</span>
                    </div>
                    {genNiveles.filter(g=>g>0).map(g => {
                      const afs = byGen[g]||[]
                      const rangoGrupos = {}
                      afs.forEach(a => {
                        const r = getRango(a.rango)
                        if(!rangoGrupos[r.id]) rangoGrupos[r.id]={r,count:0,nombres:[]}
                        rangoGrupos[r.id].count++
                        rangoGrupos[r.id].nombres.push(a.nombre)
                      })
                      const rgl = Object.values(rangoGrupos).sort((a,b)=>rangoOrden(b.r.id)-rangoOrden(a.r.id))
                      const ppGen = afs.reduce((s,a)=>s+(a.pp||0),0)
                      const actGen = afs.filter(a=>(a.pp||0)+(a.pg||0)>0).length
                      const mxnGen = afs.reduce((s,a)=>s+(a.pp||0)*valorPuntoDe(getRango(a.rango).id),0)
                      return (
                        <div key={g} style={{display:'flex',alignItems:'flex-start',gap:8,padding:'8px 12px',borderRadius:8,background:'var(--win-surface2)',border:'1px solid var(--win-border)'}}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:'50%',background:'var(--win-surface)',border:'1px solid var(--win-border)',fontSize:10,fontWeight:700,color:'var(--win-muted)',flexShrink:0,marginTop:2}}>{g}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:4}}>
                              {rgl.map(({r,count,nombres}) => (
                                <span key={r.id} title={nombres.join(' · ')} style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 8px',borderRadius:12,background:r.bg,color:r.color,fontSize:10,fontWeight:700,cursor:'help',border:`1px solid ${r.color}30`}}>
                                  <div style={{width:5,height:5,borderRadius:'50%',background:r.color}}/>
                                  {r.label} ×{count}
                                </span>
                              ))}
                            </div>
                            <div style={{display:'flex',flexWrap:'wrap',gap:8,fontSize:9,color:'var(--win-muted)'}}>
                              <span>{afs.length} personas</span>
                              <span>·</span>
                              <span style={{color:actGen>0?'var(--win-green)':'var(--win-muted)'}}>{actGen} activos ({Math.round(actGen/Math.max(afs.length,1)*100)}%)</span>
                              {ppGen>0 && <><span>·</span><span style={{color:'#3A8FF2'}}>{ppGen.toLocaleString()} PP</span></>}
                            </div>
                          </div>
                          <div style={{textAlign:'right',flexShrink:0}}>
                            <div style={{fontSize:12,fontWeight:700,color:'var(--win-green)',fontVariantNumeric:'tabular-nums'}}>${Math.round(mxnGen).toLocaleString('es-MX')}</div>
                            <div style={{fontSize:9,color:'var(--win-muted)'}}>USD ${Math.round(mxnGen/tcVal).toLocaleString('en-US')}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 3 — Radiografía: evolución PP por rango seleccionado */}
                {ordenados.length >= 2 && rangoFilas.length > 0 && (
                  <div style={S.card}>
                    <div style={{...S.cardHeader,marginBottom:12}}>
                      <span style={{fontSize:15}}>📡</span>
                      <span style={S.cardTitle}>Radiografía — Evolución de PP por Rango</span>
                      <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>{ordenados.length} periodos</span>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:7}}>
                      {rangoFilas.sort((a,b)=>b.mxn-a.mxn).map(f => {
                        const last = f.hist[f.hist.length-1]||0
                        const prev = f.hist[f.hist.length-2]||0
                        const d = last-prev
                        const trend = f.hist.length>=2 ? (last>prev?'up':last<prev?'down':'flat') : null
                        return (
                          <div key={f.r.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',borderRadius:9,background:'var(--win-surface2)',border:`1.5px solid ${f.r.color}25`}}>
                            <div style={{width:9,height:9,borderRadius:'50%',background:f.r.color,flexShrink:0}}/>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:12,fontWeight:700,color:f.r.color,marginBottom:1}}>{f.r.label}</div>
                              <div style={{fontSize:10,color:'var(--win-muted)'}}>{f.personas} personas · {f.pp.toLocaleString()} PP · ${Math.round(f.mxn).toLocaleString('es-MX')} MXN</div>
                            </div>
                            {mkSparkline(f.hist, f.r.color, 88, 28)}
                            <div style={{textAlign:'right',flexShrink:0,minWidth:56}}>
                              <div style={{fontSize:14,fontWeight:800,color:f.r.color,fontVariantNumeric:'tabular-nums'}}>{last.toLocaleString()}</div>
                              {d!==0 && <div style={{fontSize:9,color:d>0?'var(--win-green)':'var(--win-red)',fontWeight:600}}>{d>0?'▲+':'▼'}{Math.abs(d).toLocaleString()}</div>}
                              {trend==='up' && <div style={{fontSize:8,color:'var(--win-green)'}}>tendencia ↑</div>}
                              {trend==='down' && <div style={{fontSize:8,color:'var(--win-red)'}}>tendencia ↓</div>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 4 — Tabla de valor por nivel de profundidad */}
                <div style={S.card}>
                  <div style={{...S.cardHeader,marginBottom:0}}>
                    <span style={{fontSize:15}}>💎</span>
                    <span style={S.cardTitle}>Valor por Nivel de Profundidad</span>
                    <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>TC ${tcVal.toFixed(2)}</span>
                  </div>
                  <div style={{overflowX:'auto'}}>
                    <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                      <thead>
                        <tr style={{background:'var(--win-surface2)'}}>
                          {['Nivel','Personas','PP','PG','Valor MXN','Valor USD','Tendencia PP'].map(h=>(
                            <th key={h} style={{padding:'9px 12px',textAlign:h==='Nivel'?'left':'right',fontWeight:700,fontSize:10,color:'var(--win-muted)',whiteSpace:'nowrap',borderBottom:'1px solid var(--win-border)'}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {genStats.map((gs,i) => (
                          <tr key={gs.g} style={{borderBottom:'1px solid var(--win-border)',background:i%2===0?'transparent':'var(--win-surface2)'}}>
                            <td style={{padding:'9px 12px',fontWeight:700}}>
                              <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
                                <span style={{width:18,height:18,borderRadius:'50%',background:'var(--win-surface)',border:'1px solid var(--win-border)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'var(--win-muted)'}}>{gs.g}</span>
                                Gen {gs.g}
                              </span>
                            </td>
                            <td style={{padding:'9px 12px',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{gs.personas}</td>
                            <td style={{padding:'9px 12px',textAlign:'right',color:'#3A8FF2',fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{gs.pp.toLocaleString()}</td>
                            <td style={{padding:'9px 12px',textAlign:'right',color:'#7C3AED',fontVariantNumeric:'tabular-nums'}}>{gs.pg.toLocaleString()}</td>
                            <td style={{padding:'9px 12px',textAlign:'right',color:'var(--win-green)',fontWeight:600,fontVariantNumeric:'tabular-nums'}}>${Math.round(gs.mxn).toLocaleString('es-MX')}</td>
                            <td style={{padding:'9px 12px',textAlign:'right',color:'var(--win-accent)',fontVariantNumeric:'tabular-nums'}}>USD ${Math.round(gs.mxn/tcVal).toLocaleString('en-US')}</td>
                            <td style={{padding:'9px 12px',textAlign:'right'}}>
                              {ordenados.length>=2 ? <div style={{display:'flex',justifyContent:'flex-end'}}>{mkSparkline(gs.histPP,'#3A8FF2',60,22)}</div> : <span style={{color:'var(--win-muted)',fontSize:10}}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{borderTop:'2px solid var(--win-border)',fontWeight:700,background:'var(--win-surface2)'}}>
                          <td style={{padding:'9px 12px'}}>Total</td>
                          <td style={{padding:'9px 12px',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{filtrados.length}</td>
                          <td style={{padding:'9px 12px',textAlign:'right',color:'#3A8FF2',fontVariantNumeric:'tabular-nums'}}>{totalPP.toLocaleString()}</td>
                          <td style={{padding:'9px 12px',textAlign:'right',color:'#7C3AED',fontVariantNumeric:'tabular-nums'}}>{totalPG.toLocaleString()}</td>
                          <td style={{padding:'9px 12px',textAlign:'right',color:'var(--win-green)',fontVariantNumeric:'tabular-nums'}}>${Math.round(totalMXN).toLocaleString('es-MX')}</td>
                          <td style={{padding:'9px 12px',textAlign:'right',color:'var(--win-accent)',fontVariantNumeric:'tabular-nums'}}>USD ${Math.round(totalMXN/tcVal).toLocaleString('en-US')}</td>
                          <td/>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            )
          })()}
          {/* ── Vista: Pipeline Oro ── */}
          {vista==='pipeline' && periodoActual && (() => {
            const candidatos = periodoActual.afiliados
              .filter(a => !esOroPlus(a))
              .map(a => {
                const r = getRango(a.rango)
                const pp = a.pp||0
                const pg = a.pg||0
                const total = pp + pg
                const metaOro = 3000
                const pct = Math.min(100, Math.round(total / metaOro * 100))
                const prevA = periodoAnterior?.afiliados.find(p => p.ein===a.ein)
                const prevTotal = prevA ? (prevA.pp||0)+(prevA.pg||0) : null
                const tendencia = prevTotal !== null ? total - prevTotal : null
                return { ...a, pp, pg, total, pct, tendencia, rangoLabel:r.label, rangoColor:r.color }
              })
              .sort((a,b) => b.total - a.total)
              .slice(0,15)
            if (candidatos.length === 0) return (
              <div style={{...S.card,padding:'24px',textAlign:'center',color:'var(--win-muted)'}}>No hay datos de candidatos a Oro en este periodo.</div>
            )
            return (
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <div style={{...S.card,padding:'14px 16px',background:'linear-gradient(120deg,var(--win-surface),#FFFBEB)'}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--win-muted)',marginBottom:4}}>PIPELINE A ORO (45%)</div>
                  <div style={{fontSize:12,color:'var(--win-text)',lineHeight:1.6}}>Candidatos con mayor volumen acumulado (PP+PG). Meta: 3,000 en 1-2 periodos.</div>
                </div>
                {candidatos.map((a,i) => (
                  <div key={a.ein} style={{...S.card,padding:'14px 16px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                      <div style={{width:26,height:26,borderRadius:'50%',background:'var(--win-surface2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'var(--win-muted)',flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:'var(--win-title)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.nombre}</div>
                        <div style={{fontSize:10,color:'var(--win-muted)'}}>{a.rangoLabel} · EIN {a.ein} · Gen. {a.gen}</div>
                      </div>
                      <div style={{textAlign:'right',flexShrink:0}}>
                        <div style={{fontSize:14,fontWeight:800,color:a.pct>=66?'var(--win-green)':a.pct>=33?'#F59E0B':'var(--win-muted)',fontVariantNumeric:'tabular-nums'}}>{a.pct}%</div>
                        <div style={{fontSize:10,color:'var(--win-muted)'}}>{a.total.toLocaleString()} / 3,000</div>
                      </div>
                      {a.telefono && <a href={`https://wa.me/52${a.telefono.toString().replace(/\D/g,'')}`} target='_blank' rel='noopener noreferrer' style={{display:'inline-flex',alignItems:'center',gap:4,padding:'4px 8px',borderRadius:7,background:'#25D36620',color:'#128C7E',fontSize:10,fontWeight:700,textDecoration:'none',border:'1px solid #25D36640',flexShrink:0}}>📲 WA</a>}
                    </div>
                    <div style={{background:'var(--win-border)',borderRadius:5,height:8,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${a.pct}%`,background:a.pct>=66?'var(--win-green)':a.pct>=33?'#F59E0B':'var(--win-accent)',borderRadius:5,transition:'width .3s'}}/>
                    </div>
                    {a.tendencia !== null && (
                      <div style={{marginTop:5,fontSize:10,color:a.tendencia>0?'var(--win-green)':a.tendencia<0?'var(--win-red)':'var(--win-muted)'}}>
                        {a.tendencia>0?'▲':'▼'} {Math.abs(a.tendencia).toLocaleString()} vs periodo anterior
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })()}
          {/* ── Vista: Ficha Persona ── */}
          {vista==='ficha' && (() => {
            const todos = periodoActual?.afiliados || []
            const resultados = fichaQ.trim().length >= 2
              ? todos.filter(a => a.nombre?.toLowerCase().includes(fichaQ.toLowerCase()) || String(a.ein).includes(fichaQ))
              : []
            return (
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={S.card}>
                  <div style={{...S.cardHeader,marginBottom:10}}>
                    <span style={{fontSize:15}}>🔍</span>
                    <span style={S.cardTitle}>Ficha de Persona</span>
                  </div>
                  <input
                    value={fichaQ}
                    onChange={e => { setFichaQ(e.target.value); setFichaEin(null) }}
                    placeholder='Buscar por nombre o EIN…'
                    style={{width:'100%',boxSizing:'border-box',padding:'9px 13px',borderRadius:8,border:'1.5px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-text)',fontSize:13,fontFamily:'inherit',outline:'none'}}
                  />
                  {resultados.length > 0 && !fichaEin && (
                    <div style={{marginTop:6,border:'1px solid var(--win-border)',borderRadius:8,overflow:'hidden'}}>
                      {resultados.slice(0,8).map((a,i) => (
                        <div key={a.ein} onClick={() => setFichaEin(a.ein)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',borderBottom:i<Math.min(7,resultados.length-1)?'1px solid var(--win-border)':'none',cursor:'pointer',background:'var(--win-surface2)'}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:600,color:'var(--win-title)'}}>{a.nombre}</div>
                            <div style={{fontSize:11,color:'var(--win-muted)'}}>{getRango(a.rango).label} · EIN {a.ein}</div>
                          </div>
                          <span style={{fontSize:11,color:'var(--win-accent)'}}>Ver ficha →</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {fichaEin && (() => {
                  const historial = ordenados.map(p => p.afiliados.find(a => a.ein===fichaEin)).filter(Boolean)
                  const ultimo = historial[historial.length-1]
                  if (!ultimo) return null
                  const r = getRango(ultimo.rango)
                  const maxPP = Math.max(1, ...historial.map(h => h.pp||0))
                  return (
                    <div style={{display:'flex',flexDirection:'column',gap:12}}>
                      <div style={{...S.card,padding:'16px 18px',borderLeft:`4px solid ${r.color}`}}>
                        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
                          <div style={{width:42,height:42,borderRadius:'50%',background:r.bg,display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${r.color}`,fontSize:16,fontWeight:700,color:r.color,flexShrink:0}}>
                            {getInitials(ultimo.nombre)}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:16,fontWeight:800,color:'var(--win-title)'}}>{ultimo.nombre}</div>
                            <div style={{fontSize:12,color:'var(--win-muted)'}}>EIN {ultimo.ein} · Gen. {ultimo.gen} · <span style={{color:r.color,fontWeight:600}}>{r.label}</span></div>
                          </div>
                          {ultimo.telefono && <a href={`https://wa.me/52${ultimo.telefono.toString().replace(/\D/g,'')}`} target='_blank' rel='noopener noreferrer' style={{display:'inline-flex',alignItems:'center',gap:5,padding:'7px 13px',borderRadius:8,background:'#25D36620',color:'#128C7E',fontSize:12,fontWeight:700,textDecoration:'none',border:'1px solid #25D36640'}}>📲 WhatsApp</a>}
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                          {[{l:'PP último mes',v:(ultimo.pp||0).toLocaleString()},{l:'PG último mes',v:(ultimo.pg||0).toLocaleString()},{l:'Periodos activo',v:historial.filter(h=>(h.pp||0)+(h.pg||0)>0).length}].map(k => (
                            <div key={k.l} style={{textAlign:'center',background:'var(--win-surface2)',borderRadius:8,padding:'10px 6px'}}>
                              <div style={{fontSize:16,fontWeight:800,color:'var(--win-accent)',fontVariantNumeric:'tabular-nums'}}>{k.v}</div>
                              <div style={{fontSize:10,color:'var(--win-muted)',lineHeight:1.3}}>{k.l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {historial.length >= 2 && (
                        <div style={S.card}>
                          <div style={{...S.cardHeader,marginBottom:12}}>
                            <span style={{fontSize:14}}>📈</span>
                            <span style={S.cardTitle}>Historial PP por periodo</span>
                          </div>
                          {(() => {
                            const histPP = historial.map(h => h.pp||0)
                            const histPG = historial.map(h => h.pg||0)
                            const labels = historial.map(h => (ordenados.find(p=>p.afiliados.find(a=>a===h))||{}).label||'')
                            const maxAll = Math.max(...histPP, ...histPG, 1)
                            const W=400, H=80, padB=20, padT=8
                            const gH = H-padB-padT
                            const xOf = i => historial.length<=1?W/2:(i/(historial.length-1))*W
                            const yOf = v => padT+gH-(v/maxAll)*gH
                            const mkL = arr => arr.map((v,i)=>`${i===0?'M':'L'}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ')
                            const linePP = mkL(histPP), linePG = mkL(histPG)
                            const areaPP = `${linePP} L${xOf(histPP.length-1).toFixed(1)},${(padT+gH).toFixed(1)} L0,${(padT+gH).toFixed(1)} Z`
                            return (
                              <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100px',overflow:'visible',display:'block',marginBottom:8}}>
                                {[0,0.5,1].map((t,i) => <line key={i} x1={0} x2={W} y1={yOf(maxAll*t)} y2={yOf(maxAll*t)} stroke='var(--win-border)' strokeWidth={0.6} strokeDasharray={i===0?'none':'3,3'}/>)}
                                <path d={areaPP} fill={r.color} fillOpacity={0.09}/>
                                <path d={linePP} fill='none' stroke={r.color} strokeWidth={2} strokeLinejoin='round'/>
                                <path d={linePG} fill='none' stroke='#7C3AED' strokeWidth={1.3} strokeLinejoin='round' strokeDasharray='4,2'/>
                                {historial.map((_,i) => {
                                  const x=xOf(i), pp=histPP[i], pg=histPG[i]
                                  return (
                                    <g key={i}>
                                      <circle cx={x} cy={yOf(pp)} r={3} fill={r.color}/>
                                      <circle cx={x} cy={yOf(pg)} r={2} fill='#7C3AED'/>
                                      <text x={x} y={H-2} textAnchor='middle' fontSize='7' fill='var(--win-muted)'>{labels[i].slice(0,6)}</text>
                                      {pp>0 && <text x={x} y={yOf(pp)-5} textAnchor='middle' fontSize='6.5' fill={r.color} fontWeight='700'>{pp.toLocaleString()}</text>}
                                    </g>
                                  )
                                })}
                              </svg>
                            )
                          })()}
                          <div style={{overflowX:'auto',marginTop:4}}>
                            <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                              <thead>
                                <tr>{['Periodo','Rango','PP','PG'].map(h => <th key={h} style={{padding:'5px 10px',textAlign:h==='Periodo'||h==='Rango'?'left':'right',color:'var(--win-muted)',fontWeight:600,borderBottom:'1px solid var(--win-border)'}}>{h}</th>)}</tr>
                              </thead>
                              <tbody>
                                {[...historial].reverse().map((h,i) => {
                                  const per = ordenados.find(p => p.afiliados.find(a => a===h))
                                  return (
                                    <tr key={i} style={{borderBottom:i<historial.length-1?'1px solid var(--win-border)':'none'}}>
                                      <td style={{padding:'6px 10px',fontWeight:600,color:'var(--win-text)'}}>{per?.label||'—'}</td>
                                      <td style={{padding:'6px 10px',color:getRango(h.rango).color,fontWeight:600}}>{getRango(h.rango).label}</td>
                                      <td style={{padding:'6px 10px',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{(h.pp||0).toLocaleString()}</td>
                                      <td style={{padding:'6px 10px',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{(h.pg||0).toLocaleString()}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            )
          })()}
          {/* ── Vista: Salud del Negocio ── */}
          {vista==='salud' && periodoActual && (() => {
            const stats = computePeriodStats(periodoActual.afiliados)
            const prevStats = periodoAnterior ? computePeriodStats(periodoAnterior.afiliados) : null
            const indicadores = [
              {
                id:'actividad', label:'Actividad del equipo', icon:'⚡',
                valor: Math.round(stats.pctActividad),
                unidad:'%',
                desc: `${stats.activos} de ${stats.total} activos este periodo`,
                verde: 70, amarillo: 40,
              },
              {
                id:'liderazgo', label:'Liderazgo Oro+', icon:'🥇',
                valor: Math.round(stats.orosPlus / Math.max(1, stats.total) * 100),
                unidad:'%',
                desc: `${stats.orosPlus} empresarios Oro o superior`,
                verde: 15, amarillo: 7,
              },
              {
                id:'frontales', label:'Frontales gen-1', icon:'🤝',
                valor: stats.frontales1,
                unidad:'',
                desc: `${stats.frontales1} colaboradores directos activos`,
                verde: 5, amarillo: 2,
              },
              {
                id:'crecimiento', label:'Crecimiento vs anterior', icon:'📈',
                valor: prevStats ? Math.round((stats.activos - prevStats.activos) / Math.max(1,prevStats.activos) * 100) : null,
                unidad:'%',
                desc: prevStats ? `${stats.activos} vs ${prevStats.activos} activos` : 'Sin periodo anterior',
                verde: 5, amarillo: 0,
              },
              {
                id:'volumen', label:'Volumen PP total', icon:'📦',
                valor: stats.totalPP,
                unidad:' PP',
                desc: `${stats.totalPP.toLocaleString()} puntos personales del equipo`,
                verde: 2000, amarillo: 1000,
              },
            ]
            const scoreTotal = indicadores.reduce((s, ind) => {
              if (ind.valor === null) return s
              const pct = ind.unidad === '%' || ind.id==='actividad'||ind.id==='liderazgo'||ind.id==='crecimiento'
                ? ind.valor
                : Math.min(100, Math.round(ind.valor / ind.verde * 100))
              return s + Math.min(100, Math.max(0, pct))
            }, 0) / indicadores.filter(i => i.valor!==null).length
            const saludColor = scoreTotal >= 70 ? 'var(--win-green)' : scoreTotal >= 40 ? '#F59E0B' : 'var(--win-red)'
            const saludLabel = scoreTotal >= 70 ? 'Negocio saludable' : scoreTotal >= 40 ? 'Negocio en desarrollo' : 'Requiere atención'
            return (
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {/* Score central */}
                <div style={{...S.card,padding:'20px',textAlign:'center'}}>
                  <div style={{fontSize:11,fontWeight:600,letterSpacing:'.08em',color:'var(--win-muted)',marginBottom:8}}>SALUD DEL NEGOCIO — {periodoActual.label}</div>
                  <div style={{fontSize:52,fontWeight:900,color:saludColor,lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{Math.round(scoreTotal)}</div>
                  <div style={{fontSize:11,color:'var(--win-muted)',marginBottom:10}}>/100</div>
                  <div style={{display:'inline-block',padding:'5px 18px',borderRadius:20,background:saludColor+'22',color:saludColor,fontWeight:700,fontSize:13}}>{saludLabel}</div>
                </div>
                {/* Indicadores */}
                {indicadores.map(ind => {
                  const v = ind.valor
                  const pct = v === null ? null : Math.min(100, ind.unidad === ' PP'
                    ? Math.round(v / ind.verde * 100)
                    : Math.max(0, v >= ind.verde ? 100 : v >= ind.amarillo ? Math.round(50 + (v-ind.amarillo)/(ind.verde-ind.amarillo)*50) : Math.round(v/Math.max(1,ind.amarillo)*50))
                  )
                  const col = pct === null ? 'var(--win-muted)' : pct >= 66 ? 'var(--win-green)' : pct >= 33 ? '#F59E0B' : 'var(--win-red)'
                  return (
                    <div key={ind.id} style={{...S.card,padding:'14px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                        <span style={{fontSize:18}}>{ind.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:700,color:'var(--win-title)'}}>{ind.label}</div>
                          <div style={{fontSize:11,color:'var(--win-muted)'}}>{ind.desc}</div>
                        </div>
                        <div style={{fontSize:18,fontWeight:800,color:col,fontVariantNumeric:'tabular-nums',flexShrink:0}}>
                          {v === null ? '—' : `${v.toLocaleString()}${ind.unidad}`}
                        </div>
                      </div>
                      {pct !== null && (
                        <div style={{background:'var(--win-border)',borderRadius:5,height:7,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${pct}%`,background:col,borderRadius:5,transition:'width .4s'}}/>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function App() {
  const [tab, setTab] = useState('red')
  const [afiliados, setAfiliados] = useState([])
  const [archivos, setArchivos] = useState([])
  const [duplicados, setDuplicados] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [cargado, setCargado] = useState(false)
  const [genealogiaEin, setGenealogiaEin] = useState(null)
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
  const fileRef = useRef()

  const irAGenealogia = useCallback((ein) => {
    setGenealogiaEin(ein)
    setTab('genealogia')
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

  const handleFile = (e) => {
    const f = e.target.files[0]; if(!f) return
    parseWorkbookFile(f).then((nuevos) => {
      onCargar(f.name, nuevos, detectarDuplicados(nuevos))
    })
  }

  const TABS = [{id:'red',l:'Mi Red',I:Icons.BarChart},{id:'arbol',l:'Árbol',I:Icons.Tree},{id:'genealogia',l:'Genealogía',I:Icons.GitBranch},{id:'plan',l:'Plan',I:Icons.Plan},{id:'reportes',l:'Reportes',I:Icons.TrendUp},{id:'rangos',l:'Rangos NICE',I:Icons.Trophy},{id:'anuncios',l:'Anuncios',I:Icons.Megaphone},{id:'archivos',l:'Archivos',I:Icons.Upload}]
  const self = afiliadosCalc[0]

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',fontFamily:"'DM Sans',system-ui,sans-serif",background:'var(--win-bg)'}}>
      {/* Taskbar */}
      <div className="rn-taskbar" style={{height:48,background:'var(--win-surface)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--win-border)',display:'flex',alignItems:'center',padding:'0 16px',gap:12,flexShrink:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:26,height:26,background:'var(--win-accent)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'white',boxShadow:'0 0 0 1px rgba(120,200,255,.25), 0 4px 14px rgba(37,99,235,.45)'}}>
            <div style={{width:14,height:14}}><Icons.Network/></div>
          </div>
          <span style={{fontSize:14,fontWeight:700,color:'var(--win-title)'}}>Red<span style={{color:'var(--win-accent)'}}>NICE</span></span>
        </div>
        <div className="rn-tabs">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} title={t.l} style={{display:'flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:6,fontSize:12,color:tab===t.id?'var(--win-accent)':'var(--win-text)',cursor:'pointer',transition:'.12s',border:'none',background:tab===t.id?'var(--win-accent-l)':'none',fontFamily:'inherit',fontWeight:500}}>
            <div style={{width:14,height:14}}><t.I/></div>
            <span className="rn-tab-label">{t.l}</span>
            {t.id==='archivos'&&duplicados.length>0&&<span style={{background:'var(--win-red)',color:'white',fontSize:9,fontWeight:700,borderRadius:10,padding:'1px 5px'}}>{duplicados.length}</span>}
          </button>
        ))}
        </div>
        <div className="rn-actions">
          {self&&<div className="rn-user-chip" style={{display:'flex',alignItems:'center',gap:8,padding:'5px 10px',borderRadius:6,background:'var(--win-surface2)',border:'1px solid var(--win-border)',fontSize:12,color:'var(--win-text)',fontWeight:500}}>
            <div style={{width:22,height:22,borderRadius:'50%',background:'var(--win-accent)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700}}>{getInitials(self.nombre)}</div>
            {self.nombre.split(' ').slice(0,2).join(' ')}
          </div>}
          <button onClick={()=>fileRef.current.click()} style={{display:'flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:6,background:'var(--win-accent)',color:'white',fontSize:12,fontWeight:600,border:'none',cursor:'pointer',fontFamily:'inherit'}}>
            <div style={{width:14,height:14}}><Icons.Upload/></div>
            Cargar Excel
          </button>
          <button onClick={toggleTheme} title={theme==='dark'?'Modo claro':'Modo oscuro'} style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,borderRadius:6,background:'var(--win-surface2)',border:'1px solid var(--win-border)',cursor:'pointer',color:'var(--win-text)',fontSize:14,padding:0}}>
            {theme==='dark'?'☀️':'🌙'}
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={handleFile}/>
        </div>
      </div>

      {/* Panel header */}
      <div style={{padding:'14px 24px 12px',background:'var(--win-surface)',borderBottom:'1px solid var(--win-border)',flexShrink:0}}>
        <div style={{fontSize:18,fontWeight:700,color:'var(--win-title)'}}>{TABS.find(t=>t.id===tab)?.l}</div>
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
        </div>
      </div>

      {/* Body */}
      <div className="rn-body" style={{flex:1,overflowY:'auto',background:'var(--win-bg)'}}>
        {tab==='reportes'&&<PanelReportes periodos={periodos} onAgregarPeriodo={onAgregarPeriodo} onEliminarPeriodo={onEliminarPeriodo} tc={tc}/>}
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
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
                <button onClick={()=>fileRef.current.click()} className="rn-glass-btn">
                  <div style={{width:18,height:18}}><Icons.Upload/></div>
                  Seleccionar archivo Excel
                </button>
                <button onClick={cargarDemo} disabled={demoLoading} className="rn-ghost-btn" style={{opacity:demoLoading?0.6:1}}>
                  {demoLoading ? 'Cargando ejemplo…' : 'o explora la app con datos de ejemplo'}
                </button>
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
            {tab==='arbol'&&<PanelArbol afiliados={afiliadosCalc} onGenealogia={irAGenealogia}/>}
            {tab==='genealogia'&&<PanelGenealogia afiliados={afiliadosCalc} rootEin={genealogiaEin} onChangeRoot={setGenealogiaEin} tc={tc}/>}
            {tab==='plan'&&<PanelPlan afiliados={afiliadosCalc} tc={tc} volBase={volBase} setVolBase={setVolBase} umbralUSD={umbralUSD} setUmbralUSD={setUmbralUSD}/>}
            {tab==='rangos'&&<PanelRangos afiliados={afiliadosCalc}/>}
            {tab==='anuncios'&&<PanelAnuncios/>}
            {tab==='archivos'&&<PanelArchivos archivos={archivos} onCargar={onCargar} duplicados={duplicados}/>}
          </>
        )}
      </div>
    </div>
  )
}
window.App = App
