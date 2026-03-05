import React from 'react'
import TitleText from '../../TitleText';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Daily1 from '@/public/brands/exomere/daily1.png';
import Daily2 from '@/public/brands/exomere/daily2.png';
import Daily3 from '@/public/brands/exomere/daily3.png';
import Daily4 from '@/public/brands/exomere/daily4.png';
const ExomereDailyComponent = () => {
  return (
    <div className={cn("border border-[#D07C72] bg-white my-5 md:my-10")}>
      <div className="border-2 border-[#D07C72] m-1 px-5 md:px-14 py-5 md:py-8">
        <TitleText title="DAILY" subtitle="毎日のケアに" className="text-[#D07C72] max-sm:mt-4" />
        <div className="max-w-[800px] mx-auto">
          {/* Daily 1 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#D07C72] text-4xl/none md:text-6xl/none self-center">
              1
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Daily1}
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
              独自の美容成分｢ハンラボン・エクソソーム｣を配合し、肌荒れを防ぎ、<br className="hidden md:block"/>うるおい肌に導くミスト化粧水。
              </p>
            </div>
          </div>
          {/* Daily 2 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#D07C72] text-4xl/none md:text-6xl/none self-center">
             2
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Daily2}
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
          {/* Daily 3 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#D07C72] text-4xl/none md:text-6xl/none self-center">
             3
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Daily3}
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
              乾燥や年齢サイン<span className="text-[8px] md:text-xs align-super">＊4</span> が気になる肌をなめらかに包み込む<br className="hidden md:block"/>プレミアムな濃密栄養クリーム。
              </p>
            </div>
          </div>
          {/* Daily 4 */}
          <div className="flex mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#D07C72] text-4xl/none md:text-6xl/none self-center">
             4
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Daily4}
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
              美容成分を補いつつ、高密着なカバー力。<br />夜も使うことで肌を整える新発想のBBクリーム。
              </p>
            </div>
          </div>
        </div>
        <p className="font-noto text-[8px] md:text-xs tracking-tighter md:tracking-normal text-gray-500 text-right mt-3 md:mt-4">＊1 乾燥による小ジワを目立たなくする　＊2 乾燥によるくすみ<br />＊3 うるおいによる透明感のある肌　＊4 乾燥、ハリツヤのなさ</p>
      </div>
    </div>
  )
}

export default ExomereDailyComponent;
