import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3D, Eye, Sparkles } from 'lucide-react';

// ============================================================================
// HELPER: Rounded rectangle helper for 2D Canvas
// ============================================================================
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ============================================================================
// PROCEDURAL ULTRA-LUXURY TEXTURES FOR 3D TITANIUM CARD
// ============================================================================
function createCardFrontTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1290;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Base Ultra-Dark Obsidian Titanium Body
  const baseGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  baseGrad.addColorStop(0, '#0d0e11');
  baseGrad.addColorStop(0.35, '#15161b');
  baseGrad.addColorStop(0.7, '#0a0b0d');
  baseGrad.addColorStop(1, '#181a20');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Machine-Milled Brushed Titanium Grain (Micro-fine horizontal lines)
  ctx.save();
  for (let y = 0; y < canvas.height; y += 3) {
    const alpha = 0.015 + ((y * 17) % 25) * 0.001;
    ctx.strokeStyle = y % 6 === 0 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha * 1.5})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Subtle Anisotropic Specular Light Streak (Champagne & Violet Sheen)
  const sheenGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
  sheenGrad.addColorStop(0.42, 'rgba(255, 255, 255, 0.02)');
  sheenGrad.addColorStop(0.5, 'rgba(207, 156, 205, 0.12)'); // Subtle brand lavender reflection
  sheenGrad.addColorStop(0.58, 'rgba(255, 235, 254, 0.04)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
  ctx.fillStyle = sheenGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 4. Subtle Swiss Luxury Guilloche Geometric Arcs (Right side security texture)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.032)';
  ctx.lineWidth = 1.5;
  for (let r = 240; r <= 860; r += 42) {
    ctx.beginPath();
    ctx.arc(1950, 680, r, Math.PI * 0.78, Math.PI * 1.42);
    ctx.stroke();
  }
  ctx.restore();

  // 5. Precision Laser-Etched Outer Chamfer Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 40, 40, canvas.width - 80, canvas.height - 80, 40);
  ctx.stroke();

  // 6. Brand Emblem: Silver Foil Minimalist Shield + "eBanking"
  ctx.save();
  ctx.translate(120, 135);
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(32, 0);
  ctx.lineTo(64, 16);
  ctx.lineTo(64, 48);
  ctx.quadraticCurveTo(64, 80, 32, 96);
  ctx.quadraticCurveTo(0, 80, 0, 48);
  ctx.lineTo(0, 16);
  ctx.closePath();
  ctx.fill();

  // Inner dark cut of shield
  ctx.fillStyle = '#0e0f12';
  ctx.beginPath();
  ctx.moveTo(32, 13);
  ctx.lineTo(51, 23);
  ctx.lineTo(51, 46);
  ctx.quadraticCurveTo(51, 68, 32, 81);
  ctx.quadraticCurveTo(13, 68, 13, 46);
  ctx.lineTo(13, 23);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Brand Name in Clean Bold Modern Typography
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 86px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
  ctx.fillText('eBanking', 215, 215);

  // Laser-Etched Subline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '700 24px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('INFINITE BLACK TITANIUM', 125, 275);
  ctx.letterSpacing = '0px';

  // 7. Contactless Waves (Top Right)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  [45, 75, 105].forEach((r) => {
    ctx.beginPath();
    ctx.arc(1580, 195, r, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();
  });

  // 8. Sleek Minimalist "VISA INFINITE" (Top Right)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 italic 86px sans-serif';
  ctx.fillText('VISA', 1740, 215);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '700 20px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('INFINITE', 1748, 250);

  // 9. Photorealistic Precision EMV Smart Chip
  // Recessed chip bezel
  ctx.fillStyle = '#060608';
  drawRoundedRect(ctx, 136, 426, 318, 248, 32);
  ctx.fill();

  // Polished gold and champagne gradient surface
  const chipGrad = ctx.createLinearGradient(140, 430, 450, 670);
  chipGrad.addColorStop(0, '#FFE8B0');
  chipGrad.addColorStop(0.25, '#F5D38A');
  chipGrad.addColorStop(0.65, '#D4AF37');
  chipGrad.addColorStop(1, '#997312');
  ctx.fillStyle = chipGrad;
  drawRoundedRect(ctx, 140, 430, 310, 240, 30);
  ctx.fill();

  // Smart chip contact division channels
  ctx.strokeStyle = '#18150c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  // Center contact pod
  drawRoundedRect(ctx, 235, 485, 120, 130, 16);
  ctx.stroke();
  // Cross channels
  ctx.moveTo(140, 520); ctx.lineTo(235, 520);
  ctx.moveTo(140, 580); ctx.lineTo(235, 580);
  ctx.moveTo(355, 520); ctx.lineTo(450, 520);
  ctx.moveTo(355, 580); ctx.lineTo(450, 580);
  ctx.moveTo(295, 430); ctx.lineTo(295, 485);
  ctx.moveTo(295, 615); ctx.lineTo(295, 670);
  ctx.stroke();

  // 10. Laser-Engraved Card Number (High-Definition Spaced Font)
  const cardNum = '4520   8819   2034   9981';
  // Subtle engraved drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.font = '800 76px "Plus Jakarta Sans", monospace';
  ctx.fillText(cardNum, 122, 852);
  // Crisp metallic silver relief
  ctx.fillStyle = '#F4F4F5';
  ctx.fillText(cardNum, 120, 850);

  // 11. Cardholder Details & Expiry
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '700 24px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('VALID THRU', 120, 960);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 42px "Plus Jakarta Sans", monospace';
  ctx.fillText('10/30', 290, 963);

  // Cardholder Name
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.font = '800 58px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('ALEXANDER VANCE', 122, 1082);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('ALEXANDER VANCE', 120, 1080);

  // 12. Laser-Etched Material Specification (Bottom Right)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 1600, 1025, 300, 68, 20);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '700 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TITANIUM • 18.5G', 1750, 1068);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

function createCardBackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1290;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Dark Brushed Obsidian Base
  const baseGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  baseGrad.addColorStop(0, '#0d0e11');
  baseGrad.addColorStop(0.5, '#14151a');
  baseGrad.addColorStop(1, '#0b0c0e');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Brushed grain
  ctx.save();
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 2. High-Tech Jet Black Magnetic Stripe
  const magGrad = ctx.createLinearGradient(0, 160, 0, 420);
  magGrad.addColorStop(0, '#050506');
  magGrad.addColorStop(0.5, '#151518');
  magGrad.addColorStop(1, '#050506');
  ctx.fillStyle = magGrad;
  ctx.fillRect(0, 160, canvas.width, 260);

  // 3. Security Signature Panel
  ctx.fillStyle = '#E4E4E7';
  ctx.fillRect(100, 520, 1380, 160);

  // Guilloche diagonal security lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 1380; i += 28) {
    ctx.beginPath();
    ctx.moveTo(100 + i, 520);
    ctx.lineTo(100 + i + 35, 680);
    ctx.stroke();
  }

  // 4. CVV Box
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(1480, 520, 260, 160);
  ctx.fillStyle = '#0f1013';
  ctx.font = 'bold 54px "Courier New", monospace';
  ctx.fillText('890', 1550, 620);

  // 5. Holographic Silver Security Seal
  const holoGrad = ctx.createLinearGradient(100, 750, 500, 850);
  holoGrad.addColorStop(0, 'rgba(207, 156, 205, 0.8)');
  holoGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
  holoGrad.addColorStop(1, 'rgba(144, 103, 167, 0.8)');
  ctx.fillStyle = holoGrad;
  drawRoundedRect(ctx, 100, 750, 360, 90, 14);
  ctx.fill();

  ctx.fillStyle = '#0E0F12';
  ctx.font = '800 26px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('VERIFIED AUTHENTIC', 135, 805);

  // 6. Laser-Engraved Concierge Disclosures
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '24px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('24/7 Global Private Concierge: +1 (800) 555-0199  •  concierge@ebanking.com', 100, 960);
  ctx.fillText('Issued by eBanking Global Services Ltd. pursuant to license by Visa International.', 100, 1010);
  ctx.fillText('Solid Grade 5 Aerospace Titanium. Not transferable. Card ID: 0089/2500.', 100, 1060);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

// ============================================================================
// MAIN REAL 3D TITANIUM CARD (Three.js WebGL)
// ============================================================================
export default function FloatingReal3DCard() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  // Dynamic rotation target for smooth mouse tilt & 360 drag
  const targetRotationRef = useRef({ x: 0.12, y: -0.32 });
  const currentRotationRef = useRef({ x: 0.12, y: -0.32 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. High-End Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xf5f3ff, 1.1);
    scene.add(ambientLight);

    // Main key directional light (Crisp platinum highlight along beveled edge)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(6, 7, 7);
    scene.add(keyLight);

    // Soft violet/lavender rim light from bottom left (Matches brand theme)
    const rimLight = new THREE.DirectionalLight(0x9067a7, 2.2);
    rimLight.position.set(-6, -5, 4);
    scene.add(rimLight);

    // Subtle warm champagne back light
    const backRim = new THREE.DirectionalLight(0xffecd2, 1.4);
    backRim.position.set(0, 5, -6);
    scene.add(backRim);

    // Interactive Specular Spotlight (Tracks cursor glint)
    const cursorLight = new THREE.PointLight(0xffffff, 2.2, 14);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // 3. Card Parent Pivot Group
    const cardPivot = new THREE.Group();
    scene.add(cardPivot);

    // Precise Aerospace Card Geometry
    const cardWidth = 3.375;
    const cardHeight = 2.125;
    const radius = 0.14;
    const cardShape = new THREE.Shape();
    const x = -cardWidth / 2;
    const y = -cardHeight / 2;

    cardShape.moveTo(x + radius, y);
    cardShape.lineTo(x + cardWidth - radius, y);
    cardShape.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + radius);
    cardShape.lineTo(x + cardWidth, y + cardHeight - radius);
    cardShape.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - radius, y + cardHeight);
    cardShape.lineTo(x + radius, y + cardHeight);
    cardShape.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - radius);
    cardShape.lineTo(x, y + radius);
    cardShape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      depth: 0.042,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.016,
      bevelThickness: 0.016,
    };
    const cardGeometry = new THREE.ExtrudeGeometry(cardShape, extrudeSettings);
    cardGeometry.center();

    // Mirror-Polished Chamfered Titanium Side Material
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8d8dc,
      metalness: 0.96,
      roughness: 0.14,
    });

    const cardBodyMesh = new THREE.Mesh(cardGeometry, sideMaterial);
    cardPivot.add(cardBodyMesh);

    // Front Face Plane with Canvas Texture
    const frontTexture = createCardFrontTexture();
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.18,
      metalness: 0.85,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
    });
    const frontPlaneGeom = new THREE.PlaneGeometry(cardWidth + 0.02, cardHeight + 0.02);
    const frontPlaneMesh = new THREE.Mesh(frontPlaneGeom, frontMaterial);
    frontPlaneMesh.position.z = 0.038;
    cardPivot.add(frontPlaneMesh);

    // Back Face Plane with Canvas Texture
    const backTexture = createCardBackTexture();
    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.22,
      metalness: 0.82,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
    const backPlaneGeom = new THREE.PlaneGeometry(cardWidth + 0.02, cardHeight + 0.02);
    const backPlaneMesh = new THREE.Mesh(backPlaneGeom, backMaterial);
    backPlaneMesh.position.z = -0.038;
    backPlaneMesh.rotation.y = Math.PI;
    cardPivot.add(backPlaneMesh);

    // 4. Luxury Ambient Floating Micro-Particles (Soft silver & violet stardust)
    const particleCount = 42;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 7.0;
      particlePositions[idx + 1] = (Math.random() - 0.5) * 5.0;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 3.5;

      // Lavender or silver tint
      if (i % 2 === 0) {
        particleColors[idx] = 0.85;     // R
        particleColors[idx + 1] = 0.75; // G
        particleColors[idx + 2] = 0.95; // B
      } else {
        particleColors[idx] = 0.95;
        particleColors[idx + 1] = 0.95;
        particleColors[idx + 2] = 0.98;
      }
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // 5. Ground Soft Ambient Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(256, 256, 15, 256, 256, 240);
      sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      sGrad.addColorStop(0.4, 'rgba(144, 103, 167, 0.08)');
      sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 512, 512);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.8, 3.8),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.15;
    scene.add(shadowPlane);

    // Initial orientation
    cardPivot.rotation.x = currentRotationRef.current.x;
    cardPivot.rotation.y = currentRotationRef.current.y;

    // 6. Interactive Mouse Tilt & Free 360° Drag
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      // Update glint light position
      cursorLight.position.x = nx * 5.5;
      cursorLight.position.y = -ny * 5.5;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.012;
        targetRotationRef.current.x += deltaY * 0.012;

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      } else {
        // Subtle natural perspective tilt
        targetRotationRef.current.x = ny * 0.45 + 0.12;
        targetRotationRef.current.y = nx * 0.65 - 0.32;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsInteracting(true);
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsInteracting(false);
    };

    // Touch support for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousMousePositionRef.current.x;
        const deltaY = touch.clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.012;
        targetRotationRef.current.x += deltaY * 0.012;

        previousMousePositionRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        setIsInteracting(true);
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      setIsInteracting(false);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    // 7. Main 60 FPS Physics & Levitation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp rotation toward target
      const lerpFactor = isDraggingRef.current ? 0.25 : 0.055;
      currentRotationRef.current.x = THREE.MathUtils.lerp(
        currentRotationRef.current.x,
        targetRotationRef.current.x,
        lerpFactor
      );
      currentRotationRef.current.y = THREE.MathUtils.lerp(
        currentRotationRef.current.y,
        targetRotationRef.current.y,
        lerpFactor
      );

      cardPivot.rotation.x = currentRotationRef.current.x;
      cardPivot.rotation.y = currentRotationRef.current.y;

      // Realistic levitation physics (sinusoidal float)
      const floatOffsetY = Math.sin(elapsedTime * 1.5) * 0.1;
      cardPivot.position.y = floatOffsetY;
      cardPivot.rotation.z = Math.sin(elapsedTime * 0.7) * 0.018;

      // Soft shadow breathing
      shadowPlane.scale.setScalar(1 - floatOffsetY * 0.5);

      // Ambient particle slow orbital drift
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      cardGeometry.dispose();
      sideMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      frontTexture.dispose();
      backTexture.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      shadowTexture.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleFlipCard = () => {
    setHasFlipped((prev) => {
      const next = !prev;
      targetRotationRef.current.y = next ? Math.PI - 0.32 : -0.32;
      return next;
    });
  };

  const handleResetCard = () => {
    targetRotationRef.current = { x: 0.12, y: -0.32 };
    setHasFlipped(false);
  };

  return (
    <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300 ${
          isInteracting ? 'scale-[1.02]' : ''
        }`}
      />

      {/* Floating Dark Glass Controls */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
        <button
          onClick={handleFlipCard}
          title="Flip card in 3D"
          className="rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-[#0E1013]/85 hover:bg-[#1A1C22] backdrop-blur-xl border border-white/15 shadow-xl transition-all active:scale-95"
        >
          <Rotate3D size={13} className="text-[#CF9CCD]" />
          <span>{hasFlipped ? 'Front View' : 'Flip 3D'}</span>
        </button>

        <button
          onClick={handleResetCard}
          title="Reset 3D position"
          className="rounded-full p-2 text-white/80 hover:text-white bg-[#0E1013]/85 hover:bg-[#1A1C22] backdrop-blur-xl border border-white/15 shadow-xl transition-all active:scale-95"
        >
          <Eye size={13} />
        </button>
      </div>

      {/* WebGL Telemetry Pill */}
      <div className="absolute bottom-3 left-3 pointer-events-none z-20">
        <div className="rounded-full px-3.5 py-1.5 flex items-center gap-2 bg-[#0E1013]/80 backdrop-blur-xl border border-white/15 shadow-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-white/90 tracking-wide">
            360° Drag to Inspect • Solid Titanium
          </span>
        </div>
      </div>

      {/* Titanium Grade Pill */}
      <div className="absolute bottom-3 right-3 pointer-events-none z-20">
        <div className="rounded-full px-3.5 py-1.5 flex items-center gap-1.5 bg-[#0E1013]/80 backdrop-blur-xl border border-white/15 shadow-xl">
          <Sparkles size={12} className="text-[#CF9CCD]" />
          <span className="text-[11px] font-semibold text-white/90 tracking-wide">
            Grade 5 Aerospace Alloy
          </span>
        </div>
      </div>
    </div>
  );
}
