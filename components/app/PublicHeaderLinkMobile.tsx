import Link from 'next/link';
import React from 'react'
type MenuItem = {
  title: string;
  href?: string;
  children?: MenuItem[];
};
const menus1: MenuItem[] = [
  {
    title: "商品一覧",
    children: [
      {
        title: "スキンケア",
        children: [
          { title: "EXOMERE", href: "/exomere" },
          { title: "D.PL Cell", href: "/dplcell" },
        ],
      },
      {
        title: "ボディ＆ヘアケア",
        children: [
          { title: "EXOMERE", href: "/exomere" },
        ],
      },
    ],
  }
];

const menus2: MenuItem[] = [
  { title: "わたしたちのこと", href: "/aboutus" },
  { title: "２つの幹細胞", href: "/stemcells" },
  { title: "お知らせ", href: "/news" },
  { title: "ランキング", href: "/ranking" },
  { title: "新着商品", href: "/newarrival" },
  // { title: "クーポン", href: "/coupons" },
  // { title: "ポイントについて", href: "/usepoints" },
  { title: "よくある質問", href: "/faq" },
  { title: "お問い合わせ", href: "/contactus" },
  { title: "会社概要", href: "/company" },
];

const PublicHeaderLinkMobile = () => {
  return (
    <nav className="w-full space-y-4">
      <ul className="space-y-4">
        {menus1.map((menu) => (
          <li key={menu.title}>
            <span className="font-noto text-sm font-bold text-[#786464] hover:text-[#a99577] transition-colors">
              {menu.title}
            </span>

            {menu.children && (
              <ul className="pl-4 mt-2 space-y-3">
                {menu.children.map((sub) => (
                  <li key={sub.title}>
                    <span className="font-semibold text-xs text-[#786464] hover:text-[#a99577] transition-colors border-b border-[#786464] block">
                      {sub.title}
                    </span>

                    {sub.children && (
                      <ul className="space-y-1">
                        {sub.children.map((child) => (
                          <li key={child.title}>
                            <a
                              href={child.href}
                              className="text-lg font-cormorant font-extrabold text-[#786464] hover:text-[#a99577]"
                            >
                              {child.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <ul className="space-y-4">
        {menus2.map((menu) => (
          <li key={menu.title}>
            <Link
              href={menu.href || ''}
              className="font-noto text-sm font-bold text-[#786464] hover:text-[#a99577] transition-colors"
            >
              {menu.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default PublicHeaderLinkMobile;
