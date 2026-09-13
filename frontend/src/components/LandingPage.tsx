import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, Satellite, Database, Activity, Shield, Map as MapIcon, Plane } from 'lucide-react';

interface Props {
  onLaunch: (useCase?: string) => void;
}

export default function LandingPage({ onLaunch }: Props) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribe = () => {
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .animate-fade-up { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulseGlow 2s infinite; }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>

      {/* Background with stars/space feel */}
      <div className={`fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center transition-opacity duration-2000 ${mounted ? 'opacity-30' : 'opacity-0'}`}></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-zinc-950"></div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-zinc-950/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-emerald-500" />
            <span className="text-xl font-bold tracking-tight">Vanguard<span className="text-emerald-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#services" className="hover:text-white transition-colors">Platform</a>
            <a href="#usecases" className="hover:text-white transition-colors">Use Cases</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          </div>
          <button 
            onClick={() => onLaunch()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all animate-pulse-glow"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="home">
          <div className="max-w-4xl">
            <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
              <Satellite className="w-4 h-4" />
              NEXT-GEN GEOSPATIAL INTELLIGENCE
            </div>
            
            <h1 className="animate-fade-up delay-100 text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8">
              ANALYZE THE WORLD <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-lime-400">
                WITH AI VISION.
              </span>
            </h1>
            
            <p className="animate-fade-up delay-200 text-base md:text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl">
              Upload satellite imagery and drone footage, and instantly extract actionable data. Zero-shot object detection, interactive chat, and live global mapping — all in one platform.
            </p>

            <div className="animate-fade-up delay-300 flex items-center gap-6">
              <button 
                onClick={() => onLaunch()}
                className="group px-6 py-3 md:px-8 md:py-4 bg-white text-zinc-950 rounded-full font-bold text-base md:text-lg transition-all hover:bg-emerald-50 hover:scale-105 flex items-center gap-3"
              >
                Start Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#usecases" className="px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/5 transition-all hidden md:block">
                Explore Use Cases
              </a>
            </div>
          </div>
          
          <div className="hidden lg:block relative animate-fade-up delay-400">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-green-500 opacity-20 blur-2xl rounded-full"></div>
            
            <div className="relative rounded-2xl border border-white/10 shadow-2xl animate-float h-[500px] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
              {/* Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.15)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              
              {/* Concentric Circles */}
              <div className="absolute w-[400px] h-[400px] rounded-full border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)_inset]"></div>
              <div className="absolute w-[300px] h-[300px] rounded-full border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.1)_inset]"></div>
              <div className="absolute w-[200px] h-[200px] rounded-full border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)_inset]"></div>
              
              {/* Crosshairs */}
              <div className="absolute w-full h-[1px] bg-emerald-500/30"></div>
              <div className="absolute h-full w-[1px] bg-emerald-500/30"></div>

              {/* Sweeper */}
              <div className="absolute w-[400px] h-[400px] rounded-full overflow-hidden">
                 <div className="w-[200px] h-[200px] bg-gradient-to-tr from-transparent via-emerald-500/20 to-green-400/60 origin-bottom-right animate-spin" style={{ animationDuration: '3s' }}></div>
              </div>

              {/* Targets */}
              <div className="absolute w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center animate-pulse" style={{ top: '25%', left: '60%' }}>
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              </div>
              <div className="absolute w-5 h-5 rounded-full border-2 border-green-400 flex items-center justify-center animate-pulse delay-300" style={{ top: '65%', left: '35%' }}>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              </div>
              <div className="absolute w-5 h-5 rounded-full border-2 border-yellow-400 flex items-center justify-center animate-pulse delay-700" style={{ top: '45%', left: '20%' }}>
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              </div>

              {/* Overlay UI mockup element */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-zinc-950/90 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-between shadow-2xl">
                <div>
                  <p className="text-xs text-emerald-400 font-bold mb-1 tracking-widest">LIVE SATELLITE UPLINK</p>
                  <p className="text-sm text-white font-medium">Scanning Sector 7G... <span className="text-emerald-400">3 Targets Found</span></p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats/Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32" id="services">
          <div className="animate-fade-up delay-400 p-8 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-md hover:-translate-y-2 transition-transform cursor-pointer group" onClick={() => onLaunch()}>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <Database className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">15cm HD Analytics</h3>
            <p className="text-slate-400 leading-relaxed">Process ultra-high resolution drone and satellite imagery with precision. Instantly locate buildings, vehicles, and extract structural data.</p>
          </div>
          
          <div className="animate-fade-up delay-500 p-8 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-md hover:-translate-y-2 transition-transform cursor-pointer group" onClick={() => onLaunch()}>
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
              <Activity className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">Real-time VQA</h3>
            <p className="text-slate-400 leading-relaxed">Chat with your map. Ask natural language questions about your geospatial data and get instant, highlightable answers overlaid on your imagery.</p>
          </div>
          
          <div className="animate-fade-up delay-[600ms] p-8 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-md hover:-translate-y-2 transition-transform cursor-pointer group" onClick={() => onLaunch()}>
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
              <Globe className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">Global EXIF Mapping</h3>
            <p className="text-slate-400 leading-relaxed">Seamless integration with Leaflet maps. We automatically extract hidden GPS EXIF data to pinpoint exactly where your footage was taken.</p>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mt-40 pt-16 border-t border-white/5" id="usecases">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Built for Every Industry</h2>
            <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto">
              From urban planning to disaster relief, Vanguard Vision provides the intelligence you need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: "defense", icon: Shield, title: "Defense & Security", desc: "Monitor borders, detect unauthorized vehicles, and assess tactical environments instantly." },
              { id: "urban", icon: MapIcon, title: "Urban Planning", desc: "Count buildings, classify urban density, and plan infrastructure with automated zoning masks." },
              { id: "agri", icon: Activity, title: "Agriculture", desc: "Analyze NDVI vegetation health and classify crop fields using advanced spectral analysis." },
              { id: "disaster", icon: Plane, title: "Disaster Response", desc: "Rapidly assess flood zones, locate damaged structures, and coordinate emergency teams." }
            ].map((useCase, idx) => (
              <div 
                key={idx} 
                onClick={() => onLaunch(useCase.id)}
                className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-emerald-500/30 transition-colors text-center cursor-pointer hover:-translate-y-1 transform duration-200"
              >
                <useCase.icon className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">{useCase.title}</h3>
                <p className="text-sm text-slate-400">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Platform Capabilities Section */}
        <div className="mt-40 pt-16 border-t border-white/5" id="capabilities">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Interactive Vision-Language Assistant</h2>
            <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto">
              Powered by cutting-edge Hugging Face models, running locally for maximum security.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div onClick={() => onLaunch()} className="cursor-pointer hover:-translate-x-2 transition-transform animate-fade-up p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-transparent border-l-4 border-emerald-500">
                <h3 className="text-xl font-bold text-emerald-400 mb-2">1. Image Ingestion & Processing</h3>
                <p className="text-slate-400">Support for standard optical formats (JPG/PNG), drone photography, and EXIF metadata extraction to instantly center your analysis on a live global map.</p>
              </div>
              
              <div onClick={() => onLaunch()} className="cursor-pointer hover:-translate-x-2 transition-transform animate-fade-up delay-100 p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-transparent border-l-4 border-green-400">
                <h3 className="text-xl font-bold text-green-400 mb-2">2. Visual Question Answering (VQA)</h3>
                <p className="text-slate-400">Ask questions like "How many buildings are here?" or "What color is this structure?" and receive grounded, explainable answers with dynamic bounding boxes drawn instantly on the image.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div onClick={() => onLaunch()} className="cursor-pointer hover:translate-x-2 transition-transform animate-fade-up delay-200 p-6 rounded-2xl bg-gradient-to-r from-emerald-900/20 to-transparent border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-green-500 mb-2">3. Zero-Shot Object Detection</h3>
                <p className="text-slate-400">Powered by OWL-ViT, detect unseen objects (buildings, vehicles, ships) on the fly without custom training. We automatically extract geometric heuristics like floor count and color profiles.</p>
              </div>
              
              <div onClick={() => onLaunch()} className="cursor-pointer hover:translate-x-2 transition-transform animate-fade-up delay-300 p-6 rounded-2xl bg-gradient-to-r from-lime-900/20 to-transparent border-l-4 border-lime-500">
                <h3 className="text-xl font-bold text-lime-500 mb-2">4. Land Cover Segmentation</h3>
                <p className="text-slate-400">Utilize CLIPSeg to instantly generate classification masks for Urban Areas, Water Bodies, and Vegetation, rendered as interactive SVG polygons with precision confidence scoring.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Footer Section */}
        <div className="mt-40 pt-16 border-t border-white/5" id="contact">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-emerald-500" />
                <span className="text-xl font-bold tracking-tight">Vanguard<span className="text-emerald-500">AI</span></span>
              </div>
              <p className="text-slate-400 max-w-sm">Empowering intelligence through zero-shot aerial analysis. From single roofs to entire forests.</p>
            </div>
            <div className="flex gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-3 rounded-full bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-emerald-500 w-64" 
              />
              <button 
                onClick={handleSubscribe}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </div>
          </div>
          <div className="text-center text-slate-600 mt-16 text-sm">
            &copy; 2026 Vanguard Vision. All Rights Reserved. Not for military use.
          </div>
        </div>
      </main>
    </div>
  );
}
