<script setup>
import articleApi from "~/api/article";
import { ref } from "vue";
import { formatRelativeTime } from "~/utils/time";
import { usePaginate } from "~/hooks";
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted } from "vue";
import { stringify } from "~/utils/utils";
import { useRouter } from "vue-router";
import { useScroll } from "@vueuse/core";

const scrollEl = ref(null);
const list = ref([]);
const pagination = ref(null);
const loading = ref(false);
const hotArticles = ref([]);

const { page, setPage, pageSize } = usePaginate();
const router = useRouter();
useInfiniteScroll(
  scrollEl,
  () => {
    if (pagination.value && page.value > pagination.value.pageCount) return;
    getList();
  },
  { distance: 100 }
);
const { y } = useScroll(scrollEl);

onMounted(() => {
  scrollEl.value = document.querySelector("#layout");
  getHotArticles();
});

async function getList() {
  loading.value = true;
  const query = stringify({
    populate: ["user"],
    pagination: { page: page.value, pageSize: pageSize.value },
    sort: ["createdAt:desc"],
  });
  const { data: res } = await articleApi.list(query);
  list.value = [...list.value, ...res.data];
  pagination.value = res.meta.pagination;
  setPage((page.value += 1));
  loading.value = false;
}

const getHotArticles = async () => {
  const query = stringify({
    pagination: { page: 1, pageSize: 10 },
    sort: ["views:desc"],
  });
  const { data: res } = await articleApi.list(query);
  hotArticles.value = res.data;
};

const checkDetail = (id) => {
  router.push({ path: "/article/detail", query: { id } });
};

const onBackTop = () => {
  scrollEl.value.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <div class="flex overflow-y-scroll">
    <div v-if="list.length" class="flex-1">
      <div
        v-for="item in list"
        :key="item.id"
        @click="checkDetail(item.id)"
        class="bg-white py-2 px-4 rounded-md mb-3 cursor-pointer hover:bg-light-200"
      >
        <div class="flex items-center text-[#8a919f] text-sm">
          <div>{{ item?.user?.username }}</div>
          <a-divider type="vertical"></a-divider>
          <div>{{ formatRelativeTime(item.createdAt) }}</div>
        </div>
        <div class="font-600 py-3">{{ item.title }}</div>
        <div class="text-[#6B6B6B] text-13px">{{ item.content.substring(0, 36) }}</div>
        <div class="flex items-center justify-between text-[#6B6B6B] mt-2">
          <div class="flex items-center text-[#8a919f]">
            <div class="flex items-center mr-5 text-sm">
              <i class="i-tabler-eye text-base"></i>
              <div class="pl-1">{{ item.views }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="loading" class="animate-bounce text-xl">loading...</div>
    </div>
    <template v-else>
      <div>Empty.</div>
    </template>

    <div className="ml-6">
      <div className="bg-white rounded-md p-4 w-64">
        <div className="font-bold pb-3 border border-b-solid border-b-[#e4e6eb]">热榜 🔥</div>
        <div
          v-for="item in hotArticles"
          :key="item.id"
          @click="checkDetail(item.id)"
          class="pt-4 text-sm cursor-pointer truncate hover:opacity-70"
        >
          {{ item.title }}
        </div>
      </div>
    </div>

    <div
      v-show="y > 1688"
      @click="onBackTop"
      class="absolute right-10 bottom-12 bg-white w-10 h-10 rounded-1/2 flex items-center justify-center shadow cursor-pointer"
    >
      <i class="i-tabler-arrow-bar-to-up text-xl" />
    </div>
  </div>
</template>
