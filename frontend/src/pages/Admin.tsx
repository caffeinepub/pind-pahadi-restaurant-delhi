import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllBookings } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Lock, LogOut, Users, Calendar, Clock, Phone, FileText, CreditCard, Trash2, RefreshCw, Eye } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import type { Booking } from '../backend';

const ADMIN_PASSWORD = 'pindpahadi2024';

type Step = 'password' | 'identity' | 'dashboard';

export default function Admin() {
  const [step, setStep] = useState<Step>('password');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { actor } = useActor();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: bookings = [], isLoading: bookingsLoading, refetch } = useGetAllBookings(
    step === 'dashboard' && isAuthenticated
  );

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setPasswordError('');
      setStep('identity');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      await login();
      setStep('dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setStep('password');
    setPasswordInput('');
  };

  const handleClearBookings = async () => {
    if (!actor) return;
    setClearing(true);
    try {
      await actor.clearAllBookings();
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      setClearConfirm(false);
    } catch (err) {
      console.error('Clear error:', err);
    } finally {
      setClearing(false);
    }
  };

  const formatDeposit = (deposit: bigint | number) => {
    return `₹${deposit.toString()}`;
  };

  const formatGuests = (guests: bigint | number) => {
    return guests.toString();
  };

  // ── Password Gate ──────────────────────────────────────────────────────────
  if (step === 'password') {
    return (
      <div className="min-h-screen bg-brown-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-brown-100 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-7 h-7 text-brown-700" />
            </div>
            <h1 className="font-display text-2xl font-bold text-brown-800">Admin Access</h1>
            <p className="text-brown-500 text-sm mt-1">Pind Pahadi Restaurant</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border border-cream-300 rounded-lg px-4 py-2.5 text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-400"
                placeholder="Enter admin password"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-brown-700 hover:bg-brown-800 text-cream-50 py-2.5 rounded-lg font-semibold transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Identity Login ─────────────────────────────────────────────────────────
  if (step === 'identity') {
    return (
      <div className="min-h-screen bg-brown-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="w-14 h-14 bg-mustard-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-mustard-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-brown-800 mb-2">Verify Identity</h2>
          <p className="text-brown-500 text-sm mb-6">
            Please log in with Internet Identity to access the admin dashboard.
          </p>
          {isAuthenticated ? (
            <div className="space-y-3">
              <p className="text-green-600 font-medium">✅ Logged in successfully!</p>
              <button
                onClick={() => setStep('dashboard')}
                className="w-full bg-brown-700 hover:bg-brown-800 text-cream-50 py-2.5 rounded-lg font-semibold transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-mustard-500 hover:bg-mustard-600 disabled:opacity-60 text-brown-900 py-2.5 rounded-lg font-semibold transition-colors"
            >
              {isLoggingIn ? 'Logging in…' : 'Login with Internet Identity'}
            </button>
          )}
          <button
            onClick={() => setStep('password')}
            className="mt-3 text-sm text-brown-400 hover:text-brown-600 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  const totalGuests = bookings.reduce((sum, b) => sum + Number(b.guests), 0);
  const totalDeposits = bookings.reduce((sum, b) => sum + Number(b.deposit), 0);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top Bar */}
      <header className="bg-brown-800 text-cream-50 px-4 py-4 flex items-center justify-between shadow-md">
        <div>
          <h1 className="font-display text-xl font-bold">Pind Pahadi — Admin</h1>
          <p className="text-cream-300 text-xs mt-0.5">Reservations Dashboard</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-brown-700 hover:bg-brown-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-brown-700' },
            { label: 'Total Guests', value: totalGuests, icon: Users, color: 'text-mustard-600' },
            { label: 'Total Deposits', value: `₹${totalDeposits}`, icon: CreditCard, color: 'text-green-600' },
            { label: 'Today', value: bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length, icon: Clock, color: 'text-red-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-card p-4 flex items-center gap-3">
              <stat.icon className={`w-8 h-8 ${stat.color} flex-shrink-0`} />
              <div>
                <p className="text-2xl font-bold text-brown-800">{stat.value}</p>
                <p className="text-xs text-brown-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-display text-xl font-bold text-brown-800">All Reservations</h2>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 bg-white border border-cream-300 hover:bg-cream-50 text-brown-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            {!clearConfirm ? (
              <button
                onClick={() => setClearConfirm(true)}
                className="flex items-center gap-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleClearBookings}
                  disabled={clearing}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  {clearing ? 'Clearing…' : 'Confirm Clear'}
                </button>
                <button
                  onClick={() => setClearConfirm(false)}
                  className="bg-white border border-cream-300 text-brown-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {bookingsLoading ? (
          <div className="bg-white rounded-xl shadow-card p-12 text-center">
            <RefreshCw className="w-8 h-8 text-brown-400 animate-spin mx-auto mb-3" />
            <p className="text-brown-500">Loading reservations…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-12 text-center">
            <Calendar className="w-12 h-12 text-cream-300 mx-auto mb-3" />
            <p className="text-brown-500 font-medium">No reservations yet</p>
            <p className="text-brown-400 text-sm mt-1">Bookings will appear here once customers submit them.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brown-800 text-cream-50">
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Name</span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date</span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Time</span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Guests</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Deposit</span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Special Request</span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Screenshot</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: Booking, index: number) => (
                    <tr
                      key={index}
                      className={`border-b border-cream-100 hover:bg-cream-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-cream-50/50'
                      }`}
                    >
                      <td className="px-4 py-3 text-brown-400 font-mono text-xs">{index + 1}</td>
                      <td className="px-4 py-3 font-semibold text-brown-800 whitespace-nowrap">
                        {booking.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-brown-600 whitespace-nowrap">
                        {booking.phone ? (
                          <a href={`tel:${booking.phone}`} className="hover:text-brown-800 underline underline-offset-2">
                            {booking.phone}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-brown-600 whitespace-nowrap">
                        {booking.date || '—'}
                      </td>
                      <td className="px-4 py-3 text-brown-600 whitespace-nowrap">
                        {booking.time || '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-mustard-100 text-mustard-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {formatGuests(booking.guests)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-700 whitespace-nowrap">
                        {formatDeposit(booking.deposit)}
                      </td>
                      <td className="px-4 py-3 text-brown-500 max-w-[180px]">
                        <span className="block truncate" title={booking.specialRequest || ''}>
                          {booking.specialRequest || <span className="text-brown-300 italic">None</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {booking.screenshotFileName ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-xs font-medium">
                            <Eye className="w-3 h-3" />
                            {booking.screenshotFileName}
                          </span>
                        ) : (
                          <span className="text-brown-300 italic text-xs">No file</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-cream-50 border-t border-cream-200 text-xs text-brown-400">
              Showing {bookings.length} reservation{bookings.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
