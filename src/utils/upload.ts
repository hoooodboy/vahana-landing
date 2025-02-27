const imgView = (url: string) => {
  return `https://bk-vahana.s3.ap-northeast-2.amazonaws.com${url}?w=420&f=cover` as string;
};

export { imgView };
