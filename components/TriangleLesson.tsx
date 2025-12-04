import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GridBackground from './GridBackground';
import { Ruler, Copy } from 'lucide-react';

const TriangleLesson: React.FC = () => {
  const [base, setBase] = useState(6);
  const [height, setHeight] = useState(5);
  const [tipOffset, setTipOffset] = useState(2); // X position of the top vertex relative to left
  const [showProof, setShowProof] = useState(false);

  const unit = 40;
  const offsetX = 100;
  const offsetY = 300;

  // Triangle Points
  // A: Bottom Left (offsetX, offsetY)
  // B: Bottom Right (offsetX + base*unit, offsetY)
  // C: Top (offsetX + tipOffset*unit, offsetY - height*unit)
  const pA = { x: offsetX, y: offsetY };
  const pB = { x: offsetX + base * unit, y: offsetY };
  const pC = { x: offsetX + tipOffset * unit, y: offsetY - height * unit };

  // Path
  const trianglePath = `M ${pA.x} ${pA.y} L ${pB.x} ${pB.y} L ${pC.x} ${pC.y} Z`;

  // Transformation for the duplicate triangle
  // To form a parallelogram, we rotate a copy 180 degrees around the midpoint of one side (say BC or AC).
  // Standard proof: Rotate around midpoint of side BC.
  // Midpoint of BC:
  const midBC = {
    x: (pB.x + pC.x) / 2,
    y: (pB.y + pC.y) / 2
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-md border-l-4 border-sky-400">
        <h2 className="text-2xl font-bold text-sky-600 mb-4 flex items-center gap-2">
          <Ruler className="w-6 h-6" /> 三角形
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">底 (Base): {base}</label>
            <input 
              type="range" min="4" max="8" step="1" 
              value={base} onChange={(e) => setBase(parseInt(e.target.value))}
              className="w-full accent-sky-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">高 (Height): {height}</label>
            <input 
              type="range" min="3" max="7" step="1" 
              value={height} onChange={(e) => setHeight(parseInt(e.target.value))}
              className="w-full accent-sky-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">頂點位置 (Vertex): {tipOffset}</label>
            <input 
              type="range" min="0" max={base} step="0.5" 
              value={tipOffset} onChange={(e) => setTipOffset(parseFloat(e.target.value))}
              className="w-full accent-sky-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="bg-sky-50 p-4 rounded-xl">
             <h3 className="font-bold text-sky-800 text-lg mb-2">面積公式</h3>
             <div className="text-2xl font-mono text-center mb-2">
                (底 × 高) ÷ 2
             </div>
             <div className="text-xl text-center text-gray-600">
                ({base} × {height}) ÷ 2 = <span className="font-bold text-sky-600">{(base * height) / 2}</span>
             </div>
          </div>

          <button 
            onClick={() => setShowProof(!showProof)}
            className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2"
          >
            <Copy className="w-5 h-5" />
            {showProof ? '隱藏複製' : '複製並旋轉'}
          </button>
           <p className="text-sm text-gray-500 mt-2">
            試試看：按下「複製並旋轉」，看看兩個全等的三角形如何拼成一個大平行四邊形！
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
          
          {/* Height Line */}
          <line 
            x1={pC.x} y1={pC.y} 
            x2={pC.x} y2={pA.y} 
            stroke="black" strokeWidth="2" strokeDasharray="5,5" 
            opacity={0.4}
          />
           <text x={pC.x - 15} y={pC.y + (height * unit) / 2} textAnchor="middle" className="text-sm fill-gray-500 font-bold">高: {height}</text>

          {/* Original Triangle */}
          <path d={trianglePath} fill="rgba(14, 165, 233, 0.6)" stroke="#0284c7" strokeWidth="3" />

          {/* Ghost/Copied Triangle */}
          <AnimatePresence>
            {showProof && (
              <>
                 <motion.path
                    d={trianglePath}
                    fill="rgba(186, 230, 253, 0.6)" // Light sky
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    initial={{ rotate: 0, x: 0, y: 0, originX: midBC.x / 400 /* rough fix later, svg origin tricky */ }}
                    animate={{ rotate: 180 }}
                    style={{ originX: `${midBC.x}px`, originY: `${midBC.y}px` }} // Correct rotation origin
                    transition={{ duration: 1.5, type: "spring" }}
                  />
                  {/* Highlight the total Parallelogram */}
                  <motion.text
                     x={midBC.x} 
                     y={midBC.y - 40} 
                     textAnchor="middle" 
                     className="text-lg font-bold fill-sky-700 bg-white"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 1.6 }}
                  >
                    兩個三角形 = 一個平行四邊形
                  </motion.text>
                  <motion.text
                     x={midBC.x} 
                     y={midBC.y - 15} 
                     textAnchor="middle" 
                     className="text-sm font-bold fill-sky-600"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 1.8 }}
                  >
                    所以三角形面積是平行四邊形的一半！
                  </motion.text>
              </>
            )}
          </AnimatePresence>

          {/* Vertices */}
          <circle cx={pA.x} cy={pA.y} r="4" fill="#0284c7" />
          <circle cx={pB.x} cy={pB.y} r="4" fill="#0284c7" />
          <circle cx={pC.x} cy={pC.y} r="4" fill="#0284c7" />
        </svg>
      </div>
    </div>
  );
};

export default TriangleLesson;