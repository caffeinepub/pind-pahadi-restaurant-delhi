import { useMutation, useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Booking } from '../backend';

export function useSubmitBooking() {
  const { actor, isFetching: actorFetching } = useActor();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      guests: number;
      date: string;
      time: string;
      specialRequest: string;
      screenshotFileName?: string | null;
    }) => {
      // If actor is still initializing, wait and retry
      if (!actor) {
        throw new Error('Connection not ready. Please wait a moment and try again.');
      }
      const result = await actor.submitBooking(
        data.name,
        data.phone,
        BigInt(data.guests),
        data.date,
        data.time,
        data.specialRequest,
        data.screenshotFileName ?? null,
      );
      return result;
    },
    retry: (failureCount, error) => {
      // Retry up to 3 times if actor is not ready yet
      const message = error instanceof Error ? error.message : '';
      if (message.includes('Connection not ready') && failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: 1500,
    meta: { actorFetching },
  });
}

export function useGetAllBookings(enabled: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['allBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching && enabled,
    retry: false,
  });
}
