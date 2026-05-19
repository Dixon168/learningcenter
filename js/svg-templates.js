const SVG_TEMPLATES = {
  gear: function(params) {
    const teeth1 = params.teeth1 || 12;
    const teeth2 = params.teeth2 || 6;
    const r1 = 50, r2 = 25;
    return `
<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:300px;">
  <g id="gear1-${Date.now()}" transform="translate(90,90)">
    <circle r="${r1}" fill="#FAEEDA" stroke="#BA7517" stroke-width="1.5"/>
    ${Array.from({length: teeth1}, (_, i) => `<rect x="-4" y="-${r1+12}" width="8" height="12" fill="#BA7517" transform="rotate(${i*(360/teeth1)})"/>`).join('')}
    <circle r="8" fill="#854F0B"/>
  </g>
  <g id="gear2-${Date.now()}" transform="translate(215,90)">
    <circle r="${r2}" fill="#E1F5EE" stroke="#0F6E56" stroke-width="1.5"/>
    ${Array.from({length: teeth2}, (_, i) => `<rect x="-3" y="-${r2+10}" width="6" height="10" fill="#0F6E56" transform="rotate(${i*(360/teeth2)})"/>`).join('')}
    <circle r="5" fill="#085041"/>
  </g>
  <text x="160" y="170" text-anchor="middle" font-size="11" fill="#8a7d6f">${teeth1} teeth / ${teeth2} teeth · ratio ${(teeth1/teeth2).toFixed(1)}:1</text>
</svg>`;
  },

  lever: function(params) {
    const loadPos = params.loadPos || 30;
    const effortPos = params.effortPos || 120;
    return `
<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:300px;">
  <polygon points="155,140 165,140 160,100" fill="#8a7d6f"/>
  <rect x="160" y="98" width="0" height="0"/>
  <line x1="40" y1="95" x2="280" y2="95" stroke="#1a1410" stroke-width="6" stroke-linecap="round"/>
  <circle cx="${40 + loadPos}" cy="78" r="14" fill="#b04525"/>
  <text x="${40 + loadPos}" y="82" text-anchor="middle" fill="white" font-size="11" font-weight="700">L</text>
  <line x1="${280 - effortPos + 120}" y1="60" x2="${280 - effortPos + 120}" y2="90" stroke="#2f5d3c" stroke-width="2.5" marker-end="url(#dn)"/>
  <defs><marker id="dn" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 1L5 9Z" fill="#2f5d3c"/></marker></defs>
  <text x="${280 - effortPos + 120}" y="52" text-anchor="middle" fill="#2f5d3c" font-size="11" font-weight="700">Effort</text>
  <text x="160" y="170" text-anchor="middle" font-size="11" fill="#8a7d6f">Lever · fulcrum in middle</text>
</svg>`;
  },

  pulley: function(params) {
    return `
<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:220px;">
  <line x1="40" y1="20" x2="180" y2="20" stroke="#444" stroke-width="3"/>
  <circle cx="110" cy="60" r="28" fill="#FAEEDA" stroke="#BA7517" stroke-width="2"/>
  <circle cx="110" cy="60" r="6" fill="#854F0B"/>
  <line x1="82" y1="60" x2="82" y2="160" stroke="#444" stroke-width="2"/>
  <line x1="138" y1="60" x2="138" y2="120" stroke="#444" stroke-width="2"/>
  <rect x="62" y="160" width="40" height="40" rx="3" fill="#b04525"/>
  <text x="82" y="185" text-anchor="middle" fill="white" font-size="13" font-weight="700">Load</text>
  <line x1="138" y1="118" x2="138" y2="100" stroke="#2f5d3c" stroke-width="2.5" marker-end="url(#dnp)"/>
  <defs><marker id="dnp" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 1L5 9Z" fill="#2f5d3c"/></marker></defs>
  <text x="138" y="135" text-anchor="middle" fill="#2f5d3c" font-size="11" font-weight="700">Pull</text>
</svg>`;
  },

  spring: function(params) {
    const stretch = params.stretch || 0;
    const base = 20;
    const coils = 6;
    const top = 30;
    const spacing = 12 + stretch / 2;
    const path = [`M 60 ${top}`];
    for (let i = 0; i < coils; i++) {
      const y = top + i * spacing;
      path.push(`L 80 ${y + spacing/2} L 60 ${y + spacing}`);
    }
    return `
<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:180px;">
  <rect x="40" y="10" width="80" height="14" fill="#444" rx="2"/>
  <path d="${path.join(' ')}" stroke="#BA7517" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="50" y="${top + coils * spacing}" width="60" height="50" rx="4" fill="#b04525"/>
  <text x="80" y="${top + coils * spacing + 30}" text-anchor="middle" fill="white" font-size="13" font-weight="700">Weight</text>
</svg>`;
  },

  inclined_plane: function() {
    return `
<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:300px;">
  <line x1="30" y1="150" x2="280" y2="150" stroke="#444" stroke-width="2"/>
  <polygon points="40,150 270,150 270,60" fill="#FAEEDA" stroke="#BA7517" stroke-width="2"/>
  <rect x="200" y="83" width="40" height="40" rx="3" fill="#b04525" transform="rotate(-20 220 103)"/>
  <text x="218" y="106" text-anchor="middle" fill="white" font-size="11" font-weight="700" transform="rotate(-20 220 103)">Box</text>
  <text x="120" y="170" text-anchor="middle" font-size="11" fill="#8a7d6f">Inclined plane · easier to push than lift</text>
</svg>`;
  },

  wheel_axle: function() {
    return `
<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:220px;">
  <circle cx="110" cy="110" r="80" fill="#FAEEDA" stroke="#BA7517" stroke-width="2"/>
  <circle cx="110" cy="110" r="25" fill="#854F0B"/>
  <line x1="30" y1="110" x2="190" y2="110" stroke="#1a1410" stroke-width="2"/>
  <line x1="110" y1="30" x2="110" y2="190" stroke="#1a1410" stroke-width="2"/>
  <text x="110" y="200" text-anchor="middle" font-size="11" fill="#8a7d6f">Wheel and axle</text>
</svg>`;
  }
};
