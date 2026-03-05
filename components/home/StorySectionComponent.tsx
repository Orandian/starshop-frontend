import SectionLayout from "@/components/layouts/SectionLayout";

const StorySectionComponent = () => {
  return (
    <SectionLayout className="my-20 md:my-40 h-auto container mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center border-[1px] border-black/10 py-12 px-8 md:p-20 bg-white/40">
        <div className="text-center">
          <span
            className="text-5xl font-allura"
            style={{ fontFamily: "Allura, cursive" }}
          >
            Our Story
          </span>
        </div>
        <div className="flex-col space-y-3 text-base text-dark pt-10">
          <p>
            STAR
            SHOPは、美しさと自信を引き出す高品質な化粧品をお届けするために誕生しました。
          </p>
          <p>
            オンラインショップはもちろん、実店舗でも展開しており、より多くのお客様に私たちの製品を体験していただけるよう努めています。
          </p>
          <p>
            現在は、独自の成分と効果にこだわった2つのブランド、**Exomere（エクソミア）とDplcell（ディプルセル）**を取り扱っております。
          </p>
          <p>
            それぞれのブランドが持つ個性と魅力を、ぜひお手に取って感じてみてください。
          </p>
          <p>
            私たちは、毎日のスキンケアが特別な時間となるような商品をこれからもお届けしてまいります。
          </p>
        </div>
      </div>
    </SectionLayout>
  );
};

export default StorySectionComponent;
