import React, { useState } from 'react';
import { ShapeType } from './types';
import ParallelogramLesson from './components/ParallelogramLesson';
import TriangleLesson from './components/TriangleLesson';
import TrapezoidLesson from './components/TrapezoidLesson';
import Quiz from './components/Quiz';
import { Shapes, Triangle, PenTool, LayoutTemplate } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ShapeType>(ShapeType.PARALLELOGRAM);

  const renderContent = () => {
    switch (currentTab) {
      case ShapeType.PARALLELOGRAM:
        return <ParallelogramLesson />;
      case ShapeType.TRIANGLE:
        return <TriangleLesson />;
      case ShapeType.TRAPEZOID:
        return <TrapezoidLesson />;
      case ShapeType.QUIZ:
        return <Quiz />;
      default:
        return <ParallelogramLesson />;
    }
  };

  // Explicit styling mapping to avoid dynamic string interpolation issues with Tailwind CDN
  const getTabStyles = (type: ShapeType, isActive: boolean) => {
    const baseStyle = "flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap";
    const inactiveStyle = "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50";
    
    if (!isActive) return `${baseStyle} ${inactiveStyle}`;

    switch (type) {
        case ShapeType.PARALLELOGRAM:
            return `${baseStyle} bg-white shadow-sm text-amber-600 ring-1 ring-gray-200`;
        case ShapeType.TRIANGLE:
            return `${baseStyle} bg-white shadow-sm text-sky-600 ring-1 ring-gray-200`;
        case ShapeType.TRAPEZOID:
            return `${baseStyle} bg-white shadow-sm text-emerald-600 ring-1 ring-gray-200`;
        case ShapeType.QUIZ:
            return `${baseStyle} bg-white shadow-sm text-purple-600 ring-1 ring-gray-200`;
        default:
            return `${baseStyle} ${inactiveStyle}`;
    }
  };

  const getIconColorClass = (type: ShapeType, isActive: boolean) => {
      if (!isActive) return "";
      switch (type) {
        case ShapeType.PARALLELOGRAM: return "text-amber-500";
        case ShapeType.TRIANGLE: return "text-sky-500";
        case ShapeType.TRAPEZOID: return "text-emerald-500";
        case ShapeType.QUIZ: return "text-purple-500";
        default: return "";
      }
  };

  const tabs = [
    { type: ShapeType.PARALLELOGRAM, icon: LayoutTemplate, label: '平行四邊形' },
    { type: ShapeType.TRIANGLE, icon: Triangle, label: '三角形' },
    { type: ShapeType.TRAPEZOID, icon: Shapes, label: '梯形' },
    { type: ShapeType.QUIZ, icon: PenTool, label: '隨堂測驗' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-lg">
               <Shapes className="w-8 h-8 text-white" />
             </div>
             <div>
               <h1 className="text-2xl font-bold text-gray-800 tracking-tight">幾何圖形探險家</h1>
               <p className="text-sm text-gray-500">五年級數學：面積大挑戰</p>
             </div>
          </div>
          
          <nav className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto max-w-full no-scrollbar">
            {tabs.map((tab) => {
               const isActive = currentTab === tab.type;
               return (
                 <button
                    key={tab.type}
                    onClick={() => setCurrentTab(tab.type)}
                    className={getTabStyles(tab.type, isActive)}
                 >
                    <tab.icon className={`w-4 h-4 ${getIconColorClass(tab.type, isActive)}`} />
                    {tab.label}
                 </button>
               )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        <div className="h-full">
           {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 幾何探險家 | 專為台灣五年級學生設計的互動教材</p>
          <p className="mt-1">Powered by Google Gemini 2.5 Flash</p>
        </div>
      </footer>
    </div>
  );
};

export default App;