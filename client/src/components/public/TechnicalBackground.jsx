import React, { useEffect, useRef } from 'react';

export default function TechnicalBackground({ style = 'circuit', opacity = 85, isDark = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Nodes representing the engineering ecosystem: Software ↔ API ↔ Database ↔ Hardware
    const nodeTypes = ['Software', 'API', 'Database', 'Hardware', 'Firmware', 'Logic', 'Bus', 'Cloud'];
    const nodes = [];
    const nodeCount = Math.min(28, Math.floor(width / 45));

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.5 + 2,
        label: nodeTypes[i % nodeTypes.length],
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Packet pulses traveling along circuit traces
    const packets = [];
    const maxPackets = 12;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Node and connection rendering colors
      const strokeColor = isDark ? 'rgba(45, 212, 191, 0.12)' : 'rgba(13, 148, 136, 0.15)';
      const nodeColor = isDark ? 'rgba(45, 212, 191, 0.45)' : 'rgba(13, 148, 136, 0.55)';
      const labelColor = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(71, 85, 105, 0.45)';
      const packetColor = isDark ? 'rgba(56, 189, 248, 0.85)' : 'rgba(2, 132, 199, 0.85)';

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Draw node dot
        ctx.beginPath();
        const r = n.radius + Math.sin(n.pulse) * 0.8;
        ctx.arc(n.x, n.y, Math.max(1, r), 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Draw subtle node label
        if (i % 3 === 0) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = labelColor;
          ctx.fillText(n.label, n.x + 8, n.y + 3);
        }

        // Connect nearby nodes with circuit lines
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n.x;
          const dy = n2.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            // Right-angle circuit trace aesthetic if circuit style
            if (style === 'circuit' && dist > 70) {
              const midX = n.x + dx * 0.5;
              ctx.lineTo(midX, n.y);
              ctx.lineTo(midX, n2.y);
              ctx.lineTo(n2.x, n2.y);
            } else {
              ctx.lineTo(n2.x, n2.y);
            }
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Spawn data packet occasionally
            if (packets.length < maxPackets && Math.random() < 0.003) {
              packets.push({
                from: n,
                to: n2,
                progress: 0,
                speed: 0.008 + Math.random() * 0.012
              });
            }
          }
        }
      }

      // Render data packets traveling between nodes
      for (let pIdx = packets.length - 1; pIdx >= 0; pIdx--) {
        const p = packets[pIdx];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(pIdx, 1);
          continue;
        }

        const px = p.from.x + (p.to.x - p.from.x) * p.progress;
        const py = p.from.y + (p.to.y - p.from.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = packetColor;
        ctx.shadowColor = packetColor;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [style, isDark]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: (100 - opacity) / 100 + 0.15 }}
      />
    </div>
  );
}
