import './globals.css';

export const metadata = {
  title: 'N1 Capital - Партнёрский портал',
  description: 'Партнёрская программа N1 Capital',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
