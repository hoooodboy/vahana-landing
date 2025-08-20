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
  (window as any).IMP.init("imp61282785");

  const currency = userCurrency();

  if (currency === "₩") {
    console.log("키움페이 결제 요청:", {
      pg: "daou",
      merchant_uid: orderId,
      name: name,
      amount: amount * price,
      buyer_email: buyer_email,
      buyer_name: buyer_name,
    });

    return (window as any).IMP.request_pay(
      {
        channelKey: "channel-key-286b71fe-5b22-4193-9659-048f6000ef8c", // 포트원 콘솔에서 채널키 확인 필요
        pay_method: "card",
        merchant_uid: orderId,
        escrow: false,
        amount: 1000,
        name: name,
        buyer_name: buyer_name,
        buyer_email: buyer_email,
        transaction_id: orderId,
        buyer_tel: userInfo.number || "010-4242-4242",
        digital: false, // 디지털로 계약되었다면 true로 설정
        m_redirect_url: window.location.href,
        bypass: {
          // 키움페이 전용 파라미터
          daou: {
            PRODUCTCODE: "portone",
            CASHRECEIPTFLAG: 0,
          },
        },
        // app_scheme: "portoneappscheme",
      },
      function (rsp) {
        console.log("rsp", rsp);
        // callback 로직 - 키움페이 특이사항 반영
        const { imp_uid, merchant_uid, error_msg, success, imp_success } = rsp;

        // 키움페이: PC는 success, 모바일은 imp_success 사용 (deprecated 되었지만 호환성 유지)
        const isSuccess = success || imp_success;

        if (!!error_msg) {
          console.log("cancel");
          postPurchaseCancel({
            orderId: merchant_uid,
          }).then((res) => console.log("구매 취소", res.result));
          setIsLoading(false);
          return toast(error_msg);
        }

        if (!!merchant_uid) {
          setTimeout(() => {
            getPurchase(merchant_uid).then((res) => {
              setResultCards(res.result);
              // 결제 완료 페이지로 이동 (결제 정보와 함께)
              const successUrl = `/subscribe/success?payment_id=${merchant_uid}&amount=${amount * price}&month=${userInfo.month || 1}&car_id=${packId}`;
              window.location.href = successUrl;
            });
            setIsLoading(false);
          }, 4200);
        } else {
          postPurchaseCancel({
            orderId: merchant_uid,
          }).then((res) => console.log("구매 취소", res.result));
          setIsLoading(false);
        }
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
