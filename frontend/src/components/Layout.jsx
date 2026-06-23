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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200`}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            {sidebarOpen ? (
              <div className="flex items-center space-x-2">
                {appLogo ? (
                  <img src={appLogo} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    I
                  </div>
                )}
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Inventara</h1>
              </div>
            ) : (
              appLogo ? (
                <img src={appLogo} alt="Logo" className="w-8 h-8 object-contain rounded-lg mx-auto" />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mx-auto shadow-sm">
                  I
                </div>
              )
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
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
                  className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'}`} />
                  {sidebarOpen && <span className="ml-3 text-sm">{item.name}</span>}
                </button>
              );
            })}
          </nav>

          {/* Logout Area */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-red-600 rounded-lg hover:bg-red-50 transition group"
            >
              <LogOut size={20} className="flex-shrink-0 text-red-500 group-hover:text-red-600" />
              {sidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <nav className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Menu size={20} />
            </button>
          </div>
          
          <div className="flex-1"></div>

          <div className="flex items-center space-x-3">
            <NotificationBell />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">Admin Gudang</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
              <User size={20} />
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}