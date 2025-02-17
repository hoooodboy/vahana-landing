const Storage = {
  async get(key: string) {
    return await sessionStorage.getItem(key);
  },
  async set(key: string, value: string) {
    return await sessionStorage.setItem(key, value);
  },
  async remove(key: string) {
    return await sessionStorage.removeItem(key);
  },

  async getJSON(key: string) {
    const result = await sessionStorage.getItem(key);
    return result ? JSON.parse(result) : result;
  },
  async setJSON(key: string, value: Record<string, string>) {
    return await sessionStorage.setItem(key, JSON.stringify(value));
  },
};

export default Storage;
