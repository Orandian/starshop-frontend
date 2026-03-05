import { apiRoutes } from "@/lib/api/api.route";
// import { NewsItem } from "@/types/news";
import { useQuery } from "@tanstack/react-query";

  /**
   * Use News
   * @author Paing Sett Kyaw
   * @created 2025-12-29
   * @updated ****-**-**
   * @returns Query
   */
export const useNews = () =>
  useQuery({
    queryKey: ["fc-news"],
    queryFn: () => apiRoutes.fc.fcNews.fcGetAllNews(),
  });

  