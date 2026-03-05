import { Pagination } from "./bonus.type";

export interface TotalFc {
  manager: number;
  consultant: number;
  leader: number;
  specialist: number;
  member: number;
  total: number;
  thisMonthSales: number;
  thisMonthBonus: number;
}

export interface ActivityResponse {
  data: Activity[];
  pagination: Pagination;
}

/**
 * Activity Type
 * Represents the activity entity from the database
 */
export interface Activity {
  activityId: number;
  title: string;
  message: string;
  createdAt: string; // ISO date string
}

export interface Statistic {
  purchasesThisMonth: number;
  purchasesThisYear: number;
  profit:number;
  unProcessOrder:number;
  thisMonthRegisterCustomer:number;
  outOfStockItem:number;
}