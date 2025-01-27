import { toast } from "react-toastify";
import { cert } from "../api/user";

export const useCert = (link?: string) => {
  (window as any).IMP.init("imp62586271");

  (window as any).IMP.certification(
    {
      pg: "inicis_unified.MIIfandlly", //본인인증 설정이 2개이상 되어 있는 경우 필수
      // merchant_uid: "ORD20180131-0000011", // 주문 번호
      ...(link && {
        m_redirect_url: link, // 모바일환경에서 popup:false(기본값) 인 경우 필수, 예: https://www.myservice.com/payments/complete/mobile
        popup: false,
      }), // PC환경에서는 popup 파라미터가 무시되고 항상 true 로 적용됨
    },
    async function (rsp) {
      if (rsp.success) {
        const { imp_uid } = rsp;
        console.log("rsp", rsp);
        cert({ imp_uid });
        toast("인증이 완료되었습니다.");
      } else {
        toast("인증에 실패하였습니다. 에러 내용: " + rsp.error_msg);
      }
    }
  );
};
