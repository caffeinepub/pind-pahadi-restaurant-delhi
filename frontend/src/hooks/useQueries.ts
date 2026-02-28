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

      let lastError: Error | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
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
        } catch (err: unknown) {
          lastError = err instanceof Error ? err : new Error(String(err));
          const msg = lastError.message.toLowerCase();
          if (msg.includes('connection not ready') || msg.includes('actor') || msg.includes('network')) {
            await new Promise((res) => setTimeout(res, 1500 * (attempt + 1)));
            continue;
          }
          throw lastError;
        }
      }
      throw lastError ?? new Error('Failed after retries');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
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
    queryKey: ['allBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: enabled && !!actor && !actorFetching,
  });
}
