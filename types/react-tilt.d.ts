declare module 'react-tilt' {
    import { ComponentType, ReactNode } from 'react';

    export interface TiltOptions {
        reverse?: boolean;
        max?: number;
        perspective?: number;
        scale?: number;
        speed?: number;
        transition?: boolean;
        axis?: 'x' | 'y' | null;
        reset?: boolean;
        easing?: string;
    }

    export interface TiltProps {
        options?: TiltOptions;
        className?: string;
        style?: React.CSSProperties;
        children?: ReactNode;
    }

    export const Tilt: ComponentType<TiltProps>;
}
