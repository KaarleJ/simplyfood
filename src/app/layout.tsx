import { Metadata } from 'next';
import ClientLayout from '@/app/ClientLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'SimplyFood - The home of the most delicious recipes on the web!',
  description:
    'SimplyFood is a recipe website where you can find the most delicious recipes on the web!',
};
