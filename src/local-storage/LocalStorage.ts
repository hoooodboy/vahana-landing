import isNullOrUndefined from "../utils/isNullOrUndefined";

const LocalStorage = {
  get(key: string) {
    return localStorage.getItem(key);
  },
  set(key: string, value: string) {
    return localStorage.setItem(key, value);
  },
  remove(key: string) {
    return localStorage.removeItem(key);
  },

  getBool(key: string) {
    const value = this.get(key);
    if (isNullOrUndefined(value)) {
      return value;
    }
    return value === "true";
  },
  setBool(key: string, value: boolean) {
    return this.set(key, value ? "true" : "false");
  },

  getJson(key: string) {
    const value = this.get(key);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch (err) {
      console.warn("LocalStorage.getJson() error", err);
      return null;
    }
  },
  setJson(key: string, value: Record<string, any>) {
    try {
      return this.set(key, JSON.stringify(value));
    } catch (err) {
      console.warn("LocalStorage.setJson() error", err);
    }
  },
};

export default LocalStorage;
