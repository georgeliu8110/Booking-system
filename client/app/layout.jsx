import "./globals.css";
import { ThemeProvider } from 'next-themes'
import Navbar from '@/app/components/NavBar';
import {StepProvider} from '@/app/context/stepContext';
import Footer from '@/app/components/Footer';
import '@/polyfills.mjs';

export default function RootLayout({ children }) {

  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      >
      <body className='bg-white dark:bg-black'>
          <main>
          <StepProvider>
           <ThemeProvider attribute="class">
            <Navbar>
            {children}
            </Navbar>
          </ThemeProvider>
          </StepProvider>
          <div className='mt-5'>
            <Footer />
          </div>
          </main>
      </body>
    </html>
  );
}

