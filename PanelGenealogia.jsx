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

// Contenido de la ficha de un integrante. Se usa en el panel inferior (celular,
// panel Árbol) y en el panel lateral de Genealogía (computadora).
function FichaContenido({ nodo, afiliados, periodos, onClose, onPlanAccion, acciones = [] }) {
  const r = getRango(nodo.rango)
  const activo = (nodo.pp + nodo.pg) > 0
  const directos = (afiliados||[]).filter(a=>a.einPresentador===nodo.ein).length
  const total = contarDescendientesFlat(nodo.ein, afiliados||[])
  const historial = historialPP(nodo.ein, periodos)
  const fecha = fmtFechaArbol(nodo.fechaRegistro || nodo.fechaContrato)

  return (
    <>
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
            { label:'Equipo total', value:total, color:'var(--win-green)' },
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

        {acciones.map(a => (
          <button key={a.label} onClick={a.onClick} disabled={a.disabled} title={a.title || a.label} style={{width:'100%',marginTop:10,minHeight:44,padding:'10px',borderRadius:10,background:a.primaria?'var(--win-accent)':'var(--win-surface2)',color:a.primaria?'#fff':'var(--win-title)',border:a.primaria?'none':'1px solid var(--win-border)',fontSize:13,fontWeight:700,cursor:a.disabled?'not-allowed':'pointer',opacity:a.disabled?0.5:1,fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {a.icono && <div style={{width:15,height:15}}><a.icono/></div>}
            {a.label}
          </button>
        ))}

        {onPlanAccion && (
          <button onClick={()=>{onPlanAccion(nodo.ein); onClose()}} style={{width:'100%',marginTop:acciones.length?10:18,minHeight:44,padding:'11px',borderRadius:10,background:acciones.length?'var(--win-surface2)':'var(--win-accent)',color:acciones.length?'var(--win-title)':'#fff',border:acciones.length?'1px solid var(--win-border)':'none',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <div style={{width:15,height:15}}><Icons.Plan/></div>
            Plan de Acción
          </button>
        )}
    </>
  )
}

function ArbolDetalle({ nodo, afiliados, periodos, onClose, onPlanAccion, acciones }) {
  if (!nodo) return null
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(10,14,24,.55)',zIndex:450,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:440,background:'var(--win-surface)',borderTopLeftRadius:18,borderTopRightRadius:18,border:'1px solid var(--win-border)',borderBottom:'none',padding:'16px 20px 26px',maxHeight:'86vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'var(--win-surface2)',border:'none',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--win-muted)',cursor:'pointer',padding:0}}>
            <div style={{width:12,height:12}}><Icons.X/></div>
          </button>
        </div>
        <FichaContenido nodo={nodo} afiliados={afiliados} periodos={periodos} onClose={onClose} onPlanAccion={onPlanAccion} acciones={acciones}/>
      </div>
    </div>
  )
}

// Fila indentada (tipo explorador de archivos): mismo contenido que la lista de
// búsqueda, pero anidada por nivel con expandir/contraer — evita el scroll
// horizontal del árbol de tarjetas cuando hay muchos directos en una rama.
function ArbolListaFila({ nodo, depth, onSelect, onGenealogia, isMobile }) {
  const [expanded, setExpanded] = useState(depth < 1)
  const r = getRango(nodo.rango)
  const hijos = nodo.children || []
  const hasKids = hijos.length > 0
  return (
    <>
      <div onClick={()=>onSelect(nodo)} style={{display:'flex',alignItems:'center',gap:8,padding:`9px 12px 9px ${12+depth*20}px`,borderBottom:'1px solid var(--win-border)',cursor:'pointer'}}>
        {hasKids ? (
          <button onClick={e=>{e.stopPropagation(); setExpanded(x=>!x)}} title={expanded?'Contraer':'Expandir'} style={{width:20,height:20,flexShrink:0,border:'none',background:'transparent',color:'var(--win-muted)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
            <div style={{width:11,height:11,transform:expanded?'rotate(180deg)':'rotate(-90deg)',transition:'transform .15s'}}><Icons.ChevDown/></div>
          </button>
        ) : <div style={{width:20,flexShrink:0}}/>}
        <div style={{width:30,height:30,borderRadius:'50%',background:r.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>{RANGO_IMG[r.id]?<img src={RANGO_IMG[r.id]} alt='' style={{width:26,height:26,objectFit:'contain'}}/>:<span style={{fontSize:9,fontWeight:700,color:r.color}}>{getInitials(nodo.nombre)}</span>}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,color:'var(--win-title)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{nodo.nombre}</div>
          <div style={{fontSize:11,color:'var(--win-muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>EIN {nodo.ein} · {r.label}{hasKids?` · ${hijos.length} directo${hijos.length===1?'':'s'}`:''}</div>
        </div>
        {onGenealogia && (
          <button
            title="Ver genealogía desde este afiliado"
            onClick={e=>{e.stopPropagation(); onGenealogia(nodo.ein)}}
            style={{display:'flex',alignItems:'center',justifyContent:'center',width:isMobile?34:30,height:isMobile?34:30,borderRadius:6,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-accent)',cursor:'pointer',flexShrink:0,padding:0}}>
            <div style={{width:15,height:15}}><Icons.GitBranch/></div>
          </button>
        )}
        {!isMobile && <RankBadge rangoStr={nodo.rango}/>}
        <div style={{fontWeight:700,color:'var(--win-gold)',fontSize:12,flexShrink:0}}>{nodo.pp} PP</div>
      </div>
      {hasKids && expanded && hijos.map(c=>(
        <ArbolListaFila key={c.ein} nodo={c} depth={depth+1} onSelect={onSelect} onGenealogia={onGenealogia} isMobile={isMobile}/>
      ))}
    </>
  )
}

function PanelArbol({ afiliados, onGenealogia, onPlanAccion, periodos }) {
  ;({ getRango, valorPuntoDe, buildTree, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, S } = window)
  const isMobile = useIsMobile()
  const [q, setQ] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [vista, setVista] = useState('lista')
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
        <div style={{...S.cardHeader, flexWrap:isMobile?'wrap':'nowrap'}}>
          <span style={S.cardTitle}>{q ? `${filtrados.length} resultados` : 'Árbol de red'}</span>
          {!q && (
            <div style={{display:'flex',gap:4,background:'var(--win-surface2)',border:'1px solid var(--win-border)',borderRadius:8,padding:2}}>
              <button onClick={()=>setVista('lista')} title="Vista en lista — un solo scroll vertical" style={{padding:'5px 10px',borderRadius:6,border:'none',background:vista==='lista'?'var(--win-accent)':'transparent',color:vista==='lista'?'#fff':'var(--win-muted)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>☰ Lista</button>
              <button onClick={()=>setVista('arbol')} title="Vista en árbol — tarjetas ramificadas" style={{padding:'5px 10px',borderRadius:6,border:'none',background:vista==='arbol'?'var(--win-accent)':'transparent',color:vista==='arbol'?'#fff':'var(--win-muted)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>🌳 Árbol</button>
            </div>
          )}
          {!q && <span style={{marginLeft:isMobile?0:'auto',fontSize:11,color:'var(--win-muted)',width:isMobile?'100%':'auto'}}>{afiliados.length} afiliados · clic para ver el detalle</span>}
        </div>
        <div style={{...S.cardBody, overflowX:'auto', padding: q ? S.cardBody.padding : (vista==='lista' ? 0 : '28px 16px')}}>
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
          }) : vista==='lista' ? (
            <div>
              {tree.map(n=><ArbolListaFila key={n.ein} nodo={n} depth={0} onSelect={setSeleccionado} onGenealogia={onGenealogia} isMobile={isMobile}/>)}
            </div>
          ) : (
            <div style={{display:'flex',justifyContent:'center'}}>
              <div style={{display:'flex',flexDirection:'column',gap:28}}>
                {tree.map(n=><ArbolRama key={n.ein} nodo={n} depth={0} onSelect={setSeleccionado} onGenealogia={onGenealogia} isMobile={isMobile}/>)}
              </div>
            </div>
          )}
        </div>
      </div>
      <ArbolDetalle nodo={seleccionado} afiliados={afiliados} periodos={periodos} onClose={()=>setSeleccionado(null)} onPlanAccion={onPlanAccion}/>
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
  const [expanded, setExpanded] = useState(depth < 2)
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
        <div style={{position:'relative',width:2,height:18,background:'var(--win-link)',boxShadow:'var(--win-link-glow)'}}>
          <button
            onClick={e=>{ e.stopPropagation(); setExpanded(x=>!x) }}
            title={expanded ? 'Contraer rama' : `Expandir rama (${hijosFiltrados.length})`}
            style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',minWidth:22,height:20,padding:'0 6px',borderRadius:10,border:'1px solid var(--win-border)',background:'var(--win-surface)',color:'var(--win-accent)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 2px 6px rgba(0,0,0,.25)',fontSize:10,fontWeight:800,zIndex:2,whiteSpace:'nowrap'}}>
            {expanded ? '−' : `+${hijosFiltrados.length}`}
          </button>
        </div>
      )}
      {hasKids && expanded && (
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

// ── Puntos y valor por nivel: una tarjeta por nivel con toda su info junta.
// Se usa dentro de Genealogia (sobre la persona seleccionada) y en Mi Red
// (pantalla de inicio, sobre toda la organizacion) — por eso vive separado
// y se expone en window, en vez de quedar atado al estado de un solo panel.
function NivelesPorRed({ raiz, tc, pasaFiltro, defaultAbierto = true }) {
  ;({ getRango, valorPuntoDe, buildTree, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, S } = window)
  const isMobile = useIsMobile()
  const [mostrarNiveles, setMostrarNiveles] = useState(defaultAbierto)
  if (!raiz) return null
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
  const Row = ({ label, value, color }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
      <span style={{ fontSize: 9.5, color: 'var(--win-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.02em', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
  return (
    <div style={{ ...S.card, marginBottom: 14, padding: '12px 16px' }}>
      <div
        onClick={() => setMostrarNiveles(v => !v)}
        title={mostrarNiveles ? 'Ocultar' : 'Mostrar'}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: mostrarNiveles ? 10 : 0, cursor: 'pointer', userSelect: 'none' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#C47F17', boxShadow: '0 0 6px #C47F17' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--win-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Puntos y valor por nivel</span>
        <span style={{ fontSize: 10, color: 'var(--win-muted)', marginLeft: 4 }}>· TC: ${tcVal.toFixed(2)} MXN/USD</span>
        <div style={{ marginLeft: 'auto', width: 14, height: 14, color: 'var(--win-muted)', transform: mostrarNiveles ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><Icons.ChevDown/></div>
      </div>

      {mostrarNiveles && (
      <>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 20, background: 'var(--win-accent-l)', border: '1px solid var(--win-accent)', marginBottom: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--win-accent)', flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--win-title)' }}>Tu organización llega hasta el Nivel {niveles[niveles.length - 1]}</span>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--win-muted)', marginBottom: 12, lineHeight: 1.4 }}>
        Los valores en MXN/USD de esta tabla son un <b style={{ color: 'var(--win-text)' }}>estimado de referencia</b> (PP × valor de punto según el rango de cada persona) — no es un cálculo oficial de reembolso de NICE.
      </div>
      {/* Una tarjeta por nivel, todas en una sola fila (scroll horizontal en móvil) */}
      <div style={{ display: isMobile ? 'flex' : 'grid', flexWrap: isMobile ? 'nowrap' : undefined, gridTemplateColumns: isMobile ? undefined : `repeat(${niveles.length}, 1fr)`, gap: 10, overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? 4 : 0 }}>
        {niveles.map(d => {
          const s = nivelStats[d]
          const pct = s.personas > 0 ? Math.round(s.activos / s.personas * 100) : 0
          const color = pct >= 50 ? 'var(--win-green)' : pct >= 25 ? 'var(--win-gold)' : 'var(--win-red)'
          return (
            <div key={d} style={{ background: 'var(--win-surface2)', border: '1px solid var(--win-border)', borderRadius: 10, padding: '12px 12px', flexShrink: isMobile ? 0 : undefined, width: isMobile ? 160 : 'auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--win-title)', fontVariantNumeric: 'tabular-nums' }}>Nivel {d}</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', marginBottom: 5 }}>{pct}%</div>
              <div style={{ height: 5, background: 'var(--win-border)', borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
                <div style={{ width: pct + '%', height: '100%', background: color }} />
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--win-muted)', textAlign: 'center', marginBottom: 10 }}>{s.activos} de {s.personas} activos</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, paddingTop: 10, borderTop: '1px solid var(--win-border)' }}>
                <Row label="Personas" value={s.personas} color="var(--win-text)" />
                <Row label="PP" value={s.pp.toLocaleString()} color="var(--win-gold)" />
                <Row label="PG" value={s.pg.toLocaleString()} color="#7C3AED" />
                <Row label="Valor MXN" value={fMXN(s.mxn)} color="#16A34A" />
                <Row label="Valor USD" value={fUSD(s.mxn)} color="var(--win-accent)" />
              </div>
            </div>
          )
        })}
      </div>
      {/* Total de la red — resumen debajo, no forma parte de las tarjetas por nivel */}
      <div style={{ marginTop: 12, background: 'var(--win-accent-l)', border: '1.5px solid var(--win-accent)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--win-title)' }}>Total de la red</span>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginLeft: isMobile ? 0 : 'auto' }}>
          <Row label="Personas" value={tot.personas} color="var(--win-text)" />
          <Row label="PP" value={tot.pp.toLocaleString()} color="var(--win-gold)" />
          <Row label="PG" value={tot.pg.toLocaleString()} color="#7C3AED" />
          <Row label="Valor MXN" value={fMXN(tot.mxn)} color="#16A34A" />
          <Row label="Valor USD" value={fUSD(tot.mxn)} color="var(--win-accent)" />
        </div>
      </div>
      </>
      )}
    </div>
  )
}

// ── Genealogía: lienzo con tarjetas, conectores, pan/zoom, minimapa y ficha ──
const GEN_PAD = 40, GEN_GX = 26, GEN_GY = 70, GEN_PAGINA = 12, GEN_PANEL = 330
const genMedidas = (movil) => movil ? { cw: 190, ch: 126, medalla: 44 } : { cw: 236, ch: 132, medalla: 52 }
const genClampZoom = z => Math.min(2, Math.max(0.25, z))
const GEN_IC = { width: 14, height: 14, display: 'inline-flex', flexShrink: 0 }
const GenIco = {
  Atras: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><polyline points="15 18 9 12 15 6"/></svg>,
  Ajustar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>,
  Completa: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>,
  Salir: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M3 8h5V3M21 8h-5V3M3 16h5v5M21 16h-5v5"/></svg>,
}

// Ruta de nodos desde `origen` hasta el EIN (ambos incluidos), sobre los hijos reales.
function rutaEntre(origen, ein) {
  if (!origen) return null
  if (origen.ein === ein) return [origen]
  for (const c of origen.children || []) {
    const sub = rutaEntre(c, ein)
    if (sub) return [origen, ...sub]
  }
  return null
}

// Acomodo tipo "tidy tree": cada hoja ocupa una tarjeta y cada padre se centra
// sobre sus hijos visibles, así las tarjetas nunca se enciman. Solo recorre las
// ramas abiertas (render progresivo) y pagina los directos de 12 en 12.
function layoutGenealogia(raiz, expandidos, limites, hijosDe, cw, ch) {
  const nodos = [], enlaces = [], toggles = []
  let maxX = 0, maxY = 0
  const colocar = (n, depth, x0) => {
    const y = GEN_PAD + depth * (ch + GEN_GY)
    maxY = Math.max(maxY, y + ch + 34)
    const hijos = hijosDe(n)
    if (!hijos.length || !expandidos.has(n.ein)) {
      const cx = x0 + cw / 2
      nodos.push({ n, x: x0, y, cx })
      if (hijos.length) toggles.push({ ein: n.ein, cx, y: y + ch, abierto: false, total: hijos.length })
      maxX = Math.max(maxX, x0 + cw)
      return { w: cw, cx }
    }
    const vis = hijos.slice(0, limites[n.ein] || GEN_PAGINA)
    const resto = hijos.length - vis.length
    const centros = []
    let x = x0
    vis.forEach((c, i) => {
      if (i > 0) x += GEN_GX
      const r = colocar(c, depth + 1, x)
      centros.push(r.cx)
      x += r.w
    })
    if (resto > 0) {
      x += GEN_GX
      const cxm = x + cw / 2
      nodos.push({ mas: true, padre: n.ein, resto, x, y: y + ch + GEN_GY, cx: cxm })
      centros.push(cxm)
      maxX = Math.max(maxX, x + cw)
      x += cw
    }
    const cx = (centros[0] + centros[centros.length - 1]) / 2
    nodos.push({ n, x: cx - cw / 2, y, cx })
    enlaces.push({ px: cx, py: y + ch, hijos: centros, cy: y + ch + GEN_GY })
    toggles.push({ ein: n.ein, cx, y: y + ch, abierto: true, total: hijos.length })
    return { w: x - x0, cx }
  }
  if (raiz) colocar(raiz, 0, GEN_PAD)
  return { nodos, enlaces, toggles, ancho: maxX + GEN_PAD, alto: maxY + GEN_PAD }
}

// Conector padre → hijo con esquinas redondeadas; las líneas corren por el
// espacio libre entre filas, nunca por encima de una tarjeta.
function genConector(px, py, cx, cy) {
  if (Math.abs(cx - px) < 1) return `M${px} ${py} V${cy}`
  const mid = py + (cy - py) / 2
  const r = Math.min(10, Math.abs(cx - px) / 2, (cy - py) / 4)
  const s = cx > px ? 1 : -1
  return `M${px} ${py} V${mid - r} Q${px} ${mid} ${px + s * r} ${mid} H${cx - s * r} Q${cx} ${mid} ${cx} ${mid + r} V${cy}`
}

function GenBtn({ movil, onClick, title, disabled, activo, children }) {
  return (
    <button onClick={onClick} title={title} aria-label={title} disabled={disabled}
      style={{height:movil?40:32,minWidth:movil?40:32,padding:movil?'0 9px':'0 10px',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,borderRadius:8,border:'1px solid var(--win-border)',background:activo?'var(--win-accent)':'var(--win-surface2)',color:activo?'#fff':'var(--win-title)',fontSize:12,fontWeight:600,cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.45:1,fontFamily:'inherit',whiteSpace:'nowrap',flexShrink:0}}>
      {children}
    </button>
  )
}

function GenTarjeta({ rec, conteo, seleccionada, esRaiz, cw, ch, medalla, onSel, onExplorar }) {
  const n = rec.n
  const r = getRango(n.rango)
  const activo = ((n.pp || 0) + (n.pg || 0)) > 0
  return (
    <div role="button" tabIndex={0} title={n.nombre}
      onClick={() => onSel(n)} onKeyDown={e => { if (e.key === 'Enter') onSel(n) }}
      style={{position:'absolute',left:rec.x,top:rec.y,width:cw,height:ch,boxSizing:'border-box',padding:'10px 12px',borderRadius:14,background:'var(--win-surface)',border:seleccionada?'2px solid var(--win-accent)':esRaiz?'1.5px solid var(--win-accent)':'1px solid var(--win-border)',boxShadow:seleccionada?'0 0 0 4px rgba(59,130,246,.25), 0 10px 24px -10px rgba(0,0,0,.45)':'0 6px 18px -10px rgba(0,0,0,.35)',cursor:'pointer',display:'flex',flexDirection:'column',gap:6,userSelect:'none',WebkitUserSelect:'none'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,minHeight:medalla}}>
        <div style={{position:'relative',width:medalla,height:medalla,borderRadius:'50%',background:r.bg,border:`2px solid ${r.color}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxSizing:'border-box'}}>
          {RANGO_IMG[r.id]
            ? <img src={RANGO_IMG[r.id]} alt={r.label} draggable={false} style={{width:medalla-8,height:medalla-8,objectFit:'contain'}}/>
            : <span style={{fontSize:Math.round(medalla/3.4),fontWeight:700,color:r.color}}>{getInitials(n.nombre)}</span>}
          <span title={activo?'Con puntos este periodo':'Sin puntos este periodo'} style={{position:'absolute',right:-2,bottom:-2,width:11,height:11,borderRadius:'50%',background:activo?'#16A34A':'#9CA3AF',border:'2px solid var(--win-surface)'}}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12.5,fontWeight:700,color:'var(--win-title)',lineHeight:1.22,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',wordBreak:'normal',overflowWrap:'normal',hyphens:'manual'}}>{n.nombre}</div>
          <span style={{display:'inline-block',marginTop:4,padding:'1px 9px',borderRadius:20,background:r.bg,color:r.color,fontSize:10.5,fontWeight:700,whiteSpace:'nowrap'}}>{r.label}</span>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,fontSize:11,color:'var(--win-muted)',whiteSpace:'nowrap'}}>
        <span>Directos: <b style={{color:'var(--win-title)'}}>{conteo.directos}</b></span>
        <span style={{width:1,height:12,background:'var(--win-border)'}}/>
        <span>Equipo: <b style={{color:'var(--win-title)'}}>{conteo.equipo}</b></span>
      </div>
      {!esRaiz && conteo.directos > 0 && (
        <button onClick={e => { e.stopPropagation(); onExplorar(n.ein) }} title={`Ver el equipo de ${n.nombre}`}
          style={{marginTop:'auto',height:26,borderRadius:8,border:'1px solid var(--win-border)',background:'var(--win-surface2)',color:'var(--win-accent)',fontSize:11.5,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          Ver equipo ›
        </button>
      )}
    </div>
  )
}

function GenMinimapa({ layout, vista, vp, cw, ch, selEin, raizEin, w, h, onIr }) {
  const ref = useRef(null)
  const s = Math.min(w / Math.max(layout.ancho, 1), h / Math.max(layout.alto, 1))
  const mover = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const k = rect.width / w || 1
    onIr((e.clientX - rect.left) / k / s, (e.clientY - rect.top) / k / s)
  }
  return (
    <svg ref={ref} width={w} height={h} style={{display:'block',cursor:'pointer',touchAction:'none',borderRadius:6}}
      onPointerDown={e => { e.stopPropagation(); try { e.currentTarget.setPointerCapture(e.pointerId) } catch (_) {} mover(e) }}
      onPointerMove={e => { if (e.buttons) mover(e) }}>
      <rect width={w} height={h} fill="var(--win-surface2)"/>
      {layout.nodos.map((r, i) => (
        <rect key={i} x={r.x * s} y={r.y * s} width={Math.max(2, cw * s)} height={Math.max(2, ch * s)} rx={1.5}
          fill={r.n && r.n.ein === selEin ? 'var(--win-accent)' : r.n && r.n.ein === raizEin ? 'var(--win-gold)' : 'var(--win-border2)'}/>
      ))}
      <rect x={-vista.x / vista.z * s} y={-vista.y / vista.z * s} width={vp.w / vista.z * s} height={vp.h / vista.z * s}
        fill="rgba(59,130,246,.12)" stroke="var(--win-accent)" strokeWidth={1.5}/>
    </svg>
  )
}

function PanelGenealogia({ afiliados, rootEin, onChangeRoot, tc, periodos, onPlanAccion }) {
  ;({ getRango, valorPuntoDe, buildTree, getInitials, useIsMobile, RankBadge, RANGO_IMG, RANGOS, TC_FALLBACK, Icons, S } = window)
  const isMobile = useIsMobile()
  const { cw, ch, medalla } = genMedidas(isMobile)
  const tree = useMemo(() => buildTree(afiliados), [afiliados])
  const nodoPorEin = useMemo(() => {
    const m = new Map()
    const walk = n => { m.set(n.ein, n); (n.children || []).forEach(walk) }
    tree.forEach(walk)
    return m
  }, [tree])
  const principal = tree[0] || null
  const raiz = (rootEin && nodoPorEin.get(rootEin)) || principal

  const [q, setQ] = useState('')
  const [drop, setDrop] = useState(false)
  const [descargando, setDescargando] = useState(false)
  const descargarArbol = async (raizArbol, filtro, extra) => {
    setDescargando(true)
    try {
      await window.exportTreeReport(raizArbol, filtro, extra)
    } catch (e) {
      console.error(e)
      alert('No se pudo generar el árbol.\n\nDetalle técnico (compártelo para poder arreglarlo):\n' + (e && (e.stack || e.message) ? (e.stack || e.message) : String(e)))
    } finally {
      setDescargando(false)
    }
  }
  const [selEin, setSelEin] = useState(null)
  const [ficha, setFicha] = useState(false)
  const [pila, setPila] = useState([]) // raíces anteriores, para "Regresar"
  const [expandidos, setExpandidos] = useState(() => new Set(raiz ? [raiz.ein] : []))
  const [limites, setLimites] = useState({})
  const [vista, setVista] = useState(() => ({ x: 0, y: 0, z: isMobile ? 0.85 : 1 }))
  const [vp, setVp] = useState({ w: 800, h: 500 })
  const [pendiente, setPendiente] = useState(null)
  const [verFiltros, setVerFiltros] = useState(false)
  const [completa, setCompleta] = useState(null)

  const [filtroRangos, setFiltroRangos] = useState(() => new Set(RANGOS_FILTRO_GEN.map(x => x.id)))
  const toggleFiltro = (id) => setFiltroRangos(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const [filtroActividad, setFiltroActividad] = useState(() => new Set(['activo', 'inactivo']))
  const toggleActividad = (id) => setFiltroActividad(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const esActivo = (n) => ((n.pp || 0) + (n.pg || 0)) > 0
  const pasaFiltro = (n) => filtroRangos.has(bucketRangoGen(getRango(n.rango).id)) && filtroActividad.has(esActivo(n) ? 'activo' : 'inactivo')
  const filtrosActivos = filtroRangos.size < RANGOS_FILTRO_GEN.length || filtroActividad.size < 2

  // Directos y equipo de cada integrante con el mismo cálculo de siempre
  // (hijos que pasan el filtro y su descendencia filtrada).
  const conteos = new Map()
  const contar = n => {
    const hs = (n.children || []).filter(pasaFiltro)
    let t = 0
    for (const c of hs) t += 1 + contar(c)
    conteos.set(n.ein, { directos: hs.length, equipo: t })
    return t
  }
  tree.forEach(contar)
  const hijosDe = n => (n.children || []).filter(pasaFiltro)
  const layout = layoutGenealogia(raiz, expandidos, limites, hijosDe, cw, ch)

  const vpRef = useRef(null)
  const contRef = useRef(null)
  const vistaRef = useRef(vista)
  vistaRef.current = vista
  const selNodo = selEin ? nodoPorEin.get(selEin) : null
  const panelAbierto = ficha && !!selNodo && !isMobile
  const anchoVisible = Math.max(200, vp.w - (panelAbierto ? GEN_PANEL : 0))

  useEffect(() => {
    const el = vpRef.current
    if (!el) return
    const medir = () => setVp({ w: el.clientWidth, h: el.clientHeight })
    medir()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', medir)
      return () => window.removeEventListener('resize', medir)
    }
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Al cambiar de raíz: solo sus directos abiertos, salvo que una búsqueda
  // haya preparado qué ramas abrir para llegar a alguien.
  const preparado = useRef(null)
  const raizEin = raiz ? raiz.ein : null
  useEffect(() => {
    if (!raizEin) return
    const p = preparado.current
    preparado.current = null
    setExpandidos(p ? p.expandidos : new Set([raizEin]))
    setLimites(p ? p.limites : {})
    setPendiente(p ? p.pendiente : { ein: raizEin, modo: 'arriba' })
  }, [raizEin])

  useEffect(() => {
    if (!pendiente) return
    const rec = layout.nodos.find(r => r.n && r.n.ein === pendiente.ein)
    setPendiente(null)
    if (!rec) return
    setVista(v => {
      if (pendiente.modo === 'fijo') return { ...v, x: pendiente.sx - rec.cx * v.z, y: pendiente.sy - rec.y * v.z }
      if (pendiente.modo === 'arriba') return { ...v, x: anchoVisible / 2 - rec.cx * v.z, y: 20 - rec.y * v.z }
      const z = Math.max(v.z, 0.8)
      return { z, x: anchoVisible / 2 - rec.cx * z, y: vp.h / 2 - (rec.y + ch / 2) * z }
    })
  }, [pendiente, layout])

  const zoomEn = (f, px, py) => setVista(v => {
    const z = genClampZoom(typeof f === 'function' ? f(v.z) : f)
    const k = z / v.z
    return { z, x: px - (px - v.x) * k, y: py - (py - v.y) * k }
  })
  const zoomBoton = (factor) => zoomEn(z => z * factor, anchoVisible / 2, vp.h / 2)

  // Ctrl/⌘ + rueda (o pellizco en touchpad) hace zoom; la rueda sola sigue
  // desplazando la página, para que nada quede "congelado".
  useEffect(() => {
    const el = vpRef.current
    if (!el) return
    const onWheel = e => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const k = rect.width / el.clientWidth || 1
      zoomEn(z => z * Math.exp(-e.deltaY * 0.0015), (e.clientX - rect.left) / k, (e.clientY - rect.top) / k)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Arrastrar el fondo (mouse o dedo) mueve el mapa; dos dedos hacen zoom.
  // Las coordenadas se corrigen por el zoom de letra de la app (CSS zoom).
  const punteros = useRef(new Map())
  const gesto = useRef(null)
  const arrastro = useRef(false)
  const local = (e) => {
    const el = vpRef.current
    const rect = el.getBoundingClientRect()
    const k = rect.width / el.clientWidth || 1
    return { x: (e.clientX - rect.left) / k, y: (e.clientY - rect.top) / k }
  }
  const iniciarGesto = () => {
    const pts = [...punteros.current.values()]
    const v = vistaRef.current
    if (pts.length >= 2) {
      const [a, b] = pts
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
      gesto.current = { tipo: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: v.z, px: (mx - v.x) / v.z, py: (my - v.y) / v.z }
    } else if (pts.length === 1) {
      gesto.current = { tipo: 'pan', sx: pts[0].x, sy: pts[0].y, vx: v.x, vy: v.y }
    } else {
      gesto.current = null
    }
  }
  const onPointerDown = e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (e.target.closest && e.target.closest('button,input,a,[data-nopan]')) return
    if (punteros.current.size === 0) arrastro.current = false
    punteros.current.set(e.pointerId, local(e))
    iniciarGesto()
  }
  const onPointerMove = e => {
    if (!punteros.current.has(e.pointerId)) return
    punteros.current.set(e.pointerId, local(e))
    const g = gesto.current
    if (!g) return
    if (g.tipo === 'pinch') {
      const [a, b] = [...punteros.current.values()]
      if (!b) return
      const z = genClampZoom(g.z0 * Math.hypot(a.x - b.x, a.y - b.y) / g.d0)
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
      arrastro.current = true
      setVista({ z, x: mx - g.px * z, y: my - g.py * z })
      return
    }
    const p = punteros.current.get(e.pointerId)
    const dx = p.x - g.sx, dy = p.y - g.sy
    if (!arrastro.current) {
      if (Math.hypot(dx, dy) < 6) return
      arrastro.current = true
      try { vpRef.current.setPointerCapture(e.pointerId) } catch (_) {}
    }
    setVista(v => ({ ...v, x: g.vx + dx, y: g.vy + dy }))
  }
  const onPointerUp = e => {
    if (!punteros.current.has(e.pointerId)) return
    punteros.current.delete(e.pointerId)
    iniciarGesto()
  }

  const ajustar = () => {
    const z = Math.min(1.2, genClampZoom(Math.min(anchoVisible / layout.ancho, vp.h / layout.alto) * 0.96))
    setVista({ z, x: (anchoVisible - layout.ancho * z) / 2, y: Math.max(8, (vp.h - layout.alto * z) / 2) })
  }
  const irA = (px, py) => setVista(v => ({ ...v, x: anchoVisible / 2 - px * v.z, y: vp.h / 2 - py * v.z }))

  // Mantiene fija en pantalla la tarjeta tocada mientras el árbol se reacomoda.
  const fijar = (ein) => {
    const rec = layout.nodos.find(r => r.n && r.n.ein === ein)
    if (rec) setPendiente({ ein, modo: 'fijo', sx: rec.cx * vista.z + vista.x, sy: rec.y * vista.z + vista.y })
  }
  const toggleRama = (ein) => {
    fijar(ein)
    setExpandidos(prev => { const n = new Set(prev); n.has(ein) ? n.delete(ein) : n.add(ein); return n })
  }
  const verMas = (padre) => {
    fijar(padre)
    setLimites(l => ({ ...l, [padre]: (l[padre] || GEN_PAGINA) + GEN_PAGINA }))
  }

  // Cambiar la raíz visible no toca los datos: el patrocinador real sigue igual.
  const cambiarRaiz = (ein) => {
    const objetivo = ein && principal && ein === principal.ein ? null : ein
    const objEin = objetivo || (principal && principal.ein)
    if (raiz && objEin === raiz.ein) return false
    setPila(p => [...p, rootEin || null])
    onChangeRoot(objetivo)
    return true
  }
  const regresar = () => {
    if (!pila.length) return
    const prev = pila[pila.length - 1]
    setPila(p => p.slice(0, -1))
    onChangeRoot(prev)
  }
  const irPrincipal = () => {
    if (cambiarRaiz(null) || !raiz) return
    setExpandidos(new Set([raiz.ein]))
    setLimites({})
    setPendiente({ ein: raiz.ein, modo: 'arriba' })
  }
  const explorar = (ein) => { if (ein) cambiarRaiz(ein) }
  const seleccionar = (n) => {
    if (arrastro.current) return
    setSelEin(n.ein)
    setFicha(true)
  }

  // Abre las ramas necesarias para llegar a alguien y lo centra.
  const localizar = (ein, abrirFicha) => {
    if (!nodoPorEin.get(ein) || !principal) return
    let base = raiz
    let ruta = rutaEntre(base, ein)
    let cambia = false
    if (!ruta) { base = principal; ruta = rutaEntre(principal, ein); cambia = true }
    if (!ruta) return
    const filtroOk = ruta.slice(1).every(pasaFiltro)
    if (!filtroOk) {
      setFiltroRangos(new Set(RANGOS_FILTRO_GEN.map(x => x.id)))
      setFiltroActividad(new Set(['activo', 'inactivo']))
    }
    const hijosIdx = n => filtroOk ? (n.children || []).filter(pasaFiltro) : (n.children || [])
    const exp = new Set(cambia ? [] : expandidos)
    const lims = cambia ? {} : { ...limites }
    exp.add(base.ein)
    for (let i = 0; i < ruta.length - 1; i++) {
      const padre = ruta[i], hijo = ruta[i + 1]
      exp.add(padre.ein)
      const idx = hijosIdx(padre).findIndex(h => h.ein === hijo.ein)
      if (idx >= GEN_PAGINA) lims[padre.ein] = Math.max(lims[padre.ein] || GEN_PAGINA, Math.ceil((idx + 1) / GEN_PAGINA) * GEN_PAGINA)
    }
    const pend = { ein, modo: 'centro' }
    setSelEin(ein)
    if (abrirFicha) setFicha(true)
    if (cambia && cambiarRaiz(null)) {
      preparado.current = { expandidos: exp, limites: lims, pendiente: pend }
    } else {
      setExpandidos(exp)
      setLimites(lims)
      setPendiente(pend)
    }
  }

  const sugerencias = q.trim()
    ? afiliados.filter(a =>
        a.nombre.toLowerCase().includes(q.toLowerCase()) ||
        String(a.ein).includes(q.trim())
      ).slice(0, 8)
    : []
  const elegirSugerencia = (a) => {
    setQ(a.nombre)
    setDrop(false)
    localizar(a.ein, true)
  }

  const alternarCompleta = () => {
    if (completa) { setCompleta(null); return }
    const el = contRef.current
    const rect = el.getBoundingClientRect()
    setCompleta({ k: rect.width / el.offsetWidth || 1 })
  }
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Escape') return
      if (completa) setCompleta(null)
      else if (ficha) setFicha(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [completa, ficha])

  const migas = principal && raiz ? (rutaEntre(principal, raiz.ein) || [raiz]) : []
  const accionesFicha = selNodo ? [
    { label: 'Centrar en el árbol', primaria: true, icono: Icons.Target, onClick: () => { if (isMobile) setFicha(false); localizar(selNodo.ein, !isMobile) } },
    { label: 'Explorar equipo', icono: Icons.Tree, disabled: !(conteos.get(selNodo.ein) || {}).directos || (raiz && selNodo.ein === raiz.ein), title: 'Ver a este integrante y su rama como raíz del árbol', onClick: () => { if (isMobile) setFicha(false); explorar(selNodo.ein) } },
  ] : []

  const IC12 = { width: 12, height: 12, display: 'inline-flex' }
  const separador = <span style={{width:1,height:22,background:'var(--win-border)',flexShrink:0}}/>

  return (
    <div ref={contRef} style={completa
      ? { position:'fixed', top:0, left:0, width:`${100 / completa.k}vw`, height:`${100 / completa.k}vh`, zIndex:400, background:'var(--win-bg)', padding:8, boxSizing:'border-box', display:'flex', flexDirection:'column' }
      : undefined}>

      {/* Barra de herramientas: búsqueda, navegación, zoom del árbol */}
      <div data-nopan style={{...S.card, marginBottom: completa ? 8 : 12, flexShrink: 0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',flexWrap:isMobile?'wrap':'nowrap'}}>
          <div style={{position:'relative',flex:isMobile?'1 1 100%':'1 1 240px',maxWidth:isMobile?'none':360,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8,height:isMobile?40:34,padding:'0 10px',border:'1px solid var(--win-border)',borderRadius:8,background:'var(--win-surface2)'}}>
              <div style={{width:14,height:14,color:'var(--win-muted)',flexShrink:0}}><Icons.Search/></div>
              <input
                value={q}
                onChange={e => { setQ(e.target.value); setDrop(true) }}
                onFocus={() => setDrop(true)}
                onBlur={() => setTimeout(() => setDrop(false), 150)}
                placeholder="Buscar integrante por nombre o EIN…"
                style={{flex:1,minWidth:0,border:'none',background:'transparent',fontSize:13,color:'var(--win-text)',fontFamily:'inherit',outline:'none'}}/>
              {q && (
                <button onClick={() => { setQ(''); setDrop(false) }} aria-label="Limpiar búsqueda" style={{border:'none',background:'transparent',color:'var(--win-muted)',cursor:'pointer',fontSize:15,fontWeight:700,padding:'0 2px'}}>×</button>
              )}
            </div>
            {drop && sugerencias.length > 0 && (
              <div style={{position:'absolute',top:'100%',left:0,right:0,marginTop:4,background:'var(--win-surface)',border:'1px solid var(--win-border)',borderRadius:8,boxShadow:'var(--shadow-md)',maxHeight:300,overflowY:'auto',zIndex:60}}>
                {sugerencias.map(a => {
                  const r = getRango(a.rango)
                  return (
                    <div key={a.ein} onMouseDown={() => elegirSugerencia(a)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',cursor:'pointer',borderBottom:'1px solid var(--win-border)'}}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--win-surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{width:30,height:30,borderRadius:'50%',background:r.bg,border:`1.5px solid ${r.color}66`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {RANGO_IMG[r.id] ? <img src={RANGO_IMG[r.id]} alt="" style={{width:26,height:26,objectFit:'contain'}}/> : <span style={{fontSize:10,fontWeight:700,color:r.color}}>{getInitials(a.nombre)}</span>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12.5,fontWeight:600,color:'var(--win-title)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.nombre}</div>
                        <div style={{fontSize:10.5,color:'var(--win-muted)'}}>EIN {a.ein} · {r.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div style={{display:'flex',alignItems:'center',gap:6,overflowX:'auto',flex:isMobile?'1 1 100%':'0 1 auto',marginLeft:isMobile?0:'auto',paddingBottom:isMobile?2:0}}>
            <GenBtn movil={isMobile} title="Regresar a la vista anterior" onClick={regresar} disabled={!pila.length}><span style={GEN_IC}><GenIco.Atras/></span>{!isMobile && 'Regresar'}</GenBtn>
            <GenBtn movil={isMobile} title="Volver al árbol principal (mi red)" onClick={irPrincipal}><span style={GEN_IC}><Icons.Home/></span>{!isMobile && 'Mi red'}</GenBtn>
            {separador}
            <GenBtn movil={isMobile} title="Centrar en el integrante seleccionado" onClick={() => raiz && localizar(selEin || raiz.ein, false)}><span style={GEN_IC}><Icons.Target/></span>{!isMobile && 'Centrar'}</GenBtn>
            <GenBtn movil={isMobile} title="Ajustar la rama visible a la pantalla" onClick={ajustar}><span style={GEN_IC}><GenIco.Ajustar/></span>{!isMobile && 'Ajustar'}</GenBtn>
            {separador}
            <div title="Zoom del árbol — solo acerca o aleja el mapa; el tamaño de letra de la app se cambia con A− / A+" style={{display:'inline-flex',alignItems:'center',gap:2,height:isMobile?40:32,padding:'0 3px',border:'1px solid var(--win-border)',borderRadius:8,background:'var(--win-surface2)',flexShrink:0}}>
              <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:600,color:'var(--win-muted)',padding:'0 5px',whiteSpace:'nowrap'}}><span style={IC12}><Icons.Search/></span>{isMobile ? 'Zoom' : 'Zoom del árbol'}</span>
              <button onClick={() => zoomBoton(1 / 1.2)} aria-label="Alejar el árbol" style={{width:isMobile?34:26,height:isMobile?34:26,border:'none',borderRadius:6,background:'transparent',color:'var(--win-title)',fontSize:17,fontWeight:700,cursor:'pointer',padding:0}}>−</button>
              <button onClick={() => zoomEn(1, anchoVisible / 2, vp.h / 2)} title="Zoom del árbol al 100%" style={{minWidth:44,height:isMobile?34:26,border:'none',borderRadius:6,background:'transparent',color:'var(--win-title)',fontSize:11,fontWeight:700,cursor:'pointer',fontVariantNumeric:'tabular-nums',fontFamily:'inherit',padding:0}}>{Math.round(vista.z * 100)}%</button>
              <button onClick={() => zoomBoton(1.2)} aria-label="Acercar el árbol" style={{width:isMobile?34:26,height:isMobile?34:26,border:'none',borderRadius:6,background:'transparent',color:'var(--win-title)',fontSize:17,fontWeight:700,cursor:'pointer',padding:0}}>+</button>
            </div>
            <GenBtn movil={isMobile} title={completa ? 'Salir de pantalla completa' : 'Pantalla completa'} onClick={alternarCompleta}><span style={GEN_IC}>{completa ? <GenIco.Salir/> : <GenIco.Completa/>}</span>{!isMobile && (completa ? 'Salir' : 'Pantalla completa')}</GenBtn>
            <GenBtn movil={isMobile} title="Filtrar por rango y actividad" onClick={() => setVerFiltros(v => !v)} activo={verFiltros}><span style={GEN_IC}><Icons.Sliders/></span>{!isMobile && 'Filtros'}{filtrosActivos && <span style={{width:7,height:7,borderRadius:'50%',background:'var(--win-gold)'}}/>}</GenBtn>
          </div>
        </div>

        {/* Ruta de navegación */}
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderTop:'1px solid var(--win-border)',fontSize:12,overflowX:'auto',whiteSpace:'nowrap'}}>
          {migas.map((m, i) => {
            const ultimo = i === migas.length - 1
            const etiqueta = i === 0
              ? <><span style={IC12}><Icons.Home/></span>Mi red</>
              : m.nombre.split(' ').slice(0, 2).join(' ')
            return (
              <React.Fragment key={m.ein}>
                {i > 0 && <span style={{color:'var(--win-muted)'}}>›</span>}
                {ultimo
                  ? <span title={m.nombre} style={{display:'inline-flex',alignItems:'center',gap:5,fontWeight:700,color:'var(--win-title)'}}>{etiqueta}</span>
                  : <button onClick={() => cambiarRaiz(m.ein)} title={m.nombre} style={{display:'inline-flex',alignItems:'center',gap:5,border:'none',background:'transparent',color:'var(--win-accent)',cursor:'pointer',padding:'4px 0',fontSize:12,fontWeight:600,fontFamily:'inherit'}}>{etiqueta}</button>}
              </React.Fragment>
            )
          })}
        </div>

        {/* Filtros (plegables) */}
        {verFiltros && (
          <div style={{padding:'14px 16px',borderTop:'1px solid var(--win-border)',background:'var(--win-surface2)',display:'flex',flexDirection:isMobile?'column':'row',gap:isMobile?16:24,alignItems:'stretch'}}>
            <div style={{flex:isMobile?'none':3,minWidth:0}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'.06em',color:'var(--win-muted)',textTransform:'uppercase',marginBottom:10}}>Filtrar rangos:</div>
              <div style={{display:isMobile?'flex':'grid',flexWrap:isMobile?'nowrap':undefined,gridTemplateColumns:isMobile?undefined:`repeat(${RANGOS_FILTRO_GEN.length}, 1fr)`,gap:12,overflowX:isMobile?'auto':'visible',paddingBottom:isMobile?4:0}}>
                {RANGOS_FILTRO_GEN.map(f => {
                  const rDef = RANGOS.find(rr => rr.id === f.id)
                  const checked = filtroRangos.has(f.id)
                  return (
                    <label key={f.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,cursor:'pointer',userSelect:'none',opacity:checked?1:0.5,flexShrink:isMobile?0:undefined,width:isMobile?72:'auto'}}>
                      {RANGO_IMG[f.id] && <img src={RANGO_IMG[f.id]} alt={f.label} style={{width:isMobile?36:44,height:isMobile?36:44,objectFit:'contain'}}/>}
                      <span style={{background:rDef?.bg,color:rDef?.color,padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:600,whiteSpace:'nowrap'}}>{f.label}</span>
                      <input type="checkbox" checked={checked} onChange={() => toggleFiltro(f.id)} style={{cursor:'pointer',accentColor:'var(--win-accent)'}}/>
                    </label>
                  )
                })}
              </div>
            </div>
            <div style={{flex:isMobile?'none':1,minWidth:isMobile?'auto':160,paddingTop:isMobile?14:0,borderTop:isMobile?'1px solid var(--win-border)':'none',paddingLeft:isMobile?0:24,borderLeft:isMobile?'none':'1px solid var(--win-border)'}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'.06em',color:'var(--win-muted)',textTransform:'uppercase',marginBottom:10}}>Actividad:</div>
              <div style={{display:'flex',flexWrap:'nowrap',gap:16,overflowX:isMobile?'auto':'visible',paddingBottom:isMobile?4:0}}>
                {[
                  { id:'activo', label:'Con puntos', color:'#16A34A', relleno:true },
                  { id:'inactivo', label:'Sin puntos', color:'#9CA3AF', relleno:false },
                ].map(f => {
                  const checked = filtroActividad.has(f.id)
                  return (
                    <label key={f.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,cursor:'pointer',userSelect:'none',opacity:checked?1:0.5,flexShrink:0,width:isMobile?72:'auto'}}>
                      <div style={{width:isMobile?36:44,height:isMobile?36:44,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <div style={{width:isMobile?15:18,height:isMobile?15:18,borderRadius:'50%',background:f.relleno?f.color:'transparent',border:`2px solid ${f.color}`}}/>
                      </div>
                      <span style={{background:f.color+'22',color:f.color,padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:600,whiteSpace:'nowrap'}}>{f.label}</span>
                      <input type="checkbox" checked={checked} onChange={() => toggleActividad(f.id)} style={{cursor:'pointer',accentColor:f.color}}/>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resumen compacto de la raíz visible */}
      {raiz && !completa && (() => {
        const rr = getRango(raiz.rango)
        const c = conteos.get(raiz.ein) || { directos: 0, equipo: 0 }
        const pgVis = sumarPGVisible(raiz, pasaFiltro)
        const marca = filtroRangos.size < RANGOS_FILTRO_GEN.length ? ' *' : ''
        return (
          <div style={{...S.card, marginBottom:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:isMobile?10:16, flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0,flex:isMobile?'1 1 100%':'1 1 auto'}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:rr.bg,border:`2px solid ${rr.color}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {RANGO_IMG[rr.id] ? <img src={RANGO_IMG[rr.id]} alt={rr.label} style={{width:33,height:33,objectFit:'contain'}}/> : <span style={{fontSize:12,fontWeight:700,color:rr.color}}>{getInitials(raiz.nombre)}</span>}
              </div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:700,color:'var(--win-title)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{raiz.nombre}</div>
                <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap',marginTop:2}}>
                  <span style={{background:rr.bg,color:rr.color,padding:'1px 8px',borderRadius:10,fontSize:10,fontWeight:700}}>{rr.label}</span>
                  <span style={{fontSize:10.5,color:'var(--win-muted)'}}>EIN {raiz.ein}</span>
                </div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:isMobile?12:18,flexWrap:'wrap',fontSize:11}}>
              <div style={{textAlign:'center',padding:'5px 12px',borderRadius:10,background:'linear-gradient(135deg, rgba(124,58,237,.14), rgba(124,58,237,.05))',border:'1.5px solid rgba(124,58,237,.4)'}}>
                <div style={{fontSize:18,fontWeight:800,color:'#7C3AED',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{pgVis.pg.toLocaleString()}</div>
                <div style={{color:'#7C3AED',fontWeight:700,letterSpacing:'.04em',fontSize:9.5,marginTop:2,whiteSpace:'nowrap'}}>PG EN EL ÁRBOL</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:17,fontWeight:700,color:'var(--win-title)',lineHeight:1.1}}>{c.directos}</div>
                <div style={{color:'var(--win-muted)',whiteSpace:'nowrap'}}>Directos{marca}</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:17,fontWeight:700,color:'var(--win-accent)',lineHeight:1.1}}>{c.equipo}</div>
                <div style={{color:'var(--win-muted)',whiteSpace:'nowrap'}}>Total ramificación{marca}</div>
              </div>
            </div>
            <button onClick={() => descargarArbol(raiz, pasaFiltro, { pg: pgVis.pg })} disabled={descargando} title="Descargar el árbol como imagen"
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,height:isMobile?40:36,padding:'0 14px',borderRadius:9,background:'var(--win-accent)',border:'none',color:'#fff',fontSize:12.5,fontWeight:600,cursor:descargando?'default':'pointer',fontFamily:'inherit',whiteSpace:'nowrap',marginLeft:isMobile?0:'auto',width:isMobile?'100%':'auto',opacity:descargando?0.7:1}}>
              <div style={{width:15,height:15,flexShrink:0}}>{descargando ? '⏳' : <Icons.Download/>}</div>
              {descargando ? 'Generando…' : 'Descargar Árbol'}
            </button>
            {marca && (
              <div style={{flex:'1 1 100%',fontSize:10.5,color:'var(--win-muted)'}}>* Cuenta solo los rangos marcados en "Filtros" — no el total real de tu red.</div>
            )}
          </div>
        )
      })()}

      {/* Puntos y valor por nivel (plegable) */}
      {!completa && <NivelesPorRed raiz={raiz} tc={tc} pasaFiltro={pasaFiltro} defaultAbierto={false} />}

      {/* Lienzo del árbol */}
      <div style={{position:'relative',flex:completa?1:undefined,height:completa?undefined:(isMobile?'calc(100vh - 180px)':'calc(100vh - 200px)'),minHeight:420,borderRadius:14,border:'1px solid var(--win-border)',overflow:'hidden',background:'radial-gradient(circle at 1px 1px, var(--win-border) 1px, transparent 0) 0 0 / 22px 22px, var(--win-bg)'}}>
        <div ref={vpRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          style={{position:'absolute',inset:0,overflow:'hidden',touchAction:'none',cursor:'grab'}}>
          {!raiz ? (
            <div style={{padding:'48px 16px',textAlign:'center',color:'var(--win-muted)',fontSize:13}}>No hay afiliados cargados.</div>
          ) : (
            <div style={{position:'absolute',left:0,top:0,width:layout.ancho,height:layout.alto,transform:`translate(${vista.x}px, ${vista.y}px) scale(${vista.z})`,transformOrigin:'0 0',willChange:'transform'}}>
              <svg width={layout.ancho} height={layout.alto} style={{position:'absolute',left:0,top:0,overflow:'visible',pointerEvents:'none'}}>
                {layout.enlaces.map((e, i) => e.hijos.map((cx, j) => (
                  <path key={i + '-' + j} d={genConector(e.px, e.py, cx, e.cy)} fill="none" stroke="var(--win-link, #7AA7E8)" strokeWidth={2} strokeLinecap="round"/>
                )))}
                {layout.toggles.filter(t => !t.abierto).map(t => (
                  <line key={'s' + t.ein} x1={t.cx} y1={t.y} x2={t.cx} y2={t.y + 8} stroke="var(--win-link, #7AA7E8)" strokeWidth={2}/>
                ))}
              </svg>
              {layout.nodos.map(rec => rec.mas ? (
                <div key={'mas-' + rec.padre} role="button" tabIndex={0}
                  onClick={() => { if (!arrastro.current) verMas(rec.padre) }}
                  onKeyDown={e => { if (e.key === 'Enter') verMas(rec.padre) }}
                  style={{position:'absolute',left:rec.x,top:rec.y,width:cw,height:ch,boxSizing:'border-box',borderRadius:14,border:'2px dashed var(--win-accent)',background:'var(--win-accent-l)',color:'var(--win-accent)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,cursor:'pointer',fontWeight:700,textAlign:'center',padding:10,userSelect:'none'}}>
                  <div style={{fontSize:20}}>+{rec.resto}</div>
                  <div style={{fontSize:11.5}}>Ver más integrantes de esta rama</div>
                </div>
              ) : (
                <GenTarjeta key={rec.n.ein} rec={rec} conteo={conteos.get(rec.n.ein) || { directos: 0, equipo: 0 }}
                  seleccionada={rec.n.ein === selEin} esRaiz={rec.n.ein === raiz.ein}
                  cw={cw} ch={ch} medalla={medalla} onSel={seleccionar} onExplorar={explorar}/>
              ))}
              {layout.toggles.map(t => (
                <button key={'t' + t.ein} onClick={e => { e.stopPropagation(); toggleRama(t.ein) }}
                  title={t.abierto ? 'Ocultar su equipo (no borra a nadie)' : `Mostrar ${t.total} directo${t.total === 1 ? '' : 's'}`}
                  style={{position:'absolute',left:t.cx - 20,top:t.y + 6,width:40,height:24,borderRadius:12,border:'1px solid var(--win-accent)',background:'var(--win-surface)',color:'var(--win-accent)',fontSize:11.5,fontWeight:800,cursor:'pointer',boxShadow:'0 2px 6px rgba(0,0,0,.2)',padding:0,fontFamily:'inherit'}}>
                  {t.abierto ? '−' : `+${t.total}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {raiz && (
          <div data-nopan style={{position:'absolute',left:10,bottom:10,background:'var(--win-surface)',border:'1px solid var(--win-border)',borderRadius:10,padding:6,boxShadow:'0 4px 14px rgba(0,0,0,.2)',zIndex:4}}>
            {!isMobile && <div style={{fontSize:10,fontWeight:700,color:'var(--win-muted)',margin:'0 2px 4px'}}>Vista general</div>}
            <GenMinimapa layout={layout} vista={vista} vp={vp} cw={cw} ch={ch} selEin={selEin} raizEin={raiz.ein}
              w={isMobile ? 112 : 180} h={isMobile ? 70 : 110} onIr={irA}/>
          </div>
        )}

        {!isMobile && raiz && (
          <div style={{position:'absolute',right:panelAbierto?GEN_PANEL+10:10,bottom:10,fontSize:10.5,color:'var(--win-muted)',background:'var(--win-surface)',border:'1px solid var(--win-border)',borderRadius:8,padding:'4px 9px',zIndex:3,pointerEvents:'none'}}>
            Arrastra el fondo para moverte · Ctrl + rueda para zoom
          </div>
        )}

        {panelAbierto && (
          <aside data-nopan style={{position:'absolute',top:0,right:0,bottom:0,width:GEN_PANEL,boxSizing:'border-box',background:'var(--win-surface)',borderLeft:'1px solid var(--win-border)',overflowY:'auto',zIndex:5,padding:'12px 18px 20px',boxShadow:'-8px 0 24px -12px rgba(0,0,0,.35)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:13.5,fontWeight:700,color:'var(--win-title)'}}>Integrante seleccionado</span>
              <button onClick={() => setFicha(false)} aria-label="Cerrar ficha" style={{background:'var(--win-surface2)',border:'none',borderRadius:'50%',width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--win-muted)',cursor:'pointer',padding:0}}>
                <div style={{width:12,height:12}}><Icons.X/></div>
              </button>
            </div>
            <FichaContenido nodo={selNodo} afiliados={afiliados} periodos={periodos} onClose={() => setFicha(false)} onPlanAccion={onPlanAccion} acciones={accionesFicha}/>
          </aside>
        )}
      </div>

      <ArbolDetalle nodo={isMobile && ficha ? selNodo : null} afiliados={afiliados} periodos={periodos} onClose={() => setFicha(false)} onPlanAccion={onPlanAccion} acciones={accionesFicha}/>
    </div>
  )
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
window.NivelesPorRed = NivelesPorRed
