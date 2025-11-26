"use client";

import { cn } from "@/lib/utils";
import React from "react";

const MistBackground = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 z-0 pointer-events-none overflow-hidden", className)}>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-300/30 dark:bg-violet-900/20 blur-[120px] animate-mist-flow-1 mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-300/30 dark:bg-indigo-900/20 blur-[100px] animate-mist-flow-2 mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-300/30 dark:bg-fuchsia-900/10 blur-[140px] animate-mist-flow-3 mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-300/30 dark:bg-blue-900/10 blur-[100px] animate-mist-flow-1 mix-blend-multiply dark:mix-blend-screen" />
      
      <style jsx global>{`
        @keyframes mist-flow-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes mist-flow-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 40px) scale(1.1); }
          66% { transform: translate(20px, -30px) scale(0.95); }
        }
        @keyframes mist-flow-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 30px) scale(1.05); }
          66% { transform: translate(-30px, -20px) scale(0.95); }
        }
        .animate-mist-flow-1 { animation: mist-flow-1 20s ease-in-out infinite; }
        .animate-mist-flow-2 { animation: mist-flow-2 25s ease-in-out infinite; }
        .animate-mist-flow-3 { animation: mist-flow-3 30s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default MistBackground;
