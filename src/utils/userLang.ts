const userLang = () => {
  const lang = localStorage.getItem("lang");
  return lang || "ko";
};

export default userLang;
