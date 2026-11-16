"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { pointerNdc, usePointer, useReducedMotionPref, type ScenePalette } from "./shared";

type MapData = {
  center: [number, number];
  radius: number;
  attribution: string;
  major: number[][];
  minor: number[][];
};

const KM = 1 / 1000; // metres → scene units
const HEAT_M = 700; // red glow radius around home (metres)
const RING_KM = 0.6; // dashed radius ring

let cache: Promise<MapData> | null = null;
function loadMap(url: string) {
  cache ??= fetch(url).then((r) => {
    if (!r.ok) throw new Error(`map ${r.status}`);
    return r.json() as Promise<MapData>;
  });
  return cache;
}

/** Project lat/lng to metres relative to the map centre (x east, y north). */
function toLocal(center: [number, number], lat: number, lng: number) {
  const mLat = 110_574;
  const mLng = 111_320 * Math.cos((center[0] * Math.PI) / 180);
  return { x: (lng - center[1]) * mLng, y: (lat - center[0]) * mLat };
}

function buildSegments(
  lines: number[][],
  home: { x: number; y: number },
  base: THREE.Color,
  accent: THREE.Color,
) {
  const positions: number[] = [];
  const colors: number[] = [];
  const c = new THREE.Color();
  const push = (x: number, y: number) => {
    positions.push(x * KM, 0, -y * KM);
    const d = Math.hypot(x - home.x, y - home.y);
    const heat = Math.pow(Math.max(0, 1 - d / HEAT_M), 1.6);
    c.copy(base).lerp(accent, heat);
    colors.push(c.r, c.g, c.b);
  };
  for (const line of lines) {
    for (let i = 0; i + 3 < line.length; i += 2) {
      push(line[i], line[i + 1]);
      push(line[i + 2], line[i + 3]);
    }
  }
  return { positions, colors };
}

function Streets({ data, home, palette }: { data: MapData; home: { x: number; y: number }; palette: ScenePalette }) {
  const accent = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);

  const minor = useMemo(() => {
    const { positions, colors } = buildSegments(
      data.minor,
      home,
      new THREE.Color(palette.dark ? "#3a3a3a" : "#c2c2bf"),
      accent,
    );
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }, [data, home, palette.dark, accent]);
  useEffect(() => () => minor.dispose(), [minor]);

  const major = useMemo(() => {
    const { positions, colors } = buildSegments(
      data.major,
      home,
      new THREE.Color(palette.dark ? "#8f8f8f" : "#6a6a68"),
      accent,
    );
    const points: [number, number, number][] = [];
    const vertexColors: [number, number, number][] = [];
    for (let i = 0; i < positions.length; i += 3) {
      points.push([positions[i], positions[i + 1] + 0.001, positions[i + 2]]);
      vertexColors.push([colors[i], colors[i + 1], colors[i + 2]]);
    }
    return { points, vertexColors };
  }, [data, home, palette.dark, accent]);

  return (
    <group>
      <lineSegments geometry={minor}>
        <lineBasicMaterial vertexColors transparent opacity={palette.dark ? 0.9 : 1} />
      </lineSegments>
      {major.points.length > 1 ? (
        <Line points={major.points} vertexColors={major.vertexColors} segments lineWidth={1.6} color="white" />
      ) : null}
    </group>
  );
}

/** Radar pulses + dashed radius + beacon + label at home. */
function Beacon({
  position,
  palette,
  label,
  reduced,
}: {
  position: [number, number, number];
  palette: ScenePalette;
  label: string;
  reduced: boolean;
}) {
  const pulses = useRef<(THREE.Mesh | null)[]>([]);
  const circle = useMemo(
    () =>
      Array.from({ length: 97 }, (_, i) => {
        const a = (i / 96) * Math.PI * 2;
        return [Math.cos(a) * RING_KM, 0.002, Math.sin(a) * RING_KM] as [number, number, number];
      }),
    [],
  );

  useFrame((state) => {
    pulses.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = reduced ? 0.35 : ((state.clock.elapsedTime * 0.35 + i / 2) % 1);
      mesh.scale.setScalar(0.02 + t * 0.75);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - t);
    });
  });

  return (
    <group position={position}>
      {[0, 1].map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            pulses.current[i] = m;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.003, 0]}
        >
          <ringGeometry args={[0.97, 1, 96]} />
          <meshBasicMaterial color={palette.accent} transparent depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <Line points={circle} color={palette.accent} lineWidth={1} dashed dashSize={0.03} gapSize={0.025} transparent opacity={0.75} />
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[0, 0.004, 0]}>
        <planeGeometry args={[0.05, 0.05]} />
        <meshBasicMaterial color={palette.accent} side={THREE.DoubleSide} />
      </mesh>
      <Line points={[[0, 0, 0], [0, 0.42, 0]]} color={palette.accent} lineWidth={1.4} />
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.028, 0.028, 0.028]} />
        <meshBasicMaterial color={palette.accent} />
      </mesh>
      <Html position={[0, 0.5, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div className="label whitespace-nowrap border border-accent bg-canvas/85 px-2 py-1.5 text-accent backdrop-blur-sm">
          {label}
        </div>
      </Html>
    </group>
  );
}

/** Slow orbit around home with pointer parallax. */
function Rig({ target, reduced }: { target: THREE.Vector3; reduced: boolean }) {
  const ndc = useMemo(() => ({ x: 0, y: 0 }), []);
  const angles = useRef({ az: -0.6, polar: 0.98 });
  useFrame((state, delta) => {
    pointerNdc(state.gl.domElement.getBoundingClientRect(), ndc);
    const t = state.clock.elapsedTime;
    const az = -0.6 + (reduced ? 0 : t * 0.045) + ndc.x * 0.35;
    const polar = 0.98 - ndc.y * 0.12;
    angles.current.az = THREE.MathUtils.damp(angles.current.az, az, 2.5, delta);
    angles.current.polar = THREE.MathUtils.damp(angles.current.polar, polar, 2.5, delta);
    const r = 2.5;
    const { az: a, polar: p } = angles.current;
    state.camera.position.set(
      target.x + r * Math.sin(p) * Math.sin(a),
      target.y + r * Math.cos(p),
      target.z + r * Math.sin(p) * Math.cos(a),
    );
    state.camera.lookAt(target.x, target.y + 0.05, target.z);
  });
  return null;
}

export default function MapScene({
  palette,
  active,
  home,
  label,
  src = "/map/home.json",
}: {
  palette: ScenePalette;
  active: boolean;
  home: { lat: number; lng: number };
  label: string;
  src?: string;
}) {
  usePointer();
  const reduced = useReducedMotionPref();
  const [data, setData] = useState<MapData | null>(null);

  useEffect(() => {
    let alive = true;
    loadMap(src)
      .then((d) => alive && setData(d))
      .catch((e) => console.warn("[map] failed to load", e));
    return () => {
      alive = false;
    };
  }, [src]);

  // Pin = your saved coordinates, clamped to the mapped area.
  const pin = useMemo(() => {
    if (!data) return { x: 0, y: 0 };
    const p = toLocal(data.center, home.lat, home.lng);
    const limit = data.radius * 0.85;
    return Math.hypot(p.x, p.y) > limit ? { x: 0, y: 0 } : p;
  }, [data, home.lat, home.lng]);

  const target = useMemo(() => new THREE.Vector3(pin.x * KM, 0, -pin.y * KM), [pin]);

  return (
    <Canvas
      frameloop={active ? (reduced ? "demand" : "always") : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 2, 2], fov: 38, near: 0.05, far: 50 }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      {data ? (
        <>
          <Streets data={data} home={pin} palette={palette} />
          <Beacon position={[target.x, 0, target.z]} palette={palette} label={label} reduced={reduced} />
        </>
      ) : null}
      <Rig target={target} reduced={reduced} />
    </Canvas>
  );
}
