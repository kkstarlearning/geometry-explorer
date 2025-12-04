import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GridBackground from './GridBackground';
import { Ruler, Copy } from 'lucide-react';

const TrapezoidLesson: React.FC = () => {
  const [topBase, setTopBase] = useState(4);
  const [bottomBase, setBottomBase] = useState(7);
  const [height, setHeight] = useState(4);
  const [slant, setSlant] = useState(2); // Top left offset relative to bottom left
  const [showProof, setShowProof] = useState(false);

  const unit = 40;
  const offsetX = 50;
  const offsetY = 300;

  // Points
  // BL: (offsetX, offsetY)
  // BR: (offsetX + bottomBase, offsetY)
  // TR: (offsetX + slant + topBase, offsetY - height)
  // TL: (offsetX + slant, offsetY - height)
  
  const pBL = { x: offsetX, y: offsetY };
  const pBR = { x: offsetX + bottomBase * unit, y: offsetY };
  const pTR = { x: offsetX + (slant + topBase) * unit, y: offsetY - height * unit };
  const pTL = { x: offsetX + slant * unit, y: offsetY - height * unit };

  const trapezoidPath = `M ${pBL.x} ${pBL.y} L ${pBR.x} ${pBR.y} L ${pTR.x} ${pTR.y} L ${pTL.x} ${pTL.y} Z`;

  // Midpoint of the right leg (BR to TR) for rotation
  const midRight = {
    x: (pBR.x + pTR.x) / 2,
    y: (pBR.y + pTR.y) / 2
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-400">
        <h2 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
          <Ruler className="w-6 h-6" /> 梯形
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">上底 (Top Base): {topBase}</label>
            <input 
              type="range" min="2" max="6" step="1" 
              value={topBase} onChange={(e) => setTopBase(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">下底 (Bottom Base): {bottomBase}</label>
            <input 
              type="range" min="4" max="8" step="1" 
              value={bottomBase} onChange={(e) => setBottomBase(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">高 (Height): {height}</label>
            <input 
              type="range" min="3" max="6" step="1" 
              value={height} onChange={(e) => setHeight(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">歪斜 (Slant): {slant}</label>
            <input 
              type="range" min="0" max="3" step="0.5" 
              value={slant} onChange={(e) => setSlant(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl">
             <h3 className="font-bold text-emerald-800 text-lg mb-2">面積公式</h3>
             <div className="text-xl font-mono text-center mb-2">
                (上底 + 下底) × 高 ÷ 2
             </div>
             <div className="text-lg text-center text-gray-600">
                ({topBase} + {bottomBase}) × {height} ÷ 2 = <span className="font-bold text-emerald-600">{((topBase + bottomBase) * height) / 2}</span>
             </div>
          </div>

          <button 
            onClick={() => setShowProof(!showProof)}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2"
          >
            <Copy className="w-5 h-5" />
            {showProof ? '隱藏複製' : '複製並旋轉'}
          </button>
          
          <p className="text-sm text-gray-500 mt-2">
            試試看：按下「複製並旋轉」，看看兩個全等的梯形如何拼成一個大平行四邊形！底邊長度剛好是(上底+下底)喔。
          </p>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 bg-white rounded-2xl shadow-inner border border-gray-200 overflow-hidden relative">
        <svg className="w-full h-full min-h-[400px]" style={{ background: '#f8fafc' }}>
          <defs>
            <GridBackground />
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Base Labels */}
          <text x={offsetX + (bottomBase * unit) / 2} y={offsetY + 30} textAnchor="middle" className="text-sm fill-gray-500 font-bold">下底: {bottomBase}</text>
          <text x={offsetX + slant * unit + (topBase * unit) / 2} y={offsetY - height * unit - 10} textAnchor="middle" className="text-sm fill-gray-500 font-bold">上底: {topBase}</text>
          
          {/* Height Line */}
          <line 
            x1={pTL.x} y1={pTL.y} 
            x2={pTL.x} y2={pBL.y} 
            stroke="black" strokeWidth="2" strokeDasharray="5,5" 
            opacity={0.4}
          />
          <text x={pTL.x - 15} y={pTL.y + (height * unit) / 2} textAnchor="middle" className="text-sm fill-gray-500 font-bold">高: {height}</text>

          {/* Original Trapezoid */}
          <path d={trapezoidPath} fill="rgba(16, 185, 129, 0.6)" stroke="#059669" strokeWidth="3" />

          {/* Proof Animation */}
          <AnimatePresence>
            {showProof && (
              <>
                 <motion.path
                    d={trapezoidPath}
                    fill="rgba(110, 231, 183, 0.6)" // Light emerald
                    stroke="#059669"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    initial={{ rotate: 0, x: 0, y: 0 }}
                    animate={{ rotate: 180 }}
                    style={{ originX: `${midRight.x}px`, originY: `${midRight.y}px` }}
                    transition={{ duration: 1.5, type: "spring" }}
                  />
                  {/* Explanation Text */}
                  <motion.g
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 1.6 }}
                  >
                    <text
                       x={midRight.x} 
                       y={midRight.y - 80} 
                       textAnchor="middle" 
                       className="text-lg font-bold fill-emerald-700"
                    >
                      大平行四邊形的底 = 上底 + 下底
                    </text>
                  </motion.g>
              </>
            )}
          </AnimatePresence>

          {/* Points */}
          <circle cx={pBL.x} cy={pBL.y} r="4" fill="#059669" />
          <circle cx={pBR.x} cy={pBR.y} r="4" fill="#059669" />
          <circle cx={pTR.x} cy={pTR.y} r="4" fill="#059669" />
          <circle cx={pTL.x} cy={pTL.y} r="4" fill="#059669" />
        </svg>
      </div>
    </div>
  );
};

export default TrapezoidLesson;