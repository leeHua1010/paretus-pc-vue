import { defineStore } from "pinia";
import storage from "~/utils/storage";

const mediaApi = import.meta.env.VITE_MEDIA_API;

export const useAppStore = defineStore("app", {
  state() {
    return {
      userInfo: storage.getUserInfo(),
    };
  },
  getters: {
    avatarUrl: (state) => {
      return `${mediaApi}${state.userInfo?.avatar.url}`;
    },
  },
  actions: {
    setUserInfo(data) {
      this.userInfo = data;
    },
  },
});
