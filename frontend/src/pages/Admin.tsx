import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllBookings, useConfirmBooking, useRejectBooking, useDeleteBooking } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { BookingStatus, Booking } from '../backend';
import {
  Shield, RefreshCw, CheckCircle, XCircle, Trash2,
  Users, Calendar, Clock, Phone, MessageSquare, LogIn, Loader2,
  CreditCard, Building2, ChevronDown, ChevronUp, Image
} from 'lucide-react';

const ADMIN_PASSWORD = 'pindpahadi2024';

export default function Admin() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const { actor, isFetching: actorFetching } = useActor();

  const [step, setStep] = useState<'password' | 'dashboard'>('password');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const queryClient = useQueryClient();

  const {
    data: bookings,
    isLoading: bookingsLoading,
    isError: bookingsError,
    error: bookingsErrorObj,
    refetch: refetchBookings,
  } = useGetAllBookings();

  const confirmBooking = useConfirmBooking();
  const rejectBooking = useRejectBooking();
  const deleteBooking = useDeleteBooking();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setStep('dashboard');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['allBookings'] });
    refetchBookings();
  };

  const toggleRow = (idx: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.confirmed:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Confirmed</span>;
      case BookingStatus.rejected:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3" />Pending</span>;
    }
  };

  // Step 1: Login gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream-light flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-10 max-w-sm w-full text-center">
          <Shield className="w-14 h-14 text-brand-brown mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brand-brown font-poppins mb-2">Admin Access</h1>
          <p className="text-brand-brown/60 text-sm mb-6">Log in with your identity to access the dashboard</p>
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 bg-brand-brown text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-brown/90 transition-colors disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? 'Logging in…' : 'Log In'}
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Password gate
  if (step === 'password') {
    return (
      <div className="min-h-screen bg-brand-cream-light flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-10 max-w-sm w-full">
          <Shield className="w-14 h-14 text-brand-brown mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brand-brown font-poppins mb-2 text-center">Admin Password</h1>
          <p className="text-brand-brown/60 text-sm mb-6 text-center">Enter the admin password to continue</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-brand-brown/20 rounded-xl px-4 py-3 text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-brown/30"
            />
            {passwordError && (
              <p className="text-red-600 text-sm">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-brand-brown text-white py-3 rounded-full font-bold hover:bg-brand-brown/90 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 3: Dashboard
  const allBookings = bookings ?? [];
  const pendingCount = allBookings.filter(b => b.status === BookingStatus.pending).length;
  const confirmedCount = allBookings.filter(b => b.status === BookingStatus.confirmed).length;
  const rejectedCount = allBookings.filter(b => b.status === BookingStatus.rejected).length;

  const isActorReady = !!actor && !actorFetching;

  return (
    <div className="min-h-screen bg-brand-cream-light">
      {/* Header */}
      <div className="bg-brand-brown text-white px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7" />
          <div>
            <h1 className="text-xl font-bold font-poppins">Pind Pahadi Admin</h1>
            <p className="text-brand-cream/70 text-xs">Reservations Dashboard</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={bookingsLoading || actorFetching}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${bookingsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: allBookings.length, color: 'text-brand-brown', bg: 'bg-white' },
            { label: 'Pending', value: pendingCount, color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Confirmed', value: confirmedCount, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Rejected', value: rejectedCount, color: 'text-red-700', bg: 'bg-red-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl shadow-card p-5 text-center`}>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-brand-brown/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Actor not ready warning */}
        {!isActorReady && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3 text-yellow-800 text-sm">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Connecting to backend… Please wait before refreshing.</span>
          </div>
        )}

        {/* Error state */}
        {bookingsError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <p className="font-semibold mb-1">Failed to load bookings</p>
            <p className="text-xs opacity-80">{bookingsErrorObj instanceof Error ? bookingsErrorObj.message : 'Unknown error'}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-red-700 underline text-xs hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-brown/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-brown font-poppins">All Reservations</h2>
            {bookingsLoading && (
              <div className="flex items-center gap-2 text-brand-brown/50 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading…
              </div>
            )}
          </div>

          {bookingsLoading && allBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-brown/40 mx-auto mb-3" />
              <p className="text-brand-brown/50">Loading reservations…</p>
            </div>
          ) : !bookingsLoading && !bookingsError && allBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-brand-brown/20 mx-auto mb-3" />
              <p className="text-brand-brown/50 font-medium">No reservations yet</p>
              <p className="text-brand-brown/30 text-sm mt-1">Bookings will appear here once customers submit them</p>
              <button
                onClick={handleRefresh}
                className="mt-4 text-brand-brown/50 underline text-sm hover:text-brand-brown transition-colors"
              >
                Refresh to check for new bookings
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-cream/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-brand-brown/70 font-semibold w-8">#</th>
                    <th className="text-left px-4 py-3 text-brand-brown/70 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 text-brand-brown/70 font-semibold">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />Phone</span>
                    </th>
                    <th className="text-left px-4 py-3 text-brand-brown/70 font-semibold">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Guests</span>
                    </th>
                    <th className="text-left px-4 py-3 text-brand-brown/70 font-semibold">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Date</span>
                    </th>
                    <th className="text-left px-4 py-3 text-brand-brown/70 font-semibold">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Time</span>
                    </th>
                    <th className="text-left px-4 py-3 text-brand-brown/70 font-semibold">Status</th>
                    <th className="text-left px-4 py-3 text-brand-brown/70 font-semibold">Payment</th>
                    <th className="text-left px-4 py-3 text-brand-brown/70 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-brown/5">
                  {allBookings.map((booking: Booking, idx: number) => (
                    <React.Fragment key={idx}>
                      <tr className="hover:bg-brand-cream/20 transition-colors">
                        <td className="px-4 py-3 text-brand-brown/40 font-mono text-xs">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-brand-brown">{booking.name}</td>
                        <td className="px-4 py-3 text-brand-brown/70">{booking.phone}</td>
                        <td className="px-4 py-3 text-brand-brown/70">{booking.guests.toString()}</td>
                        <td className="px-4 py-3 text-brand-brown/70">{booking.date}</td>
                        <td className="px-4 py-3 text-brand-brown/70">{booking.time}</td>
                        <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleRow(idx)}
                            className="flex items-center gap-1 text-brand-brown/60 hover:text-brand-brown text-xs font-medium transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            ₹{booking.paymentDetails.advanceAmount.toString()}
                            {expandedRows.has(idx) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {booking.status !== BookingStatus.confirmed && (
                              <button
                                onClick={() => confirmBooking.mutate(BigInt(idx))}
                                disabled={confirmBooking.isPending}
                                title="Confirm"
                                className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {booking.status !== BookingStatus.rejected && (
                              <button
                                onClick={() => rejectBooking.mutate(BigInt(idx))}
                                disabled={rejectBooking.isPending}
                                title="Reject"
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteBooking.mutate(BigInt(idx))}
                              disabled={deleteBooking.isPending}
                              title="Delete"
                              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Expanded payment + notes row */}
                      {expandedRows.has(idx) && (
                        <tr className="bg-brand-cream/30">
                          <td colSpan={9} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {/* Payment Details */}
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-brand-brown/50 uppercase tracking-wide flex items-center gap-1">
                                  <CreditCard className="w-3 h-3" /> Payment Details
                                </p>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-brand-brown/60">Method:</span>
                                    <span className="font-medium text-brand-brown">{booking.paymentDetails.paymentMethod}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-brand-brown/60">Advance:</span>
                                    <span className="font-bold text-brand-brown">₹{booking.paymentDetails.advanceAmount.toString()}</span>
                                  </div>
                                  {booking.paymentDetails.upiDetails && booking.paymentDetails.upiDetails !== 'Not specified' && (
                                    <div className="flex justify-between gap-2">
                                      <span className="text-brand-brown/60 shrink-0">UPI/Txn:</span>
                                      <span className="font-medium text-brand-brown text-right break-all">{booking.paymentDetails.upiDetails}</span>
                                    </div>
                                  )}
                                  {booking.paymentDetails.bankDetails && booking.paymentDetails.bankDetails !== 'Not specified' && (
                                    <div className="flex justify-between gap-2">
                                      <span className="text-brand-brown/60 shrink-0">Bank Ref:</span>
                                      <span className="font-medium text-brand-brown text-right break-all">{booking.paymentDetails.bankDetails}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Screenshot */}
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-brand-brown/50 uppercase tracking-wide flex items-center gap-1">
                                  <Image className="w-3 h-3" /> Screenshot
                                </p>
                                {booking.screenshotFileName ? (
                                  <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-brand-brown/10">
                                    <Image className="w-4 h-4 text-brand-brown/50 shrink-0" />
                                    <span className="text-brand-brown/70 text-xs break-all">{booking.screenshotFileName}</span>
                                  </div>
                                ) : (
                                  <p className="text-brand-brown/40 text-xs italic">No screenshot uploaded</p>
                                )}
                              </div>

                              {/* Special Request */}
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-brand-brown/50 uppercase tracking-wide flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" /> Special Request
                                </p>
                                <p className="text-brand-brown/70 text-xs">
                                  {booking.specialRequest || <span className="italic text-brand-brown/30">None</span>}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer summary */}
        {allBookings.length > 0 && (
          <p className="text-center text-brand-brown/40 text-xs mt-6">
            {allBookings.length} total reservation{allBookings.length !== 1 ? 's' : ''} · {pendingCount} pending · {confirmedCount} confirmed · {rejectedCount} rejected
          </p>
        )}
      </div>
    </div>
  );
}
