// ── Imágenes de rangos ──
export const RANGO_IMG = {
  SIN: '/rangos/empresario.png',
  EIN: '/rangos/empresario.png',
  COBRE: '/rangos/cobre.png',
  BRONCE: '/rangos/bronce.png',
  PLATA: '/rangos/plata.png',
  ORO: '/rangos/oro.png',
  ORO_EXPERTO: '/rangos/oro_experto.png',
  ORO_PREMIER: '/rangos/oro_premier.png',
  ORO_ELITE: '/rangos/oro_elite.png',
  PLATINO: '/rangos/platino.png',
  ORO_EJECUTIVO: '/rangos/oro_ejecutivo.png',
  ORO_SENIOR: '/rangos/oro_senior.png',
  ORO_MASTER: '/rangos/oro_master.png',
  DIAMANTE: '/rangos/diamante.png',
  DIAMANTE_MASTER: '/rangos/diamante.png',
  DOBLE_DIAMANTE: '/rangos/diamante.png',
}

// ── Rangos NICE según plan de carrera oficial ──
export const RANGOS = [
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

export function getRango(rangoStr) {
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

export function getSiguienteRango(rangoId) {
  const orden = ['EIN','COBRE','BRONCE','PLATA','ORO','ORO_EJECUTIVO','ORO_SENIOR','ORO_MASTER','DIAMANTE','DIAMANTE_MASTER','DOBLE_DIAMANTE']
  const idx = orden.indexOf(rangoId)
  if (idx < 0 || idx >= orden.length - 1) return null
  return RANGOS.find(r => r.id === orden[idx + 1])
}

export function getProgresoPct(afiliado, siguiente) {
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

export function getPlanAccion(afiliado, siguiente, afiliados) {
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

  if (siguiente.id === 'ORO_EJECUTIVO') return [
    { num: 1, color: '#DC2626', title: 'Desarrollar 1 frontal Oro que genere $200 USD en Desc. por Red', desc: 'Identifica quién en tu gen.1 está más cerca de Oro. Apóyalo a calificar y a mantener PP suficientes para generar $200 USD en Descuentos por Red.' },
    { num: 2, color: '#EA580C', title: 'Mantener tu rango Oro activo', desc: 'Para recibir Descuentos por Red necesitas estar activo en Oro (45%). Mantén tus PP propios y tu red generando PG cada mes.' },
    { num: 3, color: '#16A34A', title: 'Entender los Descuentos por Red', desc: 'Con Oro Ejecutivo empiezas a recibir del 1% al 5% de los PP del 1er, 2do y 3er nivel Oro. Más PP en tu red = más reembolsos.' },
  ]

  if (siguiente.id === 'ORO_SENIOR') return [
    { num: 1, color: '#DC2626', title: 'Desarrollar un 2do frontal Oro activo', desc: 'Necesitas 2 frontales Oro generando cada uno $200 USD en Desc. por Red. Identifica el candidato más cercano en tu gen.1.' },
    { num: 2, color: '#EA580C', title: 'Mantener a tus frontales Oro generando $200 USD', desc: `Cada frontal debe tener PP suficientes para recibir $200 USD en Descuentos por Red. Apóyalos mensualmente.` },
    { num: 3, color: '#16A34A', title: 'Construir más líneas en paralelo', desc: 'Mientras más líneas tengas desarrollándose hacia Oro, más estable es tu avance. No te quedes con una sola línea.' },
  ]

  if (siguiente.id === 'ORO_MASTER') return [
    { num: 1, color: '#DC2626', title: 'Desarrollar un 3er frontal Oro activo', desc: 'Necesitas 3 frontales Oro generando $200 USD en Desc. por Red. Con 2 frontales ya activos, identifica el tercer candidato.' },
    { num: 2, color: '#EA580C', title: 'Sistematizar el apoyo a tus frontales', desc: 'Con 3 líneas Oro necesitas un proceso para apoyar a cada una a mantener sus PP y Descuentos por Red cada mes.' },
    { num: 3, color: '#16A34A', title: 'Prepararte para Diamante', desc: 'Oro Master te pone a 1 frontal de Diamante. Empieza a identificar quién puede ser tu 4to frontal Oro desde ahora.' },
  ]

  if (siguiente.id === 'DIAMANTE') return [
    { num: 1, color: '#DC2626', title: 'Desarrollar un 4to frontal Oro + 2,000 PP/PG', desc: 'Necesitas 4 frontales Oro generando $200 USD en Desc. por Red y tú mismo generar 2,000 PP/PG combinados.' },
    { num: 2, color: '#EA580C', title: 'Enfocarte en volumen de red', desc: 'Diamante desbloquea el 3% del 4to Nivel Oro. Mientras más grande sea tu red, más reembolsos recibes.' },
    { num: 3, color: '#16A34A', title: 'Premio: Cupón de $5,000 en productos NICE', desc: 'Al alcanzar Diamante recibes un cupón de $5,000 pesos en productos y acceso a Descuentos por Red del 4to nivel.' },
  ]

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

export function parseExcel(data) {
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

export function detectarDuplicados(afiliados) {
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

export function buildTree(afiliados) {
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

export function getInitials(nombre) {
  if (!nombre) return '??'
  const parts = nombre.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function contarPorRango(afiliados) {
  const counts = {}
  afiliados.forEach(a => {
    const r = getRango(a.rango)
    counts[r.label] = (counts[r.label] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}
