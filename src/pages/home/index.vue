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
import { onActivated } from "vue";

defineOptions({ name: "Home" });

const scrollEl = ref(null);
const list = ref([]);
const pagination = ref(null);
const loading = ref(false);
const hotArticles = ref([]);
const scrollTop = ref(0);

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

onActivated(() => {
  scrollEl.value.scrollTo({ top: scrollTop.value });
});

async function getList() {
  loading.value = true;
  const query = stringify({
    populate: ["user", "avatar"],
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

const checkDetail = async (item) => {
  scrollTop.value = y.value;
  const data = { ...item, views: item.views + 1 };
  await articleApi.update(item.id, data);
  router.push({ path: "/article/detail", query: { id: item.id } });
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
        @click="checkDetail(item)"
        class="bg-white rounded-md cursor-pointer mb-3 py-2 px-4 hover:bg-light-200"
      >
        <div class="flex text-sm text-[#8a919f] items-center">
          <div>{{ item?.user?.username }}</div>
          <a-divider type="vertical"></a-divider>
          <div>{{ formatRelativeTime(item.createdAt) }}</div>
        </div>
        <div class="font-600 py-3">{{ item.title }}</div>
        <div class="text-[#6B6B6B] text-13px">{{ item.content.substring(0, 36) }}</div>
        <div class="flex mt-2 text-[#6B6B6B] items-center justify-between">
          <div class="flex text-[#8a919f] items-center">
            <div class="flex mr-5 text-sm items-center">
              <i class="text-base i-tabler-eye"></i>
              <div class="pl-1">{{ item.views }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="loading" class="text-xl animate-bounce">loading...</div>
    </div>
    <template v-else>
      <div>Empty.</div>
    </template>

    <div className="ml-6">
      <div className="bg-white rounded-md p-4 w-64">
        <div className="border border-b-solid font-bold border-b-[#e4e6eb] pb-3">热榜 🔥</div>
        <div
          v-for="item in hotArticles"
          :key="item.id"
          @click="checkDetail(item)"
          class="cursor-pointer text-sm pt-4 truncate hover:opacity-70"
        >
          {{ item.title }}
        </div>
      </div>
    </div>

    <div
      v-show="y > 1688"
      @click="onBackTop"
      class="bg-white cursor-pointer flex rounded-1/2 h-10 shadow right-10 bottom-12 w-10 absolute items-center justify-center"
    >
      <i class="text-xl i-tabler-arrow-bar-to-up" />
    </div>
  </div>
</template>
