const { useState, useRef, useCallback, useEffect, useMemo } = React
let getRango, valorPuntoDe, buildTree, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, S

// ── Panel Árbol: tarjetas visuales con brillo por rango + panel de detalle ──
function fmtFechaArbol(v) {
  if (v == null || v === '') return '—'
  if (v instanceof Date) return isNaN(v.getTime()) ? '—' : v.toLocaleDateString('es-MX')
  if (typeof v === 'number') {
    const d = new Date(Math.round((v - 25569) * 86400 * 1000))
    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('es-MX')
  }
  return String(v)
}

function contarDescendientesFlat(ein, afiliados) {
  const directos = (afiliados||[]).filter(a=>a.einPresentador===ein)
  return directos.reduce((acc,d)=>acc+1+contarDescendientesFlat(d.ein, afiliados), 0)
}

function historialPP(ein, periodos) {
  if (!periodos || periodos.length < 2) return []
  const ordenados = [...periodos].sort((a,b)=>(a.año-b.año)||(a.mes-b.mes))
  return ordenados.slice(-6).map(p=>{
    const a = (p.afiliados||[]).find(x=>x.ein===ein)
    return { m: p.label || p.labelLargo || '', pts: a ? (a.pp||0) : 0 }
  })
}

function ArbolSparkline({ data, color }) {
  const w = 280, h = 70, pad = 6
  const values = data.map(d=>d.pts)
  const max = Math.max(...values), min = Math.min(...values)
  const range = (max - min) || 1
  const step = (w - pad*2) / Math.max(data.length - 1, 1)
  const points = data.map((d,i)=>({ x: pad + i*step, y: pad + (h-pad*2)*(1-(d.pts-min)/range), ...d }))
  const linePath = points.map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length-1].x} ${h-pad} L ${points[0].x} ${h-pad} Z`
  const gradId = `arbol-spark-${color.replace('#','')}`
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:'block'}}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35}/>
          <stop offset="100%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`}/>
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
      {points.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={i===points.length-1?3:2} fill={color}/>)}
    </svg>
  )
}

function ArbolTarjeta({ nodo, onSelect, onGenealogia, isMobile }) {
  const r = getRango(nodo.rango)
  const activo = (nodo.pp + nodo.pg) > 0
  const esOro = r.id.includes('ORO')||r.id==='PLATINO'||r.id.includes('DIAMANTE')
  return (
    <div
      onClick={()=>onSelect(nodo)}
      role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&onSelect(nodo)}
      style={{
        width: isMobile?148:172, borderRadius:12, background:'var(--win-surface)',
        border:`1px solid ${esOro?r.color+'55':'var(--win-border)'}`,
        boxShadow: esOro ? `0 0 0 1px ${r.color}33, 0 6px 18px -6px ${r.color}55` : '0 1px 3px rgba(0,0,0,.08)',
        opacity: activo?1:0.6, cursor:'pointer', overflow:'hidden', flexShrink:0, transition:'transform .12s ease'
      }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(0.97)'}
      onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
    >
      <div style={{height:4,background:r.color}}/>
      <div style={{padding:'12px 10px 8px',position:'relative'}}>
        {onGenealogia && (
          <button title="Ver genealogía desde este afiliado" onClick={e=>{e.stopPropagation(); onGenealogia(nodo.ein)}}
            style={{position:'absolute',top:8,right:8,width:22,height:22,border:'none',borderRadius:6,background:'var(--win-surface2)',color:'var(--win-accent)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
            <div style={{width:12,height:12}}><Icons.GitBranch/></div>
          </button>
        )}
        <div style={{width:40,height:40,borderRadius:'50%',margin:'0 auto 8px',background:r.bg,border:`1px solid ${r.color}44`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:esOro?`0 0 10px ${r.color}55`:'none',overflow:'hidden'}}>
          {RANGO_IMG[r.id] ? <img src={RANGO_IMG[r.id]} alt={r.label} style={{width:34,height:34,objectFit:'contain'}}/> : <span style={{fontSize:12,fontWeight:700,color:r.color}}>{getInitials(nodo.nombre)}</span>}
        </div>
        <div style={{fontSize:12,fontWeight:700,color:'var(--win-title)',textAlign:'center',lineHeight:1.25,marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{nodo.nombre.split(' ').slice(0,2).join(' ')}</div>
        <div style={{fontSize:10,color:r.color,textAlign:'center',fontWeight:700,marginBottom:6}}>{r.label}</div>
        <div style={{display:'flex',justifyContent:'center',gap:8,fontSize:10,color:'var(--win-muted)'}}>
          <span><b style={{color:'var(--win-gold)'}}>{nodo.pp}</b> PP</span>
          {nodo.pg>0 && <span><b style={{color:'#7C3AED'}}>{nodo.pg}</b> PG</span>}
        </div>
      </div>
    </div>
  )
}

function ArbolRama({ nodo, depth, onSelect, onGenealogia, isMobile }) {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = (nodo.children||[]).length > 0
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
      <ArbolTarjeta nodo={nodo} onSelect={onSelect} onGenealogia={onGenealogia} isMobile={isMobile}/>
      {hasChildren && (
        <div style={{position:'relative',width:2,height:26,background:'var(--win-link)',boxShadow:'var(--win-link-glow)'}}>
          <button
            onClick={()=>setExpanded(e=>!e)}
            title={expanded ? 'Contraer rama' : `Expandir rama (${nodo.children.length})`}
            style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:26,height:26,borderRadius:'50%',border:'1px solid var(--win-border)',background:'var(--win-surface)',color:'var(--win-accent)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 2px 6px rgba(0,0,0,.3)',padding:0,zIndex:2}}>
            <div style={{width:13,height:13,transform:expanded?'rotate(180deg)':'none',transition:'transform .15s'}}><Icons.ChevDown/></div>
          </button>
        </div>
      )}
      {hasChildren && expanded && (
        <>
          <div style={{position:'relative',display:'flex',gap:isMobile?16:24}}>
            {nodo.children.length>1 && (
              <div style={{position:'absolute',top:0,left:isMobile?70:82,right:isMobile?70:82,height:2,background:'var(--win-link)',boxShadow:'var(--win-link-glow)'}}/>
            )}
            {nodo.children.map(c=>(
              <div key={c.ein} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div style={{width:2,height:18,background:'var(--win-link)',boxShadow:'var(--win-link-glow)'}}/>
                <ArbolRama nodo={c} depth={depth+1} onSelect={onSelect} onGenealogia={onGenealogia} isMobile={isMobile}/>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ArbolDetalle({ nodo, afiliados, periodos, onClose, onGenealogia }) {
  if (!nodo) return null
  const r = getRango(nodo.rango)
  const activo = (nodo.pp + nodo.pg) > 0
  const directos = (afiliados||[]).filter(a=>a.einPresentador===nodo.ein).length
  const total = contarDescendientesFlat(nodo.ein, afiliados||[])
  const historial = historialPP(nodo.ein, periodos)
  const fecha = fmtFechaArbol(nodo.fechaRegistro || nodo.fechaContrato)

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(10,14,24,.55)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:440,background:'var(--win-surface)',borderTopLeftRadius:18,borderTopRightRadius:18,border:'1px solid var(--win-border)',borderBottom:'none',padding:'16px 20px 26px',maxHeight:'86vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{background:'var(--win-surface2)',border:'none',borderRadius:'50%',width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--win-muted)',cursor:'pointer',padding:0}}>
            <div style={{width:12,height:12}}><Icons.X/></div>
          </button>
        </div>

        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:-4,marginBottom:16}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:r.bg,border:`2px solid ${r.color}`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8,overflow:'hidden'}}>
            {RANGO_IMG[r.id] ? <img src={RANGO_IMG[r.id]} alt={r.label} style={{width:48,height:48,objectFit:'contain'}}/> : <span style={{fontSize:16,fontWeight:700,color:r.color}}>{getInitials(nodo.nombre)}</span>}
          </div>
          <div style={{fontSize:16,fontWeight:700,color:'var(--win-title)',textAlign:'center'}}>{nodo.nombre}</div>
          <div style={{display:'flex',gap:6,marginTop:6,alignItems:'center'}}>
            <RankBadge rangoStr={nodo.rango}/>
            <span style={{fontSize:10,padding:'2px 9px',borderRadius:20,background:'var(--win-surface2)',color:activo?'var(--win-green)':'var(--win-muted)',fontWeight:700}}>{activo?'Activo':'Inactivo'}</span>
          </div>
        </div>

        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {[
            { label:'PP', value:nodo.pp, color:'var(--win-gold)' },
            { label:'PG', value:nodo.pg, color:'#7C3AED' },
            { label:'Directos', value:directos, color:'var(--win-accent)' },
            { label:'Ramif.', value:total, color:'var(--win-green)' },
          ].map(x=>(
            <div key={x.label} style={{flex:1,textAlign:'center',padding:'10px 4px',borderRadius:10,background:'var(--win-surface2)',border:'1px solid var(--win-border)'}}>
              <div style={{fontSize:16,fontWeight:800,color:x.color,fontVariantNumeric:'tabular-nums'}}>{(x.value||0).toLocaleString()}</div>
              <div style={{fontSize:9,color:'var(--win-muted)',fontWeight:600,marginTop:2}}>{x.label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column'}}>
          {[
            { label:'N° de afiliado', value:nodo.ein },
            { label:'Teléfono', value:nodo.telefono || '—' },
            { label:'Ubicación', value:[nodo.ciudad,nodo.estado].filter(Boolean).join(', ') || '—' },
            { label:'Afiliado desde', value:fecha },
            { label:'Presentador', value:nodo.presentador || '—' },
          ].map((row,i,arr)=>(
            <div key={row.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 2px',borderBottom:i<arr.length-1?'1px solid var(--win-border)':'none'}}>
              <span style={{fontSize:12,color:'var(--win-muted)'}}>{row.label}</span>
              <span style={{fontSize:12.5,fontWeight:600,color:'var(--win-title)',textAlign:'right',maxWidth:'60%'}}>{row.value}</span>
            </div>
          ))}
        </div>

        {historial.length >= 2 && (
          <div style={{marginTop:16}}>
            <div style={{fontSize:11,color:'var(--win-muted)',fontWeight:700,marginBottom:6}}>Evolución de PP · últimos {historial.length} periodos</div>
            <div style={{background:'var(--win-surface2)',border:'1px solid var(--win-border)',borderRadius:10,padding:'10px 8px 4px'}}>
              <ArbolSparkline data={historial} color={r.color}/>
              <div style={{display:'flex',justifyContent:'space-between',padding:'0 4px 4px'}}>
                {historial.map((d,i)=><span key={i} style={{fontSize:9,color:'var(--win-muted)'}}>{d.m}</span>)}
              </div>
            </div>
          </div>
        )}

        {onGenealogia && (
          <button onClick={()=>{onGenealogia(nodo.ein); onClose()}} style={{width:'100%',marginTop:18,padding:'11px',borderRadius:10,background:'var(--win-accent)',color:'#fff',border:'none',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <div style={{width:15,height:15}}><Icons.GitBranch/></div>
            Ver genealogía completa
          </button>
        )}
      </div>
    </div>
  )
}

function PanelArbol({ afiliados, onGenealogia, periodos }) {
  ;({ getRango, valorPuntoDe, buildTree, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, S } = window)
  const isMobile = useIsMobile()
  const [q, setQ] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
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
          {!q && <span style={{marginLeft:'auto',fontSize:11,color:'var(--win-muted)'}}>{afiliados.length} afiliados · clic en una tarjeta para ver el detalle</span>}
        </div>
        <div style={{...S.cardBody, overflowX:'auto', padding: q ? S.cardBody.padding : '28px 16px'}}>
          {q ? filtrados.map(a=>{
            const r = getRango(a.rango)
            return (
              <div key={a.ein} onClick={()=>setSeleccionado(a)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid var(--win-border)',cursor:'pointer'}}>
                <div style={{width:30,height:30,borderRadius:'50%',background:r.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>{RANGO_IMG[r.id]?<img src={RANGO_IMG[r.id]} alt='' style={{width:26,height:26,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:r.color}}>{getInitials(a.nombre)}</span>}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:'var(--win-title)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.nombre}</div><div style={{fontSize:11,color:'var(--win-muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>EIN {a.ein} · Gen. {a.gen} · {a.ciudad}</div></div>
                {onGenealogia && (
                  <button
                    title="Ver genealogía desde este afiliado"
                    onClick={e=>{e.stopPropagation(); onGenealogia(a.ein)}}
                    style={{display:'flex',alignItems:'center',justifyContent:'center',width:isMobile?34:30,height:isMobile?34:30,borderRadius:6,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-accent)',cursor:'pointer',flexShrink:0,padding:0}}>
                    <div style={{width:15,height:15}}><Icons.GitBranch/></div>
                  </button>
                )}
                {!isMobile && <RankBadge rangoStr={a.rango}/>}
                <div style={{fontWeight:700,color:'var(--win-gold)',fontSize:12,flexShrink:0}}>{a.pp} PP</div>
              </div>
            )
          }) : (
            <div style={{display:'flex',justifyContent:'center'}}>
              <div style={{display:'flex',flexDirection:'column',gap:28}}>
                {tree.map(n=><ArbolRama key={n.ein} nodo={n} depth={0} onSelect={setSeleccionado} onGenealogia={onGenealogia} isMobile={isMobile}/>)}
              </div>
            </div>
          )}
        </div>
      </div>
      <ArbolDetalle nodo={seleccionado} afiliados={afiliados} periodos={periodos} onClose={()=>setSeleccionado(null)} onGenealogia={onGenealogia}/>
    </div>
  )
}

// ── Panel Genealogía: árbol visual ramificado (bolitas compactas) ──
function GenealogiaNodo({ nodo, depth=0, onHover, onLeave, pasaFiltro, onSelect, selectedEin }) {
  ;({ getRango, valorPuntoDe, buildTree, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, S } = window)
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

function PanelGenealogia({ afiliados, rootEin, onChangeRoot, tc, periodos }) {
  ;({ getRango, valorPuntoDe, buildTree, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, S } = window)
  const isMobile = useIsMobile()
  const tree = buildTree(afiliados)
  const [q, setQ] = useState('')
  const [drop, setDrop] = useState(false)
  const [tooltip, setTooltip] = useState(null)
  const [descargando, setDescargando] = useState(false)
  const descargarArbol = async (raiz, pasaFiltro, extra) => {
    setDescargando(true)
    try {
      await window.exportTreeReport(raiz, pasaFiltro, extra)
    } catch (e) {
      console.error(e)
      alert('No se pudo generar el árbol.\n\nDetalle técnico (compártelo para poder arreglarlo):\n' + (e && (e.stack || e.message) ? (e.stack || e.message) : String(e)))
    } finally {
      setDescargando(false)
    }
  }
  const [seleccionado, setSeleccionado] = useState(null)
  const [zoom, setZoom] = useState(() => isMobile ? 0.6 : 1)
  const [history, setHistory] = useState([]) // pila de EINs anteriores
  const scrollRef = useRef(null)
  const [filtroRangos, setFiltroRangos] = useState(() => new Set(RANGOS_FILTRO_GEN.map(x => x.id)))
  const toggleFiltro = (id) => setFiltroRangos(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const [filtroActividad, setFiltroActividad] = useState(() => new Set(['activo', 'inactivo']))
  const toggleActividad = (id) => setFiltroActividad(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const esActivo = (n) => ((n.pp || 0) + (n.pg || 0)) > 0
  const pasaFiltro = (n) => filtroRangos.has(bucketRangoGen(getRango(n.rango).id)) && filtroActividad.has(esActivo(n) ? 'activo' : 'inactivo')

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
  const zoomReset = () => setZoom(isMobile ? 0.6 : 1)


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
          <div style={{display:'flex',gap:14,alignItems:'flex-end',marginLeft:isMobile?0:'auto',paddingLeft:isMobile?0:14,borderLeft:isMobile?'none':'1px solid var(--win-border)'}}>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:'.06em',color:'var(--win-muted)',textTransform:'uppercase',alignSelf:'center'}}>Actividad:</span>
            {[
              { id:'activo', label:'Con puntos', color:'#16A34A', relleno:true },
              { id:'inactivo', label:'Sin puntos', color:'#9CA3AF', relleno:false },
            ].map(f => {
              const checked = filtroActividad.has(f.id)
              return (
                <label key={f.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,cursor:'pointer',userSelect:'none',opacity:checked?1:0.5}}>
                  <div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div style={{width:15,height:15,borderRadius:'50%',background:f.relleno?f.color:'transparent',border:`2px solid ${f.color}`}}/>
                  </div>
                  <span style={{background:f.color+'22',color:f.color,padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:600,whiteSpace:'nowrap'}}>{f.label}</span>
                  <input type="checkbox" checked={checked} onChange={()=>toggleActividad(f.id)} style={{cursor:'pointer',accentColor:f.color}}/>
                </label>
              )
            })}
          </div>
        </div>
      </div>
      <div style={S.card}>
        <div style={{...S.cardHeader, flexWrap: isMobile ? 'wrap' : 'nowrap'}}>
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
          <span style={{...S.cardTitle, ...(isMobile ? {order:1, width:'100%', marginTop:6} : {})}}>{raiz ? `Ramificaciones de ${raiz.nombre}` : 'Ramificaciones'}</span>
          <div style={{marginLeft: isMobile ? 0 : 'auto',display:'flex',alignItems:'center',gap:6}}>
            <button onClick={zoomOut} title="Alejar" style={{width:isMobile?36:28,height:isMobile?36:28,border:'1px solid var(--win-border)',borderRadius:6,background:'var(--win-surface2)',cursor:'pointer',fontSize:16,fontWeight:700,color:'var(--win-title)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>−</button>
            <button onClick={zoomReset} title="Restablecer zoom" style={{minWidth:50,height:isMobile?36:28,padding:'0 8px',border:'1px solid var(--win-border)',borderRadius:6,background:'var(--win-surface2)',cursor:'pointer',fontSize:11,fontWeight:600,color:'var(--win-title)',fontVariantNumeric:'tabular-nums',flexShrink:0}}>{Math.round(zoom*100)}%</button>
            <button onClick={zoomIn} title="Acercar" style={{width:isMobile?36:28,height:isMobile?36:28,border:'1px solid var(--win-border)',borderRadius:6,background:'var(--win-surface2)',cursor:'pointer',fontSize:16,fontWeight:700,color:'var(--win-title)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>+</button>
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
          const directos = (raiz.children || []).filter(c => !pasaFiltro || pasaFiltro(c)).length
          const total = countDescendantsFiltrado(raiz, pasaFiltro)
          const pgVis = sumarPGVisible(raiz, pasaFiltro)
          return (
            <>
            <div style={{display:'flex',flexDirection:isMobile?'column':'row',alignItems:isMobile?'stretch':'center',gap:isMobile?12:14,padding:'12px 16px',borderBottom:'1px solid var(--win-border)',background:'var(--win-surface)'}}>
              <div style={{display:'flex',alignItems:'center',gap:14,minWidth:0}}>
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
              </div>
              <div style={{display:'flex',alignItems:'center',gap:isMobile?10:14,fontSize:11,flexWrap:'wrap',marginLeft:isMobile?0:'auto',justifyContent:isMobile?'space-between':'flex-start'}}>
                <div style={{textAlign:'center',padding:isMobile?'6px 12px':'8px 16px',borderRadius:12,background:'linear-gradient(135deg, rgba(124,58,237,.14), rgba(124,58,237,.05))',border:'1.5px solid rgba(124,58,237,.4)',boxShadow:'0 0 0 3px rgba(124,58,237,.07)'}}>
                  <div style={{fontSize:isMobile?18:24,fontWeight:800,color:'#7C3AED',lineHeight:1,fontVariantNumeric:'tabular-nums',letterSpacing:'-.01em'}}>{pgVis.pg.toLocaleString()}</div>
                  <div style={{color:'#7C3AED',fontWeight:700,letterSpacing:'.04em',fontSize:10,marginTop:3,whiteSpace:'nowrap'}}>PG EN EL ÁRBOL</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:700,color:'var(--win-title)'}}>{directos}</div>
                  <div style={{color:'var(--win-muted)',whiteSpace:'nowrap'}}>Directos{filtroRangos.size < RANGOS_FILTRO_GEN.length ? ' *' : ''}</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:700,color:'var(--win-accent)'}}>{total}</div>
                  <div style={{color:'var(--win-muted)',whiteSpace:'nowrap'}}>Total ramificación{filtroRangos.size < RANGOS_FILTRO_GEN.length ? ' *' : ''}</div>
                </div>
                <button onClick={()=>descargarArbol(raiz, pasaFiltro, {pg: pgVis.pg})} disabled={descargando} title="Descargar el árbol visible como imagen" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:isMobile?'9px 12px':'9px 16px',borderRadius:9,background:'var(--win-accent)',border:'none',color:'#fff',fontSize:12.5,fontWeight:600,cursor:descargando?'default':'pointer',fontFamily:'inherit',boxShadow:'0 2px 8px rgba(37,99,235,.35)',whiteSpace:'nowrap',width:isMobile?'100%':'auto',opacity:descargando?0.7:1}}>
                  <div style={{width:15,height:15,flexShrink:0}}>{descargando?'⏳':<Icons.Download/>}</div>
                  {descargando?'Generando…':'Descargar Árbol'}
                </button>
              </div>
            </div>
            {filtroRangos.size < RANGOS_FILTRO_GEN.length && (
              <div style={{padding:'6px 16px',background:'var(--win-surface2)',borderBottom:'1px solid var(--win-border)',fontSize:10.5,color:'var(--win-muted)'}}>
                * Cuenta solo los rangos marcados en "Filtrar rangos" — no el total real de tu red.
              </div>
            )}
          </>
          )
        })()}

        {/* ── Tabla de puntos y valor por nivel ── */}
        {raiz && (() => {
          const tcVal = tc || TC_FALLBACK
          const nivelStats = {}
          const walkNivel = (n, d) => {
            if (d > 0) {
              const rangoId = getRango(n.rango).id
              if (!nivelStats[d]) nivelStats[d] = { personas: 0, activos: 0, pp: 0, pg: 0, mxn: 0 }
              nivelStats[d].personas++
              if (((n.pp || 0) + (n.pg || 0)) > 0) nivelStats[d].activos++
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

              {/* % de actividad por nivel — la señal más importante de duplicación sana */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                {niveles.map(d => {
                  const s = nivelStats[d]
                  const pct = s.personas > 0 ? Math.round(s.activos / s.personas * 100) : 0
                  const color = pct >= 50 ? 'var(--win-green)' : pct >= 25 ? 'var(--win-gold)' : 'var(--win-red)'
                  return (
                    <div key={d} style={{ flex: '1 1 110px', minWidth: 100, background: 'var(--win-surface2)', border: '1px solid var(--win-border)', borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--win-muted)' }}>NIVEL {d}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
                      </div>
                      <div style={{ height: 5, background: 'var(--win-border)', borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
                        <div style={{ width: pct + '%', height: '100%', background: color }} />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--win-muted)' }}>{s.activos} de {s.personas} activos</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--win-muted)', marginBottom: 10, lineHeight: 1.4 }}>
                Los valores en MXN/USD de esta tabla son un <b style={{ color: 'var(--win-text)' }}>estimado de referencia</b> (PP × valor de punto según el rango de cada persona) — no es un cálculo oficial de reembolso de NICE.
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
                onSelect={(n)=>{ setSeleccionado(n); navegarA(n.ein) }}
                onHover={(n,e)=>setTooltip({a:n,x:e.clientX,y:e.clientY})}
                onLeave={()=>setTooltip(null)}/>
            </div>
          )}
        </div>
      </div>

      <ArbolDetalle nodo={seleccionado} afiliados={afiliados} periodos={periodos} onClose={()=>setSeleccionado(null)} onGenealogia={(ein)=>navegarA(ein)}/>

      {tooltip && (
        <div style={{
          position:'fixed',zIndex:999,pointerEvents:'none',
          left:Math.min(tooltip.x+10,window.innerWidth-150),
          top:Math.max(tooltip.y-60,8),
          background:'var(--win-tooltip-bg)',color:'var(--win-tooltip-fg)',
          borderRadius:6,padding:'6px 10px',
          fontSize:10,minWidth:110,maxWidth:160,
          boxShadow:'0 3px 12px rgba(0,0,0,.3)'
        }}>
          <div style={{fontWeight:700,fontSize:11,marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{tooltip.a.nombre}</div>
          <div style={{opacity:.75,marginBottom:2}}>EIN {tooltip.a.ein}</div>
          <div><b style={{color:'var(--win-gold)'}}>{tooltip.a.pp}</b> PP</div>
        </div>
      )}
    </div>
  )
}

function countDescendants(nodo) {
  if (!nodo.children?.length) return 0
  return nodo.children.reduce((acc,c)=>acc+1+countDescendants(c),0)
}

// Igual que countDescendants pero solo cuenta ramas que pasan el filtro de rangos
function countDescendantsFiltrado(nodo, pasaFiltro) {
  const hijos = (nodo.children || []).filter(c => !pasaFiltro || pasaFiltro(c))
  return hijos.reduce((acc,c)=>acc+1+countDescendantsFiltrado(c, pasaFiltro),0)
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
  ;({ getRango, valorPuntoDe, buildTree, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, S } = window)
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


window.PanelArbol = PanelArbol
window.GenealogiaNodo = GenealogiaNodo
window.PanelGenealogia = PanelGenealogia
window.RedVisual = RedVisual
