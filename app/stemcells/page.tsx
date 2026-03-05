"use client";

import Image from "next/image";
import BannerImagePC from "@/public/stemcells/BannerPC.png";
import BannerImageSP from "@/public/stemcells/BannerSP.png";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import circle from "@/public/right-icon.png";
import cellsImg01 from "@/public/stemcells/cells_img01.png";
import cellsImg02 from "@/public/stemcells/cells_img02.png";

const Concerns1 = [
  "美白ケア、肌のくすみが気になる",
  "目元のシワやほうれい線が目立ってきた",
  "季節や生活習慣による肌荒れや不調を感じる",
];
const Concerns2 = [
  "保湿してもすぐ乾燥する",
  "鏡を見るたびに年齢を感じる",
  "エイジングケアの選び方に迷っている",
];
const StemCellsPage = () => {
  return (
    <div className="mt-[80px]">
      <div className="w-screen h-full">
        <Image
          src={BannerImagePC}
          alt="Banner"
          className="hidden md:block w-full h-full object-cover"
        />
        <Image
          src={BannerImageSP}
          alt="Banner"
          className="block md:hidden w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4 md:px-6 text-center tracking-wider">
        <h2 className="text-xl md:text-2xl font-medium font-cormorant text-center text-[#786464] whitespace-nowrap px-1">
          Star Shopが選び抜いた2つの幹細胞
        </h2>
        <div className="my-6 md:my-10">
          <p className="max-sm:text-base md:text-xl font-medium font-cormorant text-center text-[#a7834d] leading-10">
            年齢に負けない肌のために
          </p>
          <div className="flex items-center justify-center w-full mb-4 md:mb-8">
            <div className="flex items-center flex-1 max-w-[40px]">
              <div className="flex-1 h-0.5 bg-[#a7834d]"></div>
            </div>
            <h2 className="max-sm:text-base md:text-xl font-medium font-cormorant text-center text-[#a7834d] whitespace-nowrap px-1">
              幹細胞に着目した理由
            </h2>
            <div className="flex items-center flex-1 max-w-[40px]">
              <div className="flex-1 h-0.5 bg-[#a7834d]"></div>
            </div>
          </div>
          <p className="philo-para font-noto">
            年齢を重ね、
            <br className="md:hidden" />
            「保湿したはずなのに、すぐ乾燥しているように感じる」
            <br />
            「ファンデーションが浮いて見える」
            <br className="md:hidden" />
            「肌がどんよりして見える」など、
            <br />
            今までのスキンケアでは物足りない…
            <br className="md:hidden" />
            そう感じ始めたあなたへ。
            <br />
            私たちは、美容分野で注目される「幹細胞由来成分」に着目し、
            <br />
            日々のお手入れに“実感”と“心地よさ”を届けます。
          </p>
        </div>

        <div className="my-10 md:my-16">
          <p className="max-sm:text-base md:text-xl font-medium font-cormorant text-center text-[#a7834d] leading-7 my-4 md:my-8">
            肌の可能性を引き出す、
            <br className="md:hidden" />
            2つの幹細胞美容
          </p>
          <p className="philo-para font-noto">
            幹細胞美容とは、美容分野で注目されている
            <br className="md:hidden" />
            「幹細胞由来成分」を配合したスキンケアを示します。
            <br />
            年齢とともに変化しやすい肌環境に寄り添い、
            <br className="md:hidden" />
            肌をすこやかに保つための成分を届けます。
            <br />
            Star Shopでは、植物由来と動物由来、
            <br className="md:hidden" />
            2種類の幹細胞に着目し、
            <br />
            それぞれの魅力を活かした
            <br className="md:hidden" />
            スキンケア コレクションを厳選しました。
          </p>
        </div>
        <div className="px-0 md:px-10 my-20 md:my-20">
          <div className="flex items-start justify-start">
            <div className="w-full md:w-[70%]">
              <div className="w-[70%] md:w-auto relative">
                <div className="block md:hidden absolute -bottom-[10%] -right-[40%]">
                  <Image
                    src={cellsImg01}
                    alt="icon"
                    className="w-[200px] md:w-full h-full object-cover"
                  />
                </div>
                <h3 className="max-sm:text-sm md:text-lg font-semibold font-cormorant text-left text-[#a7834d] leading-7 mb-1">
                  植物由来幹細胞
                </h3>
                <span className="text-sm md:text-base font-medium tracking-wider leading-7 text-[#a7834d] text-left table border-t border-[#a7834d] pt-2 mb-3">
                  日々のエイジングケアで、
                  <br className="md:hidden" />
                  自信あふれる素肌へ変わる
                </span>
              </div>
              <p className="text-sm md:text-base font-semibold tracking-wider leading-8 text-[#4d4d4d] text-left -mr-0 md:-mr-10">
                Star Shopでは、
                <span className="bg-[#f0efea]">
                  多くの日本ブランド製品の開発を支えてきた、
                </span>
                <br className="hidden md:block" />
                <span className="bg-[#f0efea]">
                  韓国のマイクロニードル専門メーカーが開発したEXOMERE(エクソミア)を厳選。
                </span>
                <br />
                EXOMERE(エクソミア)では、エーデルワイス由来の幹細胞培養エキスをはじめ、
                <br className="hidden md:block" />
                植物由来の針状美容成分や、ハンラボン(柑橘類：デコポン)から抽出したエクソソーム成分を配合。
                <br />
                肌に必要な栄養をすばやく届け、日々のケアを格上げします。
                <br />
                確かな技術と実績で、毎日のホームケアがエステ級の贅沢時間に。
              </p>
            </div>
            <div className="hidden md:block -mt-5 mx-auto md:w-[30%]">
              <Image
                src={cellsImg01}
                alt="icon"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="max-w-[550px] mx-auto p-5 md:p-10 border border-[#a7834d] my-6 md:my-10">
            <h3 className="font-medium tracking-wider leading-7 text-[#a7834d] max-md:text-base md:text-2xl mb-8 md:mb-10">
              <span
                className="
                  relative
                  inline-block
                  before:content-[''] 
                  before:absolute 
                  before:-bottom-[12px]
                  before:left-[50%]
                  before:translate-x-[-50%]
                  before:block 
                  before:h-[12px] 
                  before:w-full 
                  before:bg-[url('/philo-arrow.png')] 
                  before:bg-[length:488px_12px] 
                  before:bg-center 
                  before:bg-no-repeat 
                  before:mt-2
                "
              >
                こんなエイジングサインにお悩みの方へ
              </span>
            </h3>
            <ul className="space-y-3">
              {Concerns1.map((text, index) => (
                <li key={index} className="flex items-start">
                  <Image
                    src={circle}
                    alt="icon"
                    width={25}
                    height={25}
                    className="mt-1"
                  />
                  <span className="ml-2 mt-1 text-left">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xl/normal md:text-2xl/relaxed font-medium font-cormorant text-center text-[#a7834d] whitespace-nowrap px-1">
            日々のケアで新しい自分に出会い、
            <br />
            何度も鏡を見たくなる感動の素肌へ
          </p>
          <Link
            href="/exomere"
            className="inline-flex items-center justify-between border border-[#a7834d] px-6 py-2 text-sm md:text-base text-[#5f4d4d] hover:bg-gray-50 transition my-5 md:my-8"
          >
            <span className="tracking-widest">EXOMERE の詳細はこちら</span>
            <ChevronRight className="ml-2 h-4 w-4 text-pink-300" />
          </Link>
        </div>
        <div className="px-0 md:px-10 my-20 md:my-20">
          <div className="flex items-start justify-start">
            <div className="w-full md:w-[70%]">
              <div className="w-[70%] md:w-auto relative">
                <div className="block md:hidden absolute -bottom-[30%] -right-[55%]">
                  <Image
                    src={cellsImg02}
                    alt="icon"
                    className="w-[200px] md:w-full h-full object-cover"
                  />
                </div>
                <h3 className="max-sm:text-sm md:text-lg font-semibold font-cormorant text-left text-[#a7834d] leading-7 mb-1">
                  動物由来幹細胞
                </h3>
                <span className="text-sm md:text-base font-medium tracking-wider leading-7 text-[#a7834d] text-left table border-t border-[#a7834d] pt-2 mb-3">
                  年齢を感じさせない肌へ導く、
                  <br className="md:hidden" />
                  革新のエイジングケア
                </span>
              </div>
              <p className="text-sm md:text-base font-semibold tracking-wider leading-8 text-[#4d4d4d] text-left -mr-0 md:-mr-10">
                Star Shopでは、<span className="bg-[#f0efea]">鹿由来の幹細胞培養エキスを配合したD.PL Cell(ディプルセル)を厳選。</span><br />
                鹿の幹細胞は、人間に近い性質を持ち、その胎盤や角には高い再生能力があります。<br />
                D.PL Cell(ディプルセル)では、ニュージーランドの自然の中で放牧された鹿から、<br />
                自然な出産で得た胎盤や角のみを採取。<br />
                動物に負担をかけず、自然の恵みをそのまま分けてもらうことを大切にしています。<br />
                肌にも環境にもやさしいスキンケアをあなたに。
              </p>
            </div>
            <div className="hidden md:block -mt-5 mx-auto md:w-[30%]">
              <Image
                src={cellsImg02}
                alt="icon"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="max-w-[550px] mx-auto p-5 md:p-10 border border-[#a7834d] my-6 md:my-10">
            <h3 className="font-medium tracking-wider leading-7 text-[#a7834d] max-md:text-base md:text-2xl mb-8 md:mb-10">
              <span
                className="
                  relative
                  inline-block
                  before:content-[''] 
                  before:absolute 
                  before:-bottom-[12px]
                  before:left-[50%]
                  before:translate-x-[-50%]
                  before:block 
                  before:h-[12px] 
                  before:w-full 
                  before:bg-[url('/philo-arrow.png')] 
                  before:bg-[length:488px_12px] 
                  before:bg-center 
                  before:bg-no-repeat 
                  before:mt-2
                "
              >
                こんなエイジングサインにお悩みの方へ
              </span>
            </h3>
            <ul className="space-y-3">
              {Concerns2.map((text, index) => (
                <li key={index} className="flex items-start">
                  <Image
                    src={circle}
                    alt="icon"
                    width={25}
                    height={25}
                    className="mt-1"
                  />
                  <span className="ml-2 mt-1 text-left">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xl/normal md:text-2xl/relaxed font-medium font-cormorant text-center text-[#a7834d] whitespace-nowrap px-1">
            持続的なケアで、
            <br />
            思わず触れたくなる
            <br className="md:hidden" />
            ふっくら弾力のあるシルク肌へ
          </p>
          <Link
            href="/dpl"
            className="inline-flex items-center justify-between border border-[#a7834d] px-6 py-2 text-sm md:text-base text-[#5f4d4d] hover:bg-gray-50 transition my-5 md:my-8"
          >
            <span className="tracking-widest">D.PL Cell の詳細はこちら</span>
            <ChevronRight className="ml-2 h-4 w-4 text-pink-300" />
          </Link>
        </div>
        <p className="text-xl/relaxed md:text-2xl/loose font-medium font-cormorant text-center text-[#786464] whitespace-nowrap px-1 my-10 md:my-20">
          あなたに合うエイジングケアで、
          <br />
          時間を重ねるほど
          <br className="md:hidden" />
          素肌が楽しみになる毎日を。
        </p>
      </div>
    </div>
  );
};

export default StemCellsPage;
