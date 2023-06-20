import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NavBar from '@/components/NavBar'
import Page from '@/components/Page'
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <div className='mx-4 sm:mx-20 md:mx-40 lg:mx-80 min-w-min mt-10 mb-10'>
          <NavBar />
          <Page className='bg-white p-4 shadow-lg min-h-loose'>
            <Component {...pageProps} />
          </Page>
        </div>
      </SessionProvider>
    </>
  )
}
