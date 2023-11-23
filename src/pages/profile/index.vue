<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "~/store/app";
import { stringify } from "~/utils/utils";
import { usePaginate } from "~/hooks";
import articleApi from "~/api/article";
import { formatTime } from "~/utils/time";
import { useRouter } from "vue-router";

const articles = ref([]);
const pagination = ref(null);
const loading = ref(false);

const appStore = useAppStore();
const { page, setPage, pageSize } = usePaginate(10);
const router = useRouter();

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

const checkDetail = (id) => {
  router.push({ path: "/article/detail", query: { id } });
};

const onPageChange = (page) => {
  setPage(page);
  getArticles();
};
</script>

<template>
  <div class="">
    <div class="bg-[#d1d5db] h-48 rounded-md mb-3 flex px-6 items-center profile-gradient">
      <div class="w-22 h-22 rounded-xl bg-[#6a69ff] fcc text-white text-5xl mt-10">
        {{ appStore.userInfo?.username?.charAt(0).toUpperCase() }}
      </div>
      <div class="pl-4 mt-16">
        <div class="font-bold text-2xl pt-1">{{ appStore.userInfo?.username }}</div>
        <div class="text-gray-500 mt-1 text-xm">{{ appStore.userInfo?.motto || "" }}</div>
      </div>
    </div>
    <div class="bg-white px-4 mb-8 rounded-md">
      <a-tabs>
        <a-tab-pane tab="Article">
          <div v-if="articles.length">
            <div
              v-for="item in articles"
              :key="item.id"
              @click="checkDetail(item.id)"
              class="py-3 rounded-md border-b border-b-solid border-b-[#EFEFF5] last:!border-none"
            >
              <div class="font-bold">{{ item.title }}</div>
              <div class="text-[#8590a6] text-sm pt-1">{{ formatTime(item.createdAt) }}</div>
            </div>
            <div class="flex justify-center py-4" v-if="pagination?.pageCount !== 1">
              <a-pagination
                :current="page"
                :total="pagination?.total"
                @change="onPageChange"
                simple
              />
            </div>
          </div>
          <div v-else>暂无数据...</div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style scoped>
.profile-gradient {
  background: linear-gradient(to bottom, #a1a1aa 50%, white 50%);
}
</style>
