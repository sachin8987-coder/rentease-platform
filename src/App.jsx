import { useState, useEffect } from "react";

// ─── SAMPLE DATA ───────────────────────────────────────────────────────────────
const CAREGIVERS = [
  { id: 1, name: "Dr. Priya Sharma", role: "Nurse", rating: 4.9, reviews: 128, experience: "8 years", price: 800, priceUnit: "hour", available: true, verified: true, location: "Mumbai", services: ["Nursing care", "Post-hospital care"], img: "PS", color: "#2563eb", qualifications: "B.Sc Nursing, ICU Certified" },
  { id: 2, name: "Ramesh Iyer", role: "Elderly Attendant", rating: 4.7, reviews: 89, experience: "5 years", price: 500, priceUnit: "hour", available: true, verified: true, location: "Delhi", services: ["Elderly attendant", "Companionship"], img: "RI", color: "#059669", qualifications: "Certified Caregiver, First Aid" },
  { id: 3, name: "Sunita Patel", role: "Physiotherapist", rating: 4.8, reviews: 104, experience: "10 years", price: 1200, priceUnit: "session", available: false, verified: true, location: "Pune", services: ["Physiotherapy"], img: "SP", color: "#7c3aed", qualifications: "MPT, Sports Rehab Specialist" },
  { id: 4, name: "Anjali Mehta", role: "Nurse", rating: 4.6, reviews: 67, experience: "4 years", price: 700, priceUnit: "hour", available: true, verified: true, location: "Bangalore", services: ["Nursing care", "Elderly attendant"], img: "AM", color: "#db2777", qualifications: "B.Sc Nursing" },
  { id: 5, name: "Vikram Das", role: "Physiotherapist", rating: 4.5, reviews: 45, experience: "6 years", price: 1000, priceUnit: "session", available: true, verified: false, location: "Chennai", services: ["Physiotherapy", "Post-hospital care"], img: "VD", color: "#ea580c", qualifications: "BPT Graduate" },
  { id: 6, name: "Meena Joshi", role: "Elderly Attendant", rating: 4.8, reviews: 112, experience: "7 years", price: 450, priceUnit: "hour", available: true, verified: true, location: "Mumbai", services: ["Elderly attendant", "Companionship"], img: "MJ", color: "#0891b2", qualifications: "Geriatric Care Specialist" },
];

const SERVICES = [
  { id: 1, name: "Nursing Care", icon: "🏥", desc: "Professional in-home nursing by certified nurses", from: 700, category: "Medical" },
  { id: 2, name: "Elderly Attendant", icon: "🤝", desc: "Dedicated attendants for daily personal care", from: 450, category: "Personal" },
  { id: 3, name: "Physiotherapy", icon: "💪", desc: "Home physiotherapy sessions by licensed therapists", from: 1000, category: "Medical" },
  { id: 4, name: "Post-Hospital Care", icon: "🩺", desc: "Specialized care after discharge from hospital", from: 800, category: "Medical" },
];

const ADMIN_STATS = { users: 1284, caregivers: 87, bookings: 342, revenue: 284500, satisfaction: 4.7, activeNow: 24 };

const BOOKINGS_DATA = [
  { id: "BK001", patient: "Ramesh Kumar", caregiver: "Dr. Priya Sharma", service: "Nursing Care", date: "2026-05-20", time: "9:00 AM", status: "active", amount: 2400 },
  { id: "BK002", patient: "Savita Nair", caregiver: "Meena Joshi", service: "Elderly Attendant", date: "2026-05-20", time: "8:00 AM", status: "active", amount: 1800 },
  { id: "BK003", patient: "Arjun Shah", caregiver: "Sunita Patel", service: "Physiotherapy", date: "2026-05-19", time: "4:00 PM", status: "completed", amount: 1200 },
  { id: "BK004", patient: "Leela Menon", caregiver: "Anjali Mehta", service: "Nursing Care", date: "2026-05-21", time: "10:00 AM", status: "pending", amount: 2100 },
  { id: "BK005", patient: "Gopal Rao", caregiver: "Vikram Das", service: "Post-Hospital Care", date: "2026-05-22", time: "9:30 AM", status: "pending", amount: 3200 },
];

// ─── STYLES ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f8f7f4; color: #1a1a2e; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #c5b8f0; border-radius: 10px; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav { background: #fff; border-bottom: 1px solid #e8e5f0; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 20px rgba(100,80,180,0.06); }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #4f3cc9; display: flex; align-items: center; gap: 8px; }
  .nav-links { display: flex; gap: 0.5rem; align-items: center; }
  .nav-btn { padding: 7px 16px; border-radius: 8px; border: none; cursor: pointer; font-family: 'DM Sans'; font-size: 0.87rem; font-weight: 500; transition: all 0.2s; }
  .nav-btn.ghost { background: transparent; color: #555; } .nav-btn.ghost:hover { background: #f0edff; color: #4f3cc9; }
  .nav-btn.primary { background: #4f3cc9; color: white; } .nav-btn.primary:hover { background: #3d2ea0; }
  .nav-btn.secondary { background: #f0edff; color: #4f3cc9; }
  .role-badge { background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }

  /* HERO */
  .hero { background: linear-gradient(135deg, #4f3cc9 0%, #7c5cbf 50%, #a78bfa 100%); color: white; padding: 5rem 2rem; text-align: center; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
  .hero-content { position: relative; max-width: 700px; margin: 0 auto; }
  .hero h1 { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 700; line-height: 1.2; margin-bottom: 1rem; }
  .hero p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; line-height: 1.7; }
  .hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-hero { padding: 14px 28px; border-radius: 12px; border: none; cursor: pointer; font-family: 'DM Sans'; font-size: 1rem; font-weight: 600; transition: all 0.25s; }
  .btn-hero.white { background: white; color: #4f3cc9; } .btn-hero.white:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
  .btn-hero.outline { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.6); } .btn-hero.outline:hover { background: rgba(255,255,255,0.1); }
  .hero-stats { display: flex; gap: 2rem; justify-content: center; margin-top: 3rem; flex-wrap: wrap; }
  .hero-stat { text-align: center; } .hero-stat .num { font-size: 2rem; font-weight: 700; } .hero-stat .lbl { font-size: 0.85rem; opacity: 0.8; }

  /* SECTIONS */
  .section { padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; width: 100%; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: #1a1a2e; }
  .section-sub { color: #666; margin-bottom: 2.5rem; font-size: 1.05rem; }

  /* CARDS */
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
  .card { background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #eee; transition: all 0.25s; cursor: pointer; }
  .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(79,60,201,0.12); border-color: #c5b8f0; }
  .service-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .service-tag { display: inline-block; background: #f0edff; color: #4f3cc9; font-size: 0.75rem; padding: 3px 10px; border-radius: 20px; margin-bottom: 0.5rem; font-weight: 500; }
  .card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.3rem; }
  .card p { color: #666; font-size: 0.9rem; line-height: 1.5; margin-bottom: 0.8rem; }
  .card-price { color: #4f3cc9; font-weight: 700; font-size: 1rem; }

  /* CAREGIVER CARDS */
  .cg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  .cg-card { background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #eee; transition: all 0.25s; }
  .cg-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(79,60,201,0.1); }
  .cg-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .cg-avatar { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1.1rem; flex-shrink: 0; }
  .cg-info h3 { font-weight: 600; font-size: 1rem; } .cg-info .role { color: #666; font-size: 0.85rem; }
  .cg-badges { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.8rem; }
  .badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
  .badge.verified { background: #e8f5e9; color: #2e7d32; } .badge.avail { background: #e8f5e9; color: #2e7d32; }
  .badge.unavail { background: #fce4ec; color: #c62828; } .badge.pending-b { background: #fff3e0; color: #e65100; }
  .cg-meta { display: flex; gap: 1rem; font-size: 0.85rem; color: #555; margin-bottom: 1rem; flex-wrap: wrap; }
  .cg-meta span { display: flex; align-items: center; gap: 4px; }
  .cg-price { display: flex; align-items: center; justify-content: space-between; }
  .price-val { font-weight: 700; color: #4f3cc9; font-size: 1.05rem; }
  .btn { padding: 9px 20px; border-radius: 10px; border: none; cursor: pointer; font-family: 'DM Sans'; font-weight: 600; font-size: 0.88rem; transition: all 0.2s; }
  .btn.primary { background: #4f3cc9; color: white; } .btn.primary:hover { background: #3d2ea0; }
  .btn.outline { background: transparent; border: 1.5px solid #4f3cc9; color: #4f3cc9; } .btn.outline:hover { background: #f0edff; }
  .btn.danger { background: #fee2e2; color: #dc2626; } .btn.success { background: #dcfce7; color: #16a34a; }
  .btn.sm { padding: 6px 14px; font-size: 0.82rem; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(4px); }
  .modal { background: white; border-radius: 20px; padding: 2rem; max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
  .modal h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1.5rem; }
  .form-group { margin-bottom: 1.2rem; }
  .form-group label { display: block; font-size: 0.88rem; font-weight: 600; color: #333; margin-bottom: 0.4rem; }
  .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 14px; border: 1.5px solid #e0ddf5; border-radius: 10px; font-family: 'DM Sans'; font-size: 0.95rem; outline: none; transition: border 0.2s; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #4f3cc9; }
  .modal-footer { display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end; }

  /* DASHBOARD */
  .dash { display: flex; min-height: calc(100vh - 64px); }
  .sidebar { width: 220px; background: white; border-right: 1px solid #eee; padding: 1.5rem 1rem; flex-shrink: 0; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; cursor: pointer; font-size: 0.9rem; font-weight: 500; color: #555; transition: all 0.2s; margin-bottom: 4px; }
  .sidebar-item:hover, .sidebar-item.active { background: #f0edff; color: #4f3cc9; }
  .sidebar-item .icon { font-size: 1.1rem; }
  .dash-content { flex: 1; padding: 2rem; overflow-y: auto; }
  .stats-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat-card { background: white; border-radius: 14px; padding: 1.2rem; border: 1px solid #eee; }
  .stat-card .st-val { font-size: 1.8rem; font-weight: 700; color: #4f3cc9; }
  .stat-card .st-lbl { font-size: 0.82rem; color: #888; margin-top: 2px; }
  .stat-card .st-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }

  /* TABLE */
  .table-wrap { background: white; border-radius: 14px; border: 1px solid #eee; overflow: hidden; }
  .table-head { padding: 1.2rem 1.5rem; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; }
  .table-head h3 { font-weight: 600; font-size: 1rem; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #fafafa; padding: 10px 16px; text-align: left; font-size: 0.82rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 12px 16px; border-top: 1px solid #f0f0f0; font-size: 0.88rem; }
  tr:hover td { background: #fafbff; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
  .status-badge.active { background: #dcfce7; color: #16a34a; }
  .status-badge.pending { background: #fff7ed; color: #c2410c; }
  .status-badge.completed { background: #f0edff; color: #4f3cc9; }
  .status-badge.cancelled { background: #fee2e2; color: #dc2626; }

  /* FILTERS */
  .filters { display: flex; gap: 0.7rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: center; }
  .filter-chip { padding: 6px 16px; border-radius: 20px; border: 1.5px solid #e0ddf5; background: white; cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #555; transition: all 0.2s; }
  .filter-chip.active { background: #4f3cc9; color: white; border-color: #4f3cc9; }
  .search-input { padding: 8px 14px; border: 1.5px solid #e0ddf5; border-radius: 10px; font-family: 'DM Sans'; font-size: 0.9rem; outline: none; width: 220px; }
  .search-input:focus { border-color: #4f3cc9; }

  /* TOAST */
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: #1a1a2e; color: white; padding: 12px 20px; border-radius: 12px; font-size: 0.9rem; z-index: 9999; animation: slideUp 0.3s ease; box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
  .toast.success { background: #16a34a; } .toast.error { background: #dc2626; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* AUTH */
  .auth-page { min-height: 100vh; background: linear-gradient(135deg, #f0edff 0%, #e8f5e9 100%); display: flex; align-items: center; justify-content: center; padding: 2rem; }
  .auth-box { background: white; border-radius: 20px; padding: 2.5rem; max-width: 420px; width: 100%; box-shadow: 0 20px 60px rgba(79,60,201,0.12); }
  .auth-box h2 { font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 0.3rem; }
  .auth-box p { color: #666; margin-bottom: 1.5rem; font-size: 0.95rem; }
  .role-selector { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.7rem; margin-bottom: 1.2rem; }
  .role-opt { padding: 10px; border-radius: 10px; border: 1.5px solid #e0ddf5; cursor: pointer; text-align: center; transition: all 0.2s; }
  .role-opt .r-icon { font-size: 1.4rem; } .role-opt .r-lbl { font-size: 0.78rem; font-weight: 600; color: #555; display: block; margin-top: 4px; }
  .role-opt.selected { border-color: #4f3cc9; background: #f0edff; } .role-opt.selected .r-lbl { color: #4f3cc9; }
  .divider { text-align: center; color: #aaa; font-size: 0.85rem; margin: 1rem 0; position: relative; }
  .divider::before { content: ''; position: absolute; left: 0; top: 50%; width: 42%; height: 1px; background: #eee; }
  .divider::after { content: ''; position: absolute; right: 0; top: 50%; width: 42%; height: 1px; background: #eee; }

  /* BOOKING */
  .booking-card { background: white; border-radius: 14px; padding: 1.2rem; border: 1px solid #eee; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .booking-info h4 { font-weight: 600; font-size: 0.95rem; } .booking-info p { color: #666; font-size: 0.85rem; margin-top: 2px; }
  .booking-actions { display: flex; gap: 0.5rem; }

  /* PROFILE */
  .profile-hero { background: linear-gradient(135deg, #4f3cc9, #7c5cbf); color: white; border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1.5rem; }
  .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 700; }
  .profile-details h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; }
  .profile-details p { opacity: 0.85; font-size: 0.9rem; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .hero h1 { font-size: 2rem; } .sidebar { width: 60px; } .sidebar-item span { display: none; }
    .cg-grid { grid-template-columns: 1fr; } table { font-size: 0.8rem; } .stats-row { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ─── HELPER COMPONENTS ─────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type}`}>{msg}</div>;
}

// ─── BOOKING MODAL ─────────────────────────────────────────────────────────────
function BookingModal({ caregiver, service, onClose, onBook }) {
  const [form, setForm] = useState({ date: "", time: "", duration: "4", type: "hourly", notes: "" });
  const price = caregiver ? caregiver.price : (service ? service.from : 0);
  const hours = parseInt(form.duration) || 1;
  const total = price * hours;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>📅 Book Service</h2>
        {caregiver && (
          <div style={{ background: "#f8f7ff", borderRadius: 12, padding: "1rem", marginBottom: "1.2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
            <div className="cg-avatar" style={{ background: caregiver.color, width: 44, height: 44, fontSize: "0.9rem" }}>{caregiver.img}</div>
            <div><div style={{ fontWeight: 600 }}>{caregiver.name}</div><div style={{ color: "#666", fontSize: "0.85rem" }}>{caregiver.role} • ₹{caregiver.price}/{caregiver.priceUnit}</div></div>
          </div>
        )}
        {service && !caregiver && (
          <div style={{ background: "#f8f7ff", borderRadius: 12, padding: "1rem", marginBottom: "1.2rem" }}>
            <div style={{ fontWeight: 600 }}>{service.icon} {service.name}</div>
            <div style={{ color: "#666", fontSize: "0.85rem" }}>From ₹{service.from}/hour</div>
          </div>
        )}
        <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} min={new Date().toISOString().split("T")[0]} /></div>
        <div className="form-group"><label>Preferred Time</label><input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div>
        <div className="form-group"><label>Duration (hours)</label>
          <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}>
            {[2,4,6,8,12,24].map(h => <option key={h} value={h}>{h} hours</option>)}
          </select>
        </div>
        <div className="form-group"><label>Service Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="hourly">Hourly</option><option value="daily">Daily</option><option value="long-term">Long-term (Monthly)</option>
          </select>
        </div>
        <div className="form-group"><label>Special Notes / Medical Needs</label>
          <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any special requirements, medical conditions..." style={{ resize: "vertical" }} />
        </div>
        <div style={{ background: "#f0edff", borderRadius: 10, padding: "0.8rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontWeight: 600, color: "#333" }}>Estimated Total</span>
          <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#4f3cc9" }}>₹{total.toLocaleString()}</span>
        </div>
        <div className="modal-footer">
          <button className="btn outline" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => { if (!form.date || !form.time) return alert("Please fill all fields"); onBook({ ...form, caregiver, service, total }); onClose(); }}>Confirm Booking</button>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ onLogin, onBook }) {
  const [bookingTarget, setBookingTarget] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredCG = CAREGIVERS.filter(c =>
    (filter === "All" || c.role === filter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 16px", fontSize: "0.85rem", marginBottom: "1rem" }}>🌟 Trusted by 1,200+ families across India</div>
          <h1>Professional Home Care for Your Loved Ones</h1>
          <p>Connect with verified nurses, caregivers, physiotherapists, and attendants who provide compassionate in-home medical and personal care.</p>
          <div className="hero-btns">
            <button className="btn-hero white" onClick={() => document.getElementById("services").scrollIntoView({ behavior: "smooth" })}>Find a Caregiver</button>
            <button className="btn-hero outline" onClick={() => onLogin("caregiver")}>Join as Caregiver</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="num">1,200+</div><div className="lbl">Families Served</div></div>
            <div className="hero-stat"><div className="num">87</div><div className="lbl">Verified Caregivers</div></div>
            <div className="hero-stat"><div className="num">4.7★</div><div className="lbl">Average Rating</div></div>
            <div className="hero-stat"><div className="num">24/7</div><div className="lbl">Support Available</div></div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="section" id="services">
        <div className="section-title">Our Care Services</div>
        <div className="section-sub">Comprehensive home-based healthcare tailored to your needs</div>
        <div className="cards-grid">
          {SERVICES.map(s => (
            <div key={s.id} className="card" onClick={() => setBookingTarget({ service: s })}>
              <div className="service-icon">{s.icon}</div>
              <div className="service-tag">{s.category}</div>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <div className="card-price">From ₹{s.from}/hour →</div>
            </div>
          ))}
        </div>
      </div>

      {/* Caregivers */}
      <div style={{ background: "#f8f7f4" }}>
        <div className="section">
          <div className="section-title">Meet Our Caregivers</div>
          <div className="section-sub">Verified, trained, and background-checked professionals</div>
          <div className="filters">
            <input className="search-input" placeholder="🔍 Search caregivers..." value={search} onChange={e => setSearch(e.target.value)} />
            {["All", "Nurse", "Elderly Attendant", "Physiotherapist"].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="cg-grid">
            {filteredCG.map(cg => (
              <div key={cg.id} className="cg-card">
                <div className="cg-header">
                  <div className="cg-avatar" style={{ background: cg.color }}>{cg.img}</div>
                  <div className="cg-info"><h3>{cg.name}</h3><div className="role">{cg.role} • {cg.location}</div></div>
                </div>
                <div className="cg-badges">
                  {cg.verified && <span className="badge verified">✓ Verified</span>}
                  <span className={`badge ${cg.available ? "avail" : "unavail"}`}>{cg.available ? "Available" : "Unavailable"}</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#555", marginBottom: "0.6rem" }}>{cg.qualifications}</div>
                <div className="cg-meta">
                  <span>⭐ {cg.rating} ({cg.reviews} reviews)</span>
                  <span>🕐 {cg.experience}</span>
                </div>
                <div className="cg-price">
                  <div className="price-val">₹{cg.price}/{cg.priceUnit}</div>
                  <button className="btn primary sm" disabled={!cg.available} onClick={() => setBookingTarget({ caregiver: cg })}>{cg.available ? "Book Now" : "Unavailable"}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Us */}
      <div className="section">
        <div className="section-title">Why Choose Us?</div>
        <div className="section-sub">We make elderly care simple, safe, and reliable</div>
        <div className="cards-grid">
          {[
            { icon: "🛡️", title: "Background Verified", desc: "Every caregiver goes through thorough verification before joining" },
            { icon: "⚡", title: "Quick Booking", desc: "Book a caregiver in under 5 minutes, 24/7 availability" },
            { icon: "📱", title: "Real-time Updates", desc: "Track service status and receive updates at every step" },
            { icon: "⭐", title: "Quality Guaranteed", desc: "Rated 4.7/5 by over 1,200 satisfied families" },
          ].map((f, i) => (
            <div key={i} className="card" style={{ cursor: "default" }}>
              <div className="service-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {bookingTarget && (
        <BookingModal
          caregiver={bookingTarget.caregiver}
          service={bookingTarget.service}
          onClose={() => setBookingTarget(null)}
          onBook={(data) => { onBook(data); setBookingTarget(null); }}
        />
      )}
    </div>
  );
}

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({ mode, defaultRole, onAuth, onSwitch }) {
  const [role, setRole] = useState(defaultRole || "user");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const isLogin = mode === "login";

  const roles = [
    { id: "user", icon: "👴", label: "Family / Patient" },
    { id: "caregiver", icon: "👩‍⚕️", label: "Caregiver" },
    { id: "admin", icon: "🔧", label: "Admin" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏥</div>
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Sign in to manage your care services" : "Join our healthcare platform today"}</p>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.5rem" }}>I am a...</label>
          <div className="role-selector">
            {roles.map(r => (
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
        {!isLogin && <div className="form-group"><label>Phone Number</label><input placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>}
        <button className="btn primary" style={{ width: "100%", padding: "12px", fontSize: "1rem" }} onClick={() => onAuth(role, { ...form, isLogin })}>
          {isLogin ? "Sign In" : "Create Account"} →
        </button>
        <div className="divider">or</div>
        <div style={{ textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span style={{ color: "#4f3cc9", cursor: "pointer", fontWeight: 600 }} onClick={onSwitch}>{isLogin ? "Sign up" : "Sign in"}</span>
        </div>
        {isLogin && (
          <div style={{ marginTop: "1rem", background: "#f0edff", borderRadius: 10, padding: "0.8rem", fontSize: "0.82rem", color: "#555" }}>
            <strong>Demo:</strong> Select a role and click Sign In to explore the platform
          </div>
        )}
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ────────────────────────────────────────────────────────────
function UserDashboard({ user, bookings, onLogout, onBook, onNewBooking }) {
  const [tab, setTab] = useState("overview");
  const [bookingModal, setBookingModal] = useState(null);

  const myBookings = bookings.filter(b => b.userRole === "user");

  const tabs = [
    { id: "overview", icon: "🏠", label: "Overview" },
    { id: "book", icon: "📅", label: "Book Service" },
    { id: "bookings", icon: "📋", label: "My Bookings" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="dash">
      <div className="sidebar">
        {tabs.map(t => (
          <div key={t.id} className={`sidebar-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span className="icon">{t.icon}</span><span>{t.label}</span>
          </div>
        ))}
        <div className="sidebar-item" style={{ marginTop: "auto", color: "#dc2626" }} onClick={onLogout}><span className="icon">🚪</span><span>Logout</span></div>
      </div>
      <div className="dash-content">
        {tab === "overview" && (
          <>
            <div className="profile-hero">
              <div className="profile-avatar">👴</div>
              <div className="profile-details">
                <h2>Welcome, {user.name}!</h2>
                <p>Managing care for your loved ones</p>
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 12px", fontSize: "0.85rem" }}>📋 {myBookings.length} Bookings</span>
                  <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 12px", fontSize: "0.85rem" }}>⭐ Trusted Member</span>
                </div>
              </div>
            </div>
            <div className="stats-row">
              <div className="stat-card"><div className="st-icon">📅</div><div className="st-val">{myBookings.length}</div><div className="st-lbl">Total Bookings</div></div>
              <div className="stat-card"><div className="st-icon">✅</div><div className="st-val">{myBookings.filter(b => b.status === "completed").length}</div><div className="st-lbl">Completed</div></div>
              <div className="stat-card"><div className="st-icon">🔄</div><div className="st-val">{myBookings.filter(b => b.status === "active").length}</div><div className="st-lbl">Active</div></div>
              <div className="stat-card"><div className="st-icon">💰</div><div className="st-val">₹{myBookings.reduce((s, b) => s + (b.total || 0), 0).toLocaleString()}</div><div className="st-lbl">Total Spent</div></div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Recent Bookings</h3>
              {myBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#888", background: "white", borderRadius: 14, border: "1px solid #eee" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
                  <p>No bookings yet. <span style={{ color: "#4f3cc9", cursor: "pointer", fontWeight: 600 }} onClick={() => setTab("book")}>Book a caregiver now →</span></p>
                </div>
              ) : myBookings.slice(0, 3).map((b, i) => (
                <div key={i} className="booking-card">
                  <div className="booking-info">
                    <h4>{b.caregiver?.name || "Caregiver"} — {b.caregiver?.role || b.service?.name}</h4>
                    <p>📅 {b.date} at {b.time} • {b.duration}h • ₹{b.total?.toLocaleString()}</p>
                  </div>
                  <span className={`status-badge ${b.status || "pending"}`}>{b.status || "Pending"}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {tab === "book" && (
          <>
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "0.3rem" }}>Book a Service</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>Choose a service or browse caregivers</p>
            <div className="cards-grid" style={{ marginBottom: "2rem" }}>
              {SERVICES.map(s => (
                <div key={s.id} className="card" onClick={() => setBookingModal({ service: s })}>
                  <div className="service-icon">{s.icon}</div>
                  <div className="service-tag">{s.category}</div>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                  <div className="card-price">From ₹{s.from}/hour →</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Or Pick a Caregiver Directly</h3>
            <div className="cg-grid">
              {CAREGIVERS.filter(c => c.available).map(cg => (
                <div key={cg.id} className="cg-card">
                  <div className="cg-header">
                    <div className="cg-avatar" style={{ background: cg.color }}>{cg.img}</div>
                    <div className="cg-info"><h3>{cg.name}</h3><div className="role">{cg.role}</div></div>
                  </div>
                  <div className="cg-meta"><span>⭐ {cg.rating}</span><span>🕐 {cg.experience}</span><span>📍 {cg.location}</span></div>
                  <div className="cg-price">
                    <div className="price-val">₹{cg.price}/{cg.priceUnit}</div>
                    <button className="btn primary sm" onClick={() => setBookingModal({ caregiver: cg })}>Book</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {tab === "bookings" && (
          <>
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "1.5rem" }}>My Bookings</h2>
            {[...myBookings, ...BOOKINGS_DATA.slice(0, 2)].map((b, i) => (
              <div key={i} className="booking-card">
                <div className="booking-info">
                  <h4>{b.caregiver?.name || b.caregiver} — {b.service?.name || b.service}</h4>
                  <p>📅 {b.date} at {b.time || ""} • ₹{(b.total || b.amount)?.toLocaleString()}</p>
                </div>
                <div className="booking-actions">
                  <span className={`status-badge ${b.status || "pending"}`}>{b.status || "Pending"}</span>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "profile" && (
          <>
            <div className="profile-hero">
              <div className="profile-avatar">👴</div>
              <div className="profile-details">
                <h2>{user.name}</h2>
                <p>{user.email} • {user.phone || "+91 98765 43210"}</p>
              </div>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", border: "1px solid #eee" }}>
              <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Patient Profile</h3>
              <div className="form-group"><label>Full Name</label><input defaultValue={user.name} /></div>
              <div className="form-group"><label>Email</label><input defaultValue={user.email} /></div>
              <div className="form-group"><label>Phone</label><input defaultValue="+91 98765 43210" /></div>
              <div className="form-group"><label>Patient Age</label><input placeholder="Age of patient needing care" /></div>
              <div className="form-group"><label>Medical Conditions</label><textarea rows={3} placeholder="List any medical conditions, allergies..." /></div>
              <div className="form-group"><label>Address</label><textarea rows={2} placeholder="Home address for service delivery" /></div>
              <button className="btn primary">Save Changes</button>
            </div>
          </>
        )}
      </div>
      {bookingModal && (
        <BookingModal
          caregiver={bookingModal.caregiver}
          service={bookingModal.service}
          onClose={() => setBookingModal(null)}
          onBook={(data) => { onNewBooking({ ...data, status: "pending", userRole: "user" }); setBookingModal(null); setTab("bookings"); }}
        />
      )}
    </div>
  );
}

// ─── CAREGIVER DASHBOARD ───────────────────────────────────────────────────────
function CaregiverDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [requests, setRequests] = useState(BOOKINGS_DATA.slice(0, 3));

  const tabs = [
    { id: "overview", icon: "🏠", label: "Overview" },
    { id: "requests", icon: "📨", label: "Requests" },
    { id: "schedule", icon: "📅", label: "Schedule" },
    { id: "earnings", icon: "💰", label: "Earnings" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="dash">
      <div className="sidebar">
        {tabs.map(t => (
          <div key={t.id} className={`sidebar-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span className="icon">{t.icon}</span><span>{t.label}</span>
          </div>
        ))}
        <div className="sidebar-item" style={{ color: "#dc2626" }} onClick={onLogout}><span className="icon">🚪</span><span>Logout</span></div>
      </div>
      <div className="dash-content">
        {tab === "overview" && (
          <>
            <div className="profile-hero">
              <div className="profile-avatar">👩‍⚕️</div>
              <div className="profile-details">
                <h2>Dr. {user.name}</h2>
                <p>Registered Nurse • Mumbai • ✓ Verified</p>
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 12px", fontSize: "0.85rem" }}>⭐ 4.9 Rating</span>
                  <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 12px", fontSize: "0.85rem" }}>✅ Active Status</span>
                </div>
              </div>
            </div>
            <div className="stats-row">
              <div className="stat-card"><div className="st-icon">📅</div><div className="st-val">24</div><div className="st-lbl">Total Jobs</div></div>
              <div className="stat-card"><div className="st-icon">⏳</div><div className="st-val">3</div><div className="st-lbl">Pending</div></div>
              <div className="stat-card"><div className="st-icon">⭐</div><div className="st-val">4.9</div><div className="st-lbl">Rating</div></div>
              <div className="stat-card"><div className="st-icon">💰</div><div className="st-val">₹38,400</div><div className="st-lbl">This Month</div></div>
            </div>
            <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Pending Requests</h3>
            {requests.filter(r => r.status === "pending").map((r, i) => (
              <div key={i} className="booking-card">
                <div className="booking-info">
                  <h4>{r.patient} — {r.service}</h4>
                  <p>📅 {r.date} at {r.time} • ₹{r.amount.toLocaleString()}</p>
                </div>
                <div className="booking-actions">
                  <button className="btn success sm" onClick={() => setRequests(prev => prev.map((rb, ri) => ri === i ? { ...rb, status: "active" } : rb))}>Accept</button>
                  <button className="btn danger sm" onClick={() => setRequests(prev => prev.map((rb, ri) => ri === i ? { ...rb, status: "cancelled" } : rb))}>Decline</button>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "requests" && (
          <>
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "1.5rem" }}>Service Requests</h2>
            {requests.map((r, i) => (
              <div key={i} className="booking-card">
                <div className="booking-info">
                  <h4>{r.patient} — {r.service}</h4>
                  <p>📅 {r.date} at {r.time} • ₹{r.amount.toLocaleString()}</p>
                </div>
                <div className="booking-actions">
                  <span className={`status-badge ${r.status}`}>{r.status}</span>
                  {r.status === "pending" && <>
                    <button className="btn success sm" onClick={() => setRequests(prev => prev.map((rb, ri) => ri === i ? { ...rb, status: "active" } : rb))}>✓ Accept</button>
                    <button className="btn danger sm" onClick={() => setRequests(prev => prev.map((rb, ri) => ri === i ? { ...rb, status: "cancelled" } : rb))}>✗ Decline</button>
                  </>}
                  {r.status === "active" && <button className="btn outline sm" onClick={() => setRequests(prev => prev.map((rb, ri) => ri === i ? { ...rb, status: "completed" } : rb))}>Mark Complete</button>}
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "schedule" && (
          <>
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "1.5rem" }}>My Schedule</h2>
            <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", border: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: 600 }}>May 2026</h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn outline sm">← Prev</button>
                  <button className="btn outline sm">Next →</button>
                </div>
              </div>
              {["Mon 19", "Tue 20", "Wed 21", "Thu 22", "Fri 23"].map((day, i) => (
                <div key={i} style={{ padding: "0.8rem 0", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 60, fontWeight: 600, color: i === 1 ? "#4f3cc9" : "#333", fontSize: "0.9rem" }}>{day}</div>
                  {i === 1 ? (
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 12px", borderRadius: 8, fontSize: "0.82rem" }}>9AM–1PM: Nursing (Ramesh Kumar)</span>
                      <span style={{ background: "#f0edff", color: "#4f3cc9", padding: "4px 12px", borderRadius: 8, fontSize: "0.82rem" }}>3PM–5PM: Post-Hospital (Savita)</span>
                    </div>
                  ) : i === 3 ? (
                    <span style={{ background: "#fff7ed", color: "#c2410c", padding: "4px 12px", borderRadius: 8, fontSize: "0.82rem" }}>10AM: Pending request</span>
                  ) : (
                    <span style={{ color: "#aaa", fontSize: "0.85rem" }}>No appointments</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {tab === "earnings" && (
          <>
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "1.5rem" }}>Earnings</h2>
            <div className="stats-row">
              <div className="stat-card"><div className="st-icon">💰</div><div className="st-val">₹38,400</div><div className="st-lbl">This Month</div></div>
              <div className="stat-card"><div className="st-icon">📈</div><div className="st-val">₹1,84,000</div><div className="st-lbl">This Year</div></div>
              <div className="stat-card"><div className="st-icon">⏱️</div><div className="st-val">96h</div><div className="st-lbl">Hours Worked</div></div>
              <div className="stat-card"><div className="st-icon">📋</div><div className="st-val">24</div><div className="st-lbl">Jobs Done</div></div>
            </div>
            <div className="table-wrap">
              <div className="table-head"><h3>Payment History</h3></div>
              <table>
                <thead><tr><th>Patient</th><th>Service</th><th>Date</th><th>Hours</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {BOOKINGS_DATA.map((b, i) => (
                    <tr key={i}><td>{b.patient}</td><td>{b.service}</td><td>{b.date}</td><td>{Math.floor(b.amount / 800)}h</td><td>₹{b.amount.toLocaleString()}</td><td><span className={`status-badge ${b.status}`}>{b.status}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "profile" && (
          <>
            <div className="profile-hero">
              <div className="profile-avatar">👩‍⚕️</div>
              <div className="profile-details"><h2>{user.name}</h2><p>Nurse • Verified Caregiver</p></div>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", border: "1px solid #eee" }}>
              <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Professional Profile</h3>
              <div className="form-group"><label>Full Name</label><input defaultValue={user.name} /></div>
              <div className="form-group"><label>Specialization</label><select><option>Nursing Care</option><option>Physiotherapy</option><option>Elderly Attendant</option></select></div>
              <div className="form-group"><label>Experience (Years)</label><input type="number" defaultValue="8" /></div>
              <div className="form-group"><label>Hourly Rate (₹)</label><input type="number" defaultValue="800" /></div>
              <div className="form-group"><label>Service Area</label><input defaultValue="Mumbai, Pune" /></div>
              <div className="form-group"><label>Qualifications & Certifications</label><textarea rows={3} defaultValue="B.Sc Nursing, ICU Certified, BLS Trained" /></div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button className="btn primary">Save Profile</button>
                <button className="btn outline">Toggle Availability</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [caregivers, setCaregivers] = useState(CAREGIVERS);
  const [bookings, setBookings] = useState(BOOKINGS_DATA);
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "caregivers", icon: "👩‍⚕️", label: "Caregivers" },
    { id: "bookings", icon: "📋", label: "Bookings" },
    { id: "analytics", icon: "📈", label: "Analytics" },
  ];

  return (
    <div className="dash">
      <div className="sidebar">
        <div style={{ padding: "0.5rem 0.5rem 1rem", fontFamily: "Playfair Display", fontWeight: 700, color: "#4f3cc9", fontSize: "0.95rem" }}>Admin Panel</div>
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
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "0.3rem" }}>Admin Dashboard</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>Platform overview — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <div className="stats-row">
              <div className="stat-card"><div className="st-icon">👥</div><div className="st-val">{ADMIN_STATS.users.toLocaleString()}</div><div className="st-lbl">Total Users</div></div>
              <div className="stat-card"><div className="st-icon">👩‍⚕️</div><div className="st-val">{ADMIN_STATS.caregivers}</div><div className="st-lbl">Caregivers</div></div>
              <div className="stat-card"><div className="st-icon">📋</div><div className="st-val">{ADMIN_STATS.bookings}</div><div className="st-lbl">Bookings</div></div>
              <div className="stat-card"><div className="st-icon">💰</div><div className="st-val">₹{(ADMIN_STATS.revenue / 1000).toFixed(0)}K</div><div className="st-lbl">Revenue</div></div>
              <div className="stat-card"><div className="st-icon">⭐</div><div className="st-val">{ADMIN_STATS.satisfaction}</div><div className="st-lbl">Avg Rating</div></div>
              <div className="stat-card"><div className="st-icon">🟢</div><div className="st-val">{ADMIN_STATS.activeNow}</div><div className="st-lbl">Active Now</div></div>
            </div>
            <div className="table-wrap">
              <div className="table-head"><h3>Recent Bookings</h3><span style={{ color: "#888", fontSize: "0.85rem" }}>{bookings.length} total</span></div>
              <table>
                <thead><tr><th>ID</th><th>Patient</th><th>Caregiver</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: "monospace", color: "#888" }}>{b.id}</td>
                      <td>{b.patient}</td><td>{b.caregiver}</td><td>{b.service}</td><td>{b.date}</td>
                      <td>₹{b.amount.toLocaleString()}</td>
                      <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                      <td><button className="btn outline sm" onClick={() => setBookings(prev => prev.map((bk, bi) => bi === i ? { ...bk, status: bk.status === "active" ? "completed" : "active" } : bk))}>Toggle</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "caregivers" && (
          <>
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "1.5rem" }}>Caregiver Management</h2>
            <div className="filters">
              <input className="search-input" placeholder="🔍 Search caregivers..." value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn primary sm">+ Add Caregiver</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Role</th><th>Location</th><th>Rating</th><th>Status</th><th>Verified</th><th>Actions</th></tr></thead>
                <tbody>
                  {caregivers.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((cg, i) => (
                    <tr key={i}>
                      <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: cg.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem", fontWeight: 700 }}>{cg.img}</div>{cg.name}</div></td>
                      <td>{cg.role}</td><td>{cg.location}</td>
                      <td>⭐ {cg.rating}</td>
                      <td><span className={`badge ${cg.available ? "avail" : "unavail"}`}>{cg.available ? "Active" : "Inactive"}</span></td>
                      <td><span className={`badge ${cg.verified ? "verified" : "pending-b"}`}>{cg.verified ? "✓ Verified" : "Pending"}</span></td>
                      <td style={{ display: "flex", gap: 4 }}>
                        {!cg.verified && <button className="btn success sm" onClick={() => setCaregivers(prev => prev.map((c, ci) => ci === i ? { ...c, verified: true } : c))}>Verify</button>}
                        <button className="btn danger sm" onClick={() => setCaregivers(prev => prev.filter((_, ci) => ci !== i))}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "bookings" && (
          <>
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "1.5rem" }}>All Bookings</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Patient</th><th>Caregiver</th><th>Service</th><th>Date</th><th>Time</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: "monospace", color: "#888", fontSize: "0.8rem" }}>{b.id}</td>
                      <td>{b.patient}</td><td>{b.caregiver}</td><td>{b.service}</td><td>{b.date}</td><td>{b.time}</td>
                      <td>₹{b.amount.toLocaleString()}</td>
                      <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "users" && (
          <>
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "1.5rem" }}>User Management</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Joined</th><th>Bookings</th><th>Status</th></tr></thead>
                <tbody>
                  {[
                    { name: "Ramesh Kumar", email: "ramesh@email.com", type: "Family", joined: "Jan 2026", bookings: 4, status: "active" },
                    { name: "Savita Nair", email: "savita@email.com", type: "Family", joined: "Feb 2026", bookings: 2, status: "active" },
                    { name: "Arjun Shah", email: "arjun@email.com", type: "Family", joined: "Mar 2026", bookings: 1, status: "inactive" },
                    { name: "Leela Menon", email: "leela@email.com", type: "Family", joined: "Apr 2026", bookings: 3, status: "active" },
                  ].map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td><td>{u.email}</td><td>{u.type}</td><td>{u.joined}</td><td>{u.bookings}</td>
                      <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "analytics" && (
          <>
            <h2 style={{ fontFamily: "Playfair Display", marginBottom: "1.5rem" }}>Platform Analytics</h2>
            <div className="stats-row">
              <div className="stat-card"><div className="st-icon">📈</div><div className="st-val">+23%</div><div className="st-lbl">User Growth (MoM)</div></div>
              <div className="stat-card"><div className="st-icon">🔄</div><div className="st-val">78%</div><div className="st-lbl">Booking Completion</div></div>
              <div className="stat-card"><div className="st-icon">⏱️</div><div className="st-val">8 min</div><div className="st-lbl">Avg Response Time</div></div>
              <div className="stat-card"><div className="st-icon">🔁</div><div className="st-val">64%</div><div className="st-lbl">Repeat Customers</div></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", border: "1px solid #eee" }}>
                <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Top Services</h3>
                {[["Nursing Care", 42, "#4f3cc9"], ["Elderly Attendant", 31, "#059669"], ["Physiotherapy", 18, "#7c3aed"], ["Post-Hospital", 9, "#db2777"]].map(([name, pct, color], i) => (
                  <div key={i} style={{ marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.85rem" }}><span>{name}</span><span style={{ color, fontWeight: 600 }}>{pct}%</span></div>
                    <div style={{ height: 8, background: "#f0f0f0", borderRadius: 10, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 10 }}></div></div>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", border: "1px solid #eee" }}>
                <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Monthly Revenue</h3>
                {[["Jan", 180], ["Feb", 220], ["Mar", 195], ["Apr", 260], ["May", 285]].map(([month, val], i) => (
                  <div key={i} style={{ marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.85rem" }}><span>{month} 2026</span><span style={{ color: "#4f3cc9", fontWeight: 600 }}>₹{val}K</span></div>
                    <div style={{ height: 8, background: "#f0f0f0", borderRadius: 10, overflow: "hidden" }}><div style={{ height: "100%", width: `${(val / 285) * 100}%`, background: "#4f3cc9", borderRadius: 10 }}></div></div>
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

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home"); // home | login | signup | dashboard
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [toast, setToast] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [defaultRole, setDefaultRole] = useState("user");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); };

  const handleAuth = (role, form) => {
    const names = { user: "Valued User", caregiver: "Care Provider", admin: "Administrator" };
    const u = { name: form.name || names[role], email: form.email || `${role}@careplatform.com`, role, phone: form.phone };
    setUser(u);
    setPage("dashboard");
    showToast(`Welcome${form.name ? ", " + form.name : ""}! Logged in as ${role}`, "success");
  };

  const handleBook = (data) => {
    setBookings(prev => [...prev, { ...data, status: "pending", userRole: "user", id: "BK" + (prev.length + 10) }]);
    showToast("✅ Booking confirmed! Caregiver will contact you shortly.", "success");
  };

  return (
    <div className="app">
      <style>{css}</style>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>🏥 ElderCare</div>
        <div className="nav-links">
          {user ? (
            <>
              <span className="role-badge">{user.role === "admin" ? "🔧 Admin" : user.role === "caregiver" ? "👩‍⚕️ Caregiver" : "👴 Family"}</span>
              <button className="nav-btn secondary" onClick={() => setPage("dashboard")}>Dashboard</button>
              <button className="nav-btn ghost" onClick={() => { setUser(null); setPage("home"); showToast("Logged out successfully"); }}>Logout</button>
            </>
          ) : (
            <>
              <button className="nav-btn ghost" onClick={() => { setPage("home"); }}>Home</button>
              <button className="nav-btn ghost" onClick={() => { setAuthMode("login"); setDefaultRole("caregiver"); setPage("auth"); }}>For Caregivers</button>
              <button className="nav-btn ghost" onClick={() => { setAuthMode("login"); setDefaultRole("user"); setPage("auth"); }}>Sign In</button>
              <button className="nav-btn primary" onClick={() => { setAuthMode("signup"); setDefaultRole("user"); setPage("auth"); }}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* PAGES */}
      {page === "home" && <HomePage onLogin={(role) => { setDefaultRole(role); setAuthMode("login"); setPage("auth"); }} onBook={handleBook} />}
      {page === "auth" && <AuthPage mode={authMode} defaultRole={defaultRole} onAuth={handleAuth} onSwitch={() => setAuthMode(m => m === "login" ? "signup" : "login")} />}
      {page === "dashboard" && user && (
        <>
          {user.role === "admin" && <AdminDashboard onLogout={() => { setUser(null); setPage("home"); }} />}
          {user.role === "caregiver" && <CaregiverDashboard user={user} onLogout={() => { setUser(null); setPage("home"); }} />}
          {user.role === "user" && <UserDashboard user={user} bookings={bookings} onLogout={() => { setUser(null); setPage("home"); }} onBook={handleBook} onNewBooking={handleBook} />}
        </>
      )}

      {/* TOAST */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
