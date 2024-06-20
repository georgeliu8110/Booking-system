import "./globals.css";
import { ThemeProvider } from 'next-themes'
import Navbar from '@/app/components/NavBar';
import {StepProvider} from '@/app/context/stepContext';
import Footer from '@/app/components/Footer';

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
          <Footer />
          </main>
      </body>
    </html>

  );
}

