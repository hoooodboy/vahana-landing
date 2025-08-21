const BASE_URL = "https://alpha.vahana.kr";

export type SubscribeUser = {
  id: number;
  username?: string;
  name?: string;
  email?: string;
  profileImage?: string | null;
  ciVerified?: boolean;
  referralCode?: string;
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
    profileImage: u.profile_image ?? null,
    ciVerified: u.ci_verified ?? false,
    referralCode: u.referral_code,
  };
  return mapped;
}
