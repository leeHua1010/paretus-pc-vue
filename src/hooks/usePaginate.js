import { ref } from "vue";

export function usePaginate(defaultPageSize = 25) {
  const keyword = ref("");
  const page = ref(1);
  const pageSize = ref(defaultPageSize);
  const loadAll = ref(false);

  function setPage(value) {
    page.value = value;
  }

  function setPageSize(value) {
    pageSize.value = value;
  }

  function setKeyWord(value) {
    keyword.value = value;
  }

  function setLoadAll(value) {
    loadAll.value = value;
  }

  return {
    keyword,
    setKeyWord,
    page,
    setPage,
    pageSize,
    setPageSize,
    loadAll,
    setLoadAll,
  };
}
