<script setup>
import { useRouter } from "vue-router";
import { useAppStore } from "~/store/app";
import storage from "~/utils/storage";
import { IconLogout, IconUserCircle } from "@tabler/icons-vue";

const router = useRouter();
const appStore = useAppStore();

const goLogin = () => router.push({ path: "/auth/login" });

const goSignup = () => router.push({ path: "/auth/register" });

const goHome = () => router.push({ path: "/" });

const goCreateArticle = () => router.push({ path: "/article/create" });

const goProfile = () => router.push({ path: "/profile/info" });

const handleLogout = () => {
  storage.setUserInfo(null);
  storage.setToken("");
  appStore.setUserInfo(null);
  goHome();
};
</script>

<template>
  <div class="h-screen bg-light-400 box-border">
    <div class="bg-white h-14 shadow-sm px-24 fcb box-border <sm:px-3">
      <div class="cursor-pointer fcc" @click="goHome">
        <i class="text-3xl text-[#4945ff] i-tabler-aperture hover:animate-spin"></i>
        <div class="text-xl pl-2">Paretus</div>
      </div>
      <div class="fcc" v-if="!appStore.userInfo">
        <div class="mr-4">
          <a-button type="primary" @click="goLogin" shape="round">Login</a-button>
        </div>
        <a-button type="primary" @click="goSignup" ghost shape="round">Sign up</a-button>
      </div>
      <div v-else class="flex items-center">
        <div class="cursor-pointer flex mr-6 items-center" @click="goCreateArticle">
          <i class="text-lg i-tabler-edit"></i>
          <div class="text-sm pl-1">Write</div>
        </div>
        <div class="cursor-pointer flex items-center">
          <a-dropdown>
            <img
              v-if="appStore.userInfo?.avatar?.url"
              class="rounded-1/2 h-8.5 w-8.5"
              :src="appStore.avatarUrl"
              alt="avatar"
            />
            <div
              v-else
              class="flex bg-[#6a69ff] rounded-1/2 h-8.5 text-white text-sm w-8.5 items-center justify-center"
            >
              {{ appStore.userInfo?.username?.charAt(0).toUpperCase() }}
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <div class="flex items-center" @click="goProfile">
                    <icon-user-circle size="20"></icon-user-circle>
                    <div class="pl-2">Profile</div>
                  </div>
                </a-menu-item>
                <a-menu-item>
                  <div class="flex items-center" @click="handleLogout">
                    <icon-logout size="20"></icon-logout>
                    <div class="pl-2">Logout</div>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>

    <div id="layout" class="h-[calc(100vh-56px)] px-24 pt-4 box-border overflow-y-scroll <sm:px-3">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['Home']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
