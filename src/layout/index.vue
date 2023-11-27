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

const goProfile = () => router.push({ path: "profile/info" });

const handleLogout = () => {
  storage.setUserInfo(null);
  storage.setToken("");
  appStore.setUserInfo(null);
  goHome();
};
</script>

<template>
  <div class="box-border h-screen bg-light-400">
    <div class="bg-white h-14 fcb box-border shadow-sm px-24 <sm:px-3">
      <div class="fcc" @click="goHome">
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
        <div class="flex items-center mr-6 cursor-pointer" @click="goCreateArticle">
          <i class="i-tabler-edit text-lg"></i>
          <div class="pl-1 text-sm">Write</div>
        </div>
        <div class="flex items-center cursor-pointer">
          <a-dropdown>
            <div
              class="bg-[#6a69ff] flex items-center justify-center w-8.5 h8.5 text-white rounded-1/2 text-sm"
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

    <div id="layout" class="px-24 pt-4 h-[calc(100vh-56px)] box-border overflow-y-scroll <sm:px-3">
      <router-view></router-view>
    </div>
  </div>
</template>
