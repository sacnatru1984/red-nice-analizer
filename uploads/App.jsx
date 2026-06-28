import { useState, useRef, useCallback, useEffect } from 'react'
import ExcelJS from 'exceljs'
import { parseExcel, detectarDuplicados, buildTree, getRango, getSiguienteRango,
         getProgresoPct, getPlanAccion, getInitials, contarPorRango, RANGOS, RANGO_IMG } from './utils.js'

async function parseWorkbookFile(file) {
  const buffer = await file.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const worksheet = workbook.worksheets[0]
  const data = worksheet.getSheetValues().slice(1).map((row) => Array.isArray(row) ? row.slice(1) : [])
  return parseExcel(data)
}

const Icons = {
  Network: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/></svg>,
  Tree: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Plan: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><polyline points="8 1 8 8 12 12 16 8 16 1"/><line x1="8" y1="1" x2="16" y2="1"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  File: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ChevRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:'100%',height:'100%'}}><polyline points="9 18 15 12 9 6"/></svg>,
  ChevDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:'100%',height:'100%'}}><polyline points="6 9 12 15 18 9"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:'100%',height:'100%'}}><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:'100%',height:'100%'}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'100%',height:'100%'}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'100%',height:'100%'}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  GitBranch: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
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
  return (
    <div>
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
            ? '0 0 0 4px rgba(37,99,235,.25), 0 0 12px rgba(37,99,235,.5)'
            : (esOro?`0 0 0 3px ${r.color}33`:'none'),
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
          <div style={{width:2,height:12,background:'var(--win-border)'}}/>
          <div style={{position:'relative',display:'flex',alignItems:'flex-start',justifyContent:'center'}}>
            {hijosFiltrados.length>1 && (
              <div style={{position:'absolute',top:0,left:'8px',right:'8px',height:2,background:'var(--win-border)'}}/>
            )}
            {hijosFiltrados.map(c=>(
              <div key={c.ein} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div style={{width:2,height:10,background:'var(--win-border)'}}/>
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

function PanelGenealogia({ afiliados, rootEin, onChangeRoot }) {
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
              <div style={{display:'flex',gap:18,fontSize:11}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:700,color:'var(--win-title)'}}>{directos}</div>
                  <div style={{color:'var(--win-muted)'}}>Directos</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:700,color:'var(--win-accent)'}}>{total}</div>
                  <div style={{color:'var(--win-muted)'}}>Total ramificación</div>
                </div>
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

function PanelPlan({ afiliados }) {
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
  const r = sel ? getRango(sel.rango) : null
  const sig = sel ? getSiguienteRango(r?.id) : null
  const pct = sel && sig ? getProgresoPct(sel, sig) : 0
  const pasos = sel ? getPlanAccion(sel, sig, afiliados) : []

  const getReqText = () => {
    if (!sig) return ''
    if (sig.tipo === 'personal') return sel.pp + ' de ' + sig.ppReq.toLocaleString() + ' PP × 3 meses consecutivos'
    if (sig.tipo === 'equipo') return (sel.frontalesOro || 0) + ' de ' + sig.frontalesOro + ' frontales Oro generando $200 USD en Desc. por Red'
    const req = sig.id === 'COBRE' ? 700 : sig.id === 'BRONCE' ? 1000 : sig.id === 'PLATA' ? 2000 : 3000
    return (sel.pp + sel.pg).toLocaleString() + ' de ' + req.toLocaleString() + ' PP/PG combinados'
  }

  const getChecks = () => {
    if (!sig) return []
    const checks = [{ ok: (sel.pp + sel.pg) > 0, txt: 'Tiene actividad este período (PP o PG > 0)', sub: sel.pp + ' PP + ' + sel.pg + ' PG = ' + (sel.pp + sel.pg) + ' puntos combinados' }]
    if (sig.tipo === 'desc') {
      const req = sig.id === 'COBRE' ? 700 : sig.id === 'BRONCE' ? 1000 : sig.id === 'PLATA' ? 2000 : 3000
      checks.push({ ok: (sel.pp + sel.pg) >= req, txt: 'Alcanzar ' + req.toLocaleString() + ' PP/PG combinados', sub: 'Tiene ' + (sel.pp + sel.pg).toLocaleString() + ' de ' + req.toLocaleString() + ' puntos' })
    }
    if (sig.tipo === 'personal') checks.push({ ok: sel.pp >= sig.ppReq, txt: 'Alcanzar ' + sig.ppReq.toLocaleString() + ' PP × 3 meses consecutivos', sub: 'Este mes: ' + sel.pp + ' PP de ' + sig.ppReq.toLocaleString() + ' requeridos' })
    if (sig.tipo === 'equipo') checks.push({ ok: (sel.frontalesOro || 0) >= sig.frontalesOro, txt: sig.frontalesOro + ' frontal' + (sig.frontalesOro > 1 ? 'es' : '') + ' Oro generando $200 USD en Desc. por Red', sub: 'Frontales Oro activos: ' + (sel.frontalesOro || 0) })
    return checks
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
              {[{ l: 'PP este mes', v: sel.pp.toLocaleString(), c: 'var(--win-gold)' }, { l: 'Puntos Grupo', v: sel.pg.toLocaleString(), c: '#7C3AED' }, { l: 'Generación', v: sel.gen, c: 'var(--win-accent)' }].map(k => (
                <div key={k.l} style={{ background: 'var(--win-surface)', border: '1px solid var(--win-border)', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)', padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: k.c, fontVariantNumeric: 'tabular-nums' }}>{k.v}</div>
                  <div style={{ fontSize: 11, color: 'var(--win-muted)', marginTop: 3 }}>{k.l}</div>
                </div>
              ))}
            </div>

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
                const RANGOS_ORO_PLUS = ['ORO','ORO_EXPERTO','ORO_PREMIER','ORO_ELITE','PLATINO','ORO_EJECUTIVO','ORO_SENIOR','ORO_MASTER','DIAMANTE','DIAMANTE_MASTER','DOBLE_DIAMANTE']
                // Frontales directos (gen = sel.gen + 1) que aún NO califican como frontal Oro activo
                const frontales = afiliados.filter(a => a.einPresentador === sel.ein || (a.gen === sel.gen + 1 && a.einPresentador === sel.ein))
                const pool = (frontales.length > 0 ? frontales : afiliados.filter(a => a.gen === sel.gen + 1))
                  .filter(a => a.ein !== sel.ein)
                const score = (a) => {
                  const rid = getRango(a.rango).id
                  const total = (a.pp || 0) + (a.pg || 0)
                  // Ya es Oro o superior: necesita más PP para generar $200 USD Desc. por Red
                  if (RANGOS_ORO_PLUS.includes(rid)) return total + 5000
                  return total
                }
                const candidatos = pool
                  .map(a => ({ a, s: score(a), total: (a.pp || 0) + (a.pg || 0) }))
                  .filter(x => x.total > 0)
                  .sort((x, y) => y.s - x.s)
                  .slice(0, 5)
                if (candidatos.length === 0) return null
                return (
                  <div style={{ borderTop: '1px solid var(--win-border)', padding: '12px 16px', background: 'var(--win-surface2)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--win-accent)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Candidatos más probables a frontal Oro</div>
                    <div style={{ fontSize: 11, color: 'var(--win-muted)', marginBottom: 10 }}>Frontales directos con mayor volumen acumulado — prioriza apoyarlos para que alcancen Oro y generen $200 USD en Desc. por Red.</div>
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
    { id: 'EIN', pct: '25%', factor: 0.7828, valor: 15.66 },
    { id: 'COBRE', pct: '30%', factor: 0.7378, valor: 14.76 },
    { id: 'BRONCE', pct: '35%', factor: 0.6928, valor: 13.86 },
    { id: 'PLATA', pct: '40%', factor: 0.6478, valor: 12.96 },
    { id: 'ORO', pct: '45%', factor: 0.6028, valor: 12.06 },
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
          {['Rango NICE','% Descuento','Factor','Valor PTO (MXN)','Tipo de cambio'].map(h=>(
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

function PanelRangos() {
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
      <FactoresInversion/>
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

export default function App() {
  const [tab, setTab] = useState('red')
  const [afiliados, setAfiliados] = useState([])
  const [archivos, setArchivos] = useState([])
  const [duplicados, setDuplicados] = useState([])
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
    setAfiliados(nuevos); setDuplicados(dups)
    setArchivos(prev => [{nombre, afiliados:nuevos.length, dups:dups.length, fecha:new Date().toLocaleDateString('es-MX')}, ...prev])
    setCargado(true); setTab('red')
  }, [])

  const handleFile = (e) => {
    const f = e.target.files[0]; if(!f) return
    parseWorkbookFile(f).then((nuevos) => {
      onCargar(f.name, nuevos, detectarDuplicados(nuevos))
    })
  }

  const TABS = [{id:'red',l:'Mi Red',I:Icons.BarChart},{id:'arbol',l:'Árbol',I:Icons.Tree},{id:'genealogia',l:'Genealogía',I:Icons.GitBranch},{id:'plan',l:'Plan',I:Icons.Plan},{id:'rangos',l:'Rangos NICE',I:Icons.Trophy},{id:'archivos',l:'Archivos',I:Icons.Upload}]
  const self = afiliados[0]

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',fontFamily:"'DM Sans',system-ui,sans-serif",background:'var(--win-bg)'}}>
      {/* Taskbar */}
      <div className="rn-taskbar" style={{height:48,background:'var(--win-surface)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--win-border)',display:'flex',alignItems:'center',padding:'0 16px',gap:12,flexShrink:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:26,height:26,background:'var(--win-accent)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>
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
          {!cargado&&tab!=='rangos'&&tab!=='archivos'&&'Carga un archivo Excel del portal NICE para comenzar'}
          {cargado&&tab==='red'&&`${afiliados.length} afiliados · ${archivos[0]?.fecha}`}
          {cargado&&tab==='arbol'&&`Árbol jerárquico · ${afiliados.length} afiliados`}
          {cargado&&tab==='genealogia'&&`Genealogía visual ramificada · ${afiliados.length} afiliados`}
          {(cargado||tab==='plan')&&tab==='plan'&&'Plan personalizado según el plan de carrera oficial NICE 2025'}
          {tab==='rangos'&&'Plan de carrera NICE oficial · Actualización Enero 2025'}
          {tab==='archivos'&&`${archivos.length} archivo${archivos.length!==1?'s':''} cargado${archivos.length!==1?'s':''}`}
        </div>
      </div>

      {/* Body */}
      <div className="rn-body" style={{flex:1,overflowY:'auto',background:'var(--win-bg)'}}>
        {!cargado&&tab!=='rangos'&&tab!=='archivos'&&(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'65%',textAlign:'center'}}>
            <div style={{width:64,height:64,background:'var(--win-accent-l)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',color:'var(--win-accent)'}}>
              <div style={{width:36,height:36}}><Icons.Upload/></div>
            </div>
            <div style={{fontSize:20,fontWeight:700,color:'var(--win-title)',marginBottom:8}}>Carga tu tablero de NICE</div>
            <div style={{fontSize:14,color:'var(--win-muted)',marginBottom:24,maxWidth:380,lineHeight:1.6}}>Sube el archivo Excel que descargas del portal NICE para visualizar tu red, árbol de afiliados y planes personalizados basados en el plan de carrera oficial.</div>
            <button onClick={()=>fileRef.current.click()} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 28px',borderRadius:10,background:'var(--win-accent)',color:'white',fontSize:14,fontWeight:600,border:'none',cursor:'pointer',fontFamily:'inherit'}}>
              <div style={{width:18,height:18}}><Icons.Upload/></div>
              Seleccionar archivo Excel
            </button>
          </div>
        )}
        {(cargado||tab==='rangos'||tab==='archivos')&&(
          <>
            {tab==='red'&&<PanelMiRed afiliados={afiliados}/>}
            {tab==='arbol'&&<PanelArbol afiliados={afiliados} onGenealogia={irAGenealogia}/>}
            {tab==='genealogia'&&<PanelGenealogia afiliados={afiliados} rootEin={genealogiaEin} onChangeRoot={setGenealogiaEin}/>}
            {tab==='plan'&&<PanelPlan afiliados={afiliados}/>}
            {tab==='rangos'&&<PanelRangos/>}
            {tab==='archivos'&&<PanelArchivos archivos={archivos} onCargar={onCargar} duplicados={duplicados}/>}
          </>
        )}
      </div>
    </div>
  )
}
