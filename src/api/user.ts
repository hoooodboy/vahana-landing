import api from ".";
import LocalStorage from "../local-storage";

// 회원 로그인
const testLogin = async () => {
  return (await api.post(`/user/login/test`)).data;
};

// 회원 로그아웃
const logoutUser = async () => {
  return (await api.post(`/auth/logout`)).data;
};

// 포인트 충전
const chargePoint = async (id: number, amount: number, cuz: string) => {
  const requestData = { id, amount, cuz };
  return await api.post("/user/point/charge", requestData);
};

// 포인트 지불
const payPoint = async (id: number, amount: number, cuz: string) => {
  const requestData = { id, amount, cuz };
  return await api.post("/user/point/pay", requestData);
};

// 회원탈퇴
const unlinkUser = async (plat: string, requestData: object) => {
  return await api.post(`/user/unlink/${plat}`, requestData);
};

// 사용자 정보 수정
const setUserInfo = async (args: any) => {
  return (await api.post("/users/my", args)).data;
};

// 사용자 정보 조회
const getUserInfo = async () => {
  const result = (
    await api.get(`/users/my`).catch((e) => {
      localStorage.clear();
      LocalStorage.setBool("SPLASH_TOKEN", true);
      location.reload();

      throw e;
    })
  ).data;

  return result;
};

// 사용자 자산 정보 조회
const getUserAsset = async () => {
  return (await api.get(`/user/asset`)).data; // "GET" 메서드를 사용하여 데이터를 가져옵니다.
};

// 사용자 검색 기록 업데이트 및 검색결과 추출
const updateUserSearch = async (id: number, newSearch: string) => {
  const args = { id, newSearch };
  return await api.post("/user/search", args);
};

// 사용자 검색 기록 리스트 조회
const getUserSearch = async (id: number) => {
  return (await api.get(`/user/search/${id}`)).data;
};

// 사전 등록 추가
const addPreRegist = async (id: number, packId: number) => {
  const requestData = { id, packId };
  return await api.post("/user/regist", requestData);
};

// 관심 추가 또는 제거
const addOrRemoveFavor = async (uid: number, type: string, id: number | string) => {
  return await api.post(`/user/favorite/${type}/${id}`, { uid });
};

// 관심 여부 확인
const checkFavor = async (uid: number, type: string, id: number | string) => {
  return await api.post(`/user/favorite/get/${type}/${id}`, { uid });
};

const postBuy = async (data: any) => {
  return (await api.post(`/user/buy/pack`, data)).data;
};

const getCollectionFollow = async () => {
  return (await api.get(`/user/follow/collection`)).data;
};

const getPacksFollow = async () => {
  return (await api.get(`/user/follow/pack`)).data;
};

const getCardsFollow = async (id?: any) => {
  return (await api.get(`/user/follow/edition`)).data;
};

const postCollectionFollow = async (id?: any) => {
  return await api.post(`/user/follow/collection${id ? `/${id}` : ""}`);
};

const postPackFollow = async (id?: any) => {
  return await api.post(`/user/follow/pack${id ? `/${id}` : ""}`);
};

const postEditionFollow = async (id?: any) => {
  return await api.post(`/user/follow/edition${id ? `/${id}` : ""}`);
};

const postPointCharge = async (data: { amount: number; orderId: number }) => {
  return (await api.post(`/user/point/charge`, data)).data;
};

const getPacksHistory = async (id?: any) => {
  return (await api.get(`/user/history/pack`)).data;
};

const getPointHistory = async (id?: any) => {
  return (await api.get(`/user/history/point`)).data;
};

const getReserveHistory = async (id?: any) => {
  return (await api.get(`/user/history/reserve`)).data;
};

const getMyPackHistory = async (id?: any) => {
  return (await api.get(`/user/my/pack`)).data;
};

const getMyPackBenefitHistory = async (id?: any) => {
  return (await api.get(`/user/my/pack/benefit`)).data;
};

const getPreRegister = async () => {
  return (await api.get(`/user/regist`)).data;
};

const getInventory = async () => {
  return (await api.get(`/user/inventory`)).data;
};

const postBuyPrepare = async (data: any) => {
  return (await api.post(`/user/buy/prepare`, data)).data;
};

const postInventoryOpen = async (data: any) => {
  return (await api.post(`/user/inventory/one`, data)).data;
};

const postInventoryOpenAll = async (data: any) => {
  return (await api.post(`/user/inventory/all`, data)).data;
};

const postFollow = async (data: any) => {
  return (await api.post(`/follow/${data.target}`, { id: data.id })).data;
};

const getFollow = async () => {
  return (await api.get(`/follow/my`)).data;
};

const getMyCollection = async (id?: any) => {
  return (await api.get(`/users/my/collections${!!id ? `/${id}` : ""}`)).data;
};

const getMyPacks = async (id?: any) => {
  return (await api.get(`/assets/packs`)).data;
};

const getMyCollectionsPack = async (id?: any) => {
  return (await api.get(`/users/my/collections/${id}/packs`)).data;
};

const postPreRegist = async (data?: any) => {
  return (await api.post(`/pre-regist`, data)).data;
};

const getPreRegist = async () => {
  return (await api.get(`/pre-regist/my`)).data;
};

const getRecent = async () => {
  return (await api.get(`/users/my/recent`)).data;
};

const getMyAddress = async () => {
  return (await api.get(`/users/my/address`)).data;
};

const getMyAgreement = async () => {
  return (await api.get(`/users/my/agreement`)).data;
};

const postMyAddress = async (data?: any) => {
  return (await api.post(`/users/my/address`, data)).data;
};

const cert = async (data: { imp_uid: string }) => {
  return (await api.post("/users/cert", data)).data;
};

export {
  testLogin,
  logoutUser,
  chargePoint,
  payPoint,
  unlinkUser,
  setUserInfo,
  getUserInfo,
  getUserAsset,
  updateUserSearch,
  getUserSearch,
  addPreRegist,
  getPreRegist,
  addOrRemoveFavor,
  checkFavor,
  postBuy,
  getCollectionFollow,
  getPacksFollow,
  getCardsFollow,
  postCollectionFollow,
  postPackFollow,
  postEditionFollow,
  postPointCharge,
  getPacksHistory,
  getPointHistory,
  getReserveHistory,
  getMyPackHistory,
  getMyPackBenefitHistory,
  getPreRegister,
  postBuyPrepare,
  getInventory,
  postInventoryOpen,
  postInventoryOpenAll,
  getMyCollection,
  postFollow,
  getFollow,
  getMyPacks,
  getMyCollectionsPack,
  postPreRegist,
  getRecent,
  getMyAddress,
  postMyAddress,
  getMyAgreement,
  cert,
};
