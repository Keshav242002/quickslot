import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/core/auth/AuthContext';
import { AppRouter } from '@/core/router/AppRouter';
import { ToastContainer } from '@/shared/components/Toast';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <ToastContainer />
      </AuthProvider>
      {import.meta.env.DEV ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  );
}

export default App;
