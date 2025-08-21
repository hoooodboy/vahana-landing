import { toast } from "react-toastify";

const useCopyCurrentUrl = () => {
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast("URL이 복사되었습니다.");
      })
      .catch(() => {
        toast("URL 복사 중 오류가 발생했습니다.");
      });
  };

  const onShare = () => {
    // 모바일 환경에서만 공유 다이얼로그 사용
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (navigator.share && isMobile) {
      navigator.share({
        title: "VAHANA",
        url: window.location.href,
      });
    } else {
      // PC에서는 항상 복사 기능 사용
      handleCopyClick();
    }
  };

  return { currentUrl: window.location.href, onShare };
};

export default useCopyCurrentUrl;
