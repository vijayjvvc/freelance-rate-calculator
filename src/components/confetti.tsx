"use client";

import { useEffect, useState } from 'react';

const ConfettiPiece = ({ id }: { id: number }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100 + 100;
    const randomRotate = Math.random() * 360;
    const randomScale = Math.random() * 0.5 + 0.5;
    const randomDuration = Math.random() * 2 + 3;
    const randomDelay = Math.random() * 2;
    const colors = ['#39FF14', '#7DF9FF', '#F0F0F0'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setStyle({
      left: `${randomX}%`,
      top: `-${randomY}%`,
      transform: `rotate(${randomRotate}deg) scale(${randomScale})`,
      backgroundColor: randomColor,
      animation: `fall ${randomDuration}s ease-out ${randomDelay}s forwards`,
      position: 'absolute',
      width: '10px',
      height: '10px',
      opacity: 0,
    });
  }, []);

  return <div style={style} />;
};

export const Confetti = () => {
    const [pieces, setPieces] = useState<number[]>([]);

    useEffect(() => {
        const newPieces = Array.from({ length: 100 }, (_, i) => i);
        setPieces(newPieces);

        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes fall {
                0% { opacity: 1; transform: translateY(0) rotate(0deg); }
                100% { opacity: 0; transform: translateY(500vh) rotate(720deg); }
            }
        `;
        document.head.appendChild(styleSheet);
        
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
            {pieces.map((id) => (
                <ConfettiPiece key={id} id={id} />
            ))}
        </div>
    );
};
