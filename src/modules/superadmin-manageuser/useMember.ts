import { reactive, ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import { SUPERADMINMANAGEUSER } from "./namespace";
export const useMember = () => {
  const memberselected: any = ref("");
  const membersselected: any = ref([]);
  const {
    fetchmembers,
    fetchmember,
    addmember,
    rejectnpwpktp,
    verifynpwpktp,
    deletemember,
    resendemail,
  } = useNamespacedActions(SUPERADMINMANAGEUSER, [
    "addmember",
    "fetchmembers",
    "fetchmember",
    "rejectnpwpktp",
    "verifynpwpktp",
    "deletemember",
    "resendemail",
  ]);

  const {
    member,
    members,
    pagination,
  } = useNamespacedState(SUPERADMINMANAGEUSER, [
    "member",
    "members",
    "pagination",
  ]);
  const {
    showErrorToast,
    showSuccessToast,
  } = useNamespacedActions("HOMEPAGE", [
    "showErrorToast",
    "showSuccessToast",
  ]);
  const options = ref({
    search: "",
    page: 1,
    organization_id: "",
    role_id: "",
  });
  const search = ref("");
  let timeouts: number = setTimeout(() => {}, 500);
  const filterorganization = ref();

  watch(filterorganization, (val) => {
    options.value.organization_id = val;
    options.value.page = 1;
  });
  const filterrole = ref();
  watch(filterrole, (val) => {
    options.value.role_id = val;
    options.value.page = 1;
  });
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
      fetchmembers(val);
    },
    { deep: true }
  );

  const {
    setopendialogcommonsuccess,
    setmessagecommonsuccess,
  } = useNamespacedMutations("DASHBOARD", [
    "setopendialogcommonsuccess",
    "setmessagecommonsuccess",
  ]);

  const rejectnpwpmemberselected = async (reason: String) => {
    rejectnpwpktp({ ...memberselected.value, reason }).then(() => {
      fetchmembers(options.value);
      setopendialogcommonsuccess(true);
    });
  };

  const verifynpwpmemberselected = async () => {
    verifynpwpktp(memberselected.value).then(() => {
      fetchmembers(options.value);
      setopendialogcommonsuccess(true);
    });
  };

  const deletememberselected = async () => {
    deletemember(memberselected.value).then(() => {
      fetchmembers(options.value);
      // setopendialogcommonsuccess(true);
      showSuccessToast('User has been successfully deleted');
    }).catch((e)=> {
      if (e.response.status >= 500) {
        showErrorToast("Internal Server Error");
      } else if (e.response.status >= 400) {
        showErrorToast(e.response.data.data);
      }
    });
  };

  const resendinvitememberselected = async () => {
    resendemail(memberselected.value).then(() => {
      fetchmembers(options.value);
      // setmessagecommonsuccess('Email has been send, Please wait if mail has not appeared');
      // setopendialogcommonsuccess(true)
    });
  };

  const searchorganization = ref("");
  const { fetchorganizations } = useNamespacedActions(SUPERADMINMANAGEORG, [
    "fetchorganizations",
  ]);
  watch(searchorganization, (val) => {
    fetchorganizations({ search: val });
  });
  const refreshmembers = () => {
    fetchmembers(options.value);
  };

  const getmemberbyid = (id: String) => {
    fetchmember(id);
  };

  return {
    member,
    members,
    pagination,
    options,
    search,
    fetchmembers,
    fetchmember,
    getmemberbyid,
    addmember,
    membername: ref(""),
    emailmember: ref(""),
    memberselected,
    membersselected,
    resendinvitememberselected,
    verifynpwpmemberselected,
    rejectnpwpmemberselected,
    deletememberselected,
    filterorganization,
    filterrole,
    searchorganization,
    refreshmembers,
    fetchorganizations,
  };
};
