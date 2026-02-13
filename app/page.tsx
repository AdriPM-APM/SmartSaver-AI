// app/page.tsx
'use client';
import { useState } from 'react';
import { Search, Ticket, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [rawText, setRawText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const processCoupon = async () => {
    setLoading(true);
    const res = await fetch('/api/coupon/process', {
      method: 'POST',
      body: JSON.stringify({ text: rawText }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 flex justify-center items-center gap-2">
            <Ticket className="text-emerald-500" /> SmartSaver AI
          </h1>
          <p className="text-slate-500 mt-2">Paste a deal, let AI verify the code.</p>
        </header>

        {/* Input Area */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
          <textarea 
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700"
            placeholder="Paste newsletter text or social media post here..."
            rows={4}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <button 
            onClick={processCoupon}
            disabled={loading}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2"
          >
            {loading ? 'AI is Thinking...' : <><Sparkles size={18}/> Process with AI</>}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white border-l-4 border-emerald-500 p-6 rounded-r-2xl shadow-md animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">AI Score: {result.validation.confidence * 100}%</span>
                <h2 className="text-2xl font-bold text-slate-800">{result.data.store}</h2>
                <p className="text-slate-600 font-medium text-lg">{result.data.discount} Off</p>
              </div>
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 px-4 py-2 rounded text-xl font-mono font-bold">
                {result.data.code}
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500 italic">" {result.validation.reason} "</p>
          </div>
        )}
      </div>
    </main>
  );
}
