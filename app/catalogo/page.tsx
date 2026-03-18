'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Catalogo() {
  const [naves, setNaves] = useState<any[]>([])

  useEffect(() => {
    async function fetchNaves() {
      const { data } = await supabase.from('espacios').select('*')
      if (data) setNaves(data)
    }
    fetchNaves()
  }, [])

  return (
    <main className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-4xl font-black mb-2">VANTAGE <span className="text-indigo-500">PORTFOLIO</span></h1>
      <p className="text-slate-400 mb-10">Espacios Industriales Exclusivos en Poblenou</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {naves.map((nave) => (
          <div key={nave.id} className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all shadow-2xl group">
            <div className="h-48 bg-slate-700 flex items-center justify-center text-slate-500 relative">
               {/* Aquí irá la foto en el siguiente paso */}
               <span className="group-hover:scale-110 transition-transform text-4xl">🏭</span>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">{nave.direccion}</h2>
              <div className="flex gap-2 mb-4">
                <span className="bg-slate-700 text-xs px-2 py-1 rounded-md text-slate-300">DISPONIBLE</span>
                <span className="bg-indigo-900/50 text-xs px-2 py-1 rounded-md text-indigo-300">INDUSTRIAL</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">Propiedad de: <span className="text-white font-medium">{nave.nombre_dueño}</span></p>
              <button className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-indigo-500 hover:text-white transition-colors">
                VER DETALLES 360°
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}