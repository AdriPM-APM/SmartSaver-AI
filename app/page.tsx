// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Ticket, Sparkles, History, CheckCircle, XCircle } from 'lucide-react';

export default function HomePage() {
  const [rawText, setRawText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const processCoupon = async () => {
    setLoading(true);
    const res = await fetch('/api/coupon/process', {
      method: 'POST',
      body: JSON.stringify({ text: rawText }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
    // Refresh history after adding new
    fetchHistory(); 
  };

  const fetchHistory = async () => {
    const res = await fetch('/api/coupons'); // You'll need an API for this
    const data = await res.json();
    setHistory(data);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 flex justify-center items-center gap-3">
            <Ticket className="text-emerald-500" size={40} /> SmartSaver AI
          </h1>
          <p className="text-slate-500 mt-2">Experimental AI Coupon Hunter</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Input Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
              <h2 className="text-lg font-bold mb-4 text-slate-800">Scan New Deal</h2>
              <textarea 
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 bg-slate-50"
                placeholder="Paste newsletter text, tweets, or deal descriptions..."
                rows={5}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
              <button 
                onClick={processCoupon}
                disabled={loading || !rawText}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-emerald-200"
              >
                {loading ? 'Analyzing with Gemini...' : <><Sparkles size={20}/> Process with AI</>}
              </button>
            </div>

            {/* AI Results Display */}
            {result && (
              <div className="bg-white border-l-8 border-emerald-500 p-6 rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-4">
                   <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
                    Confidence: {Math.round(result.validation.confidence * 100)}%
                   </span>
                   {result.validation.status === 'ACTIVE' ? <CheckCircle className="text-emerald-500" /> : <XCircle className="text-rose-500" />}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{result.data.store}</h2>
                    <p className="text-emerald-600 font-bold text-xl">{result.data.discount}</p>
                  </div>
                  <div className="bg-slate-900 text-emerald-400 px-6 py-3 rounded-lg text-2xl font-mono font-bold shadow-inner">
                    {result.data.code}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500 italic leading-relaxed">" {result.validation.reason} "</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: History Sidebar */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 h-fit">
            <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-4">
              <History size={18} /> Recent Finds
            </h3>
            <div className="space-y-4">
              {/* This would be mapped from the 'history' state */}
              <p className="text-xs text-slate-400 text-center py-4">Saved coupons will appear here after database setup.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
            }
