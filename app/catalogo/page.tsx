'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Catalogo() {
  const [naves, setNaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNaves() {
      const { data, error } = await supabase
        .from('espacios')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error cargando naves:', error.message)
      } else {
        setNaves(data || [])
      }
      setLoading(false)
    }
    fetchNaves()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white font-bold animate-pulse">CARGANDO PORTFOLIO VANTAGE...</p>
      </div>
    )
  }

  return (
    <main className="p-8 bg-slate-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="text-5xl font-black mb-2 tracking-tighter italic">
            VANTAGE <span className="text-indigo-500 underline">PORTFOLIO</span>
          </h1>
          <p className="text-slate-400 font-medium">
            Catálogo exclusivo de naves industriales para producciones en Poblenou
          </p>
        </header>

        {naves.length === 0 ? (
          <div className="text-center py-20 bg-slate-800 rounded-3xl border-2 border-dashed border-slate-700">
            <p className="text-slate-500 text-xl">Aún no hay naves registradas. ¡Sal a captar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {naves.map((nave) => (
              <div key={nave.id} className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all duration-300 shadow-2xl group">
                
                {/* Contenedor de Imagen */}
                <div className="h-64 bg-slate-700 relative overflow-hidden">
                  {nave.imagenes && nave.imagenes.length > 0 ? (
                    <>
                      <img 
                        src={nave.imagenes[0]} 
                        alt={nave.direccion} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold">
                        +{nave.imagenes.length} FOTOS
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-6xl opacity-20">🏭</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Poblenou District
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-1 truncate uppercase">{nave.direccion}</h2>
                  <p className="text-indigo-400 text-sm font-bold mb-4 italic">Ref: #00{nave.id.toString().slice(-3)}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Propietario</span>
                      <span className="font-bold">{nave.nombre_dueño}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Contacto</span>
                      <span className="font-bold">{nave.telefono}</span>
                    </div>
                  </div>

                  <button className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-indigo-500 hover:text-white transition-all transform group-active:scale-95">
                    RESERVAR ESPACIO
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}