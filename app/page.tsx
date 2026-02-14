'use client';
import { useState } from 'react';
import { Ticket, Sparkles, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [rawText, setRawText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const processCoupon = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupon/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error al procesar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold flex justify-center items-center gap-2">
          <Ticket className="text-emerald-500" /> SmartSaver AI
        </h1>
        <p className="text-slate-500 mt-2">Pega un anuncio o texto y la IA encontrará el código.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <textarea 
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="Ej: ¡Usa el código VERANO20 para un 20% de descuento en Nike!"
          rows={4}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        <button 
          onClick={processCoupon}
          disabled={loading || !rawText}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'La IA está analizando...' : <><Sparkles size={18}/> Analizar Cupón</>}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-white border-l-4 border-emerald-500 p-6 rounded-r-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase">Confianza: {result.validation.confidence * 100}%</p>
              <h2 className="text-2xl font-bold">{result.data.store}</h2>
              <p className="text-slate-600">{result.data.discount}</p>
            </div>
            <div className="bg-slate-100 border-2 border-dashed border-slate-300 px-4 py-2 rounded text-xl font-mono font-bold">
              {result.data.code}
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 italic">"{result.validation.reason}"</p>
        </div>
      )}
    </main>
  );
        }
            
