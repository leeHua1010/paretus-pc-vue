import { defineStore } from "pinia";
import storage from "~/utils/storage";

const MEDIA_API = import.meta.env.VITE_MEDIA_API;

export const useAppStore = defineStore("app", {
  state() {
    return {
      userInfo: storage.getUserInfo(),
    };
  },
  getters: {
    avatarUrl: (state) => {
      return `${MEDIA_API}${state.userInfo?.avatar.url}`;
    },
  },
  actions: {
    setUserInfo(data) {
      this.userInfo = data;
    },
  },
});
