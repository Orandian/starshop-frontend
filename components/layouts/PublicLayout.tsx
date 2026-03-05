"use client"

import type { ReactNode } from "react"
import PublicHeader from "@/components/header/PublicHeader"
import PublicFooter from "@/components/footer/PublicFooter"

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="relative overflow-hidden bg-white">

      <div className="relative z-10">
        <PublicHeader />
        <main className="mt-[80px]">{children}</main>
        <PublicFooter />
      </div>

      <style jsx>{`
        .min-h-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, rgba(219, 234, 254, 0.3) 50%, rgba(237, 233, 254, 0.2) 100%);
        }

        .balloon-gradient-1 {
          background: radial-gradient(circle, rgba(175, 179, 223, 0.7) 0%, rgba(175, 179, 223, 0.45) 40%, rgba(175, 179, 223, 0.25) 70%, transparent 100%);
          filter: blur(20px);
        }

        .balloon-gradient-1-glow {
          background: radial-gradient(circle, rgba(175, 179, 223, 0.3) 0%, transparent 60%);
          filter: blur(20px);
        }

        .balloon-gradient-2 {
          background: radial-gradient(circle, rgba(252, 238, 234, 0.8) 0%, rgba(252, 238, 234, 0.5) 40%, rgba(252, 238, 234, 0.25) 70%, transparent 100%);
          filter: blur(20px);
        }

        .balloon-gradient-2-glow {
          background: radial-gradient(circle, rgba(252, 238, 234, 0.4) 0%, transparent 60%);
          filter: blur(20px);
        }

        .balloon-gradient-3 {
          background: radial-gradient(circle, rgba(175, 179, 223, 0.6) 0%, rgba(175, 179, 223, 0.35) 40%, rgba(175, 179, 223, 0.18) 70%, transparent 100%);
          filter: blur(20px);
        }

        .balloon-gradient-3-glow {
          background: radial-gradient(circle, rgba(175, 179, 223, 0.25) 0%, transparent 60%);
          filter: blur(20px);
        }

        .balloon-gradient-4 {
          background: radial-gradient(circle, rgba(252, 238, 234, 0.65) 0%, rgba(252, 238, 234, 0.35) 60%, transparent 100%);
          filter: blur(20px);
        }

        .balloon-gradient-4-glow {
          background: radial-gradient(circle, rgba(252, 238, 234, 0.3) 0%, transparent 60%);
          filter: blur(20px);
        }

        .balloon-gradient-5 {
          background: radial-gradient(circle, rgba(252, 238, 234, 0.8) 0%, rgba(252, 238, 234, 0.5) 40%, rgba(252, 238, 234, 0.25) 70%, transparent 100%);
          filter: blur(20px);
        }

        .balloon-gradient-5-glow {
          background: radial-gradient(circle, rgba(252, 238, 234, 0.4) 0%, transparent 60%);
          filter: blur(20px);
        }

        .balloon-1 {
          animation: float-organic-1 45s ease-in-out infinite;
          top: 10%;
          left: 5%;
        }

        .balloon-2 {
          animation: float-organic-2 55s ease-in-out infinite;
          top: 60%;
          right: 10%;
        }

        .balloon-3 {
          animation: float-organic-3 40s ease-in-out infinite;
          top: 30%;
          left: 70%;
        }

        .balloon-4 {
          animation: float-organic-4 50s ease-in-out infinite;
          top: 15%;
          right: 30%;
        }

        .balloon-5 {
          animation: float-organic-5 60s ease-in-out infinite;
          top: 70%;
          left: 15%;
        }

        @keyframes float-organic-1 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1); 
            opacity: 0.8; 
          }
          15% { 
            transform: translate(300px, -150px) rotate(5deg) scale(1.1); 
            opacity: 1; 
          }
          30% { 
            transform: translate(600px, 50px) rotate(-3deg) scale(0.9); 
            opacity: 0.9; 
          }
          45% { 
            transform: translate(800px, 200px) rotate(8deg) scale(1.2); 
            opacity: 1; 
          }
          60% { 
            transform: translate(500px, 400px) rotate(-5deg) scale(1.05); 
            opacity: 0.95; 
          }
          75% { 
            transform: translate(200px, 300px) rotate(3deg) scale(0.95); 
            opacity: 0.85; 
          }
          90% { 
            transform: translate(100px, 100px) rotate(-2deg) scale(1.08); 
            opacity: 0.9; 
          }
        }

        @keyframes float-organic-2 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1); 
            opacity: 0.75; 
          }
          12% { 
            transform: translate(-200px, -300px) rotate(-4deg) scale(1.15); 
            opacity: 0.95; 
          }
          25% { 
            transform: translate(-450px, -200px) rotate(2deg) scale(0.85); 
            opacity: 0.85; 
          }
          38% { 
            transform: translate(-700px, -50px) rotate(-6deg) scale(1.25); 
            opacity: 1; 
          }
          50% { 
            transform: translate(-900px, 150px) rotate(4deg) scale(0.8); 
            opacity: 0.8; 
          }
          62% { 
            transform: translate(-600px, 350px) rotate(-3deg) scale(1.1); 
            opacity: 0.9; 
          }
          75% { 
            transform: translate(-300px, 450px) rotate(5deg) scale(0.9); 
            opacity: 0.85; 
          }
          88% { 
            transform: translate(-150px, 250px) rotate(-2deg) scale(1.05); 
            opacity: 0.8; 
          }
        }

        @keyframes float-organic-3 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1); 
            opacity: 0.8; 
          }
          20% { 
            transform: translate(-400px, 200px) rotate(6deg) scale(1.3); 
            opacity: 1; 
          }
          40% { 
            transform: translate(-600px, -100px) rotate(-4deg) scale(0.7); 
            opacity: 0.85; 
          }
          60% { 
            transform: translate(-450px, -400px) rotate(8deg) scale(1.15); 
            opacity: 0.95; 
          }
          80% { 
            transform: translate(-200px, -200px) rotate(-3deg) scale(0.85); 
            opacity: 0.9; 
          }
        }

        @keyframes float-organic-4 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1); 
            opacity: 0.7; 
          }
          25% { 
            transform: translate(-250px, -150px) rotate(-5deg) scale(1.4); 
            opacity: 0.9; 
          }
          50% { 
            transform: translate(-500px, 100px) rotate(7deg) scale(0.6); 
            opacity: 0.75; 
          }
          75% { 
            transform: translate(-350px, 250px) rotate(-4deg) scale(1.2); 
            opacity: 0.85; 
          }
        }

        @keyframes float-organic-5 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1); 
            opacity: 0.75; 
          }
          30% { 
            transform: translate(350px, -250px) rotate(4deg) scale(1.35); 
            opacity: 0.95; 
          }
          60% { 
            transform: translate(200px, -100px) rotate(-6deg) scale(0.65); 
            opacity: 0.8; 
          }
          90% { 
            transform: translate(50px, 50px) rotate(2deg) scale(1.15); 
            opacity: 0.85; 
          }
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        @keyframes pulse-gentle-delayed {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.03); }
        }

        @keyframes pulse-gentle-slow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.01); }
        }

        @keyframes pulse-gentle-fast {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.04); }
        }

        @keyframes pulse-gentle-medium {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.025); }
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 12s ease-in-out infinite;
        }

        .animate-pulse-gentle-delayed {
          animation: pulse-gentle-delayed 15s ease-in-out infinite 4s;
        }

        .animate-pulse-gentle-slow {
          animation: pulse-gentle-slow 18s ease-in-out infinite 6s;
        }

        .animate-pulse-gentle-fast {
          animation: pulse-gentle-fast 10s ease-in-out infinite 2s;
        }

        .animate-pulse-gentle-medium {
          animation: pulse-gentle-medium 14s ease-in-out infinite 5s;
        }
      `}</style>
    </div>
  )
}
