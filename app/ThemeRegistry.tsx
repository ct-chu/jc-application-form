// app/ThemeRegistry.tsx (Simplified example, check MUI docs)
'use client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'; // or v14/v15
import React from 'react';

// Create a theme instance.
const theme = createTheme({
  // your theme configuration
  typography: {
    "fontFamily": `"Noto Sans HK", sans-serif`,
   }
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}