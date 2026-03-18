'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(false)

  async function registrarNave(event: any) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.target)
    const fotosFiles = formData.getAll('fotos') as File[] // Captura todos los archivos seleccionados
    const urlsSubidas: string[] = []

    try {
      // 1. Subida en bucle de todas las fotos seleccionadas
      for (const file of fotosFiles) {
        if (file.size > 0) {
          const fileName = `${Date.now()}-${file.name}`
          const { data, error: uploadError } = await supabase.storage
            .from('fotos-naves')
            .upload(fileName, file)

          if (uploadError) {
            console.error('Error subiendo una foto:', uploadError.message)
            continue // Si falla una, seguimos con la siguiente
          }

          // Obtenemos la URL pública de la foto subida con éxito
          const { data: publicUrlData } = supabase.storage
            .from('fotos-naves')
            .getPublicUrl(fileName)
          
          urlsSubidas.push(publicUrlData.publicUrl)
        }
      }

      // 2. Insertamos en la tabla 'espacios' usando la nueva columna 'imagenes' (Array)
      const { error: insertError } = await supabase.from('espacios').insert([{
        nombre_dueño: formData.get('dueño'),
        direccion: formData.get('direccion'),
        telefono: formData.get('tel'),
        imagenes: urlsSubidas // Enviamos el array de URLs
      }])

      if (insertError) throw insertError

      alert(`¡Éxito! Nave registrada con ${urlsSubidas.length} fotos en el sistema.`)
      event.target.reset()

    } catch (error: any) {
      alert('Error en el proceso: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-lg mx-auto bg-slate-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 mt-10">
        <h1 className="text-3xl font-black text-indigo-900 mb-1 tracking-tight text-center">VANTAGE BCN</h1>
        <p className="text-slate-500 mb-8 font-medium italic text-sm text-center">Captación de Espacios Industriales</p>
        
        <form onSubmit={registrarNave} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">📍 Dirección de la Nave</label>
            <input name="direccion" required placeholder="Carrer de Pere IV, ..." className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-black bg-slate-50" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">👤 Nombre del Dueño</label>
            <input name="dueño" required placeholder="Nombre completo" className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-black bg-slate-50" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">📱 Teléfono / WhatsApp</label>
            <input name="tel" required placeholder="600 000 000" className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-black bg-slate-50" />
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border-2 border-dashed border-indigo-200 text-center">
            <label className="block text-sm font-bold text-indigo-900 mb-2">📸 Reportaje Fotográfico (Varias fotos)</label>
            <input 
              name="fotos" 
              type="file" 
              multiple 
              accept="image/*" 
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer" 
            />
            <p className="text-[10px] text-indigo-400 mt-2 font-medium">Puedes seleccionar varias fotos a la vez desde tu galería</p>
          </div>
          
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-black text-lg hover:bg-indigo-700 shadow-lg active:scale-95 disabled:bg-slate-300 transition-all"
          >
            {loading ? 'SUBIENDO REPORTAJE...' : 'REGISTRAR NAVE 🚀'}
          </button>
        </form>
      </div>
    </main>
  )
}