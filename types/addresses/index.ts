export type Address = {
  address_id: number;
  user_id: string;
  postal_code: string;
  prefecture: string;
  city: string;
  street_address: string;
  building_name: string | null;
  room_number: string | null;
  country: string;
  address_type: "shipping" | "billing" | "default";
  is_default: boolean;
  recipient_first_name?: string | null;
  recipient_last_name?: string | null;
  recipient_phone_number: string | null;
  recipient_name: string | null;
};

export type AddressForm = {
  address_id?: number;
  user_id?: string;
  postal_code: string;
  prefecture: string;
  city: string;
  street_address: string;
  building_name: string | null;
  room_number: string | null;
  country: string;
  address_type?: "shipping" | "billing" | "default";
  is_default?: boolean;
  recipient_first_name?: string | null;
  recipient_last_name?: string | null;
  recipient_phone_number: string | null;
  recipient_name: string | null;
};


export type AddressResponse = {
  status: string;
  message: string;
  code: number;
  data: UserAddress[];
};

export type UserAddress = {
  addressId: number;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string;
  name: string;
  phoneNumber: string;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
};