// import SectionLayout from "@/components/layouts/SectionLayout";
// import TitleText from "@/components/app/TitleText";
import { usePublicNewsList } from "@/hooks/user/useNews";
import { NewsItem } from "@/types/news";
import { useRouter } from "next/navigation";
import { encryptString } from "@/utils";
import { Megaphone } from "lucide-react";

const htmlToText = (html: string) => {
  if (typeof window === "undefined") return html;
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const NewsSectionComponent = () => {
  // const { data: newsData } = useNews();
  const { data: newsData } = usePublicNewsList();
  const newsList = (newsData?.data?.data || []) as NewsItem[];
  const speed = 30;
  const router = useRouter();

  // const handleToClick = () => {
  //   router.push("/news");
  // };

  return (
    <div className="bg-[#f0efea]/90 py-3 md:py-4">
      <div className="mx-auto overflow-hidden">
        {newsList.length > 0 ? (
          <div className="flex whitespace-nowrap animate-marquee"
                style={{ animationDuration: `${speed}s` }}>
            {[...newsList, ...newsList].map((news, index) => (
              <div
                key={`${news.newsId}-${index}`}
                className="flex items-center gap-4 px-4 text-sm text-[#786464] whitespace-nowrap cursor-pointer min-w-[700px]"
                onClick={() =>
                  router.push(
                    `/news/${encryptString(news.newsId.toString())}`
                  )
                }
              >
                <span>
                <Megaphone className="w-4 h-4 mx-2 text-black" />
                </span>
                <span className="shrink-0 text-xs">
                  {news.newsDate.join("-")}
                </span>

                <span className="font-medium truncate max-w-[220px]">
                  {news.title}
                </span>

                <span className="truncate max-w-[300px]">
                  {htmlToText(news.content)}
                </span>
              </div>
            ))}
  <style jsx>{`
    @keyframes marquee {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    }
    }
    .animate-marquee {
    animation: marquee linear infinite;
    }
`}</style>
          </div>
        ) : (
          <p className="text-center text-xs text-gray-500 font-semibold">
            ニュースはまだありません。
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsSectionComponent;

// Commented old code
// const NewsSectionComponent = () => {
//   // const { data: newsData } = useNews();
//   const { data: newsData } = usePublicNewsList();
//   const newDataList = (newsData?.data?.data || []) as NewsItem[];

//   const router = useRouter();

//   // const handleToClick = () => {
//   //   router.push("/news");
//   // };

//   return (
//     <SectionLayout className="my-14 md:my-28 h-auto">
//       <div className="container mx-auto px-4 md:px-6 lg:px-8">
//         <div className="relative">
//           <TitleText title="NEWS" subtitle="お知らせ" className="text-[#786464]" />
//           <div className="absolute top-3 right-0 hidden md:block">
//             <ButtonLink href="/news" className="">もっと見る</ButtonLink>
//           </div>
//         </div>
//         <div className="max-w-[800px] mx-auto px-0 md:px-16">
//           <div className="flex flex-col space-y-4">
//             {newDataList.length > 0 &&
//               newDataList?.map((news: NewsItem) => (
//                 <div key={news.newsId} className="flex flex-row gap-4 md:gap-6 lg:gap-10 font-noto">
//                   <p className="w-[100px] text-base text-[#786464]">{news.newsDate.join('-')}</p>
//                   <p className="w-[calc(100%-100px)] text-base text-[#786464] cursor-pointer hover:underline" onClick={() =>
//                     router.push(`/news/${encryptString(news.newsId.toString())}`)
//                   }>{news.title}</p>
//                 </div>
//               ))}
//             {newDataList?.length === 0 && (
//               <p className="text-center text-sm md:text-base text-gray-500 font-semibold whitespace-nowrap">
//                 ニュースはまだありません。
//               </p>
//             )}
//           </div>
//           <div className="block md:hidden text-right mt-5">
//             <ButtonLink href="/news" className="">もっと見る</ButtonLink>
//           </div>
//         </div>

//         {/* <div className="flex md:my-10 my-2 gap-6 overflow-x-auto scrollbar-hide">
//           {newsData?.data?.map((news: News) => (
//             <div key={news.news_id} className="flex-shrink-0">
//               <NewsCardComponent
//                 date={news.news_date}
//                 title={news.title}
//                 handleClick={() =>
//                   router.push(`/news/${encryptString(news.news_id.toString())}`)
//                 }
//               />
//             </div>
//           ))}
//         </div> */}
//       </div>
//     </SectionLayout>
//   );
// };

// export default NewsSectionComponent;