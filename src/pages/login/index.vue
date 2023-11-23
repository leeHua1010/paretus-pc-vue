<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authApi from "~/api/auth";
import { useAppStore } from "~/store/app";
import storage from "~/utils/storage";
import { message } from "ant-design-vue";

const router = useRouter();
const appStore = useAppStore();
const [messageApi, contextHolder] = message.useMessage();

const key = "login";
const loading = ref(false);
const formState = ref({ identifier: "", password: "" });

const goRegister = () => router.push({ path: "/auth/register" });

const onFinish = async (values) => {
  try {
    loading.value = true;
    messageApi.open({ key, type: "loading", content: "Login..." });
    const { data } = await authApi.login(values);
    storage.setToken(data.jwt);
    storage.setUserInfo(data.user);
    appStore.setUserInfo(data.user);
    messageApi.open({ key, type: "success", content: "Welcome back!", duration: 2 });
    loading.value = false;
    router.replace("/");
  } catch (error) {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fcc">
    <context-holder></context-holder>
    <div class="w-100">
      <div class="text-center pt-16">
        <div><i class="text-6xl text-[#4945ff] i-tabler-aperture"></i></div>
        <div class="font-bold pt-2 pb-8 text-2xl">Sign in to your account</div>
      </div>
      <a-form :model="formState" layout="vertical" @finish="onFinish">
        <a-form-item
          label="Email"
          name="identifier"
          :rules="[
            { required: true },
            { type: 'email', message: 'The input is not valid E-mail!' },
          ]"
        >
          <a-input
            placeholder="Please input email"
            size="large"
            v-model:value="formState.identifier"
            autoComplete="off"
          />
        </a-form-item>
        <a-form-item label="Password" name="password" :rules="[{ required: true }]">
          <a-input-password
            v-model:value="formState.password"
            placeholder="Please input password"
            :minlength="6"
            :maxlength="18"
            size="large"
            autoComplete="off"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            class="mt-4"
            block
            html-type="submit"
            size="large"
            shape="round"
            :loading="loading"
            >Sign in</a-button
          >
        </a-form-item>
        <a-form-item>
          <div class="mx-auto my-0 text-gray-500">
            Don't have account?
            <span @click="goRegister" class="font-semibold text-[#4945ff]">Sign up</span>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
