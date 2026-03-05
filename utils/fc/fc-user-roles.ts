export enum FcUserRole {
  MANAGER = 1,
  CONSULTANT = 2,
  LEADER = 3,
  SPECIALIST = 4,
  NORMAL = 5,
}

export const imageBlurAccess = (role: number): boolean => {
  return [
    FcUserRole.MANAGER,
    FcUserRole.CONSULTANT,
    FcUserRole.LEADER,
    FcUserRole.SPECIALIST,
  ].includes(role);
};