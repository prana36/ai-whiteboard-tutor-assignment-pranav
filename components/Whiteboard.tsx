"use client";

import { useMemo, useRef, useState } from "react";
import type { BoardScene } from "@/types/lesson";

export interface BoardAnnotation {
  id: string;
  points: string;
  mode: "pen" | "highlight";
}

interface WhiteboardProps {
  scene: BoardScene;
  progress: number;
  tool: "select" | "pen" | "highlight";
  annotations: BoardAnnotation[];
  onAddAnnotation: (annotation: BoardAnnotation) => void;
  onSelectLabel: (label: string) => void;
}

const PALETTE = ["#3867e8", "#eb795d", "#35a98d", "#a276d4", "#e5a832"];

export function Whiteboard({ scene, progress, tool, annotations, onAddAnnotation, onSelectLabel }: WhiteboardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [stroke, setStroke] = useState("");
  const [draft, setDraft] = useState("");
  const nodeMap = useMemo(() => new Map(scene.nodes.map((node) => [node.id, node])), [scene.nodes]);
  const totalMarks = scene.nodes.length + scene.edges.length;
  const revealedMarks = Math.floor(progress * Math.max(1, totalMarks));
  const boardPoint = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return null;
    return `${Math.round(((event.clientX - box.left) / box.width) * 900)},${Math.round(((event.clientY - box.top) / box.height) * 520)}`;
  };

  function pointerDown(event: React.PointerEvent<SVGSVGElement>) {
    if (tool === "select") return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = boardPoint(event);
    if (!point) return;
    setStroke(point);
    setDraft(point);
  }

  function pointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!stroke || tool === "select") return;
    const point = boardPoint(event);
    if (point) setDraft((current) => `${current} ${point}`);
  }

  function pointerUp() {
    if (draft && tool !== "select") onAddAnnotation({ id: crypto.randomUUID(), points: draft, mode: tool });
    setStroke("");
    setDraft("");
  }

  return (
    <div className={`whiteboard-canvas relative overflow-hidden rounded-[26px] border border-[#e5e2da] bg-[#fffefa] shadow-[0_18px_50px_rgba(38,46,64,0.08)] ${tool === "select" ? "cursor-default" : "cursor-crosshair"}`}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.38]" style={{ backgroundImage: "radial-gradient(#d4d8df 0.7px, transparent 0.7px)", backgroundSize: "22px 22px" }} />
      <svg
        ref={svgRef}
        id="tutor-whiteboard-svg"
        viewBox="0 0 900 520"
        role="img"
        aria-label={`Interactive whiteboard: ${scene.title}`}
        className="relative z-10 block aspect-[1.72/1] w-full touch-none"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
      >
        <defs>
          <marker id="arrowhead" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="#98a0ad" />
          </marker>
        </defs>
        <text x="48" y="50" fill="#8b91a0" fontSize="12" fontFamily="ui-sans-serif, system-ui" letterSpacing="2.5">SKETCH TOGETHER</text>
        <text x="48" y="88" fill="#222a3a" fontSize="23" fontWeight="650" fontFamily="ui-sans-serif, system-ui">{scene.title}</text>
        {scene.edges.map((edge, index) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          const visible = scene.nodes.length + index < revealedMarks;
          if (!from || !to) return null;
          const x1 = (from.x / 100) * 900;
          const y1 = (from.y / 100) * 520;
          const x2 = (to.x / 100) * 900;
          const y2 = (to.y / 100) * 520;
          return (
            <g key={`${edge.from}-${edge.to}-${index}`} opacity={visible ? 1 : 0} className={visible ? "board-draw-in" : ""}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#aab1bb" strokeWidth="2.5" markerEnd="url(#arrowhead)" />
              {edge.label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10} textAnchor="middle" fill="#737d8b" fontSize="13" fontFamily="ui-sans-serif, system-ui">{edge.label}</text>}
            </g>
          );
        })}
        {scene.nodes.map((node, index) => {
          const visible = index < revealedMarks;
          const cx = (node.x / 100) * 900;
          const cy = (node.y / 100) * 520;
          const color = PALETTE[index % PALETTE.length];
          return (
            <g
              key={node.id}
              opacity={visible ? 1 : 0}
              className={visible ? "board-draw-in" : ""}
              onClick={() => tool === "select" && visible && onSelectLabel(`${node.label}${node.detail ? ` — ${node.detail}` : ""}`)}
              onKeyDown={(event) => { if (tool === "select" && (event.key === "Enter" || event.key === " ")) onSelectLabel(`${node.label}${node.detail ? ` — ${node.detail}` : ""}`); }}
              role={tool === "select" ? "button" : undefined}
              tabIndex={tool === "select" && visible ? 0 : -1}
              aria-label={`Ask about ${node.label}`}
              style={{ cursor: tool === "select" ? "pointer" : "inherit" }}
            >
              {node.shape === "circle" ? (
                <>
                  <circle cx={cx} cy={cy} r="72" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="2.5" />
                  <text x={cx} y={cy - 4} textAnchor="middle" fill="#273142" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui">{node.label.slice(0, 20)}</text>
                  <text x={cx} y={cy + 20} textAnchor="middle" fill="#697384" fontSize="12" fontFamily="ui-sans-serif, system-ui">{node.detail.slice(0, 24)}</text>
                </>
              ) : (
                <>
                  <rect x={cx - 82} y={cy - 43} width="164" height="86" rx="18" fill="#fff" stroke={color} strokeOpacity="0.72" strokeWidth="2.4" />
                  <rect x={cx - 82} y={cy - 43} width="7" height="86" rx="4" fill={color} />
                  <text x={cx - 62} y={cy - 7} fill="#273142" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui">{node.label.slice(0, 20)}</text>
                  <text x={cx - 62} y={cy + 18} fill="#697384" fontSize="12" fontFamily="ui-sans-serif, system-ui">{node.detail.slice(0, 23)}</text>
                </>
              )}
            </g>
          );
        })}
        {[...annotations, ...(draft ? [{ id: "draft", points: draft, mode: tool as "pen" | "highlight" }] : [])].map((annotation) => (
          <polyline
            key={annotation.id}
            points={annotation.points.split(" ").map((pair) => pair.replace(",", ",")).join(" ")}
            fill="none"
            stroke={annotation.mode === "highlight" ? "#f3c24d" : "#3867e8"}
            strokeWidth={annotation.mode === "highlight" ? 18 : 4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={annotation.mode === "highlight" ? 0.27 : 0.82}
          />
        ))}
        <text x="852" y="492" textAnchor="end" fill="#a7aab1" fontSize="11" fontFamily="ui-sans-serif, system-ui">BRAYNIX • WHITEBOARD</text>
      </svg>
      {tool === "select" && <p className="absolute bottom-3 left-4 z-20 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm">Select a drawing to ask your tutor about it</p>}
    </div>
  );
}
