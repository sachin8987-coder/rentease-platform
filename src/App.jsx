import { useState, useEffect } from "react";

// ─── SAMPLE DATA ───────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "King Size Bed", category: "Furniture", subcat: "Bedroom", icon: "🛏️", monthlyRent: 1200, deposit: 2400, rating: 4.8, reviews: 142, available: true, tenureOptions: [3, 6, 12], img: "KB", color: "#7c3aed", desc: "Premium king size bed with mattress, perfect for comfortable sleep" },
  { id: 2, name: "3-Seater Sofa", category: "Furniture", subcat: "Living Room", icon: "🛋️", monthlyRent: 900, deposit: 1800, rating: 4.7, reviews: 98, available: true, tenureOptions: [3, 6, 12], img: "SS", color: "#0891b2", desc: "Comfortable fabric sofa, ideal for living rooms and studios" },
  { id: 3, name: "Dining Table Set", category: "Furniture", subcat: "Dining", icon: "🪑", monthlyRent: 800, deposit: 1600, rating: 4.6, reviews: 76, available: true, tenureOptions: [6, 12], img: "DT", color: "#059669", desc: "4-seater dining table with chairs, solid wood construction" },
  { id: 4, name: "Study Table", category: "Furniture", subcat: "Study", icon: "📚", monthlyRent: 400, deposit: 800, rating: 4.5, reviews: 54, available: true, tenureOptions: [3, 6, 12], img: "ST", color: "#d97706", desc: "Ergonomic study table with storage, great for WFH setups" },
  { id: 5, name: "Double Door Fridge", category: "Appliances", subcat: "Kitchen", icon: "🧊", monthlyRent: 1500, deposit: 3000, rating: 4.9, reviews: 187, available: true, tenureOptions: [6, 12], img: "DF", color: "#dc2626", desc: "280L double door refrigerator, energy efficient 4-star rating" },
  { id: 6, name: "Washing Machine", category: "Appliances", subcat: "Laundry", icon: "🫧", monthlyRent: 1200, deposit: 2400, rating: 4.8, reviews: 165, available: true, tenureOptions: [6, 12], img: "WM", color: "#7c3aed", desc: "7kg fully automatic front load washing machine" },
  { id: 7, name: "32 inch Smart TV", category: "Appliances", subcat: "Entertainment", icon: "📺", monthlyRent: 800, deposit: 1600, rating: 4.7, reviews: 134, available: false, tenureOptions: [3, 6, 12], img: "TV", color: "#0891b2", desc: "32 inch HD Smart TV with Android OS and Netflix/YouTube" },
  { id: 8, name: "Air Conditioner", category: "Appliances", subcat: "Cooling", icon: "❄️", monthlyRent: 1800, deposit: 3600, rating: 4.6, reviews: 112, available: true, tenureOptions: [3, 6], img: "AC", color: "#059669", desc: "1.5 ton 5-star split AC with installation included" },
  { id: 9, name: "Wardrobe 3-Door", category: "Furniture", subcat: "Bedroom", icon: "🚪", monthlyRent: 700, deposit: 1400, rating: 4.5, reviews: 67, available: true, tenureOptions: [6, 12], img: "WD", color: "#db2777", desc: "3-door wardrobe with mirror, ample storage space" },
  { id: 10, name: "Microwave Oven", category: "Appliances", subcat: "Kitchen", icon: "♨️", monthlyRent: 500, deposit: 1000, rating: 4.4, reviews: 89, available: true, tenureOptions: [3, 6, 12], img: "MW", color: "#d97706", desc: "25L microwave oven with grill and convection modes" },
];

const ORDERS = [
  { id: "RE001", product: "King Size Bed", category: "Furniture", startDate: "2026-03-01", endDate: "2026-09-01", tenure: 6, monthlyRent: 1200, status: "active", nextPayment: "2026-06-01" },
  { id: "RE002", product: "Washing Machine", category: "Appliances", startDate: "2026-02-15", endDate: "2026-08-15", tenure: 6, monthlyRent: 1200, status: "active", nextPayment: "2026-06-15" },
  { id: "RE003", product: "32 inch Smart TV", category: "Appliances", startDate: "2025-12-01", endDate: "2026-03-01", tenure: 3, monthlyRent: 800, status: "completed", nextPayment: null },
];

const ADMIN_STATS = { totalRentals: 842, activeRentals: 634, revenue: 748000, products: 156, maintenance: 12, users: 2841 };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Outfit', sans-serif; background: #f5f3ee; color: #1a1a1a; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 10px; }
  .app { min-height: 100vh; }

  /* NAV */
  .nav { background: #1a1a1a; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .nav-logo { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: #f59e0b; letter-spacing: -0.5px; cursor: pointer; }
  .nav-logo span { color: white; }
  .nav-links { display: flex; gap: 0.5rem; align-items: center; }
  .nav-btn { padding: 7px 16px; border-radius: 8px; border: none; cursor: pointer; font-family: 'Outfit'; font-size: 0.87rem; font-weight: 500; transition: all 0.2s; }
  .nav-btn.ghost { background: transparent; color: #aaa; border: 1px solid #333; } .nav-btn.ghost:hover { border-color: #f59e0b; color: #f59e0b; }
  .nav-btn.primary { background: #f59e0b; color: #1a1a1a; font-weight: 700; } .nav-btn.primary:hover { background: #d97706; }
  .nav-btn.secondary { background: #2a2a2a; color: #f59e0b; border: 1px solid #f59e0b; }
  .role-badge { background: #2a2a2a; color: #f59e0b; padding: 4px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; border: 1px solid #f59e0b; }

  /* HERO */
  .hero { background: #1a1a1a; color: white; padding: 6rem 2rem; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -50%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%); border-radius: 50%; }
  .hero::after { content: ''; position: absolute; bottom: -20%; left: -5%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%); border-radius: 50%; }
  .hero-content { max-width: 1100px; margin: 0 auto; position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .hero-left h1 { font-family: 'Syne', sans-serif; font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.2rem; }
  .hero-left h1 span { color: #f59e0b; }
  .hero-left p { color: #aaa; font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem; }
  .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn-hero { padding: 14px 28px; border-radius: 10px; border: none; cursor: pointer; font-family: 'Outfit'; font-size: 1rem; font-weight: 600; transition: all 0.25s; }
  .btn-hero.yellow { background: #f59e0b; color: #1a1a1a; } .btn-hero.yellow:hover { background: #d97706; transform: translateY(-2px); }
  .btn-hero.outline { background: transparent; color: white; border: 2px solid #444; } .btn-hero.outline:hover { border-color: #f59e0b; color: #f59e0b; }
  .hero-right { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .hero-card { background: #2a2a2a; border-radius: 16px; padding: 1.2rem; border: 1px solid #333; transition: all 0.3s; }
  .hero-card:hover { border-color: #f59e0b; transform: translateY(-4px); }
  .hero-card .hc-icon { font-size: 2rem; margin-bottom: 0.5rem; }
  .hero-card .hc-name { font-weight: 600; font-size: 0.9rem; color: white; }
  .hero-card .hc-price { color: #f59e0b; font-size: 0.82rem; margin-top: 4px; font-weight: 500; }
  .hero-stats { display: flex; gap: 3rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #2a2a2a; }
  .hero-stat .num { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #f59e0b; }
  .hero-stat .lbl { font-size: 0.82rem; color: #888; }

  /* SECTIONS */
  .section { padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; }
  .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #1a1a1a; }
  .section-title span { color: #f59e0b; }
  .section-sub { color: #666; font-size: 1rem; margin-top: 0.3rem; }

  /* PRODUCT CARDS */
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
  .product-card { background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #eee; transition: all 0.25s; cursor: pointer; position: relative; overflow: hidden; }
  .product-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--accent); }
  .product-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.1); border-color: #f59e0b; }
  .pc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .pc-icon { font-size: 2.5rem; }
  .pc-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .pc-badge.avail { background: #dcfce7; color: #16a34a; }
  .pc-badge.unavail { background: #fee2e2; color: #dc2626; }
  .product-card h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.3rem; }
  .product-card .subcat { color: #888; font-size: 0.82rem; margin-bottom: 0.7rem; }
  .product-card p { color: #555; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem; }
  .pc-meta { display: flex; gap: 0.8rem; font-size: 0.82rem; color: #666; margin-bottom: 1rem; flex-wrap: wrap; }
  .pc-footer { display: flex; align-items: center; justify-content: space-between; }
  .pc-price { }
  .pc-price .amount { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: #1a1a1a; }
  .pc-price .unit { font-size: 0.78rem; color: #888; }
  .pc-price .deposit { font-size: 0.75rem; color: #888; margin-top: 2px; }

  /* BUTTONS */
  .btn { padding: 9px 20px; border-radius: 10px; border: none; cursor: pointer; font-family: 'Outfit'; font-weight: 600; font-size: 0.88rem; transition: all 0.2s; }
  .btn.primary { background: #f59e0b; color: #1a1a1a; } .btn.primary:hover { background: #d97706; }
  .btn.outline { background: transparent; border: 1.5px solid #1a1a1a; color: #1a1a1a; } .btn.outline:hover { background: #1a1a1a; color: white; }
  .btn.danger { background: #fee2e2; color: #dc2626; } .btn.success { background: #dcfce7; color: #16a34a; }
  .btn.dark { background: #1a1a1a; color: white; } .btn.dark:hover { background: #333; }
  .btn.sm { padding: 6px 14px; font-size: 0.82rem; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* FILTERS */
  .filters { display: flex; gap: 0.7rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: center; }
  .filter-chip { padding: 7px 18px; border-radius: 20px; border: 1.5px solid #ddd; background: white; cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #555; transition: all 0.2s; font-family: 'Outfit'; }
  .filter-chip.active { background: #1a1a1a; color: #f59e0b; border-color: #1a1a1a; }
  .search-input { padding: 9px 16px; border: 1.5px solid #ddd; border-radius: 10px; font-family: 'Outfit'; font-size: 0.9rem; outline: none; width: 220px; background: white; }
  .search-input:focus { border-color: #f59e0b; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(4px); }
  .modal { background: white; border-radius: 20px; padding: 2rem; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; }
  .modal h2 { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; }
  .form-group { margin-bottom: 1.2rem; }
  .form-group label { display: block; font-size: 0.88rem; font-weight: 600; color: #333; margin-bottom: 0.4rem; }
  .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 14px; border: 1.5px solid #e0e0e0; border-radius: 10px; font-family: 'Outfit'; font-size: 0.95rem; outline: none; transition: border 0.2s; }
  .form-group input:focus, .form-group select:focus { border-color: #f59e0b; }
  .modal-footer { display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end; }
  .tenure-options { display: flex; gap: 0.7rem; flex-wrap: wrap; }
  .tenure-opt { padding: 8px 16px; border-radius: 8px; border: 1.5px solid #ddd; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; }
  .tenure-opt.selected { background: #1a1a1a; color: #f59e0b; border-color: #1a1a1a; }

  /* DASHBOARD */
  .dash { display: flex; min-height: calc(100vh - 64px); }
  .sidebar { width: 220px; background: #1a1a1a; padding: 1.5rem 1rem; flex-shrink: 0; }
  .sidebar-logo { font-family: 'Syne', sans-serif; font-weight: 800; color: #f59e0b; font-size: 1rem; padding: 0.5rem 0.5rem 1.5rem; border-bottom: 1px solid #2a2a2a; margin-bottom: 1rem; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; cursor: pointer; font-size: 0.88rem; font-weight: 500; color: #888; transition: all 0.2s; margin-bottom: 4px; }
  .sidebar-item:hover, .sidebar-item.active { background: #2a2a2a; color: #f59e0b; }
  .sidebar-item .icon { font-size: 1.1rem; }
  .dash-content { flex: 1; padding: 2rem; overflow-y: auto; background: #f5f3ee; }

  /* STATS */
  .stats-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat-card { background: white; border-radius: 14px; padding: 1.2rem; border: 1px solid #eee; }
  .stat-card .st-val { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: #1a1a1a; }
  .stat-card .st-lbl { font-size: 0.82rem; color: #888; margin-top: 2px; }
  .stat-card .st-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
  .stat-card .st-val.yellow { color: #f59e0b; }

  /* TABLE */
  .table-wrap { background: white; border-radius: 14px; border: 1px solid #eee; overflow: hidden; margin-bottom: 1.5rem; }
  .table-head { padding: 1.2rem 1.5rem; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; }
  .table-head h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #fafafa; padding: 10px 16px; text-align: left; font-size: 0.78rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 12px 16px; border-top: 1px solid #f5f5f5; font-size: 0.88rem; }
  tr:hover td { background: #fffbf0; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
  .status-badge.active { background: #dcfce7; color: #16a34a; }
  .status-badge.pending { background: #fff7ed; color: #c2410c; }
  .status-badge.completed { background: #f0f0f0; color: #555; }
  .status-badge.maintenance { background: #fef9c3; color: #854d0e; }

  /* PROFILE HERO */
  .profile-hero { background: #1a1a1a; color: white; border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1.5rem; }
  .profile-avatar { width: 70px; height: 70px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 700; color: #1a1a1a; flex-shrink: 0; }
  .profile-details h2 { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; }
  .profile-details p { color: #aaa; font-size: 0.9rem; margin-top: 4px; }

  /* RENTAL CARD */
  .rental-card { background: white; border-radius: 14px; padding: 1.2rem 1.5rem; border: 1px solid #eee; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; border-left: 4px solid #f59e0b; }
  .rental-info h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; }
  .rental-info p { color: #666; font-size: 0.82rem; margin-top: 3px; }

  /* TOAST */
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: #1a1a1a; color: white; padding: 12px 20px; border-radius: 12px; font-size: 0.9rem; z-index: 9999; animation: slideUp 0.3s ease; box-shadow: 0 8px 30px rgba(0,0,0,0.3); border-left: 4px solid #f59e0b; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* AUTH */
  .auth-page { min-height: 100vh; background: #1a1a1a; display: flex; align-items: center; justify-content: center; padding: 2rem; }
  .auth-box { background: white; border-radius: 20px; padding: 2.5rem; max-width: 420px; width: 100%; }
  .auth-box h2 { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 0.3rem; }
  .auth-box p { color: #666; margin-bottom: 1.5rem; font-size: 0.95rem; }
  .role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; margin-bottom: 1.2rem; }
  .role-opt { padding: 12px; border-radius: 10px; border: 1.5px solid #eee; cursor: pointer; text-align: center; transition: all 0.2s; }
  .role-opt .r-icon { font-size: 1.5rem; } .role-opt .r-lbl { font-size: 0.8rem; font-weight: 600; color: #555; display: block; margin-top: 4px; }
  .role-opt.selected { border-color: #f59e0b; background: #fffbf0; } .role-opt.selected .r-lbl { color: #f59e0b; }

  /* CART */
  .cart-badge { background: #f59e0b; color: #1a1a1a; border-radius: 50%; width: 20px; height: 20px; font-size: 0.7rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; margin-left: 4px; }
  .cart-item { background: white; border-radius: 12px; padding: 1rem 1.2rem; border: 1px solid #eee; margin-bottom: 0.8rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .cart-total { background: #1a1a1a; color: white; border-radius: 14px; padding: 1.5rem; margin-top: 1rem; }
  .cart-total h3 { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; margin-bottom: 0.8rem; }

  /* WHY US */
  .why-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
  .why-card { background: #1a1a1a; color: white; border-radius: 16px; padding: 1.8rem; transition: all 0.25s; }
  .why-card:hover { transform: translateY(-4px); background: #2a2a2a; }
  .why-card .w-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .why-card h3 { font-family: 'Syne', sans-serif; font-weight: 700; margin-bottom: 0.5rem; }
  .why-card p { color: #aaa; font-size: 0.88rem; line-height: 1.6; }

  @media (max-width: 768px) {
    .hero-content { grid-template-columns: 1fr; } .hero-right { display: none; }
    .hero-left h1 { font-size: 2.2rem; } .sidebar { width: 56px; }
    .sidebar-item span { display: none; } .sidebar-logo { display: none; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ─── HELPER ────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast">🎉 {msg}</div>;
}

// ─── RENT MODAL ────────────────────────────────────────────────────────────────
function RentModal({ product, onClose, onRent }) {
  const [tenure, setTenure] = useState(product.tenureOptions[0]);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const total = product.monthlyRent * tenure;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>🛒 Rent This Item</h2>
        <div style={{ background: "#fffbf0", borderRadius: 12, padding: "1rem", marginBottom: "1.2rem", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid #f59e0b" }}>
          <div style={{ fontSize: "2.5rem" }}>{product.icon}</div>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 700 }}>{product.name}</div>
            <div style={{ color: "#666", fontSize: "0.85rem" }}>₹{product.monthlyRent}/month • ₹{product.deposit} deposit</div>
          </div>
        </div>
        <div className="form-group">
          <label>Select Tenure</label>
          <div className="tenure-options">
            {product.tenureOptions.map(t => (
              <div key={t} className={`tenure-opt ${tenure === t ? "selected" : ""}`} onClick={() => setTenure(t)}>{t} Months</div>
            ))}
          </div>
        </div>
        <div className="form-group"><label>Delivery Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} /></div>
        <div className="form-group"><label>Delivery Address</label><textarea rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your full delivery address..." style={{ resize: "vertical" }} /></div>
        <div style={{ background: "#1a1a1a", color: "white", borderRadius: 12, padding: "1rem", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#aaa" }}>
            <span>Monthly Rent</span><span>₹{product.monthlyRent}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#aaa" }}>
            <span>Tenure</span><span>{tenure} months</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#aaa" }}>
            <span>Security Deposit</span><span>₹{product.deposit}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid #333", fontFamily: "Syne", fontWeight: 800 }}>
            <span>Total (first payment)</span><span style={{ color: "#f59e0b" }}>₹{total + product.deposit}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn outline" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => { if (!date || !address) return alert("Please fill all fields"); onRent({ product, tenure, date, address, total }); onClose(); }}>Confirm Rental →</button>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ──────────────────────────────────────────────────────────────────
function HomePage({ onLogin, onRent }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [rentTarget, setRentTarget] = useState(null);

  const filtered = PRODUCTS.filter(p =>
    (filter === "All" || p.category === filter || p.subcat === filter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.subcat.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <div style={{ display: "inline-block", background: "#2a2a2a", color: "#f59e0b", borderRadius: 20, padding: "4px 16px", fontSize: "0.82rem", fontWeight: 600, marginBottom: "1rem", border: "1px solid #f59e0b" }}>
              🏠 India's #1 Furniture & Appliance Rental
            </div>
            <h1>Rent Smart,<br />Live <span>Comfortable</span></h1>
            <p>Affordable monthly rentals for furniture and appliances. Perfect for students, working professionals, and anyone who loves flexibility.</p>
            <div className="hero-btns">
              <button className="btn-hero yellow" onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}>Browse Products</button>
              <button className="btn-hero outline" onClick={() => onLogin("user")}>Sign Up Free</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="num">2,800+</div><div className="lbl">Happy Renters</div></div>
              <div className="hero-stat"><div className="num">156</div><div className="lbl">Products</div></div>
              <div className="hero-stat"><div className="num">4.8★</div><div className="lbl">Rating</div></div>
            </div>
          </div>
          <div className="hero-right">
            {PRODUCTS.slice(0, 4).map(p => (
              <div key={p.id} className="hero-card">
                <div className="hc-icon">{p.icon}</div>
                <div className="hc-name">{p.name}</div>
                <div className="hc-price">from ₹{p.monthlyRent}/mo</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="section" id="products">
        <div className="section-header">
          <div><div className="section-title">Our <span>Products</span></div><div className="section-sub">Browse furniture and appliances for rent</div></div>
        </div>
        <div className="filters">
          <input className="search-input" placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          {["All", "Furniture", "Appliances", "Bedroom", "Living Room", "Kitchen"].map(f => (
            <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="products-grid">
          {filtered.map(p => (
            <div key={p.id} className="product-card" style={{ "--accent": p.available ? "#f59e0b" : "#ddd" }}>
              <div className="pc-header">
                <div className="pc-icon">{p.icon}</div>
                <span className={`pc-badge ${p.available ? "avail" : "unavail"}`}>{p.available ? "Available" : "Rented Out"}</span>
              </div>
              <div className="subcat">{p.category} • {p.subcat}</div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="pc-meta">
                <span>⭐ {p.rating} ({p.reviews})</span>
                <span>📅 {p.tenureOptions.join(", ")} months</span>
              </div>
              <div className="pc-footer">
                <div className="pc-price">
                  <div><span className="amount">₹{p.monthlyRent}</span><span className="unit">/month</span></div>
                  <div className="deposit">Deposit: ₹{p.deposit}</div>
                </div>
                <button className="btn primary sm" disabled={!p.available} onClick={() => setRentTarget(p)}>{p.available ? "Rent Now" : "Unavailable"}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div style={{ background: "#f5f3ee", padding: "4rem 0" }}>
        <div className="section" style={{ padding: "0 2rem" }}>
          <div className="section-header">
            <div><div className="section-title">Why <span>RentEase?</span></div><div className="section-sub">We make renting simple and stress-free</div></div>
          </div>
          <div className="why-grid">
            {[
              { icon: "💰", title: "Save Big", desc: "Save up to 80% compared to buying. No EMIs, no depreciation worries." },
              { icon: "🚚", title: "Free Delivery", desc: "Free delivery and installation for all products across serviceable cities." },
              { icon: "🔧", title: "Free Maintenance", desc: "All repairs and maintenance covered throughout your rental period." },
              { icon: "🔄", title: "Easy Returns", desc: "Schedule pickup anytime. Extend or return at your convenience." },
            ].map((w, i) => (
              <div key={i} className="why-card">
                <div className="w-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {rentTarget && <RentModal product={rentTarget} onClose={() => setRentTarget(null)} onRent={(data) => { onRent(data); setRentTarget(null); }} />}
    </div>
  );
}

// ─── AUTH PAGE ──────────────────────────────────────────────────────────────────
function AuthPage({ mode, defaultRole, onAuth, onSwitch }) {
  const [role, setRole] = useState(defaultRole || "user");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const isLogin = mode === "login";

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏠</div>
          <h2>{isLogin ? "Welcome Back" : "Join RentEase"}</h2>
          <p>{isLogin ? "Sign in to manage your rentals" : "Start renting smarter today"}</p>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.5rem" }}>I am a...</label>
          <div className="role-selector">
            {[{ id: "user", icon: "👤", label: "Customer" }, { id: "admin", icon: "🔧", label: "Admin" }].map(r => (
              <div key={r.id} className={`role-opt ${role === r.id ? "selected" : ""}`} onClick={() => setRole(r.id)}>
                <div className="r-icon">{r.icon}</div>
                <span className="r-lbl">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
        {!isLogin && <div className="form-group"><label>Full Name</label><input placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>}
        <div className="form-group"><label>Email</label><input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-group"><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        <button className="btn primary" style={{ width: "100%", padding: "12px", fontSize: "1rem" }} onClick={() => onAuth(role, form)}>
          {isLogin ? "Sign In →" : "Create Account →"}
        </button>
        <div style={{ textAlign: "center", fontSize: "0.9rem", color: "#666", marginTop: "1rem" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span style={{ color: "#f59e0b", cursor: "pointer", fontWeight: 600 }} onClick={onSwitch}>{isLogin ? "Sign up" : "Sign in"}</span>
        </div>
        {isLogin && <div style={{ marginTop: "1rem", background: "#fffbf0", borderRadius: 10, padding: "0.8rem", fontSize: "0.82rem", color: "#666", border: "1px solid #f59e0b" }}>
          <strong>Demo:</strong> Select a role and click Sign In to explore
        </div>}
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ─────────────────────────────────────────────────────────────
function UserDashboard({ user, rentals, onLogout, onNewRental }) {
  const [tab, setTab] = useState("overview");
  const [rentTarget, setRentTarget] = useState(null);

  const myRentals = [...rentals, ...ORDERS];

  const tabs = [
    { id: "overview", icon: "🏠", label: "Overview" },
    { id: "browse", icon: "🛒", label: "Browse & Rent" },
    { id: "rentals", icon: "📋", label: "My Rentals" },
    { id: "maintenance", icon: "🔧", label: "Maintenance" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="dash">
      <div className="sidebar">
        <div className="sidebar-logo">RentEase</div>
        {tabs.map(t => (
          <div key={t.id} className={`sidebar-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span className="icon">{t.icon}</span><span>{t.label}</span>
          </div>
        ))}
        <div className="sidebar-item" style={{ color: "#dc2626", marginTop: "1rem" }} onClick={onLogout}><span className="icon">🚪</span><span>Logout</span></div>
      </div>
      <div className="dash-content">
        {tab === "overview" && (
          <>
            <div className="profile-hero">
              <div className="profile-avatar">👤</div>
              <div className="profile-details">
                <h2>Welcome, {user.name}!</h2>
                <p>Managing your rentals • Trusted Customer</p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ background: "#2a2a2a", borderRadius: 8, padding: "4px 12px", fontSize: "0.82rem", color: "#f59e0b" }}>📦 {myRentals.length} Rentals</span>
                  <span style={{ background: "#2a2a2a", borderRadius: 8, padding: "4px 12px", fontSize: "0.82rem", color: "#aaa" }}>⭐ Premium Member</span>
                </div>
              </div>
            </div>
            <div className="stats-row">
              <div className="stat-card"><div className="st-icon">📦</div><div className="st-val yellow">{myRentals.length}</div><div className="st-lbl">Total Rentals</div></div>
              <div className="stat-card"><div className="st-icon">✅</div><div className="st-val yellow">{myRentals.filter(r => r.status === "active").length}</div><div className="st-lbl">Active</div></div>
              <div className="stat-card"><div className="st-icon">✔️</div><div className="st-val yellow">{myRentals.filter(r => r.status === "completed").length}</div><div className="st-lbl">Completed</div></div>
              <div className="stat-card"><div className="st-icon">💰</div><div className="st-val yellow">₹{myRentals.filter(r => r.status === "active").reduce((s, r) => s + (r.monthlyRent || r.total || 0), 0).toLocaleString()}</div><div className="st-lbl">Monthly Outflow</div></div>
            </div>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: "1rem" }}>Active Rentals</h3>
            {myRentals.filter(r => r.status === "active").map((r, i) => (
              <div key={i} className="rental-card">
                <div className="rental-info">
                  <h4>{r.product?.name || r.product}</h4>
                  <p>📅 {r.startDate} → {r.endDate} • {r.tenure} months • ₹{r.monthlyRent}/month</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <span className="status-badge active">Active</span>
                  <button className="btn outline sm">Extend</button>
                  <button className="btn sm" style={{ background: "#fee2e2", color: "#dc2626" }}>Return</button>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "browse" && (
          <>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, marginBottom: "0.3rem" }}>Browse & Rent</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>Choose from our wide range of furniture and appliances</p>
            <div className="products-grid">
              {PRODUCTS.filter(p => p.available).map(p => (
                <div key={p.id} className="product-card" style={{ "--accent": "#f59e0b" }}>
                  <div className="pc-header">
                    <div className="pc-icon">{p.icon}</div>
                    <span className="pc-badge avail">Available</span>
                  </div>
                  <div className="subcat">{p.category} • {p.subcat}</div>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="pc-meta"><span>⭐ {p.rating}</span><span>📅 {p.tenureOptions.join(", ")} mo</span></div>
                  <div className="pc-footer">
                    <div className="pc-price">
                      <div><span className="amount">₹{p.monthlyRent}</span><span className="unit">/month</span></div>
                      <div className="deposit">Deposit: ₹{p.deposit}</div>
                    </div>
                    <button className="btn primary sm" onClick={() => setRentTarget(p)}>Rent Now</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {tab === "rentals" && (
          <>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, marginBottom: "1.5rem" }}>My Rentals</h2>
            {myRentals.map((r, i) => (
              <div key={i} className="rental-card">
                <div className="rental-info">
                  <h4>{r.product?.name || r.product}</h4>
                  <p>📅 {r.startDate} → {r.endDate} • ₹{r.monthlyRent}/month</p>
                </div>
                <span className={`status-badge ${r.status}`}>{r.status}</span>
              </div>
            ))}
          </>
        )}
        {tab === "maintenance" && (
          <>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, marginBottom: "1.5rem" }}>Maintenance Requests</h2>
            <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", border: "1px solid #eee", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: "1rem" }}>Raise New Request</h3>
              <div className="form-group"><label>Select Product</label>
                <select><option>King Size Bed</option><option>Washing Machine</option></select>
              </div>
              <div className="form-group"><label>Issue Description</label>
                <textarea rows={3} placeholder="Describe the issue with your rented product..." />
              </div>
              <button className="btn primary">Submit Request</button>
            </div>
            <div className="table-wrap">
              <div className="table-head"><h3>Previous Requests</h3></div>
              <table>
                <thead><tr><th>Product</th><th>Issue</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>Washing Machine</td><td>Not spinning properly</td><td>2026-05-10</td><td><span className="status-badge active">Resolved</span></td></tr>
                  <tr><td>King Size Bed</td><td>Loose bolt in frame</td><td>2026-04-22</td><td><span className="status-badge active">Resolved</span></td></tr>
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "profile" && (
          <>
            <div className="profile-hero">
              <div className="profile-avatar">👤</div>
              <div className="profile-details"><h2>{user.name}</h2><p>{user.email} • Customer</p></div>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", border: "1px solid #eee" }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: "1rem" }}>Personal Details</h3>
              <div className="form-group"><label>Full Name</label><input defaultValue={user.name} /></div>
              <div className="form-group"><label>Email</label><input defaultValue={user.email} /></div>
              <div className="form-group"><label>Phone</label><input placeholder="+91 98765 43210" /></div>
              <div className="form-group"><label>Current Address</label><textarea rows={2} placeholder="Your current address" /></div>
              <button className="btn primary">Save Changes</button>
            </div>
          </>
        )}
      </div>
      {rentTarget && <RentModal product={rentTarget} onClose={() => setRentTarget(null)} onRent={(data) => { onNewRental(data); setRentTarget(null); setTab("rentals"); }} />}
    </div>
  );
}

// ─── ADMIN DASHBOARD ────────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(PRODUCTS);
  const [orders, setOrders] = useState(ORDERS);
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "inventory", icon: "📦", label: "Inventory" },
    { id: "orders", icon: "📋", label: "Orders" },
    { id: "maintenance", icon: "🔧", label: "Maintenance" },
    { id: "analytics", icon: "📈", label: "Analytics" },
  ];

  return (
    <div className="dash">
      <div className="sidebar">
        <div className="sidebar-logo">Admin Panel</div>
        {tabs.map(t => (
          <div key={t.id} className={`sidebar-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span className="icon">{t.icon}</span><span>{t.label}</span>
          </div>
        ))}
        <div className="sidebar-item" style={{ color: "#dc2626", marginTop: "1rem" }} onClick={onLogout}><span className="icon">🚪</span><span>Logout</span></div>
      </div>
      <div className="dash-content">
        {tab === "overview" && (
          <>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, marginBottom: "0.3rem" }}>Admin Dashboard</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <div className="stats-row">
              <div className="stat-card"><div className="st-icon">📦</div><div className="st-val yellow">{ADMIN_STATS.totalRentals}</div><div className="st-lbl">Total Rentals</div></div>
              <div className="stat-card"><div className="st-icon">✅</div><div className="st-val yellow">{ADMIN_STATS.activeRentals}</div><div className="st-lbl">Active Rentals</div></div>
              <div className="stat-card"><div className="st-icon">💰</div><div className="st-val yellow">₹{(ADMIN_STATS.revenue / 1000).toFixed(0)}K</div><div className="st-lbl">Revenue</div></div>
              <div className="stat-card"><div className="st-icon">🛋️</div><div className="st-val yellow">{ADMIN_STATS.products}</div><div className="st-lbl">Products</div></div>
              <div className="stat-card"><div className="st-icon">🔧</div><div className="st-val yellow">{ADMIN_STATS.maintenance}</div><div className="st-lbl">Maintenance</div></div>
              <div className="stat-card"><div className="st-icon">👥</div><div className="st-val yellow">{ADMIN_STATS.users.toLocaleString()}</div><div className="st-lbl">Users</div></div>
            </div>
            <div className="table-wrap">
              <div className="table-head"><h3>Recent Orders</h3></div>
              <table>
                <thead><tr><th>ID</th><th>Product</th><th>Category</th><th>Tenure</th><th>Monthly</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: "monospace", color: "#888", fontSize: "0.8rem" }}>{o.id}</td>
                      <td>{o.product}</td><td>{o.category}</td><td>{o.tenure} months</td>
                      <td>₹{o.monthlyRent.toLocaleString()}</td>
                      <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "inventory" && (
          <>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, marginBottom: "1.5rem" }}>Product Inventory</h2>
            <div className="filters">
              <input className="search-input" placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn primary sm">+ Add Product</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Product</th><th>Category</th><th>Monthly Rent</th><th>Deposit</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
                    <tr key={i}>
                      <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: "1.2rem" }}>{p.icon}</span>{p.name}</div></td>
                      <td>{p.category}</td>
                      <td>₹{p.monthlyRent}</td>
                      <td>₹{p.deposit}</td>
                      <td>⭐ {p.rating}</td>
                      <td><span className={`pc-badge ${p.available ? "avail" : "unavail"}`}>{p.available ? "Available" : "Rented"}</span></td>
                      <td style={{ display: "flex", gap: 4 }}>
                        <button className="btn outline sm" onClick={() => setProducts(prev => prev.map((pr, pi) => pi === i ? { ...pr, available: !pr.available } : pr))}>Toggle</button>
                        <button className="btn sm" style={{ background: "#fee2e2", color: "#dc2626" }} onClick={() => setProducts(prev => prev.filter((_, pi) => pi !== i))}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "orders" && (
          <>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, marginBottom: "1.5rem" }}>All Orders</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Product</th><th>Start</th><th>End</th><th>Tenure</th><th>Rent/mo</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: "monospace", color: "#888", fontSize: "0.8rem" }}>{o.id}</td>
                      <td>{o.product}</td><td>{o.startDate}</td><td>{o.endDate}</td>
                      <td>{o.tenure}mo</td><td>₹{o.monthlyRent}</td>
                      <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                      <td><button className="btn outline sm" onClick={() => setOrders(prev => prev.map((or, oi) => oi === i ? { ...or, status: or.status === "active" ? "completed" : "active" } : or))}>Toggle</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "maintenance" && (
          <>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, marginBottom: "1.5rem" }}>Maintenance Requests</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Customer</th><th>Product</th><th>Issue</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {[
                    { customer: "Rahul Sharma", product: "Washing Machine", issue: "Not spinning", date: "2026-05-18", status: "pending" },
                    { customer: "Priya Singh", product: "AC", issue: "Not cooling", date: "2026-05-17", status: "maintenance" },
                    { customer: "Amit Kumar", product: "Fridge", issue: "Making noise", date: "2026-05-15", status: "active" },
                  ].map((m, i) => (
                    <tr key={i}>
                      <td>{m.customer}</td><td>{m.product}</td><td>{m.issue}</td><td>{m.date}</td>
                      <td><span className={`status-badge ${m.status}`}>{m.status}</span></td>
                      <td><button className="btn success sm">Resolve</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "analytics" && (
          <>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, marginBottom: "1.5rem" }}>Analytics</h2>
            <div className="stats-row">
              <div className="stat-card"><div className="st-icon">📈</div><div className="st-val yellow">+18%</div><div className="st-lbl">Growth MoM</div></div>
              <div className="stat-card"><div className="st-icon">🔄</div><div className="st-val yellow">75%</div><div className="st-lbl">Renewal Rate</div></div>
              <div className="stat-card"><div className="st-icon">⏱️</div><div className="st-val yellow">4.2h</div><div className="st-lbl">Avg Resolution</div></div>
              <div className="stat-card"><div className="st-icon">🏙️</div><div className="st-val yellow">12</div><div className="st-lbl">Cities Served</div></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", border: "1px solid #eee" }}>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: "1rem" }}>Top Categories</h3>
                {[["Appliances", 48, "#f59e0b"], ["Furniture", 35, "#1a1a1a"], ["Bedroom", 10, "#7c3aed"], ["Kitchen", 7, "#059669"]].map(([name, pct, color], i) => (
                  <div key={i} style={{ marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.85rem" }}><span>{name}</span><span style={{ color, fontWeight: 700 }}>{pct}%</span></div>
                    <div style={{ height: 8, background: "#f0f0f0", borderRadius: 10 }}><div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 10 }}></div></div>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", border: "1px solid #eee" }}>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: "1rem" }}>Monthly Revenue</h3>
                {[["Jan", 520], ["Feb", 640], ["Mar", 590], ["Apr", 720], ["May", 748]].map(([month, val], i) => (
                  <div key={i} style={{ marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.85rem" }}><span>{month} 2026</span><span style={{ color: "#f59e0b", fontWeight: 700 }}>₹{val}K</span></div>
                    <div style={{ height: 8, background: "#f0f0f0", borderRadius: 10 }}><div style={{ height: "100%", width: `${(val / 748) * 100}%`, background: "#f59e0b", borderRadius: 10 }}></div></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [toast, setToast] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [defaultRole, setDefaultRole] = useState("user");

  const showToast = (msg) => setToast(msg);

  const handleAuth = (role, form) => {
    const u = { name: form.name || (role === "admin" ? "Admin User" : "Customer"), email: form.email || `${role}@rentease.com`, role };
    setUser(u);
    setPage("dashboard");
    showToast(`Welcome${form.name ? " " + form.name : ""}! Logged in as ${role}`);
  };

  const handleRent = (data) => {
    setRentals(prev => [...prev, {
      id: "RE" + (prev.length + 10),
      product: data.product,
      startDate: data.date,
      endDate: "TBD",
      tenure: parseInt(data.tenure),
      monthlyRent: data.product.monthlyRent,
      status: "active"
    }]);
    showToast(`🛋️ ${data.product.name} rented successfully!`);
  };

  return (
    <div className="app">
      <style>{css}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("home")}>Rent<span>Ease</span></div>
        <div className="nav-links">
          {user ? (
            <>
              <span className="role-badge">{user.role === "admin" ? "🔧 Admin" : "👤 Customer"}</span>
              <button className="nav-btn secondary" onClick={() => setPage("dashboard")}>Dashboard</button>
              <button className="nav-btn ghost" onClick={() => { setUser(null); setPage("home"); showToast("Logged out!"); }}>Logout</button>
            </>
          ) : (
            <>
              <button className="nav-btn ghost" onClick={() => setPage("home")}>Home</button>
              <button className="nav-btn ghost" onClick={() => { setAuthMode("login"); setDefaultRole("user"); setPage("auth"); }}>Sign In</button>
              <button className="nav-btn primary" onClick={() => { setAuthMode("signup"); setDefaultRole("user"); setPage("auth"); }}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {page === "home" && <HomePage onLogin={(role) => { setDefaultRole(role); setAuthMode("login"); setPage("auth"); }} onRent={handleRent} />}
      {page === "auth" && <AuthPage mode={authMode} defaultRole={defaultRole} onAuth={handleAuth} onSwitch={() => setAuthMode(m => m === "login" ? "signup" : "login")} />}
      {page === "dashboard" && user && (
        <>
          {user.role === "admin" && <AdminDashboard onLogout={() => { setUser(null); setPage("home"); }} />}
          {user.role === "user" && <UserDashboard user={user} rentals={rentals} onLogout={() => { setUser(null); setPage("home"); }} onNewRental={handleRent} />}
        </>
      )}

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
