import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Globe({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.1;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0x4b4338,
        metalness: 0.2,
        roughness: 0.48,
        wireframe: true,
      }),
    );
    scene.add(globe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.08, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x8f7d63, transparent: true, opacity: 0.18 }),
    );
    scene.add(atmosphere);

    const light = new THREE.DirectionalLight(0xffffff, 1.4);
    light.position.set(2, 1.4, 2);
    scene.add(light, new THREE.AmbientLight(0xe9dfcf, 0.8));

    const markers = new THREE.Group();
    const spots = [
      [0.4, 0.7, 0.6],
      [-0.55, 0.35, 0.75],
      [0.7, -0.2, 0.65],
      [-0.2, 0.85, 0.45],
    ];
    spots.forEach(([x, y, z]) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x8f7255, emissive: 0x241b13, emissiveIntensity: 0.35 }),
      );
      m.position.set(x, y, z).normalize();
      markers.add(m);
    });
    scene.add(markers);

    const resize = () => {
      const { clientWidth, clientHeight } = containerRef.current ?? canvas;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);

    let frame = 0;
    const tick = () => {
      globe.rotation.y += 0.003;
      atmosphere.rotation.y += 0.002;
      markers.rotation.y += 0.003;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={`globe ${className}`} aria-hidden="true">
      <canvas ref={ref} className="globe-canvas" />
    </div>
  );
}
