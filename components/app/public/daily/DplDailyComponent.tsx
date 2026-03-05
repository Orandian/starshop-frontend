import React from 'react'
import TitleText from '../../TitleText';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Daily1 from '@/public/brands/dpl/daily1.png';
import Daily2 from '@/public/brands/dpl/daily2.png';
const DplDailyComponent = () => {
  return (
    <div className={cn("border border-[#723a5a] bg-white my-5 md:my-10")}>
      <div className="border-2 border-[#723a5a] m-1 px-5 md:px-14 py-5 md:py-8">
        <TitleText
          title="DAILY"
          subtitle="毎日のケアに"
          className="text-[#723a5a] max-sm:mt-4"
        />
        <div className="max-w-[800px] mx-auto">
          {/* Daily 1 */}
          <div className="flex items-center mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#723a5a] text-4xl/none md:text-6xl/none self-center">
              1
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Daily1}
                alt="クリームミスト"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#723a5a] mt-1 md:mt-3.5">
                クリームミスト
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
                2層に分かれているクリームミストは、ご使用前に軽く振ってください。
                <br />
                顔から15〜20cmほど離し、顔全体にまんべんなくスプレーし、
                <br className="hidden md:block" />
                手のひらでやさしく包み込むようになじませてください。
              </p>
            </div>
          </div>
          {/* Daily 2 */}
          <div className="flex items-center mb-3 md:mb-6 gap-2 md:gap-4">
            <div className="w-[20px] md:w-[40px] font-shippori font-medium text-[#723a5a] text-4xl/none md:text-6xl/none self-center">
              2
            </div>
            <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px]">
              <Image
                src={Daily2}
                alt="UV栄養クリーム"
                className="w-full h-full object-contain"
                width={100}
                height={100}
              />
            </div>
            <div className="pl-0 md:px-5 w-[calc(100%-100px)] md:w-[calc(100%-140px)]">
              <p className="font-noto font-semibold text-sm md:text-2xl text-[#723a5a] mt-1 md:mt-3.5">
              UV栄養クリーム
              </p>
              <p className="font-noto text-xs md:text-base tracking-tighter text-[#5A5A5A]">
              適量を手にとり顔全体にやさしくなじませてください。<br />
              乾燥が気になる部分には重ねづけがおすすめです。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DplDailyComponent;
