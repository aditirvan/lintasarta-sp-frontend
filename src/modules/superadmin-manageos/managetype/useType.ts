import { reactive, ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { SUPERADMINMANAGEOSTYPE } from "../namespace";
export const useType = () => {
  const typeselected: any = ref("");
  const typessselected: any = ref([]);
  const {
    fetchostype,
    addOstype,
    editOstype,
    deleteOstype,
  } = useNamespacedActions(SUPERADMINMANAGEOSTYPE, [
    "fetchostype",
    "addOstype",
    "editOstype",
    "deleteOstype",
  ]);

  const { ostype, paginationtype } = useNamespacedState(
    SUPERADMINMANAGEOSTYPE,
    ["ostype", "paginationtype"]
  );
  const { getostype } = useNamespacedGetters(SUPERADMINMANAGEOSTYPE, [
    "getostype",
  ]);

  const options = ref({ search: "", page: 1 });
  const search = ref("");
  let timeouts: number = setTimeout(() => {}, 500);

  watch(search, (val) => {
    clearTimeout(timeouts);
    timeouts = setTimeout(() => {
      options.value.search = val;
      options.value.page = 1;
    }, 500);
  });

  watch(
    options,
    (val) => {
      fetchostype(val);
    },
    { deep: true }
  );
  const {
    setopendialogcommonsuccess,
    setopendialogcommonwarning,
    setmessagecommonwarning,
  } = useNamespacedMutations("DASHBOARD", [
    "setopendialogcommonsuccess",
    "setopendialogcommonwarning",
    "setmessagecommonwarning",
  ]);

  const deletetypeselected = async () => {
    console.log(typeselected.value);
    console.log(typessselected.value);
    console.log(options.value);

    deleteOstype(typeselected.value)
      .then((e: any) => {
        fetchostype(options.value);
        setopendialogcommonsuccess(true);
      })
      .catch((e: any) => {
        const message = e.response.data.data;
        setopendialogcommonwarning(true);
        setmessagecommonwarning(message);
      });
  };

  const refreshType = () => {
    fetchostype(options.value);
  };
  return {
    ostype,
    paginationtype,
    options,
    search,
    fetchostype,
    addOstype,
    getostype,
    editOstype,
    typeselected,
    typessselected,
    deletetypeselected,
    refreshType,
  };
};
