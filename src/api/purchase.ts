// 임시 API 함수들 - 실제 구현 시 서버 API로 교체 필요
export const getPurchase = async (orderId: string) => {
  // 실제로는 서버에서 구매 정보를 가져오는 API 호출
  return Promise.resolve({ result: { orderId, status: "success" } });
};

export const postPurchaseCancel = async ({ orderId }: { orderId: string }) => {
  // 실제로는 서버에서 구매 취소 API 호출
  return Promise.resolve({ result: { orderId, status: "cancelled" } });
};

export const postPurchasePrepare = async ({
  packId,
  price,
  amount,
  currency,
}: {
  packId: string;
  price: number;
  amount: number;
  currency: string;
}) => {
  // 실제로는 서버에서 구매 준비 API 호출
  const orderId = `subscription_${Date.now()}`;
  return Promise.resolve({ result: { id: orderId } });
};
