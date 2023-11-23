<script setup>
import { ConfigProvider } from "ant-design-vue";

const themeOverrides = {
  token: {
    colorPrimary: "#4945ff",
  },
};
</script>

<template>
  <config-provider :theme="themeOverrides">
    <router-view></router-view>
  </config-provider>
</template>
