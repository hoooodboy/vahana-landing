const BASE_URL = "https://alpha.vahana.kr";

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
  car: number;
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

export async function getSubscribeCurrentUser(
  token: string
): Promise<SubscribeUser> {
  // Switch to GET /accounts per provided spec
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Accounts API expects Authorization without Bearer? If Bearer fails, try raw token header
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to load user: ${res.status}`);
  }
  const data = await res.json();
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

export async function getSubscriptionRequests(
  token: string
): Promise<SubscriptionRequest[]> {
  const res = await fetch(`${BASE_URL}/subscriptions/requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      text || `Failed to load subscription requests: ${res.status}`
    );
  }
  return await res.json();
}
