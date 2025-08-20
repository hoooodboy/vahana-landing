const userCurrency = () => {
  const currency = localStorage.getItem("currency");
  return currency || "₩";
};

export default userCurrency;
