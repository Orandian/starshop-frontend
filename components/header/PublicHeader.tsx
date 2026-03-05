"use client";

import { Menu, X } from "lucide-react";
import PublicHeaderLink from "@/components/app/PublicHeaderLink";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useGetCartItems } from "@/hooks/user/useCart";
import LogoHolder from "../app/LogoHolder";
import Image from "next/image";
import Link from "next/link";
import PublicHeaderLinkMobile from "../app/PublicHeaderLinkMobile";

const links = [
  { href: "/products", label: "Products" },
  { href: "/philosophy", label: "About us" },
  { href: "/news", label: "News" },
  { href: "/ranking", label: "Ranking" },
  { href: "/newarrival", label: "New Arrival" },
  { href: "/contactus", label: "Contact Us" },
];
import { CartData } from "@/types/cart/cardtype";
import { useUserStore } from "@/store/useAuthStore";

const PublicHeader = () => {
  const [cartCount, setCartCount] = useState(0);
  const { data: cardData } = useGetCartItems();
  const cartProduct = (cardData?.data as unknown) as CartData;
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useUserStore(); // Is logged in

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    if (user) {
      setIsLoggedIn(user?.userType === 3 ? true : false);
      setCartCount(cartProduct?.products?.length ?? 0);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, [cartProduct, user]);

  return (
    <div
      className={cn(
        "w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out flex justify-center items-center border-b-4 border-[#a99577] bg-white",
        scrolled ? "h-[80px]" : "h-[80px]"
      )}
    >
      <div className={cn("w-full mx-auto px-4 md:px-6 lg:px-16 xl:px-20")}>
        <header className="flex w-full items-center justify-between">
          <LogoHolder className="mr-6" />

          <div className="ml-auto hidden md:flex gap-2 items-center">
            {links.map((link, index) =>
              link.href === "/products" ? (
                <div key={index} className="group">
                  <PublicHeaderLink href={link.href}>
                    {link.label}
                  </PublicHeaderLink>

                  <div className="absolute left-0 top-[80px] w-full bg-white shadow-lg hidden group-hover:block">
                    <div className="block max-w-[600px] mx-auto">
                      <div className="grid grid-cols-3 gap-6 p-3">
                        <div>
                          <h4 className="font-semibold font-noto text-sm border-b border-[#786464] pb-2 mb-2 text-[#786464]">
                            スキンケア
                          </h4>
                          <ul className="space-y-1">
                            <li className="text-xl font-extrabold">
                              <Link
                                href="/exomere"
                                className="text-[#786464] font-cormorant"
                              >
                                EXOMERE
                              </Link>
                            </li>
                            <li className="text-xl font-extrabold">
                              <Link
                                href="/dpl"
                                className="text-[#786464] font-cormorant"
                              >
                                D.PL Cell
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold font-noto text-sm border-b border-[#786464] pb-2 mb-2 text-[#786464]">
                            ボディ＆ヘアケア
                          </h4>
                          <ul className="space-y-1">
                            {/* <li className="text-xl s"> */}
                              <p
                                className="text-[#786464] font-cormorant"
                              >
                                検討中
                              </p>
                              {/* <Link
                                href="/exomere"
                                className="text-[#786464] font-cormorant"
                              >
                                EXOMERE
                              </Link> */}
                            {/* </li> */}
                          </ul>
                        </div>
                        {isLoggedIn && cartCount > 0 && (
                          <div>
                          <h4 className="font-semibold font-noto text-sm border-b border-[#786464] pb-2 mb-2 text-[#786464]">
                            その他
                          </h4>
                          <ul className="space-y-1">
                            <Link
                                href="/cart"
                                className="text-[#786464] font-cormorant"
                              >
                                ショッピングバッグ
                              </Link>
                            {/* </li> */}
                          </ul>
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <PublicHeaderLink key={index} href={link.href}>
                  {link.label}
                </PublicHeaderLink>
              )
            )}
            <div className="ml-4 md:ml-3 lg:ml-8">
              {isLoggedIn ? (
                <button
                  className="mx-4 cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  <Image
                    src="/login.png"
                    alt="Login"
                    width={20}
                    height={24}
                    className="cursor-pointer"
                  />
                </button>
              ) : (
                <button
                  className="mx-4 cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  <Image
                    src="/login.png"
                    alt="Login"
                    width={20}
                    height={24}
                    className="cursor-pointer"
                  />
                </button>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => router.push("/cart")}
                  className="relative cursor-pointer"
                >
                  <Image
                    src="/shopping-cart.png"
                    alt="Shopping Cart"
                    width={19}
                    height={24}
                    className="cursor-pointer"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white leading-5 bg-[#786465] rounded-full w-5 h-5 border border-black/10">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* <button onClick={handleLogout}>
              <UserRound size={24} className="cursor-pointer" />
            </button> */}
          </div>

          <div className="md:hidden flex items-center">
            <div className="flex-row-center gap-4">
              {isLoggedIn ? (
                <button
                  className="cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  <Image
                    src="/login.png"
                    alt="Login"
                    width={20}
                    height={24}
                    className="cursor-pointer"
                  />
                </button>
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  <Image
                    src="/login.png"
                    alt="Login"
                    width={20}
                    height={24}
                    className="cursor-pointer"
                  />
                </button>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => router.push("/cart")}
                  className="relative cursor-pointer"
                >
                  <Image
                    src="/shopping-cart.png"
                    alt="Shopping Cart"
                    width={19}
                    height={24}
                    className="cursor-pointer"
                  />
                  {cartCount > 0 && (
                    <span className="absolute top-0 -right-1.5 inline-flex items-center justify-center text-small font-medium text-white leading-5 bg-[#786465] rounded-full w-4 h-4 border border-black/10">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
            {/* Mobile Menu Button */}
            {open ? (
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="cursor-pointer ml-5"
              >
                <X size={28} />
              </button>
            ) : (
              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="cursor-pointer ml-5"
              >
                <Menu size={28} />
              </button>
            )}
          </div>
        </header>

        {/* Backdrop */}
        {open && (
          <div
            className="fixed top-[80px] inset-0 bg-black/10 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed top-[80px] right-0 w-1/2 max-w-sm h-screen z-50 bg-white transition-transform duration-300 ease-in-out md:hidden",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col items-start gap-4 px-4 py-4 overflow-y-auto h-[calc(100vh-80px)]">
            <PublicHeaderLinkMobile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicHeader;
