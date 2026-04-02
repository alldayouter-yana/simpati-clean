const fs = require('fs');

console.log('🚀 SIMPATI Project Generator');
console.log('📦 Generating files...\n');

// Create directories
const dirs = [
  'app/dashboard/staff',
  'app/dashboard/kasubbag',
  'app/dashboard/kabag',
  'app/dashboard/kapolresta',
  'app/dashboard/personel',
  'lib'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('✓ Created:', dir);
  }
});

// Files
const files = {
  'package.json': JSON.stringify({
    "name": "simpati-app",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    },
    "dependencies": {
      "next": "14.2.18",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "@supabase/supabase-js": "^2.46.2",
      "date-fns": "^4.1.0"
    },
    "devDependencies": {
      "typescript": "^5.7.2",
      "@types/node": "^22",
      "@types/react": "^18",
      "@types/react-dom": "^18",
      "autoprefixer": "^10",
      "postcss": "^8",
      "tailwindcss": "^3"
    }
  }, null, 2),

  'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}
module.exports = nextConfig`,

  'tsconfig.json': JSON.stringify({
    "compilerOptions": {
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": false,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "bundler",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "plugins": [{ "name": "next" }]
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"]
  }, null, 2),

  'tailwind.config.js': `module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: {} },
  plugins: [],
}`,

  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  '.gitignore': `node_modules
.next
.env.local
.DS_Store
*.log`,

  '.env.local': `NEXT_PUBLIC_SUPABASE_URL=https://qsevtmfawsqgjvxmexfy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZXZ0bWZhd3NxZ2p2eG1leGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNzc3NzQsImV4cCI6MjA1ODc1Mzc3NH0.Xo8K_9k7mLjn5v7qQ0rQYdPZKYEBGLNqh5JqNh5Dc0M`,

  'README.md': `# SIMPATI
Sistem Monitoring Pelayanan Administrasi Cuti dan Izin

## Setup
npm install
npm run dev

## Login
watpers@demo.id / simpati2026`,

  'lib/supabase.ts': `import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)`,

  'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,

  'app/layout.tsx': `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "SIMPATI - Polresta Bandung",
  description: "Sistem Monitoring Pelayanan Administrasi Cuti dan Izin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`,
};

// Write files
Object.entries(files).forEach(([name, content]) => {
  fs.writeFileSync(name, content);
  console.log('✓ Created:', name);
});

console.log('\n✅ Config files created!');
console.log('📝 Creating app files...\n');

// APP PAGE (Login)
const appPageContent = `'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      const { data: userData } = await supabase.from('users').select('role').eq('email', email).single()
      const routes = {
        staff_watpers: '/dashboard/staff',
        kasubbag_watpers: '/dashboard/kasubbag',
        kabag_sdm: '/dashboard/kabag',
        kapolresta: '/dashboard/kapolresta',
        personel: '/dashboard/personel'
      }
      router.push(routes[userData?.role] || '/dashboard/staff')
    } catch (err) {
      setError(err.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">SIMPATI</h1>
            <p className="text-sm text-gray-600">Sistem Monitoring Pelayanan Administrasi Cuti dan Izin</p>
            <p className="text-xs text-gray-500 mt-2">Polresta Bandung</p>
          </div>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center text-xs text-gray-600">
            <p className="font-medium mb-2">Demo: watpers@demo.id / simpati2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}`;

fs.writeFileSync('app/page.tsx', appPageContent);
console.log('✓ Created: app/page.tsx');

// Dashboard layout
const dashboardLayout = `'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/')
      else { setUser(session.user); setLoading(false) }
    })
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">SIMPATI</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.email}</span>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="text-sm bg-blue-800 px-4 py-2 rounded-lg">Logout</button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}`;

fs.writeFileSync('app/dashboard/layout.tsx', dashboardLayout);
console.log('✓ Created: app/dashboard/layout.tsx');

// Dashboard pages
const dashboards = {
  'app/dashboard/staff/page.tsx': 'Staff Watpers',
  'app/dashboard/kasubbag/page.tsx': 'Kasubbag Watpers',
  'app/dashboard/kabag/page.tsx': 'Kabag SDM',
  'app/dashboard/kapolresta/page.tsx': 'Kapolresta',
  'app/dashboard/personel/page.tsx': 'Personel'
};

Object.entries(dashboards).forEach(([path, title]) => {
  const content = `'use client'
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard ${title}</h1>
      <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
        <p className="text-gray-600">Dashboard ${title} - Coming Soon</p>
      </div>
    </div>
  )
}`;
  fs.writeFileSync(path, content);
  console.log('✓ Created:', path);
});

console.log('\n🎉 All files generated!\n');
console.log('Next steps:');
console.log('1. npm install');
console.log('2. npm run dev\n');