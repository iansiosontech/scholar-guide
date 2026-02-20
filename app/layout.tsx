import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { SidebarProvider } from '@/context/sidebar-context'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Scholar - School Schedule & Task Tracker',
  description: 'Track your school schedule, expenses, and to-do lists in one place',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SidebarProvider>
          <Sidebar />
          <main className="lg:pt-0 pt-16 min-h-screen">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  )
}
