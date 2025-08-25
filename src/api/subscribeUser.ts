import { subscribeApi } from "./subscribeApiClient";

export type SubscribeUser = {
  id: number;
  username?: string;
  name?: string;
  email?: string;
  mobile?: string;
  profileImage?: string | null;
  ciVerified?: boolean;
  referralCode?: string;
};

export type SubscriptionRequest = {
  id: number;
  user: number;
  car: {
    id: number;
    retail_price: number;
    release_date: string;
    mileage: number;
    is_new: boolean;
    is_hot: boolean;
    subscription_info: any;
    subscription_fee_1: number | null;
    subscription_fee_3: number | null;
    subscription_fee_6: number | null;
    subscription_fee_12: number | null;
    subscription_fee_24: number | null;
    subscription_fee_36: number | null;
    subscription_fee_48: number | null;
    subscription_fee_60: number | null;
    subscription_fee_72: number | null;
    subscription_fee_84: number | null;
    subscription_fee_96: number | null;
    model: {
      id: number;
      brand: {
        id: number;
        name: string;
        image: string | null;
      };
      name: string;
      image: string;
      code: string;
    };
    vin_number: string;
    license_plate: string | null;
    description: string;
    images: string[];
    is_sellable: boolean;
    sell_price: number | null;
    is_subscriptable: boolean;
    created_at: string;
    modified_at: string;
    is_active: boolean;
  };
  month: number;
  created_at: string;
  modified_at: string;
  coupon: {
    id: number;
    user: number;
    coupon: {
      id: number;
      code: string;
      name: string;
      description: string;
      brand_ids: number[];
      model_ids: number[];
      car_ids: number[];
      discount_type: string;
      discount_rate: number;
      max_discount: number;
      discount: number | null;
      min_price: number;
      max_price: number;
      min_month: number;
      max_month: number;
      valid_from: string;
      valid_to: string;
      is_specific: boolean;
    };
    is_active: boolean;
    is_used: boolean;
    is_valid: boolean;
    created_at: string;
    used_at: string;
  } | null;
  is_active: boolean;
};

export async function getSubscribeCurrentUser(): Promise<SubscribeUser> {
  const data = await subscribeApi.get<{ user: any }>("/accounts");
  const u = data?.user ?? {};
  const mapped: SubscribeUser = {
    id: u.id,
    username: u.username,
    name: u.name,
    email: u.email,
    mobile: u.mobile,
    profileImage: u.profile_image ?? null,
    ciVerified: u.ci_verified ?? false,
    referralCode: u.referral_code,
  };
  return mapped;
}

export async function getSubscriptionRequests(): Promise<
  SubscriptionRequest[]
> {
  return await subscribeApi.get<SubscriptionRequest[]>(
    "/subscriptions/requests"
  );
}

export async function requestCarModel(modelName: string): Promise<void> {
  await subscribeApi.post("/subscriptions/models/request", {
    model: modelName,
  });
}
