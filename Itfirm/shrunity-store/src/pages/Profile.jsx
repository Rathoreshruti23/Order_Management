import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const name = user?.fullName || user?.name || 'Your account';

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="section-title">Profile</h1>
      <div className="mt-8 rounded-3xl bg-white p-6 sm:p-8">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blush-100 font-display text-3xl font-semibold" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
          )}
          <div className="min-w-0">
            <p className="font-display text-2xl font-semibold">{name}</p>
            <p className="truncate text-sm text-ink-soft">{user?.email}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/orders" className="btn btn-soft"><Package className="h-4 w-4" aria-hidden="true" />View orders</Link>
          <button type="button" onClick={() => { signOut(); navigate('/'); }} className="btn btn-outline"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>
        </div>
      </div>
    </div>
  );
}
