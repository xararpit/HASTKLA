import { CATEGORIES } from '../data/products';

const CategoryFilter = ({ active, onChange }) => (
  <div style={{ display:'flex', gap:'0.45rem', flexWrap:'wrap', marginBottom:'1rem' }}>
    {CATEGORIES.map(cat => (
      <button
        key={cat.id}
        className={`cat-pill${active === cat.id ? ' active' : ''}`}
        onClick={() => onChange(cat.id)}
      >
        {cat.icon} {cat.name}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
