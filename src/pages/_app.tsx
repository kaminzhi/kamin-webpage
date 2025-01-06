'use client';

import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { Salsa, Carter_One } from 'next/font/google';
import '../styles/globals.css';

const salsa = Salsa({
  weight: '400',
  subsets: ['latin'],
});

const carterOne = Carter_One({
  weight: '400',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-salsa: ${salsa.style.fontFamily};
          --font-carter-one: ${carterOne.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
