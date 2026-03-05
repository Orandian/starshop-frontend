import PublicFooterIconLink from "@/components/app/PublicFooterIconLink";
import PublicFooterLink from "@/components/app/PublicFooterLink";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const links = [
  { href: "/products", label: "商品一覧" },
  { href: "/philosophy", label: "わたしたちのこと" },
  { href: "/stemcells", label: "2つの幹細胞" },
  { href: "/news", label: "お知らせ" },
  { href: "/#ranking", label: "ランキング" },
  { href: "/#newarrival", label: "新着商品" },
  // { href: "/#coupon", label: "クーポン" },
  // { href: "/usepoints", label: "ポイントについて" },
];
const linksBottom = [
  { href: "/#faq", label: "よくある質問" },
  { href: "/contactus", label: "お問い合わせ" },
  { href: "/company-profile", label: "会社概要" },
  { href: "/policy", label: "プライバシーポリシー" },
  { href: "/rule", label: "利用規約" },
  { href: "/commercial", label: "特定商取引法に基づく表記" },
];

const icons = [
  { href: "https://www.facebook.com/profile.php?id=61574819398589", icon: <FaFacebookF /> },
  { href: "https://www.instagram.com/exomere.japan.star/", icon: <FaInstagram /> },
  { href: "https://www.youtube.com/@BeauTech-g5r", icon: <FaYoutube /> },
];

const PublicFooter = () => {
  return (
    <>
    <div className="bg-[#f6f4f1] text-[#786464] border-t-4 border-[#a99577]">
      <footer className="container mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-8 text-center">
        <div className="font-noto">
          <Link href="/" className="font-cormorant text-3xl md:text-5xl tracking-wider font-bold">
          Star Shop
          </Link>
          <div className="my-8 md:my-10 space-y-3">
            <ul className="flex flex-wrap justify-center gap-3 md:gap-10">
              {links.map((link) => (
                <li key={link.label}>
                  <PublicFooterLink href={link.href}>{link.label}</PublicFooterLink>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap justify-center gap-3 md:gap-10">
              {linksBottom.map((link) => (
                <li key={link.label}>
                  <PublicFooterLink href={link.href}>{link.label}</PublicFooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-6 justify-center mb-3">
            {icons.map((icon, index) => (
              <PublicFooterIconLink key={index} href={icon.href}>
                {icon.icon}
              </PublicFooterIconLink>
            ))}
          </div>
          <p className="text-normal tracking-tighter uppercase">© 2025 ビューテック株式会社</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default PublicFooter;
