import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut, Smartphone } from 'lucide-react';

export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] border-r border-slate-700 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Smartphone size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">MobileStore</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/inventory" icon={<Package size={20} />} label="Inventory" />
          <NavItem to="/sales" icon={<ShoppingCart size={20} />} label="New Sale" />
          <NavItem to="/reports" icon={<BarChart3 size={20} />} label="Reports" />
        </nav>

        <button className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Store Overview</h2>
            <p className="text-slate-400">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);
