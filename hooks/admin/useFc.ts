import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api/api.route";
import { UpdateFCPlanProduct, UpdateFcPlan } from "@/types/admin/fcplan.type";

/**
 * get all fc plans just name
 */
export const useFcPlans = () => {
    return useQuery({
        queryKey: ["fc-plans"],
        queryFn: () => apiRoutes.admin.fc.getPlans(),
        select: (response) => response?.data,
    });
}

/**
 * get all fc users
 */
export const useFcUsers = (period : string) =>{
    return useQuery({
        queryKey: ["fc-users", period],
        queryFn: () => apiRoutes.admin.fc.getUsers(period),
        select: (response) => response?.data,
    })
}

/**
 * get fc dashboard data
 * @param period - period filter
 */
export const useFcDashboardData = (period: string) => {
    return useQuery({
        queryKey: ["fc-dashboard-data", period],
        queryFn: () => apiRoutes.admin.fc.getFcDashboardData(period),
        select: (response) => response?.data,
    });
}

/**
 * get fc dashboard period list
 */
export const useFcDashboardPeriodList = () => {
    return useQuery({
        queryKey: ["fc-dashboard-period-list"],
        queryFn: () => apiRoutes.admin.fc.getFcDashboardDataPeriodList(),
        select: (response) => response?.data,
    });
}


/**
 * get all fc plan master data
 */
export const useFcPlanMaster = () => {
    return useQuery({
        queryKey: ["fc-plan-master"],
        queryFn: () => apiRoutes.admin.fc.getPlanMaster(),
        select: (response) => response?.data,
    });
}

/**
 * Use change plan status
 * @param planId - Plan id
 * @param status - Plan status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangePlanStatus(planId, status);
 * @author Phway
 */
export const useChangePlanStatus = (planId: string|number, status: boolean) => {
  return useMutation({
    mutationKey: ["changePlanStatus", planId],
    mutationFn: () => apiRoutes.admin.fc.updatePlanStatus(planId, status),
  });
};

/**
 * Update FC User's status
 * @param fcId - FC User ID
 * @param status - New status
 * @returns 
 */

export const useFcPendingUsers = () => {
  return useQuery({
    queryKey: ["fc-pending-users"],
    queryFn: () => apiRoutes.admin.fc.getFcPendingUsers(),
    select: (response) => response?.data,
  });
}
/**
 *  Update FC User Status
 * @param fcId   
 * @param status 
 * @returns 
 */
export const useUpdateFcUserStatus = (fcId: number, status: number, amount:number) => {
  return useMutation({
    mutationKey: ["update-fc-user-status", fcId],
    mutationFn: () => apiRoutes.admin.fc.updateFcStatus(fcId, status,amount),
  });
}

/**
 *  Get Period Upgrade
 * @returns 
 */
export const useGetPeriodUpgrade = () => {
  return useQuery({
    queryKey: ["get-period-upgrade"],
    queryFn: () => apiRoutes.admin.fc.getPeriodUpgrade(),
  });
}

/**
 * Update Period Upgrade
 * @param period - The period value to update
 * @returns 
 */
export const useUpdatePeriodUpgrade = () => {
  return useMutation({
    mutationKey: ["update-period-upgrade"],
    mutationFn: (period: number) => apiRoutes.admin.fc.updatePeriodUpgrade(period),
  });
}

export const useUpdatePlan = ()=> {
    return useMutation({
    mutationKey: ["update-fc-plan"],
    mutationFn: (plan: UpdateFcPlan) => apiRoutes.admin.fc.updatePlan(plan),
  });
}

export const useGetAllFcPlanProducts = () => {
  return useQuery({
    queryKey: ["get-all-fc-plan-products"],
    queryFn: () => apiRoutes.admin.fc.getAllFCPlanProducts(),
  });
}

export const useGetFcPlanProducts = () => {
  return useQuery({
    queryKey: ["get-fc-plan-products"],
    queryFn: () => apiRoutes.admin.fc.getFCPlanProducts(),
  });
}

export const useUpdateFcPlanProducts = () => {
  return useMutation({
    mutationKey: ["update-fc-plan-products"],
    mutationFn: (payload: UpdateFCPlanProduct) => apiRoutes.admin.fc.updateFCPlanProducts(payload),
  });
}

/**
 * get fc users with plan
 */
export const useGetFcWithPlanInfo = (page: number =1, size: number =10) => {
     return useQuery({
        queryKey: ["fc-with-plan-info", page, size],
        queryFn: () => apiRoutes.admin.fc.getFcWithPlanInfo(page, size),
        select: (response) => response?.data,
    });
}

/**
 * get fc approved history with pagination
 */
export const useGetFcApprovedHistory = (page: number = 1, size: number = 10) => {
    return useQuery({
        queryKey: ["fc-approved-history", page, size],
        queryFn: () => apiRoutes.admin.fc.getFcApprovedHistory(page, size),
        select: (response) => response?.data,
    });
}
