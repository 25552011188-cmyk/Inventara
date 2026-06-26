import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  LayoutDashboard, Package, PackagePlus, PackageMinus, 
  Tag, Building2, LogOut, Menu, ChevronLeft, ChevronRight, 
  User, Settings
} from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appLogo, setAppLogo] = useState(null);

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data.logo_url) setAppLogo(res.data.logo_url);
    }).catch(e => console.error(e));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Barang', path: '/barang', icon: Package },
    { name: 'Barang Masuk', path: '/barang-masuk', icon: PackagePlus },
    { name: 'Barang Keluar', path: '/barang-keluar', icon: PackageMinus },
    { name: 'Kategori', path: '/categories', icon: Tag },
    { name: 'Supplier', path: '/suppliers', icon: Building2 },
    { name: 'Pengaturan', path: '/settings', icon: Settings },
  ];

  // Custom easing curve untuk animasi yang lebih natural (mirip iOS/macOS)
  const smoothEasing = "duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      
      {/* Sidebar: Gunakan transition spesifik untuk width agar tidak lag */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-[width] ${smoothEasing} ${sidebarOpen ? 'w-64' : 'w-20'} bg-white/90 backdrop-blur-xl border-r border-gray-100 shadow-sm`}>
        <div className="h-full flex flex-col">
          
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
            <div className={`flex items-center transition-opacity ${smoothEasing} ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              {appLogo ? (
                <img src={appLogo} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                  I
                </div>
              )}
              <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight whitespace-nowrap">Inventara</h1>
            </div>
            
            {/* Tombol Toggle (Selalu terlihat) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 ${!sidebarOpen && 'mx-auto'}`}
            >
              {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
          
          {/* Menu Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full px-3 py-2.5 rounded-xl transition-colors duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {/* Micro-interaction: Icon bergeser sedikit saat hover/active */}
                  <Icon size={20} className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5'}`} />
                  
                  {/* Text dengan fade effect saat collapse */}
                  <span className={`ml-3 text-sm whitespace-nowrap transition-opacity ${smoothEasing} ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Logout Area */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200 group"
            >
              <LogOut size={20} className="flex-shrink-0 text-red-500 group-hover:text-red-600 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span className={`ml-3 text-sm font-medium whitespace-nowrap transition-opacity ${smoothEasing} ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper: Transisi margin yang smooth */}
      <div className={`transition-[margin] ${smoothEasing} ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Top Navbar */}
        <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            >
              <Menu size={20} />
            </button>
          </div>
          
          <div className="flex-1"></div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">Admin Gudang</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white transition-transform duration-200 hover:scale-105 cursor-pointer">
                <User size={18} />
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}