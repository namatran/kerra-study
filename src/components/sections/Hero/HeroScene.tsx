"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Pushes each vertex of a sphere in or out with a few layered sine waves, so the surface
// slowly wobbles like a soft blob. Normals are rebuilt from two nearby points, so the
// glossy reflections follow the new shape.
const BLOB_GLSL = /* glsl */ `
uniform float uTime;

float blobField(vec3 p, float t) {
  return 0.55 * sin(p.x * 2.1 + t * 0.9) * sin(p.y * 1.7 + t * 0.7) * sin(p.z * 2.3 + t * 0.8)
       + 0.30 * sin(p.x * 3.7 + p.z * 1.3 - t * 0.6) * sin(p.y * 3.1 + t * 0.5)
       + 0.15 * sin(p.z * 5.3 + p.x * 2.0 + t * 1.1);
}

vec3 blobDisplace(vec3 p) {
  vec3 n = normalize(p);
  return n * (1.0 + 0.22 * blobField(n, uTime));
}
`;

const BLOB_NORMAL_GLSL = /* glsl */ `
vec3 blobN = normalize(position);
vec3 blobT = normalize(cross(blobN, abs(blobN.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
vec3 blobB = normalize(cross(blobN, blobT));
vec3 blobPosition = blobDisplace(position);
vec3 blobP1 = blobDisplace(position + blobT * 0.01);
vec3 blobP2 = blobDisplace(position + blobB * 0.01);
vec3 objectNormal = normalize(cross(blobP1 - blobPosition, blobP2 - blobPosition));
`;

/**
 * The hero's 3D placeholder: a glossy grey blob that spins slowly and leans toward the
 * cursor. Three.js loads only in the browser; until it's ready (or if WebGL is missing)
 * the CSS gradient underneath stays visible.
 */
export function HeroScene({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let teardown = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // no WebGL: keep the gradient placeholder
      }
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = environment;

      const light = new THREE.DirectionalLight(0xffffff, 1.2);
      light.position.set(3, 4, 5);
      scene.add(light);

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0, 6);

      const geometry = new THREE.IcosahedronGeometry(1, 48);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xc6c6c6,
        roughness: 0.16,
        metalness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });
      const time = { value: 0 };
      material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = time;
        shader.vertexShader = shader.vertexShader
          .replace("#include <common>", `#include <common>\n${BLOB_GLSL}`)
          .replace("#include <beginnormal_vertex>", BLOB_NORMAL_GLSL)
          .replace("#include <begin_vertex>", "vec3 transformed = blobPosition;");
      };
      const blob = new THREE.Mesh(geometry, material);
      scene.add(blob);

      // Upper right on wide screens, centred higher up on tall ones.
      const home = { x: 0.75, y: 0.32, scale: 0.88 };
      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const portrait = camera.aspect < 1;
        home.x = portrait ? 0.15 : 0.75;
        home.y = portrait ? 0.55 : 0.32;
        home.scale = portrait ? 0.68 : 0.88;
        blob.scale.setScalar(home.scale);
        blob.position.set(home.x, home.y, 0);
      };
      resize();

      const pointer = { x: 0, y: 0 };
      const lean = { x: 0, y: 0 };
      const onPointerMove = (event: PointerEvent) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      };

      const clock = new THREE.Clock();
      let spin = 0;
      let raf = 0;
      const render = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        time.value += dt;
        spin += dt * 0.18; // about 10 degrees a second
        // ease toward the cursor: turn and drift a little in its direction
        lean.x += (pointer.x - lean.x) * Math.min(1, dt * 3);
        lean.y += (pointer.y - lean.y) * Math.min(1, dt * 3);
        blob.rotation.set(lean.y * 0.35, spin + lean.x * 0.5, 0);
        blob.position.set(home.x + lean.x * 0.18, home.y - lean.y * 0.12, 0);
        renderer.render(scene, camera);
      };
      const loop = () => {
        render();
        raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (!raf) {
          clock.getDelta();
          raf = requestAnimationFrame(loop);
        }
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };

      const resizeObserver = new ResizeObserver(() => {
        resize();
        if (!raf) render();
      });
      resizeObserver.observe(host);

      let viewObserver: IntersectionObserver | undefined;
      if (reducedMotion) {
        render(); // a single still frame
      } else {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        viewObserver = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
        viewObserver.observe(host);
      }
      host.dataset.ready = "true";

      teardown = () => {
        stop();
        resizeObserver.disconnect();
        viewObserver?.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        geometry.dispose();
        material.dispose();
        environment.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        delete host.dataset.ready;
      };
    })();

    return () => {
      disposed = true;
      teardown();
    };
  }, [reducedMotion]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
