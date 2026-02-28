import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllBookings, useConfirmBooking, useRejectBooking, useDeleteBooking } from '../hooks/useQueries';
import { BookingStatus } from '../backend';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Trash2, ChevronDown, ChevronUp, RefreshCw, LogOut, Lock, Eye, EyeOff } from 'lucide-react';

const ADMIN_PASSWORD = 'pindpahadi2024';

export default function Admin() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');

  const { data: bookings = [], isLoading, isError, refetch, isFetching } = useGetAllBookings();
  const confirmMutation = useConfirmBooking();
  const rejectMutation = useRejectBooking();
  const deleteMutation = useDeleteBooking();

  const handleLogin = async () => {
    try {
      await login();
    } catch (e) {
      console.error('Login error', e);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = async () => {
    await clear();
    setIsAuthenticated(false);
    setPassword('');
  };

  // Not logged in with Internet Identity
  if (!identity) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-card border border-mustard/30 max-w-sm w-full p-8 text-center">
          <div className="w-16 h-16 bg-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-brown" />
          </div>
          <h1 className="text-2xl font-bold text-brown font-poppins mb-2">Admin Access</h1>
          <p className="text-brown/60 text-sm mb-6">Sign in with Internet Identity to access the dashboard</p>
          <Button
            onClick={handleLogin}
            disabled={loginStatus === 'logging-in'}
            className="w-full bg-brown hover:bg-brown/90 text-white font-semibold py-3 rounded-xl"
          >
            {loginStatus === 'logging-in' ? 'Signing in…' : 'Sign In with Internet Identity'}
          </Button>
        </div>
      </div>
    );
  }

  // Logged in but password not verified
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-card border border-mustard/30 max-w-sm w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-brown" />
            </div>
            <h1 className="text-2xl font-bold text-brown font-poppins">Admin Password</h1>
            <p className="text-brown/60 text-sm mt-1">Enter the admin password to continue</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full border border-mustard/40 rounded-xl px-4 py-3 text-brown focus:outline-none focus:ring-2 focus:ring-mustard/50 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <Button type="submit" className="w-full bg-brown hover:bg-brown/90 text-white font-semibold py-3 rounded-xl">
              Access Dashboard
            </Button>
          </form>
          <button
            onClick={handleLogout}
            className="mt-4 w-full text-center text-sm text-brown/50 hover:text-brown"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter(b => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return b.status === BookingStatus.pending;
    if (statusFilter === 'confirmed') return b.status === BookingStatus.confirmed;
    if (statusFilter === 'rejected') return b.status === BookingStatus.rejected;
    return true;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === BookingStatus.pending).length,
    confirmed: bookings.filter(b => b.status === BookingStatus.confirmed).length,
    rejected: bookings.filter(b => b.status === BookingStatus.rejected).length,
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.confirmed:
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case BookingStatus.rejected:
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Bar */}
      <div className="bg-brown text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-poppins">🍽️ Pind Pahadi – Admin</h1>
          <p className="text-white/60 text-xs mt-0.5">Booking Management Dashboard</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: stats.total, color: 'text-brown' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-700' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-green-700' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-700' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-mustard/20 p-4 shadow-sm">
              <p className="text-brown/60 text-xs font-medium uppercase tracking-wide">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Refresh */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'confirmed', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  statusFilter === f
                    ? 'bg-brown text-white'
                    : 'bg-white border border-mustard/30 text-brown hover:bg-mustard/10'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-mustard/40 text-brown hover:bg-mustard/10 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-mustard/20 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-12 text-center">
              <p className="text-red-500 font-medium">Failed to load bookings.</p>
              <p className="text-brown/50 text-sm mt-1">You may not have admin permissions, or there was a network error.</p>
              <Button onClick={() => refetch()} variant="outline" className="mt-4 border-mustard/40 text-brown">
                Try Again
              </Button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-brown/50 text-lg">No bookings found</p>
              <p className="text-brown/30 text-sm mt-1">
                {statusFilter !== 'all' ? `No ${statusFilter} bookings yet.` : 'No bookings have been submitted yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-mustard/10 hover:bg-mustard/10">
                    <TableHead className="text-brown font-bold">#</TableHead>
                    <TableHead className="text-brown font-bold">Name</TableHead>
                    <TableHead className="text-brown font-bold">Phone</TableHead>
                    <TableHead className="text-brown font-bold">Date</TableHead>
                    <TableHead className="text-brown font-bold">Time</TableHead>
                    <TableHead className="text-brown font-bold">Guests</TableHead>
                    <TableHead className="text-brown font-bold">Advance</TableHead>
                    <TableHead className="text-brown font-bold">Status</TableHead>
                    <TableHead className="text-brown font-bold">Actions</TableHead>
                    <TableHead className="text-brown font-bold">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking, idx) => (
                    <React.Fragment key={idx}>
                      <TableRow className="hover:bg-mustard/5 transition-colors">
                        <TableCell className="text-brown/50 text-sm font-mono">{idx + 1}</TableCell>
                        <TableCell className="font-semibold text-brown">{booking.name}</TableCell>
                        <TableCell className="text-brown/70 text-sm">{booking.phone}</TableCell>
                        <TableCell className="text-brown/70 text-sm">{booking.date}</TableCell>
                        <TableCell className="text-brown/70 text-sm">{booking.time}</TableCell>
                        <TableCell className="text-brown/70 text-sm">{booking.guests.toString()}</TableCell>
                        <TableCell className="text-brown font-semibold text-sm">
                          ₹{booking.paymentDetails.advanceAmount.toString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {booking.status === BookingStatus.pending && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => confirmMutation.mutate(BigInt(idx))}
                                  disabled={confirmMutation.isPending}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1.5 h-auto"
                                  title="Confirm"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => rejectMutation.mutate(BigInt(idx))}
                                  disabled={rejectMutation.isPending}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 h-auto"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-brown/40 hover:text-red-500 hover:bg-red-50 p-1.5 h-auto"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Booking?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the booking for <strong>{booking.name}</strong> on {booking.date}. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(BigInt(idx))}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                            className="text-brown/40 hover:text-brown transition-colors"
                          >
                            {expandedRow === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row */}
                      {expandedRow === idx && (
                        <TableRow className="bg-mustard/5 hover:bg-mustard/5">
                          <TableCell colSpan={10} className="py-4 px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="font-bold text-brown/60 uppercase text-xs tracking-wider mb-2">Payment Info</p>
                                <p className="text-brown"><span className="text-brown/60">Method:</span> {booking.paymentDetails.paymentMethod}</p>
                                {booking.paymentDetails.upiDetails && (
                                  <p className="text-brown"><span className="text-brown/60">UPI Ref:</span> {booking.paymentDetails.upiDetails}</p>
                                )}
                                {booking.paymentDetails.bankDetails && (
                                  <p className="text-brown"><span className="text-brown/60">Bank Ref:</span> {booking.paymentDetails.bankDetails}</p>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-brown/60 uppercase text-xs tracking-wider mb-2">Screenshot</p>
                                <p className="text-brown">
                                  {booking.screenshotFileName ? booking.screenshotFileName : <span className="text-brown/40 italic">Not provided</span>}
                                </p>
                              </div>
                              <div>
                                <p className="font-bold text-brown/60 uppercase text-xs tracking-wider mb-2">Special Request</p>
                                <p className="text-brown">
                                  {booking.specialRequest || <span className="text-brown/40 italic">None</span>}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-brown/30 text-xs pb-4">
          Pind Pahadi Admin Dashboard · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
