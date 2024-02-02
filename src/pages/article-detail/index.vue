<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import articleApi from "~/api/article";
import { stringify } from "~/utils/utils";
import { formatTime } from "~/utils/time";
import { Viewer, plugins } from "~/plugins/mdEditor";
import { useTitle } from "@vueuse/core";
import { useRouter } from "vue-router";

const MEDIA_API = import.meta.env.VITE_MEDIA_API;

const articleDetail = ref(null);

const route = useRoute();
const title = useTitle();
const router = useRouter();

onMounted(async () => {
  await getDetail();

  title.value = `Paretus | ${articleDetail.value?.title}`;
});

async function getDetail() {
  const query = stringify({ populate: { user: { populate: ["avatar"] } } });
  const { data: res } = await articleApi.read(route.query.id, query);
  articleDetail.value = res.data;
}

const checkProfile = () => {
  router.push({ path: "/profile/info", query: { id: articleDetail.value.user.id } });
};
</script>

<template>
  <div>
    <div class="bg-white rounded-md text-base mb-8 p-4">
      <div class="font-bold text-xl">{{ articleDetail?.title }}</div>
      <div class="flex pt-4 pb-2 items-center">
        <img
          v-if="articleDetail?.user?.avatar?.url"
          class="cursor-pointer rounded-1/2 h-10 w-10"
          :src="MEDIA_API + articleDetail?.user?.avatar?.url"
          alt="avatar"
          @click="checkProfile"
        />
        <div
          v-else
          class="cursor-pointer bg-[#6a69ff] rounded-1/2 h-10 text-white text-xl w-10 fcc"
          @click="checkProfile"
        >
          {{ articleDetail?.user?.username?.charAt(0).toUpperCase() }}
        </div>
        <div class="text-sm pl-2">
          <div class="font-bold text-base">{{ articleDetail?.user?.username }}</div>
          <div class="pt-1 text-zinc-400">{{ formatTime(articleDetail?.createdAt) }}</div>
        </div>
      </div>

      <div class="my-4 markdown-body">
        <viewer :value="articleDetail?.content" :plugins="plugins"></viewer>
      </div>
    </div>
  </div>
</template>
