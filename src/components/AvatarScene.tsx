"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Component, Suspense, type ReactNode } from "react";
import { Avatar } from "./Avatar";
import { Loader2 } from "lucide-react";

interface AvatarMessage {
  audio: HTMLAudioElement;
  lipSync: { mouthCues: { start: number; end: number; value: string }[] };
}

function AvatarFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#e8f1ed] text-teal-700">
      <Loader2 className="w-8 h-8 animate-spin mb-2 text-teal-600" />
      <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">Loading 3D Doctor...</span>
    </div>
  );
}

class AvatarErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("3D avatar failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#e8f1ed] px-6 text-center text-gray-600">
          <span className="text-sm font-semibold">3D assistant unavailable</span>
          <span className="mt-1 text-xs">You can continue with text or voice triage.</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export function AvatarScene({
  isTalking,
  currentMessage,
}: {
  isTalking: boolean;
  currentMessage?: AvatarMessage | null;
}) {
  return (
    <div className="w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden relative border border-gray-200/80 bg-[#eef2f0] shadow-inner">
      <AvatarErrorBoundary>
        <Suspense fallback={<AvatarFallback />}>
          <Canvas camera={{ position: [0, 1.4, 2.0], fov: 30 }} gl={{ alpha: true }}>
            <color attach="background" args={["#eef2f0"]} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.1} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#187c73" />
            <group position={[0, -0.5, 0]} scale={1.15}>
              <Avatar isTalking={isTalking} currentMessage={currentMessage} />
            </group>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
              target={[0, 1.2, 0]}
            />
          </Canvas>
        </Suspense>
      </AvatarErrorBoundary>
    </div>
  );
}
