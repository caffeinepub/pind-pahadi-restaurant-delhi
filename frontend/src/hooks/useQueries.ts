import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSubmitBooking() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      guests: number;
      date: string;
      time: string;
      specialRequest: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.submitBooking(
        data.name,
        data.phone,
        BigInt(data.guests),
        data.date,
        data.time,
        data.specialRequest
      );
      return result;
    },
  });
}
