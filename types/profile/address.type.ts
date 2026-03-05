export interface ShippingAddressResponse {
  addressId: number;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string | null;
  name: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostcodeLookupResponse {
  city_ward_town: string;
  address: string;
  prefecture: string;
}

export type AddressDataForm = {
  recipient_first_name?: string;
  recipient_last_name?: string;
  recipient_phone_number: string;
  recipient_name : string;
  postal_code: string;
  prefecture: string;
  city: string;
  street_address: string;
  building_name?: string | "";
  room_number?: string | "";
  country: string;
};

export interface AddressUpdateRequest {
  addressId?: number;
  addressData: AddressDataForm;
}

export interface AddressCreateRequest {
  addressData: {
    recipient_first_name?: string;
    recipient_last_name?: string;
    recipient_name: string | null;
    recipient_phone_number: string;
    postal_code: string;
    prefecture: string;
    city: string;
    street_address: string;
    building_name?: string | "";
    room_number?: string | "";
    country: string;
  };
}

export interface PostcodeLookupRequest {
  postcode: string;
}

export interface PostcodeResponse {
  data?: PostcodeLookupResponse;
  message?: string;
  code: string;
}