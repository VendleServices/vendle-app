"use client";
import { ReactNode, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// Vertex shader (simple passthrough)
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader (FBM noise for smoke)
const fragmentShader = `
varying vec2 vUv;
uniform float uTime;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Noise
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// Fractal Brownian Motion
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.;
    for (int i = 0; i < 6; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = vUv * 3.0;
    float t = uTime * 0.05;
    float n = fbm(st + vec2(t, t));
    float smoke = smoothstep(0.4, 0.7, n);
    gl_FragColor = vec4(vec3(smoke), 1.0);
}
`;

function SmokeMaterial() {
  const materialRef = useRef<any>();
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function AnimatedLoginBackground({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, width: "100vw", height: "100vh", pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <SmokeMaterial />
      </Canvas>
      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-md px-8 py-10 rounded-2xl bg-black/60 backdrop-blur-md shadow-2xl border border-gray-700">
          <h1 className="mb-6 text-4xl font-mono font-bold tracking-widest text-white drop-shadow-lg text-center">LOGIN</h1>
          {children}
        </div>
      </div>
    </div>
  );
} 