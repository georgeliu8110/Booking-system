"use client";

import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useDrift from "@/app/_hooks/liveChat-api/useDrift.js";
import Image from 'next/image';
import ThemeChanger from '@/app/components/ThemeChanger';
import AppointmentModal from '@/app/components/AppointmentModal';

export default function NavBar({ children }) {
  const [user, loading, error] = useAuthState(auth);

  useDrift();
  const [shouldUseDrift, setShouldUseDrift] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let adminURL = pathname.includes("admin");

    if (adminURL && window.drift?.api?.widget) {
      window.drift.api.widget.hide();
    } else if (!adminURL && window.drift?.api?.widget) {
      window.drift.api.widget.show();
    }
    setShouldUseDrift(adminURL ? false : true);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
        <div className="w-auto mx-3 mt-3 px-4 py-8">
          <header className="flex border rounded-xl p-1 items-center bg-gray-100 dark:bg-black">
          <div className="navbar marker:bg-gray-100 rounded-box">
            <div className="flex-1 px-2 lg:flex-none items-center justify-center">
              <Link href={"/"} className="text-3xl font-bold flex items-center">
                <Image priority src={'/broken-pipe.svg'} alt='plumbing pipe repair' width={120} height={120}/>
                Broken Pipe Plumbing
              </Link>
            </div>
            <div className="flex justify-end flex-1 px-2">
              <div className="flex items-stretch">
              <button className="btn btn-ghost rounded-btn text-xl" onClick={()=>document.getElementById('my_modal_3').showModal()}>Book Now</button>
              <AppointmentModal />
                <Link href={"/companyservices"} className="btn btn-ghost rounded-btn text-xl">Services</Link>
                <div className="dropdown dropdown-hover">
                  <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn text-xl">Client Portal</div>
                  { !user ? (<ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                  <li>
                      <Link href={"/signup"}>
                      <div className="font-bold rounded-lg">
                        Sign Up
                      </div>
                    </Link>
                    </li>
                    <li>
                      <Link href={"/login"}>
                      <div className="font-bold rounded-lg">
                        Login
                      </div>
                    </Link>
                    </li>
                  </ul>) :
                  <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                  <li>
                      <Link href={"/customerProfilePage"}>
                      <div className="font-bold rounded-lg">
                        My Profile
                      </div>
                    </Link>
                    </li>
                    <li>
                      <Link href={"/signout"}>
                      <div className="font-bold rounded-lg">
                        Log Out
                      </div>
                    </Link>
                    </li>
                  </ul>
                  }
                </div>
                <div className="dropdown dropdown-hover">
                  <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn text-xl">Employee Portal</div>
                  <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <li>
                      <Link href={'/adminSignInAndSignUp'}>
                      <div className="font-bold rounded-lg ">
                        Admin Management
                      </div>
                    </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <ThemeChanger />
            </div>
          </div>
          </header>
          {children}
        </div>
  );
}

