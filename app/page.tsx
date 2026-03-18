'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(false)

  async function registrarNave(event: any) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.target)
    
    // Mandamos los datos a tu tabla 'espacios' de Supabase
    const { error } = await supabase.from('espacios').insert([{
      nombre_dueño: formData.get('dueño'),
      direccion: formData.get('direccion'),
      telefono: formData.get('tel'),
    }])

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('¡Nave registrada con éxito! Ya puedes verla en Supabase.')
      event.target.reset()
    }
    setLoading(false)
  }

  return (
    <main className="p-6 max-w-lg mx-auto bg-slate-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 mt-10">
        <h1 className="text-3xl font-black text-indigo-900 mb-1">VANTAGE BCN</h1>
        <p className="text-slate-500 mb-8 font-medium italic">Captación de Espacios Industriales</p>
        
        <form onSubmit={registrarNave} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">📍 Dirección de la Nave (Poblenou)</label>
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
          <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-xl font-black text-lg hover:bg-indigo-700 shadow-lg active:scale-95 disabled:bg-slate-300">
            {loading ? 'GUARDANDO...' : 'REGISTRAR NAVE 🚀'}
          </button>
        </form>
      </div>
    </main>
  )
}