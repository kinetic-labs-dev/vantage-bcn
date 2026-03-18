'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link' // <--- 1. Importado

export default function Catalogo() {
  const [naves, setNaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNaves() {
      const { data } = await supabase.from('espacios').select('*').order('created_at', { ascending: false })
      if (data) setNaves(data)
      setLoading(false)
    }
    fetchNaves()
  }, [])

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse">CARGANDO VANTAGE...</div>

  return (
    <main className="p-8 bg-slate-900 min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-b border-slate-800 pb-10">
          <h1 className="text-6xl font-black mb-2 tracking-tighter italic">VANTAGE <span className="text-indigo-500">PORTFOLIO</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Barcelona Industrial Spaces</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {naves.map((nave) => (
            
            // 2. ENVOLVEMOS CADA NAVE CON EL ENLACE DINÁMICO
            <Link key={nave.id} href={`/catalogo/${nave.id}`}>
              <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all duration-500 shadow-2xl group cursor-pointer">
                
                <div className="h-72 bg-slate-700 relative overflow-hidden">
                  {nave.imagenes && nave.imagenes.length > 0 ? (
                    <>
                      <img src={nave.imagenes[0]} alt={nave.direccion} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-6 left-6 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-2xl">Poblenou</div>
                      <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-md text-white text-[10px] px-4 py-1.5 rounded-full font-black">+{nave.imagenes.length} FOTOS</div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-7xl opacity-10 font-black">🏭</div>
                  )}
                </div>

                <div className="p-8 text-white">
                  <h2 className="text-2xl font-black mb-6 uppercase tracking-tight truncate">{nave.direccion}</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-700 text-center">
                      <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">Superficie</p>
                      <p className="text-xl font-black text-white">{nave.metros || '--'} <span className="text-xs text-indigo-400">m²</span></p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-700 text-center">
                      <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">Jornada</p>
                      <p className="text-xl font-black text-white">{nave.precio_dia || '--'}<span className="text-xs text-green-400">€</span></p>
                    </div>
                  </div>

                  <button className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95 uppercase tracking-tighter">
                    Ver Detalles Técnicos
                  </button>
                </div>
              </div>
            </Link> // Cerramos el enlace aquí

          ))}
        </div>
      </div>
    </main>
  )
}