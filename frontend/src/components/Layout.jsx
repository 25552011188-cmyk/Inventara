import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
    LayoutDashboard,
    Package,
    PackagePlus,
    PackageMinus,
    Tag,
    Building2,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    User,
    Settings,
    X,
} from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [appLogo, setAppLogo] = useState(null);

    useEffect(() => {
        api.get("/settings")
            .then((res) => {
                if (res.data.logo_url) setAppLogo(res.data.logo_url);
            })
            .catch((e) => console.error(e));
    }, []);

    // Tutup mobile menu saat navigasi
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Barang", path: "/barang", icon: Package },
        { name: "Barang Masuk", path: "/barang-masuk", icon: PackagePlus },
        { name: "Barang Keluar", path: "/barang-keluar", icon: PackageMinus },
        { name: "Kategori", path: "/categories", icon: Tag },
        { name: "Supplier", path: "/suppliers", icon: Building2 },
        { name: "Pengaturan", path: "/settings", icon: Settings },
    ];

    const smoothEasing = "duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            {/* Mobile Overlay Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Desktop (lg ke atas) */}
            <aside
                className={`hidden lg:block fixed top-0 left-0 z-40 h-screen transition-[width] ${smoothEasing} ${sidebarOpen ? "w-64" : "w-20"} bg-white/90 backdrop-blur-xl border-r border-gray-100 shadow-sm`}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                        <div
                            className={`flex items-center transition-opacity ${smoothEasing} ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
                        >
                            {appLogo ? (
                                <img
                                    src={appLogo}
                                    alt="Logo"
                                    className="w-8 h-8 object-contain rounded-lg"
                                />
                            ) : (
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    I
                                </div>
                            )}
                            <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight whitespace-nowrap">
                                Inventara
                            </h1>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                        >
                            {sidebarOpen ? (
                                <ChevronLeft size={18} />
                            ) : (
                                <ChevronRight size={18} />
                            )}
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`flex items-center w-full px-3 py-2.5 rounded-xl transition-colors duration-200 group ${
                                        isActive
                                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <Icon
                                        size={20}
                                        className={`flex-shrink-0 transition-transform duration-200 ${isActive ? "text-indigo-600 scale-110" : "text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5"}`}
                                    />
                                    <span
                                        className={`ml-3 text-sm whitespace-nowrap transition-opacity ${smoothEasing} ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
                                    >
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-3 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2.5 text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200 group"
                        >
                            <LogOut
                                size={20}
                                className="flex-shrink-0 text-red-500 group-hover:text-red-600 group-hover:-translate-x-0.5 transition-transform duration-200"
                            />
                            <span
                                className={`ml-3 text-sm font-medium whitespace-nowrap transition-opacity ${smoothEasing} ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
                            >
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Sidebar Mobile (Drawer Overlay) */}
            <aside
                className={`lg:hidden fixed top-0 left-0 z-50 h-screen w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            {appLogo ? (
                                <img
                                    src={appLogo}
                                    alt="Logo"
                                    className="w-8 h-8 object-contain rounded-lg"
                                />
                            ) : (
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    I
                                </div>
                            )}
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Inventara
                            </h1>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`flex items-center w-full px-3 py-3 rounded-xl transition-colors duration-200 ${
                                        isActive
                                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 font-semibold"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon
                                        size={20}
                                        className={
                                            isActive
                                                ? "text-indigo-600"
                                                : "text-gray-400"
                                        }
                                    />
                                    <span className="ml-3 text-sm font-medium">
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-3 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={20} className="text-red-500" />
                            <span className="ml-3 text-sm font-medium">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`transition-[margin] ${smoothEasing} ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} ml-0`}
            >
                <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center space-x-4">
                        {/* Hamburger Button - Only visible on mobile */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex items-center space-x-3 lg:space-x-4">
                        <NotificationBell />
                        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-800 leading-tight">
                                    Admin Gudang
                                </p>
                                <p className="text-xs text-gray-500">
                                    Administrator
                                </p>
                            </div>
                            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white transition-transform duration-200 hover:scale-105 cursor-pointer">
                                <User
                                    size={16}
                                    className="lg:w-[18px] lg:h-[18px]"
                                />
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
