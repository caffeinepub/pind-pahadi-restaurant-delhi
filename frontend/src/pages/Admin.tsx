import { useState } from 'react';
import {
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Lock,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { useGetAllBookings } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Hardcoded admin password — frontend gate only
const ADMIN_PASSWORD = 'PindPahadi@2024';

type AdminStep = 'password' | 'login' | 'dashboard';

export default function Admin() {
  const [step, setStep] = useState<AdminStep>('password');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { login, loginStatus, clear, identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: bookings, isLoading, isError, error, refetch } = useGetAllBookings(
    step === 'dashboard' && isAuthenticated
  );

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setPasswordError('');
      if (isAuthenticated) {
        setStep('dashboard');
      } else {
        setStep('login');
      }
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogin = async () => {
    try {
      await login();
      setStep('dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'User is already authenticated') {
        setStep('dashboard');
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setStep('password');
    setPassword('');
    setPasswordError('');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex items-center gap-3 text-brown">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="font-poppins">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin Header Bar */}
      <div className="bg-brown text-cream shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mustard rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-brown" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-base sm:text-lg text-cream leading-tight">
                Pind Pahadi Admin
              </h1>
              <p className="text-cream/60 text-xs">Booking Management Dashboard</p>
            </div>
          </div>
          {step === 'dashboard' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-cream/30 text-cream bg-transparent hover:bg-cream/10 hover:text-cream gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Step 1: Password Gate ── */}
        {step === 'password' && (
          <div className="max-w-md mx-auto mt-10">
            <div className="bg-white rounded-2xl shadow-card p-8 border border-brown/10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-mustard/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-brown" />
                </div>
                <h2 className="font-poppins font-bold text-2xl text-brown mb-2">Admin Access</h2>
                <p className="text-brown/50 text-sm">Enter the admin password to continue</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="pr-10 border-brown/20 focus-visible:ring-mustard/40 font-poppins"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-sm">{passwordError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-brown hover:bg-brown/90 text-cream font-poppins font-semibold"
                  disabled={!password}
                >
                  Continue
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ── Step 2: Identity Login ── */}
        {step === 'login' && (
          <div className="max-w-md mx-auto mt-10">
            <div className="bg-white rounded-2xl shadow-card p-8 border border-brown/10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-mustard/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-brown" />
                </div>
                <h2 className="font-poppins font-bold text-2xl text-brown mb-2">Verify Identity</h2>
                <p className="text-brown/50 text-sm">
                  Sign in to securely access the bookings data
                </p>
              </div>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-700 text-sm">
                      ✓ Already signed in. Click below to view bookings.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={() => setStep('dashboard')}
                    className="w-full bg-brown hover:bg-brown/90 text-cream font-poppins font-semibold"
                  >
                    View Bookings
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-brown/50 text-sm text-center">
                    A secure sign-in is required to fetch booking records from the backend.
                  </p>
                  <Button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="w-full bg-brown hover:bg-brown/90 text-cream font-poppins font-semibold gap-2"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      'Sign In to Continue'
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep('password')}
                    className="w-full text-brown/50 hover:text-brown font-poppins text-sm"
                  >
                    ← Back
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3: Dashboard ── */}
        {step === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-card p-5 border border-brown/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-mustard/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-brown" />
                </div>
                <div>
                  <p className="text-brown/50 text-xs font-poppins uppercase tracking-wide">
                    Total Bookings
                  </p>
                  <p className="font-poppins font-bold text-2xl text-brown">
                    {isLoading ? '—' : (bookings?.length ?? 0)}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-card p-5 border border-brown/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-red" />
                </div>
                <div>
                  <p className="text-brown/50 text-xs font-poppins uppercase tracking-wide">
                    Latest Date
                  </p>
                  <p className="font-poppins font-semibold text-sm text-brown">
                    {isLoading
                      ? '—'
                      : bookings && bookings.length > 0
                      ? bookings[bookings.length - 1].date
                      : 'No bookings'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-card p-5 border border-brown/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-brown/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-brown" />
                </div>
                <div>
                  <p className="text-brown/50 text-xs font-poppins uppercase tracking-wide">
                    Total Guests
                  </p>
                  <p className="font-poppins font-bold text-2xl text-brown">
                    {isLoading
                      ? '—'
                      : bookings?.reduce((sum, b) => sum + Number(b.guests), 0) ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Bookings Table Card */}
            <div className="bg-white rounded-2xl shadow-card border border-brown/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-brown/10 flex items-center justify-between">
                <div>
                  <h2 className="font-poppins font-bold text-lg text-brown">All Reservations</h2>
                  <p className="text-brown/40 text-sm">Complete list of table booking submissions</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="border-brown/20 text-brown hover:bg-brown/5 gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-16 gap-3 text-brown/50">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="font-poppins">Loading bookings…</span>
                </div>
              )}

              {/* Error state */}
              {isError && (
                <div className="p-6">
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to load bookings. Make sure you are signed in as an admin.
                      {error instanceof Error && (
                        <span className="block text-xs mt-1 opacity-70">{error.message}</span>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !isError && bookings && bookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <BookOpen className="w-12 h-12 text-brown/20" />
                  <p className="font-poppins font-medium text-brown/40">No bookings yet</p>
                  <p className="text-sm text-brown/30 text-center max-w-xs">
                    Reservations will appear here once customers submit the booking form.
                  </p>
                </div>
              )}

              {/* Table */}
              {!isLoading && !isError && bookings && bookings.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-cream/60 hover:bg-cream/60">
                        <TableHead className="font-poppins font-semibold text-brown whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            Name
                          </span>
                        </TableHead>
                        <TableHead className="font-poppins font-semibold text-brown whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            Phone
                          </span>
                        </TableHead>
                        <TableHead className="font-poppins font-semibold text-brown whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            Guests
                          </span>
                        </TableHead>
                        <TableHead className="font-poppins font-semibold text-brown whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Date
                          </span>
                        </TableHead>
                        <TableHead className="font-poppins font-semibold text-brown whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Time
                          </span>
                        </TableHead>
                        <TableHead className="font-poppins font-semibold text-brown whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Special Request
                          </span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-cream/30 transition-colors border-brown/5"
                        >
                          <TableCell className="font-poppins font-medium text-brown">
                            {booking.name}
                          </TableCell>
                          <TableCell className="font-poppins text-brown/70">
                            <a
                              href={`tel:${booking.phone}`}
                              className="hover:text-mustard transition-colors"
                            >
                              {booking.phone}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-mustard/20 text-brown border border-mustard/30 font-poppins font-semibold hover:bg-mustard/30">
                              {Number(booking.guests)} pax
                            </Badge>
                          </TableCell>
                          <TableCell className="font-poppins text-brown/70 whitespace-nowrap">
                            {booking.date}
                          </TableCell>
                          <TableCell className="font-poppins text-brown/70 whitespace-nowrap">
                            {booking.time}
                          </TableCell>
                          <TableCell className="font-poppins text-brown/60 max-w-xs">
                            {booking.specialRequest ? (
                              <span
                                className="block truncate max-w-[200px]"
                                title={booking.specialRequest}
                              >
                                {booking.specialRequest}
                              </span>
                            ) : (
                              <span className="text-brown/30 italic text-sm">None</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Footer note */}
            <p className="text-center text-brown/30 text-xs font-poppins pb-4">
              Showing all {bookings?.length ?? 0} booking
              {(bookings?.length ?? 0) !== 1 ? 's' : ''} · Sorted by date
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
