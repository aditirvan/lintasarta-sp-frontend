import { Snapshot } from "./composableapi/interface";
import { ActionContext, Store, Module } from "vuex";
import { isLimitError, createLimitErrorMsg } from "@/lib/validator";
import { DocumentReference } from "@firebase/firestore-types";
import libProject from "@/lib/project";

export interface state {
  instanceSnapshots: Array<any>;
  storageSnapshots: Array<any>;
  instancebackupenabled: Array<any>;
  snapshots: Array<any>;
  customImages: Array<any>;
  isLoading: Boolean;
  backupIsLoading: Boolean;
  backups: Array<any>;
}

import axios from "@/lib/axios";
import { async } from "rxjs";

const store: Module<state, any> = {
  namespaced: true,
  state: {
    instancebackupenabled: [],
    instanceSnapshots: [],
    storageSnapshots: [],
    snapshots: [],
    customImages: [],
    isLoading: false,
    backups: [],
    backupIsLoading: false,
  },
  getters: {
    getCustomImages: (state) => state.customImages,
  },
  mutations: {
    setInstanceSnapshots: (state: state, payload) => {
      state.instanceSnapshots = payload;
    },
    setStorageSnapshots: (state: state, payload) => {
      state.storageSnapshots = payload;
    },
    setsnapshots: (state: state, payload) => {
      state.snapshots = payload;
    },
    setCustomImages: (state: state, data) => {
      state.customImages = data;
    },
    setIsLoading: (state: state, data) => {
      state.isLoading = data;
    },
    setBackupIsLoading: (state: state, data) => {
      state.backupIsLoading = data;
    },
    setBackups: (state, payload) => (state.backups = payload),
  },
  actions: {
    updatesnapshot: async <state, R>(
      context: ActionContext<state, R>,
      payload: { snapshot: any; data: any }
    ) => {
      return payload.snapshot.ref.update(payload.data).then(() => {
        context.dispatch("refresh", payload.snapshot.type);
      });
    },
    deletesnapshot: async <state, R>(
      context: ActionContext<state, R>,
      payload: any
    ) => {
      return payload.ref.delete().then(() => {
        context.dispatch("refresh", payload.type);
      });
    },
    refresh<state, R>(
      context: ActionContext<state, R>,
      payload: "instance" | "storage"
    ) {
      if (payload == "instance") {
        return context.dispatch("fetchInstanceSnapshots");
      } else if (payload == "storage") {
        return context.dispatch("fetchStorageSnapshots");
      }
    },
    fetchInstanceSnapshots: async ({ commit, dispatch }) => {
      const { id } = await libProject.getActiveProject();
      const response = await axios.instance.get(
        `/service/project/${id}/image/vm-snapshot`
      );
      const data: any = response.data.data.map((x: any) => {
        if (x.is_snapshot || x.is_backup)
          return {
            id: x.id,
            name: x.name,
            size: x.size,
            is_snapshot: x.is_snapshot,
            is_backup: x.is_backup,
            is_upload_success: x.is_upload_success,
            is_upload_failed: x.is_upload_failed,
            instance: x.instance,
            region: {
              region: x.region ? x.region : "TKP",
            },
            createddate: x.created_at,
          };
      });
      commit("setInstanceSnapshots", data);
    },
    fetchInstanceSnapshotsByInstanceID: async (
      { commit, dispatch },
      payload
    ) => {
      const { instance_id } = payload;
      const response = await axios.instance.get(
        `/service/instance/${instance_id}/snapshot`
      );
      const data: any = response.data.data.map((x: any) => {
        if (x.is_snapshot)
          return {
            id: x.id,
            name: x.name,
            size: x.size,
            is_upload_success: x.is_upload_success,
            is_upload_failed: x.is_upload_failed,
            instance: x.instance,
            region: {
              region: x.region ? x.region : "TKP",
            },
            createddate: x.created_at,
          };
      });
      commit("setInstanceSnapshots", data);
    },
    fetchStorageSnapshots: async ({ commit, dispatch }) => {
      const project_id = await libProject.getActiveProjectID();
      const response = await axios.instance.get(
        `/service/project/${project_id}/image/storage-snapshot`
      );
      const data: any = response.data.data.map((x: any) => {
        return {
          id: x.id,
          name: x.name,
          size: x.size,
          storage: x.storage,
          is_upload_success: x.is_upload_success,
          is_upload_failed: x.is_upload_failed,
          region: {
            regionid: x.region ? x.region : "TKP",
          },
          createddate: x.created_at,
        };
      });
      commit("setStorageSnapshots", data);
    },
    fetchStorageSnapshotsByStorageID: async ({ commit, dispatch }, payload) => {
      const { storage_id } = payload;
      const response = await axios.instance.get(
        `/service/storage/${storage_id}/snapshot`
      );
      const data: any = response.data.data.map((x: any) => {
        return {
          id: x.id,
          name: x.name,
          size: x.size,
          storage: x.storage,
          is_upload_success: x.is_upload_success,
          is_upload_failed: x.is_upload_failed,
          region: {
            regionid: x.region ? x.region : "TKP",
          },
          createddate: x.created_at,
        };
      });
      commit("setStorageSnapshots", data);
    },
    fetchBackups: async ({ commit, dispatch }) => {
      const activeProjectID = await libProject.getActiveProjectID();
      commit("setBackupIsLoading", true);
      const response = await axios.instance.get(
        `/user/project-backup/${activeProjectID}`
      );
      commit("setBackups", response.data.data);
      commit("setBackupIsLoading", false);
    },
    enableBackup: async ({ commit, dispatch }, payload) => {
      try {
        commit("setBackupIsLoading", true);
        const response = await axios.instance.post(
          `/user/backup-scheduler`,
          payload
        );
        dispatch(
          "HOMEPAGE/showSuccessToast",
          `Instance backup scheduler has been succesfully enabled`,
          { root: true }
        );
        dispatch("fetchBackups");
        commit("setBackupIsLoading", false);
        return response;
      } catch (e) {
        const errorMessage = e.response.data.data;
        commit("setBackupIsLoading", false);
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        return e.response;
      }
    },
    disableBackup: async ({ commit, dispatch }, id) => {
      try {
        commit("setBackupIsLoading", true);
        const response = await axios.instance.delete(
          `/user/backup-scheduler/${id}`
        );
        dispatch(
          "HOMEPAGE/showSuccessToast",
          `Instance backup scheduler has been succesfully deleted`,
          { root: true }
        );
        dispatch("fetchBackups");
        commit("setBackupIsLoading", false);
        return response;
      } catch (e) {
        let errorMessage =
          "A problem encountered while deleting backup scheduler";
        commit("setBackupIsLoading", false);
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        return e.response;
      }
    },
    fetchCustomImages: async ({ commit, rootState }) => {
      // TODO: Ferry - Fase 1
      const currentProj = rootState.SUPERADMIN.currentProj;
      let params = {};
      commit("setIsLoading", true);
      commit("setCustomImages", []);

      if (currentProj) {
        params = {
          pro_id: currentProj.id,
        };
      }

      const endpoint = `/service/project/${currentProj.id}/image/vm-snapshot-list`;

      let response = await axios.instance.get(endpoint);
      // let response = await axios.instance.get("/user/images", { params });
      commit("setCustomImages", response.data.data);
      commit("setIsLoading", false);
    },

    fetchCustomImage: async ({ commit, rootState }) => {
      // TODO: Ferry - Fase 1
      const currentProj = rootState.SUPERADMIN.currentProj;
      let params = {};
      commit("setIsLoading", true);
      commit("setCustomImages", []);

      if (currentProj) {
        params = {
          pro_id: currentProj.id,
        };
      }

      const endpoint = `/service/project/${currentProj.id}/image/vm-snapshot-list`;

      // let response = await axios.instance.get(endpoint);
      let response = await axios.instance.get("/user/images", { params });
      commit("setCustomImages", response.data.data);
      commit("setIsLoading", false);
    },

    ImagesfetchCustom: async ({ commit, rootState }) => {
      // TODO: Ferry - Fase 1
      const currentProj = localStorage.getItem("projectid");
      let params = {};

      if (currentProj) {
        params = {
          pro_id: currentProj,
        };
      }

      // const endpoint = `/service/project/${currentProj.id}/image/vm-snapshot-list`

      let data = await axios.instance.get("/user/images", { params });
      commit("setCustomImages", data.data.data);
    },

    importImageViaURL: async ({ commit, dispatch }, payload: any) => {
      try {
        commit("setIsLoading", true);
        const activeProjectID = await libProject.getActiveProjectID();
        const role = localStorage.getItem("role");

        let url = "/user/images";
        if (role === "Superadmin") url = "/superadmin/images";

        const response = await axios.instance.post(url, {
          project_id: activeProjectID,
          // region: "TKP",
          is_custom: 1,
          ...payload,
        });
        if (response.status == 200) {
          dispatch(
            "HOMEPAGE/showProcessToastWS",
            "Importing Custom Image via URL",
            { root: true }
          );
          dispatch("fetchCustomImages");
          commit("setIsLoading", false);
          return response;
        }
      } catch (e) {
        const errorMessage = e.response.data.data;
        if (
          errorMessage &&
          errorMessage.includes("this image name has already exist")
        )
          dispatch("HOMEPAGE/showErrorToast", "Image name already exists.", {
            root: true,
          });
        else
          dispatch("HOMEPAGE/showErrorToast", "Failed to import Custom Image", {
            root: true,
          });
        commit("setIsLoading", false);
      }
    },
    deleteCustomImage: async ({ commit, dispatch }, payload) => {
      try {
        const { id, name } = payload;
        commit("setIsLoading", true);
        const response = await axios.instance.delete(`/user/images/${id}`);
        if (response.status == 200) {
          dispatch("fetchCustomImages");
          dispatch(
            "HOMEPAGE/showSuccessToast",
            `${name} has been successfully deleted`,
            { root: true }
          );
          commit("setIsLoading", false);
          return response;
        } else {
          dispatch("HOMEPAGE/showErrorToast", `Failed to delete ${name}`, {
            root: true,
          });
          commit("setIsLoading", false);
        }
      } catch (e) {
        const { name } = payload;
        dispatch("HOMEPAGE/showErrorToast", `Failed to delete ${name}`, {
          root: true,
        });
      }
    },
    checkValidationSnapshot: async ({ commit, dispatch }, payload) => {
      commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .post("/user/snapshot/confirmation ", payload)
          .then((res: any) => {
            resolve(res.data);
            commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
            commit("setIsLoading", false);
          });
      });
    },
    checkValidationBackup: async ({ commit, dispatch }, payload) => {
      commit("setIsLoading", true);
      return new Promise<void>((resolve, reject) => {
        axios.instance
          .post("/user/backup-scheduler/confirmation ", payload)
          .then((res: any) => {
            resolve(res.data);
            commit("setIsLoading", false);
          })
          .catch((err) => {
            reject(err);
            commit("setIsLoading", false);
          });
      });
    },
    takeInstanceSnapshot: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const { filterByInstance, instance_id } = payload;
        const response = await axios.instance.post(
          `/user/snapshot-vm`,
          payload
        );

        if (response.status === 200) {
          dispatch("HOMEPAGE/showProcessToastWS", `Taking instance snapshot`, {
            root: true,
          });
          if (filterByInstance)
            dispatch("fetchInstanceSnapshotsByInstanceID", { instance_id });
          else dispatch("fetchInstanceSnapshots");
          commit("setIsLoading", false);
          return response;
        }
        commit("setIsLoading", false);
      } catch (e) {
        let errorMessage =
          "A problem encountered while taking instance snapshot";
        const error = e.response.data.data;
        if (error.includes("total snapshot size voucher has reached limit"))
          errorMessage =
            "Snapshot size has reached the limit!";
        else if (error.includes("Postpaid"))
          errorMessage = error;
        else if (error.includes("this image name has already exist"))
          errorMessage = "Snapshot name already exists!";
        else if (error.includes("Snapshot has exceeded the limit"))
          errorMessage =
            "Snapshots has exceeded the limit. Please contact the administrator.";
        else if (error.includes("Snapshot sizes has exceeded the limit"))
          errorMessage =
            "Snapshots sizes has exceeded the limit. Please contact the administrator.";
        else if (error.includes('voucher has already expired')) errorMessage = "This voucher is expired."
        else if (
            error.includes('trial voucher can only assign to trial instance') ||
            error.includes('trial instance can only assign to trial voucher') ||
            error.includes('trial voucher can only assign to trial storage/images')
        ) errorMessage = 'Cannot attach basic resource to trial resource!'
        else if (error.includes("total snapshot voucher has reached limit"))
          errorMessage =
              "Snapshot quota has reached the limit!";
        else if (error.includes("name cannot contain special character"))
          errorMessage =
              "Name cannot contain special character!";
        else if (isLimitError(error))
            errorMessage = createLimitErrorMsg(error.toString().
            replaceAll("Storage Quota", "Snapshot Quota").
            replaceAll("Storage Size Quota", "Snapshot Size Quota").
            replaceAll("Storage Snapshot Quota", "Snapshot Quota"))
            ;
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        commit("setIsLoading", false);
      }
    },
    takeStorageSnapshot: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const response = await axios.instance.post(
          `/user/snapshot-storage`,
          payload
        );
        if (response.status === 200) {
          dispatch("HOMEPAGE/showProcessToastWS", `Taking storage snapshot`, {
            root: true,
          });
          dispatch("fetchStorageSnapshots");
          commit("setIsLoading", false);
          return response;
        }
        commit("setIsLoading", false);
      } catch (e) {
        const err = e.response.data.data;
        let errorMessage =
          "A problem encountered while trying to take storage snapshot";
        if (err.includes("Postpaid")) errorMessage = err;
        if (err.includes("this image name has already exist"))
          errorMessage = "Name already exists";
        if (err.includes("total snapshot voucher has reached limit"))
          errorMessage =
            "Snapshot quota has reached the limit!";
        if (err.includes("total snapshot size voucher has reached limit"))
          errorMessage =
            "Snapshot size has reached the limit!";
        if (err.includes("Snapshot has exceeded the limit"))
          errorMessage =
            "Snapshots has exceeded the limit. Please contact administrator.";
        if (err.includes("Snapshot sizes has exceeded the limit"))
          errorMessage =
            "Snapshots sizes has exceeded the limit. Please contact administrator.";
        else if (err.includes('voucher has already expired')) errorMessage = "This voucher is expired."
        else if (err.includes('trial voucher can only assign to trial storage/images')) errorMessage = 'Cannot attach basic resource to trial resource!'
        else if (err.includes("name cannot contain special character"))
          errorMessage =
              "Name cannot contain special character!";
        else if (isLimitError(err))
            errorMessage = createLimitErrorMsg(err);
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
        return e.response;
      }
    },
    deleteSnapshot: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const { id, filterByInstanceID } = payload;
        const response = await axios.instance.delete(`/user/images/${id}`);
        if (response.status === 200) {
          // dispatch(
          //   "HOMEPAGE/showSuccessToast",
          //   `Snapshot has been successfully deleted.`,
          //   { root: true }
          // );
          dispatch("HOMEPAGE/showProcessToastWS", "Deleting snapshot", {
            root: true,
          });

          if (filterByInstanceID)
            dispatch("fetchInstanceSnapshotsByInstanceID", {
              instance_id: payload.instance.id,
            });
          else dispatch("fetchInstanceSnapshots");

          // dispatch("fetchStorageSnapshots");
          // commit("setIsLoading", false);
          return response;
        }
        commit("setIsLoading", false);
      } catch (e) {
        commit("setIsLoading", false);
        dispatch("HOMEPAGE/showErrorToast", `Failed to delete snapshot`, {
          root: true,
        });
      }
    },
    restoreSnapshot: async ({ commit, dispatch }, payload) => {
      try {
        commit("setIsLoading", true);
        const response = await axios.instance.post(
          "/user/snapshot-restore",
          payload
        );
        dispatch("HOMEPAGE/showProcessToastWS", "Restoring snapshot", {
          root: true,
        });
        commit("setIsLoading", false);
        return response;
      } catch (e) {
        commit("setIsLoading", false);

        let errorMessage = e.response.data.data;

        if (errorMessage.includes("vCPU has exceeded the limit"))
          errorMessage = "vCPU has exceeded the limit";
        else if (errorMessage.includes("RAM has exceeded the limit"))
          errorMessage = "RAM has exceeded the limit";

        dispatch(
          "HOMEPAGE/showErrorToast",
          `Failed to restore snapshot. ${errorMessage}. Please contact administrator.`,
          {
            root: true,
          }
        );
        return e.response;
      }
    },
  },
};
export default store;
