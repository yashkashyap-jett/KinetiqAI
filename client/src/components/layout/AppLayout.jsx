import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <main className="lg:ml-60 min-h-screen pb-20 lg:pb-0">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
