import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  TrendingUp,
  Brain,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/workout', label: 'Workout', Icon: Dumbbell },
  { path: '/nutrition', label: 'Nutrition', Icon: Apple },
  { path: '/progress', label: 'Progress', Icon: TrendingUp },
  { path: '/ai-coach', label: 'Coach', Icon: Brain },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-surface border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] transition-colors ${
                isActive
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
