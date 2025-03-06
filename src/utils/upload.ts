const { VITE_APP_IMG_HOST } = import.meta.env;

const imgView = (url: string) => {
  return `${VITE_APP_IMG_HOST}${url}?w=420&f=cover` as string;
};

export { imgView };
