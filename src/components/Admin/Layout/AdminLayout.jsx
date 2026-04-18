import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { 
  ChartBarIcon, 
  BriefcaseIcon, 
  ChatAlt2Icon, 
  CogIcon, 
  LogoutIcon,
  HomeIcon,
  BeakerIcon
} from '@heroicons/react/outline';

const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: <ChartBarIcon className="w-5 h-5" />, text: 'Dashboard', path: '/admin/dashboard' },
    { icon: <BriefcaseIcon className="w-5 h-5" />, text: 'Projets', path: '/admin/projects' },
    { icon: <BeakerIcon className="w-5 h-5" />, text: 'Compétences', path: '/admin/skills' },
    { icon: <ChatAlt2Icon className="w-5 h-5" />, text: 'Témoignages', path: '/admin/testimonials' },
    { icon: <CogIcon className="w-5 h-5" />, text: 'Paramètres', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f6] dark:bg-[#121212] flex transition-colors duration-500 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-80 h-screen sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-2xl border-r border-gray-200 dark:border-white/5 p-8 flex flex-col">
        <div className="mb-12">
          <h2 className="text-2xl font-black gradient-text tracking-tighter">J.ADMIN</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Console de Contrôle</p>
        </div>

        <nav className="flex-grow space-y-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.text}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm uppercase tracking-widest ${
                  isActive 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span>{item.text}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-8 border-t border-gray-200 dark:border-white/5">
          <NavLink
            to="/"
            className="flex items-center space-x-4 px-6 py-4 text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold text-sm uppercase tracking-widest"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Site Public</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-6 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest"
          >
            <LogoutIcon className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow h-screen overflow-y-auto p-12">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
