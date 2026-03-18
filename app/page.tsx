'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [loading, setLoading] = useState(false)

  async function registrarNave(event: any) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.target)
    const fotosFiles = formData.getAll('fotos') as File[] 
    const urlsSubidas: string[] = []

    try {
      for (const file of fotosFiles) {
        if (file.size > 0) {
          const fileName = `${Date.now()}-${file.name}`
          const { error: uploadError } = await supabase.storage
            .from('fotos-naves')
            .upload(fileName, file)

          if (uploadError) continue

          const { data: publicUrlData } = supabase.storage
            .from('fotos-naves')
            .getPublicUrl(fileName)
          
          urlsSubidas.push(publicUrlData.publicUrl)
        }
      }

      const { error: insertError } = await supabase.from('espacios').insert([{
        nombre_dueño: formData.get('dueño'),
        direccion: formData.get('direccion'),
        telefono: formData.get('tel'),
        imagenes: urlsSubidas,
        metros: formData.get('metros'),           
        precio_dia: formData.get('precio_dia'),   
        descripcion: formData.get('descripcion')  
      }])

      if (insertError) throw insertError

      alert(`¡Éxito! Nave registrada con ${urlsSubidas.length} fotos.`)
      event.target.reset()

    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-lg mx-auto bg-slate-50 min-h-screen relative">
      {/* BOTÓN DE ACCESO AL CATÁLOGO */}
      <div className="flex justify-end mb-4">
        <Link href="/catalogo" className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg">
          Ver Portfolio →
        </Link>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 text-black">
        <h1 className="text-3xl font-black text-indigo-900 mb-1 text-center italic tracking-tighter uppercase">Vantage BCN</h1>
        <p className="text-slate-400 mb-8 font-bold text-[10px] text-center uppercase tracking-[0.2em]">Captación de Activos</p>
        
        <form onSubmit={registrarNave} className="space-y-5">
          <input name="direccion" required placeholder="📍 Dirección (Pere IV, 120...)" className="w-full p-4 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50 font-bold" />
          <input name="dueño" required placeholder="👤 Nombre del Propietario" className="w-full p-4 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50 font-bold" />
          <input name="tel" required placeholder="📱 WhatsApp de Contacto" className="w-full p-4 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50 font-bold" />

          <div className="grid grid-cols-2 gap-4">
            <input name="metros" type="number" placeholder="📏 Superficie m²" className="w-full p-4 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50 font-bold" />
            <input name="precio_dia" type="number" placeholder="💰 Precio €/día" className="w-full p-4 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50 font-bold" />
          </div>

          <textarea name="descripcion" placeholder="📝 Notas (Altura, accesos, luz...)" className="w-full p-4 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50 font-bold h-20 text-sm" />

          <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-dashed border-indigo-200 text-center">
            <label className="block text-[10px] font-black text-indigo-900 uppercase mb-3 italic tracking-widest">📸 Reportaje Múltiple</label>
            <input name="fotos" type="file" multiple accept="image/*" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white font-bold cursor-pointer shadow-sm" />
          </div>
          
          <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl active:scale-95 disabled:bg-slate-300 transition-all uppercase tracking-tighter">
            {loading ? 'SUBIENDO...' : 'REGISTRAR NAVE 🚀'}
          </button>
        </form>
      </div>
    </main>
  )
}