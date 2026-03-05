import { apiRoutes } from "@/lib/api/api.route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use news
 * @returns
 * @author ヤン
 */
export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await axios.get("/api/news");
      return res.data;
    },
  });
};

/**
 * Use news by id
 * @param newsId - News id
 * @returns
 * @author ヤン
 */
// export const useNewsById = (newsId: number) => {
//   return useQuery({
//     queryKey: ["newsById", newsId],
//     queryFn: async () => {
//       const res = await axios.get(`/api/news/${newsId}`);
//       return res.data;
//     },
//     enabled: !!newsId,
//   });
// };

/**
 * Use news list
 * @param page - Page number
 * @param pageSize - Page size
 * @returns
 * @author ヤン
 */
export const useNewsList = (
  page: number = 1,
  pageSize: number = 10,
  searchNewsTitle: string = "",
  searchNewsDate: string = "",
) => {
  return useQuery({
    queryKey: ["news", page, pageSize, searchNewsTitle, searchNewsDate],
    queryFn: () => apiRoutes.public.publicNews(page, pageSize, searchNewsTitle, searchNewsDate)
  });
};


export const usePublicNewsList = (
  page: number = 1,
  pageSize: number = 10,
  title: string = "",
  newsDate: string = ""
) => {
  return useQuery({
    queryKey: ["news-public"],
    queryFn: async () => {
      return await apiRoutes.public.publicNews(page, pageSize, title, newsDate);
    },
  });
};


/**
 * Use news by id
 * @param newsId - News id
 * @returns
 * @author ヤン
 */
export const useNewsById = (newsId: number | null) => {
  return useQuery({
    queryKey: ["newsById", newsId],
    queryFn: () => apiRoutes.public.publicNewsById(newsId),
    enabled: !!newsId,
  });
};

