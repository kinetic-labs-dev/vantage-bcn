'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(false)

  async function registrarNave(event: any) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.target)
    
    // 1. Obtenemos la foto del formulario
    const fotoFile = (formData.get('foto') as File)
    let fotoUrl = null

    // 2. Si el socio ha subido una foto, la enviamos al Bucket que acabas de crear
    if (fotoFile && fotoFile.size > 0) {
      // Creamos un nombre único para la imagen (con la fecha actual)
      const fileName = `${Date.now()}-${fotoFile.name}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fotos-naves') // <--- AQUÍ USAMOS TU BUCKET
        .upload(fileName, fotoFile)

      if (uploadError) {
        alert('Error subiendo foto: ' + uploadError.message)
        setLoading(false)
        return // Paramos si hay error
      } else {
        // Si sube bien, pedimos la URL pública para guardarla en la base de datos
        const { data: publicUrlData } = supabase.storage
          .from('fotos-naves')
          .getPublicUrl(fileName)
        
        fotoUrl = publicUrlData.publicUrl
      }
    }

    // 3. Insertamos todos los datos en la tabla 'espacios' (incluyendo la URL de la foto)
    const { error } = await supabase.from('espacios').insert([{
      nombre_dueño: formData.get('dueño'),
      direccion: formData.get('direccion'),
      telefono: formData.get('tel'),
      imagen_url: fotoUrl // <--- ¡Importante! Asegúrate de que esta columna exista en Supabase
    }])

    if (error) {
      alert('Error en base de datos: ' + error.message)
    } else {
      alert('¡Nave y foto registradas con éxito! Buen trabajo.')
      event.target.reset()
    }
    setLoading(false)
  }

  return (
    <main className="p-6 max-w-lg mx-auto bg-slate-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 mt-10">
        <h1 className="text-3xl font-black text-indigo-900 mb-1">VANTAGE BCN</h1>
        <p className="text-slate-500 mb-8 font-medium italic text-sm">Captación de Espacios Industriales</p>
        
        <form onSubmit={registrarNave} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">📍 Dirección de la Nave</label>
            <input name="direccion" required placeholder="Carrer de Pere IV, ..." className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-black" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">👤 Nombre del Dueño</label>
            <input name="dueño" required placeholder="Nombre completo" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-black" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">📱 Teléfono / WhatsApp</label>
            <input name="tel" required placeholder="600 000 000" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-black" />
          </div>

          {/* ESTE ES EL NUEVO CAMPO DE FOTO 👇 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">📸 Foto de la fachada (con el móvil)</label>
            <input 
              name="foto" 
              type="file" 
              accept="image/*" 
              className="w-full text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
            />
          </div>
          
          <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-xl font-black text-lg hover:bg-indigo-700 shadow-lg active:scale-95 disabled:bg-slate-300">
            {loading ? 'SUBIENDO...' : 'REGISTRAR NAVE 🚀'}
          </button>
        </form>
      </div>
    </main>
  )
}