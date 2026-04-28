'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { PropsWithChildren, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function useTheme() {
  return useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#0f62fe',
          },
          secondary: {
            main: '#5e35b1',
          },
          background: {
            default: '#f5f7fb',
          },
        },
        shape: { borderRadius: 10 },
        typography: {
          h4: {
            letterSpacing: -0.3,
          },
          h6: {
            letterSpacing: -0.2,
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderColor: 'rgba(15, 98, 254, 0.15)',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [],
  );
}

export default function Providers({ children }: PropsWithChildren) {
  const theme = useTheme();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
