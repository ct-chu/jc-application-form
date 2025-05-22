// app/layout.tsx
import './globals.css';
import ThemeRegistry from './ThemeRegistry'; // Adjust path if needed
// import { Noto_Sans_HK, Noto_Serif_HK } from 'next/font/google'

export const metadata = {
  title: '可觀課程報名表格',
  description: '嗇色園主辦可觀自然教育中心暨天文館 賽馬會探索科學 進階環境教育及小學科學課程報名網站',
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