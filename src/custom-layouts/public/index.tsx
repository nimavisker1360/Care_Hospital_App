import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";

function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.includes("/sign");
  return (
    <div>
      {!isAuthRoute && (
        <div className="flex justify-between items-center py-5 px-10 bg-primary">
          <Link href="/">
            <Image
              src="/assets/logo-full.svg"
              alt="logo"
              width={128}
              height={256}
            />
          </Link>
          <Link className="text-sm text-white underline" href="/sign-in">
            Sign-in
          </Link>
        </div>
      )}
      {children}
    </div>
  );
}

export default PublicLayout;
