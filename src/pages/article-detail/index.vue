<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import articleApi from "~/api/article";
import { stringify } from "~/utils/utils";
import { formatTime } from "~/utils/time";
import { Viewer, plugins } from "~/plugins/mdEditor";

const articleDetail = ref(null);

const route = useRoute();

onMounted(() => {
  getDetail();
});

async function getDetail() {
  const query = stringify({ populate: ["user"] });
  const { data: res } = await articleApi.detail(route.query.id, query);
  articleDetail.value = res.data;
}
</script>

<template>
  <div>
    <div class="bg-white p-4 rounded-md text-base mb-8">
      <div class="text-xl font-bold">{{ articleDetail?.title }}</div>
      <div class="flex items-center pt-4 pb-2">
        <div class="bg-[#6a69ff] rounded-1/2 w-10 h-10 fcc text-white text-xl">
          {{ articleDetail?.user?.username?.charAt(0).toUpperCase() }}
        </div>
        <div class="pl-2 text-sm">
          <div class="font-bold">{{ articleDetail?.user?.username }}</div>
          <div class="text-zinc-400 pt-1">{{ formatTime(articleDetail?.createdAt) }}</div>
        </div>
      </div>

      <div class="my-4 markdown-body">
        <viewer :value="articleDetail?.content" :plugins="plugins"></viewer>
      </div>
    </div>
  </div>
</template>
