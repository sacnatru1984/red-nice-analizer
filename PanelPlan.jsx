const { useState, useRef, useCallback, useEffect, useMemo } = React
let getRango, getSiguienteRangoObjetivo, getProgresoPct, esOroPlus, frontalGenera, getPlanAccion, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, exportAffiliateReport

function useExternal(name) {
  const [v, setV] = useState(() => (typeof window !== 'undefined' ? window[name] : undefined))
  useEffect(() => {
    if (v) return
    const id = setInterval(() => { if (window[name]) { setV(() => window[name]); clearInterval(id) } }, 30)
    return () => clearInterval(id)
  }, [v, name])
  return v
}

function PanelPlan({ afiliados, tc, volBase, setVolBase, umbralUSD, setUmbralUSD }) {
  ;({ getRango, getSiguienteRangoObjetivo, getProgresoPct, esOroPlus, frontalGenera, getPlanAccion, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, exportAffiliateReport } = window)
  const RedVisual = useExternal('RedVisual')
  const isMobile = useIsMobile()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(null)
  const [drop, setDrop] = useState(false)
  const [verDetalle, setVerDetalle] = useState(false)
  const [verTodosInactivos, setVerTodosInactivos] = useState(false)
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
  const elegir = (a) => { setSel(a); setQ(a.nombre); setDrop(false); setVerDetalle(false); setVerTodosInactivos(false) }
  const limpiar = () => { setSel(null); setQ(''); setDrop(false) }
  const hasData = afiliados.length > 0
  useEffect(() => {
    if (hasData && !sel) {
      const yo = afiliados.find(a => a.gen === 0) || afiliados[0]
      if (yo) { setSel(yo); setQ(yo.nombre) }
    }
  }, [hasData])

  const esUnoMismo = !!(sel && sel.gen === 0)
  const nombreCorto = sel ? sel.nombre.split(' ').slice(0, 2).join(' ') : ''
  const pos = { suyo: esUnoMismo ? 'tu' : 'su', suyos: esUnoMismo ? 'tus' : 'sus', el: esUnoMismo ? 'Tu' : `${nombreCorto} —`, deSujeto: esUnoMismo ? '' : ` de ${nombreCorto}` }

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

  // ── Personas a contactar: une en un solo cálculo lo que antes vivía en
  // 2 lugares (Seguimiento prioritario + tabla "Candidatos" dentro de Plan de acción) ──
  const getContactos = () => {
    const directos = afiliados.filter(a => a.einPresentador === sel.ein)
    const orosInactivos = directos.filter(a => esOroPlus(a) && (a.pp || 0) + (a.pg || 0) === 0)
    const candidatosOro = directos
      .filter(a => !esOroPlus(a) && (a.pp || 0) + (a.pg || 0) > 0)
      .map(a => ({ a, total: (a.pp || 0) + (a.pg || 0), falta: Math.max(0, 3000 - ((a.pp || 0) + (a.pg || 0))) }))
      .sort((x, y) => x.falta - y.falta)
      .slice(0, 5)
    const sinMovimiento = directos.filter(a => !esOroPlus(a) && (a.pp || 0) + (a.pg || 0) === 0)
    return { directos, orosInactivos, candidatosOro, sinMovimiento }
  }

  const contactosParaExport = () => {
    if (!sel) return []
    const { orosInactivos, candidatosOro } = getContactos()
    return [
      ...orosInactivos.map(a => ({ t: `Reactivar a ${a.nombre.split(' ').slice(0, 2).join(' ')}`, s: 'Es rango Oro o superior pero sin movimiento este mes' })),
      ...candidatosOro.slice(0, 3).map(({ a, total, falta }) => ({ t: `Impulsar a ${a.nombre.split(' ').slice(0, 2).join(' ')}`, s: `${total.toLocaleString()} de 3,000 pts para ser frontal Oro — faltan ${falta.toLocaleString()}` })),
    ].slice(0, 5)
  }

  const waLink = (tel) => `https://wa.me/52${tel.toString().replace(/\D/g, '')}`

  return (
    <div style={{ display: 'grid', gridTemplateColumns: sel && !isMobile ? 'minmax(0,1fr) 320px' : 'minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
      <div style={{ minWidth: 0 }}>
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

        {!sel && (
          <div style={{ textAlign: 'center', padding: '52px 24px', background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10 }}>
            <div style={{ width: 56, height: 56, background: 'var(--win-accent-l)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: 'var(--win-accent)' }}>
              <div style={{ width: 30, height: 30 }}><Icons.Search/></div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--win-title)', marginBottom: 8 }}>Busca a cualquier afiliado</div>
            <div style={{ fontSize: 13, color: 'var(--win-muted)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>Escribe el nombre o EIN para ver su plan personalizado con requisitos exactos del plan de carrera NICE 2025</div>
          </div>
        )}

        {sel && (() => {
          const { orosInactivos, candidatosOro, sinMovimiento } = getContactos()
          const hayContactos = orosInactivos.length > 0 || candidatosOro.length > 0 || sinMovimiento.length > 0
          return (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#1E3A8A 0%,#2563EB 100%)', borderRadius: 10, padding: '18px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(255,255,255,.3)' }}>{RANGO_IMG[r?.id] ? <img src={RANGO_IMG[r?.id]} alt={r?.label} style={{ width: 46, height: 46, objectFit: 'contain' }}/> : <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{getInitials(sel.nombre)}</span>}</div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sel.nombre}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>EIN {sel.ein} · Gen. {sel.gen} · {sel.ciudad}, {sel.estado}</div></div>
              {!isMobile && <RankBadge rangoStr={sel.rango}/>}
              <button onClick={() => exportAffiliateReport(sel, sig, pct, getChecks(), contactosParaExport(), pasos)} title="Descargar plan como imagen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, width: isMobile ? '100%' : 'auto', order: isMobile ? 1 : 0 }}>
                <div style={{ width: 14, height: 14 }}><Icons.Download/></div>
                Descargar
              </button>
            </div>

            {/* ── Meta y progreso (fusiona stats + barra + checklist) ── */}
            <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 12, overflow: 'hidden' }}>
              {sig ? (
                <>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--win-title)' }}>{esUnoMismo ? 'Tu meta' : `Meta de ${nombreCorto}`}: {sig.label}</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: pct >= 100 ? 'var(--win-green)' : 'var(--win-accent)' }}>{pct}%</span>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ height: 10, background: 'var(--win-surface2)', borderRadius: 5, overflow: 'hidden', border: '1px solid var(--win-border)', marginBottom: 8 }}>
                      <div style={{ width: pct + '%', height: '100%', background: pct >= 100 ? 'var(--win-green)' : 'var(--win-accent)', borderRadius: 4, transition: '.6s ease' }}/>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--win-muted)', marginBottom: 14 }}>{getReqText()}</div>
                    <div style={{ display: 'flex', gap: 18, marginBottom: 14, flexWrap: 'wrap' }}>
                      {[{ l: 'PP este mes', v: sel.pp.toLocaleString(), c: 'var(--win-gold)' }, { l: 'Puntos Grupo', v: sel.pg.toLocaleString(), c: '#7C3AED' }, { l: 'Generación', v: sel.gen, c: 'var(--win-accent)' }].map(k => (
                        <div key={k.l}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: k.c, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{k.v}</div>
                          <div style={{ fontSize: 10.5, color: 'var(--win-muted)', marginTop: 3 }}>{k.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--win-border)', paddingTop: 6 }}>
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
                </>
              ) : (
                <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--win-green-l)', color: 'var(--win-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><div style={{ width: 20, height: 20 }}><Icons.Check/></div></div>
                  <div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--win-title)' }}>{esUnoMismo ? 'Ya tienes el rango más alto' : `${nombreCorto} ya tiene el rango más alto`}</div><div style={{ fontSize: 12, color: 'var(--win-muted)', marginTop: 2 }}>{sel.pp.toLocaleString()} PP · {sel.pg.toLocaleString()} PG este mes</div></div>
                </div>
              )}
            </div>

            {/* ── Plan de acción (único, viene de getPlanAccion) ── */}
            {pasos.length > 0 && (
              <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 12, border: '1px solid var(--win-border)', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
                <div style={{ background: 'linear-gradient(120deg,#0E7FB8 0%,#2563EB 100%)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7FE3FF', boxShadow: '0 0 9px #7FE3FF', flexShrink: 0 }}/>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '.01em' }}>{esUnoMismo ? 'Tu plan de acción' : `Plan de acción de ${nombreCorto}`}</span>
                </div>
                <div style={{ background: 'var(--win-surface)', padding: '14px 16px' }}>
                  {pasos.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < pasos.length - 1 ? 16 : 0 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: p.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{p.num}</div>
                      <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)', marginBottom: 4 }}>{p.title}</div><div style={{ fontSize: 12, color: 'var(--win-muted)', lineHeight: 1.6 }}>{p.desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Personas a contactar (une los 2 cálculos de "candidatos" que antes vivían separados) ── */}
            {hayContactos && (
              <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 12, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--win-title)' }}>{esUnoMismo ? 'Personas a contactar' : `${nombreCorto} debería contactar a`}</span>
                </div>
                {orosInactivos.length > 0 && (
                  <div style={{ borderBottom: '1px solid var(--win-border)' }}>
                    <div style={{ padding: '8px 16px', background: '#FEF2F2' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '.06em' }}>🔴 Urgente — Oro sin movimiento ({orosInactivos.length})</span>
                    </div>
                    {orosInactivos.map((a, i) => {
                      const rr = getRango(a.rango)
                      return (
                        <div key={a.ein} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < orosInactivos.length - 1 ? '1px solid var(--win-border)' : 'none' }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: rr.bg, border: `2px solid ${rr.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {RANGO_IMG[rr.id] ? <img src={RANGO_IMG[rr.id]} alt='' style={{ width: 24, height: 24, objectFit: 'contain' }} /> : <span style={{ fontSize: 9, fontWeight: 700, color: rr.color }}>{getInitials(a.nombre)}</span>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nombre}</div>
                            <div style={{ fontSize: 11, color: 'var(--win-muted)', marginTop: 2 }}>{rr.label} · 0 pts este mes</div>
                          </div>
                          {a.telefono && <a href={waLink(a.telefono)} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 7, background: '#25D36620', color: '#128C7E', fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #25D36640', flexShrink: 0 }}>📲 WhatsApp</a>}
                        </div>
                      )
                    })}
                  </div>
                )}
                {candidatosOro.length > 0 && (
                  <div style={{ borderBottom: sinMovimiento.length > 0 ? '1px solid var(--win-border)' : 'none' }}>
                    <div style={{ padding: '8px 16px', background: '#FEF7E6' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#C47F17', textTransform: 'uppercase', letterSpacing: '.06em' }}>⭐ Oportunidad — cerca de ser Oro ({candidatosOro.length})</span>
                    </div>
                    {candidatosOro.map(({ a, total, falta }, i) => {
                      const rr = getRango(a.rango)
                      const pctC = Math.min(100, Math.round(total / 3000 * 100))
                      return (
                        <div key={a.ein} style={{ padding: '10px 16px', borderBottom: i < candidatosOro.length - 1 ? '1px solid var(--win-border)' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: rr.bg, border: `2px solid ${rr.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                              {RANGO_IMG[rr.id] ? <img src={RANGO_IMG[rr.id]} alt='' style={{ width: 24, height: 24, objectFit: 'contain' }} /> : <span style={{ fontSize: 9, fontWeight: 700, color: rr.color }}>{getInitials(a.nombre)}</span>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)', marginBottom: 4 }}>{a.nombre}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 6, background: 'var(--win-surface2)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--win-border)' }}>
                                  <div style={{ width: pctC + '%', height: '100%', background: '#C47F17', borderRadius: 2 }} />
                                </div>
                                <span style={{ fontSize: 11, color: 'var(--win-muted)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{total.toLocaleString()} / 3,000 · faltan {falta.toLocaleString()}</span>
                              </div>
                            </div>
                            {a.telefono && <a href={waLink(a.telefono)} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 7, background: '#25D36620', color: '#128C7E', fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #25D36640', flexShrink: 0 }}>📲 WhatsApp</a>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                {sinMovimiento.length > 0 && (
                  <div>
                    {!verTodosInactivos ? (
                      <button onClick={() => setVerTodosInactivos(true)} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'var(--win-surface2)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11.5, color: 'var(--win-muted)' }}>
                        ⚪ {sinMovimiento.length} {sinMovimiento.length === 1 ? 'persona más' : 'personas más'} sin movimiento este mes — <span style={{ color: 'var(--win-accent)', fontWeight: 600 }}>ver todas</span>
                      </button>
                    ) : (
                      <div style={{ padding: '0 16px' }}>
                        <div style={{ padding: '8px 0', fontSize: 11, fontWeight: 600, color: 'var(--win-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>⚪ Sin movimiento este mes ({sinMovimiento.length})</div>
                        {sinMovimiento.map((a, i) => (
                          <div key={a.ein} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < sinMovimiento.length - 1 ? '1px solid var(--win-border)' : 'none' }}>
                            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--win-text)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nombre}</span>
                            {a.telefono && <a href={waLink(a.telefono)} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7, background: '#25D36620', color: '#128C7E', fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #25D36640', flexShrink: 0 }}>📲 WA</a>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Ver detalle completo (colapsable) ── */}
            {(() => {
              const RANGOS_PG = ['EIN','COBRE','BRONCE','PLATA','ORO','ORO_EXPERTO','ORO_PREMIER','ORO_ELITE','PLATINO','ORO_EJECUTIVO','ORO_SENIOR','ORO_MASTER']
              const ORDEN_RANGO = ['ORO_MASTER','ORO_SENIOR','ORO_EJECUTIVO','PLATINO','ORO_ELITE','ORO_PREMIER','ORO_EXPERTO','ORO','PLATA','BRONCE','COBRE','EIN']
              const base = afiliados.filter(a => {
                if (a.ein === sel.ein) return false
                if (a.gen <= sel.gen) return false
                const rb = getRango(a.rango)
                return RANGOS_PG.includes(rb.id) && (a.pp + a.pg) > 0
              })
              const colaboradores = base
                .filter(a => filtroRangos.has(bucketRango(getRango(a.rango).id)))
                .sort((a, b) => {
                  const ra = getRango(a.rango); const rb = getRango(b.rango)
                  const orderA = ORDEN_RANGO.indexOf(ra.id); const orderB = ORDEN_RANGO.indexOf(rb.id)
                  if (orderA !== orderB) return orderA - orderB
                  return (b.pp + b.pg) - (a.pp + a.pg)
                })
              const frontalesDir = afiliados.filter(a => a.einPresentador === sel.ein)
              const tcUse = tc || TC_FALLBACK
              const orosFrontales = frontalesDir.filter(a => esOroPlus(a))
                .map(a => ({ a, g: frontalGenera(a, tc, umbralUSD), act: (a.pp || 0) + (a.pg || 0) }))
                .sort((x, y) => (y.g.genera - x.g.genera) || (y.g.usd - x.g.usd))
              if (base.length === 0 && orosFrontales.length === 0) return null
              return (
                <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', overflow: 'hidden' }}>
                  <button onClick={() => setVerDetalle(v => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <div style={{ width: 14, height: 14, color: 'var(--win-muted)' }}><Icons.Sliders/></div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--win-title)' }}>Ver detalle completo</span>
                    <span style={{ fontSize: 11, color: 'var(--win-muted)' }}>· colaboradores, frontales Oro y Desc. por Red estimado</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--win-muted)', transform: verDetalle ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>▾</span>
                  </button>
                  {verDetalle && (
                    <div style={{ borderTop: '1px solid var(--win-border)' }}>
                      <div style={{ padding: '12px 16px', background: 'var(--win-surface2)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', borderBottom: '1px solid var(--win-border)' }}>
                        <span style={{ fontSize: 11, color: 'var(--win-muted)' }}>Base del volumen para Desc. por Red:</span>
                        <div style={{ display: 'flex', background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 7, padding: 2 }}>
                          {[{ k: 'pp', l: 'PP' }, { k: 'ppg', l: 'PP+PG' }, { k: 'pg', l: 'PG' }].map(o => (
                            <button key={o.k} onClick={() => setVolBase(o.k)} style={{ padding: '4px 11px', borderRadius: 5, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, background: volBase === o.k ? 'var(--win-accent)' : 'transparent', color: volBase === o.k ? '#fff' : 'var(--win-text)' }}>{o.l}</button>
                          ))}
                        </div>
                        <span style={{ fontSize: 10.5, color: 'var(--win-muted)', lineHeight: 1.4 }}>Los montos en USD de esta sección son <b style={{ color: 'var(--win-text)' }}>estimados</b>, no un cálculo oficial de NICE.</span>
                      </div>

                      {orosFrontales.length > 0 && (
                        <div style={{ padding: '12px 16px', borderBottom: base.length > 0 ? '1px solid var(--win-border)' : 'none' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--win-accent)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Frontales Oro{pos.deSujeto}</div>
                          <div style={{ fontSize: 11, color: 'var(--win-muted)', marginBottom: 10, lineHeight: 1.5 }}>Cuenta como <b style={{ color: 'var(--win-text)' }}>frontal Oro</b> quien es rango Oro o superior <b style={{ color: 'var(--win-text)' }}>y está activo</b> este mes (PP+PG&gt;0).</div>
                          <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--win-border)' }}>
                                {['Frontal', 'Actividad', 'Desc. Red (estimado)', '¿Cuenta?'].map(h => (
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
                                    <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--win-muted)' }}>~${Math.round(g.usd).toLocaleString()} <span style={{ fontSize: 9 }}>({a.descRedPersonas || 0}p)</span></td>
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
                        </div>
                      )}

                      {base.length > 0 && (
                        <div>
                          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)' }}>Colaboradores a {pos.suyos} Puntos de Grupo</span>
                            <span style={{ marginLeft: 'auto', background: '#F5F0FF', color: '#7C3AED', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{colaboradores.length} personas</span>
                          </div>
                          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)', background: 'var(--win-surface2)', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: 'var(--win-muted)', textTransform: 'uppercase', alignSelf: 'center' }}>Filtrar rangos:</span>
                            {RANGOS_FILTRO.map(f => {
                              const rDef = RANGOS.find(rr => rr.id === f.id)
                              const checked = filtroRangos.has(f.id)
                              return (
                                <label key={f.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', userSelect: 'none', opacity: checked ? 1 : 0.5 }}>
                                  {RANGO_IMG[f.id] && <img src={RANGO_IMG[f.id]} alt={f.label} style={{ width: 32, height: 32, objectFit: 'contain' }}/>}
                                  <span style={{ background: rDef?.bg, color: rDef?.color, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>{f.label}</span>
                                  <input type="checkbox" checked={checked} onChange={() => toggleFiltro(f.id)} style={{ cursor: 'pointer', accentColor: 'var(--win-accent)' }}/>
                                </label>
                              )
                            })}
                          </div>
                          <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse', fontSize: 12 }}>
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
                                    const rr = getRango(a.rango)
                                    rows.push(
                                      <tr key={a.ein} style={{ borderBottom: '1px solid var(--win-border)', background: i % 2 === 0 ? 'transparent' : 'var(--win-surface2)' }}>
                                        <td style={{ padding: '8px 12px' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {RANGO_IMG[rr.id] && <img src={RANGO_IMG[rr.id]} alt={rr.label} style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0 }}/>}
                                            <span style={{ background: rr.bg, color: rr.color, padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>{rr.label}</span>
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
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
          )
        })()}
      </div>
      {sel && <RedVisual sel={sel} afiliados={afiliados} filtroRangos={filtroRangos} bucketRango={bucketRango}/>}
    </div>
  )
}


window.PanelPlan = PanelPlan
