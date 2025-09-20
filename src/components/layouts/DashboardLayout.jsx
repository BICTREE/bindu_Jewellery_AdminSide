import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../navigation/Sidebar'
import Header from '../navigation/Header'

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-64">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-auto bg-neutral-50">
          <div className="py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout