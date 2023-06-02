import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NavBar from '@/components/NavBar'
import Page from '@/components/Page'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className='mx-4 sm:mx-20 md:mx-40 lg:mx-80 min-w-min mt-10 mb-10'>
        <NavBar />
        <Page>
          <Component {...pageProps} />
        </Page>
      </div>
    </>
  )
}
