import { apiRoutes } from "@/lib/api/api.route";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NewsPayload } from "@/types/admin/news.type";

/**
 * Use news
 * @param page - Page number
 * @param pageSize - Page size
 * @param title - News title
 * @param status - News status
 * @param newsDate - News date
 * @param target - Target user
 * @returns
 * @example
 * const { data, isLoading, error } = useNews(page, pageSize, title, status, newsDate, target);
 * @author ヤン
 */
export const useNewsList = (
  page: number = 1,
  pageSize: number = 10,
  title: string = "",
  status: string = "",
  newsDate: string = "",
  target: string = "",
) => {
  return useQuery({
    queryKey: ["news", page, pageSize, title, status, newsDate, target],
    queryFn: () =>
      apiRoutes.admin.news.getNews(
        page,
        pageSize,
        title,
        status,
        newsDate,
        target,
      ),
  });
};

/**
 * Use news by id
 * @param newsId - News id
 * @returns
 * @example
 * const { data, isLoading, error } = useNewsById(newsId);
 * @author ヤン
 */
export const useNewsById = (newsId: number) => {
  return useQuery({
    queryKey: ["newsById", newsId],
    queryFn: () => apiRoutes.admin.news.getNewsById(newsId),
    select: (data) => data.data,
    enabled: !!newsId,
  });
};

/**
 * Use change news status
 * @param newsId - News id
 * @param status - News status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeNewsStatus(newsId, status);
 * @author ヤン
 */
export const useChangeNewsStatus = (newsId: number, status: boolean) => {
  return useMutation({
    mutationKey: ["change-news-status"],
    mutationFn: () => apiRoutes.admin.news.updateNewsStatus(newsId, status),
  });
};

/**
 * Use create news
 * @param news - News
 * @returns
 * @example
 * const { mutate, isLoading, error } = useCreateNews(news);
 * @author ヤン
 */
export const useCreateNews = () => {
  return useMutation({
    mutationKey: ["create-news"],
    mutationFn: (data: NewsPayload) => apiRoutes.admin.news.createNews(data),
  });
};

/**
 * Use update news
 * @param news - News
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateNews(news);
 * @author ヤン
 */
export const useUpdateNews = () => {
  return useMutation({
    mutationKey: ["update-news"],
    mutationFn: (news: {
      title: string;
      content: string;
      news_id: number;
      newsDate: string;
      targetId: number;
      expireLength?: number;
      expireType?: number;
    }) =>
      apiRoutes.admin.news.updateNews(news.news_id, {
        title: news.title,
        content: news.content,
        newsDate: news.newsDate,
        targetId: news.targetId,
        expireLength: news.expireLength,
        expireType: news.expireType,
        isActive: true,
      }),
  });
};

/**
 * Use delete news
 * @param newsId - News id
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteNews(newsId);
 * @author ヤン
 */
export const useDeleteNews = () => {
  return useMutation({
    mutationKey: ["delete-news"],
    mutationFn: (newsId: number) => apiRoutes.admin.news.deleteNews(newsId),
  });
};
