"use client";

import { useEffect, useRef, useState } from "react";

export default function Background() {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const animationRef = useRef(0);

  // Initialize stars and canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const { width, height } = canvas.getBoundingClientRect();

        canvas.width = width;
        canvas.height = height;

        setDimensions({ width, height });

        // Recreate stars when resizing
        createStars(width, height);
      }
    };

    // Create initial stars
    const createStars = (width, height) => {
      const stars = [];
      const starColors = [
        "#ffffff",
        "#fffaf0",
        "#f0f8ff",
        "#e6e6fa",
        "#ffe4e1",
      ];

      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          speed: Math.random() * 0.05 + 0.02,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() * 0.01 + 0.005,
        });
      }

      starsRef.current = stars;

      // Initialize shooting stars
      const shootingStars = [];
      for (let i = 0; i < 5; i++) {
        shootingStars.push({
          x: Math.random() * width,
          y: (Math.random() * height) / 2,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 5 + 10,
          opacity: 0,
          active: false,
        });
      }

      shootingStarsRef.current = shootingStars;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    let lastShootingStarTime = Date.now();

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update and draw stars
      starsRef.current.forEach((star) => {
        // Move stars upward
        star.y -= star.speed;

        // Reset position if star moves off screen
        if (star.y < -10) {
          star.y = height + 10;
          star.x = Math.random() * width;
        }

        // Twinkle effect
        star.opacity = 0.5 + Math.sin(Date.now() * star.twinkleSpeed) * 0.5;

        // Mouse interaction - stars near mouse move faster
        const dx = mousePosition.x - star.x;
        const dy = mousePosition.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          star.x -= Math.cos(angle) * (1 - distance / 100) * 2;
          star.y -= Math.sin(angle) * (1 - distance / 100) * 2;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.fill();
      });

      // Handle shooting stars
      const currentTime = Date.now();
      if (currentTime - lastShootingStarTime > 2000) {
        const inactiveStar = shootingStarsRef.current.find(
          (star) => !star.active
        );
        if (inactiveStar) {
          inactiveStar.active = true;
          inactiveStar.x = Math.random() * width;
          inactiveStar.y = Math.random() * (height / 3);
          inactiveStar.opacity = 1;
          lastShootingStarTime = currentTime;
        }
      }

      // Update and draw shooting stars
      shootingStarsRef.current.forEach((star) => {
        if (!star.active) return;

        star.x += star.speed;
        star.y += star.speed;
        star.opacity -= 0.01;

        if (star.opacity <= 0 || star.x > width || star.y > height) {
          star.active = false;
          return;
        }

        // Draw shooting star
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.length, star.y - star.length);
        ctx.strokeStyle = "rgba(255, 255, 255, " + star.opacity + ")";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, mousePosition]);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-black  "
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
