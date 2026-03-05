export type UserProfile = {
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    firstNameKana: string;
    lastNameKana: string;
    userPhoto: string;
    phoneNumber: string;
    registrationDate: string;
    lastLogin: string;
    userType: string; // e.g., 'admin', 'fc', 'customer'
    isActive: boolean;
};

export type UserProfileResponse = {
  status: number;
  message: string;
  data:  UserProfile;
};

export type UserProfileUpdateRequest = {
  name?: string;
  userPhoto?: string;
};


export type UserPasswordChangeRequest = {
  newPassword?: string;
  confirmPassword?: string;
};

export type UserPasswordChangeResponse = {
  status: number;
  message: string;
};