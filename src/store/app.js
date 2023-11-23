import { defineStore } from "pinia";
import storage from "~/utils/storage";

export const useAppStore = defineStore("app", {
  state() {
    return {
      userInfo: storage.getUserInfo(),
    };
  },
  actions: {
    setUserInfo(data) {
      this.userInfo = data;
    },
  },
});
