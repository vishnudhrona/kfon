import { useEffect, useMemo, useRef, useState } from 'react';

import keralaMapSvg from '@/assets/kerala_districts.svg?raw';

function lerpColor(hex1, hex2, t) {
  const parse = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r},${g},${b})`;
}

const RAMPS = {
  total: ['#f9e8ef', '#3d0822'],
  inuse: ['#d1fae5', '#065f46'],
  damage: ['#fee2e2', '#7f1d1d']
};

function getVal(d, geoMode) {
  return geoMode === 'total' ? (d?.total ?? 0) : geoMode === 'inuse' ? (d?.inUse ?? 0) : (d?.faulty ?? 0);
}

function getDistrictColor(d, geoMode, min, max) {
  const val = getVal(d, geoMode);

  const range = max - min;
  const t = range === 0 ? 0.5 : (val - min) / range;

  const [lo, hi] = RAMPS[geoMode] ?? RAMPS.total;

  return lerpColor(lo, hi, Math.max(0, Math.min(1, t)));
}

const KeralaMap = ({ districts = [], selectedIdx, onSelect, geoMode = 'total' }) => {
  const [svgContent] = useState(keralaMapSvg);

  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const { min, max } = useMemo(() => {
    const vals = districts.map((d) => getVal(d, geoMode));

    return {
      min: Math.min(...vals, 0),
      max: Math.max(...vals, 1)
    };
  }, [districts, geoMode]);

  // Effect 1: Initialize paths, colors, and listeners (ignores selectedIdx to prevent flicker)
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    svg.style.width = '100%';
    svg.style.height = '100%';

    const paths = svg.querySelectorAll('path');
    paths.forEach((path) => {
      const titleEl = path.querySelector('title');
      const districtName = titleEl ? titleEl.textContent : '';
      const districtIndex = districts.findIndex((d) => d.name === districtName || d.abbr === districtName);

      if (districtIndex === -1) {
        path.dataset.index = -1;
        return;
      }

      path.dataset.index = districtIndex;

      const district = districts[districtIndex];
      const fill = getDistrictColor(district, geoMode, min, max);

      // Only set these once per geoMode/data change, to avoid transition flickering
      path.style.fill = fill;
      path.style.stroke = '#ffffff';
      path.style.cursor = 'pointer';
      path.style.transition = 'all 0.2s ease-in-out';

      path.onmouseenter = () => {
        if (tooltipRef.current) {
          tooltipRef.current.textContent = district.name || district.abbr;
          tooltipRef.current.style.display = 'block';
        }
        path.style.filter = 'brightness(1.15)';
      };

      path.onmouseleave = () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
        path.style.filter = 'none';
      };

      path.onclick = () => {
        onSelect?.(districtIndex);
      };
    });
  }, [svgContent, districts, geoMode, min, max, onSelect]);

  // Effect 2: Update selected district stroke independently
  useEffect(() => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const paths = svg.querySelectorAll('path');
    paths.forEach((path) => {
      const idx = parseInt(path.dataset.index, 10);
      if (idx !== -1 && !isNaN(idx)) {
        const isSelected = selectedIdx === idx;
        path.style.strokeWidth = isSelected ? '3.5' : '1.5';
        if (isSelected) {
          // Bring the selected path to the front to avoid stroke clipping
          path.parentNode.appendChild(path);
        }
      }
    });
  }, [selectedIdx]);

  const svgMarkup = useMemo(
    () => (
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      />
    ),
    [svgContent]
  );

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: '#111',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: 8,
          fontWeight: 600,
          zIndex: 10,
          display: 'none',
          pointerEvents: 'none'
        }}
      ></div>
      {svgMarkup}
    </div>
  );
};

export default KeralaMap;
