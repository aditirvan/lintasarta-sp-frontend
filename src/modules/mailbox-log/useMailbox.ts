import {
  computed,
  onMounted,
  reactive,
  ref,
  watch,
} from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import { SUPERADMINMANAGEMAILBOX } from "./namespace";
import moment from "moment/moment.js";

export const useMailbox = () => {
  // const memberselected: any = ref('')
  const listmailboxselected: any = ref([]);
  const {
    fetchlistmailbox,
    resendemail,
    fetchOrgMailbox,
  } = useNamespacedActions(SUPERADMINMANAGEMAILBOX, [
    "fetchlistmailbox",
    "resendemail",
    "fetchOrgMailbox",
  ]);

  const {
    listmailbox,
    pagination,
    listOrgMailbox,
  } = useNamespacedState(SUPERADMINMANAGEMAILBOX, [
    "listmailbox",
    "pagination",
    "listOrgMailbox",
  ]);
  const options = ref({
    search: "",
    page: 1,
    organization_id: "",
    status: "",
    startDt: "",
    endDt: "",
    sortBy: [],
    sortDesc: [],
  });
  const search = ref("");
  let timeouts: number = setTimeout(() => {}, 500);

  const filterorganization = ref();
  const filterstatus = ref();
  watch(filterorganization, (val) => {
    options.value.organization_id = val;
    options.value.page = 1;
  });

  watch(filterstatus, (val) => {
    options.value.status = val;
    options.value.page = 1;
  });

  // watch(search, val => {
  //     clearTimeout(timeouts)
  //     timeouts = setTimeout(() => {
  //         options.value.search = val
  //         options.value.page = 1
  //     }, 500)
  // })
  watch(
    options,
    (val) => {
      fetchlistmailbox(val);
    },
    { deep: true }
  );

  const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
    "setopendialogcommonsuccess",
  ]);

  const searchorganization = ref("");
  watch(searchorganization, (val) => {
    // listOrgMailbox.filter((v) => v == val);
  });

  const date = ref([]);
  const rangeText = computed(() => {
    if (date.value.length == 2) {
      if (date.value[0] > date.value[1]) {
        return `${moment(date.value[1], "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        )} - ${moment(date.value[0], "YYYY-MM-DD").format("DD/MM/YYYY")}`;
      } else {
        return `${moment(date.value[0], "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        )} - ${moment(date.value[1], "YYYY-MM-DD").format("DD/MM/YYYY")}`;
      }
    } else {
      return "";
    }
  });
  watch(date, (val) => {
    if (val == null) return;
    if (val.length == 0) {
      options.value.startDt = "";
      options.value.endDt = "";
    }
    if (val.length > 1) {
      var startDate;
      var endDate;
      if (val[0] > val[1]) {
        endDate = val[1];
        startDate = moment(val[0], "YYYY-MM-DD")
          .add(1, "d")
          .format("YYYY-MM-DD");
        options.value.startDt = endDate;
        options.value.endDt = startDate;
      } else {
        startDate = val[0];
        endDate = moment(val[1], "YYYY-MM-DD")
          .add(1, "d")
          .format("YYYY-MM-DD");
        options.value.startDt = startDate;
        options.value.endDt = endDate;
      }
    }
  });
  const clearDate = () => {
    date.value = [];
  };

  onMounted(() => {
    fetchOrgMailbox();
  });

  const refreshlistmailbox = () => {
    fetchlistmailbox(options.value);
  };
  const opendialogresendemail = ref(false);

  const resendEmail = (params: any) => {
    console.log(params);
    const dataSingle = params.listmailboxselectedvalue;
    const dataMulti = params.listmailboxselected;
    resendemail({ id: dataSingle.id })
      .then(() => {
        setTimeout(() => {
          refreshlistmailbox();
        }, 1000);
        opendialogresendemail.value = false;
      })
      .catch((err: any) => {
        console.log(err);
        opendialogresendemail.value = false;
      });
  };
  return {
    date,
    rangeText,
    listmailbox,
    pagination,
    options,
    search,
    fetchlistmailbox,
    resendemail,
    listmailboxselected,
    searchorganization,
    filterorganization,
    filterstatus,
    refreshlistmailbox,
    fetchOrgMailbox,
    listOrgMailbox,
    clearDate,
    opendialogresendemail,
    resendEmail,
  };
};
