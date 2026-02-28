import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Booking } from '../backend';

export function useSubmitBooking() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      guests: number;
      date: string;
      time: string;
      specialRequest: string;
      screenshotFileName?: string | null;
    }) => {
      if (!actor) throw new Error('Connection not ready. Please wait a moment and try again.');

      const result = await actor.submitBooking(
        data.name,
        data.phone,
        BigInt(data.guests),
        data.date,
        data.time,
        data.specialRequest,
        data.screenshotFileName ?? null
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  return {
    ...mutation,
    actorFetching,
  };
}

export function useGetAllBookings(enabled = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBookings();
    },
    enabled: enabled && !!actor && !actorFetching,
    retry: 1,
  });
}

export function useConfirmBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      await actor.confirmBooking(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useRejectBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      await actor.rejectBooking(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useDeleteBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteBooking(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
