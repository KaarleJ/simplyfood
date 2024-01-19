'use client';
import '@/styles/globals.css';
import NavBar from '@/components/NavBar';
import Paper from './Paper';
import NextNProgress from 'nextjs-progressbar';
import { Toaster } from 'react-hot-toast';
import AuthContext from './AuthContext';

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthContext>
        <NextNProgress color="#29D" />
        <div className="mx-4 sm:mx-20 md:mx-40 lg:mx-80 min-w-min mt-10">
          <NavBar />
          <Paper className="bg-white p-4 shadow-lg min-h-loose">
            <>{children}</>
          </Paper>
          <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
        </div>
      </AuthContext>
    </>
  );
}
