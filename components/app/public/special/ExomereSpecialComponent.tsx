import React from 'react'
import TitleText from '../../TitleText';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Special1 from '@/public/brands/exomere/special1.png';
import Special2 from '@/public/brands/exomere/special2.png';
import Special3 from '@/public/brands/exomere/special3.png';
import Special3B from '@/public/brands/exomere/special3B.png';
import Special4 from '@/public/brands/exomere/special4.png';
import Special5 from '@/public/brands/exomere/special5.png';
import Special6 from '@/public/brands/exomere/special6.png';
import Special7 from '@/public/brands/exomere/special7.png';

const ExomereSpecialComponent = () => {
  return (
    <div className={cn("border border-[#c3b186] bg-white my-5 md:my-10")}>
      <div className="border-2 border-[#c3b186] m-1 px-5 md:px-14 py-5 md:py-8">
        <TitleText title="SPECIAL" subtitle="自分へのご褒美ケアに" className="text-[#c3b186] max-sm:mt-4" />
        <div className="max-w-[800px] mx-auto">
          {/* Special 1 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#D07C72] text-4xl/none md:text-6xl/none self-center">
              1
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Special1}
                alt="アロマヒーリング ミスト"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#D07C72] mt-1 md:mt-3.5">
              アロマヒーリング ミスト
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
              独自の美容成分｢ハンラボン・エクソソーム｣を配合し、肌荒れを防ぎ、
             <br className="hidden md:block"/>
             うるおい肌に導くミスト化粧水。
              </p>
            </div>
          </div>
          {/* Special 2 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#c3b186] text-4xl/none md:text-6xl/none self-center">
              2
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Special2}
                alt="エーデルワイス スノークリーム"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#c3b186] mt-1 md:mt-3.5">
              エーデルワイス スノークリーム
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
              酵素の力で古い角質と毛穴の汚れを吸着除去する
             <br className="hidden md:block"/>
             低刺激のピーリングマッサージクリーム。
              </p>
            </div>
          </div>
          {/* Special 3 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#c3b186] text-4xl/none md:text-6xl/none self-center">
              3
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Special3}
                alt="インプラント ソリューション"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#c3b186] mt-1 md:mt-3.5">
              インプラント ソリューション
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
              天然マイクロニードル｢スピーカーズ｣により、
             <br className="hidden md:block"/>
             発酵植物性コラーゲン＊2が肌の奥＊1まで浸透する美容液。
              </p>              
            </div>
          </div>
          <p className="font-noto font-semibold text-sm md:text-2xl text-[#c3b186] text-center">
              or
          </p>
          {/* Special 3B */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#c3b186] text-4xl/none md:text-6xl/none self-center">&nbsp;</div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Special3B}
                alt="リフティングショット スージングジェル"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#c3b186] mt-1 md:mt-3.5">
              リフティングショット スージングジェル
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
              肌荒れやくすみ＊3を防ぎ、肌のコンディションを整える
             <br className="hidden md:block"/>
             濃密なプレミアムジェル。
              </p>              
            </div>
          </div>
          {/* Special 4 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#c3b186] text-4xl/none md:text-6xl/none self-center">
              4
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Special4}
                alt="ローズガーデン マスクパック"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#c3b186] mt-1 md:mt-3.5">
              ローズガーデン マスクパック
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
              肌がうるおい、翌日の肌に感動する整肌・ハリケアに特化した
             <br className="hidden md:block"/>
             ２ STEPマスク。
              </p>
            </div>
          </div>
          {/* Special 5 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#D07C72] text-4xl/none md:text-6xl/none self-center">
              5
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Special5}
                alt="グルタチオン メラショット"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#D07C72] mt-1 md:mt-3.5">
              グルタチオン メラショット
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
              シワ<span className="text-[8px] md:text-xs align-super">＊1</span> ・くすみ<span className="text-[8px] md:text-xs align-super">＊2</span> にアプローチし、明るい透明美肌<span className="text-[8px] md:text-xs align-super">＊3</span> へ導く美容クリーム。
              </p>
            </div>
          </div>
          {/* Special 6 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#D07C72] text-4xl/none md:text-6xl/none self-center">
              6
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Special6}
                alt="セラミド リセルクリーム"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#D07C72] mt-1 md:mt-3.5">
              セラミド リセルクリーム
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
              乾燥や年齢サイン<span className="text-[8px] md:text-xs align-super">＊4</span> が気になる肌をなめらかに包み込む
             <br className="hidden md:block"/>
             プレミアムな濃密栄養クリーム。
              </p>
            </div>
          </div>
          {/* Special 7 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#D07C72] text-4xl/none md:text-6xl/none self-center">
              7
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Special7}
                alt="リカバリーバーム プラス"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#D07C72] mt-1 md:mt-3.5">
              リカバリーバーム プラス
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
              美容成分を補いつつ、高密着なカバー力。
             <br className="hidden md:block"/>
             夜も使うことで肌を整える新発想のBBクリーム。
              </p>
            </div>
          </div>
        </div>
        <p className="font-noto text-[8px] md:text-xs tracking-tighter md:tracking-normal text-gray-500 text-right mt-3 md:mt-4">＊1 角質層まで、＊2 ゴールデンハイビスカスエキス、ビフィダス発酵物（保湿）<br />＊3 乾燥によるくすみ</p>
      </div>
    </div>
  )
}

export default ExomereSpecialComponent;
