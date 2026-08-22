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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    const earthTexture = new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
    );
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 48),
      new THREE.MeshStandardMaterial({
        map: earthTexture,
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.72,
      }),
    );
    scene.add(globe);

    const light = new THREE.DirectionalLight(0xffffff, 1.4);
    light.position.set(2, 1.4, 2);
    scene.add(light, new THREE.AmbientLight(0xf8f1e6, 0.95));

    const markers = new THREE.Group();
    const locations = [[28.61, 77.21], [19.08, 72.88], [23.02, 72.57], [15.3, 74.12], [-33.87, 151.21], [-37.81, 144.96], [-27.47, 153.03], [51.51, -0.13], [40.71, -74.01], [35.68, 139.65]];
    const toVector = (lat: number, lng: number) => {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lng + 180);
      return new THREE.Vector3(-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
    };
    locations.forEach(([lat, lng]) => {
      const normal = toVector(lat, lng);
      const pin = new THREE.Group();
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), new THREE.MeshStandardMaterial({ color: 0xc34232, emissive: 0x58140e, emissiveIntensity: 0.45 }));
      head.position.y = 0.1;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8), new THREE.MeshBasicMaterial({ color: 0xc34232 }));
      stem.position.y = 0.04;
      pin.add(stem, head);
      pin.position.copy(normal);
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      markers.add(pin);
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
      markers.rotation.y += 0.003;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      earthTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={`globe ${className}`} aria-hidden="true">
      <canvas ref={ref} className="globe-canvas" />
    </div>
  );
}
