import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  TrendingUp,
  Brain,
  Target,
  Trophy,
  Settings,
  LogOut,
  User,
  Activity,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Dumbbell,
  Apple,
  TrendingUp,
  Brain,
  Target,
  Trophy,
  Settings,
};

const mainNav = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/workout', label: 'Workout', icon: 'Dumbbell' },
  { path: '/nutrition', label: 'Nutrition', icon: 'Apple' },
  { path: '/progress', label: 'Progress', icon: 'TrendingUp' },
  { path: '/ai-coach', label: 'AI Coach', icon: 'Brain' },
];

const secondaryNav = [
  { path: '/habits', label: 'Habits', icon: 'Target' },
  { path: '/achievements', label: 'Achievements', icon: 'Trophy' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-bg-surface border-r border-border fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-accent flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight font-[var(--font-display)]" style={{ fontFamily: 'var(--font-display)' }}>
              KINETIQ
            </h1>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          Main
        </p>
        {mainNav.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accent-muted text-accent-text border-l-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-alt'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          );
        })}

        <div className="pt-4">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            More
          </p>
          {secondaryNav.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-accent-muted text-accent-text border-l-2 border-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-alt'
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-bg-surface-active flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-text-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-[var(--radius-sm)] text-text-muted hover:text-error hover:bg-error-muted transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
