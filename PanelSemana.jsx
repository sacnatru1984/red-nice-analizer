const { useState, useRef, useCallback, useEffect, useMemo } = React
let S

const dateKey = (d) => { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}` }

function getHistorialOtrasSemanas(excludeKey) {
  const acciones = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k || !k.startsWith('rednice-semana-') || k === excludeKey) continue
      try {
        const d = JSON.parse(localStorage.getItem(k))
        ;(d.acciones || []).forEach(a => { if (a.hecha !== false) acciones.push(a) })
      } catch (e) {}
    }
  } catch (e) {}
  return acciones
}

function calcRacha(diasConActividad) {
  let cursor = new Date()
  let key = dateKey(cursor)
  // si hoy aún no tiene actividad, no rompe la racha de inmediato — cuenta desde ayer
  if (!diasConActividad.has(key)) { cursor.setDate(cursor.getDate() - 1); key = dateKey(cursor) }
  let racha = 0
  while (diasConActividad.has(key)) { racha++; cursor.setDate(cursor.getDate() - 1); key = dateKey(cursor) }
  return racha
}

function getDiasDelMes() {
  const hoy = new Date()
  const anio = hoy.getFullYear(), mes = hoy.getMonth()
  const primerDia = new Date(anio, mes, 1)
  const ultimoDia = new Date(anio, mes + 1, 0)
  const dias = []
  const offset = (primerDia.getDay() + 6) % 7 // Lunes=0 ... Domingo=6
  for (let i = 0; i < offset; i++) dias.push(null)
  for (let d = 1; d <= ultimoDia.getDate(); d++) dias.push(new Date(anio, mes, d))
  return dias
}

function PanelSemana() {
  ;({ S } = window)
  const getWeekKey = () => {
    const d = new Date()
    const jan1 = new Date(d.getFullYear(), 0, 1)
    const weekNum = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)
    return `${d.getFullYear()}-W${String(weekNum).padStart(2,'0')}`
  }
  const getWeekRange = () => {
    const d = new Date()
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const mon = new Date(d); mon.setDate(d.getDate() + diff)
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
    return { mon, sun }
  }
  const fmtDate = (d) => d.toLocaleDateString('es-MX', { day:'numeric', month:'long' })
  const weekKey = getWeekKey()
  const SK = `rednice-semana-${weekKey}`
  const TIPOS = [
    { id:'prospecto',   label:'Prospecto contactado', emoji:'👤', color:'var(--win-accent)' },
    { id:'afiliacion',  label:'Afiliación cerrada',   emoji:'🤝', color:'var(--win-green)' },
    { id:'publicacion', label:'Publicación en redes', emoji:'📱', color:'var(--win-purple)' },
    { id:'venta',       label:'Venta realizada',      emoji:'💰', color:'#D97706' },
  ]
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem(SK); if (s) return JSON.parse(s) } catch (e) {}
    return { metas:{ prospectos:10, afiliaciones:2, publicaciones:3, ventas:1500 }, acciones:[] }
  })
  const [editando, setEditando] = useState(false)
  const [metasTemp, setMetasTemp] = useState(data.metas)
  const [form, setForm] = useState({ tipo:'prospecto', nota:'', monto:'' })
  const [formHoy, setFormHoy] = useState({ tipo:'prospecto', nota:'', monto:'' })
  const [mostrarLog, setMostrarLog] = useState(true)

  const save = (d) => { setData(d); try { localStorage.setItem(SK, JSON.stringify(d)) } catch (e) {} }

  // Solo lo ya "hecho" cuenta para metas y progreso — lo planeado en "Hoy" todavía no.
  const progreso = useMemo(() => {
    const acc = (data.acciones || []).filter(a => a.hecha !== false)
    return {
      prospectos:   acc.filter(a => a.tipo==='prospecto').length,
      afiliaciones: acc.filter(a => a.tipo==='afiliacion').length,
      publicaciones:acc.filter(a => a.tipo==='publicacion').length,
      ventas:       acc.filter(a => a.tipo==='venta').reduce((s,a) => s+(parseFloat(a.monto)||0), 0),
    }
  }, [data.acciones])

  // Racha y calendario — combinan la semana actual con el historial de otras semanas guardadas.
  const historial = useMemo(() => {
    const actuales = (data.acciones || []).filter(a => a.hecha !== false)
    return [...actuales, ...getHistorialOtrasSemanas(SK)]
  }, [data.acciones, SK])
  const diasConActividad = useMemo(() => new Set(historial.map(a => dateKey(a.tsHecha || a.ts))), [historial])
  const racha = useMemo(() => calcRacha(diasConActividad), [diasConActividad])
  const diasDelMes = useMemo(() => getDiasDelMes(), [])
  const pendientesHoy = (data.acciones || []).filter(a => a.hecha === false)
  const logCompletado = (data.acciones || []).filter(a => a.hecha !== false)

  const agregarHoy = () => {
    if (formHoy.tipo === 'venta' && !formHoy.monto) return
    if (formHoy.tipo !== 'venta' && !formHoy.nota.trim()) return
    const nueva = { id:Date.now(), ts:new Date().toISOString(), tipo:formHoy.tipo, nota:formHoy.nota.trim(), monto:formHoy.tipo==='venta'?(parseFloat(formHoy.monto)||0):undefined, hecha:false }
    save({ ...data, acciones:[nueva, ...(data.acciones||[])] })
    setFormHoy(f => ({ ...f, nota:'', monto:'' }))
  }
  const toggleHecha = (id) => {
    save({ ...data, acciones: (data.acciones||[]).map(a => {
      if (a.id !== id) return a
      return a.hecha === false ? { ...a, hecha:true, tsHecha:new Date().toISOString() } : { ...a, hecha:false }
    })})
  }

  const pct = (v, t) => Math.min(100, t > 0 ? Math.round(v / t * 100) : 0)
  const overallPct = Math.round(
    (pct(progreso.prospectos, data.metas.prospectos) +
     pct(progreso.afiliaciones, data.metas.afiliaciones) +
     pct(progreso.publicaciones, data.metas.publicaciones) +
     pct(progreso.ventas, data.metas.ventas)) / 4
  )

  const agregarAccion = () => {
    if (form.tipo === 'venta' && !form.monto) return
    if (form.tipo !== 'venta' && !form.nota.trim()) return
    const nueva = { id:Date.now(), ts:new Date().toISOString(), tipo:form.tipo, nota:form.nota.trim(), monto:form.tipo==='venta'?(parseFloat(form.monto)||0):undefined }
    save({ ...data, acciones:[nueva,...(data.acciones||[])] })
    setForm(f => ({ ...f, nota:'', monto:'' }))
  }
  const eliminarAccion = (id) => save({ ...data, acciones:(data.acciones||[]).filter(a=>a.id!==id) })
  const guardarMetas = () => { save({ ...data, metas:metasTemp }); setEditando(false) }
  const resetSemana = () => {
    if (!window.confirm('¿Resetear el progreso de esta semana? Las metas se conservan.')) return
    save({ ...data, acciones:[] })
  }

  const { mon, sun } = getWeekRange()
  const hoy = new Date().toISOString().split('T')[0]
  const MAXWELL_TIPS = [
    'Ley del Proceso: el liderazgo crece día a día, no de un día para otro. Cada llamada que haces hoy construye tu red de mañana.',
    'Ley del Magnetismo: eres el tipo de líder que atraes. Actúa hoy como el empresario que quieres duplicar en tu red.',
    'Ley de la Conexión: toca el corazón antes de pedir una mano. Antes de invitar, conecta genuinamente con la persona.',
    'Ley del Gran Impulso: celebra cada victoria pequeña. Un prospecto contactado hoy genera el impulso del mes.',
    'Ley de las Prioridades: actividad no es realización. Enfócate en las acciones que realmente mueven tu red hacia el Oro.',
    'Ley de la Reproducción: solo un líder puede levantar a otro líder. Forma activamente a las personas de tu equipo.',
    'Ley del Crecimiento Explosivo: dirigir seguidores suma, dirigir líderes multiplica.',
  ]
  const tip = MAXWELL_TIPS[new Date().getDay() % MAXWELL_TIPS.length]

  const MET_CONFIG = [
    { key:'prospectos',   label:'Prospectos contactados', emoji:'👤', color:'var(--win-accent)',  val:progreso.prospectos,   meta:data.metas.prospectos,   tipo:'prospecto' },
    { key:'afiliaciones', label:'Afiliaciones cerradas',  emoji:'🤝', color:'var(--win-green)',   val:progreso.afiliaciones, meta:data.metas.afiliaciones, tipo:'afiliacion' },
    { key:'publicaciones',label:'Publicaciones en redes', emoji:'📱', color:'var(--win-purple)',  val:progreso.publicaciones,meta:data.metas.publicaciones,tipo:'publicacion' },
    { key:'ventas',       label:'Ventas acumuladas (MXN)',emoji:'💰', color:'#D97706',            val:progreso.ventas,       meta:data.metas.ventas,       tipo:'venta' },
  ]

  return (
    <div style={{padding:'20px 20px 48px',maxWidth:820,margin:'0 auto'}}>
      {/* Header */}
      <div style={{...S.card,marginBottom:16,padding:'18px 22px',background:'linear-gradient(135deg,var(--win-accent) 0%,#7C3AED 100%)',border:'none'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'.09em',color:'rgba(255,255,255,.72)',marginBottom:4}}>PLANEACIÓN SEMANAL</div>
            <div style={{fontSize:19,fontWeight:700,color:'#fff',lineHeight:1.2}}>{fmtDate(mon)} — {fmtDate(sun)}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,.65)',marginTop:3}}>{weekKey} · se reinicia automáticamente cada semana</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:40,fontWeight:800,color:'#fff',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{overallPct}<span style={{fontSize:20}}>%</span></div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.75)'}}>completado</div>
          </div>
        </div>
        <div style={{marginTop:14,background:'rgba(255,255,255,.25)',borderRadius:6,height:6}}>
          <div style={{width:`${overallPct}%`,height:'100%',background:'#fff',borderRadius:6,transition:'width .6s ease'}}/>
        </div>
      </div>

      {/* Racha + Calendario del mes */}
      <div style={{...S.card,marginBottom:16,padding:'16px 18px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:10}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:26}}>🔥</span>
            <div>
              <div style={{fontSize:20,fontWeight:800,color:'var(--win-title)',lineHeight:1}}>{racha} día{racha!==1?'s':''}</div>
              <div style={{fontSize:11,color:'var(--win-muted)'}}>{racha>0?'de constancia seguidos':'Registra algo hoy para empezar tu racha'}</div>
            </div>
          </div>
          <div style={{fontSize:12,fontWeight:700,color:'var(--win-title)',textTransform:'capitalize'}}>{new Date().toLocaleDateString('es-MX',{month:'long',year:'numeric'})}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:5}}>
          {['L','M','M','J','V','S','D'].map((d,i)=>(<div key={i} style={{textAlign:'center',fontSize:10,fontWeight:700,color:'var(--win-muted)'}}>{d}</div>))}
          {diasDelMes.map((d,i) => {
            if (!d) return <div key={i}/>
            const k = dateKey(d)
            const activo = diasConActividad.has(k)
            const esHoyCell = k === dateKey(new Date())
            const futuro = d > new Date()
            return (
              <div key={i} title={d.toLocaleDateString('es-MX',{day:'numeric',month:'long'})} style={{
                aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',
                borderRadius:7,fontSize:11,fontWeight:esHoyCell?800:600,
                background: activo ? 'var(--win-green)' : 'var(--win-surface2)',
                color: activo ? '#fff' : 'var(--win-text)',
                border: esHoyCell ? '2px solid var(--win-accent)' : '1px solid transparent',
                opacity: futuro && !activo ? .45 : 1,
              }}>{d.getDate()}</div>
            )
          })}
        </div>
      </div>

      {/* Frase Maxwell */}
      <div style={{...S.card,marginBottom:16,padding:'11px 15px',borderLeft:'3px solid var(--win-accent)'}}>
        <div style={{fontSize:9,fontWeight:800,letterSpacing:'.1em',color:'var(--win-accent)',marginBottom:3}}>JOHN C. MAXWELL · LAS 21 LEYES</div>
        <div style={{fontSize:12,color:'var(--win-text)',lineHeight:1.65,fontStyle:'italic'}}>{tip}</div>
      </div>

      {/* Hoy */}
      <div style={{...S.card,marginBottom:16}}>
        <div style={S.cardHeader}>
          <span style={{fontSize:15}}>☀️</span>
          <span style={S.cardTitle}>Hoy</span>
          <span style={{marginLeft:6,fontSize:11,background:'var(--win-accent)',color:'white',padding:'1px 7px',borderRadius:20,fontWeight:700}}>{pendientesHoy.length}</span>
        </div>
        <div>
          {pendientesHoy.length===0 && <div style={{padding:'16px 16px',textAlign:'center',color:'var(--win-muted)',fontSize:12}}>Nada planeado para hoy — agrega algo abajo.</div>}
          {pendientesHoy.map((a,i) => {
            const t = TIPOS.find(x=>x.id===a.tipo)||TIPOS[0]
            return (
              <div key={a.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 16px',borderTop:i===0?'none':'1px solid var(--win-border)'}}>
                <div onClick={()=>toggleHecha(a.id)} title="Marcar como hecho" style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${t.color}`,flexShrink:0,cursor:'pointer'}}/>
                <span style={{fontSize:15,flexShrink:0}}>{t.emoji}</span>
                <div style={{flex:1,minWidth:0,fontSize:12.5,color:'var(--win-text)'}}>{a.nota || t.label}{a.monto!=null?` · $${parseFloat(a.monto).toLocaleString('es-MX')}`:''}</div>
                <button onClick={()=>eliminarAccion(a.id)} title="Eliminar" style={{padding:'3px 7px',borderRadius:5,border:'1px solid var(--win-border)',background:'none',color:'var(--win-muted)',fontSize:10,cursor:'pointer',flexShrink:0}}>✕</button>
              </div>
            )
          })}
        </div>
        <div style={{padding:'10px 16px',borderTop: pendientesHoy.length?'1px solid var(--win-border)':'none'}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
            {TIPOS.map(t => (
              <button key={t.id} onClick={()=>setFormHoy(f=>({...f,tipo:t.id}))} style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:20,fontSize:10.5,fontWeight:600,cursor:'pointer',fontFamily:'inherit',border:`1.5px solid ${formHoy.tipo===t.id?t.color:'var(--win-border)'}`,background:formHoy.tipo===t.id?t.color+'18':'none',color:formHoy.tipo===t.id?t.color:'var(--win-muted)'}}>{t.emoji} {t.label.split(' ')[0]}</button>
            ))}
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <input value={formHoy.nota} onChange={e=>setFormHoy(f=>({...f,nota:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&agregarHoy()} placeholder="¿Qué planeas hacer hoy?" style={{flex:1,minWidth:160,padding:'8px 12px',borderRadius:8,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-text)',fontSize:12,fontFamily:'inherit',outline:'none'}}/>
            {formHoy.tipo==='venta'&&<input type="number" value={formHoy.monto} onChange={e=>setFormHoy(f=>({...f,monto:e.target.value}))} placeholder="Monto MXN" style={{width:115,padding:'8px 12px',borderRadius:8,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-text)',fontSize:12,fontFamily:'inherit',outline:'none'}}/>}
            <button onClick={agregarHoy} style={{padding:'8px 20px',borderRadius:8,background:'var(--win-accent)',color:'white',border:'none',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>+ Agregar</button>
          </div>
        </div>
      </div>

      {/* Tarjetas de metas */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))',gap:12,marginBottom:16}}>
        {MET_CONFIG.map(m => {
          const p = pct(m.val, m.meta)
          const done = p >= 100
          return (
            <div key={m.key} style={{...S.card,padding:'14px 16px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',inset:0,background:m.color,opacity:.04,pointerEvents:'none'}}/>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                <span style={{fontSize:22}}>{m.emoji}</span>
                {done && <span style={{fontSize:9,fontWeight:700,color:'#166534',background:'#DCFCE7',padding:'2px 7px',borderRadius:20}}>✓ Meta lograda</span>}
              </div>
              <div style={{fontSize:11,color:'var(--win-muted)',marginBottom:4,lineHeight:1.3}}>{m.label}</div>
              <div style={{fontSize:26,fontWeight:800,color:m.color,fontVariantNumeric:'tabular-nums',lineHeight:1,marginBottom:6}}>
                {m.key==='ventas' ? `$${m.val.toLocaleString('es-MX')}` : m.val}
                <span style={{fontSize:11,fontWeight:400,color:'var(--win-muted)',marginLeft:5}}>/ {m.key==='ventas'?`$${m.meta.toLocaleString('es-MX')}`:m.meta}</span>
              </div>
              <div style={{background:'var(--win-border)',borderRadius:4,height:5,marginBottom:6}}>
                <div style={{width:`${p}%`,height:'100%',background:done?'var(--win-green)':m.color,borderRadius:4,transition:'width .4s ease'}}/>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:10,color:'var(--win-muted)'}}>{p}%</span>
                <button onClick={()=>setForm(f=>({...f,tipo:m.tipo}))} style={{fontSize:10,padding:'3px 9px',borderRadius:6,background:m.color+'18',color:m.color,border:`1px solid ${m.color}40`,cursor:'pointer',fontWeight:700,fontFamily:'inherit'}}>+ Registrar</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Formulario rápido */}
      <div style={{...S.card,marginBottom:16,padding:'14px 16px'}}>
        <div style={{fontSize:12,fontWeight:700,color:'var(--win-title)',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:15}}>⚡</span> Registrar algo que ya hiciste
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
          {TIPOS.map(t => (
            <button key={t.id} onClick={()=>setForm(f=>({...f,tipo:t.id}))} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 12px',borderRadius:20,fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit',border:`1.5px solid ${form.tipo===t.id?t.color:'var(--win-border)'}`,background:form.tipo===t.id?t.color+'18':'none',color:form.tipo===t.id?t.color:'var(--win-muted)',transition:'.12s'}}>
              {t.emoji} {t.label.split(' ')[0]}
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <input value={form.nota} onChange={e=>setForm(f=>({...f,nota:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&agregarAccion()} placeholder={form.tipo==='venta'?'¿Qué vendiste? (nombre o descripción)':'¿Con quién? / ¿Qué lograste?'} style={{flex:1,minWidth:160,padding:'8px 12px',borderRadius:8,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-text)',fontSize:12,fontFamily:'inherit',outline:'none'}}/>
          {form.tipo==='venta'&&<input type="number" value={form.monto} onChange={e=>setForm(f=>({...f,monto:e.target.value}))} placeholder="Monto MXN" style={{width:115,padding:'8px 12px',borderRadius:8,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-text)',fontSize:12,fontFamily:'inherit',outline:'none'}}/>}
          <button onClick={agregarAccion} style={{padding:'8px 20px',borderRadius:8,background:'var(--win-accent)',color:'white',border:'none',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>Registrar</button>
        </div>
      </div>

      {/* Log de acciones */}
      <div style={S.card}>
        <div style={{...S.cardHeader,cursor:'pointer'}} onClick={()=>setMostrarLog(v=>!v)}>
          <span style={{fontSize:15}}>📋</span>
          <span style={S.cardTitle}>Acciones de la semana</span>
          <span style={{marginLeft:6,fontSize:11,background:'var(--win-accent)',color:'white',padding:'1px 7px',borderRadius:20,fontWeight:700}}>{logCompletado.length}</span>
          <span style={{marginLeft:'auto',color:'var(--win-muted)',fontSize:12}}>{mostrarLog?'▲':'▼'}</span>
        </div>
        {mostrarLog&&(
          <div>
            {logCompletado.length===0
              ? <div style={{padding:'28px 16px',textAlign:'center',color:'var(--win-muted)',fontSize:12}}>Sin acciones registradas — cada llamada cuenta. Regístrala aquí.</div>
              : logCompletado.map((a,i)=>{
                  const t = TIPOS.find(x=>x.id===a.tipo)||TIPOS[0]
                  const esHoy = a.ts?.startsWith(hoy)
                  return (
                    <div key={a.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',borderTop:i===0?'none':'1px solid var(--win-border)',background:esHoy?'var(--win-accent-l)':'transparent'}}>
                      <span style={{fontSize:18,flexShrink:0}}>{t.emoji}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                          <span style={{fontSize:11,fontWeight:700,color:t.color}}>{t.label}</span>
                          {a.monto!=null&&<span style={{fontSize:11,fontWeight:700,color:'#D97706'}}>${parseFloat(a.monto).toLocaleString('es-MX')} MXN</span>}
                          {esHoy&&<span style={{fontSize:9,padding:'1px 6px',borderRadius:20,background:'var(--win-accent)',color:'white',fontWeight:700}}>HOY</span>}
                        </div>
                        {a.nota&&<div style={{fontSize:11,color:'var(--win-text)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.nota}</div>}
                        <div style={{fontSize:9,color:'var(--win-muted)',marginTop:2}}>{new Date(a.ts).toLocaleString('es-MX',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
                      </div>
                      <button onClick={()=>eliminarAccion(a.id)} title="Eliminar" style={{padding:'3px 7px',borderRadius:5,border:'1px solid var(--win-border)',background:'none',color:'var(--win-muted)',fontSize:10,cursor:'pointer',flexShrink:0}}>✕</button>
                    </div>
                  )
                })
            }
          </div>
        )}
      </div>

      {/* Acciones footer */}
      <div style={{display:'flex',gap:8,marginTop:12,justifyContent:'flex-end',flexWrap:'wrap'}}>
        <button onClick={()=>{setMetasTemp({...data.metas});setEditando(true)}} style={{padding:'7px 14px',borderRadius:8,border:'1px solid var(--win-border)',background:'var(--win-surface)',color:'var(--win-text)',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>✏️ Editar metas</button>
        <button onClick={resetSemana} style={{padding:'7px 14px',borderRadius:8,border:'1px solid var(--win-border)',background:'var(--win-surface)',color:'var(--win-red)',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Resetear progreso</button>
      </div>

      {/* Modal editar metas */}
      {editando&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setEditando(false)}>
          <div style={{...S.card,width:'100%',maxWidth:370,padding:24}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:15,fontWeight:700,color:'var(--win-title)',marginBottom:16}}>Metas de la semana</div>
            {[
              {key:'prospectos',   label:'Prospectos a contactar', emoji:'👤'},
              {key:'afiliaciones', label:'Afiliaciones a cerrar',   emoji:'🤝'},
              {key:'publicaciones',label:'Publicaciones en redes',  emoji:'📱'},
              {key:'ventas',       label:'Ventas objetivo (MXN)',   emoji:'💰'},
            ].map(f=>(
              <div key={f.key} style={{marginBottom:12}}>
                <label style={{fontSize:11,fontWeight:600,color:'var(--win-muted)',display:'block',marginBottom:4}}>{f.emoji} {f.label}</label>
                <input type="number" value={metasTemp[f.key]} onChange={e=>setMetasTemp(m=>({...m,[f.key]:parseFloat(e.target.value)||0}))} style={{width:'100%',boxSizing:'border-box',padding:'8px 12px',borderRadius:8,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-text)',fontSize:13,fontFamily:'inherit',outline:'none'}}/>
              </div>
            ))}
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button onClick={()=>setEditando(false)} style={{flex:1,padding:'9px',borderRadius:8,border:'1px solid var(--win-border)',background:'none',color:'var(--win-text)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Cancelar</button>
              <button onClick={guardarMetas} style={{flex:1,padding:'9px',borderRadius:8,border:'none',background:'var(--win-accent)',color:'white',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


window.PanelSemana = PanelSemana
