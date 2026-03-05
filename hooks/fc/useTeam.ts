import { apiRoutes } from "@/lib/api/api.route";
import { useQuery } from "@tanstack/react-query";

export const useTeam = () =>
  useQuery({
    queryKey: ["get-team-list"],
    queryFn: () => apiRoutes.fc.team.fcGetTeamList(),
  });

export const useTeamListByLevel = (
    date?: string | null
) =>
  useQuery({
    queryKey: [
      "get-team-list-by-level",
      { date },
    ],
    queryFn: () =>
      apiRoutes.fc.team.fcGetTeamListByLevel(
        date
      ),
  });

export const useTeamPeriodList = () =>
  useQuery({
    queryKey: ["get-team-period-list"],
    queryFn: () => apiRoutes.fc.team.fcGetTeamPeriodList(),
  });
