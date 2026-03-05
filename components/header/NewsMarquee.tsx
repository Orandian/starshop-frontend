import { useNews } from "@/hooks/fc";
import { NewsItem } from "@/types/fc";
import { encryptString } from "@/utils";
import { Megaphone } from "lucide-react";
import React, { useEffect, useRef } from "react";

export const NewsMarquee = () => {
  const { data: newsData, isLoading, error } = useNews();
  const allNewsList = (newsData?.data?.data || []) as NewsItem[];
  // Filter to show only active news
  const newsList = allNewsList.filter((news) => news.isActive);

  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    if (!marqueeElement) return;

    const handleMouseEnter = () => {
      marqueeElement.style.animationPlayState = "paused";
    };

    const handleMouseLeave = () => {
      marqueeElement.style.animationPlayState = "running";
    };

    marqueeElement.addEventListener("mouseenter", handleMouseEnter);
    marqueeElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      marqueeElement.removeEventListener("mouseenter", handleMouseEnter);
      marqueeElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const stripHtmlAndLimit = (html: string, maxLength: number = 10): string => {
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 py-2 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full max-w-md mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || newsList.length === 0) {
    return (
      <div className="w-full bg-gray-50 py-2 overflow-hidden">
        <div className="text-center text-sm text-gray-500">
          {error ? "Error loading news" : "ニュースはまだありません。"}
        </div>
      </div>
    );
  }

  // Duplicate the news list for seamless scrolling
  const duplicatedNewsList = [...newsList, ...newsList];

  return (
    <div className="w-full bg-gray-50 py-2 overflow-hidden ">
      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-8 bg-linear-to-r from-gray-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-8 bg-linear-to-l from-gray-50 to-transparent z-10"></div>

        <div
          ref={marqueeRef}
          className="flex w-fit whitespace-nowrap animate-marquee"
        >
          {duplicatedNewsList.map((news: NewsItem, index) => (
            <React.Fragment key={`${news.newsId}-${index}`}>
              <a
                href={`/news/${encryptString(news.newsId.toString())}`}
                target="_blank"
                className="inline-flex items-center mx-8 text-sm text-gray-700  cursor-pointer transition-colors hover:text-primary"
              >
                <span className="text-gray-500 mr-3">
                  {news.newsDate.join("-")}
                </span>
                <span className="font-medium">{news.title}</span>
                <span className="text-gray-400 mx-2">—</span>
                <span className="font-medium">
                  {stripHtmlAndLimit(news.content)}
                </span>
              </a>
              {index < duplicatedNewsList.length - 1 && (
                <span className="text-gray-400 mx-2">
                  <Megaphone className="w-4 h-4 text-black" />
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

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
          animation: marquee 120s linear infinite;
        }
      `}</style>
    </div>
  );
};
