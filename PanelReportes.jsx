const { useState, useRef, useCallback, useEffect, useMemo } = React
let getRango, esOroPlus, valorPuntoDe, computeFrontalesOro, buildTree, getInitials, RankBadge, RANGO_IMG, TC_FALLBACK, Icons, S, parseWorkbookFile, MESES_ES, MESES_CORTO

function useExternal(name) {
  const [v, setV] = useState(() => (typeof window !== 'undefined' ? window[name] : undefined))
  useEffect(() => {
    if (v) return
    const id = setInterval(() => { if (window[name]) { setV(() => window[name]); clearInterval(id) } }, 30)
    return () => clearInterval(id)
  }, [v, name])
  return v
}

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
  ;({ getRango, esOroPlus, valorPuntoDe, computeFrontalesOro, buildTree, getInitials, RankBadge, RANGO_IMG, TC_FALLBACK, Icons, S, parseWorkbookFile, MESES_ES, MESES_CORTO } = window)
  const GenealogiaNodo = useExternal('GenealogiaNodo')
  const fileRef = useRef()
  const [pendiente, setPendiente] = useState(null)
  const [pMes, setPMes] = useState(new Date().getMonth()+1)
  const [pAnio, setPAnio] = useState(new Date().getFullYear())
  const [vista, setVista] = useState('resumen')
  const [fichaQ, setFichaQ] = useState('')
  const [fichaEin, setFichaEin] = useState(null)
  const [resumeQ, setResumeQ] = useState('')
  const [resumeEin, setResumeEin] = useState(null)
  const [resumeTipIdx, setResumeTipIdx] = useState(null)
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

  const procesarMultipleFiles = async (files) => {
    for (const file of files) {
      try {
        const afs = await parseWorkbookFile(file)
        const mes = detectarMesDeNombre(file.name)
        const año = detectarAnioDeNombre(file.name)
        onAgregarPeriodo({
          id: `${año}-${String(mes).padStart(2,'0')}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
          nombre: file.name,
          afiliados: computeFrontalesOro(afs),
          mes, año,
          label: `${MESES_CORTO[mes-1]} ${año}`,
          labelLargo: `${MESES_ES[mes-1]} ${año}`,
          fecha: new Date().toLocaleDateString('es-MX')
        })
      } catch(e) { console.error('Error al cargar período:', file.name, e) }
    }
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
        <input ref={fileRef} type="file" accept=".xlsx,.xls" multiple style={{display:'none'}} onChange={e=>{const fs=Array.from(e.target.files||[]);if(fs.length===0)return;fs.length===1?procesarFile(fs[0]):(procesarMultipleFiles(fs),e.target.value='')}}/>
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
          <input ref={fileRef} type="file" accept=".xlsx,.xls" multiple style={{display:'none'}} onChange={e=>{const fs=Array.from(e.target.files||[]);if(fs.length===0)return;fs.length===1?procesarFile(fs[0]):(procesarMultipleFiles(fs),e.target.value='')}}/>
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
          {/* Sumatorias acumuladas multi-periodo */}
          {ordenados.length >= 2 && (() => {
            const tcVal = tc || TC_FALLBACK
            const acumPP = ordenados.reduce((s,p) => s + computePeriodStats(p.afiliados).totalPP, 0)
            const acumPG = ordenados.reduce((s,p) => s + computePeriodStats(p.afiliados).totalPG, 0)
            const acumMXN = ordenados.reduce((s,p) => s + p.afiliados.reduce((ss,a) => ss + (a.pp||0)*valorPuntoDe(getRango(a.rango).id), 0), 0)
            const promPP = Math.round(acumPP / ordenados.length)
            const promPG = Math.round(acumPG / ordenados.length)
            return (
              <div style={{...S.card, padding:'14px 16px', marginBottom:14, background:'linear-gradient(135deg,var(--win-surface) 60%,var(--win-surface2))'}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:'.07em',color:'var(--win-muted)',marginBottom:10}}>
                  ACUMULADO — {ordenados.length} PERIODOS &nbsp;·&nbsp; {ordenados[0].label} → {periodoActual.label}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:12}}>
                  {[
                    {l:'PP acumulado', v:acumPP.toLocaleString(), c:'#3A8FF2'},
                    {l:'PG acumulado', v:acumPG.toLocaleString(), c:'#7C3AED'},
                    {l:'MXN generado', v:`$${Math.round(acumMXN).toLocaleString('es-MX')}`, c:'var(--win-green)'},
                    {l:'PP prom./mes', v:promPP.toLocaleString(), c:'var(--win-accent)'},
                    {l:'PG prom./mes', v:promPG.toLocaleString(), c:'var(--win-purple)'},
                    {l:'USD generado', v:`$${Math.round(acumMXN/tcVal).toLocaleString('en-US')}`, c:'var(--win-cyan)'},
                  ].map(k => (
                    <div key={k.l}>
                      <div style={{fontSize:10,color:'var(--win-muted)',marginBottom:3,lineHeight:1.3}}>{k.l}</div>
                      <div style={{fontSize:17,fontWeight:800,color:k.c,fontVariantNumeric:'tabular-nums',lineHeight:1}}>{k.v}</div>
                    </div>
                  ))}
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
                      <div key={a.ein} style={{borderRadius:10,border:`1.5px solid ${r.color}50`,padding:'14px 16px',background:'var(--win-surface2)'}}>
                        {/* Header con imagen de rango */}
                        <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:12}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:4,flexWrap:'wrap'}}>
                              <span style={{fontWeight:700,color:r.color,fontSize:11,padding:'2px 8px',borderRadius:20,background:r.bg,border:`1px solid ${r.color}30`}}>{r.label}</span>
                              <span style={{fontWeight:700,fontSize:14,color:'var(--win-title)'}}>{a.nombre}</span>
                            </div>
                            <div style={{fontSize:11,color:'var(--win-muted)',marginBottom:8}}>EIN {a.ein} · Gen. {a.gen}{a.telefono?` · ${a.telefono}`:''}</div>
                            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                              {a.telefono && <a href={`https://wa.me/52${a.telefono.toString().replace(/\D/g,'')}`} target='_blank' rel='noopener noreferrer' style={{display:'inline-flex',alignItems:'center',gap:4,padding:'5px 11px',borderRadius:7,background:'#25D36620',color:'#128C7E',fontSize:11,fontWeight:700,textDecoration:'none',border:'1px solid #25D36640'}}>📲 WhatsApp</a>}
                              <button onClick={() => { setResumeEin(null); setResumeQ(''); setResumeTipIdx(null) }} style={{background:'none',border:'1px solid var(--win-border)',borderRadius:7,padding:'5px 11px',fontSize:11,color:'var(--win-muted)',cursor:'pointer',fontFamily:'inherit'}}>✕ Cerrar</button>
                            </div>
                          </div>
                          <div style={{flexShrink:0,textAlign:'center'}}>
                            {RANGO_IMG[r.id]
                              ? <img src={RANGO_IMG[r.id]} alt={r.label} style={{width:72,height:72,objectFit:'contain',display:'block'}}/>
                              : <div style={{width:72,height:72,borderRadius:'50%',background:r.bg,display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${r.color}`,fontSize:20,fontWeight:800,color:r.color}}>{getInitials(a.nombre)}</div>
                            }
                            <div style={{fontSize:9,color:r.color,fontWeight:700,marginTop:3}}>{r.label}</div>
                          </div>
                        </div>
                        {ordenados.length >= 2 ? (
                          <>
                            <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'80px',overflow:'visible',display:'block',marginBottom:4}} onMouseLeave={() => setResumeTipIdx(null)}>
                              {[0,0.5,1].map((t,gi) => <line key={gi} x1={0} x2={W} y1={yOf(maxAll*t)} y2={yOf(maxAll*t)} stroke='var(--win-border)' strokeWidth={0.6} strokeDasharray={gi===0?'none':'3,3'}/>)}
                              <path d={areaPP} fill={r.color} fillOpacity={0.09}/>
                              <path d={linePP} fill='none' stroke={r.color} strokeWidth={2} strokeLinejoin='round'/>
                              <path d={linePG} fill='none' stroke='#7C3AED' strokeWidth={1.3} strokeLinejoin='round' strokeDasharray='4,2'/>
                              {ordenados.map((p,i) => {
                                const af = p.afiliados.find(x=>x.ein===a.ein)
                                const pp = af?.pp||0, pg = af?.pg||0
                                const x = parseFloat(xOf(i).toFixed(1))
                                const isTip = resumeTipIdx === i
                                const tipX = Math.min(Math.max(x, 44), W-44)
                                return (
                                  <g key={i} onMouseEnter={() => setResumeTipIdx(i)} style={{cursor:'default'}}>
                                    <rect x={i===0?0:xOf(i-1)+(x-xOf(i-1))/2} y={0} width={i===ordenados.length-1?W-x:x+( i<ordenados.length-1?(xOf(i+1)-x)/2:0)} height={H} fill='transparent'/>
                                    <circle cx={x} cy={yOf(pp)} r={isTip?4.5:3} fill={r.color} style={{transition:'r .1s'}}/>
                                    <circle cx={x} cy={yOf(pg)} r={isTip?3.5:2} fill='#7C3AED' style={{transition:'r .1s'}}/>
                                    <text x={x} y={H-2} textAnchor='middle' fontSize='7' fill={isTip?'var(--win-text)':'var(--win-muted)'} fontWeight={isTip?'700':'400'}>{p.label.slice(0,6)}</text>
                                    {isTip && (
                                      <g transform={`translate(${tipX},${4})`}>
                                        <rect x={-44} y={-2} width={88} height={54} rx={6} fill='var(--win-surface)' stroke={r.color} strokeWidth={0.8} strokeOpacity={0.5}/>
                                        <text x={0} y={11} textAnchor='middle' fontSize={8.5} fontWeight='700' fill='var(--win-text)'>{p.label}</text>
                                        <line x1={-38} x2={38} y1={15} y2={15} stroke='var(--win-border)' strokeWidth={0.6}/>
                                        <circle cx={-30} cy={24} r={3} fill={r.color}/>
                                        <text x={-24} y={28} fontSize={8} fill='var(--win-text)'>PP</text>
                                        <text x={36} y={28} textAnchor='end' fontSize={8} fontWeight='700' fill={r.color}>{pp.toLocaleString()}</text>
                                        <circle cx={-30} cy={36} r={3} fill='#7C3AED'/>
                                        <text x={-24} y={40} fontSize={8} fill='var(--win-text)'>PG</text>
                                        <text x={36} y={40} textAnchor='end' fontSize={8} fontWeight='700' fill='#7C3AED'>{pg.toLocaleString()}</text>
                                        <line x1={-38} x2={38} y1={44} y2={44} stroke='var(--win-border)' strokeWidth={0.5}/>
                                        <text x={36} y={51} textAnchor='end' fontSize={7.5} fill='var(--win-muted)'>Total {(pp+pg).toLocaleString()}</text>
                                      </g>
                                    )}
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
        </div>
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
                  <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:10,paddingBottom:4}}>
                    {todosRangosArr.map(r => {
                      const sel = selSet.has(r.id)
                      const cnt = periodoActual.afiliados.filter(a => getRango(a.rango).id === r.id).length
                      return (
                        <label key={r.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer',userSelect:'none',opacity:sel?1:0.45,transition:'.15s'}}>
                          {RANGO_IMG[r.id]
                            ? <img src={RANGO_IMG[r.id]} alt={r.label} style={{width:38,height:38,objectFit:'contain'}}/>
                            : <div style={{width:38,height:38,borderRadius:'50%',background:r.bg,border:`2px solid ${r.color}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:r.color}}>{r.label[0]}</div>}
                          <span style={{background:r.bg,color:r.color,padding:'2px 7px',borderRadius:20,fontSize:10,fontWeight:600,whiteSpace:'nowrap'}}>{r.label}</span>
                          <span style={{fontSize:9,color:'var(--win-muted)'}}>{cnt} personas</span>
                          <input type="checkbox" checked={sel} onChange={()=>toggleRF(r.id)} style={{cursor:'pointer',accentColor:r.color}}/>
                        </label>
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

                {/* 2 — Árbol visual por rango (reusa GenealogiaNodo) */}
                {(() => {
                  const treeRango = buildTree(periodoActual.afiliados)
                  const pasaFiltroRango = (n) => selSet.has(getRango(n.rango).id)
                  const raicesVisibles = treeRango.filter(pasaFiltroRango)
                  return (
                    <div style={S.card}>
                      <div style={{...S.cardHeader,marginBottom:8}}>
                        <span style={{fontSize:15}}>🌐</span>
                        <span style={S.cardTitle}>Árbol de Red — Vista Visual</span>
                        <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>{filtrados.length} afiliados · scroll horizontal</span>
                      </div>
                      <div style={{overflowX:'auto',overflowY:'auto',maxHeight:520,padding:'16px 20px'}}>
                        <div style={{display:'flex',gap:8,minWidth:'max-content',alignItems:'flex-start',justifyContent:'center'}}>
                          {raicesVisibles.length > 0
                            ? raicesVisibles.map(n => (
                                <GenealogiaNodo key={n.ein} nodo={n} depth={0}
                                  pasaFiltro={pasaFiltroRango}
                                  onHover={null} onLeave={null} onSelect={null} selectedEin={null}/>
                              ))
                            : <div style={{color:'var(--win-muted)',fontSize:13,padding:24}}>Sin afiliados con los rangos seleccionados.</div>}
                        </div>
                      </div>
                    </div>
                  )
                })()}

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
  )
}


window.PanelReportes = PanelReportes
