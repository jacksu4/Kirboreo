'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars, Float } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function ParticleSphere(props: any) {
    const ref = useRef<THREE.Points>(null!);
    const [sphere] = useState(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 1.5;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#00F0FF"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

function ConnectionLines() {
    return (
        <mesh>
            <sphereGeometry args={[1.45, 16, 16]} />
            <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.05} />
        </mesh>
    )
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 z-[-1] bg-[#000205]">
            <Canvas camera={{ position: [0, 0, 3] }}>
                <fog attach="fog" args={['#000205', 1.5, 5]} />
                <ambientLight intensity={0.5} />
                <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
                    <ParticleSphere />
                    <ConnectionLines />
                </Float>
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
            {/* CSS Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#000205] via-transparent to-[#000205] opacity-80 pointer-events-none"></div>
        </div>
    );
}
