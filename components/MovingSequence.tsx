"use client";

import { useScroll, useTransform, useSpring, motion, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FRAME_COUNT = 120;
const IMAGE_PATH_PREFIX = "/sequence/frame_";
const IMAGE_EXTENSION = ".svg";

// Beat configuration
const BEATS = [
    {
        start: 0,
        end: 0.2,
        align: "center",
        title: "ZÜRICH IN MOTION.",
        subtitle: "White-glove relocation for the city’s finest interiors.",
    },
    {
        start: 0.25,
        end: 0.45,
        align: "left",
        title: "SWISS CARE.",
        subtitle: "Every crystal, every canvas. Handled with surgical precision.",
    },
    {
        start: 0.5,
        end: 0.7,
        align: "right",
        title: "BEYOND BORDERS.",
        subtitle: "From Enge to the Goldcoast. Seamless logistics.",
    },
    {
        start: 0.75,
        end: 0.95,
        align: "center",
        title: "WELCOME HOME.",
        subtitle: "Arrive in style.",
        cta: "Book Your Move",
    },
];

export default function MovingSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Scroll hooks
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = [];

        const loadImages = async () => {
            for (let i = 0; i < FRAME_COUNT; i++) {
                const img = new Image();
                img.src = `${IMAGE_PATH_PREFIX}${i}${IMAGE_EXTENSION}`;
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        loadedCount++;
                        setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve(true);
                    };
                    img.onerror = () => {
                        // If image missing, resolve anyway to avoid blocking
                        console.warn(`Failed to load frame ${i}`);
                        resolve(true);
                    }
                });
                loadedImages.push(img);
            }
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    // Canvas drawing
    useMotionValueEvent(smoothProgress, "change", (latest) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const frameIndex = Math.min(
            Math.floor(latest * (FRAME_COUNT - 1)),
            FRAME_COUNT - 1
        );

        const currentImage = images[frameIndex];
        if (!currentImage) return;

        // Responsive scaling (contain)
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = currentImage.width;
        const ih = currentImage.height;

        const scale = Math.min(cw / iw, ch / ih);
        const x = (cw - iw * scale) / 2;
        const y = (ch - ih * scale) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(currentImage, x, y, iw * scale, ih * scale);
    });

    // Resize handler
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                // Set canvas to actual display size to avoid blurriness
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Trigger a redraw by forcing a small update? 
                // Or just wait for next scroll event. Ideally we redraw here.
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div ref={containerRef} className="relative h-[500vh] bg-background">
            {/* Loading Screen */}
            {!isLoaded && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-primary">
                    <div className="mb-4 text-2xl font-medium tracking-tight">
                        Loading Swiss Precision...
                    </div>
                    <div className="h-1 w-64 overflow-hidden bg-primary/20">
                        <div
                            className="h-full bg-accent transition-all duration-100 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Sticky Canvas */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 h-full w-full object-contain"
                />

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm text-primary/60"
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                >
                    Scroll to Explore
                </motion.div>
            </div>

            {/* Text Overlays - Positioned absolutely over the sticky container based on scroll */}
            <div className="pointer-events-none fixed inset-0 flex flex-col justify-center">
                {BEATS.map((beat, index) => (
                    <BeatOverlay key={index} beat={beat} progress={scrollYProgress} />
                ))}
            </div>
        </div>
    );
}

function BeatOverlay({ beat, progress }: { beat: any; progress: any }) {
    const opacity = useTransform(
        progress,
        [Math.max(0, beat.start - 0.05), beat.start + 0.05, beat.end - 0.05, beat.end],
        [beat.start === 0 ? 1 : 0, 1, 1, 0]
    );

    const y = useTransform(
        progress,
        [beat.start, beat.start + 0.1, beat.end - 0.1, beat.end],
        [20, 0, 0, -20]
    );

    return (
        <motion.div
            style={{ opacity, y, display: useTransform(opacity, (val) => (val > 0.01 ? "flex" : "none")) }}
            className={cn(
                "absolute w-full px-6 md:px-20",
                beat.align === "center" && "items-center text-center",
                beat.align === "left" && "items-start text-left",
                beat.align === "right" && "items-end text-end"
            )}
        >
            <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-primary">
                    {beat.title}
                </h2>
                <p className="text-xl md:text-2xl text-primary/80 font-light tracking-wide max-w-xl">
                    {beat.subtitle}
                </p>

                {beat.cta && (
                    <button className="mt-8 bg-accent text-white px-8 py-4 rounded-none text-lg tracking-widest hover:bg-red-600 transition-colors pointer-events-auto">
                        {beat.cta}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
