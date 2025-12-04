import React, { useState } from 'react';
import { generateMathProblem, checkAnswer } from '../services/geminiService';
import { ShapeType } from '../types';
import { Sparkles, CheckCircle2, RotateCcw, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Quiz: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<ShapeType | 'ALL'>('ALL');
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState<string>('');

  const handleGenerate = async () => {
    setLoading(true);
    setQuestion('');
    setFeedback('');
    setStudentAnswer('');
    
    const result = await generateMathProblem(selectedTopic);
    setQuestion(result);
    setLoading(false);
  };

  const handleCheck = async () => {
    if (!studentAnswer.trim()) return;
    
    setChecking(true);
    const result = await checkAnswer(question, studentAnswer);
    setFeedback(result);
    setChecking(false);
  };

  // Helper to remove the <answer> block from display and simple cleanup
  const displayQuestion = question
    .replace(/<answer>[\s\S]*?<\/answer>/g, '')
    .trim();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
        <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2 mb-6">
          <PenTool className="w-6 h-6" /> 隨堂測驗：AI 數學老師
        </h2>
        
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-gray-600 font-medium">選擇主題：</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedTopic('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTopic === 'ALL' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              綜合練習
            </button>
            {Object.values(ShapeType).filter(t => t !== ShapeType.QUIZ).map((type) => (
               <button
                key={type}
                onClick={() => setSelectedTopic(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTopic === type ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="ml-auto flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {question ? '再出一題' : '出一題考考我'}
          </button>
        </div>
      </div>

      {/* Question Area */}
      <AnimatePresence mode="wait">
        {loading && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             className="bg-white p-12 rounded-2xl shadow-sm border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400"
            >
              <RotateCcw className="w-8 h-8 animate-spin mb-4 text-purple-400" />
              <p>正在思考題目中...</p>
           </motion.div>
        )}

        {!loading && question && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-md border-l-8 border-purple-400"
          >
            <div className="prose prose-lg prose-purple max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
               {displayQuestion}
            </div>
            
            <div className="mt-8 border-t border-gray-100 pt-6">
              <label className="block text-sm font-bold text-gray-600 mb-2">你的答案 / 計算過程：</label>
              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="請在這裡寫下你的算式和答案..."
                className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-0 transition-colors resize-none text-lg"
              />
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCheck}
                  disabled={checking || !studentAnswer.trim()}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checking ? (
                    <>老師批改中...</>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> 檢查答案
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Area */}
      <AnimatePresence>
        {!loading && feedback && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 shadow-sm"
            >
            <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">👩‍🏫</span> 老師的回饋：
            </h3>
            <div className="text-gray-800 bg-white/60 p-4 rounded-xl whitespace-pre-wrap leading-relaxed">
                {feedback}
            </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;