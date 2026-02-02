import { ref, SetupContext, watch, onMounted } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { ALERTING } from "./namespace";

export const useAlert = (props: any, context: SetupContext) => {
  const alertRecipients = ref([]);
  const alertingedit: any = ref([]);
  const recipients = ref([]);

  const { activeInstances } = useNamespacedState("INSTANCE", ["activeInstances"])
  const { fetchActiveInstances } = useNamespacedActions("INSTANCE", ["fetchActiveInstances"]);

  const SetRecipient = (payload: any) => {
    recipients.value = payload;
  };
  const setalertingedit = (payload: any) => {
    alertingedit.value = payload;
    SetRecipient(payload.recipientalert);
  };

  const {
    fetchmembers,
    fetchMembersBySuperAdmin,
  } = useNamespacedActions("MEMBER", [
    "fetchmembers",
    "fetchMembersBySuperAdmin",
  ]);

  const { members } = useNamespacedState("MEMBER", ["members"]);

  const {
    alert,
    alerts,
    isLoading,
    pagination,
  } = useNamespacedState("ALERTING", [
    "alert",
    "alerts",
    "isLoading",
    "pagination",
  ]);

  const {
    fetchAlerts,
    fetchAlertByID,
    createAlert,
    updateAlert,
    deleteAlert,
  } = useNamespacedActions("ALERTING", [
    "fetchAlerts",
    "fetchAlertByID",
    "createAlert",
    "updateAlert",
    "deleteAlert",
  ]);

  const currentOrg: any = localStorage.getItem("currentOrg");
  const organization_id = JSON.parse(currentOrg).id;

  const role: any = localStorage.getItem("role");
  const project_id: any = localStorage.getItem("projectid");

  onMounted(() => {
    fetchActiveInstances();
    if (role === "Superadmin")
      fetchMembersBySuperAdmin({
        page: 1,
        itemsPerPage: -1,
        search: "",
        organization_id,
        verified:true,
        project_id
      });
    else fetchmembers({ page: 1, itemsPerPage: -1, search: "", verified:true, project_id });
  });

  return {
    // state
    alerts,
    alert,
    isLoading,
    members,
    activeInstances,

    // actions
    fetchAlerts,
    fetchAlertByID,
    createAlert,
    updateAlert,
    deleteAlert,
    fetchmembers,
    fetchMembersBySuperAdmin,

    alertRecipients,
    alertingedit,
    recipients,
    SetRecipient,
    pagination,
    setalertingedit,
  };
};
