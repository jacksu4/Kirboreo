'use client';

import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Default Tilt options
const defaultOptions = {
    reverse: false,  // reverse the tilt direction
    max: 15,     // max tilt rotation (degrees)
    perspective: 1000,   // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1.02,   // 2 = 200%, 1.5 = 150%, etc..
    speed: 1000,   // Speed of the enter/exit transition
    transition: true,   // Set a transition on enter/exit.
    axis: null,   // What axis should be disabled. Can be X or Y.
    reset: true,   // If the tilt effect has to be reset on exit.
    easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            className="h-full"
        >
            <Tilt options={defaultOptions} className="h-full">
                <div className={cn(
                    "h-full relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl p-6 transition-all duration-300 group",
                    "hover:border-[#00F0FF]/50 hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.3)]",
                    className
                )}>
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/0 via-[#00F0FF]/0 to-[#00F0FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </Tilt>
        </motion.div>
    );
}
