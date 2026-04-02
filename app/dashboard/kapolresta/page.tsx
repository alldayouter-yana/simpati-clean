'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function KapolrestaDashboard() {
  const [summary, setSummary] = useState({
    total_personel: 0,
    pengajuan_bulan_ini: 0,
    approval_rate: 0,
    avg_response_time: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { count: personelCount } = await supabase
        .from('personel')
        .select('*', { count: 'exact', head: true })

      const startOfMonth = new Date()
      startOfMonth.setDate(1)

      const { data: naskahData } = await supabase
        .from('naskah')
        .select('*')
        .gte('tgl_terima_watpers', startOfMonth.toISOString().split('T')[0])

      const total = naskahData?.length || 0
      const selesai = naskahData?.filter(n => n.status === 'selesai').length || 0
      const approvalRate = total > 0 ? Math.round((selesai / total) * 100) : 0

      const withProcessTime = naskahData?.filter(n => n.total_hari_proses) || []
      const avgTime = withProcessTime.length > 0
        ? withProcessTime.reduce((sum, n) => sum + n.total_hari_proses, 0) / withProcessTime.length
        : 0

      setSummary({
        total_personel: personelCount || 0,
        pengajuan_bulan_ini: total,
        approval_rate: approvalRate,
        avg_response_time: Math.round(avgTime * 10) / 10,
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Kapolresta</h1>
        <p className="text-gray-600 mt-1">Executive Summary - Sistem SIMPATI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
          <h3 className="text-sm opacity-90 mb-2">Total Personel</h3>
          <p className="text-4xl font-bold">{summary.total_personel}</p>
          <p className="text-sm mt-2 opacity-75">Polresta Bandung</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-sm opacity-90 mb-2">Pengajuan Bulan Ini</h3>
          <p className="text-4xl font-bold">{summary.pengajuan_bulan_ini}</p>
          <p className="text-sm mt-2 opacity-75">naskah cuti/izin</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-sm opacity-90 mb-2">Approval Rate</h3>
          <p className="text-4xl font-bold">{summary.approval_rate}%</p>
          <p className="text-sm mt-2 opacity-75">dari total pengajuan</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-sm opacity-90 mb-2">Avg Response Time</h3>
          <p className="text-4xl font-bold">{summary.avg_response_time}</p>
          <p className="text-sm mt-2 opacity-75">hari kerja</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Key Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Efisiensi Meningkat</h3>
              <p className="text-sm text-gray-600 mt-1">
                Waktu proses turun dari 7 hari menjadi {summary.avg_response_time} hari (↓ {Math.round((1 - summary.avg_response_time / 7) * 100)}%)
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Transparansi 100%</h3>
              <p className="text-sm text-gray-600 mt-1">
                Semua personel dapat tracking status real-time melalui sistem SIMPATI
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Paperless Office</h3>
              <p className="text-sm text-gray-600 mt-1">
                Semua arsip tersimpan digital, mudah dicari, hemat ruang penyimpanan
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Data-Driven Decision</h3>
              <p className="text-sm text-gray-600 mt-1">
                Dashboard real-time untuk monitoring KPI dan trend pengajuan cuti
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Sistem SIMPATI</h2>
            <p className="text-blue-100">
              Sistem Monitoring Pelayanan Administrasi Cuti dan Izin
            </p>
            <p className="text-sm text-blue-200 mt-3">
              RAP PKP Polri Angkatan XIII - 2026<br/>
              Developed by: <span className="font-semibold">YANA MULYANA, S.Kom (PENATA TK I)</span>
            </p>
          </div>
          <div className="hidden md:block">
            <svg className="w-24 h-24 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}