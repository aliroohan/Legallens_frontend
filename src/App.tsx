import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { useMe } from './hooks/auth/useMe';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppRoutes() {
  // Session restore on mount
  useMe();

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-white)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: '#047857',
              secondary: '#ECFDF5',
            },
          },
          error: {
            iconTheme: {
              primary: '#B42318',
              secondary: '#FEF3F2',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
