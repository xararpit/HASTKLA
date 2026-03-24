import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const CATEGORIES = [
  { id:'metal',  name:'Metalwork',        icon:'🔨' },
  { id:'fabric', name:'Fabric & Textile', icon:'🪡' },
  { id:'decor',  name:'Decorative Art',   icon:'🏺' },
  { id:'clay',   name:'Clay & Pottery',   icon:'🫙' },
  { id:'wood',   name:'Woodcraft',        icon:'🪵' },
  { id:'leath',  name:'Leather & Bags',   icon:'👜' },
  { id:'floral', name:'Floral Crafts',    icon:'🌸' },
  { id:'other',  name:'Other',            icon:'🎁' },
]

const ListProduct = () => {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const fileRef   = useRef()

  const [imgFiles, setImgFiles] = useState([])
  const [imgB64,  setImgB64]    = useState(null)
  const [imgMime, setImgMime]   = useState(null)
  const [aiRes,   setAiRes]     = useState(null)
  const [aiErr,   setAiErr]     = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [toast,   setToast]     = useState('')
  const [saving,  setSaving]    = useState(false)

  const [form, setForm] = useState({
    name:'', category:'', price:'', stock:'1',
    description:'', technique:'', tags:'', origin:''
  })
  const set = (k, v) => setForm(f => ({...f, [k]:v}))

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  /* Load image file */
  const loadFile = (file) => {
    if (!file) return
    setImgFiles([file]); setAiRes(null); setAiErr('')
    const r = new FileReader()
    r.onload = e => {
      const src = e.target.result
      setImgB64(src.split(',')[1])
      setImgMime(file.type)
    }
    r.readAsDataURL(file)
  }

  /* AI analysis via Anthropic API */
  const analyzeImage = async () => {
    setAiLoading(true); setAiErr('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 900,
          messages: [{
            role: 'user',
            content: [
              { type:'image', source:{ type:'base64', media_type:imgMime, data:imgB64 } },
              { type:'text',  text:`You are analyzing a handmade product image for HASTKLA, an Indian artisan marketplace. Respond ONLY with valid JSON — no markdown, no backticks. Schema:
{"name":"Product name 3-6 words","category":"ONE OF: Metalwork|Fabric & Textile|Decorative Art|Clay & Pottery|Woodcraft|Leather & Bags|Floral Crafts|Other","description":"2-3 sentences about material, craft and cultural significance","suggestedPrice":500,"tags":["tag1","tag2","tag3","tag4"],"technique":"Specific craft technique used","origin":"Indian regional craft tradition"}` }
            ]
          }]
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      const text = data.content?.find(c => c.type === 'text')?.text || '{}'
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      setAiRes(parsed)

      const catMatch = CATEGORIES.find(c => c.name === parsed.category)
      setForm(f => ({
        ...f,
        name:        parsed.name        || f.name,
        category:    catMatch?.id       || f.category,
        price:       String(parsed.suggestedPrice || f.price),
        description: parsed.description || f.description,
        technique:   parsed.technique   || f.technique,
        origin:      parsed.origin      || f.origin,
        tags:        (parsed.tags || []).join(', '),
      }))
    } catch (e) {
      setAiErr('AI analysis failed. Please fill in the details manually.')
    }
    setAiLoading(false)
  }

  /* Submit to real API */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.price) {
      showToast('⚠️ Please fill in name, category and price.')
      return
    }
    setSaving(true)

    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('category', form.category)
      fd.append('price', form.price)
      fd.append('stock', form.stock || '1')
      fd.append('description', form.description)
      fd.append('technique', form.technique)
      fd.append('origin', form.origin)
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)))
      imgFiles.forEach(f => fd.append('images', f))

      await api.post('/products', fd)
      showToast(`✅ "${form.name}" is now listed on HASTKLA!`)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      showToast(`⚠️ ${err.response?.data?.message || 'Failed to list product. Try again.'}`)
    } finally {
      setSaving(false)
    }
  }

  const imgURL = imgFiles[0] ? URL.createObjectURL(imgFiles[0]) : null

  return (
    <>
      <Navbar />
      <div style={{ minHeight:'100vh', background:'var(--cream)', padding:'2rem' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>

          <button className="btn btn-warm btn-sm" style={{ marginBottom:'1.5rem' }} onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>

          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'2rem' }}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.9rem', fontWeight:600, marginBottom:'0.3rem' }}>
              List a New Product
            </h1>
            <p style={{ fontSize:'0.84rem', color:'var(--muted)', marginBottom:'1.8rem' }}>
              Upload a real photo — AI will auto-identify your craft and fill in the details.
            </p>

            <form onSubmit={handleSubmit}>

              {/* IMAGE UPLOAD */}
              <div className="form-group">
                <label className="form-label">Real Product Photo *</label>
                {imgFiles[0] ? (
                  <div style={{ position:'relative', borderRadius:14, overflow:'hidden', marginBottom:'0.8rem' }}>
                    <img src={imgURL} alt="preview" style={{ width:'100%', maxHeight:260, objectFit:'cover', display:'block', borderRadius:14 }} />
                    <button type="button"
                      style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', borderRadius:20, padding:'4px 10px', fontSize:'0.72rem', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:600 }}
                      onClick={() => { setImgFiles([]); setImgB64(null); setAiRes(null) }}>
                      × Change
                    </button>
                  </div>
                ) : (
                  <div
                    className="upload-zone"
                    onClick={() => fileRef.current.click()}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag') }}
                    onDragLeave={e => e.currentTarget.classList.remove('drag')}
                    onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('drag'); loadFile(e.dataTransfer.files[0]) }}
                  >
                    <div style={{ fontSize:'2.2rem', marginBottom:'0.6rem' }}>📷</div>
                    <div style={{ fontSize:'0.84rem', color:'var(--muted)', lineHeight:1.6 }}>
                      Click to upload or drag & drop<br />
                      <strong style={{ color:'var(--ink)' }}>JPG · PNG · WEBP · up to 10 MB</strong>
                    </div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => loadFile(e.target.files[0])} />
              </div>

              {/* AI ANALYZE BUTTON */}
              {imgB64 && !aiRes && !aiLoading && (
                <button type="button" className="btn btn-indigo btn-full" style={{ marginBottom:'1rem' }} onClick={analyzeImage}>
                  ✨ Analyze with AI — auto-fill product details
                </button>
              )}

              {/* AI LOADING */}
              {aiLoading && (
                <div className="ai-card" style={{ marginBottom:'1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.55rem', marginBottom:'0.5rem' }}>
                    <span className="spinner" /><span className="ai-label">AI is examining your product image…</span>
                  </div>
                  <div style={{ fontSize:'0.78rem', color:'var(--muted)' }}>Identifying craft, category, technique and suggesting a fair price…</div>
                </div>
              )}

              {/* AI RESULT */}
              {aiRes && (
                <div className="ai-card" style={{ marginBottom:'1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.4rem' }}>
                    <span>✨</span><span className="ai-label">AI Analysis — form auto-filled, edit if needed</span>
                  </div>
                  {[['Category', aiRes.category], ['Technique', aiRes.technique], ['Origin', aiRes.origin], ['Suggested Price', `₹${aiRes.suggestedPrice?.toLocaleString('en-IN')}`]].map(([k,v]) => v && (
                    <div key={k} className="ai-row"><span className="ai-key">{k}</span><span className="ai-val">{v}</span></div>
                  ))}
                </div>
              )}

              {/* AI ERROR */}
              {aiErr && (
                <div className="ai-card error" style={{ marginBottom:'1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <span>⚠️</span><span className="ai-label">Analysis failed</span>
                  </div>
                  <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginTop:'0.3rem' }}>{aiErr}</div>
                </div>
              )}

              {/* FORM FIELDS */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" placeholder="e.g. Brass Ganesha Idol" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)} required>
                    <option value="">— select —</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" type="number" placeholder="e.g. 1200" value={form.price} onChange={e => set('price', e.target.value)} min="1" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input className="form-input" type="number" placeholder="e.g. 5" value={form.stock} onChange={e => set('stock', e.target.value)} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Craft Technique</label>
                  <input className="form-input" placeholder="e.g. Dhokra casting" value={form.technique} onChange={e => set('technique', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Regional Origin</label>
                  <input className="form-input" placeholder="e.g. Rajasthani brass craft" value={form.origin} onChange={e => set('origin', e.target.value)} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input className="form-input" placeholder="e.g. brass, idol, handmade, religious" value={form.tags} onChange={e => set('tags', e.target.value)} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Describe the material, size, craft story and what makes it special…" value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
              </div>

              <div style={{ display:'flex', gap:'0.8rem', justifyContent:'flex-end', marginTop:'0.5rem' }}>
                <button type="button" className="btn btn-warm" onClick={() => navigate('/dashboard')}>Cancel</button>
                <button type="submit" className="btn btn-clay btn-lg" disabled={saving || !form.name || !form.category || !form.price}>
                  {saving ? <><span className="spinner" style={{borderTopColor:'#fff'}} /> Listing…</> : 'List Product →'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

export default ListProduct
