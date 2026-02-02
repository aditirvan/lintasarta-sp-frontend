import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { IMAGES } from "../namespace";
import { ref, Ref } from "@vue/composition-api";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { instance, storage } from "./interface";
import { filter } from "vue/types/umd";
import libProject from "@/lib/project";

export const useCreateSnapshot = () => {
  const snapshotName: any = ref("");
  const selectedBillingType: any = ref("");
  const snapshotFrom: any = ref(null);

  const snapshotStorageName: any = ref("");
  const snapshotStorageFrom: any = ref(null);

  const {
    deleteSnapshot,
    takeInstanceSnapshot,
    takeStorageSnapshot,
    fetchInstanceSnapshots,
    fetchInstanceSnapshotsByInstanceID,
    fetchStorageSnapshots,
    fetchStorageSnapshotsByStorageID,
    restoreSnapshot,
  } = useNamespacedActions(IMAGES, [
    "deleteSnapshot",
    "takeStorageSnapshot",
    "takeInstanceSnapshot",
    "fetchInstanceSnapshots",
    "fetchInstanceSnapshotsByInstanceID",
    "fetchStorageSnapshots",
    "fetchStorageSnapshotsByStorageID",
    "restoreSnapshot",
  ]);

  const { isLoading, instanceSnapshots, storageSnapshots } = useNamespacedState(
    IMAGES,
    ["isLoading", "instanceSnapshots", "storageSnapshots"]
  );

  const CreateSnapshot = async (
    filterByInstance = false,
    trialVoucherID = null,
    serviceId = "",
  ) => {
    const currProj = await libProject.getActiveProject();
    const activeProjectID = await libProject.getActiveProjectID();
    const data: any = {
      project_id: activeProjectID,
      name: snapshotName.value,
      instance_id: snapshotFrom.value?.id,
      billing_type: selectedBillingType.value,
      filterByInstance,
      voucher_id: trialVoucherID,
      snapshot_service_id: serviceId,
    };
    const response = await takeInstanceSnapshot(data);
    return response;
  };

  const CreateStorageSnapshot = async (trialVoucherID = null) => {
    const activeProjectID = await libProject.getActiveProjectID();
    const data: any = {
      project_id: activeProjectID,
      name: snapshotStorageName.value,
      storage_id: snapshotStorageFrom.value?.id,
      voucher_id: trialVoucherID,
    };
    const response = await takeStorageSnapshot(data);
    return response;
  };
  return {
    CreateSnapshot,
    CreateStorageSnapshot,
    isLoading,
    deleteSnapshot,
    instanceSnapshots,
    storageSnapshots,
    takeInstanceSnapshot,
    fetchInstanceSnapshots,
    fetchStorageSnapshots,
    snapshotName,
    snapshotFrom,
    snapshotStorageName,
    snapshotStorageFrom,
    fetchStorageSnapshotsByStorageID,
    fetchInstanceSnapshotsByInstanceID,
    restoreSnapshot,
    takeStorageSnapshot,
    selectedBillingType,
  };
};
