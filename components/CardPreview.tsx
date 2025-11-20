'use client';

import { useEffect, useRef } from 'react';

export type CardTemplate = 'gradient' | 'minimal' | 'meme';

interface CardPreviewProps {
    title: string;
    explanation: string;
    template?: CardTemplate;
    onDownload?: () => void;
}

export default function CardPreview({
    title,
    explanation,
    template = 'gradient',
    onDownload
}: CardPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !explanation) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions (optimized for social media)
        canvas.width = 1200;
        canvas.height = 630;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background based on template
        if (template === 'gradient') {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#6366f1'); // Indigo-500
            gradient.addColorStop(0.5, '#8b5cf6'); // Violet-500
            gradient.addColorStop(1, '#ec4899'); // Pink-500
            ctx.fillStyle = gradient;
        } else if (template === 'minimal') {
            ctx.fillStyle = '#ffffff';
        } else if (template === 'meme') {
            ctx.fillStyle = '#000000';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add subtle texture/noise for premium feel (optional, kept simple for now)

        // Draw emoji icon at top (moved up)
        ctx.font = '100px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍎', canvas.width / 2, 80);

        // Add padding
        const padding = 60;
        const contentWidth = canvas.width - (padding * 2);

        // Draw title (moved up)
        ctx.font = 'bold 56px Inter, system-ui, -apple-system, sans-serif';
        ctx.fillStyle = template === 'minimal' ? '#111827' : '#ffffff';
        ctx.textAlign = 'center';

        // Wrap title text
        const titleWords = title.split(' ');
        let titleLine = '';
        let titleY = 180;

        titleWords.forEach((word) => {
            const testLine = titleLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > contentWidth && titleLine !== '') {
                ctx.fillText(titleLine, canvas.width / 2, titleY);
                titleLine = word + ' ';
                titleY += 64;
            } else {
                titleLine = testLine;
            }
        });
        ctx.fillText(titleLine, canvas.width / 2, titleY);

        // Draw explanation text with dynamic sizing
        let fontSize = 32;
        let lineHeight = 48;
        let startY = titleY + 80; // Reduced gap
        const bottomLimit = canvas.height - 60; // Space for watermark

        ctx.textAlign = 'left';
        ctx.fillStyle = template === 'minimal' ? '#374151' : 'rgba(255, 255, 255, 0.95)';

        // Function to wrap text and check if it fits
        const wrapAndCheckFit = (size: number, lHeight: number) => {
            ctx.font = `500 ${size}px Inter, system-ui, -apple-system, sans-serif`;
            const words = explanation.split(' ');
            let line = '';
            let y = startY;
            let lineCount = 0;
            const lines = [];

            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const metrics = ctx.measureText(testLine);

                if (metrics.width > contentWidth && line !== '') {
                    lines.push({ text: line, y });
                    line = words[i] + ' ';
                    y += lHeight;
                    lineCount++;
                } else {
                    line = testLine;
                }
            }
            lines.push({ text: line, y });

            return { fits: y < bottomLimit, lines, finalY: y };
        };

        // Try to fit text by reducing font size
        let layout = wrapAndCheckFit(fontSize, lineHeight);
        while (!layout.fits && fontSize > 20) {
            fontSize -= 2;
            lineHeight -= 3;
            layout = wrapAndCheckFit(fontSize, lineHeight);
        }

        // Draw the text
        layout.lines.forEach(line => {
            // Check if we need to truncate the last line if it still doesn't fit
            if (line.y > bottomLimit - lineHeight) {
                // This shouldn't happen often with the loop, but as a safety
                if (line === layout.lines[layout.lines.length - 1]) {
                    ctx.fillText(line.text.trim() + '...', padding, line.y);
                }
            } else {
                ctx.fillText(line.text, padding, line.y);
            }
        });

        // Add watermark at bottom
        ctx.font = '500 20px Inter, system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = template === 'minimal' ? '#9ca3af' : 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('Generated by Kirboreo ELI5', canvas.width / 2, canvas.height - 30);

    }, [title, explanation, template]);

    const handleDownload = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `eli5-${template}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        if (onDownload) onDownload();
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-xl shadow-2xl border border-white/10 transition-transform hover:scale-[1.02] duration-300"
                style={{ maxWidth: '100%', aspectRatio: '1200/630' }}
            />
            <button
                onClick={handleDownload}
                disabled={!explanation}
                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-white/10"
            >
                <span>📥</span> Download Image
            </button>
        </div>
    );
}
