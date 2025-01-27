import { toast } from "react-toastify";
import userLang from "./userLang";
import userCurrency from "./userCurrency";
import {
  getPurchase,
  postPurchaseCancel,
  postPurchasePrepare,
} from "../api/purchase";

type Props = {
  price?: any;
  userInfo?: any;
  setIsLoading?: any;
  setResultCards: any;
  name?: string;
  buyer_name?: string;
  buyer_email?: string;
  orderId?: string;
  amount?: number;
  setIsOpen?: any;
  packId: string;
  userInfoCurrency: string;
};

export const usePG = ({
  amount,
  price,
  userInfo,
  name,
  buyer_name,
  buyer_email,
  setIsLoading,
  setResultCards,
  orderId,
  setIsOpen,
  packId,
  userInfoCurrency,
}: Props) => {
  (window as any).IMP.init("imp62586271");

  const currency = userCurrency();

  if (currency === "₩") {
    return (window as any).IMP.request_pay(
      {
        pg: `${import.meta.env.VITE_APP_PG_ID}`,
        pay_method: "card",
        merchant_uid: orderId,
        name: name,
        amount: amount * price, //총 가격
        buyer_email: buyer_email,
        buyer_name: buyer_name,
        buyer_tel: "010-4242-4242",
        buyer_addr: "서울특별시 강남구 신사동",
        buyer_postcode: "01181",
        biz_num: "2868602979",
        // currency: "KRW",
        m_redirect_url: window.location.href,
      },
      function (rsp) {
        console.log("rsp", rsp);
        // callback 로직
        const { imp_uid, merchant_uid, error_msg, success } = rsp;

        if (!!merchant_uid) {
          setTimeout(() => {
            getPurchase(merchant_uid).then((res) => {
              setResultCards(res.result);
            });
            setIsLoading(false);
          }, 4200);
        } else {
          postPurchaseCancel({
            orderId: merchant_uid,
          }).then((res) => console.log("구매 취소", res.result));
          setIsLoading(false);
        }

        if (error_msg) {
          setIsLoading(false);
          return toast(error_msg);
        }
        setIsLoading(true);
        // toast("팩 구매가 완료되었습니다.");
      }
    );
  }

  console.log("orderId", orderId);

  (window as any).IMP.loadUI(
    "paypal-spb",
    {
      pg: "paypal_v2.8ESUKRMCYZ8AU",
      pay_method: "paypal",
      merchant_uid: orderId,
      currency: "USD",
      name: "PRODUCT",
      amount: 1,
      buyer_email: userInfo.email,
      buyer_name: userInfo.name,
      buyer_tel: userInfo.number ?? "010-1234-5678",
      m_redirect_url: location.pathname,
    },

    function (rsp) {
      const { imp_uid, merchant_uid, error_msg, success } = rsp;

      if (success) {
        setTimeout(() => {
          getPurchase(merchant_uid).then((res) => {
            setResultCards(res.result);
          });
          setIsLoading(false);
        }, 4200);
      } else {
        postPurchaseCancel({
          orderId: merchant_uid,
        }).then((res) => console.log("구매 취소", res.result));
        setIsLoading(false);
      }

      if (error_msg) {
        setIsLoading(false);
        return toast(error_msg);
      }
      setIsLoading(true);
    }
  );
};
