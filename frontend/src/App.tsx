import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageViewer from './components/ImageViewer';
import ChatPanel from './components/ChatPanel';
import AnalysisToolbar from './components/AnalysisToolbar';
import MapView from './components/MapView';
import LandingPage from './components/LandingPage';
import { Download, Map as MapIcon, Image as ImageIcon } from 'lucide-react';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  boxes?: BoundingBox[];
  polygons?: Polygon[];
};



export type BoundingBox = {
  label: string;
  confidence: number;
  box: [number, number, number, number]; // xmin, ymin, xmax, ymax (normalized 0-1)
};

export type Polygon = {
  label: string;
  confidence: number;
  color: string;
  points: [number, number][]; // normalized [x, y] coordinates
};

export type ChatResponse = {
  answer: string;
  confidence: number;
  boxes?: BoundingBox[];
  polygons?: Polygon[];
};

function App() {
  const [useCase, setUseCase] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLocation, setImageLocation] = useState<[number, number]>([46.5198, 6.6323]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Overlays
  const [activeBoxes, setActiveBoxes] = useState<BoundingBox[]>([]);
  const [activePolygons, setActivePolygons] = useState<Polygon[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // View toggle
  const [viewMode, setViewMode] = useState<'image' | 'map'>('image');

  const handleImageUploaded = (id: string, url: string, location?: [number, number], hasExif?: boolean) => {
    setImageId(id);
    setImageUrl(url);
    if (location) setImageLocation(location);
    
    let welcomeMsg = 'Image uploaded successfully. What would you like to know about it?';
    if (useCase === 'defense') welcomeMsg = 'Secure upload complete. Ready to detect unauthorized vehicles, track personnel, and monitor tactical perimeters.';
    if (useCase === 'urban') welcomeMsg = 'Urban sector loaded. You can now detect commercial/residential buildings and calculate land cover density.';
    if (useCase === 'agri') welcomeMsg = 'Field imagery loaded. Try using the NDVI index tool to assess vegetation health.';
    if (useCase === 'disaster') welcomeMsg = 'Emergency imagery ingested. Priority mode ready to locate damaged structures and coordinate relief.';

    if (hasExif === false) {
      welcomeMsg += "\n\n⚠️ Note: Your image did not contain GPS EXIF metadata, so the map has defaulted to a demo location. Use raw drone JPEGs for accurate global positioning!";
    }

    setMessages([{ role: 'assistant', content: welcomeMsg }]);
    setActiveBoxes([]);
    setActivePolygons([]);
    setViewMode('image');
  };

  if (!useCase) {
    return <LandingPage onLaunch={(id) => setUseCase(id || 'default')} />;
  }

  const handleSendMessage = async (question: string) => {
    if (!imageId) return;
    
    const userMsg: Message = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('https://footage-posing-panda.ngrok-free.dev/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ image_id: imageId, question }),
      });
      
      if (!response.ok) throw new Error('Server error');
      
      const data: ChatResponse = await response.json();
      const assistantMsg: Message = { 
        role: 'assistant', 
        content: data.answer,
        boxes: data.boxes,
        polygons: data.polygons
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      if (data.boxes && data.boxes.length > 0) setActiveBoxes(data.boxes);
      if (data.polygons && data.polygons.length > 0) setActivePolygons(data.polygons);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToolbarAction = async (module: string, target?: string) => {
    if (!imageId) return;
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('https://footage-posing-panda.ngrok-free.dev/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ image_id: imageId, module, target }),
      });
      
      if (!response.ok) throw new Error('Server error');
      
      const data: ChatResponse = await response.json();
      const assistantMsg: Message = { 
        role: 'assistant', 
        content: data.answer,
        boxes: data.boxes,
        polygons: data.polygons
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      if (data.boxes && data.boxes.length > 0) setActiveBoxes(data.boxes);
      if (data.polygons && data.polygons.length > 0) setActivePolygons(data.polygons);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your analysis request.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (activeBoxes.length === 0 && activePolygons.length === 0) {
      alert("No data to export! Run an analysis first.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Label,Confidence,Coordinates\n";

    activeBoxes.forEach(b => {
      csvContent += `BoundingBox,"${b.label}",${b.confidence},"${b.box.map(n => n.toFixed(3)).join(',')}"\n`;
    });

    activePolygons.forEach(p => {
      csvContent += `Polygon,"${p.label}",${p.confidence},"${p.points.length} points"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `satquery_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar Toolbar */}
      <div className="w-full lg:w-20 h-auto lg:h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-row lg:flex-col items-center py-2 lg:py-6 px-4 lg:px-0 z-20 shadow-sm shrink-0 overflow-x-auto">
        <div className="text-2xl lg:text-3xl mr-4 lg:mr-0 lg:mb-8 shrink-0">🌍</div>
        <AnalysisToolbar onAction={handleToolbarAction} disabled={!imageId || isAnalyzing} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 h-1/2 lg:h-full p-4 lg:p-6 flex flex-col min-w-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-4 lg:mb-6 shrink-0">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Vanguard Vision</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Interactive Vision-Language Assistant</p>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            {imageUrl && (
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full md:w-auto">
                <button 
                  onClick={() => setViewMode('image')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${viewMode === 'image' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ImageIcon size={16} /> Image
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <MapIcon size={16} /> Map
                </button>
              </div>
            )}
            <button 
              onClick={handleExport}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative z-0 min-h-0">
          {!imageUrl ? (
            <div className="flex-1 flex items-center justify-center bg-slate-50/50 p-4">
               <ImageUploader onUpload={handleImageUploaded} />
            </div>
          ) : viewMode === 'image' ? (
            <ImageViewer imageUrl={imageUrl} boxes={activeBoxes} polygons={activePolygons} />
          ) : (
            <MapView center={imageLocation} />
          )}
        </div>
      </div>
      
      {/* Chat Panel */}
      <div className="w-full lg:w-96 shrink-0 h-[45vh] lg:h-full border-t lg:border-t-0 lg:border-l border-slate-200 bg-white shadow-xl z-10 flex flex-col">
        {imageUrl ? (
          <ChatPanel messages={messages} onSendMessage={handleSendMessage} isAnalyzing={isAnalyzing} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/30">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon size={24} className="text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-600 mb-2">No Image Selected</h3>
            <p className="text-sm">Upload a satellite image to start your analysis session.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
