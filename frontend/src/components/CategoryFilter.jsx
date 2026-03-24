const CATEGORIES = [
  { id:'all',    name:'All',              icon:'✨' },
  { id:'metal',  name:'Metalwork',        icon:'🔨' },
  { id:'fabric', name:'Fabric & Textile', icon:'🪡' },
  { id:'decor',  name:'Decorative Art',   icon:'🏺' },
  { id:'clay',   name:'Clay & Pottery',   icon:'🫙' },
  { id:'wood',   name:'Woodcraft',        icon:'🪵' },
  { id:'leath',  name:'Leather & Bags',   icon:'👜' },
  { id:'floral', name:'Floral Crafts',    icon:'🌸' },
  { id:'other',  name:'Other',            icon:'🎁' },
]

const CategoryFilter = ({ active, onChange }) => (
  <div style={{ display:'flex', gap:'0.45rem', flexWrap:'wrap', marginBottom:'1rem' }}>
    {CATEGORIES.map(c => (
      <button key={c.id} className={`cat-pill${active === c.id ? ' active' : ''}`} onClick={() => onChange(c.id)}>
        {c.icon} {c.name}
      </button>
    ))}
  </div>
)

export default CategoryFilter