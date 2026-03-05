"use client";

import BannerComponent from "@/components/app/BannerComponent";
import BannerImage from "@/public/products/Banner.png";

const AboutUsPage = () => {
  return (
    <div>
      <BannerComponent image={BannerImage} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 space-y-10 flex flex-col items-center justify-center text-center tracking-wider">
        <h1>私たちについて</h1>
        {/* 1.-------------------------- */}
        {/* desktop view */}
        <p className="hidden md:block">
          STAR SHOPは、<br />
          美しさと自信を引き出すための高品質な化粧品と<br />
          ヘアケア製品をお届けするブランドです
        </p>
        {/* mobile view */}
        <p className="block md:hidden text-base leading-relaxed text-center">
          STAR SHOPは、<br />
          美しさと自信を引き出すための<br />
          高品質な化粧品と<br />
          ヘアケア製品をお届けする<br />
          ブランドです
        </p>

        {/* 2.-------------------------- */}
        {/* desktop view */}
        <p className="hidden md:block">
          オンラインショップだけでなく、<br />
          実店舗でも展開し、<br />
          より多くのお客様に製品を直接体験していただける環境を整えています
        </p>
        {/* mobile view */}
        <p className="block md:hidden text-base leading-relaxed text-center">
          オンラインショップだけでなく、<br />
          実店舗でも展開し、<br />
          より多くのお客様に製品を<br />
          直接体験していただける<br />
          環境を整えています
        </p>

        {/* 3.-------------------------- */}
        {/* desktop view */}
        <p className="hidden md:block">
          現在は、<br />
          肌の美しさを引き出すことにこだわったスキンケアブランド<br />
          「Exomere（エクソミア）」と「Dplcell（ディプルセル）」、<br />
          さらに進化したヘア＆スキンケアライン「スプリナージュ」を<br />
          取扱っております
        </p>
        {/* mobile view */}
        <p className="block md:hidden text-base leading-relaxed text-center">
          現在は、<br />
          肌の美しさを引き出すことに<br />
          こだわったスキンケアブランド、<br />
          ExomereとDplcell、<br />
          さらに進化した<br />
          ヘアケアブランドを<br />
          取扱っております
        </p>

        {/* 4.-------------------------- */}
        {/* desktop view */}
        <p className="hidden md:block">
          特に新ライン「モイストヴェール」は、<br />
          季節の変わり目やヘアカラー後の敏感な地肌をやさしくケアし、<br />
          指通りなめらかな仕上がりを実現します
        </p>
        {/* mobile view */}
        <p className="block md:hidden text-base leading-relaxed text-center">
          特に新ライン「モイストヴェール」は、<br />
          季節の変わり目やヘアカラー後の敏感な地肌をやさしくケアし、<br />
          指通りなめらかな仕上がりを実現します
        </p>

        {/* 5.-------------------------- */}
        {/* desktop view */}
        <p className="hidden md:block">
          また、<br />
          多くのお客様に支持されてきた<br />
          「パフスムース」や「ジェントルモイスト」も、<br />
          新たな美容成分を加えてリニューアル
        </p>
        {/* mobile view */}
        <p className="block md:hidden text-base leading-relaxed text-center">
          また、<br />
          多くのお客様に支持されてきた<br />
          パフスムースやジェントルモイストも、<br />
          新たな美容成分を加えてリニューアル
        </p>

        {/* 6.-------------------------- */}
        {/* desktop view */}
        <p className="hidden md:block">
          心地よい使用感とともに、より豊かな潤いを与えます<br />
          STAR SHOPは、<br />
          毎日のスキンケアやヘアケアが心地よく、<br />
          特別な時間となるような商品づくりを目指しています
        </p>
        {/* mobile view */}
        <p className="block md:hidden text-base leading-relaxed text-center">
          心地よい使用感とともに、<br />
          より豊かな潤いを与えます<br />
          STAR SHOPは、<br />
          毎日のスキンケアやヘアケアが心地よく、<br />
          特別な時間となるような商品づくりを<br />
          目指しています
        </p>

        {/* 7.-------------------------- */}
        {/* desktop view */}
        <p className="hidden md:block">
          肌や髪のさまざまなお悩みに寄り添い、<br />
          美しさを育むお手入れ時間を、<br />
          私たちと共にお楽しみください
        </p>
        {/* mobile view */}
        <p className="block md:hidden text-base leading-relaxed text-center">
          肌や髪のさまざまなお悩みに寄り添い、<br />
          美しさを育むお手入れ時間を、<br />
          私たちと共にお楽しみください
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
