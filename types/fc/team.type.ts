// fcMemberTree.type.ts

export interface TeamList {
  fcId: number; // m.fc_id
  referrerId: number; // m.refereer_fc_id
  role: number;
  planName: string; // fc_plan_master.plan_name
  memberName: string; // u.username
  userPhoto: string | null; // u.user_photo (nullable if no image)
  contractDate: string; // m.contract_start_dt (ISO date string from API)
  contractPlan: number; // m.contract_fc_plan_master_id
  bonusAmount: number; // total bonus amount for the member;
  thisMonthOrderAmount: number; // bonus amount for the current month
  underMemberCount: number; // COUNT(r.descendant) - 1
  totalOrderAmount: number;
}

// Team Hierarchy Types
export interface SubMember {
  no: number;
  level: string;
  username: string;
  registerDate: string;
  planName: string;
  detail: string;
  purchaseAmount: string;
  providedPartner: string;
  memberFee: string;
  adminFee: string;
  referralLink: string;
}

export interface Member {
  no: number;
  level: string;
  username: string;
  registerDate: string;
  planName: string;
  detail: string;
  purchaseAmount: string;
  providedPartner: string;
  memberFee: string;
  adminFee: string;
  referralLink: string;
  subMembers?: SubMember[];
}

export interface LevelData {
  level: number;
  title: string;
  members: Member[];
}

export interface TeamLevelData {
  level: number;
  buyerName: string;
  buyerPlanName: string;
  buyerTotalAmount: number;
  buyerTotalMember: number;
  buyerTotalMemberFee: number;
  buyerAdminFee: number;
  userId: number;
  contractStartDate: [number, number, number]; 
  contractEndDate: [number, number, number];
  totalOrderCount: number;
}

export interface TeamLevelResponse {
  data: TeamLevelData[];
}

export interface TeamPeriodData {
  fcYearMonth: string;
}
