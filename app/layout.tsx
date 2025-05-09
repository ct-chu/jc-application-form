// app/layout.tsx
import './globals.css';
import ThemeRegistry from './ThemeRegistry'; // Adjust path if needed
// import { Noto_Sans_HK, Noto_Serif_HK } from 'next/font/google'

export const metadata = {
  title: '可觀課程報名表格',
  description: 'Fill out this form',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}