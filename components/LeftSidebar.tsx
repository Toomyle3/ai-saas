"use client";

import { sidebarLinks } from "#/constants";
import { cn } from "#/lib/utils";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAudio } from "../app/provider/AudioProvider";
import "./index.css";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { audio } = useAudio();

  return (
    <section
      className={cn("left_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      <div className="flex w-full flex-col gap-10">
        <Link
          href="/"
          className="flex cursor-pointer items-center max-lg:justify-center"
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">
            Tommy AI
          </h1>
        </Link>
        <nav className="flex flex-col gap-6 items-start">
          {sidebarLinks.map(({ route, label, imgURL }) => {
            const isActive =
              pathname === route || pathname.startsWith(`${route}/`);
            const finalRoute =
              route === "/profile" ? `/profile/${user?.id}` : route;

            return (
              <Link
                href={finalRoute}
                key={label}
                className={cn(
                  "flex w-full justify-start gap-3 items-start py-4 max-lg:px-4",
                  {
                    "bg-nav-focus border-r-4 border-orange-1": isActive,
                  }
                )}
              >
                <Image src={imgURL} alt={label} width={24} height={24} />
                <p>{label}</p>
              </Link>
            );
          })}
        </nav>
      </div>
      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button
            className="text-16 w-full bg-orange-1 font-extrabold logout-btn"
            onClick={() => signOut(() => router.push("/sign-in"))}
          >
            Log Out
          </Button>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
