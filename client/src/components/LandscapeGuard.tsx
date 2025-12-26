import React, { useEffect, useState } from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

export const LandscapeGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            // Check if mobile and portrait
            // A simple check: if width < height and width < 768 (tablet/mobile breakpoint)
            const isMobile = window.innerWidth <= 768; // Adjust threshold as needed
            const isPortraitMode = window.innerHeight > window.innerWidth;

            // Only enforce on mobile devices
            if (isMobile && isPortraitMode) {
                setIsPortrait(true);
            } else {
                setIsPortrait(false);
            }
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (isPortrait) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 text-center text-white">
                <div className="flex mb-6 animate-pulse">
                    <Smartphone size={64} />
                    <RotateCw size={32} className="-ml-4 mt-8" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Please Rotate Your Device</h1>
                <p className="text-gray-300">
                    101 Okey Online is designed to be played in landscape mode.
                </p>
                <div className="mt-8 animate-bounce">
                    <Smartphone className="rotate-90" size={32} />
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
