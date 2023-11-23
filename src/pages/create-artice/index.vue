<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import articleApi from "~/api/article";
import { useAppStore } from "~/store/app";
import { Editor, plugins } from "~/plugins/mdEditor";
import { message } from "ant-design-vue";

const router = useRouter();
const appStore = useAppStore();
const [messageApi, contextHolder] = message.useMessage();

const key = "publish";
const formData = ref({ title: "", content: "", views: 0 });
const loading = ref(false);

const onFinish = async (values) => {
  if (!values.title) {
    return messageApi.open({ type: "warning", content: "Please input title." });
  }
  if (!formData.value.content) {
    return messageApi.open({ type: "warning", content: "Please input content." });
  }

  messageApi.open({ key, type: "loading", content: "Publish..." });
  await articleApi.create({
    data: { ...formData.value, user: { connect: [appStore.userInfo.id] } },
  });
  messageApi.open({ key, type: "success", content: "Published!", duration: 2 });

  setTimeout(() => {
    router.push({ path: "/" });
  }, 500);
};

const handleChange = (value) => {
  formData.value.content = value;
};
</script>

<template>
  <div class="box-border">
    <context-holder></context-holder>
    <div class="bg-white rounded-md mb-4 w-full p-5 <sm:p-0">
      <a-form :model="formData" layout="vertical" @finish="onFinish">
        <a-form-item label="Title" name="title">
          <a-input v-model:value="formData.title" placeholder="Enter the title" />
        </a-form-item>

        <editor :value="formData.content" :plugins="plugins" @change="handleChange" />

        <div class="flex justify-center mt-8">
          <a-form-item class="w-98 <sm:w-72">
            <a-button
              type="primary"
              block
              size="large"
              shape="round"
              html-type="submit"
              :loading="loading"
              >Publish</a-button
            >
          </a-form-item>
        </div>
      </a-form>
    </div>
  </div>
</template>
