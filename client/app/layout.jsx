import "./globals.css";
import { ThemeProvider } from 'next-themes'
import Navbar from '@/app/components/NavBar';

export default function RootLayout({ children }) {

  return (

    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      >
      <body className='bg-white dark:bg-black'>
          <main>
<ThemeProvider attribute="class">
            <Navbar>
            {children}
            </Navbar>
</ThemeProvider>
          </main>
      </body>
    </html>

  );
}

// "use client";

// import "./globals.css";
// import Link from "next/link";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase/config";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import useDrift from "./_hooks/liveChat-api/useDrift.js";
// import Image from 'next/image';
// import { ThemeProvider } from 'next-themes'
// import ThemeChanger from '@/app/components/ThemeChanger';

// export default function RootLayout({ children }) {
//   const [user, loading, error] = useAuthState(auth);

//   useDrift();
//   const [shouldUseDrift, setShouldUseDrift] = useState(true);
//   const pathname = usePathname();

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     let adminURL = pathname.includes("admin");

//     if (adminURL && window.drift?.api?.widget) {
//       window.drift.api.widget.hide();
//     } else if (!adminURL && window.drift?.api?.widget) {
//       window.drift.api.widget.show();
//     }
//     setShouldUseDrift(adminURL ? false : true);
//   }, [pathname]);

//   return (
//     <html
//       lang="en"
//       data-theme="light">
//       <body>
//         <div className="max-w-screen-2xl mx-auto px-4 py-8">
//           <header className="flex bg-gray-100 border rounded-xl p-1 items-center">
//           <div className="navbar marker:bg-gray-100 rounded-box">
//             <div className="flex-1 px-2 lg:flex-none items-center justify-center">
//               <Link href={"/"} className="text-3xl font-bold flex items-center">
//                 <Image priority src={'/broken-pipe.svg'} alt='plumbing pipe repair' width={120} height={120}/>
//                 Broken Pipe Plumbing
//               </Link>
//             </div>
//             <div className="flex justify-end flex-1 px-2">
//               <div className="flex items-stretch">
//                 <Link href={"/appointment"} className="btn btn-ghost rounded-btn text-xl">Book Now</Link>
//                 <Link href={"/companyservices"} className="btn btn-ghost rounded-btn text-xl">Services</Link>
//                 <div className="dropdown dropdown-end">
//                   <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn text-xl">Client Portal</div>
//                   <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
//                   <li>
//                       <Link href={"/signup"}>
//                       <div className="font-bold rounded-lg">
//                         Sign Up
//                       </div>
//                     </Link>
//                     </li>
//                     <li>
//                       <Link href={"/login"}>
//                       <div className="font-bold rounded-lg">
//                         Login
//                       </div>
//                     </Link>
//                     </li>
//                   </ul>
//                 </div>
//                 <div className="dropdown dropdown-end">
//                   <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn text-xl">Employee Portal</div>
//                   <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
//                     <li>
//                       <Link href={'/adminSignInAndSignUp'}>
//                       <div className="font-bold rounded-lg ">
//                         Admin Management
//                       </div>
//                     </Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <ThemeChanger />
//             </div>
//           </div>
//           </header>
//           <main>
//           <ThemeProvider attribute="class">
//             {children}
//           </ThemeProvider>
//             </main>
//         </div>
//       </body>
//     </html>

//   );
// }

