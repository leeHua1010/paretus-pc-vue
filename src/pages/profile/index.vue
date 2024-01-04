<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "~/store/app";
import { stringify } from "~/utils/utils";
import { usePaginate } from "~/hooks";
import articleApi from "~/api/article";
import mediaApi from "~/api/media";
import { formatTime } from "~/utils/time";
import { useRouter } from "vue-router";
import { useElementHover } from "@vueuse/core";
import storage from "~/utils/storage";
import userApi from "~/api/user";

const articles = ref([]);
const pagination = ref(null);
const loading = ref(false);
const avatarRef = ref(null);

const appStore = useAppStore();
const { page, setPage, pageSize } = usePaginate(10);
const router = useRouter();
const isAvararHover = useElementHover(avatarRef);

onMounted(() => {
  getArticles();
});

const getArticles = async () => {
  loading.value = true;
  const query = stringify({
    populate: ["user"],
    pagination: { page: page.value, pageSize: pageSize.value },
    sort: ["updatedAt:desc"],
    filters: { user: { username: { $eq: appStore.userInfo?.username } } },
  });
  const { data: res } = await articleApi.list(query);
  articles.value = res.data;
  pagination.value = res.meta.pagination;
  loading.value = false;
};

const checkDetail = async (item) => {
  const data = { ...item, views: item.views + 1 };
  await articleApi.update(item.id, data);
  router.push({ path: "/article/detail", query: { id: item.id } });
};

const onPageChange = (page) => {
  setPage(page);
  getArticles();
};

const onBeforeUpload = async (file) => {
  const { data } = await mediaApi.upload({ files: file });
  const query = stringify({ populate: ["avatar"] });
  await userApi.update(appStore.userInfo.id, query, { ...appStore.userInfo, avatar: data[0].id });
  const { data: userInfo } = await userApi.me(query);
  storage.setUserInfo(userInfo);
  appStore.setUserInfo(userInfo);
  return false;
};
</script>

<template>
  <div class="rounded-md flex bg-gray-200 h-48 mb-3 px-6 items-center">
    <div ref="avatarRef" class="relative">
      <a-upload :beforeUpload="onBeforeUpload" :fileList="[]" action="">
        <img
          v-if="appStore.userInfo?.avatar?.url"
          class="rounded-xl h-22 w-22"
          :src="appStore.avatarUrl"
          alt="avatar"
        />
        <div v-else class="rounded-xl bg-[#6a69ff] h-22 text-white text-5xl w-22 fcc">
          {{ appStore.userInfo?.username?.charAt(0).toUpperCase() }}
        </div>
        <div
          v-if="isAvararHover"
          class="rounded-xl flex-col bg-[#191b1f] bg-opacity-40 h-22 text-white top-0 left-0 w-22 absolute fcc"
        >
          <i class="text-2xl i-tabler-camera"></i>
          <div>修改头像</div>
        </div>
      </a-upload>
    </div>
    <div class="pl-4">
      <div class="font-bold pt-1 text-3xl">{{ appStore.userInfo?.username }}</div>
      <div class="mt-1 text-sm text-gray-600">{{ appStore.userInfo?.motto || "暂无个性签名" }}</div>
    </div>
  </div>
  <div class="bg-white rounded-md mb-8 px-4">
    <a-tabs>
      <a-tab-pane tab="Article">
        <div v-if="articles.length">
          <div
            v-for="item in articles"
            :key="item.id"
            @click="checkDetail(item)"
            class="border-b border-b-solid rounded-md border-b-[#EFEFF5] py-3 last:!border-none"
          >
            <div class="cursor-pointer font-bold">{{ item.title }}</div>
            <div class="text-sm pt-1 text-[#8590a6]">{{ formatTime(item.createdAt) }}</div>
          </div>
          <div class="flex py-4 justify-center" v-if="pagination?.pageCount !== 1">
            <a-pagination
              :current="page"
              :total="pagination?.total"
              @change="onPageChange"
              simple
            />
          </div>
        </div>
        <div v-else class="pb-8">暂无数据...</div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
