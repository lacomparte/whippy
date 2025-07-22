import React from "react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="relative w-48 h-48 mb-10">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 w-8 h-8 -ml-4 -mt-4 rounded-full opacity-20"
              style={{
                backgroundColor: "#000",
                transform: `rotate(${i * 30}deg) translate(88px)`,
                animation: `spinnerDotFade 1.2s linear infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes spinnerDotFade {
              0% { opacity: 1; }
              100% { opacity: 0.2; }
            }
          `}</style>
        </div>
        <div className="text-base text-gray-700 font-medium">
          데이터를 불러오고 있습니다
        </div>
      </div>
    </div>
  );
}
