'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(false)

  async function registrarNave(event: any) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.target)
    const fotosFiles = formData.getAll('fotos') as File[] 
    const urlsSubidas: string[] = []

    try {
      // 1. Subida múltiple al Storage
      for (const file of fotosFiles) {
        if (file.size > 0) {
          const fileName = `${Date.now()}-${file.name}`
          const { data, error: uploadError } = await supabase.storage
            .from('fotos-naves')
            .upload(fileName, file)

          if (uploadError) continue

          const { data: publicUrlData } = supabase.storage
            .from('fotos-naves')
            .getPublicUrl(fileName)
          
          urlsSubidas.push(publicUrlData.publicUrl)
        }
      }

      // 2. Inserción en la columna 'imagenes' (Array)
      const { error: insertError } = await supabase.from('espacios').insert([{
        nombre_dueño: formData.get('dueño'),
        direccion: formData.get('direccion'),
        telefono: formData.get('tel'),
        imagenes: urlsSubidas 
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
    <main className="p-6 max-w-lg mx-auto bg-slate-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 mt-10 text-black">
        <h1 className="text-3xl font-black text-indigo-900 mb-1 text-center italic">VANTAGE BCN</h1>
        <p className="text-slate-500 mb-8 font-medium text-sm text-center">Captación de Activos Industriales</p>
        
        <form onSubmit={registrarNave} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">📍 Dirección de la Nave</label>
            <input name="direccion" required className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">👤 Nombre del Dueño</label>
            <input name="dueño" required className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">📱 WhatsApp de Contacto</label>
            <input name="tel" required className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none bg-slate-50" />
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border-2 border-dashed border-indigo-200 text-center">
            <label className="block text-sm font-bold text-indigo-900 mb-2">📸 Reportaje (Varias fotos)</label>
            <input name="fotos" type="file" multiple accept="image/*" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white font-bold cursor-pointer" />
          </div>
          
          <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-xl font-black text-lg hover:bg-indigo-700 shadow-lg active:scale-95 disabled:bg-slate-300 transition-all">
            {loading ? 'SUBIENDO...' : 'REGISTRAR NAVE 🚀'}
          </button>
        </form>
      </div>
    </main>
  )
}