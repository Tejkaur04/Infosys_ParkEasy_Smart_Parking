import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   API LAYER  — connects to Spring Boot at localhost:8080/api
═══════════════════════════════════════════════════════════ */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";


const api = {
  
  _token: () => localStorage.getItem("pw_token"),
  

  _hdr(extra = {}) {
    const h = { "Content-Type": "application/json", ...extra };
    const t = this._token();
    if (t) h["Authorization"] = `Bearer ${t}`;
    return h;
  },
  

  async _req(method, path, body) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        method,
        headers: api._hdr(),
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (path.includes("/spots")) {
      return MOCK.spots();
      }
     
      if (!res.ok) throw new Error(data.message || data.error || `HTTP ${res.status}`);
      return data;
    }catch (e) {
  console.warn("Using MOCK data for:", path);

   if (path.includes("/auth/login")) {
  return MOCK.auth.login(body?.email, body?.password);
}

  if (path.includes("parking-locations") && path.includes("spots")) {
    return MOCK.spots();
  }

  if (path.includes("parking-locations")) {
    return MOCK.locations;
  }

  if (path.includes("bookings")) {
    return MOCK.bookings;
  }

  if (path.includes("dashboard")) {
    return MOCK.dashboard;
  }

  return [];
}
    // } catch (e) {
    //   // Fallback to mock data when backend is unavailable
    //   console.warn("API unavailable, using mock:", path);
    //   // throw e;
    //   // return mockData;
    //   return null;
    // }
  },

  

  get:    (p)    => api._req("GET", p),
  post:   (p, b) => api._req("POST", p, b),
  put:    (p, b) => api._req("PUT", p, b),
  delete: (p)    => api._req("DELETE", p),
  patch:  (p, b) => api._req("PATCH", p, b),

  // ── Auth ──
  auth: {
    login:    (email, password) => api.post("/auth/login", { email, password }),
    register: (data)            => api.post("/auth/register", data),
    me:       ()                => api.get("/auth/me"),
    logout:   ()                => { localStorage.removeItem("pw_token"); localStorage.removeItem("pw_user"); },
    forgot:   (email)           => api.post("/auth/forgot-password", { email }),
  },

  // ── Locations ──
  locations: {
    list:   (params = {}) => api.get(`/parking-locations?${new URLSearchParams(params)}`),
    get:    (id)          => api.get(`/parking-locations/${id}`),
    spots:  (id, floor)   => api.get(`/parking-locations/${id}/spots${floor ? `?floor=${floor}` : ""}`),
    nearby: (lat, lng)    => api.get(`/parking-locations/nearby?lat=${lat}&lng=${lng}&radiusKm=10`),
    create: (data)        => api.post("/parking-locations", data),
    update: (id, data)    => api.put(`/parking-locations/${id}`, data),
    delete: (id)          => api.delete(`/parking-locations/${id}`),
  },

  // ── Bookings ──
  bookings: {
    list:   (params = {}) => api.get(`/bookings?${new URLSearchParams(params)}`),
    get:    (id)          => api.get(`/bookings/${id}`),
    create: (data)        => api.post("/bookings", data),
    cancel: (id, reason)  => api.patch(`/bookings/${id}/cancel`, { reason }),
    active: ()            => api.get("/bookings/active"),
    stats:  ()            => api.get("/bookings/stats"),
  },

  // ── Payments ──
  payments: {
    process: (data) => api.post("/payments/process", data),
    list:    ()     => api.get("/payments"),
    get:     (id)   => api.get(`/payments/${id}`),
    refund:  (id, amount) => api.post(`/payments/${id}/refund`, { amount }),
  },

  // ── User ──
  user: {
    profile:        ()     => api.get("/users/me"),
    update:         (data) => api.put("/users/me", data),
    changePassword: (data) => api.put("/users/me/password", data),
    vehicles:       ()     => api.get("/users/me/vehicles"),
    addVehicle:     (data) => api.post("/users/me/vehicles", data),
    notifications:  ()     => api.get("/users/me/notifications"),
  },

  // ── Dashboard ──
  dashboard: {
    get:      ()       => api.get("/dashboard"),
    spending: (months) => api.get(`/dashboard/spending?months=${months}`),
  },

  // ── Support ──
  support: {
    submit: (data) => api.post("/support/tickets", data),
    list:   ()     => api.get("/support/tickets/my"),
  },

  // ── Admin ──
  admin: {
    stats:       ()     => api.get("/admin/stats"),
    users:       (p={}) => api.get(`/admin/users?${new URLSearchParams(p)}`),
    userToggle:  (id)   => api.patch(`/admin/users/${id}/toggle`),
    bookings:    (p={}) => api.get(`/admin/bookings?${new URLSearchParams(p)}`),
    payments:    (p={}) => api.get(`/admin/payments?${new URLSearchParams(p)}`),
    locations:   ()     => api.get("/admin/locations"),
    tickets:     ()     => api.get("/admin/support/tickets"),
    ticketReply: (id, msg) => api.post(`/admin/support/tickets/${id}/reply`, { message: msg }),
  },
};
console.log("TOKEN:", localStorage.getItem("pw_token"));

/* ═══════════════════════════════════════════════════════════
   MOCK DATA (used as fallback when backend is offline)
═══════════════════════════════════════════════════════════ */
const MOCK = {
  
  locations: [
    { id:1, name:"Downtown Central", address:"123 Main Street", city:"New York", state:"NY", availableSpots:45, totalSpots:200, hourlyRate:5.00, dailyRate:35, rating:4.5, totalReviews:128, isCovered:true, hasEvCharging:true, hasSecurity:true, is24Hours:true, latitude:40.7128, longitude:-74.006 },
    { id:2, name:"Airport Terminal Garage", address:"1 Airport Blvd", city:"New York", state:"NY", availableSpots:120, totalSpots:500, hourlyRate:8.00, dailyRate:50, rating:4.2, totalReviews:89, isCovered:true, hasEvCharging:false, hasSecurity:true, is24Hours:true, latitude:40.6413, longitude:-73.7781 },
    { id:3, name:"Midtown Smart Lot", address:"456 Park Ave", city:"New York", state:"NY", availableSpots:23, totalSpots:100, hourlyRate:6.50, dailyRate:40, rating:4.7, totalReviews:210, isCovered:false, hasEvCharging:true, hasSecurity:false, is24Hours:false, latitude:40.7549, longitude:-73.984 },
    { id:4, name:"West Side Hub", address:"789 West Side Hwy", city:"New York", state:"NY", availableSpots:67, totalSpots:150, hourlyRate:4.00, dailyRate:28, rating:3.9, totalReviews:54, isCovered:false, hasEvCharging:false, hasSecurity:true, is24Hours:true, latitude:40.7614, longitude:-74.0 },
  ],
  bookings: [
    { id:1, bookingReference:"PW-001", locationName:"Downtown Central", spotNumber:"A-12", status:"COMPLETED", startTime:"2024-11-15T09:00", endTime:"2024-11-15T17:00", totalAmount:40.00, durationHours:8 },
    { id:2, bookingReference:"PW-002", locationName:"Midtown Smart Lot", spotNumber:"B-05", status:"ACTIVE",    startTime:"2024-12-01T10:00", endTime:"2024-12-01T14:00", totalAmount:26.00, durationHours:4 },
    { id:3, bookingReference:"PW-003", locationName:"Airport Terminal",  spotNumber:"C-33", status:"CONFIRMED", startTime:"2024-12-05T08:00", endTime:"2024-12-05T20:00", totalAmount:96.00, durationHours:12 },
    { id:4, bookingReference:"PW-004", locationName:"West Side Hub",     spotNumber:"D-08", status:"CANCELLED", startTime:"2024-11-28T14:00", endTime:"2024-11-28T18:00", totalAmount:16.00, durationHours:4 },
  ],
  
  dashboard: { totalBookings:24, completedBookings:20, activeBookings:1, totalSpent:487, unreadNotifications:3 },
  admin: {
    stats: { totalUsers:1248, totalBookings:3890, totalRevenue:48750, activeLocations:50, todayBookings:42, pendingTickets:7 },
    users: [
      { id:1, firstName:"John", lastName:"Doe",  email:"john@example.com", role:"USER",  isActive:true,  createdAt:"2024-01-10", totalBookings:24 },
      { id:2, firstName:"Jane", lastName:"Smith",email:"jane@example.com", role:"USER",  isActive:true,  createdAt:"2024-02-14", totalBookings:8 },
      { id:3, firstName:"Bob",  lastName:"Admin", email:"bob@parkwise.com", role:"ADMIN", isActive:true,  createdAt:"2024-01-01", totalBookings:0 },
      { id:4, firstName:"Alice",lastName:"Brown", email:"alice@example.com",role:"USER",  isActive:false, createdAt:"2024-03-22", totalBookings:3 },
    ],
    tickets: [
      { id:1, userId:1, userName:"John Doe", email:"john@example.com", category:"BOOKING", subject:"Can't cancel my booking", message:"I tried to cancel but getting an error.", status:"OPEN",   createdAt:"2024-12-01" },
      { id:2, userId:2, userName:"Jane Smith",email:"jane@example.com",category:"PAYMENT", subject:"Refund not received",      message:"It's been 7 days since I cancelled.", status:"PENDING", createdAt:"2024-11-30" },
    ],
  },
  auth: {
  login: (email, password) => {
    return {
      token: "mock-token-123",
      user: {
        id: 1,
        firstName: "Tejinder",
        lastName: "Kaur",
        email: email,
        role: "USER"
      }
    };
  }
},spots: (id) => {
  const spots = [];

  for (let i = 1; i <= 50; i++) {
    spots.push({
      id: i,
      spotNumber: `A-${i}`,
      status: Math.random() > 0.3 ? "AVAILABLE" : "OCCUPIED",
    });
  }

  return spots;
}
};



/* ═══════════════════════════════════════════════════════════
   useAPI hook — tries real API, falls back to mock
═══════════════════════════════════════════════════════════ */
function useAPI(apiFn, mockData, deps = []) {
  const [data, setData]    = useState(null);
  const [loading, setLoad] = useState(true);
  const [error, setError]  = useState(null);

  const load = useCallback(async () => {
    setLoad(true);
    setError(null);
    try {
      const res = await apiFn();
      setData(res);
    } catch (e) {
      console.warn("API unavailable, falling back to mock data:", e.message);
      try {
        const mock = typeof mockData === 'function' ? mockData() : mockData;
        setData(mock);
      } catch (mockErr) {
        console.error("Mock data also failed:", mockErr);
        setError(e);
      }
    } finally {
      setLoad(false);
    }
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load, setData };
}

/* ═══════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════ */
const PATHS = {
  home:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  search:"M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  map:"M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16 M16 6v16",
  calendar:"M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  grid:"M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  user:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  help:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3 M12 17h.01",
  credit:"M1 4h22v16H1z M1 10h22",
  logout:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  menu:"M3 12h18M3 6h18M3 18h18",
  close:"M18 6L6 18M6 6l12 12",
  chevD:"M6 9l6 6 6-6", chevR:"M9 18l6-6-6-6", chevL:"M15 18l-6-6 6-6",
  check:"M20 6L9 17l-5-5",
  car:"M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-4h12l2 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-2m-7 0a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z",
  bolt:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  clock:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
  building:"M3 21h18M9 21V3h6v18M3 21V9l6-6M21 21V9l-6-6",
  pin:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a1 1 0 100-2 1 1 0 000 2z",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  plus:"M12 5v14M5 12h14",
  arrowR:"M5 12h14M12 5l7 7-7 7",
  warning:"M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4M12 17h.01",
  navigate:"M3 11l19-9-9 19-2-8-8-2z",
  admin:"M12 4.354a4 4 0 110 5.292V22H9v-4H5v4H2V9a7 7 0 0110-6.354z M18 2l4 4-1.5 1.5-4-4L18 2z M16 8l4 4-7 7-4-4 7-7z",
  users:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M9 11a4 4 0 100-8 4 4 0 000 8z",
  ticket:"M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2",
  trending:"M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 100-6 3 3 0 000 6z",
  refresh:"M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:"M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  location:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
};
const Icon = ({ n, size=16, color="currentColor", style:st={} }) => {
  const d = PATHS[n] || PATHS.help;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink:0, ...st }}>
      {d.split(" M").map((seg,i) => <path key={i} d={(i===0?seg:"M"+seg)} />)}
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{min-height:100vh;font-family:'DM Sans',sans-serif;background:#F8F9FB;color:#111318;-webkit-font-smoothing:antialiased}
:root{
  --ink:#111318;--ink2:#3D424F;--ink3:#6B7280;--ink4:#9CA3AF;
  --line:#E5E7EB;--line2:#F3F4F6;--surface:#F8F9FB;--white:#FFFFFF;
  --blue:#2563EB;--blue-lt:#EFF6FF;--blue-md:#BFDBFE;--blue-dk:#1D4ED8;
  --green:#16A34A;--green-lt:#F0FDF4;--amber:#D97706;--amber-lt:#FFFBEB;
  --red:#DC2626;--red-lt:#FEF2F2;--purple:#7C3AED;--purple-lt:#F5F3FF;
  --r-sm:4px;--r-md:8px;--r-lg:12px;--r-xl:16px;--r-2xl:20px;
  --sh-xs:0 1px 2px rgba(0,0,0,.05);--sh-sm:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.04);
  --sh-md:0 4px 6px rgba(0,0,0,.05),0 2px 4px rgba(0,0,0,.04);
  --sh-lg:0 10px 15px rgba(0,0,0,.06),0 4px 6px rgba(0,0,0,.04);
  --sh-xl:0 20px 25px rgba(0,0,0,.07),0 8px 10px rgba(0,0,0,.04);
}
::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--line);border-radius:10px}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

/* ── SHELL ── */
.topnav{position:fixed;top:0;left:0;right:0;z-index:900;height:60px;background:var(--white);border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 24px;gap:0}
.topnav-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit;margin-right:32px;flex-shrink:0;cursor:pointer}
.topnav-logo{width:32px;height:32px;background:var(--ink);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center}
.topnav-name{font-family:'Outfit',sans-serif;font-weight:700;font-size:16px;letter-spacing:-.3px}
.topnav-links{display:flex;align-items:center;gap:1px;flex:1}
.topnav-link{display:flex;align-items:center;gap:7px;padding:7px 12px;border-radius:var(--r-md);font-size:14px;font-weight:500;color:var(--ink3);background:none;border:none;cursor:pointer;font-family:inherit;transition:color .15s,background .15s;white-space:nowrap}
.topnav-link:hover{color:var(--ink);background:var(--line2)}
.topnav-link.active{color:var(--ink);background:var(--line2);font-weight:600}
.topnav-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.hamburger{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:var(--r-md)}
.hamburger:hover{background:var(--line2)}
.mobile-drawer{display:none;position:fixed;top:60px;left:0;right:0;z-index:899;background:var(--white);border-bottom:1px solid var(--line);padding:8px 16px 16px;flex-direction:column;gap:2px;animation:slideDown .2s ease}
.mobile-drawer.open{display:flex}
.mobile-link{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:var(--r-lg);font-size:14px;font-weight:500;color:var(--ink2);background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:.15s;width:100%}
.mobile-link:hover,.mobile-link.active{background:var(--line2);color:var(--ink)}
/* ── BTN ── */
.btn{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:var(--r-lg);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;border:none;transition:all .15s;white-space:nowrap;text-decoration:none;line-height:1}
.btn-primary{background:var(--ink);color:var(--white)}.btn-primary:hover{background:var(--ink2);transform:translateY(-1px);box-shadow:var(--sh-md)}
.btn-blue{background:var(--blue);color:var(--white)}.btn-blue:hover{background:var(--blue-dk);transform:translateY(-1px);box-shadow:0 4px 12px rgba(37,99,235,.3)}
.btn-outline{background:transparent;color:var(--ink);border:1.5px solid var(--line)}.btn-outline:hover{border-color:var(--ink3);background:var(--line2)}
.btn-ghost{background:var(--line2);color:var(--ink2)}.btn-ghost:hover{background:var(--line);color:var(--ink)}
.btn-danger{background:var(--red);color:#fff}.btn-danger:hover{background:#B91C1C}
.btn-purple{background:var(--purple);color:#fff}.btn-purple:hover{background:#6D28D9}
.btn-sm{padding:6px 13px;font-size:13px;border-radius:var(--r-md)}
.btn-lg{padding:12px 24px;font-size:15px}
.btn-full{width:100%;justify-content:center}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.btn-icon{padding:8px;border-radius:var(--r-md)}
/* ── CARD ── */
.card{background:var(--white);border-radius:var(--r-xl);border:1px solid var(--line);overflow:hidden}
.card-p{padding:24px}.card-hd{padding:18px 24px;border-bottom:1px solid var(--line)}.card-hd-sm{padding:14px 20px;border-bottom:1px solid var(--line)}.card-p-sm{padding:20px}
/* ── FORM ── */
.fg{margin-bottom:14px}.fg:last-child{margin-bottom:0}
.lbl{display:block;font-size:12px;font-weight:600;color:var(--ink3);letter-spacing:.3px;margin-bottom:5px;text-transform:uppercase}
.inp,.sel,.ta{width:100%;padding:9px 12px;border:1.5px solid var(--line);border-radius:var(--r-lg);font-size:14px;font-family:'DM Sans',sans-serif;background:var(--white);color:var(--ink);outline:none;transition:.15s}
.inp:focus,.sel:focus,.ta:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.inp::placeholder,.ta::placeholder{color:var(--ink4)}
.sel{appearance:none;cursor:pointer;padding-right:36px;background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
.ta{resize:vertical;min-height:90px;line-height:1.6}
.form-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
/* ── BADGE ── */
.badge{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.badge::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0}
.b-green{background:var(--green-lt);color:var(--green)}.b-blue{background:var(--blue-lt);color:var(--blue)}.b-amber{background:var(--amber-lt);color:var(--amber)}.b-red{background:var(--red-lt);color:var(--red)}.b-gray{background:var(--line2);color:var(--ink3)}.b-purple{background:var(--purple-lt);color:var(--purple)}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:var(--line2);border:1px solid var(--line);border-radius:var(--r-sm);font-size:12px;font-weight:500;color:var(--ink2)}
/* ── CHIP ── */
.chip{padding:6px 13px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--line);background:var(--white);color:var(--ink3);transition:.15s;font-family:inherit;white-space:nowrap}
.chip:hover{border-color:var(--ink3);color:var(--ink)}.chip.on{background:var(--ink);color:var(--white);border-color:var(--ink)}
/* ── SBAR ── */
.sbar{display:flex;align-items:center;gap:10px;background:var(--white);border:1.5px solid var(--line);border-radius:var(--r-lg);padding:9px 14px;transition:.15s}
.sbar:focus-within{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.sbar input{flex:1;border:none;outline:none;font-family:inherit;font-size:14px;background:transparent;color:var(--ink)}.sbar input::placeholder{color:var(--ink4)}
/* ── ALERT ── */
.alert{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:var(--r-lg);font-size:13px;font-weight:500;margin-bottom:12px}
.alert-info{background:var(--blue-lt);color:var(--blue-dk);border:1px solid var(--blue-md)}.alert-ok{background:var(--green-lt);color:var(--green);border:1px solid #BBF7D0}.alert-warn{background:var(--amber-lt);color:var(--amber);border:1px solid #FDE68A}.alert-err{background:var(--red-lt);color:var(--red);border:1px solid #FECACA}
/* ── MISC ── */
hr.div{border:none;border-top:1px solid var(--line);margin:16px 0}
.spin{width:20px;height:20px;border:2px solid var(--line);border-top-color:var(--blue);border-radius:50%;animation:spin .7s linear infinite}
.spin-sm{width:14px;height:14px}
/* ── FLEX/GRID ── */
.flex{display:flex}.flex-col{flex-direction:column}.flex-1{flex:1}.flex-wrap{flex-wrap:wrap}
.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}
.ml-auto{margin-left:auto}.gap-4{gap:4px}.gap-6{gap:6px}.gap-8{gap:8px}.gap-10{gap:10px}.gap-12{gap:12px}.gap-14{gap:14px}.gap-16{gap:16px}.gap-20{gap:20px}.gap-24{gap:24px}
.w-full{width:100%}.min-w-0{min-width:0}
.mt-4{margin-top:4px}.mt-6{margin-top:6px}.mt-8{margin-top:8px}.mt-10{margin-top:10px}.mt-12{margin-top:12px}.mt-16{margin-top:16px}.mt-20{margin-top:20px}.mt-24{margin-top:24px}
.mb-4{margin-bottom:4px}.mb-6{margin-bottom:6px}.mb-8{margin-bottom:8px}.mb-10{margin-bottom:10px}.mb-12{margin-bottom:12px}.mb-14{margin-bottom:14px}.mb-16{margin-bottom:16px}.mb-20{margin-bottom:20px}.mb-24{margin-bottom:24px}.mb-28{margin-bottom:28px}.mb-32{margin-bottom:32px}
/* ── TYPE ── */
.h1{font-family:'Outfit',sans-serif;font-weight:800;letter-spacing:-.5px}.h2{font-family:'Outfit',sans-serif;font-weight:700;letter-spacing:-.3px}.h3{font-family:'Outfit',sans-serif;font-weight:600;letter-spacing:-.2px}
.label-xs{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--ink3)}
.text-xs{font-size:12px}.text-sm{font-size:13px}.text-base{font-size:15px}
.fw-500{font-weight:500}.fw-600{font-weight:600}.fw-700{font-weight:700}.fw-800{font-weight:800}
.c-muted{color:var(--ink3)}.c-ink2{color:var(--ink2)}.c-blue{color:var(--blue)}.c-green{color:var(--green)}.c-red{color:var(--red)}.c-white{color:#fff}
.text-center{text-align:center}.text-right{text-align:right}.mono{font-family:'DM Mono',monospace}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* ── GRID ── */
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.grid-auto{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}.grid-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px}
/* ── PAGE ── */
.container{max-width:100%;width:100%;margin:0 auto;padding:0 32px}
.section{padding:32px 0}
.page-hero{background:var(--white);border-bottom:1px solid var(--line);padding:28px 32px}
.page-hero-label{font-size:12px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--ink3);margin-bottom:6px}
.page-hero-title{font-family:'Outfit',sans-serif;font-size:24px;font-weight:800;letter-spacing:-.3px;color:var(--ink);margin-bottom:4px}
.page-hero-sub{font-size:14px;color:var(--ink3)}
/* ── SIDEBAR ── */
.sidenav{width:216px;flex-shrink:0;padding:20px 0;position:sticky;top:60px;height:calc(100vh - 60px);overflow-y:auto;border-right:1px solid var(--line);background:var(--white)}
.sidenav-section{padding:0 12px;margin-bottom:4px}
.sidenav-label{font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--ink4);padding:0 8px;margin-bottom:4px}
.sidenav-btn{display:flex;align-items:center;gap:10px;width:100%;padding:9px 10px;border-radius:var(--r-lg);border:none;background:none;font-family:inherit;font-size:14px;font-weight:500;color:var(--ink2);cursor:pointer;transition:.15s;text-align:left}
.sidenav-btn:hover{background:var(--line2);color:var(--ink)}.sidenav-btn.on{background:var(--line2);color:var(--ink);font-weight:600}
.sidenav-btn .icon-wrap{width:30px;height:30px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;background:var(--line2);transition:.15s;flex-shrink:0}
.sidenav-btn.on .icon-wrap{background:var(--ink);color:var(--white)}.sidenav-btn:hover .icon-wrap{background:var(--line)}
.sidenav-divider{border:none;border-top:1px solid var(--line);margin:10px 12px}
/* ── STAT ── */
.stat-card{background:var(--white);border:1px solid var(--line);border-radius:var(--r-xl);padding:20px;position:relative;overflow:hidden}
.stat-card-accent{position:absolute;top:0;left:0;width:3px;height:100%}
.stat-icon{width:36px;height:36px;border-radius:var(--r-lg);background:var(--line2);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.stat-label{font-size:12px;font-weight:600;letter-spacing:.3px;color:var(--ink3);text-transform:uppercase}
.stat-value{font-family:'Outfit',sans-serif;font-size:28px;font-weight:800;color:var(--ink);margin:5px 0 3px;letter-spacing:-.8px}
.stat-meta{font-size:12px;color:var(--ink3)}
/* ── HERO ── */
.hero{background:var(--ink);min-height:calc(100vh - 60px);display:flex;align-items:center;position:relative;overflow:hidden}
.hero-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1px);background-size:32px 32px}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.7);padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:.5px;margin-bottom:24px}
.hero-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:#4ADE80;animation:pulse 2s ease-in-out infinite}
.hero-title{font-family:'Outfit',sans-serif;font-size:clamp(36px,5.5vw,64px);font-weight:900;color:#fff;line-height:1.05;margin-bottom:20px;letter-spacing:-2px}
.hero-title em{color:#60A5FA;font-style:normal}
.hero-sub{font-size:clamp(15px,1.8vw,17px);color:rgba(255,255,255,.55);margin:0 auto 36px;max-width:480px;line-height:1.7;font-weight:400}
.hero-search-bar{display:flex;align-items:center;gap:0;background:#fff;border-radius:var(--r-xl);padding:6px 6px 6px 18px;box-shadow:0 25px 50px rgba(0,0,0,.35);max-width:500px;margin:0 auto 40px}
.hero-search-bar input{flex:1;border:none;outline:none;font-family:inherit;font-size:15px;color:var(--ink);background:transparent;min-width:0}
.hero-search-bar input::placeholder{color:var(--ink3)}
.hero-stats{display:flex;gap:clamp(16px,4vw,40px);flex-wrap:wrap;justify-content:center;text-align:center}
.hero-stat-val{font-family:'Outfit',sans-serif;font-size:30px;font-weight:900;color:#fff;letter-spacing:-1px}
.hero-stat-lbl{font-size:13px;color:rgba(255,255,255,.45);margin-top:2px}
/* ── LOC CARD ── */
.loc-card{background:var(--white);border:1px solid var(--line);border-radius:var(--r-xl);overflow:hidden;transition:all .2s;cursor:pointer;margin:5px}
.loc-card:hover{box-shadow:var(--sh-xl);transform:translateY(-2px)}
.loc-card-top{height:140px;background:var(--ink);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.loc-card-top-pattern{position:absolute;inset:0;opacity:.04;background-image:radial-gradient(circle,#fff 1px,transparent 1px);background-size:20px 20px}
.loc-card-top-label{position:absolute;top:12px;right:12px;background:rgba(255,255,255,.12);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);color:#fff;border-radius:var(--r-md);padding:3px 10px;font-size:11px;font-weight:600}
.loc-card-avail-good{background:rgba(74,222,128,.15);border-color:rgba(74,222,128,.3);color:#4ADE80}
.loc-card-body{padding:18px}
.loc-card-name{font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;color:var(--ink);margin-bottom:3px}
.loc-card-addr{font-size:13px;color:var(--ink3);margin-bottom:12px;display:flex;align-items:center;gap:5px}
.avail-bar{height:3px;background:var(--line2);border-radius:2px;overflow:hidden;margin:6px 0 12px}
.avail-fill{height:100%;border-radius:2px;transition:width .5s}
.loc-card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--line)}
.loc-price{font-family:'Outfit',sans-serif;font-size:20px;font-weight:800;color:var(--ink)}
.loc-price span{font-size:13px;font-weight:500;color:var(--ink3)}
.stars{display:flex;gap:1px}.star-on{color:#FBBF24;font-size:12px}.star-off{color:var(--line);font-size:12px}
/* ── SPOT ── */
.spot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(56px,1fr));gap:7px}
.spot{aspect-ratio:1;border-radius:var(--r-lg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:10px;font-weight:700;cursor:pointer;border:1.5px solid transparent;transition:all .15s}
.spot-av{background:var(--green-lt);color:var(--green);border-color:#BBF7D0}.spot-av:hover{background:#DCFCE7;transform:scale(1.05)}
.spot-oc{background:var(--red-lt);color:var(--red);cursor:not-allowed;border-color:#FECACA}
.spot-rs{background:var(--amber-lt);color:var(--amber);cursor:not-allowed;border-color:#FDE68A}
.spot-mt{background:var(--line2);color:var(--ink3);cursor:not-allowed;border-color:var(--line)}
.spot-sel{background:var(--blue)!important;color:#fff!important;border-color:var(--blue-dk)!important;transform:scale(1.06)}
.spot-num{font-family:'DM Mono',monospace;font-size:9px;opacity:.8}
/* ── TABLE ── */
.tbl-wrap{overflow-x:auto;border-radius:var(--r-xl);border:1px solid var(--line)}
table{width:100%;border-collapse:collapse;min-width:400px}
th{padding:12px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--ink3);background:var(--surface);border-bottom:1px solid var(--line)}
td{padding:13px 16px;font-size:14px;color:var(--ink2);border-bottom:1px solid var(--line2)}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--surface)}
/* ── STEPS ── */
.steps{display:flex;align-items:center;gap:0;margin-bottom:32px}
.step{display:flex;align-items:center;gap:0;flex:1}
.step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;transition:.25s;z-index:1}
.step-dot.idle{background:var(--line2);color:var(--ink3);border:1.5px solid var(--line)}.step-dot.act{background:var(--blue);color:#fff;box-shadow:0 0 0 4px rgba(37,99,235,.15)}.step-dot.done{background:var(--ink);color:#fff}
.step-line{flex:1;height:1.5px;background:var(--line)}.step-line.done{background:var(--ink)}
.step-text{font-size:12px;font-weight:600;white-space:nowrap;margin-left:8px;color:var(--ink3)}.step-text.act,.step-text.done{color:var(--ink)}
/* ── FAQ ── */
.faq-item{border-bottom:1px solid var(--line)}.faq-item:first-child{border-top:1px solid var(--line)}
.faq-btn{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 0;width:100%;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:.15s}
.faq-q{font-size:14px;font-weight:600;color:var(--ink);transition:.15s}
.faq-a{font-size:14px;color:var(--ink2);line-height:1.75;padding-bottom:16px;animation:fadeUp .2s ease}
/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
.modal-box{background:var(--white);border-radius:var(--r-2xl);max-width:520px;width:100%;max-height:90vh;overflow-y:auto;animation:scaleIn .25s ease}
.modal-hd{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--line)}
.modal-title{font-family:'Outfit',sans-serif;font-size:17px;font-weight:700}
.modal-close{width:30px;height:30px;border-radius:var(--r-md);border:1px solid var(--line);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ink3);transition:.15s}.modal-close:hover{background:var(--line2);color:var(--ink)}
.modal-body{padding:20px 24px 24px}
/* ── TOAST ── */
.toast-stack{position:fixed;bottom:24px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:360px}
.toast{background:var(--ink);color:#fff;border-radius:var(--r-xl);padding:12px 16px;font-size:14px;font-weight:500;box-shadow:var(--sh-xl);display:flex;align-items:center;gap:10px;animation:slideDown .3s ease}
.toast.ok{background:var(--green)}.toast.err{background:var(--red)}.toast.warn{background:var(--amber)}
.toast-icon{width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
/* ── PAY CARD ── */
.pay-card-vis{background:var(--ink);border-radius:var(--r-xl);padding:22px;color:#fff;position:relative;overflow:hidden;height:172px;display:flex;flex-direction:column;justify-content:space-between}
.pay-card-vis::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.04)}
.card-chip{width:30px;height:22px;background:rgba(255,255,255,.18);border-radius:4px;border:1px solid rgba(255,255,255,.1)}
.card-num{font-family:'DM Mono',monospace;font-size:15px;letter-spacing:2px;opacity:.85}
/* ── CTA ── */
.cta-strip{background:var(--ink);border-radius:var(--r-2xl);padding:48px;text-align:center}
.cta-strip h2{font-family:'Outfit',sans-serif;font-size:clamp(20px,3.5vw,28px);font-weight:800;color:#fff;margin-bottom:10px;letter-spacing:-.4px}
.cta-strip p{color:rgba(255,255,255,.5);font-size:15px;margin-bottom:28px}
/* ── ADMIN ── */
.admin-shell{display:flex;min-height:calc(100vh - 60px)}
.admin-sidebar{width:240px;flex-shrink:0;background:var(--ink);padding:20px 0;position:sticky;top:60px;height:calc(100vh - 60px);overflow-y:auto}
.admin-sidebar-brand{padding:0 16px 20px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:12px}
.admin-sidebar-title{font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:.8px;text-transform:uppercase}
.admin-nav-btn{display:flex;align-items:center;gap:10px;width:100%;padding:10px 16px;border:none;background:none;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:rgba(255,255,255,.55);transition:.15s;text-align:left}
.admin-nav-btn:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.85)}
.admin-nav-btn.on{background:rgba(255,255,255,.1);color:#fff;font-weight:600}
.admin-nav-btn .a-icon{width:28px;height:28px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);flex-shrink:0;transition:.15s}
.admin-nav-btn.on .a-icon{background:var(--blue)}
.admin-main{flex:1;padding:32px;background:var(--surface);min-width:0;overflow-x:hidden}
.admin-stat{background:var(--white);border:1px solid var(--line);border-radius:var(--r-xl);padding:18px 20px;position:relative;overflow:hidden}
.admin-stat-top-bar{position:absolute;top:0;left:0;right:0;height:3px}
/* ── RESPONSIVE ── */
@media(max-width:1024px){.grid-4{grid-template-columns:repeat(2,1fr)}.grid-3{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .topnav-links{display:none}.hamburger{display:flex}.sidenav{display:none}.form-2{grid-template-columns:1fr}.grid-2,.grid-3,.grid-4{grid-template-columns:1fr}.grid-auto{grid-template-columns:1fr}
  .container{padding:0 16px}.page-hero{padding:20px 16px}.section{padding:24px 0}
  .avail-split{flex-direction:column!important}.booking-sticky{position:static!important;width:100%!important}
  .admin-sidebar{display:none}.admin-main{padding:20px 16px}
  .toast-stack{left:16px;right:16px;bottom:16px}
}
@media(max-width:480px){.topnav-name{display:none}}
`;

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════ */
const Stars = ({n}) => <div className="stars">{[1,2,3,4,5].map(i=><span key={i} className={i<=Math.round(n)?'star-on':'star-off'}>★</span>)}</div>;

const Bdg = ({status}) => {
  const m={COMPLETED:['b-green','Completed'],ACTIVE:['b-blue','Active'],CONFIRMED:['b-amber','Confirmed'],CANCELLED:['b-red','Cancelled'],PENDING:['b-gray','Pending'],OPEN:['b-blue','Open'],CLOSED:['b-gray','Closed'],ADMIN:['b-purple','Admin'],USER:['b-gray','User']};
  const [cls,lbl]=m[status]||['b-gray',status];
  return <span className={`badge ${cls}`}>{lbl}</span>;
};

const Loader = ({sm,full}) => full
  ? <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'60px 0'}}><div className="spin"/></div>
  : <div className={`spin${sm?' spin-sm':''}`}/>;

const Toast = ({items}) => (
  <div className="toast-stack">
    {items.map(t=>(
      <div key={t.id} className={`toast${t.type==='success'?' ok':t.type==='error'?' err':t.type==='warn'?' warn':''}`}>
        <div className="toast-icon"><Icon n={t.type==='success'?'check':t.type==='error'?'close':'warning'} size={12} color="#fff"/></div>
        {t.message}
      </div>
    ))}
  </div>
);

const ConfirmModal = ({title, message, onConfirm, onClose, danger}) => (
  <div className="overlay" onClick={onClose}>
    <div className="modal-box" style={{maxWidth:400}} onClick={e=>e.stopPropagation()}>
      <div className="modal-hd">
        <span className="modal-title">{title}</span>
        <button className="modal-close" onClick={onClose}><Icon n="close" size={14}/></button>
      </div>
      <div className="modal-body">
        <p className="text-sm c-muted mb-20" style={{lineHeight:1.7}}>{message}</p>
        <div className="flex gap-10">
          <button className="btn btn-ghost flex-1" onClick={onClose}>Cancel</button>
          <button className={`btn ${danger?'btn-danger':'btn-blue'} flex-1`} onClick={()=>{onConfirm();onClose();}}>Confirm</button>
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   LEAFLET MAP
═══════════════════════════════════════════════════════════ */
function useLeaflet(cb, deps=[]) {
  const [ready, setReady] = useState(!!window.L);
  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const link = document.createElement("link"); link.rel="stylesheet"; link.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(link);
    const s = document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; s.onload=()=>setReady(true); document.head.appendChild(s);
  }, []);
  useEffect(()=>{ if(ready) cb(); }, [ready, ...deps]);
  return ready;
}

const LocationsMap = ({ locations, selectedId, onSelect, height=400 }) => {
  const ref=useRef(null); const map=useRef(null); const marks=useRef([]);
  useLeaflet(()=>{
    if(!ref.current||map.current) return;
    const L=window.L;
    map.current=L.map(ref.current,{scrollWheelZoom:false}).setView([40.72,-73.95],11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© OpenStreetMap',maxZoom:19}).addTo(map.current);
  },[]);
  useEffect(()=>{
    if(!window.L||!map.current) return;
    const L=window.L;
    marks.current.forEach(m=>m.remove()); marks.current=[];
    locations.forEach(loc=>{
      const sel=loc.id===selectedId; const ok=(loc.availableSpots||loc.available||0)>30;
      const icon=L.divIcon({html:`<div style="background:${sel?'#2563EB':ok?'#16A34A':'#111318'};color:#fff;padding:6px 11px;border-radius:8px;font-size:12px;font-weight:700;font-family:'DM Sans',sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.2);white-space:nowrap;transform:${sel?'scale(1.12)':'scale(1)'};border:2px solid ${sel?'#1D4ED8':ok?'#15803D':'rgba(255,255,255,.1)'}">$${loc.hourlyRate||loc.hourly}/hr</div>`,className:'',iconAnchor:[0,0]});
      const m=L.marker([loc.latitude||loc.lat,loc.longitude||loc.lng],{icon}).addTo(map.current).bindPopup(`<div style="font-family:'DM Sans',sans-serif;padding:2px"><div style="font-weight:700;font-size:14px;margin-bottom:4px">${loc.name}</div><div style="font-size:12px;color:#6B7280;margin-bottom:8px">${loc.address}</div><div style="display:flex;justify-content:space-between"><span style="font-size:12px;color:${ok?'#16A34A':'#DC2626'};font-weight:600">${loc.availableSpots||0} spots</span><span style="font-size:14px;font-weight:800">$${loc.hourlyRate||loc.hourly}/hr</span></div></div>`,{maxWidth:220,closeButton:false});
      m.on('click',()=>onSelect?.(loc)); marks.current.push(m);
    });
  },[window.L,map.current,locations,selectedId]);
  return <div ref={ref} style={{height,width:'100%'}}/>;
};

/* ═══════════════════════════════════════════════════════════
   TOP NAV
═══════════════════════════════════════════════════════════ */
const TopNav = ({page,go,user,setUser}) => {
  const [open,setOpen]=useState(false);
  const isAdmin = user?.role==='ADMIN';
  const links=[
    {id:'landing',icon:'home',label:'Home'},
    {id:'search',icon:'search',label:'Find Parking'},
    {id:'availability',icon:'map',label:'Availability'},
    {id:'dashboard',icon:'grid',label:'Dashboard'},
    {id:'help',icon:'help',label:'Help'},
    ...(isAdmin?[{id:'admin',icon:'admin',label:'Admin'}]:[]),
  ];
  const nav=id=>{go(id);setOpen(false)};
  return (
    <header className="topnav">
      <div className="topnav-brand" onClick={()=>nav('landing')}>
        <div className="topnav-logo"><Icon n="car" size={16} color="#fff"/></div>
        <span className="topnav-name">ParkWise</span>
      </div>
      <nav className="topnav-links">
        {links.map(l=>(
          <button key={l.id} className={`topnav-link${page===l.id?' active':''}`} onClick={()=>nav(l.id)}>
            <Icon n={l.icon} size={15}/>{l.label}
            {l.id==='admin'&&<span style={{background:'var(--purple)',color:'#fff',fontSize:10,padding:'1px 6px',borderRadius:10,marginLeft:2,fontWeight:700}}>ADMIN</span>}
          </button>
        ))}
      </nav>
      <div className="topnav-right">
        {user?(<>
          <span className="text-sm fw-600 c-ink2">{user.firstName||user.name}</span>
          {isAdmin&&<span className="badge b-purple" style={{fontSize:10}}>Admin</span>}
          <button className="btn btn-outline btn-sm" onClick={()=>{api.auth.logout();setUser(null);go('login')}}><Icon n="logout" size={14}/>Sign Out</button>
        </>):(<button className="btn btn-primary btn-sm" onClick={()=>nav('login')}>Sign In</button>)}
        <button className="hamburger btn-icon" onClick={()=>setOpen(o=>!o)}><Icon n={open?'close':'menu'} size={18}/></button>
      </div>
      {open&&(
        <div className="mobile-drawer open">
          {links.map(l=><button key={l.id} className={`mobile-link${page===l.id?' active':''}`} onClick={()=>nav(l.id)}><Icon n={l.icon} size={16}/>{l.label}</button>)}
          <hr className="div"/>
          {user?<button className="mobile-link" onClick={()=>{api.auth.logout();setUser(null);setOpen(false);go('login')}}><Icon n="logout" size={16}/>Sign Out</button>:<button className="btn btn-primary btn-full" onClick={()=>nav('login')}>Sign In</button>}
        </div>
      )}
    </header>
  );
};

/* ═══════════════════════════════════════════════════════════
   LANDING
═══════════════════════════════════════════════════════════ */
const Landing = ({go}) => {
  const [q,setQ]=useState('');
  const feats=[
    {icon:'search',title:'Smart Search',desc:'Real-time availability with precise filters — by price, distance, or amenity.'},
    {icon:'calendar',title:'Instant Booking',desc:'Reserve your spot in seconds. QR code confirmation delivered immediately.'},
    {icon:'credit',title:'Secure Payments',desc:'All major cards, PayPal, Apple Pay — protected with 256-bit encryption.'},
    {icon:'map',title:'Live Map View',desc:'Interactive map with live availability, pricing, and one-tap navigation.'},
    {icon:'clock',title:'Smart Reminders',desc:'Get notified before your booking starts or when your time is running low.'},
    {icon:'shield',title:'Easy Cancellation',desc:'Full refund on cancellations up to 1 hour before your reservation starts.'},
  ];
  return (
    <div>
      <section className="hero">
        <div className="hero-dots"/>
        <div style={{position:'absolute',width:500,height:500,background:'rgba(37,99,235,.12)',borderRadius:'50%',filter:'blur(100px)',top:'-10%',right:'0'}}/>
        <div className="container w-full">
          <div style={{position:'relative',zIndex:2,padding:'80px 0',maxWidth:620,margin:'0 auto',textAlign:'center'}}>
            <div className="hero-eyebrow" style={{animation:'fadeUp .4s ease both'}}><span className="hero-eyebrow-dot"/>LIVE AVAILABILITY</div>
            <h1 className="hero-title" style={{animation:'fadeUp .5s ease both',animationDelay:'.06s'}}>Find your<br/><em>perfect spot</em><br/>in seconds.</h1>
            <p className="hero-sub" style={{animation:'fadeUp .5s ease both',animationDelay:'.14s'}}>ParkWise shows real-time parking availability, lets you reserve in advance, and navigates you straight to your spot.</p>
            <div className="hero-search-bar" style={{animation:'fadeUp .5s ease both',animationDelay:'.22s'}}>
              <Icon n="pin" size={18} color="var(--ink3)"/>
              <input placeholder="Enter a city, address or location…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go('search')}/>
              <button className="btn btn-blue" onClick={()=>go('search')}>Search</button>
            </div>
            <div className="hero-stats" style={{animation:'fadeUp .5s ease both',animationDelay:'.3s'}}>
              {[['2,400+','Parking spots'],['98%','Happy drivers'],['50+','Locations'],['24/7','Always open']].map(([v,l])=>(
                <div key={l}><div className="hero-stat-val">{v}</div><div className="hero-stat-lbl">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={{background:'#fff',padding:'80px 0'}}>
        <div className="container">
          <div className="text-center mb-32">
            <div style={{fontSize:12,fontWeight:700,letterSpacing:'.8px',textTransform:'uppercase',color:'var(--blue)',marginBottom:8}}>Why ParkWise</div>
            <div className="h2" style={{fontSize:'clamp(22px,3.5vw,30px)',marginBottom:12}}>Everything you need,<br/>nothing you don't.</div>
          </div>
          <div className="grid-3">
            {feats.map((f,i)=>(
              <div key={i} style={{padding:24,borderRadius:'var(--r-xl)',border:'1px solid var(--line)',background:'var(--white)',transition:'.2s',animation:`fadeUp .4s ease both`,animationDelay:`${i*.07}s`}}>
                <div style={{width:44,height:44,borderRadius:'var(--r-xl)',background:'var(--line2)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                  <Icon n={f.icon} size={20} color="var(--ink2)"/>
                </div>
                <div className="h3 mb-6" style={{fontSize:15}}>{f.title}</div>
                <p className="text-sm c-muted" style={{lineHeight:1.7}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{padding:'80px 0'}}>
        <div className="container">
          <div className="cta-strip">
            <h2>Ready to find your spot?</h2>
            <p>Join 50,000+ drivers who park smarter every day.</p>
            <div className="flex justify-center gap-12 flex-wrap">
              <button className="btn btn-blue btn-lg" onClick={()=>go('search')}>Find Parking Now <Icon n="arrowR" size={16} color="#fff"/></button>
              <button className="btn btn-lg" style={{background:'rgba(255,255,255,.08)',color:'#fff',border:'1px solid rgba(255,255,255,.12)'}} onClick={()=>go('help')}>Learn More</button>
            </div>
          </div>
        </div>
      </section>
      <footer style={{borderTop:'1px solid var(--line)',padding:'24px 32px',textAlign:'center',fontSize:13,color:'var(--ink3)'}}>
        © 2024 ParkWise · Backend: <span className="mono" style={{fontSize:11}}>localhost:8080/api</span>
      </footer>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SEARCH — fetches from /parking-locations
═══════════════════════════════════════════════════════════ */
const LocCard = ({loc,go,setSel,toast}) => {
  const av  = loc.availableSpots ?? loc.available ?? 0;
  const tot = loc.totalSpots ?? loc.total ?? 1;
  const pct = Math.round((av/tot)*100);
  const rate= loc.hourlyRate ?? loc.hourly ?? 0;
  const color=pct>40?'var(--green)':pct>15?'var(--amber)':'var(--red)';
  return (
    <div className="loc-card">
      <div className="loc-card-top">
        <div className="loc-card-top-pattern"/>
        <div style={{position:'relative',zIndex:1}}><Icon n="car" size={32} color="rgba(255,255,255,.4)"/></div>
        <div className={`loc-card-top-label ${pct>40?'loc-card-avail-good':''}`}>{av} available</div>
      </div>
      <div className="loc-card-body">
        <div className="loc-card-name">{loc.name}</div>
        <div className="loc-card-addr"><Icon n="pin" size={12} color="var(--ink3)"/>{loc.address}, {loc.city}</div>
        <div className="flex justify-between text-xs c-muted mb-4"><span>Availability</span><span style={{color,fontWeight:700}}>{pct}%</span></div>
        <div className="avail-bar"><div className="avail-fill" style={{width:`${pct}%`,background:color}}/></div>
        <div className="flex gap-6 flex-wrap mb-14">
          {loc.isCovered   &&<span className="tag"><Icon n="building" size={10}/>Covered</span>}
          {loc.hasEvCharging&&<span className="tag"><Icon n="bolt" size={10}/>EV</span>}
          {loc.hasSecurity &&<span className="tag"><Icon n="shield" size={10}/>Security</span>}
          {loc.is24Hours   &&<span className="tag"><Icon n="clock" size={10}/>24/7</span>}
        </div>
        <div className="loc-card-footer">
          <div>
            <div className="loc-price">${rate.toFixed(2)}<span>/hr</span></div>
            <div className="flex items-center gap-6 mt-4">
              <Stars n={loc.rating||0}/><span className="text-xs c-muted">({loc.totalReviews||0})</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={()=>{setSel(loc);go('availability')}}>
            Book <Icon n="arrowR" size={14} color="#fff"/>
          </button>
        </div>
      </div>
    </div>
  );
};

const Search = ({go,setSel,toast}) => {
  const [q,setQ]=useState('');
  const [fl,setFl]=useState({covered:false,ev:false,security:false,h24:false});
  const [sort,setSort]=useState('rating');
  const [view,setView]=useState('list');
  const [hlId,setHl]=useState(null);

  const {data:locs, loading} = useAPI(()=>api.locations.list(), MOCK.locations);
  const toggle=k=>setFl(f=>({...f,[k]:!f[k]}));
  const locations=locs||[];

  const filtered=locations.filter(l=>{
    const mq=!q||l.name.toLowerCase().includes(q.toLowerCase())||l.address.toLowerCase().includes(q.toLowerCase());
    const mc=!fl.covered||l.isCovered; const me=!fl.ev||l.hasEvCharging; const ms=!fl.security||l.hasSecurity; const mh=!fl.h24||l.is24Hours;
    return mq&&mc&&me&&ms&&mh;
  }).sort((a,b)=>sort==='rating'?((b.rating||0)-(a.rating||0)):sort==='price'?((a.hourlyRate||0)-(b.hourlyRate||0)):((b.availableSpots||0)-(a.availableSpots||0)));

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-label">Parking</div>
          <div className="page-hero-title">Find Parking</div>
          <div className="page-hero-sub">Search from hundreds of locations with real-time availability</div>
        </div>
      </div>
      <div className="container section">
        <div className="card mb-16" style={{padding:'16px 20px',marginBottom:16}}>
          <div className="flex gap-10 items-center flex-wrap mb-12">
            <div className="sbar flex-1" style={{minWidth:200}}>
              <Icon n="search" size={16} color="var(--ink3)"/>
              <input placeholder="Search location or address…" value={q} onChange={e=>setQ(e.target.value)}/>
              {q&&<button style={{background:'none',border:'none',cursor:'pointer',color:'var(--ink4)',display:'flex',alignItems:'center'}} onClick={()=>setQ('')}><Icon n="close" size={12}/></button>}
            </div>
            <select className="sel" style={{width:'auto',minWidth:140}} value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="rating">Top Rated</option>
              <option value="price">Lowest Price</option>
              <option value="availability">Most Available</option>
            </select>
          </div>
          <div className="flex items-center gap-8 flex-wrap">
            <span className="label-xs" style={{marginRight:4}}>Filters</span>
            {[['covered','building','Covered'],['ev','bolt','EV Charging'],['security','shield','Security'],['h24','clock','24/7']].map(([k,ic,lb])=>(
              <button key={k} className={`chip${fl[k]?' on':''}`} onClick={()=>toggle(k)}><Icon n={ic} size={12}/>{lb}</button>
            ))}
            <div className="flex gap-6 ml-auto">
              <button className={`chip${view==='list'?' on':''}`} onClick={()=>setView('list')}><Icon n="grid" size={12}/>List</button>
              <button className={`chip${view==='map'?' on':''}`} onClick={()=>setView('map')}><Icon n="map" size={12}/>Map</button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-16">
          <p className="text-sm c-muted"><strong style={{color:'var(--ink)'}}>{filtered.length}</strong> locations found</p>
          {loading&&<div className="spin spin-sm"/>}
        </div>
        {view==='map'?(
          <div className="flex gap-16" style={{alignItems:'flex-start'}}>
            <div style={{flex:'0 0 460px',position:'sticky',top:74}}>
              <div style={{borderRadius:'var(--r-xl)',overflow:'hidden',border:'1px solid var(--line)',height:480}}>
                <LocationsMap locations={filtered} selectedId={hlId} height={480} onSelect={l=>{setHl(l.id);setSel(l)}}/>
              </div>
            </div>
            <div className="flex flex-col gap-14 flex-1">
              {filtered.map(l=><LocCard key={l.id} loc={l} go={go} setSel={setSel} toast={toast}/>)}
            </div>
          </div>
        ):(
          <div className="grid-auto">
            {filtered.map(l=><LocCard key={l.id} loc={l} go={go} setSel={setSel} toast={toast}/>)}
          </div>
        )}
        {!loading&&filtered.length===0&&(
          <div className="card text-center" style={{padding:'52px 24px'}}>
            <div style={{width:56,height:56,background:'var(--line2)',borderRadius:'var(--r-2xl)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><Icon n="search" size={24} color="var(--ink3)"/></div>
            <div className="h3 mb-6">No results</div>
            <p className="text-sm c-muted">Try a different search or clear your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   AVAILABILITY — fetches spots from /parking-locations/{id}/spots
═══════════════════════════════════════════════════════════ */
const Availability = ({go,sel,toast,user}) => {
  const loc=sel||MOCK.locations[0];
  const [floor,setFloor]=useState(1);
  const [spot,setSpot]=useState(null);
  const [date,setDate]=useState(new Date().toISOString().split('T')[0]);
  const [t1,setT1]=useState('10:00');
  const [t2,setT2]=useState('14:00');
  const [modal,setModal]=useState(false);
  const [booking,setBooking]=useState(false);

  // Fetch real spots
  const {data:spotsData,loading:spotsLoading}=useAPI(
    ()=>api.locations.spots(loc.id,floor),
    ()=>Array.from({length:40},(_,i)=>{
      const n=`${String.fromCharCode(64+floor)}-${String(i+1).padStart(2,'0')}`;
      const r=((i+1)*7+floor*3)%10/10;
      const status=r<.55?'AVAILABLE':r<.75?'OCCUPIED':r<.85?'RESERVED':'MAINTENANCE';
      const spotType=(i+1)%10===0?'EV':(i+1)%8===0?'HANDICAP':(i+1)%5===0?'COMPACT':'STANDARD';
      return {id:i+1,spotNumber:n,status,spotType,floorLevel:floor};
    }),
    [loc.id,floor]
  );
  const spots=spotsData||[];

  const hrs=Math.max(0,(()=>{
    const [h2,m2]=t2.split(':').map(Number); const [h1,m1]=t1.split(':').map(Number);
    return (h2*60+m2-h1*60-m1)/60;
  })());
  const total=((hrs)*(loc.hourlyRate||loc.hourly||5)).toFixed(2);
  const emojiMap={EV:'⚡',HANDICAP:'♿',COMPACT:'🔵',STANDARD:'🚗'};
  const scMap={AVAILABLE:'spot-av',OCCUPIED:'spot-oc',RESERVED:'spot-rs',MAINTENANCE:'spot-mt'};

  const handleBook=async()=>{
    if(!user){toast('warn','Please sign in to book');return;}
    if(hrs<=0){toast('error','End time must be after start time');return;}
    setBooking(true);
    try {
      await api.bookings.create({
        spotId: spot.id,
        startTime: `${date}T${t1}:00`,
        endTime:   `${date}T${t2}:00`,
      });
      reloadDash();
      reloadBk();
      toast('success','Booking confirmed!');
      go('payment');
    } catch(e) {
      // fallback — proceed to payment with mock
      toast('success','Booking confirmed!');
      go('payment');
    } finally { setBooking(false); setModal(false); }
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <button className="btn btn-ghost btn-sm mb-12" onClick={()=>go('search')}><Icon n="chevL" size={14}/>Back to search</button>
          <div className="flex items-start justify-between flex-wrap gap-12">
            <div>
              <div className="page-hero-label">Parking Lot</div>
              <div className="page-hero-title">{loc.name}</div>
              <div className="flex items-center gap-10 mt-4">
                <span className="page-hero-sub flex items-center gap-5"><Icon n="pin" size={13} color="var(--ink3)"/>{loc.address}, {loc.city}</span>
                <Stars n={loc.rating||0}/>
                <span className="text-sm c-muted">({loc.totalReviews||0})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container section">
        <div className="flex gap-20" style={{alignItems:'flex-start'}}>
          <div style={{flex:1,minWidth:0}}>
            <div className="card mb-16">
              <div className="card-hd"><div className="h3" style={{fontSize:15}}>Select Date & Time</div></div>
              <div className="card-p-sm">
                <div className="form-2 mb-12">
                  <div className="fg mb-0"><label className="lbl">Date</label><input type="date" className="inp" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}/></div>
                  <div className="fg mb-0"><label className="lbl">Time</label>
                    <div className="flex gap-8">
                      <input type="time" className="inp" value={t1} onChange={e=>setT1(e.target.value)}/>
                      <div className="flex items-center c-muted" style={{fontSize:12,fontWeight:600}}>to</div>
                      <input type="time" className="inp" value={t2} onChange={e=>setT2(e.target.value)}/>
                    </div>
                  </div>
                </div>
                {hrs>0&&<div className="alert alert-info mb-0"><Icon n="clock" size={15}/><span><strong>{hrs.toFixed(1)} hours</strong> · Estimated total: <strong>${total}</strong></span></div>}
              </div>
            </div>
            <div className="card">
              <div className="card-hd">
                <div className="flex items-center justify-between">
                  <div className="h3" style={{fontSize:15}}>Select a Spot — Floor {floor}</div>
                  <div className="flex gap-6">
                    {[1,2,3].map(f=><button key={f} className={`chip${floor===f?' on':''}`} style={{padding:'4px 12px'}} onClick={()=>{setFloor(f);setSpot(null)}}>L{f}</button>)}
                  </div>
                </div>
              </div>
              <div className="card-p-sm">
                <div className="flex gap-16 flex-wrap mb-16">
                  {[['#BBF7D0','var(--green)','Available'],['#FECACA','var(--red)','Occupied'],['#FDE68A','var(--amber)','Reserved'],['var(--line)','var(--ink3)','Maintenance']].map(([bg,c,l])=>(
                    <div key={l} className="flex items-center gap-6"><div style={{width:10,height:10,borderRadius:3,background:bg,border:`1.5px solid ${c}`,flexShrink:0}}/><span className="text-xs c-muted">{l}</span></div>
                  ))}
                </div>
                <div style={{background:'var(--surface)',borderRadius:'var(--r-lg)',padding:'6px 14px',marginBottom:10,textAlign:'center',fontSize:11,fontWeight:600,color:'var(--ink3)',letterSpacing:1}}>← ENTRANCE →</div>
                {spotsLoading?<Loader full/>:(
                  <div className="spot-grid">
                    {spots.map(s=>(
                      <div key={s.id} className={`spot ${spot?.id===s.id?'spot-sel':scMap[s.status||'AVAILABLE']}`}
                        onClick={()=>s.status==='AVAILABLE'&&setSpot(spot?.id===s.id?null:s)}
                        title={`${s.spotNumber} · ${s.spotType}`}>
                        <span style={{fontSize:12}}>{emojiMap[s.spotType]||'🚗'}</span>
                        <span className="spot-num">{s.spotNumber}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="booking-sticky" style={{width:290,flexShrink:0}}>
            <div className="card" style={{position:'sticky',top:80}}>
              <div className="card-hd-sm"><div className="h3" style={{fontSize:14}}>Booking Summary</div></div>
              <div className="card-p-sm">
                {spot?(<>
                  {[['Spot',spot.spotNumber],['Type',spot.spotType],['Date',date],['Time',`${t1} – ${t2}`],['Duration',`${hrs.toFixed(1)} hrs`],['Rate',`$${(loc.hourlyRate||loc.hourly||5).toFixed(2)}/hr`]].map(([k,v])=>(
                    <div key={k} className="flex justify-between mb-8"><span className="text-sm c-muted">{k}</span><span className="text-sm fw-600">{v}</span></div>
                  ))}
                  <hr className="div"/>
                  <div className="flex justify-between mb-16"><span className="fw-700">Total</span><span style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:800,color:'var(--blue)'}}>${total}</span></div>
                  <button className="btn btn-blue btn-full mb-8" onClick={()=>{if(hrs<=0){toast('error','End time must be after start time');return;}setModal(true);}}>
                    Continue <Icon n="arrowR" size={14} color="#fff"/>
                  </button>
                  <button className="btn btn-ghost btn-full" onClick={()=>setSpot(null)}>Clear selection</button>
                </>):(
                  <div className="text-center" style={{padding:'24px 0'}}>
                    <div style={{width:44,height:44,background:'var(--line2)',borderRadius:'var(--r-xl)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><Icon n="pin" size={20} color="var(--ink3)"/></div>
                    <p className="text-sm c-muted mb-12">Select a green spot<br/>from the grid above</p>
                    <span className="badge b-green">{spots.filter(s=>s.status==='AVAILABLE').length} spots available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal&&(
        <div className="overlay" onClick={()=>setModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-hd"><span className="modal-title">Confirm Booking</span><button className="modal-close" onClick={()=>setModal(false)}><Icon n="close" size={14}/></button></div>
            <div className="modal-body">
              <div className="alert alert-ok mb-16"><Icon n="check" size={15}/>Spot {spot?.spotNumber} is available</div>
              <div style={{background:'var(--surface)',borderRadius:'var(--r-xl)',padding:16,marginBottom:20}}>
                {[['Location',loc.name],['Spot',spot?.spotNumber],['Date',date],['Time',`${t1} – ${t2}`],['Duration',`${hrs.toFixed(1)} hours`],['Total',`$${total}`]].map(([k,v])=>(
                  <div key={k} className="flex justify-between mb-8" style={{fontSize:14}}><span className="c-muted">{k}</span><span className="fw-600">{v}</span></div>
                ))}
              </div>
              <button className="btn btn-blue btn-full mb-8" onClick={handleBook} disabled={booking}>
                {booking?<><Loader sm/>Processing…</>:<>Proceed to Payment <Icon n="arrowR" size={14} color="#fff"/></>}
              </button>
              <button className="btn btn-ghost btn-full" onClick={()=>setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DASHBOARD — fetches from /dashboard and /bookings
═══════════════════════════════════════════════════════════ */
const Dashboard = ({go,user}) => {
  const [tab,setTab]=useState('overview');
  const [fstt,setFstt]=useState('ALL');
  const [confirm,setConfirm]=useState(null);

  const {data:dash,loading:dashLoading,reload:reloadDash}=useAPI(()=>api.dashboard.get(), MOCK.dashboard);
  const {data:bookingsRaw,loading:bkLoading,reload:reloadBk}=useAPI(()=>api.bookings.list(), MOCK.bookings);
  const {data:profile,reload:reloadProfile}=useAPI(()=>api.user.profile(), {firstName:'John',lastName:'Doe',email:'john@example.com',phone:'+1 (555) 010-1234'});
  const [profileForm,setProfileForm]=useState(null);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{ if(profile&&!profileForm) setProfileForm({firstName:profile.firstName,lastName:profile.lastName,email:profile.email,phone:profile.phone||''}); },[profile]);

  const bookings=bookingsRaw?.content||bookingsRaw||[];
  const filtered=fstt==='ALL'?bookings:bookings.filter(b=>b.status===fstt);

  const stats=[
    {icon:'calendar',label:'Total Bookings',value:dash?.totalBookings??'…',meta:'+3 this month',accent:'var(--blue)'},
    {icon:'credit',label:'Total Spent',value:dash?.totalSpent!=null?`$${Number(dash.totalSpent).toFixed(0)}`:'…',meta:'Last 6 months',accent:'var(--green)'},
    {icon:'clock',label:'Active Bookings',value:dash?.activeBookings??'…',meta:'Right now',accent:'var(--amber)'},
    {icon:'star',label:'Notifications',value:dash?.unreadNotifications??'…',meta:'Unread',accent:'var(--purple)'},
  ];

  const tabs=[{id:'overview',icon:'grid',label:'Overview'},{id:'bookings',icon:'calendar',label:'Bookings'},{id:'payments',icon:'credit',label:'Payments'},{id:'profile',icon:'user',label:'Profile'}];

  const cancelBooking = async (id) => {
  try { await api.bookings.cancel(id,'User cancelled'); }
  catch {}

  reloadBk();     // bookings list refresh
  reloadDash();   // 🔥 dashboard stats refresh

  toast('success','Booking cancelled');
};


  const saveProfile=async()=>{
    setSaving(true);
    try { await api.user.update(profileForm); }
    catch {}
    setSaving(false);
    reloadProfile();
  };

  return (
    <div style={{display:'flex',minHeight:'calc(100vh - 60px)'}}>
      <aside className="sidenav">
        <div className="sidenav-section">
          <div className="sidenav-label">Main</div>
          {tabs.map(t=>(
            <button key={t.id} className={`sidenav-btn${tab===t.id?' on':''}`} onClick={()=>setTab(t.id)}>
              <div className="icon-wrap"><Icon n={t.icon} size={15} color="inherit"/></div>{t.label}
            </button>
          ))}
        </div>
        <hr className="sidenav-divider"/>
        <div className="sidenav-section">
          <button className="sidenav-btn" onClick={()=>go('search')}><div className="icon-wrap"><Icon n="search" size={15}/></div>Find Parking</button>
          <button className="sidenav-btn" onClick={()=>go('help')}><div className="icon-wrap"><Icon n="help" size={15}/></div>Help & Support</button>
        </div>
      </aside>
      <main style={{flex:1,minWidth:0,padding:'32px',background:'var(--surface)'}}>
        {/* OVERVIEW */}
        {tab==='overview'&&(
          <div style={{animation:'fadeUp .35s ease'}}>
            <div className="flex items-center justify-between mb-24">
              <div>
                <div className="h2" style={{fontSize:22}}>Good morning, {user?.firstName||user?.name||'there'}</div>
                <div className="text-sm c-muted mt-4">Here's your parking overview</div>
              </div>
              <button className="btn btn-blue btn-sm" onClick={()=>go('search')}><Icon n="plus" size={14} color="#fff"/>New Booking</button>
            </div>
            {dashLoading?<Loader full/>:(
              <div className="grid-stats mb-24">
                {stats.map((s,i)=>(
                  <div key={i} className="stat-card">
                    <div className="stat-card-accent" style={{background:s.accent}}/>
                    <div className="stat-icon"><Icon n={s.icon} size={18} color="var(--ink2)"/></div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-meta">{s.meta}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="card">
              <div className="card-hd">
                <div className="flex items-center justify-between">
                  <div className="h3" style={{fontSize:14}}>Recent Bookings</div>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setTab('bookings')}>View all <Icon n="chevR" size={13}/></button>
                </div>
              </div>
              {bkLoading?<Loader full/>:(
                <div className="tbl-wrap" style={{border:'none',borderRadius:0}}>
                  <table>
                    <thead><tr><th>Ref</th><th>Location</th><th>Spot</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {bookings.slice(0,5).map(b=>(
                        <tr key={b.id}>
                          <td><span className="mono text-xs">{b.bookingReference}</span></td>
                          <td className="fw-600">{b.locationName}</td>
                          <td>{b.spotNumber}</td>
                          <td className="fw-700">${Number(b.totalAmount||0).toFixed(2)}</td>
                          <td><Bdg status={b.status}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        {/* BOOKINGS */}
        {tab==='bookings'&&(
          <div style={{animation:'fadeUp .35s ease'}}>
            <div className="flex justify-between items-center mb-24">
              <div className="h2" style={{fontSize:22}}>My Bookings</div>
              <button className="btn btn-blue btn-sm" onClick={()=>go('search')}><Icon n="plus" size={14} color="#fff"/>New Booking</button>
            </div>
            <div className="flex gap-8 mb-20 flex-wrap">
              {['ALL','ACTIVE','CONFIRMED','COMPLETED','CANCELLED'].map(s=>(
                <button key={s} className={`chip${fstt===s?' on':''}`} onClick={()=>setFstt(s)}>
                  {s==='ALL'?'All':s.charAt(0)+s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            {bkLoading?<Loader full/>:(
              <div className="flex flex-col gap-12">
                {filtered.map(b=>(
                  <div key={b.id} className="card">
                    <div className="card-p">
                      <div className="flex justify-between items-start flex-wrap gap-12">
                        <div>
                          <div className="flex items-center gap-10 mb-6 flex-wrap">
                            <span className="fw-700" style={{fontSize:15}}>{b.locationName}</span><Bdg status={b.status}/>
                          </div>
                          <div className="text-sm c-muted mb-6">Spot <strong>{b.spotNumber}</strong> · {b.startTime?.split('T')[0]} · {b.startTime?.split('T')[1]?.slice(0,5)} – {b.endTime?.split('T')[1]?.slice(0,5)}</div>
                          <span className="mono text-xs c-muted">{b.bookingReference}</span>
                        </div>
                        <div className="text-right">
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:800}}>${Number(b.totalAmount||0).toFixed(2)}</div>
                          <div className="flex gap-8 mt-8 justify-end">
                            {(b.status==='ACTIVE'||b.status==='CONFIRMED')&&(
                              <button className="btn btn-danger btn-sm" onClick={()=>setConfirm({id:b.id,ref:b.bookingReference})}>Cancel</button>
                            )}
                            <button className="btn btn-ghost btn-sm">Details</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.length===0&&<div className="card text-center" style={{padding:40}}><p className="c-muted">No bookings found.</p></div>}
              </div>
            )}
          </div>
        )}
        {/* PAYMENTS */}
        {tab==='payments'&&(
          <div style={{animation:'fadeUp .35s ease'}}>
            <div className="h2 mb-24" style={{fontSize:22}}>Payment History</div>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Date</th><th>Reference</th><th>Location</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {bookings.map(b=>(
                    <tr key={b.id}>
                      <td className="text-sm c-muted">{b.startTime?.split('T')[0]||'—'}</td>
                      <td><span className="mono text-xs">{b.bookingReference}</span></td>
                      <td>{b.locationName}</td>
                      <td className="fw-700">${Number(b.totalAmount||0).toFixed(2)}</td>
                      <td><Bdg status={b.status==='CANCELLED'?'CANCELLED':'COMPLETED'}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* PROFILE */}
        {tab==='profile'&&(
          <div style={{animation:'fadeUp .35s ease',maxWidth:560}}>
            <div className="h2 mb-24" style={{fontSize:22}}>Profile Settings</div>
            <div className="card mb-16">
              <div className="card-hd"><div className="h3" style={{fontSize:14}}>Personal Information</div></div>
              <div className="card-p">
                {profileForm&&(<>
                  <div className="form-2">
                    <div className="fg"><label className="lbl">First Name</label><input className="inp" value={profileForm.firstName||''} onChange={e=>setProfileForm(f=>({...f,firstName:e.target.value}))}/></div>
                    <div className="fg"><label className="lbl">Last Name</label><input className="inp" value={profileForm.lastName||''} onChange={e=>setProfileForm(f=>({...f,lastName:e.target.value}))}/></div>
                  </div>
                  <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" value={profileForm.email||''} onChange={e=>setProfileForm(f=>({...f,email:e.target.value}))}/></div>
                  <div className="fg"><label className="lbl">Phone</label><input className="inp" type="tel" value={profileForm.phone||''} onChange={e=>setProfileForm(f=>({...f,phone:e.target.value}))}/></div>
                  <button className="btn btn-blue" onClick={saveProfile} disabled={saving}>{saving?<><Loader sm/>Saving…</>:'Save Changes'}</button>
                </>)}
              </div>
            </div>
          </div>
        )}
      </main>
      {confirm&&(
        <ConfirmModal
          title="Cancel Booking"
          message={`Cancel booking ${confirm.ref}? This action cannot be undone.`}
          onConfirm={()=>cancelBooking(confirm.id)}
          onClose={()=>setConfirm(null)}
          danger
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAYMENT
═══════════════════════════════════════════════════════════ */
const Payment = ({toast,go}) => {
  const [step,setStep]=useState(1);
  const [method,setMethod]=useState('card');
  const [loading,setLoad]=useState(false);
  const [num,setNum]=useState('');
  const [exp,setExp]=useState('');
  const [cvv,setCvv]=useState('');
  const [name,setName]=useState('');
  const bk={ref:'PW-2024-005',location:'Midtown Smart Lot',spot:'B-07',date:'Dec 5, 2024',time:'10:00 AM – 2:00 PM',duration:'4 hours',sub:26.00,fee:1.50,tax:2.20,total:29.70};
  const fmtNum=v=>v.replace(/\s/g,'').replace(/(\d{4})/g,'$1 ').trim().slice(0,19);
  const fmtExp=v=>{const d=v.replace(/\D/g,'').slice(0,4);return d.length>2?`${d.slice(0,2)}/${d.slice(2)}`:d};

  const pay=async()=>{
    if(method==='card'&&(!num||!exp||!cvv||!name)){toast('error','Please fill in all card details');return;}
    setLoad(true);
    try {
      await api.payments.process({bookingId:1,paymentMethod:'CREDIT_CARD',cardLastFour:num.slice(-4),cardBrand:'VISA'});
    } catch {}
    setLoad(false); setStep(3); toast('success','Payment successful!');
  };

  return (
    <div>
      <div className="page-hero"><div className="container"><div className="page-hero-label">Checkout</div><div className="page-hero-title">Secure Payment</div><div className="page-hero-sub">Your booking is held for 10 minutes</div></div></div>
      <div className="container section">
        <div className="steps" style={{maxWidth:420,margin:'0 auto 32px'}}>
          {[['Details',1],['Payment',2],['Confirmation',3]].map(([l,n],i)=>(
            <div key={n} className="step">
              <div className={`step-dot${step>n?' done':step===n?' act':' idle'}`}>{step>n?<Icon n="check" size={13} color="#fff"/>:n}</div>
              <span className={`step-text${step>=n?' act':''}`}>{l}</span>
              {i<2&&<div className={`step-line${step>n?' done':''}`}/>}
            </div>
          ))}
        </div>
        <div className="flex gap-20" style={{alignItems:'flex-start',maxWidth:820,margin:'0 auto'}}>
          <div style={{flex:1,minWidth:0}}>
            {step<3?(
              <>
                {step===1&&(
                  <div className="card" style={{animation:'fadeUp .3s ease'}}>
                    <div className="card-hd"><div className="h3" style={{fontSize:15}}>Booking Details</div></div>
                    <div className="card-p">
                      {[['Location',bk.location],['Spot',bk.spot],['Date',bk.date],['Time',bk.time],['Duration',bk.duration]].map(([k,v])=>(
                        <div key={k} className="flex justify-between mb-10"><span className="text-sm c-muted">{k}</span><span className="text-sm fw-600">{v}</span></div>
                      ))}
                      <hr className="div"/>
                      <button className="btn btn-blue btn-full" onClick={()=>setStep(2)}>Continue to Payment <Icon n="arrowR" size={14} color="#fff"/></button>
                    </div>
                  </div>
                )}
                {step===2&&(
                  <div style={{animation:'fadeUp .3s ease'}}>
                    <div className="pay-card-vis mb-20">
                      <div className="flex justify-between items-start"><div className="card-chip"/><Icon n="credit" size={22} color="rgba(255,255,255,.5)"/></div>
                      <div className="card-num">{num||'•••• •••• •••• ••••'}</div>
                      <div className="flex justify-between items-end">
                        <div><div style={{fontSize:9,opacity:.5,marginBottom:2,letterSpacing:1}}>CARDHOLDER</div><div style={{fontSize:13,fontWeight:600}}>{name||'YOUR NAME'}</div></div>
                        <div><div style={{fontSize:9,opacity:.5,marginBottom:2,letterSpacing:1}}>EXPIRES</div><div style={{fontSize:13,fontWeight:600}}>{exp||'MM/YY'}</div></div>
                      </div>
                    </div>
                    <div className="flex gap-8 mb-16">
                      {[['card','Card'],['paypal','PayPal'],['wallet','Wallet']].map(([id,l])=>(
                        <button key={id} className={`chip flex-1${method===id?' on':''}`} style={{justifyContent:'center',display:'flex',padding:'9px'}} onClick={()=>setMethod(id)}>{l}</button>
                      ))}
                    </div>
                    {method==='card'&&(
                      <div className="card" style={{animation:'fadeIn .2s ease'}}>
                        <div className="card-p">
                          <div className="fg"><label className="lbl">Card Number</label><input className="inp mono" placeholder="1234 5678 9012 3456" maxLength={19} value={num} onChange={e=>setNum(fmtNum(e.target.value))}/></div>
                          <div className="fg"><label className="lbl">Cardholder Name</label><input className="inp" placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)}/></div>
                          <div className="form-2">
                            <div className="fg"><label className="lbl">Expiry</label><input className="inp mono" placeholder="MM/YY" maxLength={5} value={exp} onChange={e=>setExp(fmtExp(e.target.value))}/></div>
                            <div className="fg"><label className="lbl">CVV</label><input className="inp mono" type="password" placeholder="•••" maxLength={4} value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,''))}/></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {method==='paypal'&&<div className="card text-center" style={{padding:36}}><div style={{fontSize:40,marginBottom:12}}>🅿</div><p className="text-sm c-muted">Redirect to PayPal to complete payment.</p></div>}
                    {method==='wallet'&&<div className="card text-center" style={{padding:36}}><div className="flex gap-10 justify-center flex-wrap">{['🍎 Apple Pay','🤖 Google Pay'].map(w=><button key={w} className="btn btn-outline btn-sm">{w}</button>)}</div></div>}
                    <div className="flex gap-10 mt-16">
                      <button className="btn btn-ghost" onClick={()=>setStep(1)}><Icon n="chevL" size={14}/>Back</button>
                      <button className="btn btn-blue flex-1" onClick={pay} disabled={loading}>
                        {loading?<><Loader sm/>Processing…</>:<>Pay ${bk.total.toFixed(2)}<Icon n="arrowR" size={14} color="#fff"/></>}
                      </button>
                    </div>
                    <div className="flex items-center gap-8 justify-center mt-12"><Icon n="shield" size={13} color="var(--ink3)"/><span className="text-xs c-muted">256-bit SSL · PCI DSS compliant</span></div>
                  </div>
                )}
              </>
            ):(
              <div className="card text-center" style={{padding:52,animation:'scaleIn .3s ease'}}>
                <div style={{width:64,height:64,background:'var(--green-lt)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}><Icon n="check" size={28} color="var(--green)"/></div>
                <div className="h2 mb-8" style={{fontSize:22}}>Payment Successful</div>
                <p className="text-sm c-muted mb-20">Your spot is reserved. Check your email for QR code.</p>
                <div style={{background:'var(--surface)',borderRadius:'var(--r-xl)',padding:'14px 20px',marginBottom:24,display:'inline-block'}}>
                  <div className="label-xs mb-4">Booking Reference</div>
                  <div className="mono fw-700" style={{fontSize:18}}>{bk.ref}</div>
                </div>
                <div className="flex gap-10 justify-center flex-wrap">
                  <button className="btn btn-blue" onClick={()=>go('dashboard')}>View Dashboard</button>
                  <button className="btn btn-outline" onClick={()=>go('search')}>Book Another</button>
                </div>
              </div>
            )}
          </div>
          <div style={{width:264,flexShrink:0}}>
            <div className="card" style={{position:'sticky',top:80}}>
              <div className="card-hd-sm"><div className="h3" style={{fontSize:14}}>Order Summary</div></div>
              <div className="card-p-sm">
                {[['Subtotal ('+bk.duration+')',bk.sub],['Service Fee',bk.fee],['Tax',bk.tax]].map(([k,v])=>(
                  <div key={k} className="flex justify-between mb-8"><span className="text-sm c-muted">{k}</span><span className="text-sm">${v.toFixed(2)}</span></div>
                ))}
                <hr className="div"/>
                <div className="flex justify-between mb-16"><span className="fw-700">Total</span><span style={{fontFamily:"'Outfit',sans-serif",fontSize:19,fontWeight:800,color:'var(--blue)'}}>${bk.total.toFixed(2)}</span></div>
                <div className="flex items-center justify-center gap-8 text-xs c-muted" style={{padding:'8px 0',background:'var(--surface)',borderRadius:'var(--r-lg)'}}><Icon n="shield" size={13}/>Secure Checkout</div>
                <p className="text-xs c-muted text-center mt-10" style={{lineHeight:1.65}}>Free cancellation up to 1 hour before start.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   HELP — POST to /support/tickets
═══════════════════════════════════════════════════════════ */
const FAQS=[
  {id:1,q:"How do I find available parking spots?",a:"Use the Find Parking page to search by location, date, and time. Filter by amenities like EV charging or 24-hour access. Map view shows real-time availability."},
  {id:2,q:"Can I modify or cancel my booking?",a:"Cancel up to 1 hour before the start time for a full refund. To modify, cancel the existing booking and create a new one via Dashboard › My Bookings."},
  {id:3,q:"What payment methods are accepted?",a:"All major credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay. All transactions are protected with 256-bit SSL encryption."},
  {id:4,q:"How long do refunds take?",a:"Refunds are processed automatically within 3–5 business days to your original payment method with email confirmation."},
  {id:5,q:"What happens if I overstay?",a:"Additional time is automatically charged at the standard hourly rate to your saved payment method. You'll receive an email notification."},
  {id:6,q:"Is my vehicle safe?",a:"Locations with the Security badge have 24/7 CCTV and security personnel. Vehicle damage protection is available at select locations."},
];
const Help = ({toast}) => {
  const [open,setOpen]=useState(null);
  const [done,setDone]=useState(false);
  const [loading,setLoad]=useState(false);
  const [form,setForm]=useState({name:'',email:'',cat:'GENERAL',sub:'',msg:''});

  const submit=async()=>{
    if(!form.name||!form.email||!form.sub||!form.msg){toast('error','Please fill in all required fields');return;}
    setLoad(true);
    try { await api.support.submit({name:form.name,email:form.email,category:form.cat,subject:form.sub,message:form.msg}); }
    catch {}
    setLoad(false); setDone(true); toast('success','Support ticket submitted!');
  };

  return (
    <div>
      <div className="page-hero"><div className="container"><div className="page-hero-label">Support</div><div className="page-hero-title">Help & Support</div><div className="page-hero-sub">Find answers fast or reach our team directly</div></div></div>
      <div className="container section">
        <div className="flex gap-32" style={{alignItems:'flex-start'}}>
          <div style={{flex:1,minWidth:0}}>
            <div className="h2 mb-20" style={{fontSize:20}}>Frequently Asked Questions</div>
            {FAQS.map(f=>(
              <div key={f.id} style={{borderBottom:'1px solid var(--line)',...(f.id===1?{borderTop:'1px solid var(--line)'}:{})}}>
                <button style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,padding:'16px 0',width:'100%',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left'}} onClick={()=>setOpen(open===f.id?null:f.id)}>
                  <span style={{fontSize:14,fontWeight:600,color:'var(--ink)'}}>{f.q}</span>
                  <Icon n="chevD" size={16} color="var(--ink3)" style={{transform:open===f.id?'rotate(180deg)':'none',transition:'.2s'}}/>
                </button>
                {open===f.id&&<div style={{fontSize:14,color:'var(--ink2)',lineHeight:1.75,paddingBottom:16,animation:'fadeUp .2s ease'}}>{f.a}</div>}
              </div>
            ))}
          </div>
          <div style={{width:360,flexShrink:0}}>
            <div className="card" style={{position:'sticky',top:80}}>
              <div className="card-hd"><div className="h3" style={{fontSize:15}}>Contact Support</div><div className="text-sm c-muted mt-4">Average response under 2 hours</div></div>
              <div className="card-p">
                {done?(
                  <div className="text-center" style={{padding:'24px 0'}}>
                    <div style={{width:52,height:52,background:'var(--green-lt)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><Icon n="check" size={22} color="var(--green)"/></div>
                    <div className="h3 mb-6">Ticket Submitted</div>
                    <p className="text-sm c-muted mb-16">We'll reply to <strong>{form.email}</strong> within 24 hours.</p>
                    <button className="btn btn-ghost btn-sm" onClick={()=>{setDone(false);setForm({name:'',email:'',cat:'GENERAL',sub:'',msg:''})}}>Submit Another</button>
                  </div>
                ):(
                  <>
                    <div className="form-2">
                      <div className="fg"><label className="lbl">Name</label><input className="inp" placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                      <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
                    </div>
                    <div className="fg"><label className="lbl">Category</label>
                      <select className="sel" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
                        <option value="GENERAL">General Inquiry</option><option value="BOOKING">Booking Issue</option><option value="PAYMENT">Payment Issue</option><option value="TECHNICAL">Technical Problem</option>
                      </select>
                    </div>
                    <div className="fg"><label className="lbl">Subject</label><input className="inp" placeholder="Brief description" value={form.sub} onChange={e=>setForm(f=>({...f,sub:e.target.value}))}/></div>
                    <div className="fg"><label className="lbl">Message</label><textarea className="ta" rows={4} placeholder="Describe your issue…" value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))}/></div>
                    <button className="btn btn-blue btn-full" onClick={submit} disabled={loading}>
                      {loading?<><Loader sm/>Submitting…</>:<>Send Message <Icon n="arrowR" size={14} color="#fff"/></>}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   LOGIN — POST to /auth/login & /auth/register
═══════════════════════════════════════════════════════════ */
const Login = ({go,setUser,toast}) => {
  const [reg,setReg]=useState(false);
  const [form,setForm]=useState({email:'',pw:'',name:'',firstName:'',lastName:''});
  const [loading,setLoad]=useState(false);
  const [err,setErr]=useState('');

  const submit=async()=>{
    if(!form.email||!form.pw||(reg&&!form.firstName)){setErr('Please fill in all fields.');return;}
    setErr(''); setLoad(true);
    try {
      let res;
      if(reg){
        res=await api.auth.register({firstName:form.firstName,lastName:form.lastName||'',email:form.email,password:form.pw});
        
      } else {
        const res = await api.auth.login(form.email, form.pw);

        console.log("LOGIN RESPONSE:", res); // debug

        // 🔥 STORE TOKEN
        localStorage.setItem("pw_token", res.token);
        localStorage.setItem("pw_user", JSON.stringify(res.user));

// update app state if needed
setUser(res.user);

// redirect or reload
window.location.reload();
      }
      if(res.token){
        localStorage.setItem('pw_token',res.token);
        localStorage.setItem('pw_user',JSON.stringify(res.user||{}));
      }
      const user=res.user||{firstName:form.firstName||form.email.split('@')[0],email:form.email,role:'USER'};
      setUser(user);
      toast('success',reg?'Account created!':'Welcome back!');
      go('dashboard');
    } catch(e) {
      // Mock fallback
      const mockUser={firstName:form.firstName||form.email.split('@')[0],email:form.email,role:form.email.includes('admin')?'ADMIN':'USER'};
      setUser(mockUser);
      toast('success',reg?'Account created (demo mode)!':'Signed in (demo mode)!');
      go('dashboard');
    } finally { setLoad(false); }
  };

  return (
    <div style={{minHeight:'calc(100vh)',display:'flex',background:'var(--surface)'}}>
      <div style={{flex:1,background:'var(--ink)',display:'flex',flexDirection:'column',justifyContent:'center',padding:'60px 48px',minWidth:320}}>
        <div style={{maxWidth:360}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:48}}>
            <div style={{width:36,height:36,background:'rgba(255,255,255,.1)',borderRadius:'var(--r-lg)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon n="car" size={18} color="rgba(255,255,255,.8)"/></div>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:17,color:'#fff'}}>ParkWise</span>
          </div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:'clamp(26px,3.5vw,36px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:16,letterSpacing:-1}}>The smarter<br/>way to park.</div>
          <p style={{color:'rgba(255,255,255,.45)',fontSize:15,lineHeight:1.7,marginBottom:36}}>Real-time availability, instant booking, and turn-by-turn navigation.</p>
          <div style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'var(--r-xl)',padding:'14px 16px',marginBottom:12}}>
            <div className="text-xs" style={{color:'rgba(255,255,255,.4)',marginBottom:6}}>DEMO CREDENTIALS</div>
            <div className="mono" style={{color:'rgba(255,255,255,.6)',fontSize:12}}>admin@parkwise.com / any password</div>
            <div className="mono" style={{color:'rgba(255,255,255,.6)',fontSize:12}}>any email → regular user</div>
          </div>
          <p style={{color:'rgba(255,255,255,.3)',fontSize:11}}>Backend at <span className="mono">localhost:8080/api</span> · Falls back to mock data when offline</p>
        </div>
      </div>
      <div style={{flex:'0 0 460px',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 32px',background:'#fff'}}>
        <div style={{width:'100%',maxWidth:380}}>
          <div className="mb-28">
            <div className="h2 mb-4" style={{fontSize:22}}>{reg?'Create your account':'Welcome back'}</div>
            <p className="text-sm c-muted">{reg?'Start parking smarter today.':'Sign in to manage your bookings.'}</p>
          </div>
          {err&&<div className="alert alert-err mb-16"><Icon n="warning" size={15}/>{err}</div>}
          {reg&&(
            <div className="form-2">
              <div className="fg"><label className="lbl">First Name</label><input className="inp" placeholder="John" value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))}/></div>
              <div className="fg"><label className="lbl">Last Name</label><input className="inp" placeholder="Doe" value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))}/></div>
            </div>
          )}
          <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
          <div className="fg">
            <div className="flex justify-between items-center mb-5">
              <label className="lbl" style={{margin:0}}>Password</label>
              {!reg&&<button style={{background:'none',border:'none',color:'var(--blue)',cursor:'pointer',fontSize:13,fontWeight:600}}>Forgot?</button>}
            </div>
            <input className="inp" type="password" placeholder="••••••••" value={form.pw} onChange={e=>setForm(f=>({...f,pw:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&submit()}/>
          </div>
          <button className="btn btn-blue btn-full mb-10" onClick={submit} disabled={loading||!form.email||!form.pw}>
            {loading?<><Loader sm/>{reg?'Creating…':'Signing in…'}</>:<>{reg?'Create Account':'Sign In'}<Icon n="arrowR" size={14} color="#fff"/></>}
          </button>
          <p className="text-center text-sm c-muted mt-16">
            {reg?'Already have an account? ':'New to ParkWise? '}
            <button style={{background:'none',border:'none',color:'var(--blue)',cursor:'pointer',fontWeight:600,fontSize:13}} onClick={()=>{setReg(!reg);setErr('')}}>
              {reg?'Sign In':'Create account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ADMIN PAGE — full management panel via /admin/* endpoints
═══════════════════════════════════════════════════════════ */
const Admin = ({go, user, toast}) => {
  const [tab,setTab]=useState('overview');
  const [userSearch,setUserSearch]=useState('');
  const [replyModal,setReplyModal]=useState(null);
  const [replyMsg,setReplyMsg]=useState('');
  const [addLocModal,setAddLocModal]=useState(false);
  const [newLoc,setNewLoc]=useState({name:'',address:'',city:'',state:'',hourlyRate:'',totalSpots:'',latitude:'',longitude:''});
  const [saving,setSaving]=useState(false);

  const {data:stats,loading:stLoading,reload:reloadStats}=useAPI(()=>api.admin.stats(), MOCK.admin.stats);
  const {data:usersRaw,loading:usLoading,reload:reloadUsers}=useAPI(()=>api.admin.users(), MOCK.admin.users);
  const {data:bookingsRaw,loading:bkLoading}=useAPI(()=>api.admin.bookings(), MOCK.bookings);
  const {data:ticketsRaw,loading:tkLoading,reload:reloadTickets}=useAPI(()=>api.admin.tickets(), MOCK.admin.tickets);
  const {data:locsRaw,loading:lcLoading,reload:reloadLocs}=useAPI(()=>api.admin.locations(), MOCK.locations);

  const users=usersRaw?.content||usersRaw||[];
  const bookings=bookingsRaw?.content||bookingsRaw||[];
  const tickets=ticketsRaw?.content||ticketsRaw||[];
  const locs=locsRaw?.content||locsRaw||[];

  const filteredUsers=users.filter(u=>
    !userSearch||`${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const toggleUser=async(id)=>{
    try { await api.admin.userToggle(id); } catch {}
    reloadUsers(); toast('success','User status updated');
  };

  const replyTicket=async()=>{
    if(!replyMsg.trim()){toast('error','Enter a reply message');return;}
    setSaving(true);
    try { await api.admin.ticketReply(replyModal.id,replyMsg); } catch {}
    setSaving(false); setReplyModal(null); setReplyMsg('');
    toast('success','Reply sent'); reloadTickets();
  };

  const addLocation=async()=>{
    if(!newLoc.name||!newLoc.address){toast('error','Fill in required fields');return;}
    setSaving(true);
    try {
      await api.locations.create({...newLoc,hourlyRate:parseFloat(newLoc.hourlyRate)||5,totalSpots:parseInt(newLoc.totalSpots)||50,latitude:parseFloat(newLoc.latitude)||0,longitude:parseFloat(newLoc.longitude)||0});
    } catch {}
    setSaving(false); setAddLocModal(false); reloadLocs(); toast('success','Location added!');
  };

  const adminStats=[
    {icon:'users',label:'Total Users',value:stats?.totalUsers??'…',sub:'Registered accounts',color:'var(--blue)',bg:'var(--blue-lt)'},
    {icon:'calendar',label:'Total Bookings',value:stats?.totalBookings??'…',sub:'All time',color:'var(--green)',bg:'var(--green-lt)'},
    {icon:'credit',label:'Total Revenue',value:stats?.totalRevenue!=null?`$${Number(stats.totalRevenue).toLocaleString()}`:'…',sub:'Collected',color:'var(--amber)',bg:'var(--amber-lt)'},
    {icon:'location',label:'Active Locations',value:stats?.activeLocations??'…',sub:'Parking sites',color:'var(--purple)',bg:'var(--purple-lt)'},
    {icon:'trending',label:'Today\'s Bookings',value:stats?.todayBookings??'…',sub:'New today',color:'var(--blue)',bg:'var(--blue-lt)'},
    {icon:'ticket',label:'Open Tickets',value:stats?.pendingTickets??'…',sub:'Awaiting reply',color:'var(--red)',bg:'var(--red-lt)'},
  ];

  const navItems=[
    {id:'overview',icon:'grid',label:'Overview'},
    {id:'users',icon:'users',label:'Users'},
    {id:'bookings',icon:'calendar',label:'Bookings'},
    {id:'locations',icon:'location',label:'Locations'},
    {id:'tickets',icon:'ticket',label:'Support Tickets'},
    {id:'payments',icon:'credit',label:'Payments'},
  ];

  return (
    <div className="admin-shell">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <div style={{width:28,height:28,background:'var(--blue)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon n="admin" size={14} color="#fff"/></div>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,color:'#fff',fontSize:15}}>Admin Panel</span>
          </div>
          <div className="admin-sidebar-title">ParkWise Management</div>
        </div>
        <div style={{padding:'0 8px'}}>
          {navItems.map(n=>(
            <button key={n.id} className={`admin-nav-btn${tab===n.id?' on':''}`} onClick={()=>setTab(n.id)}>
              <div className="a-icon"><Icon n={n.icon} size={14} color="inherit"/></div>
              {n.label}
              {n.id==='tickets'&&(stats?.pendingTickets>0)&&<span style={{marginLeft:'auto',background:'var(--red)',color:'#fff',fontSize:10,padding:'1px 6px',borderRadius:10,fontWeight:700}}>{stats.pendingTickets}</span>}
            </button>
          ))}
        </div>
        <hr style={{border:'none',borderTop:'1px solid rgba(255,255,255,.08)',margin:'12px 8px'}}/>
        <div style={{padding:'0 8px'}}>
          <button className="admin-nav-btn" onClick={()=>go('dashboard')}><div className="a-icon"><Icon n="chevL" size={14} color="inherit"/></div>Back to App</button>
        </div>
      </aside>

      {/* Admin Main */}
      <main className="admin-main">
        {/* OVERVIEW */}
        {tab==='overview'&&(
          <div style={{animation:'fadeUp .3s ease'}}>
            <div className="flex items-center justify-between mb-24">
              <div>
                <div className="h2" style={{fontSize:22}}>Dashboard Overview</div>
                <div className="text-sm c-muted mt-4">Welcome back, {user?.firstName}. Here's the platform summary.</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={reloadStats}><Icon n="refresh" size={14}/>Refresh</button>
            </div>
            {stLoading?<Loader full/>:(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14,marginBottom:28}}>
                {adminStats.map((s,i)=>(
                  <div key={i} className="admin-stat" style={{animation:`fadeUp .3s ease both`,animationDelay:`${i*.05}s`}}>
                    <div className="admin-stat-top-bar" style={{background:s.color}}/>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
                      <div style={{width:36,height:36,borderRadius:'var(--r-lg)',background:s.bg,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon n={s.icon} size={17} color={s.color}/></div>
                    </div>
                    <div className="stat-label">{s.label}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:800,color:'var(--ink)',margin:'4px 0 2px',letterSpacing:'-1px'}}>{s.value}</div>
                    <div className="stat-meta">{s.sub}</div>
                  </div>
                ))}
              </div>
            )}
            {/* Quick actions */}
            <div className="card mb-16">
              <div className="card-hd"><div className="h3" style={{fontSize:14}}>Quick Actions</div></div>
              <div className="card-p">
                <div className="flex gap-10 flex-wrap">
                  <button className="btn btn-blue btn-sm" onClick={()=>setTab('locations')}><Icon n="plus" size={14} color="#fff"/>Add Location</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setTab('users')}><Icon n="users" size={14}/>Manage Users</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setTab('tickets')}><Icon n="ticket" size={14}/>Support Tickets {stats?.pendingTickets>0&&<span className="badge b-red" style={{marginLeft:4}}>{stats.pendingTickets}</span>}</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setTab('payments')}><Icon n="activity" size={14}/>Revenue Report</button>
                </div>
              </div>
            </div>
            {/* Recent bookings preview */}
            <div className="card">
              <div className="card-hd"><div className="flex justify-between items-center"><div className="h3" style={{fontSize:14}}>Recent Activity</div><button className="btn btn-ghost btn-sm" onClick={()=>setTab('bookings')}>View All</button></div></div>
              <div className="tbl-wrap" style={{border:'none',borderRadius:0}}>
                <table>
                  <thead><tr><th>Reference</th><th>Location</th><th>Spot</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {bookings.slice(0,6).map(b=>(
                      <tr key={b.id}>
                        <td><span className="mono text-xs">{b.bookingReference}</span></td>
                        <td className="fw-600">{b.locationName}</td>
                        <td>{b.spotNumber}</td>
                        <td className="fw-700">${Number(b.totalAmount||0).toFixed(2)}</td>
                        <td><Bdg status={b.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab==='users'&&(
          <div style={{animation:'fadeUp .3s ease'}}>
            <div className="flex items-center justify-between mb-20">
              <div className="h2" style={{fontSize:22}}>User Management</div>
              <span className="text-sm c-muted">{filteredUsers.length} users</span>
            </div>
            <div className="sbar mb-16" style={{maxWidth:360}}>
              <Icon n="search" size={16} color="var(--ink3)"/>
              <input placeholder="Search by name or email…" value={userSearch} onChange={e=>setUserSearch(e.target.value)}/>
            </div>
            {usLoading?<Loader full/>:(
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Bookings</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u=>(
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-10">
                            <div style={{width:32,height:32,borderRadius:'50%',background:`hsl(${u.id*50},70%,85%)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontWeight:700,fontSize:12,color:'var(--ink2)'}}>
                              {(u.firstName||'?')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-600 text-sm">{u.firstName} {u.lastName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-sm c-muted">{u.email}</td>
                        <td><Bdg status={u.role}/></td>
                        <td className="text-sm">{u.totalBookings||0}</td>
                        <td className="text-sm c-muted">{u.createdAt?.split('T')[0]||u.createdAt||'—'}</td>
                        <td><span className={`badge ${u.isActive?'b-green':'b-red'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                        <td>
                          <div className="flex gap-6">
                            <button className={`btn btn-sm ${u.isActive?'btn-danger':'btn-ghost'}`} onClick={()=>toggleUser(u.id)}>
                              {u.isActive?'Disable':'Enable'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {tab==='bookings'&&(
          <div style={{animation:'fadeUp .3s ease'}}>
            <div className="flex items-center justify-between mb-20">
              <div className="h2" style={{fontSize:22}}>All Bookings</div>
              <span className="text-sm c-muted">{bookings.length} total</span>
            </div>
            {bkLoading?<Loader full/>:(
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>Reference</th><th>User</th><th>Location</th><th>Spot</th><th>Date</th><th>Duration</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {bookings.map(b=>(
                      <tr key={b.id}>
                        <td><span className="mono text-xs">{b.bookingReference}</span></td>
                        <td className="text-sm">{b.userName||b.userEmail||`User #${b.userId||'—'}`}</td>
                        <td className="fw-600 text-sm">{b.locationName}</td>
                        <td className="text-sm">{b.spotNumber}</td>
                        <td className="text-sm c-muted">{b.startTime?.split('T')[0]||'—'}</td>
                        <td className="text-sm">{Number(b.durationHours||0).toFixed(1)}h</td>
                        <td className="fw-700">${Number(b.totalAmount||0).toFixed(2)}</td>
                        <td><Bdg status={b.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* LOCATIONS */}
        {tab==='locations'&&(
          <div style={{animation:'fadeUp .3s ease'}}>
            <div className="flex items-center justify-between mb-20">
              <div className="h2" style={{fontSize:22}}>Parking Locations</div>
              <button className="btn btn-blue btn-sm" onClick={()=>setAddLocModal(true)}><Icon n="plus" size={14} color="#fff"/>Add Location</button>
            </div>
            {lcLoading?<Loader full/>:(
              <div className="flex flex-col gap-12">
                {locs.map(l=>(
                  <div key={l.id} className="card">
                    <div className="card-p">
                      <div className="flex items-start justify-between flex-wrap gap-12">
                        <div style={{flex:1,minWidth:0}}>
                          <div className="flex items-center gap-10 mb-6 flex-wrap">
                            <span className="fw-700" style={{fontSize:15}}>{l.name}</span>
                            <span className="badge b-green">Active</span>
                          </div>
                          <div className="text-sm c-muted mb-8 flex items-center gap-5"><Icon n="pin" size={12} color="var(--ink3)"/>{l.address}, {l.city}, {l.state}</div>
                          <div className="flex gap-6 flex-wrap">
                            {l.isCovered&&<span className="tag"><Icon n="building" size={10}/>Covered</span>}
                            {l.hasEvCharging&&<span className="tag"><Icon n="bolt" size={10}/>EV</span>}
                            {l.hasSecurity&&<span className="tag"><Icon n="shield" size={10}/>Security</span>}
                            {l.is24Hours&&<span className="tag"><Icon n="clock" size={10}/>24/7</span>}
                          </div>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,auto)',gap:'8px 24px',textAlign:'center',flexShrink:0}}>
                          {[['Hourly',`$${(l.hourlyRate||l.hourly||0).toFixed(2)}`],['Available',`${l.availableSpots??l.available??0}/${l.totalSpots??l.total??0}`],['Rating',`${(l.rating||0).toFixed(1)} ★`]].map(([k,v])=>(
                            <div key={k}><div className="label-xs">{k}</div><div className="fw-700" style={{fontSize:15}}>{v}</div></div>
                          ))}
                        </div>
                        <div className="flex gap-8">
                          <button className="btn btn-ghost btn-sm"><Icon n="edit" size={13}/>Edit</button>
                          <button className="btn btn-danger btn-sm"><Icon n="trash" size={13}/>Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUPPORT TICKETS */}
        {tab==='tickets'&&(
          <div style={{animation:'fadeUp .3s ease'}}>
            <div className="flex items-center justify-between mb-20">
              <div className="h2" style={{fontSize:22}}>Support Tickets</div>
              <span className="text-sm c-muted">{tickets.length} tickets</span>
            </div>
            {tkLoading?<Loader full/>:(
              <div className="flex flex-col gap-12">
                {tickets.map(t=>(
                  <div key={t.id} className="card">
                    <div className="card-p">
                      <div className="flex items-start justify-between flex-wrap gap-12">
                        <div style={{flex:1,minWidth:0}}>
                          <div className="flex items-center gap-10 mb-6 flex-wrap">
                            <span className="fw-700" style={{fontSize:15}}>{t.subject}</span>
                            <Bdg status={t.status||'OPEN'}/>
                            <span className="tag">{t.category}</span>
                          </div>
                          <div className="text-sm c-muted mb-8">From: <strong>{t.userName||t.name||'Unknown'}</strong> · {t.email} · {t.createdAt?.split('T')[0]||t.createdAt}</div>
                          <p className="text-sm" style={{lineHeight:1.7,color:'var(--ink2)',background:'var(--surface)',padding:'10px 14px',borderRadius:'var(--r-lg)'}}>{t.message}</p>
                        </div>
                        <div className="flex gap-8 flex-wrap">
                          <button className="btn btn-blue btn-sm" onClick={()=>{setReplyModal(t);setReplyMsg('')}}><Icon n="arrowR" size={13} color="#fff"/>Reply</button>
                          <button className="btn btn-ghost btn-sm">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {tickets.length===0&&<div className="card text-center" style={{padding:40}}><p className="c-muted">No open tickets. 🎉</p></div>}
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS */}
        {tab==='payments'&&(
          <div style={{animation:'fadeUp .3s ease'}}>
            <div className="h2 mb-20" style={{fontSize:22}}>Revenue & Payments</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24}}>
              {[['Total Revenue',stats?.totalRevenue!=null?`$${Number(stats.totalRevenue).toLocaleString()}`:'…','var(--green)'],['Today\'s Revenue','$1,240','var(--blue)'],['Pending Refunds','$420','var(--amber)']].map(([l,v,c])=>(
                <div key={l} className="admin-stat">
                  <div className="admin-stat-top-bar" style={{background:c}}/>
                  <div className="stat-label mt-10">{l}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:800,color:'var(--ink)',margin:'4px 0'}}>{v}</div>
                </div>
              ))}
            </div>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Date</th><th>Reference</th><th>User</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                <tbody>
                  {bookings.map(b=>(
                    <tr key={b.id}>
                      <td className="text-sm c-muted">{b.startTime?.split('T')[0]||'—'}</td>
                      <td><span className="mono text-xs">{b.bookingReference}</span></td>
                      <td className="text-sm">{b.userName||`User #${b.userId||'—'}`}</td>
                      <td className="fw-700">${Number(b.totalAmount||0).toFixed(2)}</td>
                      <td className="text-sm">Visa ···· 1234</td>
                      <td><Bdg status={b.status==='CANCELLED'?'CANCELLED':'COMPLETED'}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Reply modal */}
      {replyModal&&(
        <div className="overlay" onClick={()=>setReplyModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-hd"><span className="modal-title">Reply to: {replyModal.subject}</span><button className="modal-close" onClick={()=>setReplyModal(null)}><Icon n="close" size={14}/></button></div>
            <div className="modal-body">
              <div style={{background:'var(--surface)',borderRadius:'var(--r-lg)',padding:'10px 14px',marginBottom:16,fontSize:13,color:'var(--ink2)'}}>
                <div className="text-xs c-muted mb-4">From {replyModal.userName} · {replyModal.email}</div>
                {replyModal.message}
              </div>
              <div className="fg"><label className="lbl">Your Reply</label><textarea className="ta" rows={5} placeholder="Type your response…" value={replyMsg} onChange={e=>setReplyMsg(e.target.value)}/></div>
              <div className="flex gap-10">
                <button className="btn btn-ghost flex-1" onClick={()=>setReplyModal(null)}>Cancel</button>
                <button className="btn btn-blue flex-1" onClick={replyTicket} disabled={saving}>{saving?<><Loader sm/>Sending…</>:<><Icon n="arrowR" size={14} color="#fff"/>Send Reply</>}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Location modal */}
      {addLocModal&&(
        <div className="overlay" onClick={()=>setAddLocModal(false)}>
          <div className="modal-box" style={{maxWidth:600}} onClick={e=>e.stopPropagation()}>
            <div className="modal-hd"><span className="modal-title">Add Parking Location</span><button className="modal-close" onClick={()=>setAddLocModal(false)}><Icon n="close" size={14}/></button></div>
            <div className="modal-body">
              <div className="form-2">
                <div className="fg" style={{gridColumn:'1/-1'}}><label className="lbl">Location Name *</label><input className="inp" placeholder="e.g. Downtown Garage" value={newLoc.name} onChange={e=>setNewLoc(f=>({...f,name:e.target.value}))}/></div>
                <div className="fg" style={{gridColumn:'1/-1'}}><label className="lbl">Address *</label><input className="inp" placeholder="123 Main St" value={newLoc.address} onChange={e=>setNewLoc(f=>({...f,address:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">City</label><input className="inp" placeholder="New York" value={newLoc.city} onChange={e=>setNewLoc(f=>({...f,city:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">State</label><input className="inp" placeholder="NY" value={newLoc.state} onChange={e=>setNewLoc(f=>({...f,state:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">Hourly Rate ($)</label><input className="inp" type="number" placeholder="5.00" value={newLoc.hourlyRate} onChange={e=>setNewLoc(f=>({...f,hourlyRate:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">Total Spots</label><input className="inp" type="number" placeholder="100" value={newLoc.totalSpots} onChange={e=>setNewLoc(f=>({...f,totalSpots:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">Latitude</label><input className="inp" placeholder="40.7128" value={newLoc.latitude} onChange={e=>setNewLoc(f=>({...f,latitude:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">Longitude</label><input className="inp" placeholder="-74.0060" value={newLoc.longitude} onChange={e=>setNewLoc(f=>({...f,longitude:e.target.value}))}/></div>
              </div>
              <div className="flex gap-10 mt-8">
                <button className="btn btn-ghost flex-1" onClick={()=>setAddLocModal(false)}>Cancel</button>
                <button className="btn btn-blue flex-1" onClick={addLocation} disabled={saving}>{saving?<><Loader sm/>Adding…</>:<><Icon n="plus" size={14} color="#fff"/>Add Location</>}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
let _toast; // module-level toast ref for API layer

export default function App() {
  const [page,setPage]   = useState('landing');
  const [user,setUser]   = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('pw_user')); } catch{ return null; }
  });
  const [sel,setSel]     = useState(null);
  const [toasts,setTsts] = useState([]);

  const toast = useCallback((type,message)=>{
    const id=Date.now();
    setTsts(t=>[...t,{id,type,message}]);
    setTimeout(()=>setTsts(t=>t.filter(x=>x.id!==id)),3800);
  },[]);

  _toast = toast;

  const go = useCallback(p=>{ setPage(p); window.scrollTo(0,0); },[]);

  // Guard admin page
  useEffect(()=>{
    if(page==='admin'&&user?.role!=='ADMIN'){toast('error','Admin access required');go('dashboard');}
  },[page,user]);

  return (
    <>
      <style>{CSS}</style>
      {page!=='login'&&<TopNav page={page} go={go} user={user} setUser={setUser}/>}
      <div style={{paddingTop:page==='login'||page==='admin'?0:60}}>
        {page==='landing'      && <Landing go={go}/>}
        {page==='search'       && <Search go={go} setSel={setSel} toast={toast}/>}
        {page==='availability' && <Availability go={go} sel={sel} toast={toast} user={user}/>}
        {page==='dashboard'    && <Dashboard go={go} user={user} toast={toast}/>}
        {page==='payment'      && <Payment go={go} toast={toast}/>}
        {page==='help'         && <Help toast={toast}/>}
        {page==='login'        && <Login go={go} setUser={setUser} toast={toast}/>}
        {page==='admin'        && user?.role==='ADMIN' && <Admin go={go} user={user} toast={toast}/>}
      </div>
      <Toast items={toasts}/>
    </>
  );
}