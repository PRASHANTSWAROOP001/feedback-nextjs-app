"use client";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function Navbar() {
  const navlinks = [
    { name: "Home", url: "#home" },
    { name: "Product", url: "#how-it-works" },
    { name: "Pricing", url: "#pricing" },
    { name: "Review", url: "#review" },
    { name: "About", url: "#about" },
  ];

  const socialLinks = [
    { name: "LinkedIn", url: "#" },
    { name: "Discord", url: "#" },
  ];

  const { isSignedIn } = useUser();

  const router = useRouter();

  return (
    <header className="w-full sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      {/* Desktop Navbar */}
      <div className="hidden lg:flex h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-green-400">Feedback+</h1>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navlinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Social Links and Button */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {item.name}
            </a>
          ))}
          {!isSignedIn ? (
            <Button
              onClick={() => router.push("/signin")}
              variant="outline"
              size="sm"
            >
              Sign In
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/dashboard")}
              variant={"outline"}
              size={"sm"}
            >
              Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex lg:hidden h-16 items-center px-4">
        <h1 className="text-xl font-bold text-green-400">Feedback+</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-64 p-6">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              {navlinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  className="text-gray-600 hover:text-gray-800 border-b py-2 text-center"
                >
                  {item.name}
                </a>
              ))}
              {!isSignedIn ? (
                <Button
                  onClick={() => router.push("/signin")}
                  variant="outline"
                  size="sm"
                >
                  Sign In
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant={"outline"}
                  size={"sm"}
                >
                  Dashboard
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Navbar;
