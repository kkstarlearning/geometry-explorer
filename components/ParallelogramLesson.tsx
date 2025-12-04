import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GridBackground from './GridBackground';
import { Ruler, Scissors } from 'lucide-react';

const ParallelogramLesson: React.FC = () => {
  const [base, setBase] = useState(6); // Units: grid cells (1 cell = 40px)
  const [height, setHeight] = useState(4);
  const [slant, setSlant] = useState(2); // Horizontal offset of top-left corner
  const [showProof, setShowProof] = useState(false);

  const unit = 40;
  const offsetX = 100; // Canvas padding X
  const offsetY = 300; // Canvas padding Y (start drawing from bottom)

  // Coordinates
  // Bottom Left: (slant, 0) relative to origin? No, let's fix bottom-left at (0,0) for simplicity visually
  // Actually standard parallelogram: (0,0) -> (base, 0) -> (base+slant, height) -> (slant, height)
  // Let's flip Y for SVG:
  // BL: (offsetX, offsetY)
  // BR: (offsetX + base * unit, offsetY)
  // TR: (offsetX + base * unit + slant * unit, offsetY - height * unit)
  // TL: (offsetX + slant * unit, offsetY - height * unit)

  const pBL = { x: offsetX, y: offsetY };
  const pBR = { x: offsetX + base * unit, y: offsetY };
  const pTR = { x: offsetX + base * unit + slant * unit, y: offsetY - height * unit };
  const pTL = { x: offsetX + slant * unit, y: offsetY - height * unit };

  // For the proof: We cut the triangle on the left (if slant > 0)
  // Triangle points: BL, TL, and the projection of TL onto the base line?
  // Actually, standard proof cuts the triangle formed by height.
  // Let's project TL down to the base line. Point: (pTL.x, pBL.y)
  // Visual simplification: assume slant is positive for the demo logic to be clean
  const cutX = pTL.x;
  
  // Cut Triangle path (Left side)
  // (pBL.x, pBL.y) -> (cutX, pBL.y) -> (pTL.x, pTL.y)
  const trianglePath = `M ${pBL.x} ${pBL.y} L ${cutX} ${pBL.y} L ${pTL.x} ${pTL.y} Z`;
  
  // Remainder Trapezoid path
  // (cutX, pBL.y) -> (pBR.x, pBR.y) -> (pTR.x, pTR.y) -> (pTL.x, pTL.y)
  const trapezoidPath = `M ${cutX} ${pBL.y} L ${pBR.x} ${pBR.y} L ${pTR.x} ${pTR.y} L ${pTL.x} ${pTL.y} Z`;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Controls */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-md border-l-4 border-amber-400">
        <h2 className="text-2xl font-bold text-amber-600 mb-4 flex items-center gap-2">
          <Ruler className="w-6 h-6" /> 平行四邊形
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">底 (Base): {base}</label>
            <input 
              type="range" min="3" max="8" step="1" 
              value={base} onChange={(e) => setBase(parseInt(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">高 (Height): {height}</label>
            <input 
              type="range" min="3" max="6" step="1" 
              value={height} onChange={(e) => setHeight(parseInt(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">傾斜度 (Slant): {slant}</label>
            <input 
              type="range" min="1" max="4" step="0.5" 
              value={slant} onChange={(e) => setSlant(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="bg-amber-50 p-4 rounded-xl">
             <h3 className="font-bold text-amber-800 text-lg mb-2">面積公式</h3>
             <div className="text-2xl font-mono text-center mb-2">
                底 × 高
             </div>
             <div className="text-xl text-center text-gray-600">
                {base} × {height} = <span className="font-bold text-amber-600">{base * height}</span>
             </div>
          </div>

          <button 
            onClick={() => setShowProof(!showProof)}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2"
          >
            <Scissors className="w-5 h-5" />
            {showProof ? '復原形狀' : '剪開拼拼看'}
          </button>
          
          <p className="text-sm text-gray-500 mt-2">
            試試看：按下「剪開拼拼看」，觀察移動後的三角形如何讓平行四邊形變成長方形！
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
          
          {/* Base Label */}
          <text x={offsetX + (base * unit) / 2} y={offsetY + 30} textAnchor="middle" className="text-sm fill-gray-500 font-bold">底: {base}</text>
          
          {/* Height Line & Label (Always visible) */}
          <line 
            x1={pTL.x} y1={pTL.y} 
            x2={pTL.x} y2={pBL.y} 
            stroke="black" strokeWidth="2" strokeDasharray="5,5" 
            opacity={0.4}
          />
          <text x={pTL.x - 15} y={pTL.y + (height * unit) / 2} textAnchor="middle" className="text-sm fill-gray-500 font-bold">高: {height}</text>

          <AnimatePresence>
            {!showProof ? (
              // Original Shape
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, d: `M ${pBL.x} ${pBL.y} L ${pBR.x} ${pBR.y} L ${pTR.x} ${pTR.y} L ${pTL.x} ${pTL.y} Z` }}
                exit={{ opacity: 0 }}
                fill="rgba(251, 191, 36, 0.6)" // Amber-400 with opacity
                stroke="#d97706"
                strokeWidth="3"
              />
            ) : (
              // Split Shapes
              <>
                 {/* The Trapezoid Part (Static) */}
                 <motion.path
                    d={trapezoidPath}
                    fill="rgba(251, 191, 36, 0.6)"
                    stroke="#d97706"
                    strokeWidth="3"
                  />
                  {/* The Moving Triangle */}
                  <motion.path
                    d={trianglePath}
                    fill="rgba(245, 158, 11, 0.7)" // Darker amber
                    stroke="#d97706"
                    strokeWidth="3"
                    initial={{ x: 0 }}
                    animate={{ x: base * unit }} // Move to the right by 'base' amount
                    transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
                  />
                  {/* Resulting Rectangle Outline (appears after delay) */}
                  <motion.rect
                    x={cutX}
                    y={pTL.y}
                    width={base * unit}
                    height={height * unit}
                    fill="none"
                    stroke="#10b981" // Emerald
                    strokeWidth="3"
                    strokeDasharray="10,10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                  />
                  <motion.text
                     x={cutX + (base * unit) / 2} 
                     y={pTL.y + (height * unit) / 2} 
                     textAnchor="middle" 
                     className="text-xl font-bold fill-emerald-600"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 1.8 }}
                  >
                    變成長方形了！
                  </motion.text>
              </>
            )}
          </AnimatePresence>

          {/* Points (Corners) */}
          <circle cx={pBL.x} cy={pBL.y} r="4" fill="#d97706" />
          <circle cx={pBR.x} cy={pBR.y} r="4" fill="#d97706" />
          <circle cx={pTR.x} cy={pTR.y} r="4" fill="#d97706" />
          <circle cx={pTL.x} cy={pTL.y} r="4" fill="#d97706" />

        </svg>
      </div>
    </div>
  );
};

export default ParallelogramLesson;