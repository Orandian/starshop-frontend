// Fixed hook without infinite loop
import { useState, useCallback, useEffect } from "react";
import { UserDetail } from "@/types/fc/user.type";

export const useBankValidation = (user: UserDetail | null) => {

  // Pure validation function - no state changes
  const checkBankInfo = useCallback((): boolean => {
    if (!user) return false;

    // Check only the required fields that need to be filled
    return !!(
      user.bankName?.trim() &&           // Currently blank
      user.branchName?.trim() &&         // Currently blank  
      user.branchNumber?.trim() &&       // Currently blank
      user.bankAccountNumber?.trim() &&  // Currently blank
      user.bankAccountName?.trim()       // Currently blank
    );
  }, [user]);
  // Return the validation result
  return {
    needsBankInfo: !checkBankInfo(),
    checkBankInfo
  };
};