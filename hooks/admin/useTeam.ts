import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api/api.route";
//import axios from "axios";

//temp TeamList Interface
export interface TeamList {
  fcId: number; // m.fc_id
  referrerId: number | null; // m.refereer_fc_id
  role: number;
  level?: number;
  planName: string; // fc_plan_master.plan_name
  memberName: string; // u.username
  userPhoto: string | null; // u.user_photo (nullable if no image)
  contractDate: string; // m.contract_start_dt (ISO date string from API)
  contractPlan: number; // m.contract_fc_plan_master_id
  bonusAmount: number; // total bonus amount for the member;
  thisMonthBonusAmount: number; // bonus amount for the current month
  underMemberCount: number; // COUNT(r.descendant) - 1
}

export const useTeam = () => {
  return useQuery({
    queryKey: ["team"],
    queryFn: () => apiRoutes.admin.customer.getTeam(),
    select: (response) => response.data,
  });
};
