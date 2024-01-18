import { Metadata } from 'next';
import ClientLayout from '@/app/ClientLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'SimplyFood',
  description:
    'Welcome to SimplyFood! The home of the most delicious recipes on the web!',
};
