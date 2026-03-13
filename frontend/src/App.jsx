import { useState, useEffect, useCallback } from "react";

// ============================================================
// DESIGN SYSTEM - Industrial Precision Theme
// Clean, authoritative, trustworthy
// ============================================================

const theme = {
  colors: {
    primary: "#0A2540",
    accent: "#00C48C",
    accentHover: "#00A878",
    danger: "#E53E3E",
    warning: "#F6C90E",
    surface: "#F7F9FC",
    surfaceAlt: "#EEF2F7",
    border: "#DDE4EE",
    text: "#0A2540",
    textMuted: "#6B7A99",
    white: "#FFFFFF",
    cardBg: "#FFFFFF",
    gradientStart: "#0A2540",
    gradientEnd: "#163B6E",
  }
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #F7F9FC;
    color: #0A2540;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  :root {
    --primary: #0A2540;
    --accent: #00C48C;
    --accent-hover: #00A878;
    --danger: #E53E3E;
    --warning: #F6C90E;
    --surface: #F7F9FC;
    --surface-alt: #EEF2F7;
    --border: #DDE4EE;
    --text: #0A2540;
    --text-muted: #6B7A99;
    --white: #FFFFFF;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* Animations */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes countUp { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

  .fade-in { animation: fadeIn 0.5s ease forwards; }
  .slide-in { animation: slideIn 0.4s ease forwards; }

  /* Nav */
  .nav { 
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(10, 37, 64, 0.97); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 64px;
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .nav-logo-icon { 
    width: 36px; height: 36px; background: var(--accent); border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
    flex-shrink: 0;
  }
  .nav-logo-text { color: white; font-weight: 700; font-size: 18px; letter-spacing: -0.3px; }
  .nav-links { display: flex; align-items: center; gap: 8px; }
  .nav-link {
    color: rgba(255,255,255,0.7); text-decoration: none; padding: 8px 14px;
    border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer;
    transition: all 0.2s; border: none; background: none;
  }
  .nav-link:hover, .nav-link.active { color: white; background: rgba(255,255,255,0.1); }
  .nav-cta {
    background: var(--accent); color: white; border: none; border-radius: 8px;
    padding: 8px 18px; font-size: 14px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: inherit;
  }
  .nav-cta:hover { background: var(--accent-hover); transform: translateY(-1px); }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px; border-radius: 10px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; border: none; font-family: inherit;
    text-decoration: none; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,196,140,0.3); }
  .btn-secondary { background: var(--primary); color: white; }
  .btn-secondary:hover { background: #163B6E; transform: translateY(-2px); }
  .btn-outline { background: transparent; color: var(--primary); border: 2px solid var(--border); }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .btn-ghost { background: var(--surface-alt); color: var(--text); }
  .btn-ghost:hover { background: var(--border); }
  .btn-danger { background: var(--danger); color: white; }
  .btn-danger:hover { background: #C53030; }
  .btn-lg { padding: 14px 28px; font-size: 16px; border-radius: 12px; }
  .btn-sm { padding: 7px 14px; font-size: 13px; border-radius: 8px; }
  .btn-full { width: 100%; justify-content: center; }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }

  /* Cards */
  .card {
    background: white; border-radius: 16px; border: 1px solid var(--border);
    overflow: hidden; transition: all 0.25s;
  }
  .card:hover { box-shadow: 0 8px 30px rgba(10,37,64,0.1); transform: translateY(-2px); }
  .card-flat { box-shadow: none; }
  .card-flat:hover { transform: none; }
  .card-body { padding: 24px; }
  .card-header-block { padding: 20px 24px; border-bottom: 1px solid var(--border); }

  /* Forms */
  .form-group { margin-bottom: 18px; }
  .form-label { 
    display: block; font-size: 13px; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;
  }
  .form-input {
    width: 100%; padding: 11px 14px; border: 1.5px solid var(--border);
    border-radius: 10px; font-size: 14px; font-family: inherit;
    background: white; color: var(--text); transition: all 0.2s; outline: none;
  }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,196,140,0.12); }
  .form-input::placeholder { color: var(--text-muted); }
  .form-select {
    width: 100%; padding: 11px 14px; border: 1.5px solid var(--border);
    border-radius: 10px; font-size: 14px; font-family: inherit;
    background: white; color: var(--text); outline: none; cursor: pointer;
    transition: border-color 0.2s; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%236B7A99' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px;
  }
  .form-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,196,140,0.12); }
  .form-textarea {
    width: 100%; padding: 11px 14px; border: 1.5px solid var(--border);
    border-radius: 10px; font-size: 14px; font-family: inherit;
    background: white; color: var(--text); transition: all 0.2s; outline: none;
    resize: vertical; min-height: 100px;
  }
  .form-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,196,140,0.12); }
  .form-error { font-size: 12px; color: var(--danger); margin-top: 4px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* Badges */
  .badge {
    display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px;
    border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap;
  }
  .badge-green { background: #E6FBF4; color: #00A878; }
  .badge-red { background: #FEF0F0; color: #C53030; }
  .badge-yellow { background: #FFFBEA; color: #B7791F; }
  .badge-blue { background: #EBF4FF; color: #2B6CB0; }
  .badge-gray { background: var(--surface-alt); color: var(--text-muted); }
  .badge-dot::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; display: inline-block; }

  /* Tags */
  .tag {
    display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px;
    background: var(--surface-alt); border-radius: 6px; font-size: 12px;
    font-weight: 500; color: var(--text-muted); border: 1px solid var(--border);
  }
  .tag-active { background: rgba(0,196,140,0.1); color: var(--accent); border-color: rgba(0,196,140,0.3); }

  /* Stats Card */
  .stat-card {
    background: white; border-radius: 16px; border: 1px solid var(--border);
    padding: 24px; position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--accent);
  }
  .stat-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-value { font-size: 32px; font-weight: 700; color: var(--text); margin: 6px 0 4px; letter-spacing: -1px; animation: countUp 0.5s ease; }
  .stat-meta { font-size: 13px; color: var(--text-muted); }
  .stat-icon { 
    position: absolute; top: 20px; right: 20px;
    width: 44px; height: 44px; background: var(--surface); border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }

  /* Page Layout */
  .page { min-height: 100vh; padding-top: 64px; }
  .page-header {
    background: linear-gradient(135deg, var(--primary) 0%, #163B6E 100%);
    padding: 48px 32px; color: white;
  }
  .page-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 6px; }
  .page-header p { opacity: 0.7; font-size: 15px; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .section { padding: 40px 0; }

  /* Grid layouts */
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

  /* Flex utilities */
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .justify-center { justify-content: center; }
  .gap-4 { gap: 4px; } .gap-8 { gap: 8px; } .gap-12 { gap: 12px; }
  .gap-16 { gap: 16px; } .gap-20 { gap: 20px; } .gap-24 { gap: 24px; }
  .flex-1 { flex: 1; }
  .flex-wrap { flex-wrap: wrap; }

  /* Spacing */
  .mb-4 { margin-bottom: 4px; } .mb-8 { margin-bottom: 8px; }
  .mb-12 { margin-bottom: 12px; } .mb-16 { margin-bottom: 16px; }
  .mb-20 { margin-bottom: 20px; } .mb-24 { margin-bottom: 24px; }
  .mb-32 { margin-bottom: 32px; }
  .mt-auto { margin-top: auto; }
  .ml-auto { margin-left: auto; }
  .p-16 { padding: 16px; } .p-20 { padding: 20px; } .p-24 { padding: 24px; }

  /* Text utilities */
  .text-sm { font-size: 13px; } .text-xs { font-size: 12px; } .text-lg { font-size: 17px; }
  .text-xl { font-size: 20px; } .text-2xl { font-size: 24px; }
  .font-medium { font-weight: 500; } .font-semibold { font-weight: 600; } .font-bold { font-weight: 700; }
  .text-muted { color: var(--text-muted); }
  .text-accent { color: var(--accent); }
  .text-danger { color: var(--danger); }
  .text-white { color: white; }
  .text-center { text-align: center; }
  .text-mono { font-family: 'DM Mono', monospace; }

  /* Divider */
  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

  /* Spot Grid */
  .spot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(56px, 1fr)); gap: 8px; padding: 20px; background: var(--surface); border-radius: 12px; }
  .spot-item {
    width: 56px; height: 56px; border-radius: 10px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; font-size: 11px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; border: 2px solid transparent;
  }
  .spot-available { background: rgba(0,196,140,0.12); color: var(--accent); border-color: rgba(0,196,140,0.3); }
  .spot-available:hover { background: rgba(0,196,140,0.25); transform: scale(1.05); }
  .spot-occupied { background: #FEF0F0; color: var(--danger); cursor: not-allowed; }
  .spot-reserved { background: #FFFBEA; color: #B7791F; cursor: not-allowed; }
  .spot-maintenance { background: var(--surface-alt); color: var(--text-muted); cursor: not-allowed; }
  .spot-selected { background: var(--accent) !important; color: white !important; border-color: var(--accent-hover) !important; transform: scale(1.05); }

  /* Search bar */
  .search-bar {
    display: flex; align-items: center; gap: 12px; background: white;
    border: 1.5px solid var(--border); border-radius: 14px; padding: 10px 16px;
    transition: all 0.2s;
  }
  .search-bar:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,196,140,0.12); }
  .search-bar input { flex: 1; border: none; outline: none; font-family: inherit; font-size: 14px; background: transparent; }
  .search-bar input::placeholder { color: var(--text-muted); }

  /* Filter chips */
  .filter-chip {
    padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: 1.5px solid var(--border); background: white;
    color: var(--text-muted); transition: all 0.2s; font-family: inherit;
  }
  .filter-chip:hover { border-color: var(--accent); color: var(--accent); }
  .filter-chip.active { background: var(--accent); color: white; border-color: var(--accent); }

  /* Location card */
  .location-card {
    background: white; border-radius: 16px; border: 1px solid var(--border);
    overflow: hidden; cursor: pointer; transition: all 0.25s;
  }
  .location-card:hover { box-shadow: 0 12px 40px rgba(10,37,64,0.12); transform: translateY(-3px); }
  .location-card-img { 
    height: 160px; background: linear-gradient(135deg, #0A2540, #163B6E);
    display: flex; align-items: center; justify-content: center; font-size: 48px;
    position: relative; overflow: hidden;
  }
  .location-card-img::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 40px;
    background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
  }
  .location-card-body { padding: 18px; }
  .location-card-name { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .location-card-address { font-size: 13px; color: var(--text-muted); margin-bottom: 12px; }
  .location-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border); }

  /* Availability bar */
  .avail-bar { height: 6px; border-radius: 3px; background: var(--surface-alt); overflow: hidden; margin: 6px 0; }
  .avail-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

  /* Timeline */
  .timeline { position: relative; padding-left: 20px; }
  .timeline::before { content: ''; position: absolute; left: 7px; top: 4px; bottom: 4px; width: 2px; background: var(--border); }
  .timeline-item { position: relative; margin-bottom: 20px; }
  .timeline-dot { 
    position: absolute; left: -17px; top: 4px; width: 10px; height: 10px;
    border-radius: 50%; background: var(--accent); border: 2px solid white;
    box-shadow: 0 0 0 2px var(--accent);
  }

  /* Progress steps */
  .steps { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; }
  .step { display: flex; align-items: center; gap: 8px; flex: 1; }
  .step-num {
    width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0;
    transition: all 0.3s;
  }
  .step-num.active { background: var(--accent); color: white; }
  .step-num.done { background: var(--accent); color: white; }
  .step-num.pending { background: var(--surface-alt); color: var(--text-muted); }
  .step-label { font-size: 13px; font-weight: 500; }
  .step-line { flex: 1; height: 2px; background: var(--border); border-radius: 1px; }
  .step-line.done { background: var(--accent); }

  /* Hero */
  .hero {
    min-height: 100vh; background: linear-gradient(135deg, #0A2540 0%, #163B6E 60%, #0A2540 100%);
    display: flex; align-items: center; position: relative; overflow: hidden;
    padding-top: 64px;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(0,196,140,0.08) 0%, transparent 70%);
  }
  .hero-grid {
    position: absolute; inset: 0; opacity: 0.04;
    background-image: linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .hero-content { position: relative; z-index: 1; color: white; }
  .hero-eyebrow { 
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(0,196,140,0.15); border: 1px solid rgba(0,196,140,0.3);
    color: var(--accent); padding: 6px 14px; border-radius: 20px;
    font-size: 13px; font-weight: 600; margin-bottom: 24px; letter-spacing: 0.5px;
  }
  .hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; line-height: 1.1; margin-bottom: 20px; letter-spacing: -2px; }
  .hero-title span { color: var(--accent); }
  .hero-sub { font-size: 18px; opacity: 0.75; margin-bottom: 36px; max-width: 520px; line-height: 1.6; }
  .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 48px; }
  .hero-search {
    background: white; border-radius: 14px; padding: 6px; display: flex;
    align-items: center; gap: 8px; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .hero-search input {
    flex: 1; border: none; outline: none; font-size: 15px; padding: 10px 14px;
    font-family: inherit; background: transparent; color: var(--text);
  }
  .hero-stats { display: flex; gap: 32px; flex-wrap: wrap; }
  .hero-stat { }
  .hero-stat-value { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .hero-stat-label { font-size: 13px; opacity: 0.6; }

  /* Features section */
  .feature-icon {
    width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center;
    justify-content: center; font-size: 24px; margin-bottom: 16px;
    background: rgba(0,196,140,0.1);
  }

  /* Map placeholder */
  .map-area {
    background: linear-gradient(135deg, #E8F0FE 0%, #D4E8FF 100%);
    border-radius: 16px; overflow: hidden; position: relative;
    border: 1px solid var(--border);
  }
  .map-area::before {
    content: '🗺️'; position: absolute; inset: 0; display: flex; align-items: center;
    justify-content: center; font-size: 80px; opacity: 0.2;
  }
  .map-overlay {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,100,200,0.06) 40px),
                repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,100,200,0.06) 40px);
  }
  .map-marker {
    position: absolute; transform: translate(-50%, -100%);
    background: var(--primary); color: white; padding: 6px 10px; border-radius: 8px;
    font-size: 11px; font-weight: 700; white-space: nowrap; cursor: pointer;
    transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .map-marker::after {
    content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
    border: 5px solid transparent; border-top-color: var(--primary);
  }
  .map-marker.available { background: var(--accent); }
  .map-marker.available::after { border-top-color: var(--accent); }
  .map-marker:hover { transform: translate(-50%, -110%); z-index: 10; }

  /* Table */
  .table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; }
  th {
    padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted);
    background: var(--surface); border-bottom: 1px solid var(--border);
  }
  td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--surface); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface); }

  /* Sidebar */
  .sidebar { width: 260px; flex-shrink: 0; }
  .sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
  .sidebar-item {
    display: flex; align-items: center; gap: 12px; padding: 11px 14px;
    border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500;
    color: var(--text-muted); transition: all 0.2s; border: none; background: none;
    font-family: inherit; text-align: left; width: 100%;
  }
  .sidebar-item:hover { background: var(--surface-alt); color: var(--text); }
  .sidebar-item.active { background: rgba(0,196,140,0.1); color: var(--accent); font-weight: 600; }
  .sidebar-icon { width: 18px; text-align: center; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(10,37,64,0.6); backdrop-filter: blur(4px);
    z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: white; border-radius: 20px; max-width: 520px; width: 100%;
    max-height: 90vh; overflow-y: auto; animation: fadeIn 0.3s ease;
  }
  .modal-header { padding: 24px 24px 0; display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-size: 18px; font-weight: 700; }
  .modal-close { width: 32px; height: 32px; border-radius: 8px; border: none; background: var(--surface-alt); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
  .modal-body { padding: 20px 24px 24px; }

  /* Toast */
  .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 3000; display: flex; flex-direction: column; gap: 10px; }
  .toast {
    background: var(--primary); color: white; padding: 12px 18px; border-radius: 12px;
    font-size: 14px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    display: flex; align-items: center; gap: 10px; animation: slideIn 0.3s ease;
    min-width: 280px;
  }
  .toast-success { background: var(--accent); }
  .toast-error { background: var(--danger); }

  /* Accordion/FAQ */
  .faq-item { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 10px; }
  .faq-question {
    padding: 18px 20px; font-size: 15px; font-weight: 600; cursor: pointer;
    display: flex; justify-content: space-between; align-items: center;
    background: white; transition: background 0.2s; border: none; width: 100%;
    font-family: inherit; text-align: left;
  }
  .faq-question:hover { background: var(--surface); }
  .faq-answer { padding: 0 20px 18px; font-size: 14px; color: var(--text-muted); line-height: 1.7; }
  .faq-icon { font-size: 18px; transition: transform 0.2s; flex-shrink: 0; color: var(--text-muted); }
  .faq-icon.open { transform: rotate(180deg); color: var(--accent); }

  /* Payment card */
  .payment-card-visual {
    background: linear-gradient(135deg, #0A2540 0%, #163B6E 100%);
    border-radius: 16px; padding: 24px; color: white; position: relative; overflow: hidden;
    height: 180px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .payment-card-visual::before {
    content: ''; position: absolute; top: -30px; right: -30px;
    width: 150px; height: 150px; border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }
  .payment-card-visual::after {
    content: ''; position: absolute; bottom: -20px; right: 40px;
    width: 100px; height: 100px; border-radius: 50%;
    background: rgba(0,196,140,0.1);
  }
  .card-chip { width: 36px; height: 28px; background: rgba(255,255,255,0.2); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
  .card-number { font-family: 'DM Mono', monospace; font-size: 16px; letter-spacing: 2px; opacity: 0.9; }

  /* Rating stars */
  .stars { display: flex; gap: 2px; }
  .star { font-size: 14px; }
  .star-filled { color: #F6C90E; }
  .star-empty { color: var(--border); }

  /* Loader */
  .loader { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  .loader-sm { width: 18px; height: 18px; border-width: 2px; }

  /* Alert */
  .alert { border-radius: 12px; padding: 14px 18px; font-size: 14px; margin-bottom: 16px; display: flex; gap: 10px; align-items: flex-start; }
  .alert-info { background: #EBF4FF; color: #2B6CB0; border: 1px solid #BEE3F8; }
  .alert-success { background: #E6FBF4; color: #00A878; border: 1px solid rgba(0,196,140,0.3); }
  .alert-warning { background: #FFFBEA; color: #B7791F; border: 1px solid #F6E05E; }
  .alert-error { background: #FEF0F0; color: #C53030; border: 1px solid #FEB2B2; }

  /* Responsive */
  @media (max-width: 768px) {
    .nav { padding: 0 16px; }
    .nav-links { display: none; }
    .form-row { grid-template-columns: 1fr; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .hero-title { font-size: 32px; }
    .hero-actions { flex-direction: column; }
    .sidebar { display: none; }
    .page-header { padding: 32px 16px; }
    .container { padding: 0 16px; }
    .hero-stats { gap: 20px; }
    .steps .step-label { display: none; }
  }
`;

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_LOCATIONS = [
  { id: 1, name: "Downtown Central Parking", address: "123 Main Street", city: "New York", state: "NY", available: 45, total: 200, hourlyRate: 5.00, dailyRate: 35.00, rating: 4.5, reviews: 128, isCovered: true, hasEvCharging: true, hasSecurity: true, is24Hours: true, emoji: "🏙️", lat: 40.71, lng: -74.006 },
  { id: 2, name: "Airport Terminal Garage", address: "1 Airport Blvd", city: "New York", state: "NY", available: 120, total: 500, hourlyRate: 8.00, dailyRate: 50.00, rating: 4.2, reviews: 89, isCovered: true, hasEvCharging: false, hasSecurity: true, is24Hours: true, emoji: "✈️", lat: 40.64, lng: -73.77 },
  { id: 3, name: "Midtown Smart Lot", address: "456 Park Ave", city: "New York", state: "NY", available: 23, total: 100, hourlyRate: 6.50, dailyRate: 40.00, rating: 4.7, reviews: 210, isCovered: false, hasEvCharging: true, hasSecurity: false, is24Hours: false, emoji: "🏢", lat: 40.75, lng: -73.98 },
  { id: 4, name: "West Side Parking Hub", address: "789 West Side Hwy", city: "New York", state: "NY", available: 67, total: 150, hourlyRate: 4.00, dailyRate: 28.00, rating: 3.9, reviews: 54, isCovered: false, hasEvCharging: false, hasSecurity: true, is24Hours: true, emoji: "🚗", lat: 40.76, lng: -74.00 },
];

const MOCK_BOOKINGS = [
  { id: 1, ref: "PW-2024-001", location: "Downtown Central", spot: "A-12", status: "COMPLETED", date: "2024-11-15", start: "09:00", end: "17:00", amount: 40.00, duration: "8h" },
  { id: 2, ref: "PW-2024-002", location: "Midtown Smart Lot", spot: "B-05", status: "ACTIVE", date: "2024-12-01", start: "10:00", end: "14:00", amount: 26.00, duration: "4h" },
  { id: 3, ref: "PW-2024-003", location: "Airport Terminal", spot: "C-33", status: "CONFIRMED", date: "2024-12-05", start: "08:00", end: "20:00", amount: 96.00, duration: "12h" },
  { id: 4, ref: "PW-2024-004", location: "West Side Hub", spot: "D-08", status: "CANCELLED", date: "2024-11-28", start: "14:00", end: "18:00", amount: 16.00, duration: "4h" },
];

const FAQS = [
  { id: 1, q: "How do I find available parking spots?", a: "Use the Parking Search page to search by location, date, and time. You can also filter by amenities like EV charging, covered parking, or 24-hour availability. The map view shows real-time availability." },
  { id: 2, q: "Can I modify or cancel my booking?", a: "Yes! You can cancel bookings up to 1 hour before the start time for a full refund. To modify, cancel the existing booking and create a new one. Go to Dashboard > My Bookings to manage your reservations." },
  { id: 3, q: "What payment methods are accepted?", a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and digital wallets. All transactions are secured with 256-bit SSL encryption." },
  { id: 4, q: "How do I get my refund?", a: "Refunds for cancelled bookings are processed automatically within 3-5 business days to your original payment method. You'll receive an email confirmation once the refund is initiated." },
  { id: 5, q: "What happens if I overstay my booked time?", a: "If you exceed your booked duration, the system will automatically calculate the additional time at the standard hourly rate and charge your saved payment method. You'll receive an email notification." },
  { id: 6, q: "Is my vehicle safe in the parking lot?", a: "Locations with our 'Security' badge have 24/7 CCTV surveillance and security personnel. Look for the security badge when searching for parking spots. We also offer vehicle damage protection in select locations." },
];

// ============================================================
// UTILITY COMPONENTS
// ============================================================
const Stars = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`star ${i <= Math.round(rating) ? "star-filled" : "star-empty"}`}>★</span>
    ))}
  </div>
);

const Badge = ({ status }) => {
  const map = {
    COMPLETED: ["badge-green", "Completed"],
    ACTIVE: ["badge-blue", "Active"],
    CONFIRMED: ["badge-yellow", "Confirmed"],
    CANCELLED: ["badge-red", "Cancelled"],
    PENDING: ["badge-gray", "Pending"],
    OPEN: ["badge-blue", "Open"],
    RESOLVED: ["badge-green", "Resolved"],
  };
  const [cls, label] = map[status] || ["badge-gray", status];
  return <span className={`badge badge-dot ${cls}`}>{label}</span>;
};

const Loader = ({ small }) => (
  <div className={`loader ${small ? "loader-sm" : ""}`}></div>
);

const Toast = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast toast-${t.type}`}>
        <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
        {t.message}
      </div>
    ))}
  </div>
);

// ============================================================
// NAVIGATION
// ============================================================
const Nav = ({ page, setPage, user, setUser }) => {
  const links = [
    { id: "landing", label: "Home" },
    { id: "search", label: "Find Parking" },
    { id: "availability", label: "Availability" },
    { id: "dashboard", label: "Dashboard" },
    { id: "help", label: "Help" },
  ];

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("landing")}>
        <div className="nav-logo-icon">🅿</div>
        <span className="nav-logo-text">ParkWise</span>
      </div>
      <div className="nav-links">
        {links.map(l => (
          <button key={l.id} className={`nav-link ${page === l.id ? "active" : ""}`} onClick={() => setPage(l.id)}>
            {l.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-8">
        {user ? (
          <div className="flex items-center gap-12">
            <button className="nav-link" style={{color:"rgba(255,255,255,0.8)", fontWeight:500}}>
              👤 {user.name}
            </button>
            <button className="btn btn-sm" style={{background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.2)"}}
              onClick={() => setUser(null)}>Sign Out</button>
          </div>
        ) : (
          <button className="nav-cta" onClick={() => setPage("login")}>Sign In</button>
        )}
      </div>
    </nav>
  );
};

// ============================================================
// LANDING PAGE
// ============================================================
const LandingPage = ({ setPage }) => {
  const features = [
    { icon: "🔍", title: "Smart Search", desc: "Find available spots instantly with real-time data and intelligent filters" },
    { icon: "📱", title: "Easy Booking", desc: "Reserve your spot in seconds. Get QR code confirmation instantly" },
    { icon: "💳", title: "Secure Payment", desc: "Multiple payment options with bank-level encryption and protection" },
    { icon: "🗺️", title: "Live Map View", desc: "See all parking locations on an interactive map with availability" },
    { icon: "🔔", title: "Smart Alerts", desc: "Get notified about booking reminders and parking spot updates" },
    { icon: "♻️", title: "Easy Cancellation", desc: "Flexible cancellation with full refunds up to 1 hour before start" },
  ];

  const [searchVal, setSearchVal] = useState("");

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="container" style={{width:"100%"}}>
          <div className="hero-content" style={{maxWidth:640}}>
            <div className="hero-eyebrow" style={{animation:"fadeIn 0.5s ease"}}>
              <span>🟢</span> Real-time Availability
            </div>
            <h1 className="hero-title" style={{animation:"fadeIn 0.6s ease 0.1s both"}}>
              Find Your Perfect<br/><span>Parking Spot</span><br/>Instantly
            </h1>
            <p className="hero-sub" style={{animation:"fadeIn 0.6s ease 0.2s both"}}>
              Skip the hassle. ParkWise shows real-time parking availability, lets you reserve in advance, and guides you straight to your spot.
            </p>

            <div className="hero-search" style={{animation:"fadeIn 0.6s ease 0.3s both", marginBottom:32}}>
              <span style={{fontSize:20, flexShrink:0, paddingLeft:8}}>📍</span>
              <input
                placeholder="Search by location, address, or landmark..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && setPage("search")}
              />
              <button className="btn btn-primary" onClick={() => setPage("search")}>
                Search
              </button>
            </div>

            <div className="hero-stats" style={{animation:"fadeIn 0.6s ease 0.4s both"}}>
              {[["2,400+", "Parking Spots"], ["98%", "Satisfaction Rate"], ["50+", "Locations"], ["24/7", "Available"]].map(([v, l]) => (
                <div key={l} className="hero-stat">
                  <div className="hero-stat-value">{v}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{background:"white"}}>
        <div className="container">
          <div className="text-center mb-32">
            <p className="text-sm font-semibold text-accent" style={{textTransform:"uppercase", letterSpacing:1, marginBottom:12}}>Why ParkWise?</p>
            <h2 style={{fontSize:32, fontWeight:800, letterSpacing:-0.5}}>Everything you need to park smarter</h2>
          </div>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="card card-flat" style={{padding:24, animation:`fadeIn 0.5s ease ${i*0.08}s both`}}>
                <div className="feature-icon">{f.icon}</div>
                <h3 style={{fontSize:16, fontWeight:700, marginBottom:8}}>{f.title}</h3>
                <p className="text-sm text-muted" style={{lineHeight:1.6}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{background:"var(--surface)"}}>
        <div className="container">
          <div className="text-center mb-32">
            <p className="text-sm font-semibold text-accent" style={{textTransform:"uppercase", letterSpacing:1, marginBottom:12}}>Simple Process</p>
            <h2 style={{fontSize:32, fontWeight:800, letterSpacing:-0.5}}>Park in 3 easy steps</h2>
          </div>
          <div className="grid-3">
            {[
              { step:"01", icon:"🔍", title:"Search & Filter", desc:"Enter your destination and preferred time. Filter by price, amenities, and distance." },
              { step:"02", icon:"📋", title:"Select & Book", desc:"Choose your preferred spot on the live map and confirm your reservation instantly." },
              { step:"03", icon:"🚗", title:"Drive & Park", desc:"Get QR code, navigate to spot using turn-by-turn directions, and enjoy hassle-free parking." },
            ].map((s, i) => (
              <div key={i} style={{textAlign:"center", padding:"24px 16px"}}>
                <div style={{fontSize:12, fontWeight:700, color:"var(--accent)", letterSpacing:2, marginBottom:12}}>STEP {s.step}</div>
                <div style={{fontSize:56, marginBottom:16, animation:"float 3s ease-in-out infinite", animationDelay:`${i*0.5}s`}}>{s.icon}</div>
                <h3 style={{fontSize:18, fontWeight:700, marginBottom:8}}>{s.title}</h3>
                <p className="text-muted" style={{fontSize:14, lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:"linear-gradient(135deg, #0A2540 0%, #163B6E 100%)", padding:"64px 32px", textAlign:"center"}}>
        <div className="container">
          <h2 style={{fontSize:32, fontWeight:800, color:"white", marginBottom:16, letterSpacing:-0.5}}>Ready to find your spot?</h2>
          <p style={{color:"rgba(255,255,255,0.65)", marginBottom:32, fontSize:16}}>Join 50,000+ drivers who park smarter with ParkWise</p>
          <div className="flex justify-center gap-16">
            <button className="btn btn-primary btn-lg" onClick={() => setPage("search")}>Find Parking Now</button>
            <button className="btn btn-lg" style={{background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.2)"}} onClick={() => setPage("help")}>Learn More</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background:"#06162A", padding:"32px", textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:13}}>
        <p>© 2024 ParkWise. All rights reserved. Built with ❤️ for smart parking.</p>
      </footer>
    </div>
  );
};

// ============================================================
// SEARCH PAGE
// ============================================================
const SearchPage = ({ setPage, setSelectedLocation }) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ covered: false, ev: false, security: false, h24: false });
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("list");
  const [priceRange, setPriceRange] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = MOCK_LOCATIONS.filter(l => {
    const matchQ = !query || l.name.toLowerCase().includes(query.toLowerCase()) || l.address.toLowerCase().includes(query.toLowerCase());
    const matchCovered = !filters.covered || l.isCovered;
    const matchEv = !filters.ev || l.hasEvCharging;
    const matchSecurity = !filters.security || l.hasSecurity;
    const match24 = !filters.h24 || l.is24Hours;
    const matchPrice = priceRange === "all" || (priceRange === "budget" && l.hourlyRate <= 5) || (priceRange === "mid" && l.hourlyRate > 5 && l.hourlyRate <= 7) || (priceRange === "premium" && l.hourlyRate > 7);
    return matchQ && matchCovered && matchEv && matchSecurity && match24 && matchPrice;
  }).sort((a, b) => sortBy === "rating" ? b.rating - a.rating : sortBy === "price" ? a.hourlyRate - b.hourlyRate : b.available - a.available);

  const toggleFilter = key => setFilters(f => ({ ...f, [key]: !f[key] }));

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>🔍 Find Parking</h1>
          <p>Search and filter from hundreds of parking locations near you</p>
        </div>
      </div>

      <div className="container" style={{paddingTop:24, paddingBottom:40}}>
        {/* Search & Filters */}
        <div className="card mb-20" style={{padding:"20px 24px"}}>
          <div className="flex gap-16 flex-wrap" style={{marginBottom:16}}>
            <div className="search-bar flex-1" style={{minWidth:240}}>
              <span>🔍</span>
              <input placeholder="Search by name, address, or city..." value={query} onChange={e => setQuery(e.target.value)} />
              {query && <button style={{background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)"}} onClick={() => setQuery("")}>✕</button>}
            </div>
            <div className="flex gap-8">
              <select className="form-select" style={{width:"auto"}} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="rating">Sort: Top Rated</option>
                <option value="price">Sort: Price ↑</option>
                <option value="availability">Sort: Availability</option>
              </select>
              <select className="form-select" style={{width:"auto"}} value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                <option value="all">All Prices</option>
                <option value="budget">Budget (≤$5/hr)</option>
                <option value="mid">Mid ($5–$7/hr)</option>
                <option value="premium">Premium ($7+/hr)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-8 flex-wrap">
            <span className="text-sm text-muted font-semibold" style={{marginRight:4}}>Filters:</span>
            {[
              { key:"covered", label:"🏗️ Covered" },
              { key:"ev", label:"⚡ EV Charging" },
              { key:"security", label:"🛡️ Security" },
              { key:"h24", label:"🕐 24/7" },
            ].map(f => (
              <button key={f.key} className={`filter-chip ${filters[f.key] ? "active" : ""}`} onClick={() => toggleFilter(f.key)}>
                {f.label}
              </button>
            ))}
            <div className="flex gap-8 ml-auto">
              <button className={`filter-chip ${viewMode==="list"?"active":""}`} onClick={() => setViewMode("list")}>☰ List</button>
              <button className={`filter-chip ${viewMode==="map"?"active":""}`} onClick={() => setViewMode("map")}>🗺️ Map</button>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted mb-16">
          Showing <strong>{filtered.length}</strong> parking locations
        </p>

        {viewMode === "map" ? (
          <div className="grid-2" style={{alignItems:"start"}}>
            {/* Map */}
            <div className="map-area" style={{height:500, position:"sticky", top:84}}>
              <div className="map-overlay"></div>
              {MOCK_LOCATIONS.map((l, i) => (
                <div key={l.id} className={`map-marker ${l.available > 30 ? "available" : ""}`}
                  style={{left:`${20 + i*20}%`, top:`${20 + i*15}%`}}
                  onMouseEnter={() => setHoveredId(l.id)}
                  onMouseLeave={() => setHoveredId(null)}>
                  ${l.hourlyRate}/hr
                </div>
              ))}
              <div style={{position:"absolute", bottom:16, left:16, background:"white", borderRadius:10, padding:"10px 14px", fontSize:13, boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>
                <div className="flex items-center gap-8 mb-4"><span style={{width:10,height:10,background:"var(--accent)",borderRadius:2,display:"inline-block"}}></span> Available</div>
                <div className="flex items-center gap-8"><span style={{width:10,height:10,background:"var(--primary)",borderRadius:2,display:"inline-block"}}></span> Limited</div>
              </div>
            </div>
            {/* List */}
            <div className="flex flex-col gap-16">
              {filtered.map(loc => <LocationCard key={loc.id} loc={loc} setPage={setPage} setSelectedLocation={setSelectedLocation} highlighted={hoveredId === loc.id} />)}
            </div>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map(loc => <LocationCard key={loc.id} loc={loc} setPage={setPage} setSelectedLocation={setSelectedLocation} />)}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="card" style={{padding:48, textAlign:"center"}}>
            <div style={{fontSize:48, marginBottom:16}}>🅿️</div>
            <h3 style={{marginBottom:8}}>No parking found</h3>
            <p className="text-muted">Try adjusting your search or clearing filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LocationCard = ({ loc, setPage, setSelectedLocation, highlighted }) => {
  const pct = Math.round((loc.available / loc.total) * 100);
  const barColor = pct > 40 ? "var(--accent)" : pct > 15 ? "#F6C90E" : "var(--danger)";

  return (
    <div className="location-card" style={highlighted ? {boxShadow:"0 12px 40px rgba(0,196,140,0.2)", transform:"translateY(-3px)"} : {}}>
      <div className="location-card-img">
        <span style={{fontSize:48, position:"relative", zIndex:1}}>{loc.emoji}</span>
        <div style={{position:"absolute", top:12, right:12, background:"rgba(255,255,255,0.9)", borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:700, color:barColor}}>
          {loc.available} available
        </div>
      </div>
      <div className="location-card-body">
        <div className="location-card-name">{loc.name}</div>
        <div className="location-card-address">📍 {loc.address}, {loc.city}</div>

        <div style={{marginBottom:10}}>
          <div className="flex justify-between text-xs text-muted mb-4">
            <span>Availability</span><span style={{color:barColor, fontWeight:600}}>{pct}%</span>
          </div>
          <div className="avail-bar">
            <div className="avail-bar-fill" style={{width:`${pct}%`, background:barColor}}></div>
          </div>
        </div>

        <div className="flex gap-8 flex-wrap mb-12">
          {loc.isCovered && <span className="tag">🏗️ Covered</span>}
          {loc.hasEvCharging && <span className="tag">⚡ EV</span>}
          {loc.hasSecurity && <span className="tag">🛡️ Security</span>}
          {loc.is24Hours && <span className="tag">🕐 24/7</span>}
        </div>

        <div className="location-card-footer">
          <div>
            <div style={{fontSize:20, fontWeight:800, color:"var(--primary)"}}>
              ${loc.hourlyRate}<span style={{fontSize:13, fontWeight:500, color:"var(--text-muted)"}}>/hr</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Stars rating={loc.rating} />
              <span className="text-xs text-muted">({loc.reviews})</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => { setSelectedLocation(loc); setPage("availability"); }}>
            Book Now →
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// AVAILABILITY PAGE
// ============================================================
const AvailabilityPage = ({ setPage, selectedLocation, addToast }) => {
  const loc = selectedLocation || MOCK_LOCATIONS[0];
  const [floor, setFloor] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Generate mock spots
  const spots = [];
  for (let i = 1; i <= 40; i++) {
    const num = `${String.fromCharCode(64 + floor)}-${String(i).padStart(2,"0")}`;
    const rand = Math.random();
    const status = rand < 0.55 ? "AVAILABLE" : rand < 0.75 ? "OCCUPIED" : rand < 0.85 ? "RESERVED" : "MAINTENANCE";
    const type = i % 10 === 0 ? "EV_CHARGING" : i % 8 === 0 ? "HANDICAP" : i % 5 === 0 ? "COMPACT" : "STANDARD";
    spots.push({ id: i, number: num, status, type });
  }

  const hours = (() => {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    return Math.max(0, ((eh * 60 + em) - (sh * 60 + sm)) / 60);
  })();

  const total = (hours * loc.hourlyRate).toFixed(2);

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <button className="btn btn-sm" style={{background:"rgba(255,255,255,0.1)", color:"white", marginBottom:12}} onClick={() => setPage("search")}>
            ← Back to Search
          </button>
          <h1>🅿️ {loc.name}</h1>
          <p>📍 {loc.address}, {loc.city} • ⭐ {loc.rating} ({loc.reviews} reviews)</p>
        </div>
      </div>

      <div className="container section">
        <div className="flex gap-24" style={{alignItems:"flex-start"}}>
          {/* Spot Grid */}
          <div style={{flex:1}}>
            {/* Time selector */}
            <div className="card mb-20">
              <div className="card-header-block">
                <h3 style={{fontSize:16, fontWeight:700}}>Select Time</h3>
              </div>
              <div className="card-body">
                <div className="form-row" style={{marginBottom:16}}>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <div className="flex gap-8">
                      <div style={{flex:1}}>
                        <label className="form-label">Start Time</label>
                        <input type="time" className="form-input" value={startTime} onChange={e => setStartTime(e.target.value)} />
                      </div>
                      <div style={{flex:1}}>
                        <label className="form-label">End Time</label>
                        <input type="time" className="form-input" value={endTime} onChange={e => setEndTime(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
                {hours > 0 && (
                  <div className="alert alert-info">
                    ⏱️ Duration: <strong>{hours.toFixed(1)} hours</strong> · Estimated cost: <strong>${total}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Floor selector */}
            <div className="card mb-16">
              <div className="card-body">
                <div className="flex items-center justify-between mb-16">
                  <h3 style={{fontSize:16, fontWeight:700}}>Select Parking Spot — Floor {floor}</h3>
                  <div className="flex gap-8">
                    {[1, 2, 3].map(f => (
                      <button key={f} className={`filter-chip ${floor === f ? "active" : ""}`} onClick={() => { setFloor(f); setSelectedSpot(null); }}>
                        Level {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-16 flex-wrap mb-16">
                  {[["var(--accent)", "Available"], ["var(--danger)", "Occupied"], ["#B7791F", "Reserved"], ["var(--text-muted)", "Maintenance"]].map(([c, l]) => (
                    <div key={l} className="flex items-center gap-6" style={{gap:6}}>
                      <div style={{width:12, height:12, borderRadius:3, background:c}}></div>
                      <span className="text-xs text-muted">{l}</span>
                    </div>
                  ))}
                </div>

                {/* Spots */}
                <div style={{background:"var(--surface-alt)", borderRadius:8, padding:8, marginBottom:8, textAlign:"center"}}>
                  <span style={{fontSize:11, color:"var(--text-muted)", fontWeight:600}}>← ENTRANCE →</span>
                </div>
                <div className="spot-grid">
                  {spots.map(s => (
                    <div
                      key={s.id}
                      className={`spot-item spot-${s.status.toLowerCase()} ${selectedSpot?.id === s.id ? "spot-selected" : ""}`}
                      onClick={() => s.status === "AVAILABLE" && setSelectedSpot(selectedSpot?.id === s.id ? null : s)}
                      title={`${s.number} - ${s.type.replace("_"," ")}`}
                    >
                      <span style={{fontSize:14}}>{s.type==="EV_CHARGING" ? "⚡" : s.type==="HANDICAP" ? "♿" : s.type==="COMPACT" ? "🔵" : "🚗"}</span>
                      <span style={{fontSize:9}}>{s.number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking summary */}
          <div style={{width:320, flexShrink:0}}>
            <div className="card" style={{position:"sticky", top:84}}>
              <div className="card-header-block">
                <h3 style={{fontSize:16, fontWeight:700}}>Booking Summary</h3>
              </div>
              <div className="card-body">
                {selectedSpot ? (
                  <>
                    <div className="flex justify-between mb-8">
                      <span className="text-sm text-muted">Spot</span>
                      <span className="text-sm font-semibold text-mono">{selectedSpot.number}</span>
                    </div>
                    <div className="flex justify-between mb-8">
                      <span className="text-sm text-muted">Type</span>
                      <span className="text-sm font-semibold">{selectedSpot.type.replace("_"," ")}</span>
                    </div>
                    <div className="flex justify-between mb-8">
                      <span className="text-sm text-muted">Date</span>
                      <span className="text-sm font-semibold">{date}</span>
                    </div>
                    <div className="flex justify-between mb-8">
                      <span className="text-sm text-muted">Time</span>
                      <span className="text-sm font-semibold">{startTime} – {endTime}</span>
                    </div>
                    <div className="flex justify-between mb-8">
                      <span className="text-sm text-muted">Duration</span>
                      <span className="text-sm font-semibold">{hours.toFixed(1)} hrs</span>
                    </div>
                    <div className="flex justify-between mb-8">
                      <span className="text-sm text-muted">Rate</span>
                      <span className="text-sm font-semibold">${loc.hourlyRate}/hr</span>
                    </div>
                    <hr className="divider" />
                    <div className="flex justify-between mb-20">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-accent" style={{fontSize:20}}>${total}</span>
                    </div>
                    <button className="btn btn-primary btn-full" onClick={() => {
                      if (hours <= 0) { addToast("error", "End time must be after start time"); return; }
                      setShowBookingModal(true);
                    }}>
                      Continue to Payment →
                    </button>
                    <button className="btn btn-ghost btn-full mt-8" onClick={() => setSelectedSpot(null)}>
                      Clear Selection
                    </button>
                  </>
                ) : (
                  <div style={{textAlign:"center", padding:"24px 0"}}>
                    <div style={{fontSize:40, marginBottom:12}}>🅿️</div>
                    <p className="text-muted text-sm">Select an available spot<br/>from the grid to book it</p>
                    <div className="flex items-center gap-8 mt-16 justify-center">
                      <span className="badge badge-green badge-dot">{spots.filter(s=>s.status==="AVAILABLE").length} available</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Location info */}
              <div className="card-header-block">
                <h4 style={{fontSize:13, fontWeight:700, marginBottom:12}}>Amenities</h4>
                <div className="flex gap-8 flex-wrap">
                  {loc.isCovered && <span className="tag">🏗️ Covered</span>}
                  {loc.hasEvCharging && <span className="tag">⚡ EV</span>}
                  {loc.hasSecurity && <span className="tag">🛡️ Security</span>}
                  {loc.is24Hours && <span className="tag">🕐 24/7</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking confirmation modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Confirm Booking</span>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-success mb-20">✅ Spot {selectedSpot?.number} is available for your selected time</div>
              <div style={{background:"var(--surface)", borderRadius:12, padding:16, marginBottom:20}}>
                {[["Location", loc.name], ["Spot", selectedSpot?.number], ["Date", date], ["Time", `${startTime} – ${endTime}`], ["Duration", `${hours.toFixed(1)} hours`], ["Total", `$${total}`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between mb-8" style={{fontSize:14}}>
                    <span className="text-muted">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-full" onClick={() => {
                setShowBookingModal(false);
                addToast("success", "Booking confirmed! Proceeding to payment...");
                setTimeout(() => setPage("payment"), 1000);
              }}>
                Proceed to Payment →
              </button>
              <button className="btn btn-ghost btn-full mt-8" onClick={() => setShowBookingModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// DASHBOARD PAGE
// ============================================================
const DashboardPage = ({ setPage, user }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const stats = [
    { label: "Total Bookings", value: "24", meta: "+3 this month", icon: "📋" },
    { label: "Total Spent", value: "$487", meta: "Last 6 months", icon: "💳" },
    { label: "Hours Parked", value: "186h", meta: "All time", icon: "⏱️" },
    { label: "Favorite Spot", value: "Downtown", meta: "7 visits", icon: "⭐" },
  ];

  const filteredBookings = filterStatus === "ALL" ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter(b => b.status === filterStatus);

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "bookings", label: "📋 Bookings" },
    { id: "payments", label: "💳 Payments" },
    { id: "profile", label: "👤 Profile" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>👋 Welcome back, {user?.name || "John"}!</h1>
          <p>Manage your bookings, payments, and account settings</p>
        </div>
      </div>

      <div className="container section">
        <div className="flex gap-24" style={{alignItems:"flex-start"}}>
          {/* Sidebar */}
          <div className="sidebar">
            <div className="card card-flat" style={{padding:8}}>
              <div className="sidebar-nav">
                {tabs.map(t => (
                  <button key={t.id} className={`sidebar-item ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                    <span className="sidebar-icon">{t.label.split(" ")[0]}</span>
                    {t.label.split(" ").slice(1).join(" ")}
                  </button>
                ))}
              </div>
              <hr className="divider" />
              <button className="sidebar-item" onClick={() => setPage("search")}>
                <span className="sidebar-icon">🔍</span> Find Parking
              </button>
              <button className="sidebar-item" onClick={() => setPage("help")}>
                <span className="sidebar-icon">❓</span> Help & Support
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{flex:1}}>
            {activeTab === "overview" && (
              <div className="fade-in">
                {/* Stats */}
                <div className="grid-4 mb-24" style={{gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))"}}>
                  {stats.map((s, i) => (
                    <div key={i} className="stat-card">
                      <div className="stat-icon">{s.icon}</div>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-meta">{s.meta}</div>
                    </div>
                  ))}
                </div>

                {/* Active booking */}
                <div className="card mb-20">
                  <div className="card-header-block">
                    <h3 style={{fontSize:15, fontWeight:700}}>🟢 Active Booking</h3>
                  </div>
                  <div className="card-body">
                    <div className="flex justify-between items-center flex-wrap gap-16">
                      <div>
                        <div style={{fontSize:17, fontWeight:700, marginBottom:4}}>Midtown Smart Lot · Spot B-05</div>
                        <div className="text-muted text-sm">Dec 01 · 10:00 AM – 2:00 PM · 4 hours</div>
                        <div className="flex gap-8 mt-8">
                          <span className="badge badge-blue badge-dot">Active</span>
                          <span className="text-mono text-xs text-muted">PW-2024-002</span>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:24, fontWeight:800, color:"var(--accent)"}}>$26.00</div>
                        <button className="btn btn-danger btn-sm mt-8">End Parking</button>
                      </div>
                    </div>
                    <hr className="divider" />
                    <div className="flex gap-8">
                      <button className="btn btn-ghost btn-sm">📍 Navigate</button>
                      <button className="btn btn-ghost btn-sm">🔲 Show QR Code</button>
                      <button className="btn btn-outline btn-sm" style={{marginLeft:"auto"}}>Extend Time</button>
                    </div>
                  </div>
                </div>

                {/* Recent bookings */}
                <div className="card">
                  <div className="card-header-block">
                    <div className="flex justify-between items-center">
                      <h3 style={{fontSize:15, fontWeight:700}}>Recent Bookings</h3>
                      <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab("bookings")}>View All →</button>
                    </div>
                  </div>
                  <div className="table-wrap" style={{border:"none", borderRadius:0}}>
                    <table>
                      <thead>
                        <tr><th>Booking</th><th>Location</th><th>Date</th><th>Amount</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {MOCK_BOOKINGS.slice(0,3).map(b => (
                          <tr key={b.id}>
                            <td><span className="text-mono" style={{fontSize:12}}>{b.ref}</span></td>
                            <td>{b.location}</td>
                            <td className="text-muted text-sm">{b.date}</td>
                            <td className="font-semibold">${b.amount.toFixed(2)}</td>
                            <td><Badge status={b.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="fade-in">
                <div className="flex justify-between items-center mb-20">
                  <h2 style={{fontSize:20, fontWeight:700}}>My Bookings</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => setPage("search")}>+ New Booking</button>
                </div>
                <div className="flex gap-8 mb-16 flex-wrap">
                  {["ALL","ACTIVE","CONFIRMED","COMPLETED","CANCELLED"].map(s => (
                    <button key={s} className={`filter-chip ${filterStatus===s?"active":""}`} onClick={() => setFilterStatus(s)}>
                      {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-12">
                  {filteredBookings.map(b => (
                    <div key={b.id} className="card card-flat">
                      <div className="card-body">
                        <div className="flex justify-between items-start flex-wrap gap-12">
                          <div>
                            <div className="flex items-center gap-12 mb-4">
                              <span className="font-bold">{b.location}</span>
                              <Badge status={b.status} />
                            </div>
                            <div className="text-sm text-muted mb-8">
                              Spot: <strong>{b.spot}</strong> · {b.date} · {b.start} – {b.end} ({b.duration})
                            </div>
                            <span className="text-mono text-xs text-muted">{b.ref}</span>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontSize:20, fontWeight:700}}>${b.amount.toFixed(2)}</div>
                            <div className="flex gap-8 mt-8 justify-end">
                              {b.status === "ACTIVE" && <button className="btn btn-danger btn-sm">Cancel</button>}
                              {b.status === "CONFIRMED" && <button className="btn btn-danger btn-sm">Cancel</button>}
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

            {activeTab === "payments" && (
              <div className="fade-in">
                <div className="flex justify-between items-center mb-20">
                  <h2 style={{fontSize:20, fontWeight:700}}>Payment History</h2>
                </div>
                <div className="card mb-20">
                  <div className="card-body">
                    <div className="grid-3" style={{gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))"}}>
                      {[["Total Spent", "$487.00"], ["This Month", "$122.00"], ["Refunds", "$16.00"]].map(([l, v]) => (
                        <div key={l} style={{textAlign:"center"}}>
                          <div className="text-muted text-sm mb-4">{l}</div>
                          <div style={{fontSize:22, fontWeight:800}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Date</th><th>Booking Ref</th><th>Method</th><th>Amount</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {MOCK_BOOKINGS.map(b => (
                        <tr key={b.id}>
                          <td className="text-muted text-sm">{b.date}</td>
                          <td><span className="text-mono" style={{fontSize:12}}>{b.ref}</span></td>
                          <td className="text-sm">💳 Visa ••••1234</td>
                          <td className="font-semibold">${b.amount.toFixed(2)}</td>
                          <td><Badge status={b.status === "CANCELLED" ? "CANCELLED" : "COMPLETED"} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="fade-in">
                <h2 style={{fontSize:20, fontWeight:700, marginBottom:20}}>Profile Settings</h2>
                <div className="card mb-20">
                  <div className="card-header-block"><h3 style={{fontSize:15, fontWeight:700}}>Personal Information</h3></div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group"><label className="form-label">First Name</label><input className="form-input" defaultValue="John" /></div>
                      <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" defaultValue="Doe" /></div>
                    </div>
                    <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="john.doe@email.com" type="email" /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+1 (555) 010-1234" type="tel" /></div>
                    <button className="btn btn-primary">Save Changes</button>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header-block"><h3 style={{fontSize:15, fontWeight:700}}>Change Password</h3></div>
                  <div className="card-body">
                    <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
                    <div className="form-row">
                      <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
                      <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
                    </div>
                    <button className="btn btn-secondary">Update Password</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PAYMENT PAGE
// ============================================================
const PaymentPage = ({ addToast, setPage }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const booking = {
    ref: "PW-2024-005",
    location: "Midtown Smart Lot",
    spot: "B-07",
    date: "Dec 5, 2024",
    time: "10:00 AM – 2:00 PM",
    duration: "4 hours",
    subtotal: 26.00,
    serviceFee: 1.50,
    tax: 2.20,
    total: 29.70
  };

  const formatCard = v => v.replace(/\s/g,"").replace(/(\d{4})/g,"$1 ").trim().slice(0,19);
  const formatExpiry = v => {
    const d = v.replace(/\D/g,"").slice(0,4);
    return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
  };

  const handlePay = () => {
    if (method === "card" && (!cardNum || !expiry || !cvv || !name)) {
      addToast("error", "Please fill in all card details");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      addToast("success", "Payment successful! Booking confirmed 🎉");
    }, 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>💳 Secure Payment</h1>
          <p>Complete your booking with our secure payment system</p>
        </div>
      </div>

      <div className="container section">
        {/* Steps */}
        <div className="steps" style={{maxWidth:500, margin:"0 auto 32px"}}>
          {[["Booking", 1], ["Payment", 2], ["Confirmation", 3]].map(([label, num], i) => (
            <div key={num} className="step">
              <div className={`step-num ${step >= num ? (step > num ? "done" : "active") : "pending"}`}>
                {step > num ? "✓" : num}
              </div>
              <span className={`step-label text-sm ${step >= num ? "font-semibold" : "text-muted"}`}>{label}</span>
              {i < 2 && <div className={`step-line ${step > num ? "done" : ""}`}></div>}
            </div>
          ))}
        </div>

        <div className="flex gap-24" style={{alignItems:"flex-start", maxWidth:900, margin:"0 auto"}}>
          {/* Payment form */}
          <div style={{flex:1}}>
            {step < 3 ? (
              <>
                {step === 1 && (
                  <div className="card fade-in">
                    <div className="card-header-block"><h3 style={{fontSize:16, fontWeight:700}}>📋 Booking Details</h3></div>
                    <div className="card-body">
                      {[["Location", booking.location], ["Spot", booking.spot], ["Date", booking.date], ["Time", booking.time], ["Duration", booking.duration]].map(([k, v]) => (
                        <div key={k} className="flex justify-between mb-12">
                          <span className="text-muted text-sm">{k}</span>
                          <span className="font-semibold text-sm">{v}</span>
                        </div>
                      ))}
                      <hr className="divider" />
                      <button className="btn btn-primary btn-full" onClick={() => setStep(2)}>Continue to Payment →</button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="fade-in">
                    {/* Card preview */}
                    <div className="payment-card-visual mb-24">
                      <div className="flex justify-between items-start">
                        <div className="card-chip">
                          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                            <rect x="0" y="0" width="18" height="14" rx="2" fill="rgba(255,255,255,0.3)"/>
                            <rect x="6" y="0" width="6" height="14" fill="rgba(255,255,255,0.15)"/>
                          </svg>
                        </div>
                        <span style={{fontSize:22}}>💳</span>
                      </div>
                      <div className="card-number">{cardNum || "•••• •••• •••• ••••"}</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div style={{fontSize:10, opacity:0.5, marginBottom:2}}>CARD HOLDER</div>
                          <div style={{fontSize:13, fontWeight:600}}>{name || "YOUR NAME"}</div>
                        </div>
                        <div>
                          <div style={{fontSize:10, opacity:0.5, marginBottom:2}}>EXPIRES</div>
                          <div style={{fontSize:13, fontWeight:600}}>{expiry || "MM/YY"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment method tabs */}
                    <div className="flex gap-8 mb-20">
                      {[["card", "💳 Card"], ["paypal", "🅿 PayPal"], ["wallet", "📱 Wallet"]].map(([id, label]) => (
                        <button key={id} className={`filter-chip flex-1 ${method===id?"active":""}`} style={{justifyContent:"center", display:"flex"}} onClick={() => setMethod(id)}>
                          {label}
                        </button>
                      ))}
                    </div>

                    {method === "card" && (
                      <div className="card fade-in">
                        <div className="card-body">
                          <div className="form-group">
                            <label className="form-label">Card Number</label>
                            <input className="form-input text-mono" placeholder="1234 5678 9012 3456" maxLength={19}
                              value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Cardholder Name</label>
                            <input className="form-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">Expiry Date</label>
                              <input className="form-input text-mono" placeholder="MM/YY" maxLength={5}
                                value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} />
                            </div>
                            <div className="form-group">
                              <label className="form-label">CVV</label>
                              <input className="form-input text-mono" type="password" placeholder="•••" maxLength={4}
                                value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,""))} />
                            </div>
                          </div>
                          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14, marginBottom:20}}>
                            <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} />
                            Save card for future payments
                          </label>
                        </div>
                      </div>
                    )}

                    {method === "paypal" && (
                      <div className="card fade-in" style={{padding:32, textAlign:"center"}}>
                        <div style={{fontSize:48, marginBottom:16}}>🅿</div>
                        <p className="text-muted" style={{marginBottom:16}}>You'll be redirected to PayPal to complete payment</p>
                        <div className="alert alert-info">🔒 Secure PayPal Checkout</div>
                      </div>
                    )}

                    {method === "wallet" && (
                      <div className="card fade-in" style={{padding:32, textAlign:"center"}}>
                        <div style={{fontSize:48, marginBottom:16}}>📱</div>
                        <p className="text-muted" style={{marginBottom:16}}>Choose your preferred wallet</p>
                        <div className="flex gap-12 justify-center flex-wrap">
                          {["🍎 Apple Pay", "🤖 Google Pay", "💰 ParkWise Wallet"].map(w => (
                            <button key={w} className="btn btn-outline">{w}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-12 mt-20">
                      <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                      <button className="btn btn-primary flex-1" onClick={handlePay} disabled={loading}>
                        {loading ? <><Loader small /> Processing...</> : `Pay $${booking.total.toFixed(2)} →`}
                      </button>
                    </div>
                    <div className="flex items-center gap-8 justify-center mt-16">
                      <span style={{fontSize:12}}>🔒</span>
                      <span className="text-xs text-muted">256-bit SSL encryption · PCI DSS compliant · Your data is secure</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Success state
              <div className="card fade-in" style={{textAlign:"center", padding:48}}>
                <div style={{width:80, height:80, background:"rgba(0,196,140,0.1)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:36}}>✅</div>
                <h2 style={{fontSize:24, fontWeight:800, marginBottom:8}}>Payment Successful!</h2>
                <p className="text-muted mb-20">Your parking spot has been reserved. Check your email for the confirmation.</p>
                <div style={{background:"var(--surface)", borderRadius:12, padding:20, marginBottom:24, display:"inline-block", minWidth:200}}>
                  <div className="text-xs text-muted mb-4">Booking Reference</div>
                  <div className="text-mono font-bold" style={{fontSize:18}}>{booking.ref}</div>
                </div>
                <br/>
                <div className="flex gap-12 justify-center flex-wrap">
                  <button className="btn btn-primary" onClick={() => setPage("dashboard")}>View Dashboard</button>
                  <button className="btn btn-outline" onClick={() => setPage("search")}>Book Another</button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div style={{width:300, flexShrink:0}}>
            <div className="card" style={{position:"sticky", top:84}}>
              <div className="card-header-block"><h3 style={{fontSize:15, fontWeight:700}}>Order Summary</h3></div>
              <div className="card-body">
                <div className="flex justify-between mb-8"><span className="text-sm text-muted">Subtotal ({booking.duration})</span><span className="text-sm">${booking.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between mb-8"><span className="text-sm text-muted">Service Fee</span><span className="text-sm">${booking.serviceFee.toFixed(2)}</span></div>
                <div className="flex justify-between mb-12"><span className="text-sm text-muted">Tax</span><span className="text-sm">${booking.tax.toFixed(2)}</span></div>
                <hr className="divider" />
                <div className="flex justify-between mb-16">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-accent" style={{fontSize:20}}>${booking.total.toFixed(2)}</span>
                </div>
                <div className="tag" style={{width:"100%", justifyContent:"center", padding:"8px 0"}}>
                  🔒 Secure Checkout
                </div>
                <div className="text-xs text-muted text-center mt-12" style={{lineHeight:1.6}}>
                  Free cancellation up to 1 hour before start time. Full refund guaranteed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// HELP & SUPPORT PAGE
// ============================================================
const HelpPage = ({ addToast }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [category, setCategory] = useState("all");
  const [formData, setFormData] = useState({ name:"", email:"", category:"GENERAL", subject:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const quickLinks = [
    { icon:"📋", title:"Manage Bookings", desc:"View, modify or cancel your reservations" },
    { icon:"💳", title:"Payment Issues", desc:"Billing questions and refund requests" },
    { icon:"🗺️", title:"Navigation Help", desc:"Find your parking spot easily" },
    { icon:"🔐", title:"Account & Security", desc:"Password reset and account settings" },
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      addToast("error", "Please fill in all required fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast("success", "Ticket submitted! We'll respond within 24 hours.");
    }, 1500);
  };

  const filteredFaqs = FAQS;

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>❓ Help & Support</h1>
          <p>Find answers to common questions or reach out to our team</p>
        </div>
      </div>

      <div className="container section">
        {/* Quick links */}
        <div className="grid-4 mb-32" style={{gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))"}}>
          {quickLinks.map((l, i) => (
            <div key={i} className="card" style={{padding:"20px", textAlign:"center", cursor:"pointer"}}>
              <div style={{fontSize:32, marginBottom:10}}>{l.icon}</div>
              <div style={{fontWeight:700, marginBottom:4}}>{l.title}</div>
              <div className="text-xs text-muted">{l.desc}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-24" style={{alignItems:"flex-start"}}>
          {/* FAQs */}
          <div style={{flex:1}}>
            <div className="flex justify-between items-center mb-20">
              <h2 style={{fontSize:22, fontWeight:800}}>Frequently Asked Questions</h2>
            </div>

            {filteredFaqs.map(f => (
              <div key={f.id} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}>
                  {f.q}
                  <span className={`faq-icon ${openFaq === f.id ? "open" : ""}`}>▾</span>
                </button>
                {openFaq === f.id && (
                  <div className="faq-answer fade-in">{f.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div style={{width:360, flexShrink:0}}>
            <div className="card" style={{position:"sticky", top:84}}>
              <div className="card-header-block">
                <h3 style={{fontSize:16, fontWeight:700}}>📬 Contact Support</h3>
                <p className="text-sm text-muted mt-4">Avg response time: &lt;2 hours</p>
              </div>
              <div className="card-body">
                {submitted ? (
                  <div style={{textAlign:"center", padding:"24px 0"}}>
                    <div style={{fontSize:48, marginBottom:12}}>✅</div>
                    <h3 style={{marginBottom:8}}>Ticket Submitted!</h3>
                    <p className="text-sm text-muted mb-16">We'll get back to you at <strong>{formData.email}</strong> within 24 hours.</p>
                    <div className="badge badge-blue" style={{fontSize:13, padding:"6px 14px"}}>Ticket #SPT-{Math.floor(Math.random()*10000)}</div>
                    <br/>
                    <button className="btn btn-ghost btn-sm mt-16" onClick={() => { setSubmitted(false); setFormData({ name:"", email:"", category:"GENERAL", subject:"", message:"" }); }}>Submit Another</button>
                  </div>
                ) : (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Name *</label>
                        <input className="form-input" placeholder="Your name" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input className="form-input" type="email" placeholder="you@email.com" value={formData.email} onChange={e => setFormData(f => ({...f, email: e.target.value}))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={formData.category} onChange={e => setFormData(f => ({...f, category: e.target.value}))}>
                        <option value="GENERAL">General Inquiry</option>
                        <option value="BOOKING">Booking Issue</option>
                        <option value="PAYMENT">Payment Issue</option>
                        <option value="TECHNICAL">Technical Problem</option>
                        <option value="COMPLAINT">Complaint</option>
                        <option value="FEEDBACK">Feedback</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject *</label>
                      <input className="form-input" placeholder="Brief description of your issue" value={formData.subject} onChange={e => setFormData(f => ({...f, subject: e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message *</label>
                      <textarea className="form-textarea" placeholder="Describe your issue in detail..." value={formData.message} onChange={e => setFormData(f => ({...f, message: e.target.value}))} rows={4}></textarea>
                    </div>
                    <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
                      {loading ? <><Loader small /> Submitting...</> : "Submit Ticket"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Contact options */}
            <div className="card mt-16">
              <div className="card-body">
                <h4 style={{fontSize:14, fontWeight:700, marginBottom:14}}>Other Ways to Reach Us</h4>
                {[
                  { icon:"📞", label:"Phone", value:"+1 (800) PARKWISE", note:"Mon–Fri, 9am–6pm EST" },
                  { icon:"💬", label:"Live Chat", value:"Start Chat →", note:"Usually replies in minutes" },
                  { icon:"✉️", label:"Email", value:"support@parkwise.com", note:"Response within 24 hours" },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-12 mb-12" style={{padding:"10px 0", borderBottom:"1px solid var(--surface)"}}>
                    <span style={{fontSize:20, flexShrink:0}}>{c.icon}</span>
                    <div>
                      <div style={{fontSize:12, color:"var(--text-muted)", marginBottom:2}}>{c.label}</div>
                      <div style={{fontSize:13, fontWeight:600}}>{c.value}</div>
                      <div style={{fontSize:11, color:"var(--text-muted)"}}>{c.note}</div>
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

// ============================================================
// LOGIN PAGE
// ============================================================
const LoginPage = ({ setPage, setUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email:"", password:"", name:"" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({ name: form.name || "John", email: form.email });
      setPage("dashboard");
    }, 1200);
  };

  return (
    <div className="page" style={{display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"var(--surface)"}}>
      <div style={{width:"100%", maxWidth:420, padding:24}}>
        <div className="text-center mb-32">
          <div style={{fontSize:40, marginBottom:12}}>🅿️</div>
          <h1 style={{fontSize:26, fontWeight:800, letterSpacing:-0.5}}>ParkWise</h1>
          <p className="text-muted">{isRegister ? "Create your account" : "Sign in to your account"}</p>
        </div>

        <div className="card" style={{padding:28}}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
          </div>
          {!isRegister && (
            <div className="text-right mb-16">
              <button style={{background:"none", border:"none", color:"var(--accent)", cursor:"pointer", fontSize:13, fontWeight:600}}>Forgot password?</button>
            </div>
          )}
          <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
            {loading ? <><Loader small /> {isRegister ? "Creating account..." : "Signing in..."}</> : (isRegister ? "Create Account" : "Sign In")}
          </button>
          <hr className="divider" />
          <button className="btn btn-ghost btn-full">
            {isRegister ? "🔍 Continue with Google" : "🔍 Sign in with Google"}
          </button>
        </div>

        <p className="text-center text-sm text-muted mt-16">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button style={{background:"none", border:"none", color:"var(--accent)", cursor:"pointer", fontWeight:600}} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </p>

        <button className="btn btn-ghost btn-sm" style={{display:"flex", margin:"16px auto 0"}} onClick={() => setPage("landing")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const showNav = page !== "login";

  return (
    <>
      <style>{css}</style>

      {showNav && <Nav page={page} setPage={setPage} user={user} setUser={setUser} />}

      {page === "landing" && <LandingPage setPage={setPage} />}
      {page === "search" && <SearchPage setPage={setPage} setSelectedLocation={setSelectedLocation} />}
      {page === "availability" && <AvailabilityPage setPage={setPage} selectedLocation={selectedLocation} addToast={addToast} />}
      {page === "dashboard" && <DashboardPage setPage={setPage} user={user} />}
      {page === "payment" && <PaymentPage addToast={addToast} setPage={setPage} />}
      {page === "help" && <HelpPage addToast={addToast} />}
      {page === "login" && <LoginPage setPage={setPage} setUser={setUser} />}

      <Toast toasts={toasts} />
    </>
  );
}