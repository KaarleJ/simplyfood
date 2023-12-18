import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import NavBar from '@/components/NavBar';
import Page from '@/components/Page';
import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';
import { Toaster } from 'react-hot-toast';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <NextNProgress color="#29D" />
        <div className="mx-4 sm:mx-20 md:mx-40 lg:mx-80 min-w-min mt-10">
          <NavBar />
          <Page className="bg-white p-4 shadow-lg min-h-loose">
            <Component {...pageProps} />
          </Page>
          <Toaster position='bottom-center' toastOptions={{ duration: 3000 }} />
        </div>
      </SessionProvider>
    </>
  );
}
