const { useState, useRef, useCallback, useEffect, useMemo } = React
let getRango, getSiguienteRangoObjetivo, getSiguienteRangoVenta, getPotencialEquipo, getProgresoPct, getPlanAccion, getInitials, useIsMobile, RankBadge, RANGO_IMG, Icons, exportAffiliateReport, esOroPlus, calcularLineasOro

function PanelPlan({ afiliados, tc, umbralUSD, preselectEin, periodos }) {
  ;({ getRango, getSiguienteRangoObjetivo, getSiguienteRangoVenta, getPotencialEquipo, getProgresoPct, getPlanAccion, getInitials, useIsMobile, RankBadge, RANGO_IMG, Icons, exportAffiliateReport, esOroPlus, calcularLineasOro } = window)
  const isMobile = useIsMobile()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(null)
  const [drop, setDrop] = useState(false)
  const [verTodosInactivos, setVerTodosInactivos] = useState(false)
  const [lineaExpandida, setLineaExpandida] = useState(null)
  const [nivelExpandido, setNivelExpandido] = useState(null)
  const res = q.length > 1 ? afiliados.filter(a => a.nombre.toLowerCase().includes(q.toLowerCase()) || a.ein.includes(q)).slice(0, 8) : []
  const elegir = (a) => { setSel(a); setQ(a.nombre); setDrop(false); setVerTodosInactivos(false); setLineaExpandida(null); setNivelExpandido(null) }
  const limpiar = () => { setSel(null); setQ(''); setDrop(false) }
  const hasData = afiliados.length > 0
  useEffect(() => {
    if (!hasData) return
    if (preselectEin) {
      const p = afiliados.find(a => a.ein === preselectEin)
      if (p) { elegir(p); return }
    }
    if (!sel) {
      const yo = afiliados.find(a => a.gen === 0) || afiliados[0]
      if (yo) { setSel(yo); setQ(yo.nombre) }
    }
  }, [hasData, preselectEin])

  const esUnoMismo = !!(sel && sel.gen === 0)
  const nombreCorto = sel ? sel.nombre.split(' ').slice(0, 2).join(' ') : ''
  const pos = { suyo: esUnoMismo ? 'tu' : 'su', suyos: esUnoMismo ? 'tus' : 'sus', el: esUnoMismo ? 'Tu' : `${nombreCorto} —`, deSujeto: esUnoMismo ? '' : ` de ${nombreCorto}` }

  const r = sel ? getRango(sel.rango) : null
  const sig = sel ? getSiguienteRangoObjetivo(sel) : null
  const pct = sel && sig ? getProgresoPct(sel, sig) : 0
  const pasos = sel ? getPlanAccion(sel, sig, afiliados, tc, umbralUSD) : []
  const potencial = sel ? getPotencialEquipo(sel) : null
  const tienePotencialExtra = potencial && (!sig || potencial.id !== sig.id)

  // Meta de Ventas: escalera de esfuerzo personal (independiente del rango de equipo),
  // solo aplica una vez que el afiliado ya es Oro+ (así lo define el plan de carrera).
  const sigVenta = sel && esOroPlus(sel) ? getSiguienteRangoVenta(sel) : null
  const pctVenta = sel && sigVenta ? getProgresoPct(sel, sigVenta) : 0
  const rVenta = sel ? getRango(sel.rangoVenta) : null

  // Líneas de Oro: cada frontal Oro directo se analiza por separado (su propio
  // Nivel 1-3, con su propio % según sus puntos), para ver cuál línea ya llega
  // a los $200 USD y cuál conviene apoyar primero.
  const lineasOro = sel && esOroPlus(sel) ? calcularLineasOro(sel, afiliados, tc, umbralUSD) : null

  // Frontales Oro directos: para que Isaac (o quien esté viendo el plan) sepa
  // exactamente con quién trabajar y cuál es el siguiente reto de cada uno.
  const frontalesOroDirectos = sel ? afiliados.filter(a => a.einPresentador === sel.ein && esOroPlus(a)) : []

  // Riesgo de EIN inactivo: la regla NICE exige mínimo 1,000 PP en 12 meses o se
  // pierde la red, los descuentos y el rango. Solo se puede evaluar con los
  // periodos que Isaac ya subió (no siempre serán 12 meses completos).
  const ultimos12 = (sel && periodos && periodos.length > 1)
    ? [...periodos].sort((a, b) => a.año * 12 + a.mes - (b.año * 12 + b.mes)).slice(-12).map(p => {
        const af = p.afiliados.find(x => x.ein === sel.ein)
        return { label: p.label, pts: (af?.pp || 0) + (af?.pg || 0) }
      })
    : []
  const rachaInactiva = (() => {
    let n = 0
    for (let i = ultimos12.length - 1; i >= 0; i--) { if (ultimos12[i].pts === 0) n++; else break }
    return n
  })()
  const totalUlt12 = ultimos12.reduce((s, p) => s + p.pts, 0)
  const enRiesgoEIN = ultimos12.length >= 2 && (rachaInactiva >= 2 || (ultimos12.length >= 12 && totalUlt12 < 1000))

  const getReqText = () => {
    if (!sig) return ''
    if (sig.tipo === 'personal') return sel.pp + ' de ' + sig.ppReq.toLocaleString() + ' PP × 3 meses consecutivos'
    if (sig.tipo === 'equipo') return (sel.frontalesOro || 0) + ' de ' + sig.frontalesOro + ' frontales Oro activos'
    const req = sig.id === 'COBRE' ? 700 : sig.id === 'BRONCE' ? 1000 : sig.id === 'PLATA' ? 2000 : 3000
    return (sel.pp + sel.pg).toLocaleString() + ' de ' + req.toLocaleString() + ' PP/PG combinados'
  }

  const getChecks = () => {
    if (!sig) return []
    const propioPts = sel.pp + sel.pg
    const checks = [
      { ok: propioPts > 0, txt: 'Tiene actividad este período (PP o PG > 0)', sub: sel.pp.toLocaleString() + ' PP + ' + sel.pg.toLocaleString() + ' PG = ' + propioPts.toLocaleString() + ' puntos combinados' },
      { ok: propioPts >= 2000, txt: 'Meta mínima: 2,000 PP/PG combinados', sub: 'Tiene ' + propioPts.toLocaleString() + ' de 2,000' + (propioPts < 2000 ? ' · le faltan ' + (2000 - propioPts).toLocaleString() : ' · completo') + ' — desbloquea el mejor % de Descuento por Red y es la base para llegar a Diamante+' },
    ]
    if (sig.tipo === 'desc') {
      const req = sig.id === 'COBRE' ? 700 : sig.id === 'BRONCE' ? 1000 : sig.id === 'PLATA' ? 2000 : 3000
      checks.push({ ok: propioPts >= req, txt: 'Alcanzar ' + req.toLocaleString() + ' PP/PG combinados', sub: 'Tiene ' + propioPts.toLocaleString() + ' de ' + req.toLocaleString() + ' puntos' })
    }
    if (sig.tipo === 'personal') checks.push({ ok: sel.pp >= sig.ppReq, txt: 'Alcanzar ' + sig.ppReq.toLocaleString() + ' PP × 3 meses consecutivos', sub: 'Este mes: ' + sel.pp + ' PP de ' + sig.ppReq.toLocaleString() + ' requeridos' })
    if (sig.tipo === 'equipo') {
      const tieneF = sel.frontalesOro || 0
      const faltanF = Math.max(0, sig.frontalesOro - tieneF)
      checks.push({ ok: tieneF >= sig.frontalesOro, txt: sig.frontalesOro + ' frontal' + (sig.frontalesOro > 1 ? 'es' : '') + ' Oro activo' + (sig.frontalesOro > 1 ? 's' : '') + ' en tu gen.1', sub: 'Tienes ' + tieneF + ' de ' + sig.frontalesOro + ' frontal' + (sig.frontalesOro > 1 ? 'es' : '') + ' Oro (rango Oro+ y con movimiento este mes)' + (faltanF > 0 ? ' · te ' + (faltanF > 1 ? 'faltan ' : 'falta ') + faltanF : ' · completo') })
    }
    return checks
  }

  // Personas a contactar: une en un solo cálculo lo que antes vivía en 2 lugares
  // (Seguimiento prioritario + tabla "Candidatos" dentro de Plan de acción).
  // Compartida con Mi Semana vía window.getContactosDirectos (App.jsx).
  const getContactos = () => window.getContactosDirectos(afiliados, sel.ein)

  const contactosParaExport = () => {
    if (!sel) return []
    const { orosInactivos, candidatosOro, nuevos15 } = getContactos()
    return [
      ...orosInactivos.map(a => ({ t: `Reactivar a ${a.nombre.split(' ').slice(0, 2).join(' ')}`, s: 'Es rango Oro o superior pero sin movimiento este mes' })),
      ...nuevos15.filter(x => (x.a.pp || 0) + (x.a.pg || 0) === 0).slice(0, 2).map(({ a, dias }) => ({ t: `Activar a ${a.nombre.split(' ').slice(0, 2).join(' ')} (nuevo)`, s: `Se afilió hace ${dias} día${dias === 1 ? '' : 's'} y aún no tiene PP/PG` })),
      ...candidatosOro.slice(0, 3).map(({ a, total, falta }) => ({ t: `Impulsar a ${a.nombre.split(' ').slice(0, 2).join(' ')}`, s: `${total.toLocaleString()} de 3,000 pts para ser frontal Oro — faltan ${falta.toLocaleString()}` })),
    ].slice(0, 5)
  }

  const waLink = (tel) => `https://wa.me/52${tel.toString().replace(/\D/g, '')}`

  return (
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
          const { orosInactivos, candidatosOro, nuevos15, sinMovimiento } = getContactos()
          const hayContactos = orosInactivos.length > 0 || nuevos15.length > 0 || candidatosOro.length > 0 || sinMovimiento.length > 0
          return (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#1E3A8A 0%,#2563EB 100%)', borderRadius: 10, padding: '18px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(255,255,255,.3)' }}>{RANGO_IMG[r?.id] ? <img src={RANGO_IMG[r?.id]} alt={r?.label} style={{ width: 46, height: 46, objectFit: 'contain' }}/> : <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{getInitials(sel.nombre)}</span>}</div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sel.nombre}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>EIN {sel.ein} · Gen. {sel.gen} · {sel.ciudad}, {sel.estado}</div></div>
              {!isMobile && <RankBadge rangoStr={sel.rango}/>}
              <button onClick={() => window.exportAffiliateReport(sel, sig, pct, getChecks(), contactosParaExport(), pasos).catch(e=>{console.error(e); alert('No se pudo generar el plan.\n\nDetalle técnico:\n' + (e && (e.stack || e.message) ? (e.stack || e.message) : String(e)))})} title="Descargar plan como imagen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, width: isMobile ? '100%' : 'auto', order: isMobile ? 1 : 0 }}>
                <div style={{ width: 14, height: 14 }}><Icons.Download/></div>
                Descargar
              </button>
            </div>

            {enRiesgoEIN && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '12px 16px', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 17, lineHeight: 1 }}>⚠️</span>
                <div style={{ fontSize: 12, color: '#991B1B', lineHeight: 1.5 }}>
                  <b>Riesgo de perder rango y red.</b> {esUnoMismo ? 'Llevas' : `${nombreCorto} lleva`} {rachaInactiva} periodo{rachaInactiva > 1 ? 's' : ''} cargado{rachaInactiva > 1 ? 's' : ''} seguido{rachaInactiva > 1 ? 's' : ''} sin actividad (PP+PG = 0) — de los últimos {ultimos12.length} periodos que subiste, suma {totalUlt12.toLocaleString()} PP. La regla NICE exige mínimo 1,000 PP en 12 meses o se pierden la red, los descuentos y el rango.
                </div>
              </div>
            )}

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
                    {tienePotencialExtra && (
                      <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'var(--win-accent-l)', border: '1px solid var(--win-accent)40', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 15, lineHeight: 1 }}>🚀</span>
                        <div style={{ fontSize: 12, color: 'var(--win-title)', lineHeight: 1.5 }}>
                          <b>Potencial: {potencial.label}.</b> Con {pos.suyos} frontales Oro activos, {esUnoMismo ? 'ya cumples' : `${nombreCorto} ya cumple`} los requisitos de equipo para llegar hasta ahí — en cuanto NICE actualice {pos.suyo} rango oficial paso a paso, ese sería {esUnoMismo ? 'tu' : 'su'} siguiente nivel real.
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--win-green-l)', color: 'var(--win-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><div style={{ width: 20, height: 20 }}><Icons.Check/></div></div>
                  <div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--win-title)' }}>{esUnoMismo ? 'Ya tienes el rango más alto' : `${nombreCorto} ya tiene el rango más alto`}</div><div style={{ fontSize: 12, color: 'var(--win-muted)', marginTop: 2 }}>{sel.pp.toLocaleString()} PP · {sel.pg.toLocaleString()} PG este mes</div></div>
                </div>
              )}
            </div>

            {/* ── Meta de Ventas (esfuerzo personal, independiente del rango de equipo) ── */}
            {sigVenta && (
              <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--win-title)' }}>{esUnoMismo ? 'Tu meta de ventas' : `Meta de ventas de ${nombreCorto}`}: {sigVenta.label}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: pctVenta >= 100 ? 'var(--win-green)' : 'var(--win-accent)' }}>{pctVenta}%</span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ height: 10, background: 'var(--win-surface2)', borderRadius: 5, overflow: 'hidden', border: '1px solid var(--win-border)', marginBottom: 8 }}>
                    <div style={{ width: pctVenta + '%', height: '100%', background: pctVenta >= 100 ? 'var(--win-green)' : 'var(--win-accent)', borderRadius: 4, transition: '.6s ease' }}/>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--win-muted)' }}>
                    Rango de ventas actual: <b style={{ color: 'var(--win-text)' }}>{rVenta?.label || 'Sin Descuento'}</b> · {sel.pp.toLocaleString()} de {sigVenta.ppReq.toLocaleString()} PP este mes (se pide sostenerlo 3 meses consecutivos)
                  </div>
                </div>
              </div>
            )}

            {/* ── Líneas de Oro: cada frontal Oro directo, analizado por separado ── */}
            {lineasOro && lineasOro.total > 0 && (() => {
              const fMXN = v => '$' + Math.round(v).toLocaleString('es-MX')
              const fUSD = v => 'USD $' + v.toFixed(2)
              // Recomendación: de las líneas que aún no llegan a $200, ¿en cuál
              // conviene enfocar el apoyo y quién es su pieza clave? (mismo análisis
              // que se hace a mano para cualquier afiliado — aquí generalizado).
              const sinCerrar = lineasOro.lineas.filter(l => !l.cumple200)
              const mejorAportante = (l) => {
                let top = null
                for (const n of l.niveles) for (const p of n.detalle) { if (p.valorMXN > 0 && (!top || p.valorMXN > top.valorMXN)) top = p }
                return top
              }
              return (
                <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--win-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--win-title)' }}>Líneas de Oro — ¿cuáles llegan a $200 USD?</span>
                      <div style={{ fontSize: 11, color: 'var(--win-muted)', marginTop: 2 }}>Cada frontal Oro cuenta como su propia línea, con su propio Nivel 1-3</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: lineasOro.calificando > 0 ? 'var(--win-green-l)' : 'var(--win-red-l)', color: lineasOro.calificando > 0 ? 'var(--win-green)' : 'var(--win-red)', whiteSpace: 'nowrap' }}>
                      {lineasOro.calificando} de {lineasOro.total} líneas califican
                    </span>
                  </div>

                  {sinCerrar.length > 0 && (
                    <div style={{ margin: '14px 16px', padding: '12px 14px', borderRadius: 8, background: 'var(--win-accent-l)', border: '1px solid var(--win-accent)40' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--win-title)', marginBottom: 6 }}>🎯 En qué enfocarte primero</div>
                      {sinCerrar.slice(0, 2).map((l, i) => {
                        const mc = mejorAportante(l)
                        const nombreLinea = l.frontal.nombre.split(' ').slice(0, 2).join(' ')
                        return (
                          <div key={l.frontal.ein} style={{ fontSize: 11.5, color: 'var(--win-text)', lineHeight: 1.6, marginBottom: i < Math.min(2, sinCerrar.length) - 1 ? 6 : 0 }}>
                            <b>Plan {i === 0 ? 'A' : 'B'} — {nombreLinea}:</b> {fUSD(l.usd)} de $200 (faltan {fUSD(Math.max(0, (umbralUSD || 200) - l.usd))}).
                            {mc && <> Su pieza clave es <b>{mc.nombre.split(' ').slice(0, 2).join(' ')}</b> ({mc.rango || '—'}, {mc.pp.toLocaleString()} pts) — si sube a rango Oro, deja de contar aquí (pasa a cuenta aparte).</>}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div style={{ padding: '8px 16px', fontSize: 10, fontWeight: 700, color: 'var(--win-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Detalle por línea</div>

                  {lineasOro.lineas.map(linea => {
                    const abierta = lineaExpandida === linea.frontal.ein
                    const fr = getRango(linea.frontal.rango)
                    const pctBarra = Math.min(100, Math.round(linea.usd / (umbralUSD || 200) * 100))
                    return (
                      <div key={linea.frontal.ein} style={{ borderBottom: '1px solid var(--win-border)' }}>
                        <div onClick={() => setLineaExpandida(abierta ? null : linea.frontal.ein)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: fr.bg, border: `2px solid ${fr.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {RANGO_IMG[fr.id] ? <img src={RANGO_IMG[fr.id]} alt="" style={{ width: 26, height: 26, objectFit: 'contain' }}/> : <span style={{ fontSize: 10, fontWeight: 700, color: fr.color }}>{getInitials(linea.frontal.nombre)}</span>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{linea.frontal.nombre} <span style={{ fontSize: 10, color: 'var(--win-accent)', fontWeight: 600 }}>{abierta ? '▾ ocultar' : '▸ ver detalle'}</span></div>
                            <div style={{ height: 5, background: 'var(--win-surface2)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--win-border)', marginTop: 5, maxWidth: 220 }}>
                              <div style={{ width: pctBarra + '%', height: '100%', background: linea.cumple200 ? 'var(--win-green)' : 'var(--win-gold)' }}/>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: linea.cumple200 ? 'var(--win-green)' : 'var(--win-title)' }}>{fUSD(linea.usd)}</div>
                            <div style={{ fontSize: 10.5, color: linea.cumple200 ? 'var(--win-green)' : 'var(--win-muted)', fontWeight: 600 }}>{linea.cumple200 ? '✓ Califica' : `faltan ${fUSD(Math.max(0, (umbralUSD || 200) - linea.usd))}`}</div>
                          </div>
                        </div>

                        {abierta && (
                          <div style={{ padding: '0 16px 14px' }}>
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 420 }}>
                                <thead>
                                  <tr style={{ background: 'var(--win-surface2)' }}>
                                    {['Nivel', 'Personas', 'Puntos', '%', 'Valor MXN'].map(h => (
                                      <th key={h} style={{ padding: '6px 10px', textAlign: h === 'Nivel' || h === 'Personas' ? 'left' : 'right', fontSize: 10, fontWeight: 700, letterSpacing: '.05em', color: 'var(--win-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--win-border)' }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {linea.niveles.map(n => {
                                    const key = linea.frontal.ein + '-' + n.nivel
                                    const nivelAbierto = nivelExpandido === key
                                    const expandible = n.personas > 0 || n.fronteraDetalle.length > 0
                                    return (
                                      <React.Fragment key={n.nivel}>
                                        <tr onClick={() => expandible && setNivelExpandido(nivelAbierto ? null : key)} style={{ borderBottom: nivelAbierto ? 'none' : '1px solid var(--win-border)', cursor: expandible ? 'pointer' : 'default' }}>
                                          <td style={{ padding: '7px 10px', fontWeight: 600, color: 'var(--win-title)' }}>
                                            Nivel {n.nivel}{expandible && <span style={{ marginLeft: 6, fontSize: 9.5, color: 'var(--win-accent)' }}>{nivelAbierto ? '▾' : '▸ nombres'}</span>}
                                          </td>
                                          <td style={{ padding: '7px 10px', color: 'var(--win-text)' }}>{n.personas}</td>
                                          <td style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--win-gold)', fontWeight: 600 }}>{n.puntos.toLocaleString()}</td>
                                          <td style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--win-muted)' }}>{(n.pct * 100).toFixed(0)}%</td>
                                          <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 600, color: '#16A34A' }}>{fMXN(n.mxn)}</td>
                                        </tr>
                                        {nivelAbierto && (
                                          <tr style={{ borderBottom: '1px solid var(--win-border)' }}>
                                            <td colSpan={5} style={{ padding: 0, background: 'var(--win-surface2)' }}>
                                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                                                <thead>
                                                  <tr>
                                                    {['Nombre', 'Rango', 'PP', 'Valor/pto', 'Aporte MXN'].map(h => (
                                                      <th key={h} style={{ padding: '4px 8px 4px 22px', textAlign: h === 'Nombre' || h === 'Rango' ? 'left' : 'right', fontSize: 9, fontWeight: 700, color: 'var(--win-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{h}</th>
                                                    ))}
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {n.detalle.map(p => (
                                                    <tr key={p.ein}>
                                                      <td style={{ padding: '4px 8px 4px 22px', color: 'var(--win-title)', fontWeight: 500 }}>{p.nombre}</td>
                                                      <td style={{ padding: '4px 8px', color: 'var(--win-muted)' }}>{p.rango || '—'}</td>
                                                      <td style={{ padding: '4px 8px', textAlign: 'right', color: 'var(--win-text)' }}>{p.pp.toLocaleString()}</td>
                                                      <td style={{ padding: '4px 8px', textAlign: 'right', color: 'var(--win-muted)' }}>${p.valorPunto.toFixed(2)}</td>
                                                      <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 600, color: p.valorMXN > 0 ? '#16A34A' : 'var(--win-muted)' }}>{fMXN(p.valorMXN)}</td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                              {n.fronteraDetalle.length > 0 && (
                                                <div style={{ padding: '8px 8px 8px 22px', borderTop: '1px solid var(--win-border)', background: '#FEF7E6' }}>
                                                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#C47F17', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>
                                                    Ya son Oro — no suman aquí, inician el Nivel {n.nivel + 1}
                                                  </div>
                                                  {n.fronteraDetalle.map(p => (
                                                    <div key={p.ein} style={{ fontSize: 11, color: 'var(--win-text)', padding: '2px 0' }}>{p.nombre} <span style={{ color: 'var(--win-muted)' }}>· {p.rango}</span></div>
                                                  ))}
                                                </div>
                                              )}
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 10, fontSize: 11 }}>
                              <span style={{ color: 'var(--win-muted)' }}>Total: <b style={{ color: 'var(--win-title)' }}>{fMXN(linea.totalMXN)}</b></span>
                              <span style={{ color: 'var(--win-muted)' }}>IVA (16%): <b style={{ color: 'var(--win-title)' }}>-{fMXN(linea.ivaMXN)}</b></span>
                              <span style={{ color: 'var(--win-muted)' }}>Neto: <b style={{ color: 'var(--win-title)' }}>{fMXN(linea.netoMXN)}</b></span>
                              <span style={{ color: 'var(--win-muted)' }}>% según {linea.frontal.nombre.split(' ')[0]}: <b style={{ color: 'var(--win-title)' }}>{linea.propios.toLocaleString()} pts propios</b></span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  <div style={{ padding: '10px 16px', fontSize: 10.5, color: 'var(--win-muted)', lineHeight: 1.5 }}>
                    Cada línea usa el % (5%/4%/4%) según los <b style={{ color: 'var(--win-text)' }}>puntos propios de ese frontal</b>, no los de {nombreCorto}. 1 línea calificando = Oro Ejecutivo · 2 = Oro Senior · 3 = Oro Master.
                  </div>
                </div>
              )
            })()}

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
                {nuevos15.length > 0 && (
                  <div style={{ borderBottom: '1px solid var(--win-border)' }}>
                    <div style={{ padding: '8px 16px', background: '#EFF6FF' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '.06em' }}>🆕 Nuevos — primeros 15 días ({nuevos15.length})</span>
                    </div>
                    {nuevos15.map(({ a, dias }, i) => {
                      const rr = getRango(a.rango)
                      const activo = (a.pp || 0) + (a.pg || 0) > 0
                      return (
                        <div key={a.ein} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < nuevos15.length - 1 ? '1px solid var(--win-border)' : 'none' }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: rr.bg, border: `2px solid ${rr.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {RANGO_IMG[rr.id] ? <img src={RANGO_IMG[rr.id]} alt='' style={{ width: 24, height: 24, objectFit: 'contain' }} /> : <span style={{ fontSize: 9, fontWeight: 700, color: rr.color }}>{getInitials(a.nombre)}</span>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nombre}</div>
                            <div style={{ fontSize: 11, marginTop: 2, color: activo ? 'var(--win-green)' : '#DC2626', fontWeight: activo ? 500 : 700 }}>
                              Día {dias} de 15 · {activo ? `ya activó (${((a.pp||0)+(a.pg||0)).toLocaleString()} pts)` : 'aún sin PP/PG — actívalo antes de que se acabe la ventana'}
                            </div>
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
                        <button onClick={() => setVerTodosInactivos(false)} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--win-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>⚪ Sin movimiento este mes ({sinMovimiento.length})</span>
                          <span style={{ fontSize: 11, color: 'var(--win-accent)', fontWeight: 600 }}>ocultar</span>
                        </button>
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

            {/* ── Tus Oro activos: con quién trabajar y cuál es su siguiente reto ── */}
            {frontalesOroDirectos.length > 0 && (
              <div style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 12, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--win-border)' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--win-title)' }}>{pos.el} Oro activos — trabaja con ellos para hacer crecer {pos.suyo} red</span>
                </div>
                {frontalesOroDirectos.map((f, i) => {
                  const fr = getRango(f.rango)
                  const fSig = getSiguienteRangoObjetivo(f)
                  const fPct = fSig ? getProgresoPct(f, fSig) : 100
                  return (
                    <div key={f.ein} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < frontalesOroDirectos.length - 1 ? '1px solid var(--win-border)' : 'none' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: fr.bg, border: `2px solid ${fr.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {RANGO_IMG[fr.id] ? <img src={RANGO_IMG[fr.id]} alt='' style={{ width: 24, height: 24, objectFit: 'contain' }} /> : <span style={{ fontSize: 9, fontWeight: 700, color: fr.color }}>{getInitials(f.nombre)}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--win-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.nombre}</div>
                        <div style={{ fontSize: 11, color: 'var(--win-muted)', marginTop: 2 }}>
                          {fr.label} · {fSig ? <>Su siguiente reto: <b style={{ color: 'var(--win-text)' }}>{fSig.label}</b> ({fPct}%)</> : 'Ya tiene el rango más alto'}
                        </div>
                      </div>
                      {f.telefono && <a href={waLink(f.telefono)} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 7, background: '#25D36620', color: '#128C7E', fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #25D36640', flexShrink: 0 }}>📲 WhatsApp</a>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          )
        })()}
    </div>
  )
}


window.PanelPlan = PanelPlan
