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
    if (navigator.share) {
      navigator.share({
        title: "fandly",
        url: window.location.href,
      });
    } else {
      handleCopyClick();
    }
  };

  return { currentUrl: window.location.href, onShare };
};

export default useCopyCurrentUrl;
