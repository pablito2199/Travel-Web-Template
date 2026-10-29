import confetti from 'canvas-confetti';
import { useEffect, useRef, useState } from 'react';

function usePartyMode({ enabled, lyrics = [], confettiColors }) {
    const [isPartyTime, setIsPartyTime] = useState(false);
    const [currentLyric, setCurrentLyric] = useState('');
    const audioRef = useRef(null);

    useEffect(() => {
        if (!enabled || !isPartyTime) {
            setCurrentLyric('');
            return undefined;
        }

        const pickLyric = () => (
            lyrics.length ? lyrics[Math.floor(Math.random() * lyrics.length)] : ''
        );

        setCurrentLyric(pickLyric());
        const interval = setInterval(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: confettiColors
            });
            setCurrentLyric(pickLyric());
        }, 1000);

        return () => clearInterval(interval);
    }, [enabled, isPartyTime, lyrics, confettiColors]);

    const toggleParty = () => {
        if (!enabled) {
            return;
        }

        if (!isPartyTime) {
            if (audioRef.current) {
                audioRef.current.play().catch(() => {});
            }
            setIsPartyTime(true);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPartyTime(false);
    };

    return {
        isPartyTime: enabled && isPartyTime,
        currentLyric,
        toggleParty,
        audioRef
    };
}

export default usePartyMode;
