import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const LOCATIONS = [
  { id:1, name:"Downtown Central", address:"123 Main Street", city:"New York", state:"NY", available:45, total:200, hourly:5.00, daily:35, rating:4.5, reviews:128, covered:true, ev:true, security:true, h24:true, lat:40.7128, lng:-74.006 },
  { id:2, name:"Airport Terminal Garage", address:"1 Airport Blvd", city:"New York", state:"NY", available:120, total:500, hourly:8.00, daily:50, rating:4.2, reviews:89, covered:true, ev:false, security:true, h24:true, lat:40.6413, lng:-73.7781 },
  { id:3, name:"Midtown Smart Lot", address:"456 Park Ave", city:"New York", state:"NY", available:23, total:100, hourly:6.50, daily:40, rating:4.7, reviews:210, covered:false, ev:true, security:false, h24:false, lat:40.7549, lng:-73.984 },
  { id:4, name:"West Side Hub", address:"789 West Side Hwy", city:"New York", state:"NY", available:67, total:150, hourly:4.00, daily:28, rating:3.9, reviews:54, covered:false, ev:false, security:true, h24:true, lat:40.7614, lng:-74.0 },
];

const BOOKINGS = [
  { id:1, ref:"PW-001", location:"Downtown Central", spot:"A-12", status:"COMPLETED", date:"2024-11-15", start:"09:00", end:"17:00", amount:40.00, duration:"8h" },
  { id:2, ref:"PW-002", location:"Midtown Smart Lot", spot:"B-05", status:"ACTIVE",    date:"2024-12-01", start:"10:00", end:"14:00", amount:26.00, duration:"4h" },
  { id:3, ref:"PW-003", location:"Airport Terminal", spot:"C-33", status:"CONFIRMED",  date:"2024-12-05", start:"08:00", end:"20:00", amount:96.00, duration:"12h" },
  { id:4, ref:"PW-004", location:"West Side Hub",    spot:"D-08", status:"CANCELLED",  date:"2024-11-28", start:"14:00", end:"18:00", amount:16.00, duration:"4h" },
];

const FAQS = [
  { id:1, q:"How do I find available parking spots?", a:"Use the Find Parking page to search by location, date, and time. Filter by amenities like EV charging or 24-hour access. Map view shows real-time availability." },
  { id:2, q:"Can I modify or cancel my booking?", a:"Cancel up to 1 hour before the start time for a full refund. To modify, cancel the existing booking and create a new one via Dashboard › My Bookings." },
  { id:3, q:"What payment methods are accepted?", a:"All major credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay. All transactions are protected with 256-bit SSL encryption." },
  { id:4, q:"How long do refunds take?", a:"Refunds are processed automatically within 3–5 business days to your original payment method with email confirmation." },
  { id:5, q:"What happens if I overstay?", a:"Additional time is automatically charged at the standard hourly rate to your saved payment method. You'll receive an email notification." },
  { id:6, q:"Is my vehicle safe?", a:"Locations with the Security badge have 24/7 CCTV and security personnel. Vehicle damage protection is available at select locations." },
];

/* ═══════════════════════════════════════════════════════════
   ICONS (inline SVG — no emoji chrome)
═══════════════════════════════════════════════════════════ */
const Icon = ({ n, size=16, color="currentColor", style:st={} }) => {
  const paths = {
    home:       "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    search:     "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
    map:        "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16 M16 6v16",
    calendar:   "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
    grid:       "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    user:       "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    help:       "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3 M12 17h.01",
    credit:     "M1 4h22v16H1z M1 10h22",
    logout:     "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    menu:       "M3 12h18M3 6h18M3 18h18",
    close:      "M18 6L6 18M6 6l12 12",
    chevD:      "M6 9l6 6 6-6",
    chevR:      "M9 18l6-6-6-6",
    chevL:      "M15 18l-6-6 6-6",
    check:      "M20 6L9 17l-5-5",
    car:        "M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-4h12l2 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-2m-7 0a2 2 0 100-4 2 2 0 000 4zm7 0a2 2 0 100-4 2 2 0 000 4z",
    bolt:       "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    shield:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    clock:      "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
    building:   "M3 21h18M9 21V3h6v18M3 21V9l6-6M21 21V9l-6-6",
    pin:        "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a1 1 0 100-2 1 1 0 000 2z",
    star:       "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    plus:       "M12 5v14M5 12h14",
    arrowR:     "M5 12h14M12 5l7 7-7 7",
    warning:    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4M12 17h.01",
    navigate:   "M3 11l19-9-9 19-2-8-8-2z",
    bike:       "M12 12m-4 0a4 4 0 108 0 4 4 0 10-8 0 M4 12a4 4 0 108 0 4 4 0 10-8 0 M12 8l-2-4h6 M10 8h4",
    walk:       "M13 4a1 1 0 100-2 1 1 0 000 2z M7 20l3-7 2 3 2-2 3 6 M6 12l1-5 5 1 2 4",
    bus:        "M8 6v6M16 6v6M2 12h20M7 18h10M5 4h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z M7 18v2M17 18v2",
  };
  const d = paths[n] || paths.help;
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
html{height:100%;scroll-behavior:smooth}
body{
  font-family:'DM Sans',sans-serif;
  background:#F8F9FB;color:#111318;
  line-height:1.6;-webkit-font-smoothing:antialiased;
  min-height:100vh;
}
#root{min-height:100vh}

:root{
  /* Core palette */
  --ink:     #111318;
  --ink2:    #3D424F;
  --ink3:    #6B7280;
  --ink4:    #9CA3AF;
  --line:    #E5E7EB;
  --line2:   #F3F4F6;
  --surface: #F8F9FB;
  --white:   #FFFFFF;

  /* Accent */
  --blue:    #2563EB;
  --blue-lt: #EFF6FF;
  --blue-md: #BFDBFE;
  --blue-dk: #1D4ED8;

  /* States */
  --green:   #16A34A;
  --green-lt:#F0FDF4;
  --amber:   #D97706;
  --amber-lt:#FFFBEB;
  --red:     #DC2626;
  --red-lt:  #FEF2F2;

  /* Radii */
  --r-sm:4px;--r-md:8px;--r-lg:12px;--r-xl:16px;--r-2xl:20px;

  /* Shadows */
  --sh-xs:0 1px 2px rgba(0,0,0,.05);
  --sh-sm:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.04);
  --sh-md:0 4px 6px rgba(0,0,0,.05),0 2px 4px rgba(0,0,0,.04);
  --sh-lg:0 10px 15px rgba(0,0,0,.06),0 4px 6px rgba(0,0,0,.04);
  --sh-xl:0 20px 25px rgba(0,0,0,.07),0 8px 10px rgba(0,0,0,.04);
}

/* ── scrollbar ── */
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--line);border-radius:10px}

/* ── keyframes ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

/* ── APP SHELL ── */
.app-shell{display:flex;min-height:100vh;flex-direction:column}
.app-body{display:flex;flex:1;padding-top:60px}
.main-content{flex:1;min-width:0;overflow-x:hidden}

/* ── TOP NAV ── */
.topnav{
  position:fixed;top:0;left:0;right:0;z-index:900;height:60px;
  background:var(--white);border-bottom:1px solid var(--line);
  display:flex;align-items:center;padding:0 24px;gap:0;
}
.topnav-brand{
  display:flex;align-items:center;gap:10px;
  text-decoration:none;color:inherit;margin-right:32px;flex-shrink:0;
}
.topnav-logo{
  width:32px;height:32px;background:var(--ink);border-radius:var(--r-md);
  display:flex;align-items:center;justify-content:center;
}
.topnav-name{font-family:'Outfit',sans-serif;font-weight:700;font-size:16px;letter-spacing:-.3px;color:var(--ink)}
.topnav-links{display:flex;align-items:center;gap:1px;flex:1}
.topnav-link{
  display:flex;align-items:center;gap:7px;padding:7px 12px;
  border-radius:var(--r-md);font-size:14px;font-weight:500;color:var(--ink3);
  background:none;border:none;cursor:pointer;font-family:inherit;
  transition:color .15s,background .15s;text-decoration:none;white-space:nowrap;
}
.topnav-link:hover{color:var(--ink);background:var(--line2)}
.topnav-link.active{color:var(--ink);background:var(--line2);font-weight:600}
.topnav-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.topnav-user{font-size:13px;color:var(--ink2);font-weight:500}
.hamburger{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:var(--r-md)}
.hamburger:hover{background:var(--line2)}
.mobile-drawer{
  display:none;position:fixed;top:60px;left:0;right:0;z-index:899;
  background:var(--white);border-bottom:1px solid var(--line);
  padding:8px 16px 16px;flex-direction:column;gap:2px;
  animation:slideDown .2s ease;
}
.mobile-drawer.open{display:flex}
.mobile-link{
  display:flex;align-items:center;gap:10px;padding:11px 14px;
  border-radius:var(--r-lg);font-size:14px;font-weight:500;color:var(--ink2);
  background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;
  transition:.15s;width:100%;
}
.mobile-link:hover,.mobile-link.active{background:var(--line2);color:var(--ink)}

/* ── BUTTONS ── */
.btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:9px 18px;border-radius:var(--r-lg);
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;
  cursor:pointer;border:none;transition:all .15s;
  white-space:nowrap;text-decoration:none;line-height:1;
}
.btn-primary{background:var(--ink);color:var(--white)}
.btn-primary:hover{background:var(--ink2);transform:translateY(-1px);box-shadow:var(--sh-md)}
.btn-blue{background:var(--blue);color:var(--white)}
.btn-blue:hover{background:var(--blue-dk);transform:translateY(-1px);box-shadow:0 4px 12px rgba(37,99,235,.3)}
.btn-outline{background:transparent;color:var(--ink);border:1.5px solid var(--line)}
.btn-outline:hover{border-color:var(--ink3);background:var(--line2)}
.btn-ghost{background:var(--line2);color:var(--ink2)}
.btn-ghost:hover{background:var(--line);color:var(--ink)}
.btn-danger{background:var(--red);color:#fff}
.btn-danger:hover{background:#B91C1C}
.btn-sm{padding:6px 13px;font-size:13px;border-radius:var(--r-md)}
.btn-lg{padding:12px 24px;font-size:15px}
.btn-full{width:100%;justify-content:center}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.btn-icon{padding:8px;border-radius:var(--r-md)}

/* ── CARDS ── */
.card{background:var(--white);border-radius:var(--r-xl);border:1px solid var(--line);overflow:hidden}
.card-p{padding:24px}
.card-hd{padding:18px 24px;border-bottom:1px solid var(--line)}
.card-hd-sm{padding:14px 20px;border-bottom:1px solid var(--line)}
.card-p-sm{padding:20px}

/* ── FORMS ── */
.fg{margin-bottom:14px}
.fg:last-child{margin-bottom:0}
.lbl{display:block;font-size:12px;font-weight:600;color:var(--ink3);letter-spacing:.3px;margin-bottom:5px;text-transform:uppercase}
.inp,.sel,.ta{
  width:100%;padding:9px 12px;border:1.5px solid var(--line);
  border-radius:var(--r-lg);font-size:14px;font-family:'DM Sans',sans-serif;
  background:var(--white);color:var(--ink);outline:none;transition:.15s;
}
.inp:focus,.sel:focus,.ta:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.inp::placeholder,.ta::placeholder{color:var(--ink4)}
.sel{
  appearance:none;cursor:pointer;padding-right:36px;
  background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 12px center;
}
.ta{resize:vertical;min-height:90px;line-height:1.6}
.form-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.inp-group{position:relative}
.inp-group .inp{padding-left:38px}
.inp-group .inp-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ink3);pointer-events:none}

/* ── BADGES ── */
.badge{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.badge::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0}
.b-green{background:var(--green-lt);color:var(--green)}
.b-blue{background:var(--blue-lt);color:var(--blue)}
.b-amber{background:var(--amber-lt);color:var(--amber)}
.b-red{background:var(--red-lt);color:var(--red)}
.b-gray{background:var(--line2);color:var(--ink3)}

/* ── TAGS ── */
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:var(--line2);border:1px solid var(--line);border-radius:var(--r-sm);font-size:12px;font-weight:500;color:var(--ink2)}

/* ── CHIP FILTERS ── */
.chip{
  padding:6px 13px;border-radius:20px;font-size:13px;font-weight:500;
  cursor:pointer;border:1.5px solid var(--line);background:var(--white);
  color:var(--ink3);transition:.15s;font-family:inherit;white-space:nowrap;
}
.chip:hover{border-color:var(--ink3);color:var(--ink)}
.chip.on{background:var(--ink);color:var(--white);border-color:var(--ink)}

/* ── SEARCH BAR ── */
.sbar{
  display:flex;align-items:center;gap:10px;background:var(--white);
  border:1.5px solid var(--line);border-radius:var(--r-lg);padding:9px 14px;
  transition:.15s;
}
.sbar:focus-within{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.sbar input{flex:1;border:none;outline:none;font-family:inherit;font-size:14px;background:transparent;color:var(--ink)}
.sbar input::placeholder{color:var(--ink4)}
.sbar-x{background:none;border:none;cursor:pointer;color:var(--ink4);padding:2px;display:flex;align-items:center;transition:.15s}
.sbar-x:hover{color:var(--ink2)}

/* ── ALERT ── */
.alert{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:var(--r-lg);font-size:13px;font-weight:500;margin-bottom:12px}
.alert-info{background:var(--blue-lt);color:var(--blue-dk);border:1px solid var(--blue-md)}
.alert-ok{background:var(--green-lt);color:var(--green);border:1px solid #BBF7D0}
.alert-warn{background:var(--amber-lt);color:var(--amber);border:1px solid #FDE68A}
.alert-err{background:var(--red-lt);color:var(--red);border:1px solid #FECACA}

/* ── DIVIDER ── */
hr.div{border:none;border-top:1px solid var(--line);margin:16px 0}

/* ── LOADER ── */
.spin{width:20px;height:20px;border:2px solid var(--line);border-top-color:var(--blue);border-radius:50%;animation:spin .7s linear infinite}
.spin-sm{width:14px;height:14px}

/* ── LAYOUT UTILS ── */
.flex{display:flex}.flex-col{flex-direction:column}.flex-1{flex:1}.flex-wrap{flex-wrap:wrap}
.items-center{align-items:center}.items-start{align-items:flex-start}.items-end{align-items:flex-end}
.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}
.ml-auto{margin-left:auto}.mr-auto{margin-right:auto}
.gap-4{gap:4px}.gap-6{gap:6px}.gap-8{gap:8px}.gap-10{gap:10px}.gap-12{gap:12px}
.gap-14{gap:14px}.gap-16{gap:16px}.gap-20{gap:20px}.gap-24{gap:24px}.gap-32{gap:32px}
.w-full{width:100%}.h-full{height:100%}
.min-w-0{min-width:0}

/* ── SPACING ── */
.mt-4{margin-top:4px}.mt-6{margin-top:6px}.mt-8{margin-top:8px}.mt-10{margin-top:10px}
.mt-12{margin-top:12px}.mt-16{margin-top:16px}.mt-20{margin-top:20px}.mt-24{margin-top:24px}
.mb-4{margin-bottom:4px}.mb-6{margin-bottom:6px}.mb-8{margin-bottom:8px}.mb-10{margin-bottom:10px}
.mb-12{margin-bottom:12px}.mb-14{margin-bottom:14px}.mb-16{margin-bottom:16px}
.mb-20{margin-bottom:20px}.mb-24{margin-bottom:24px}.mb-28{margin-bottom:28px}.mb-32{margin-bottom:32px}
.p-20{padding:20px}.p-24{padding:24px}

/* ── TYPOGRAPHY ── */
.h1{font-family:'Outfit',sans-serif;font-weight:800;letter-spacing:-.5px;color:var(--ink)}
.h2{font-family:'Outfit',sans-serif;font-weight:700;letter-spacing:-.3px;color:var(--ink)}
.h3{font-family:'Outfit',sans-serif;font-weight:600;letter-spacing:-.2px;color:var(--ink)}
.label-xs{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--ink3)}
.text-xs{font-size:12px}.text-sm{font-size:13px}.text-base{font-size:15px}.text-lg{font-size:17px}
.fw-500{font-weight:500}.fw-600{font-weight:600}.fw-700{font-weight:700}.fw-800{font-weight:800}
.c-muted{color:var(--ink3)}.c-ink2{color:var(--ink2)}.c-blue{color:var(--blue)}.c-green{color:var(--green)}
.c-red{color:var(--red)}.c-white{color:#fff}
.text-center{text-align:center}.text-right{text-align:right}
.mono{font-family:'DM Mono',monospace}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ── GRIDS ── */
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.grid-auto{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.grid-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px}

/* ── PAGE ── */
.page{padding:32px 0;min-height:calc(100vh - 60px)}
.page-hero{background:var(--white);border-bottom:1px solid var(--line);padding:28px 32px}
.page-hero-label{font-size:12px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--ink3);margin-bottom:6px}
.page-hero-title{font-family:'Outfit',sans-serif;font-size:24px;font-weight:800;letter-spacing:-.3px;color:var(--ink);margin-bottom:4px}
.page-hero-sub{font-size:14px;color:var(--ink3)}
html, body, #root {
  height: 100%;
  width: 100%;
}
.container{max-width:100%; width:100% ;margin:0 auto;padding:0 32px}
.section{padding:32px 0}

/* ── SIDEBAR NAV ── */
.sidenav{width:216px;flex-shrink:0;padding:20px 0;position:sticky;top:60px;height:calc(100vh - 60px);overflow-y:auto;border-right:1px solid var(--line);background:var(--white)}
.sidenav-section{padding:0 12px;margin-bottom:4px}
.sidenav-label{font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--ink4);padding:0 8px;margin-bottom:4px}
.sidenav-btn{
  display:flex;align-items:center;gap:10px;width:100%;
  padding:9px 10px;border-radius:var(--r-lg);border:none;background:none;
  font-family:inherit;font-size:14px;font-weight:500;color:var(--ink2);
  cursor:pointer;transition:.15s;text-align:left;
}
.sidenav-btn:hover{background:var(--line2);color:var(--ink)}
.sidenav-btn.on{background:var(--line2);color:var(--ink);font-weight:600}
.sidenav-btn .icon-wrap{width:30px;height:30px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;background:var(--line2);transition:.15s;flex-shrink:0}
.sidenav-btn.on .icon-wrap{background:var(--ink);color:var(--white)}
.sidenav-btn:hover .icon-wrap{background:var(--line)}
.sidenav-divider{border:none;border-top:1px solid var(--line);margin:10px 12px}

/* ── MOBILE TAB BAR ── */
.mob-tabs{display:none;background:var(--white);border-bottom:1px solid var(--line);overflow-x:auto;padding:10px 16px;gap:6px;scrollbar-width:none;position:sticky;top:60px;z-index:50}
.mob-tabs::-webkit-scrollbar{display:none}

/* ── STAT CARD ── */
.stat-card{background:var(--white);border:1px solid var(--line);border-radius:var(--r-xl);padding:20px;position:relative;overflow:hidden}
.stat-card-accent{position:absolute;top:0;left:0;width:3px;height:100%;background:var(--blue)}
.stat-icon{width:36px;height:36px;border-radius:var(--r-lg);background:var(--line2);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.stat-label{font-size:12px;font-weight:600;letter-spacing:.3px;color:var(--ink3);text-transform:uppercase}
.stat-value{font-family:'Outfit',sans-serif;font-size:28px;font-weight:800;color:var(--ink);margin:5px 0 3px;letter-spacing:-.8px;animation:fadeUp .4s ease}
.stat-meta{font-size:12px;color:var(--ink3)}

/* ── HERO (LANDING) ── */
.hero{
  background:var(--ink);
  min-height:calc(100vh - 60px);
  display:flex;align-items:center;
  position:relative;overflow:hidden;
}
.hero-dots{
  position:absolute;inset:0;
  background-image:radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1px);
  background-size:32px 32px;
}
.hero-glow{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}
.hero-inner{
  position:relative;
  z-index:2;
  padding:80px 0;
  max-width:900px;
  margin:0 auto;
  text-align:center;
}.hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
  color:rgba(255,255,255,.7);padding:5px 14px;border-radius:20px;
  font-size:12px;font-weight:600;letter-spacing:.5px;margin-bottom:24px;
}
.hero-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:#4ADE80;animation:pulse 2s ease-in-out infinite}
.hero-title{
  font-family:'Outfit',sans-serif;
  font-size:clamp(36px,5.5vw,64px);font-weight:900;
  color:#fff;line-height:1.05;margin-bottom:20px;letter-spacing:-2px;
}
.hero-title em{color:#60A5FA;font-style:normal}
.hero-sub{
  font-size:clamp(15px,1.8vw,17px);
  color:rgba(255,255,255,.55);
  margin:0 auto 36px;
  max-width:480px;
  line-height:1.7;
  font-weight:400;
  text-align:center;
}
  .hero-search-bar{
  display:flex;
  align-items:center;
  gap:0;
  background:#fff;
  border-radius:var(--r-xl);
  padding:6px 6px 6px 18px;
  box-shadow:0 25px 50px rgba(0,0,0,.35);
  max-width:500px;
  margin:0 auto 40px;
}
.hero-search-bar input{flex:1;border:none;outline:none;font-family:inherit;font-size:15px;color:var(--ink);background:transparent;min-width:0}
.hero-search-bar input::placeholder{color:var(--ink3)}
.hero-stats{
  display:flex;
  gap:clamp(16px,4vw,40px);
  flex-wrap:wrap;
  justify-content:center;
  text-align:center;
}
.hero-stat-val{font-family:'Outfit',sans-serif;font-size:30px;font-weight:900;color:#fff;letter-spacing:-1px}
.hero-stat-lbl{font-size:13px;color:rgba(255,255,255,.45);margin-top:2px}

/* ── LOCATION CARD ── */
.loc-card{background:var(--white);border:1px solid var(--line);border-radius:var(--r-xl);overflow:hidden;transition:all .2s;cursor:pointer ;margin:5px}
.loc-card:hover{box-shadow:var(--sh-xl);transform:translateY(-2px)}
.loc-card-top{
  height:140px;background:var(--ink);
  position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
}
.loc-card-top-pattern{
  position:absolute;inset:0;opacity:.04;
  background-image:radial-gradient(circle,#fff 1px,transparent 1px);
  background-size:20px 20px;
}
.loc-card-top-label{
  position:absolute;top:12px;right:12px;
  background:rgba(255,255,255,.12);backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,.15);
  color:#fff;border-radius:var(--r-md);
  padding:3px 10px;font-size:11px;font-weight:600;
}
.loc-card-avail-good{background:rgba(74,222,128,.15);border-color:rgba(74,222,128,.3);color:#4ADE80}
.loc-card-body{padding:18px}
.loc-card-name{font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;color:var(--ink);margin-bottom:3px}
.loc-card-addr{font-size:13px;color:var(--ink3);margin-bottom:12px;display:flex;align-items:center;gap:5px}
.avail-bar{height:3px;background:var(--line2);border-radius:2px;overflow:hidden;margin:6px 0 12px}
.avail-fill{height:100%;border-radius:2px;transition:width .5s}
.loc-card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--line)}
.loc-price{font-family:'Outfit',sans-serif;font-size:20px;font-weight:800;color:var(--ink)}
.loc-price span{font-size:13px;font-weight:500;color:var(--ink3)}
.stars{display:flex;gap:1px}
.star-on{color:#FBBF24;font-size:12px}.star-off{color:var(--line);font-size:12px}

/* ── SPOT GRID ── */
.spot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(56px,1fr));gap:7px}
.spot{
  aspect-ratio:1;border-radius:var(--r-lg);display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:3px;
  font-size:10px;font-weight:700;cursor:pointer;
  border:1.5px solid transparent;transition:all .15s;
}
.spot-av{background:var(--green-lt);color:var(--green);border-color:#BBF7D0}
.spot-av:hover{background:#DCFCE7;transform:scale(1.05)}
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

/* ── PAYMENT CARD ── */
.pay-card-vis{
  background:var(--ink);border-radius:var(--r-xl);padding:22px;
  color:#fff;position:relative;overflow:hidden;
  height:172px;display:flex;flex-direction:column;justify-content:space-between;
}
.pay-card-vis::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.04)}
.pay-card-vis::after{content:'';position:absolute;bottom:-20px;right:50px;width:120px;height:120px;border-radius:50%;background:rgba(37,99,235,.15)}
.card-chip{width:30px;height:22px;background:rgba(255,255,255,.18);border-radius:4px;border:1px solid rgba(255,255,255,.1)}
.card-num{font-family:'DM Mono',monospace;font-size:15px;letter-spacing:2px;opacity:.85}

/* ── PROGRESS STEPS ── */
.steps{display:flex;align-items:center;gap:0;margin-bottom:32px}
.step{display:flex;align-items:center;gap:0;flex:1}
.step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;transition:.25s;z-index:1}
.step-dot.idle{background:var(--line2);color:var(--ink3);border:1.5px solid var(--line)}
.step-dot.act{background:var(--blue);color:#fff;box-shadow:0 0 0 4px rgba(37,99,235,.15)}
.step-dot.done{background:var(--ink);color:#fff}
.step-line{flex:1;height:1.5px;background:var(--line)}
.step-line.done{background:var(--ink)}
.step-text{font-size:12px;font-weight:600;white-space:nowrap;margin-left:8px;color:var(--ink3)}
.step-text.act,.step-text.done{color:var(--ink)}

/* ── FAQ ── */
.faq-item{border-bottom:1px solid var(--line)}
.faq-item:first-child{border-top:1px solid var(--line)}
.faq-btn{
  display:flex;justify-content:space-between;align-items:center;gap:16px;
  padding:16px 0;width:100%;background:none;border:none;cursor:pointer;
  font-family:inherit;text-align:left;transition:.15s;
}
.faq-btn:hover .faq-q{color:var(--blue)}
.faq-q{font-size:14px;font-weight:600;color:var(--ink);transition:.15s}
.faq-icon{flex-shrink:0;transition:transform .2s;color:var(--ink3)}
.faq-icon.open{transform:rotate(180deg);color:var(--blue)}
.faq-a{font-size:14px;color:var(--ink2);line-height:1.75;padding-bottom:16px;animation:fadeUp .2s ease}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
.modal-box{background:var(--white);border-radius:var(--r-2xl);max-width:520px;width:100%;max-height:90vh;overflow-y:auto;animation:scaleIn .25s ease}
.modal-hd{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--line)}
.modal-title{font-family:'Outfit',sans-serif;font-size:17px;font-weight:700}
.modal-close{width:30px;height:30px;border-radius:var(--r-md);border:1px solid var(--line);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ink3);transition:.15s}
.modal-close:hover{background:var(--line2);color:var(--ink)}
.modal-body{padding:20px 24px 24px}

/* ── TOAST ── */
.toast-stack{position:fixed;bottom:24px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:360px}
.toast{
  background:var(--ink);color:#fff;border-radius:var(--r-xl);
  padding:12px 16px;font-size:14px;font-weight:500;
  box-shadow:var(--sh-xl);display:flex;align-items:center;gap:10px;
  animation:slideDown .3s ease;
}
.toast.ok{background:var(--green)}
.toast.err{background:var(--red)}
.toast-icon{width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* ── MAP ── */
.map-shell{border-radius:var(--r-xl);overflow:hidden;border:1px solid var(--line);position:relative}
.map-shell .leaflet-container{font-family:'DM Sans',sans-serif!important}
.leaflet-popup-content-wrapper{border-radius:var(--r-xl)!important;box-shadow:var(--sh-lg)!important;border:1px solid var(--line)!important;padding:0!important}
.leaflet-popup-content{margin:0!important;padding:14px 16px!important;font-family:'DM Sans',sans-serif!important}
.leaflet-popup-tip{display:none}

/* ── FEATURES SECTION ── */
.feat-icon{width:44px;height:44px;border-radius:var(--r-xl);background:var(--line2);display:flex;align-items:center;justify-content:center;margin-bottom:14px;transition:.2s}
.feat-card{padding:24px;border-radius:var(--r-xl);border:1px solid var(--line);background:var(--white);transition:.2s}
.feat-card:hover{border-color:var(--blue);box-shadow:var(--sh-lg)}
.feat-card:hover .feat-icon{background:var(--blue-lt)}

/* ── SECTION LABEL ── */
.sec-label{font-size:12px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--blue);margin-bottom:8px}
.sec-title{font-family:'Outfit',sans-serif;font-size:clamp(22px,3.5vw,30px);font-weight:800;letter-spacing:-.4px;color:var(--ink);margin-bottom:12px}
.sec-sub{font-size:15px;color:var(--ink3);max-width:500px;line-height:1.7}

/* ── CTA STRIP ── */
.cta-strip{background:var(--ink);border-radius:var(--r-2xl);padding:48px;text-align:center}
.cta-strip h2{font-family:'Outfit',sans-serif;font-size:clamp(20px,3.5vw,28px);font-weight:800;color:#fff;margin-bottom:10px;letter-spacing:-.4px}
.cta-strip p{color:rgba(255,255,255,.5);font-size:15px;margin-bottom:28px}

/* ══════════════════════════════
   RESPONSIVE
══════════════════════════════ */
@media(max-width:1024px){
  .grid-4{grid-template-columns:repeat(2,1fr)}
  .grid-3{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:768px){
  .topnav-links{display:none}
  .hamburger{display:flex}
  .sidenav{display:none}
  .mob-tabs{display:flex}
  .form-2{grid-template-columns:1fr}
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr}
  .grid-auto{grid-template-columns:1fr}
  .container{padding:0 16px}
  .page-hero{padding:20px 16px}
  .section{padding:24px 0}
  .avail-split{flex-direction:column!important}
  .booking-sticky{position:static!important;width:100%!important}
  .dash-layout{flex-direction:column!important}
  .pay-layout{flex-direction:column!important}
  .pay-sticky{position:static!important;width:100%!important}
  .help-layout{flex-direction:column!important}
  .help-sticky{position:static!important;width:100%!important}
  .hero-inner{padding:52px 0}
  .hero-search-bar{max-width:100%}
  .hero-stats{gap:24px}
  .hero-stat-val{font-size:24px}
  .cta-strip{padding:32px 24px;border-radius:var(--r-xl)}
  .toast-stack{left:16px;right:16px;bottom:16px}
  .steps{gap:2px}
  .step-text{display:none}
}
@media(max-width:480px){
  .topnav-name{display:none}
  .hero-stats{gap:16px}
}
`;

/* ═══════════════════════════════════════════════════════════
   MAP COMPONENTS
═══════════════════════════════════════════════════════════ */
function useLeaflet(cb, deps=[]) {
  const [ready, setReady] = useState(!!window.L);
  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  useEffect(() => { if (ready) cb(); }, [ready, ...deps]);
  return ready;
}

/* ── Search Page Map ── */
const LocationsMap = ({ locations, selectedId, onSelect, height=400 }) => {
  const ref = useRef(null);
  const map = useRef(null);
  const marks = useRef([]);

  useLeaflet(() => {
    if (!ref.current || map.current) return;
    const L = window.L;
    map.current = L.map(ref.current, { scrollWheelZoom:false, zoomControl:true })
      .setView([40.72, -73.95], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:'© OpenStreetMap', maxZoom:19
    }).addTo(map.current);
    return () => { map.current?.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    if (!window.L || !map.current) return;
    const L = window.L;
    marks.current.forEach(m => m.remove());
    marks.current = [];
    locations.forEach(loc => {
      const sel = loc.id === selectedId;
      const ok  = loc.available > 30;
      const icon = L.divIcon({
        html:`<div style="
          background:${sel?'#2563EB':ok?'#16A34A':'#111318'};
          color:#fff;padding:6px 11px;border-radius:8px;
          font-size:12px;font-weight:700;font-family:'DM Sans',sans-serif;
          box-shadow:0 4px 12px rgba(0,0,0,.2);white-space:nowrap;
          transform:${sel?'scale(1.12)':'scale(1)'};transition:.15s;
          border:2px solid ${sel?'#1D4ED8':ok?'#15803D':'rgba(255,255,255,.1)'};
        ">$${loc.hourly}/hr</div>`,
        className:'', iconAnchor:[0,0]
      });
      const m = L.marker([loc.lat,loc.lng],{icon}).addTo(map.current)
        .bindPopup(`<div style="font-family:'DM Sans',sans-serif;padding:2px">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px">${loc.name}</div>
          <div style="font-size:12px;color:#6B7280;margin-bottom:8px">${loc.address}</div>
          <div style="display:flex;justify-content:space-between">
            <span style="font-size:12px;color:${ok?'#16A34A':'#DC2626'};font-weight:600">${loc.available} spots</span>
            <span style="font-size:14px;font-weight:800">$${loc.hourly}/hr</span>
          </div></div>`,{maxWidth:220,closeButton:false});
      m.on('click', () => onSelect?.(loc));
      marks.current.push(m);
    });
  }, [window.L, map.current, locations, selectedId]);

  return <div ref={ref} style={{height,width:'100%'}} />;
};

/* ── Navigation Modal ── */
const NavModal = ({ loc, onClose }) => {
  const mapRef = useRef(null);
  const lmap   = useRef(null);
  const routeRef = useRef(null);
  const [pos, setPos]       = useState(null);
  const [err, setErr]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode]     = useState("driving");
  const [dist, setDist]     = useState(null);
  const [eta, setEta]       = useState(null);
  const [routing, setRouting] = useState(false);

  const haversine = (la1,lo1,la2,lo2) => {
    const R=6371,toR=v=>v*Math.PI/180;
    const dLa=toR(la2-la1),dLo=toR(lo2-lo1);
    const a=Math.sin(dLa/2)**2+Math.cos(toR(la1))*Math.cos(toR(la2))*Math.sin(dLo/2)**2;
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  };

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => { setPos([p.coords.latitude, p.coords.longitude]); setLoading(false); },
      e => { setErr(e.code===1?"Location access denied. Enable location in your browser settings.":"Unable to retrieve your location."); setLoading(false); },
      { enableHighAccuracy:true, timeout:10000 }
    ) ?? (setErr("Geolocation not supported."), setLoading(false));
  }, []);

  useLeaflet(() => {
    if (!pos || !mapRef.current || lmap.current) return;
    const L = window.L;
    lmap.current = L.map(mapRef.current, { scrollWheelZoom:true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution:'© OpenStreetMap', maxZoom:19 }).addTo(lmap.current);

    const userIcon = L.divIcon({
      html:`<div style="width:14px;height:14px;background:#2563EB;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 4px rgba(37,99,235,.2),0 2px 8px rgba(0,0,0,.2)"></div>`,
      className:'', iconAnchor:[7,7]
    });
    L.marker(pos,{icon:userIcon}).addTo(lmap.current).bindPopup('<b>Your Location</b>',{closeButton:false});

    const destIcon = L.divIcon({
      html:`<div style="background:#111318;color:#fff;padding:7px 13px;border-radius:10px;font-size:13px;font-weight:700;font-family:'DM Sans',sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25);white-space:nowrap;border:1.5px solid rgba(255,255,255,.08)">${loc.name}</div>`,
      className:'', iconAnchor:[0,40]
    });
    L.marker([loc.lat,loc.lng],{icon:destIcon}).addTo(lmap.current)
      .bindPopup(`<b>${loc.name}</b><br>${loc.address}, ${loc.city}`,{closeButton:false});

    return () => { lmap.current?.remove(); lmap.current=null; };
  }, [pos]);

  useEffect(() => {
    if (!pos || !lmap.current || !window.L) return;
    const L = window.L;
    const km = haversine(pos[0],pos[1],loc.lat,loc.lng);

    routeRef.current?.remove(); routeRef.current=null;
    setRouting(true);

    const prof = mode==="driving"?"car":mode==="bicycling"?"bike":"foot";
    fetch(`https://router.project-osrm.org/route/v1/${prof}/${pos[1]},${pos[0]};${loc.lng},${loc.lat}?overview=full&geometries=geojson`)
      .then(r=>r.json())
      .then(d => {
        if (!d.routes?.[0]) throw new Error();
        const coords = d.routes[0].geometry.coordinates.map(([ln,la])=>[la,ln]);
        const realKm = (d.routes[0].distance/1000).toFixed(1);
        const mins   = Math.round(d.routes[0].duration/60);
        setDist(realKm); setEta(mins<60?`${mins} min`:`${Math.floor(mins/60)}h ${mins%60}m`);
        const colors = {driving:'#2563EB',walking:'#16A34A',bicycling:'#D97706',transit:'#7C3AED'};
        const poly = L.polyline(coords,{color:colors[mode]||'#2563EB',weight:5,opacity:.85}).addTo(lmap.current);
        routeRef.current = poly;
        lmap.current.fitBounds(poly.getBounds(),{padding:[48,48]});
      })
      .catch(() => {
        const km2 = haversine(pos[0],pos[1],loc.lat,loc.lng);
        setDist(km2.toFixed(1));
        const speeds={driving:40,walking:5,bicycling:15,transit:25};
        const m=Math.round((km2/speeds[mode])*60);
        setEta(m<60?`${m} min`:`${Math.floor(m/60)}h ${m%60}m`);
        const fallback = L.polyline([pos,[loc.lat,loc.lng]],{color:'#2563EB',weight:4,opacity:.6,dashArray:'10 6'}).addTo(lmap.current);
        routeRef.current=fallback;
        lmap.current.fitBounds(fallback.getBounds(),{padding:[48,48]});
      })
      .finally(()=>setRouting(false));
  }, [pos, mode, loc, window.L]);

  const gmUrl  = `https://www.google.com/maps/dir/?api=1${pos?`&origin=${pos[0]},${pos[1]}`:''}
&destination=${loc.lat},${loc.lng}&travelmode=${mode}`;
  const wazeUrl = `https://waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes`;
  const appleUrl= `https://maps.apple.com/?${pos?`saddr=${pos[0]},${pos[1]}&`:''}daddr=${loc.lat},${loc.lng}&dirflg=d`;

  const modes = [{id:'driving',icon:'🚗',label:'Drive'},{id:'walking',icon:'🚶',label:'Walk'},{id:'bicycling',icon:'🚲',label:'Cycle'},{id:'transit',icon:'🚌',label:'Transit'}];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-box" style={{maxWidth:640}} onClick={e=>e.stopPropagation()}>
        <div className="modal-hd">
          <span className="modal-title">Navigate to {loc.name}</span>
          <button className="modal-close" onClick={onClose}><Icon n="close" size={14}/></button>
        </div>
        <div className="modal-body">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-12" style={{padding:'40px 0'}}>
              <div className="spin"/>
              <span className="text-sm c-muted">Acquiring your location…</span>
            </div>
          )}
          {!loading && err && (
            <>
              <div className="alert alert-warn mb-16"><Icon n="warning" size={16}/>{err}</div>
              <p className="text-sm c-muted mb-16">You can still open Google Maps — it will ask for your location directly.</p>
              <div className="flex gap-10 flex-wrap">
                <a href={gmUrl} target="_blank" rel="noopener noreferrer" className="btn btn-blue flex-1">
                  <Icon n="map" size={15} color="#fff"/> Open Google Maps
                </a>
                <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline flex-1">
                  <Icon n="navigate" size={15}/>Waze
                </a>
              </div>
            </>
          )}
          {!loading && !err && pos && (
            <>
              {/* Info bar */}
              <div className="flex items-center gap-16 flex-wrap mb-14" style={{background:'var(--surface)',borderRadius:'var(--r-xl)',padding:'14px 16px'}}>
                <div style={{flex:1}}>
                  <div className="label-xs mb-4">Destination</div>
                  <div className="fw-700" style={{fontSize:14}}>{loc.name}</div>
                  <div className="text-sm c-muted">{loc.address}, {loc.city}</div>
                </div>
                {dist && eta && (
                  <div className="flex gap-16">
                    <div className="text-center">
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:'var(--blue)'}}>{dist}</div>
                      <div className="label-xs">km</div>
                    </div>
                    <div style={{width:1,background:'var(--line)'}}/>
                    <div className="text-center">
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:'var(--ink)'}}>{eta}</div>
                      <div className="label-xs">est. time</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mode */}
              <div className="flex gap-8 mb-12">
                {modes.map(m=>(
                  <button key={m.id}
                    className={`chip flex-1 ${mode===m.id?'on':''}`}
                    style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'8px 4px'}}
                    onClick={()=>setMode(m.id)}>
                    <span style={{fontSize:16}}>{m.icon}</span>
                    <span style={{fontSize:11}}>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Map */}
              <div className="map-shell mb-14" style={{position:'relative'}}>
                <div ref={mapRef} style={{height:300,width:'100%'}}/>
                {routing && (
                  <div style={{position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,.95)',borderRadius:20,padding:'6px 14px',display:'flex',alignItems:'center',gap:8,zIndex:1000,fontSize:13,fontWeight:600,boxShadow:'var(--sh-md)'}}>
                    <div className="spin spin-sm"/> Calculating route…
                  </div>
                )}
                {/* Legend */}
                <div style={{position:'absolute',bottom:10,left:10,zIndex:500,background:'rgba(255,255,255,.95)',borderRadius:var_r_lg,padding:'8px 12px',fontSize:12,boxShadow:'var(--sh-sm)',borderRadius:10}}>
                  <div className="flex items-center gap-6 mb-4">
                    <div style={{width:9,height:9,borderRadius:'50%',background:'#2563EB',border:'2px solid #fff',boxShadow:'0 0 0 2px rgba(37,99,235,.25)'}}/>
                    <span className="c-ink2">You</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div style={{width:9,height:9,borderRadius:2,background:'var(--ink)'}}/>
                    <span className="c-ink2">Parking</span>
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-10 mb-8 flex-wrap">
                <a href={gmUrl} target="_blank" rel="noopener noreferrer" className="btn btn-blue flex-1" style={{justifyContent:'center'}}>
                  <Icon n="map" size={15} color="#fff"/> Google Maps
                </a>
                <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1" style={{justifyContent:'center'}}>
                  <Icon n="navigate" size={15} color="#fff"/> Waze
                </a>
                <a href={appleUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline flex-1" style={{justifyContent:'center'}}>
                  🍎 Apple Maps
                </a>
              </div>
              <p className="text-xs c-muted text-center">Route from your current GPS position · Opens external app for turn-by-turn</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SHARED MICRO COMPONENTS
═══════════════════════════════════════════════════════════ */
const Stars = ({n}) => <div className="stars">{[1,2,3,4,5].map(i=><span key={i} className={i<=Math.round(n)?'star-on':'star-off'}>★</span>)}</div>;

const Bdg = ({status}) => {
  const m={COMPLETED:['b-green','Completed'],ACTIVE:['b-blue','Active'],CONFIRMED:['b-amber','Confirmed'],CANCELLED:['b-red','Cancelled'],PENDING:['b-gray','Pending']};
  const [cls,lbl]=m[status]||['b-gray',status];
  return <span className={`badge ${cls}`}>{lbl}</span>;
};

const Loader = ({sm}) => <div className={`spin${sm?' spin-sm':''}`}/>;

const Toast = ({items}) => (
  <div className="toast-stack">
    {items.map(t=>(
      <div key={t.id} className={`toast${t.type==='success'?' ok':t.type==='error'?' err':''}`}>
        <div className="toast-icon">
          <Icon n={t.type==='success'?'check':t.type==='error'?'close':'warning'} size={12} color="#fff"/>
        </div>
        {t.message}
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   TOP NAV
═══════════════════════════════════════════════════════════ */
const TopNav = ({page,go,user,setUser}) => {
  const [open,setOpen] = useState(false);
  const links = [
    {id:'landing',icon:'home',label:'Home'},
    {id:'search', icon:'search',label:'Find Parking'},
    {id:'availability',icon:'map',label:'Availability'},
    {id:'dashboard',icon:'grid',label:'Dashboard'},
    {id:'help',   icon:'help', label:'Help'},
  ];
  const nav = id => { go(id); setOpen(false); };

  return (
    <header className="topnav">
      <a className="topnav-brand" onClick={()=>nav('landing')} style={{cursor:'pointer'}}>
        <div className="topnav-logo">
          <Icon n="car" size={16} color="#fff"/>
        </div>
        <span className="topnav-name">ParkWise</span>
      </a>

      <nav className="topnav-links">
        {links.map(l=>(
          <button key={l.id} className={`topnav-link${page===l.id?' active':''}`} onClick={()=>nav(l.id)}>
            <Icon n={l.icon} size={15}/>
            {l.label}
          </button>
        ))}
      </nav>

      <div className="topnav-right">
        {user ? (
          <>
            <span className="topnav-user">{user.name}</span>
            <button className="btn btn-outline btn-sm" onClick={()=>setUser(null)}>
              <Icon n="logout" size={14}/>Sign Out
            </button>
          </>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={()=>nav('login')}>Sign In</button>
        )}
        <button className="hamburger btn-icon" onClick={()=>setOpen(o=>!o)}>
          <Icon n={open?'close':'menu'} size={18}/>
        </button>
      </div>

      {open && (
        <div className="mobile-drawer open">
          {links.map(l=>(
            <button key={l.id} className={`mobile-link${page===l.id?' active':''}`} onClick={()=>nav(l.id)}>
              <Icon n={l.icon} size={16}/>{l.label}
            </button>
          ))}
          <hr className="div"/>
          {user
            ? <button className="mobile-link" onClick={()=>{setUser(null);setOpen(false)}}><Icon n="logout" size={16}/>Sign Out</button>
            : <button className="btn btn-primary btn-full" onClick={()=>nav('login')}>Sign In</button>
          }
        </div>
      )}
    </header>
  );
};

/* ═══════════════════════════════════════════════════════════
   LANDING
═══════════════════════════════════════════════════════════ */
const Landing = ({go}) => {
  const [q,setQ] = useState('');
  const feats = [
    {icon:'search',title:'Smart Search',desc:'Real-time availability with precise filters — by price, distance, or amenity.'},
    {icon:'calendar',title:'Instant Booking',desc:'Reserve your spot in seconds. QR code confirmation delivered immediately.'},
    {icon:'credit',title:'Secure Payments',desc:'All major cards, PayPal, Apple Pay — protected with 256-bit encryption.'},
    {icon:'map',title:'Live Map View',desc:'Interactive map with live availability, pricing, and one-tap navigation.'},
    {icon:'clock',title:'Smart Reminders',desc:'Get notified before your booking starts or when your time is running low.'},
    {icon:'shield',title:'Easy Cancellation',desc:'Full refund on cancellations up to 1 hour before your reservation starts.'},
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-dots"/>
        <div className="hero-glow" style={{width:500,height:500,background:'rgba(37,99,235,.12)',top:'-10%',right:'0'}}/>
        <div className="hero-glow" style={{width:300,height:300,background:'rgba(96,165,250,.08)',bottom:'5%',left:'5%'}}/>
        <div className="container w-full">
          <div className="hero-inner" style={{maxWidth:620}}>
            <div className="hero-eyebrow" style={{animationDelay:'0s'}}>
              <span className="hero-eyebrow-dot"/>LIVE AVAILABILITY
            </div>
            <h1 className="hero-title" style={{animation:'fadeUp .5s ease both',animationDelay:'.06s'}}>
              Find your<br/><em>perfect spot</em><br/>in seconds.
            </h1>
            <p className="hero-sub" style={{animation:'fadeUp .5s ease both',animationDelay:'.14s'}}>
              ParkWise shows real-time parking availability, lets you reserve in advance, and navigates you straight to your spot.
            </p>
            <div className="hero-search-bar" style={{animation:'fadeUp .5s ease both',animationDelay:'.22s'}}>
              <Icon n="pin" size={18} color="var(--ink3)"/>
              <input placeholder="Enter a city, address or location…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go('search')}/>
              <button className="btn btn-blue" onClick={()=>go('search')}>Search</button>
            </div>
            <div className="hero-stats" style={{animation:'fadeUp .5s ease both',animationDelay:'.3s'}}>
              {[['2,400+','Parking spots'],['98%','Happy drivers'],['50+','Locations'],['24 / 7','Always open']].map(([v,l])=>(
                <div key={l}><div className="hero-stat-val">{v}</div><div className="hero-stat-lbl">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{background:'#fff',padding:'80px 0'}}>
        <div className="container">
          <div className="text-center mb-32">
            <div className="sec-label">Why ParkWise</div>
            <h2 className="sec-title">Everything you need,<br/>nothing you don't.</h2>
          </div>
          <div className="grid-3">
            {feats.map((f,i)=>(
              <div key={i} className="feat-card" style={{animation:`fadeUp .4s ease both`,animationDelay:`${i*.07}s`}}>
                <div className="feat-icon"><Icon n={f.icon} size={20} color="var(--ink2)"/></div>
                <div className="h3 mb-6" style={{fontSize:15}}>{f.title}</div>
                <p className="text-sm c-muted" style={{lineHeight:1.7}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{background:'var(--surface)',padding:'80px 0'}}>
        <div className="container">
          <div className="text-center mb-32">
            <div className="sec-label">How it works</div>
            <h2 className="sec-title">Three steps to parked.</h2>
          </div>
          <div className="grid-3">
            {[
              {n:'01',icon:'search',title:'Search',desc:'Enter your destination and time. Filter by price, amenities, or distance.'},
              {n:'02',icon:'pin',  title:'Reserve', desc:'Choose your exact spot on the live floor map and confirm in one tap.'},
              {n:'03',icon:'car',  title:'Park',    desc:'Follow turn-by-turn navigation to your reserved spot. Done.'},
            ].map((s,i)=>(
              <div key={i} className="text-center" style={{padding:'0 16px',animation:`fadeUp .4s ease both`,animationDelay:`${i*.1}s`}}>
                <div className="label-xs mb-16" style={{color:'var(--blue)'}}>{s.n}</div>
                <div style={{width:56,height:56,background:'var(--white)',border:'1px solid var(--line)',borderRadius:'var(--r-2xl)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',boxShadow:'var(--sh-md)'}}>
                  <Icon n={s.icon} size={24} color="var(--ink)"/>
                </div>
                <div className="h3 mb-8" style={{fontSize:16}}>{s.title}</div>
                <p className="text-sm c-muted" style={{lineHeight:1.7}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
        © 2024 ParkWise · All rights reserved
      </footer>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════════════ */
const LocCard = ({loc,go,setSel,onNav}) => {
  const pct   = Math.round((loc.available/loc.total)*100);
  const color = pct>40?'var(--green)':pct>15?'var(--amber)':'var(--red)';
  return (
    <div className="loc-card">
      <div className="loc-card-top">
        <div className="loc-card-top-pattern"/>
        <div style={{position:'relative',zIndex:1}}>
          <Icon n="car" size={32} color="rgba(255,255,255,.4)"/>
        </div>
        <div className={`loc-card-top-label ${pct>40?'loc-card-avail-good':''}`}>
          {loc.available} available
        </div>
      </div>
      <div className="loc-card-body">
        <div className="loc-card-name">{loc.name}</div>
        <div className="loc-card-addr"><Icon n="pin" size={12} color="var(--ink3)"/>{loc.address}, {loc.city}</div>
        <div className="flex justify-between text-xs c-muted mb-4">
          <span>Availability</span><span style={{color,fontWeight:700}}>{pct}%</span>
        </div>
        <div className="avail-bar"><div className="avail-fill" style={{width:`${pct}%`,background:color}}/></div>
        <div className="flex gap-6 flex-wrap mb-14">
          {loc.covered  &&<span className="tag"><Icon n="building" size={10}/>Covered</span>}
          {loc.ev       &&<span className="tag"><Icon n="bolt" size={10}/>EV</span>}
          {loc.security &&<span className="tag"><Icon n="shield" size={10}/>Security</span>}
          {loc.h24      &&<span className="tag"><Icon n="clock" size={10}/>24/7</span>}
        </div>
        <div className="loc-card-footer">
          <div>
            <div className="loc-price">${loc.hourly}<span>/hr</span></div>
            <div className="flex items-center gap-6 mt-4">
              <Stars n={loc.rating}/><span className="text-xs c-muted">({loc.reviews})</span>
            </div>
          </div>
          <div className="flex gap-8">
            <button className="btn btn-icon btn-outline btn-sm" onClick={()=>onNav(loc)} title="Navigate">
              <Icon n="navigate" size={15}/>
            </button>
            <button className="btn btn-primary btn-sm" onClick={()=>{setSel(loc);go('availability')}}>
              Book <Icon n="arrowR" size={14} color="#fff"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Search = ({go,setSel}) => {
  const [q,setQ]         = useState('');
  const [fl,setFl]       = useState({covered:false,ev:false,security:false,h24:false});
  const [sort,setSort]   = useState('rating');
  const [price,setPrice] = useState('all');
  const [view,setView]   = useState('list');
  const [navLoc,setNav]  = useState(null);
  const [hlId,setHl]     = useState(null);

  const toggle = k => setFl(f=>({...f,[k]:!f[k]}));
  const filtered = LOCATIONS.filter(l=>{
    const mq = !q||l.name.toLowerCase().includes(q.toLowerCase())||l.address.toLowerCase().includes(q.toLowerCase());
    const mc = !fl.covered||l.covered, me=!fl.ev||l.ev, ms=!fl.security||l.security, mh=!fl.h24||l.h24;
    const mp = price==='all'||(price==='budget'&&l.hourly<=5)||(price==='mid'&&l.hourly>5&&l.hourly<=7)||(price==='premium'&&l.hourly>7);
    return mq&&mc&&me&&ms&&mh&&mp;
  }).sort((a,b)=>sort==='rating'?b.rating-a.rating:sort==='price'?a.hourly-b.hourly:b.available-a.available);

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
        {/* Filter bar */}
      <div className="card mb-16" style={{padding:'16px 20px', margin:'0 20px 16px'}}>          <div className="flex gap-10 items-center flex-wrap mb-12">
            <div className="sbar flex-1" style={{minWidth:200}}>
              <Icon n="search" size={16} color="var(--ink3)"/>
              <input placeholder="Search location or address…" value={q} onChange={e=>setQ(e.target.value)}/>
              {q&&<button className="sbar-x" onClick={()=>setQ('')}><Icon n="close" size={12}/></button>}
            </div>
            <select className="sel" style={{width:'auto',minWidth:140}} value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="rating">Top Rated</option>
              <option value="price">Lowest Price</option>
              <option value="availability">Most Available</option>
            </select>
            <select className="sel" style={{width:'auto',minWidth:120}} value={price} onChange={e=>setPrice(e.target.value)}>
              <option value="all">All Prices</option>
              <option value="budget">≤ $5 / hr</option>
              <option value="mid">$5 – $7 / hr</option>
              <option value="premium">$7+ / hr</option>
            </select>
          </div>
          <div className="flex items-center gap-8 flex-wrap">
            <span className="label-xs" style={{marginRight:4}}>Filters</span>
            {[['covered','building','Covered'],['ev','bolt','EV Charging'],['security','shield','Security'],['h24','clock','24 / 7']].map(([k,ic,lb])=>(
              <button key={k} className={`chip${fl[k]?' on':''}`} onClick={()=>toggle(k)}>
                <Icon n={ic} size={12}/>{lb}
              </button>
            ))}
            <div className="flex gap-6 ml-auto">
              <button className={`chip${view==='list'?' on':''}`} onClick={()=>setView('list')}>
                <Icon n="grid" size={12}/>List
              </button>
              <button className={`chip${view==='map'?' on':''}`} onClick={()=>setView('map')}>
                <Icon n="map" size={12}/>Map
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-16" style={{marginLeft: "20px"}}>
          <p className="text-sm c-muted"><strong style={{color:'var(--ink)'}}>{filtered.length}</strong> locations found</p>
        </div>

        {view==='map' ? (
          <div className="flex gap-16" style={{alignItems:'flex-start'}}>
            <div style={{flex:'0 0 460px',position:'sticky',top:74}}>
              <div className="map-shell" style={{height:480}}>
                <LocationsMap locations={filtered} selectedId={hlId} height={480} onSelect={l=>{setHl(l.id);setSel(l)}}/>
              </div>
            </div>
            <div className="flex flex-col gap-14 flex-1">
              {filtered.map(l=><LocCard key={l.id} loc={l} go={go} setSel={setSel} onNav={setNav}/>)}
            </div>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map(l=><LocCard key={l.id} loc={l} go={go} setSel={setSel} onNav={setNav}/>)}
          </div>
        )}

        {filtered.length===0&&(
          <div className="card text-center" style={{padding:'52px 24px'}}>
            <div style={{width:56,height:56,background:'var(--line2)',borderRadius:'var(--r-2xl)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <Icon n="search" size={24} color="var(--ink3)"/>
            </div>
            <div className="h3 mb-6">No results</div>
            <p className="text-sm c-muted">Try a different search or clear your filters.</p>
          </div>
        )}
      </div>
      {navLoc&&<NavModal loc={navLoc} onClose={()=>setNav(null)}/>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   AVAILABILITY
═══════════════════════════════════════════════════════════ */
const Availability = ({go,sel,toast}) => {
  const loc  = sel||LOCATIONS[0];
  const [floor,setFloor] = useState(1);
  const [spot,setSpot]   = useState(null);
  const [date,setDate]   = useState(new Date().toISOString().split('T')[0]);
  const [t1,setT1]       = useState('10:00');
  const [t2,setT2]       = useState('14:00');
  const [modal,setModal] = useState(false);
  const [nav,setNav]     = useState(false);

  const spots = Array.from({length:40},(_,i)=>{
    const n   = `${String.fromCharCode(64+floor)}-${String(i+1).padStart(2,'0')}`;
    const r   = ((i+1)*7+floor*3)%10/10;
    const st  = r<.55?'AV':r<.75?'OC':r<.85?'RS':'MT';
    const tp  = (i+1)%10===0?'⚡':(i+1)%8===0?'♿':(i+1)%5===0?'🔵':'🚗';
    const tpN = (i+1)%10===0?'EV':(i+1)%8===0?'HC':(i+1)%5===0?'SML':'STD';
    return {id:i+1,num:n,st,tp,tpN};
  });

  const hrs  = Math.max(0,(([h2,m2]=[0,0],[h1,m1]=[0,0])=>(h2*60+m2-h1*60-m1)/60)(t2.split(':').map(Number),t1.split(':').map(Number)));
  const total= (hrs*loc.hourly).toFixed(2);
  const sc   = {AV:'spot-av',OC:'spot-oc',RS:'spot-rs',MT:'spot-mt'};

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <button className="btn btn-ghost btn-sm mb-12" onClick={()=>go('search')}>
            <Icon n="chevL" size={14}/>Back to search
          </button>
          <div className="flex items-start justify-between flex-wrap gap-12">
            <div>
              <div className="page-hero-label">Parking Lot</div>
              <div className="page-hero-title">{loc.name}</div>
              <div className="flex items-center gap-10 mt-4">
                <span className="page-hero-sub flex items-center gap-5">
                  <Icon n="pin" size={13} color="var(--ink3)"/>{loc.address}, {loc.city}
                </span>
                <Stars n={loc.rating}/>
                <span className="text-sm c-muted">({loc.reviews})</span>
              </div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={()=>setNav(true)}>
              <Icon n="navigate" size={14}/>Navigate Here
            </button>
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="flex gap-20 avail-split" style={{alignItems:'flex-start'}}>
          {/* Left */}
          <div style={{flex:1,minWidth:0}}>
            {/* Time picker */}
            <div className="card mb-16">
              <div className="card-hd"><div className="h3" style={{fontSize:15}}>Select Date & Time</div></div>
              <div className="card-p-sm">
                <div className="form-2 mb-12">
                  <div className="fg mb-0">
                    <label className="lbl">Date</label>
                    <input type="date" className="inp" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}/>
                  </div>
                  <div className="fg mb-0">
                    <label className="lbl">Time</label>
                    <div className="flex gap-8">
                      <input type="time" className="inp" value={t1} onChange={e=>setT1(e.target.value)}/>
                      <div className="flex items-center c-muted" style={{fontSize:12,fontWeight:600}}>to</div>
                      <input type="time" className="inp" value={t2} onChange={e=>setT2(e.target.value)}/>
                    </div>
                  </div>
                </div>
                {hrs>0&&(
                  <div className="alert alert-info mb-0">
                    <Icon n="clock" size={15}/>
                    <span><strong>{hrs.toFixed(1)} hours</strong> · Estimated total: <strong>${total}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Spot map */}
            <div className="card">
              <div className="card-hd">
                <div className="flex items-center justify-between">
                  <div className="h3" style={{fontSize:15}}>Select a Spot — Floor {floor}</div>
                  <div className="flex gap-6">
                    {[1,2,3].map(f=>(
                      <button key={f} className={`chip${floor===f?' on':''}`} style={{padding:'4px 12px'}} onClick={()=>{setFloor(f);setSpot(null)}}>L{f}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card-p-sm">
                {/* Legend */}
                <div className="flex gap-16 flex-wrap mb-16">
                  {[['#BBF7D0','var(--green)','Available'],['#FECACA','var(--red)','Occupied'],['#FDE68A','var(--amber)','Reserved'],['var(--line)','var(--ink3)','Maintenance']].map(([bg,c,l])=>(
                    <div key={l} className="flex items-center gap-6">
                      <div style={{width:10,height:10,borderRadius:3,background:bg,border:`1.5px solid ${c}`,flexShrink:0}}/>
                      <span className="text-xs c-muted">{l}</span>
                    </div>
                  ))}
                </div>

                <div style={{background:'var(--surface)',borderRadius:'var(--r-lg)',padding:'6px 14px',marginBottom:10,textAlign:'center',fontSize:11,fontWeight:600,color:'var(--ink3)',letterSpacing:1}}>
                  ← ENTRANCE →
                </div>

                <div className="spot-grid">
                  {spots.map(s=>(
                    <div key={s.id}
                      className={`spot ${spot?.id===s.id?'spot-sel':sc[s.st]}`}
                      onClick={()=>s.st==='AV'&&setSpot(spot?.id===s.id?null:s)}
                      title={`${s.num} · ${s.tpN}`}>
                      <span style={{fontSize:12}}>{s.tp}</span>
                      <span className="spot-num">{s.num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking panel */}
          <div className="booking-sticky" style={{width:290,flexShrink:0}}>
            <div className="card" style={{position:'sticky',top:80}}>
              <div className="card-hd-sm">
                <div className="h3" style={{fontSize:14}}>Booking Summary</div>
              </div>
              <div className="card-p-sm">
                {spot ? (
                  <>
                    {[['Spot',spot.num],['Type',spot.tpN],['Date',date],['Time',`${t1} – ${t2}`],['Duration',`${hrs.toFixed(1)} hrs`],['Rate',`$${loc.hourly} / hr`]].map(([k,v])=>(
                      <div key={k} className="flex justify-between mb-8">
                        <span className="text-sm c-muted">{k}</span>
                        <span className="text-sm fw-600">{v}</span>
                      </div>
                    ))}
                    <hr className="div"/>
                    <div className="flex justify-between mb-16">
                      <span className="fw-700">Total</span>
                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:800,color:'var(--blue)'}}>${total}</span>
                    </div>
                    <button className="btn btn-blue btn-full mb-8" onClick={()=>{
                      if(hrs<=0){toast('error','End time must be after start time');return;}
                      setModal(true);
                    }}>
                      Continue <Icon n="arrowR" size={14} color="#fff"/>
                    </button>
                    <button className="btn btn-ghost btn-full" onClick={()=>setSpot(null)}>Clear selection</button>
                  </>
                ) : (
                  <div className="text-center" style={{padding:'24px 0'}}>
                    <div style={{width:44,height:44,background:'var(--line2)',borderRadius:'var(--r-xl)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
                      <Icon n="pin" size={20} color="var(--ink3)"/>
                    </div>
                    <p className="text-sm c-muted mb-12">Select a green spot<br/>from the grid above</p>
                    <span className="badge b-green">
                      {spots.filter(s=>s.st==='AV').length} spots available
                    </span>
                  </div>
                )}
              </div>
              {/* Amenities */}
              <div className="card-hd-sm" style={{borderTop:'1px solid var(--line)',borderBottom:'none'}}>
                <div className="label-xs mb-8">Amenities</div>
                <div className="flex gap-6 flex-wrap">
                  {loc.covered  &&<span className="tag"><Icon n="building" size={10}/>Covered</span>}
                  {loc.ev       &&<span className="tag"><Icon n="bolt" size={10}/>EV</span>}
                  {loc.security &&<span className="tag"><Icon n="shield" size={10}/>Security</span>}
                  {loc.h24      &&<span className="tag"><Icon n="clock" size={10}/>24/7</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {modal&&(
        <div className="overlay" onClick={()=>setModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-hd">
              <span className="modal-title">Confirm Booking</span>
              <button className="modal-close" onClick={()=>setModal(false)}><Icon n="close" size={14}/></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-ok mb-16"><Icon n="check" size={15}/>Spot {spot?.num} is available for your selected time</div>
              <div style={{background:'var(--surface)',borderRadius:'var(--r-xl)',padding:16,marginBottom:20}}>
                {[['Location',loc.name],['Spot',spot?.num],['Date',date],['Time',`${t1} – ${t2}`],['Duration',`${hrs.toFixed(1)} hours`],['Total',`$${total}`]].map(([k,v])=>(
                  <div key={k} className="flex justify-between mb-8" style={{fontSize:14}}>
                    <span className="c-muted">{k}</span><span className="fw-600">{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-blue btn-full mb-8" onClick={()=>{setModal(false);toast('success','Booking confirmed!');go('payment')}}>
                Proceed to Payment <Icon n="arrowR" size={14} color="#fff"/>
              </button>
              <button className="btn btn-ghost btn-full" onClick={()=>setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {nav&&<NavModal loc={loc} onClose={()=>setNav(false)}/>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════ */
const Dashboard = ({go,user}) => {
  const [tab,setTab]   = useState('overview');
  const [fstt,setFstt] = useState('ALL');

  const stats = [
    {icon:'calendar',label:'Total Bookings',value:'24',meta:'+3 this month'},
    {icon:'credit',  label:'Total Spent',   value:'$487',meta:'Last 6 months'},
    {icon:'clock',   label:'Hours Parked',  value:'186h',meta:'All time'},
    {icon:'star',    label:'Avg Rating',    value:'4.6', meta:'From 24 trips'},
  ];

  const tabs = [
    {id:'overview',icon:'grid',  label:'Overview'},
    {id:'bookings',icon:'calendar',label:'Bookings'},
    {id:'payments',icon:'credit',label:'Payments'},
    {id:'profile', icon:'user',  label:'Profile'},
  ];

  const bks = fstt==='ALL'?BOOKINGS:BOOKINGS.filter(b=>b.status===fstt);

  return (
    <div style={{display:'flex',minHeight:'calc(100vh - 60px)'}}>
      {/* Desktop sidenav */}
      <aside className="sidenav">
        <div className="sidenav-section">
          <div className="sidenav-label">Main</div>
          {tabs.map(t=>(
            <button key={t.id} className={`sidenav-btn${tab===t.id?' on':''}`} onClick={()=>setTab(t.id)}>
              <div className="icon-wrap"><Icon n={t.icon} size={15} color="inherit"/></div>
              {t.label}
            </button>
          ))}
        </div>
        <hr className="sidenav-divider"/>
        <div className="sidenav-section">
          <button className="sidenav-btn" onClick={()=>go('search')}>
            <div className="icon-wrap"><Icon n="search" size={15}/></div>Find Parking
          </button>
          <button className="sidenav-btn" onClick={()=>go('help')}>
            <div className="icon-wrap"><Icon n="help" size={15}/></div>Help & Support
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="mob-tabs" style={{position:'fixed',top:60,left:0,right:0,zIndex:50,display:'none'}}>
        {tabs.map(t=>(
          <button key={t.id} className={`chip${tab===t.id?' on':''}`} onClick={()=>setTab(t.id)}>
            <Icon n={t.icon} size={12}/>{t.label}
          </button>
        ))}
      </div>

      <main style={{flex:1,minWidth:0,padding:'32px',background:'var(--surface)'}}>
        {/* OVERVIEW */}
        {tab==='overview'&&(
          <div style={{animation:'fadeUp .35s ease'}}>
            <div className="flex items-center justify-between mb-24">
              <div>
                <div className="h2" style={{fontSize:22}}>Good morning, {user?.name||'there'}</div>
                <div className="text-sm c-muted mt-4">Here's what's happening with your account</div>
              </div>
              <button className="btn btn-blue btn-sm" onClick={()=>go('search')}>
                <Icon n="plus" size={14} color="#fff"/>New Booking
              </button>
            </div>

            <div className="grid-stats mb-24">
              {stats.map((s,i)=>(
                <div key={i} className="stat-card">
                  <div className="stat-card-accent"/>
                  <div className="stat-icon"><Icon n={s.icon} size={18} color="var(--ink2)"/></div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-meta">{s.meta}</div>
                </div>
              ))}
            </div>

            {/* Active booking */}
            <div className="card mb-16">
              <div className="card-hd">
                <div className="flex items-center justify-between">
                  <div className="h3" style={{fontSize:14}}>Active Booking</div>
                  <Bdg status="ACTIVE"/>
                </div>
              </div>
              <div className="card-p">
                <div className="flex justify-between items-start flex-wrap gap-16">
                  <div>
                    <div className="fw-700" style={{fontSize:16,marginBottom:4}}>Midtown Smart Lot · Spot B-05</div>
                    <div className="text-sm c-muted mb-10">Dec 01, 2024 · 10:00 AM – 2:00 PM · 4 hours</div>
                    <span className="mono text-xs c-muted">PW-2024-002</span>
                  </div>
                  <div className="text-right">
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:'var(--blue)'}}>$26.00</div>
                    <button className="btn btn-danger btn-sm mt-8">End Parking</button>
                  </div>
                </div>
                <hr className="div"/>
                <div className="flex gap-8 flex-wrap">
                  <button className="btn btn-ghost btn-sm"><Icon n="navigate" size={14}/>Navigate</button>
                  <button className="btn btn-ghost btn-sm"><Icon n="map" size={14}/>QR Code</button>
                  <button className="btn btn-outline btn-sm ml-auto">Extend Time</button>
                </div>
              </div>
            </div>

            {/* Recent bookings */}
            <div className="card">
              <div className="card-hd">
                <div className="flex items-center justify-between">
                  <div className="h3" style={{fontSize:14}}>Recent Bookings</div>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setTab('bookings')}>
                    View all <Icon n="chevR" size={13}/>
                  </button>
                </div>
              </div>
              <div className="tbl-wrap" style={{border:'none',borderRadius:0}}>
                <table>
                  <thead><tr><th>Ref</th><th>Location</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {BOOKINGS.slice(0,3).map(b=>(
                      <tr key={b.id}>
                        <td><span className="mono text-xs">{b.ref}</span></td>
                        <td className="fw-600">{b.location}</td>
                        <td className="text-sm c-muted">{b.date}</td>
                        <td className="fw-700">${b.amount.toFixed(2)}</td>
                        <td><Bdg status={b.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {tab==='bookings'&&(
          <div style={{animation:'fadeUp .35s ease'}}>
            <div className="flex justify-between items-center mb-24">
              <div className="h2" style={{fontSize:22}}>My Bookings</div>
              <button className="btn btn-blue btn-sm" onClick={()=>go('search')}>
                <Icon n="plus" size={14} color="#fff"/>New Booking
              </button>
            </div>
            <div className="flex gap-8 mb-20 flex-wrap">
              {['ALL','ACTIVE','CONFIRMED','COMPLETED','CANCELLED'].map(s=>(
                <button key={s} className={`chip${fstt===s?' on':''}`} onClick={()=>setFstt(s)}>
                  {s==='ALL'?'All':s.charAt(0)+s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-12">
              {bks.map(b=>(
                <div key={b.id} className="card">
                  <div className="card-p">
                    <div className="flex justify-between items-start flex-wrap gap-12">
                      <div>
                        <div className="flex items-center gap-10 mb-6 flex-wrap">
                          <span className="fw-700" style={{fontSize:15}}>{b.location}</span>
                          <Bdg status={b.status}/>
                        </div>
                        <div className="text-sm c-muted mb-6">
                          Spot <strong>{b.spot}</strong> · {b.date} · {b.start} – {b.end} ({b.duration})
                        </div>
                        <span className="mono text-xs c-muted">{b.ref}</span>
                      </div>
                      <div className="text-right">
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:800}}>${b.amount.toFixed(2)}</div>
                        <div className="flex gap-8 mt-8 justify-end">
                          {(b.status==='ACTIVE'||b.status==='CONFIRMED')&&<button className="btn btn-danger btn-sm">Cancel</button>}
                          <button className="btn btn-ghost btn-sm">Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {tab==='payments'&&(
          <div style={{animation:'fadeUp .35s ease'}}>
            <div className="h2 mb-24" style={{fontSize:22}}>Payment History</div>
            <div className="grid-3 mb-20">
              {[['Total Spent','$487.00'],['This Month','$122.00'],['Refunds','$16.00']].map(([l,v])=>(
                <div key={l} className="stat-card" style={{textAlign:'center'}}>
                  <div className="stat-card-accent"/>
                  <div className="stat-label mt-8">{l}</div>
                  <div className="stat-value">{v}</div>
                </div>
              ))}
            </div>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Date</th><th>Reference</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {BOOKINGS.map(b=>(
                    <tr key={b.id}>
                      <td className="text-sm c-muted">{b.date}</td>
                      <td><span className="mono text-xs">{b.ref}</span></td>
                      <td className="text-sm">Visa ···· 1234</td>
                      <td className="fw-700">${b.amount.toFixed(2)}</td>
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
                <div className="form-2">
                  <div className="fg"><label className="lbl">First Name</label><input className="inp" defaultValue="John"/></div>
                  <div className="fg"><label className="lbl">Last Name</label><input className="inp" defaultValue="Doe"/></div>
                </div>
                <div className="fg"><label className="lbl">Email</label><input className="inp" defaultValue="john.doe@email.com" type="email"/></div>
                <div className="fg"><label className="lbl">Phone</label><input className="inp" defaultValue="+1 (555) 010-1234" type="tel"/></div>
                <button className="btn btn-blue">Save Changes</button>
              </div>
            </div>
            <div className="card">
              <div className="card-hd"><div className="h3" style={{fontSize:14}}>Change Password</div></div>
              <div className="card-p">
                <div className="fg"><label className="lbl">Current Password</label><input className="inp" type="password" placeholder="••••••••"/></div>
                <div className="form-2">
                  <div className="fg"><label className="lbl">New Password</label><input className="inp" type="password" placeholder="••••••••"/></div>
                  <div className="fg"><label className="lbl">Confirm</label><input className="inp" type="password" placeholder="••••••••"/></div>
                </div>
                <button className="btn btn-primary">Update Password</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAYMENT
═══════════════════════════════════════════════════════════ */
const Payment = ({toast,go}) => {
  const [step,setStep]     = useState(1);
  const [method,setMethod] = useState('card');
  const [loading,setLoad]  = useState(false);
  const [num,setNum]       = useState('');
  const [exp,setExp]       = useState('');
  const [cvv,setCvv]       = useState('');
  const [name,setName]     = useState('');

  const bk={ref:'PW-2024-005',location:'Midtown Smart Lot',spot:'B-07',date:'Dec 5, 2024',time:'10:00 AM – 2:00 PM',duration:'4 hours',sub:26.00,fee:1.50,tax:2.20,total:29.70};

  const fmtNum = v=>v.replace(/\s/g,'').replace(/(\d{4})/g,'$1 ').trim().slice(0,19);
  const fmtExp = v=>{const d=v.replace(/\D/g,'').slice(0,4);return d.length>2?`${d.slice(0,2)}/${d.slice(2)}`:d};

  const pay = ()=>{
    if(method==='card'&&(!num||!exp||!cvv||!name)){toast('error','Please fill in all card details');return;}
    setLoad(true);
    setTimeout(()=>{setLoad(false);setStep(3);toast('success','Payment successful!')},2000);
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-label">Checkout</div>
          <div className="page-hero-title">Secure Payment</div>
          <div className="page-hero-sub">Your booking is held for 10 minutes</div>
        </div>
      </div>
      <div className="container section">
        {/* Steps */}
        <div className="steps" style={{maxWidth:420,margin:'0 auto 32px'}}>
          {[['Details',1],['Payment',2],['Confirmation',3]].map(([l,n],i)=>(
            <div key={n} className="step">
              <div className={`step-dot${step>n?' done':step===n?' act':' idle'}`}>
                {step>n?<Icon n="check" size={13} color="#fff"/>:n}
              </div>
              <span className={`step-text${step>=n?' act':''}`}>{l}</span>
              {i<2&&<div className={`step-line${step>n?' done':''}`}/>}
            </div>
          ))}
        </div>

        <div className="flex gap-20 pay-layout" style={{alignItems:'flex-start',maxWidth:820,margin:'0 auto'}}>
          <div style={{flex:1,minWidth:0}}>
            {step<3?(
              <>
                {step===1&&(
                  <div className="card" style={{animation:'fadeUp .3s ease'}}>
                    <div className="card-hd"><div className="h3" style={{fontSize:15}}>Booking Details</div></div>
                    <div className="card-p">
                      {[['Location',bk.location],['Spot',bk.spot],['Date',bk.date],['Time',bk.time],['Duration',bk.duration]].map(([k,v])=>(
                        <div key={k} className="flex justify-between mb-10">
                          <span className="text-sm c-muted">{k}</span>
                          <span className="text-sm fw-600">{v}</span>
                        </div>
                      ))}
                      <hr className="div"/>
                      <button className="btn btn-blue btn-full" onClick={()=>setStep(2)}>
                        Continue to Payment <Icon n="arrowR" size={14} color="#fff"/>
                      </button>
                    </div>
                  </div>
                )}

                {step===2&&(
                  <div style={{animation:'fadeUp .3s ease'}}>
                    {/* Card visual */}
                    <div className="pay-card-vis mb-20">
                      <div className="flex justify-between items-start">
                        <div className="card-chip"/>
                        <Icon n="credit" size={22} color="rgba(255,255,255,.5)"/>
                      </div>
                      <div className="card-num">{num||'•••• •••• •••• ••••'}</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div style={{fontSize:9,opacity:.5,marginBottom:2,letterSpacing:1}}>CARDHOLDER</div>
                          <div style={{fontSize:13,fontWeight:600}}>{name||'YOUR NAME'}</div>
                        </div>
                        <div>
                          <div style={{fontSize:9,opacity:.5,marginBottom:2,letterSpacing:1}}>EXPIRES</div>
                          <div style={{fontSize:13,fontWeight:600}}>{exp||'MM/YY'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Method tabs */}
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
                    {method==='paypal'&&(
                      <div className="card text-center" style={{padding:36,animation:'fadeIn .2s ease'}}>
                        <div style={{fontSize:40,marginBottom:12}}>🅿</div>
                        <p className="text-sm c-muted mb-14">You'll be redirected to PayPal to complete payment securely.</p>
                        <div className="alert alert-info mb-0"><Icon n="shield" size={15}/>Secure PayPal Checkout</div>
                      </div>
                    )}
                    {method==='wallet'&&(
                      <div className="card text-center" style={{padding:36,animation:'fadeIn .2s ease'}}>
                        <p className="text-sm c-muted mb-16">Choose your preferred wallet</p>
                        <div className="flex gap-10 justify-center flex-wrap">
                          {['🍎 Apple Pay','🤖 Google Pay','💰 ParkWise'].map(w=><button key={w} className="btn btn-outline btn-sm">{w}</button>)}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-10 mt-16">
                      <button className="btn btn-ghost" onClick={()=>setStep(1)}>
                        <Icon n="chevL" size={14}/>Back
                      </button>
                      <button className="btn btn-blue flex-1" onClick={pay} disabled={loading}>
                        {loading?<><Loader sm/>Processing…</>:<>Pay ${bk.total.toFixed(2)}<Icon n="arrowR" size={14} color="#fff"/></>}
                      </button>
                    </div>
                    <div className="flex items-center gap-8 justify-center mt-12">
                      <Icon n="shield" size={13} color="var(--ink3)"/>
                      <span className="text-xs c-muted">256-bit SSL · PCI DSS compliant</span>
                    </div>
                  </div>
                )}
              </>
            ):(
              <div className="card text-center" style={{padding:52,animation:'scaleIn .3s ease'}}>
                <div style={{width:64,height:64,background:'var(--green-lt)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
                  <Icon n="check" size={28} color="var(--green)"/>
                </div>
                <div className="h2 mb-8" style={{fontSize:22}}>Payment Successful</div>
                <p className="text-sm c-muted mb-20">Your spot is reserved. Check your email for confirmation and QR code.</p>
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

          {/* Order summary */}
          <div className="pay-sticky" style={{width:264,flexShrink:0}}>
            <div className="card" style={{position:'sticky',top:80}}>
              <div className="card-hd-sm"><div className="h3" style={{fontSize:14}}>Order Summary</div></div>
              <div className="card-p-sm">
                {[['Subtotal ('+bk.duration+')',bk.sub],['Service Fee',bk.fee],['Tax',bk.tax]].map(([k,v])=>(
                  <div key={k} className="flex justify-between mb-8">
                    <span className="text-sm c-muted">{k}</span>
                    <span className="text-sm">${v.toFixed(2)}</span>
                  </div>
                ))}
                <hr className="div"/>
                <div className="flex justify-between mb-16">
                  <span className="fw-700">Total</span>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontSize:19,fontWeight:800,color:'var(--blue)'}}>${bk.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-center gap-8 text-xs c-muted" style={{padding:'8px 0',background:'var(--surface)',borderRadius:'var(--r-lg)'}}>
                  <Icon n="shield" size={13}/>Secure Checkout
                </div>
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
   HELP
═══════════════════════════════════════════════════════════ */
const Help = ({toast}) => {
  const [open,setOpen]   = useState(null);
  const [done,setDone]   = useState(false);
  const [loading,setLoad] = useState(false);
  const [form,setForm]   = useState({name:'',email:'',cat:'GENERAL',sub:'',msg:''});

  const submit = ()=>{
    if(!form.name||!form.email||!form.sub||!form.msg){toast('error','Please fill in all required fields');return;}
    setLoad(true);
    setTimeout(()=>{setLoad(false);setDone(true);toast('success','Support ticket submitted!')},1200);
  };

  const quicklinks = [
    {icon:'calendar',title:'Manage Bookings',desc:'View, modify or cancel'},
    {icon:'credit',  title:'Payment Issues', desc:'Billing and refunds'},
    {icon:'navigate',title:'Navigation Help',desc:'Find your spot'},
    {icon:'user',    title:'Account & Security',desc:'Password and settings'},
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-label">Support</div>
          <div className="page-hero-title">Help & Support</div>
          <div className="page-hero-sub">Find answers fast or reach our team directly</div>
        </div>
      </div>
      <div className="container section">
        {/* Quick links */}
        <div className="grid-4 mb-28">
          {quicklinks.map((l,i)=>(
            <div key={i} className="card" style={{padding:'18px 16px',cursor:'pointer',transition:'.2s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--blue)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--line)'}>
              <div style={{width:36,height:36,background:'var(--blue-lt)',borderRadius:'var(--r-lg)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10}}>
                <Icon n={l.icon} size={17} color="var(--blue)"/>
              </div>
              <div className="fw-700 text-sm mb-3">{l.title}</div>
              <div className="text-xs c-muted">{l.desc}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-32 help-layout" style={{alignItems:'flex-start',padding:'25px'}}>
          {/* FAQ */}
          <div style={{flex:1,minWidth:0,background:'var(--blue-lt)'}}>
            <div className="h2 mb-20" style={{fontSize:20}}>Frequently Asked Questions</div>
            <div>
              {FAQS.map(f=>(
                <div key={f.id} className="faq-item">
                  <button className="faq-btn" onClick={()=>setOpen(open===f.id?null:f.id)}>
                    <span className="faq-q">{f.q}</span>
                    <Icon n="chevD" size={16} color="inherit" style={{}} className={`faq-icon${open===f.id?' open':''}`}/>
                  </button>
                  {open===f.id&&<div className="faq-a">{f.a}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="help-sticky" style={{width:360,flexShrink:0}}>
            <div className="card" style={{position:'sticky',top:80}}>
              <div className="card-hd">
                <div className="h3" style={{fontSize:15}}>Contact Support</div>
                <div className="text-sm c-muted mt-4">Average response under 2 hours</div>
              </div>
              <div className="card-p">
                {done?(
                  <div className="text-center" style={{padding:'24px 0'}}>
                    <div style={{width:52,height:52,background:'var(--green-lt)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                      <Icon n="check" size={22} color="var(--green)"/>
                    </div>
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
                    <div className="fg">
                      <label className="lbl">Category</label>
                      <select className="sel" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
                        <option value="GENERAL">General Inquiry</option>
                        <option value="BOOKING">Booking Issue</option>
                        <option value="PAYMENT">Payment Issue</option>
                        <option value="TECHNICAL">Technical Problem</option>
                        <option value="FEEDBACK">Feedback</option>
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
              {/* Other channels */}
              <div style={{borderTop:'1px solid var(--line)',padding:'14px 20px'}}>
                <div className="label-xs mb-12">Other ways to reach us</div>
                {[['📞','Phone','+1 (800) PARKWISE','Mon–Fri, 9am–6pm EST'],
                  ['💬','Live Chat','Start Chat →','Usually replies in minutes'],
                  ['✉️','Email','support@parkwise.com','Within 24 hours']].map(([ic,l,v,n])=>(
                  <div key={l} className="flex items-start gap-10 mb-10">
                    <span style={{fontSize:16,flexShrink:0}}>{ic}</span>
                    <div>
                      <div className="text-xs c-muted">{l}</div>
                      <div className="text-sm fw-600">{v}</div>
                      <div className="text-xs c-muted">{n}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════ */
const Login = ({go,setUser}) => {
  const [reg,setReg]     = useState(false);
  const [form,setForm]   = useState({email:'',pw:'',name:''});
  const [loading,setLoad] = useState(false);
  const [err,setErr]     = useState('');

  const submit = ()=>{
    if(!form.email||!form.pw||(reg&&!form.name)){setErr('Please fill in all fields.');return;}
    setErr('');setLoad(true);
    setTimeout(()=>{setLoad(false);setUser({name:form.name||'John',email:form.email});go('dashboard')},1200);
  };

  return (
    <div style={{minHeight:'calc(100vh - 60px)',display:'flex',background:'var(--surface)'}}>
      {/* Left panel */}
      <div style={{flex:1,background:'var(--ink)',display:'flex',flexDirection:'column',justifyContent:'center',padding:'60px 48px',minWidth:320}} className="login-left">
        <div style={{maxWidth:360}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:48}}>
            <div style={{width:36,height:36,background:'rgba(255,255,255,.1)',borderRadius:'var(--r-lg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Icon n="car" size={18} color="rgba(255,255,255,.8)"/>
            </div>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:17,color:'#fff'}}>ParkWise</span>
          </div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:'clamp(26px,3.5vw,36px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:16,letterSpacing:-1}}>
            The smarter<br/>way to park.
          </div>
          <p style={{color:'rgba(255,255,255,.45)',fontSize:15,lineHeight:1.7,marginBottom:36}}>
            Real-time availability, instant booking, and turn-by-turn navigation — all in one app.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {[['check','Real-time spot availability'],['map','Live map navigation'],['shield','Secure payments'],['clock','24/7 access']].map(([ic,l])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:22,height:22,background:'rgba(37,99,235,.3)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Icon n={ic} size={12} color="#93C5FD"/>
                </div>
                <span style={{fontSize:14,color:'rgba(255,255,255,.65)'}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{flex:'0 0 460px',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 32px',background:'#fff'}}>
        <div style={{width:'100%',maxWidth:380}}>
          <div className="mb-28">
            <div className="h2 mb-4" style={{fontSize:22}}>{reg?'Create your account':'Welcome back'}</div>
            <p className="text-sm c-muted">{reg?'Start parking smarter today.':'Sign in to manage your bookings.'}</p>
          </div>

          {err&&<div className="alert alert-err mb-16"><Icon n="warning" size={15}/>{err}</div>}

          {reg&&<div className="fg"><label className="lbl">Full Name</label><input className="inp" placeholder="John Doe" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>}
          <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
          <div className="fg">
            <div className="flex justify-between items-center mb-5">
              <label className="lbl" style={{margin:0}}>Password</label>
              {!reg&&<button style={{background:'none',border:'none',color:'var(--blue)',cursor:'pointer',fontSize:13,fontWeight:600}}>Forgot?</button>}
            </div>
            <input className="inp" type="password" placeholder="••••••••" value={form.pw} onChange={e=>setForm(f=>({...f,pw:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&submit()}/>
          </div>

          <button className="btn btn-blue btn-full mb-10" onClick={submit} disabled={loading||!form.email||!form.pw}>
            {loading?<><Loader sm/>{reg?'Creating account…':'Signing in…'}</>:<>{reg?'Create Account':'Sign In'}<Icon n="arrowR" size={14} color="#fff"/></>}
          </button>

          <div style={{display:'flex',alignItems:'center',gap:12,margin:'16px 0'}}>
            <div style={{flex:1,height:1,background:'var(--line)'}}/>
            <span className="text-xs c-muted">or</span>
            <div style={{flex:1,height:1,background:'var(--line)'}}/>
          </div>

          <button className="btn btn-outline btn-full mb-20">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm c-muted">
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
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [page,setPage]   = useState('landing');
  const [user,setUser]   = useState(null);
  const [sel,setSel]     = useState(null);
  const [toasts,setTsts] = useState([]);

  const toast = useCallback((type,message)=>{
    const id=Date.now();
    setTsts(t=>[...t,{id,type,message}]);
    setTimeout(()=>setTsts(t=>t.filter(x=>x.id!==id)),3800);
  },[]);

  const go = useCallback(p=>setPage(p),[]);

  return (
    <>
      <style>{CSS}</style>
      {/* Hide login page's nav on login */}
      {page!=='login'&&<TopNav page={page} go={go} user={user} setUser={setUser}/>}

      <div style={{paddingTop:page==='login'?0:60}}>
        {page==='landing'     &&<Landing   go={go}/>}
        {page==='search'      &&<Search    go={go} setSel={setSel}/>}
        {page==='availability'&&<Availability go={go} sel={sel} toast={toast}/>}
        {page==='dashboard'   &&<Dashboard go={go} user={user}/>}
        {page==='payment'     &&<Payment   go={go} toast={toast}/>}
        {page==='help'        &&<Help      toast={toast}/>}
        {page==='login'       &&<Login     go={go} setUser={setUser}/>}
      </div>

      <Toast items={toasts}/>
    </>
  );
}