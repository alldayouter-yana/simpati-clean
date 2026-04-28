'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  try {
    const normalizedEmail = email.trim().toLowerCase()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (error) throw error
    if (!data.user) throw new Error('User tidak ditemukan setelah login')

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, nama, role')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Profil user tidak ditemukan di tabel profiles')
    }

const roleRoutes: Record<string, string> = {
  operator: '/dashboard/staff',
  kasubbagwatpers: '/dashboard/kasubbag',
  kabag_sdm: '/dashboard/kabag',
  pimpinan: '/dashboard/kapolresta',
  admin: '/dashboard/admin',
}

    const targetRoute = roleRoutes[profile.role]

    if (!targetRoute) {
      throw new Error(`Role tidak dikenali: ${profile.role}`)
    }

    router.push(targetRoute)
  } catch (error: any) {
    setError(error.message || 'Login gagal')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SIMPATI</h1>
          <p className="text-gray-600 text-sm">
            Sistem Manajemen Pelayanan<br/>
            Administrasi Cuti dan Izin
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="contoh@demo.id"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>• operator.watpers@demo.id</p>
            <p>• kasubbagwatpers@demo.id</p>
            <p>• kabagsdm@demo.id</p>
            <p>• kapolresta@demo.id</p>
            <p>• admin.sistem@demo.id</p>
            <p className="text-gray-400 mt-2">Password: Simpati2026!</p>
           
          </div>
        </div>
      </div>
    </div>
  )
}
