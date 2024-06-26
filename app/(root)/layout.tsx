import LeftSidebar from "#/components/LeftSidebar";
import MobileNav from "#/components/MobileNav";
import MobileNavRight from "#/components/MobileNavRight";
import PodcastPlayer from "#/components/PodcastPlayer";
import { Toaster } from "#/components/ui/toaster";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex bg-black-3 pb-20">
        <LeftSidebar />

        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between md:justify-end">
              <div className="md:hidden">
                <MobileNav />
              </div>
              <Image
                className="md:hidden"
                src="/icons/logo.svg"
                width={30}
                height={30}
                alt="menu icon"
              />
              <MobileNavRight />
            </div>
            <div className="flex flex-col md:pb-14">
              <Toaster />
              {children}
            </div>
          </div>
        </section>

        {/* <RightSidebar /> */}
      </main>

      <PodcastPlayer />
    </div>
  );
}
