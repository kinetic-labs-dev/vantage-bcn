'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DetalleNave() {
  const params = useParams()
  const router = useRouter()
  const [nave, setNave] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNave() {
      const { data, error } = await supabase
        .from('espacios')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (data) setNave(data)
      setLoading(false)
    }
    if (params.id) fetchNave()
  }, [params.id])

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse uppercase tracking-widest">Cargando Espacio...</div>
  if (!nave) return <div className="text-white text-center p-20">Nave no encontrada</div>

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="mb-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
          ← Volver al Portfolio
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* GALERÍA DE FOTOS */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {nave.imagenes && nave.imagenes.length > 0 ? (
                nave.imagenes.map((url: string, index: number) => (
                  <img key={index} src={url} alt={`Foto ${index}`} className="w-full rounded-3xl border border-slate-700 hover:border-indigo-500 transition-all shadow-2xl" />
                ))
              ) : (
                <div className="h-96 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-600 text-6xl">🏭</div>
              )}
            </div>
          </div>

          {/* FICHA TÉCNICA */}
          <div className="lg:sticky lg:top-12 h-fit space-y-8">
            <header>
              <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase leading-none">{nave.direccion}</h1>
              <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">ID Espacio: #00{nave.id}</span>
            </header>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Superficie Total</p>
                <p className="text-3xl font-black">{nave.metros || '--'} <span className="text-sm text-indigo-400">m²</span></p>
              </div>
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Precio por Jornada</p>
                <p className="text-3xl font-black text-green-400">{nave.precio_dia || '--'} <span className="text-sm">€</span></p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-[0.2em]">Memoria Técnica</h3>
              <p className="text-slate-300 leading-relaxed font-medium italic">
                {nave.descripcion || "Espacio industrial diáfano en el corazón de Poblenou. Consultar especificaciones de potencia eléctrica y acceso de carga."}
              </p>
            </div>

            <div className="p-8 bg-indigo-900/30 rounded-3xl border border-indigo-500/30">
              <h3 className="text-[10px] font-black text-white uppercase mb-4 tracking-[0.2em]">Contacto Directo</h3>
              <p className="text-2xl font-black mb-1">{nave.nombre_dueño}</p>
              <p className="text-indigo-300 font-bold mb-6 italic">{nave.telefono}</p>
              <a href={`https://wa.me/${nave.telefono}`} className="block w-full bg-white text-black text-center font-black py-5 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95 uppercase tracking-tighter">
                Solicitar Reserva de Espacio
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}