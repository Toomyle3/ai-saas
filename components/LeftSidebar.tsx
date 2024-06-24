"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { sidebarLinks } from "../constants";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../lib/utils";

const LeftSidebar = () => {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <section className="left_sidebar">
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="
          flex 
          cursor-pointer 
          items-center gap-1 
          pb-10 
          max-lg:justify-center
        "
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={23} />
          <h1
            className="text-24 font-extrabold 
          text-white max-lg:hidden"
          >
            Podcast
          </h1>
        </Link>

        {sidebarLinks.map(({ imgURL, route, label }: any) => {
          const isActive =
            pathName === route || pathName.startsWith(`${route}/`);
          return (
            <Link
              className={cn(
                "flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start",
                {
                  "bg-nav-focus border-r-4 border-orange-1": isActive,
                }
              )}
              href={route}
              key={label}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;
