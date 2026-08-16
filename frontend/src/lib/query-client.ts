import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 0, // Always treat query data as stale so fresh data is fetched
      refetchOnMount: 'always', // Always refetch when components mount (e.g. on login/page load)
      refetchOnWindowFocus: true, // Auto refetch live data on window focus
      refetchOnReconnect: true, // Auto refetch on internet reconnect
    },
  },
});
