<template>
  <v-app>
    <LandingPageAppBar v-show="isEmpty(user) || $route.path.includes('/otp') || $route.path.includes('/eula-content')"
      :pagesMenu="pagesMenu" :components="appBarButton" />

    <router-view></router-view>
    <v-snackbar v-model="snackbar" :timeout="5000" :color="toastMode" class="text-center">
      <span class="fz-14">{{ toastmessage }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackbarWS" :color="toastWSMode == 'success'
        ? 'green'
        : toastWSMode == 'error'
          ? 'red'
          : 'dark'
      " class="text-center" bottom right timeout="-1">
      <div style="display: flex; align-items: center">
        <v-icon class="mr-2 mt-1" v-if="toastWSMode === 'success'">mdi-check-circle-outline</v-icon>
        <v-icon class="mr-2 mt-1" v-if="toastWSMode === 'error'">mdi-close-circle-outline</v-icon>
        <beat-loader v-if="toastWSMode === 'process'" :loading="toastWS" :color="'white'" :size="'10px'"
          style="transform: translateY(3px)" class="mr-2"></beat-loader>
        <span class="fz-14">{{ toastWSMessage }}</span>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbarWS = false">
          X
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import '@/scss/custom.css'
import { SUPERADMIN } from "./modules/superadmin/namespace";
import LandingPageAppBar from "./components/LandingPageAppBar";
import { mapGetters } from "vuex";
import { computed, watch } from "@vue/composition-api";
import {
  useGetters,
  useNamespacedGetters,
  useNamespacedMutations,
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import localstorage from "@/lib/localstorage";

export default {
  name: "App",
  setup(props, context) {
    props;
    const { user } = useGetters({
      user: "ROLEPERMISSION/getuser",
    });
    const {
      toast,
      toastMode,
      toastmessage,
      toastWS,
      toastWSMode,
      toastWSMessage,
    } = useNamespacedState("HOMEPAGE", [
      "toast",
      "toastMode",
      "toastmessage",
      "toastWS",
      "toastWSMode",
      "toastWSMessage",
    ]);
    const { isEmpty } = context.root.$lodash;
    const { setToast, setToastWS } = useNamespacedMutations("HOMEPAGE", [
      "setToast",
      "setToastWS",
    ]);

    const snackbar = computed({
      get: () => toast.value,
      set: (val) => setToast(val),
    });

    const snackbarWS = computed({
      get: () => toastWS.value,
      set: (val) => setToastWS(val),
    });
    // connect to ws superadmin
    const { currentProj } = useNamespacedState(SUPERADMIN, ["currentProj"]);
    const { projectid } = useNamespacedState('PROJECT', ['projectid']);
    const { detailVyos: vyos } = useNamespacedState('NETWORKVPC', ["detailVyos"]);
    let url;

    context.root.$options.sockets.onopen = (e) => {
      // console.log("Connected.",);
    };

    context.root.$options.sockets.onclose = (e) => {
      // console.log(`Disconnected.`,);
    };

    context.root.$options.sockets.onerror = (e) => {
      // console.log("Error.", e);
    };

    // ==========================
    // WEBSOCKET MESSAGE HANDLER
    // ==========================

    const handleSocketMessage = (data) => {
      const isLoggedIn = localStorage.getItem('token') ? true : false
      if (!isLoggedIn) return

      if (data.service === "Deka NFS" && currentProj.value.id) {
        let status = {
          Created: "Created",
          Deleted: "Deleted",
          Resized: "Resized",
        }

        switch (data.action) {
          case "NFS_CREATE":
            if (data.status === status.Created) {
              context.root.$store.dispatch(
                "HOMEPAGE/showSuccessToastWS",
                `Deka NFS '${data.name}' has been successfully created`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSList", { params: { project_id: currentProj.value.id } });
            } else {
              context.root.$store.dispatch(
                "HOMEPAGE/showErrorToastWS",
                `Failed to Create Deka NFS ${data.name}`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSList", { params: { project_id: currentProj.value.id } });
            }
            break;
          case "NFS_ADD_CLIENT":
            if (data.status === status.Created && data.id) {
              context.root.$store.dispatch(
                "HOMEPAGE/showSuccessToastWS",
                `Deka NFS Client '${data.name}' has been successfully created`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSClientList", { params: { id: data.id } });
            } else {
              context.root.$store.dispatch(
                "HOMEPAGE/showErrorToastWS",
                `Failed to Add '${data.name}' Deka NFS client`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSClientList", { params: { id: data.id } });
            }
            break;
          case "NFS_DELETE_CLIENT":
            if (data.status === status.Deleted && data.id) {
              context.root.$store.dispatch(
                "HOMEPAGE/showSuccessToastWS",
                `Deka NFS Client '${data.name}' has been successfully deleted`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSClientList", { params: { id: data.id } });
            } else {
              context.root.$store.dispatch(
                "HOMEPAGE/showErrorToastWS",
                `Failed to Delete '${data.name}' Deka NFS client`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSClientList", { params: { id: data.id } });
            }
            break;
          case "NFS_RESIZE":
            if (data.status === status.Resized && data.id) {
              context.root.$store.dispatch(
                "HOMEPAGE/showSuccessToastWS",
                `Deka NFS '${data.name}' has been successfully updated`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSList", { params: { project_id: currentProj.value.id } });
            } else {
              context.root.$store.dispatch(
                "HOMEPAGE/showErrorToastWS",
                `Failed to Resize '${data.name}' Deka NFS`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSList", { params: { project_id: currentProj.value.id } });
            }
            break;
          case "NFS_DELETE":
            if (data.status === status.Deleted) {
              context.root.$store.dispatch(
                "HOMEPAGE/showSuccessToastWS",
                `Deka NFS '${data.name}' has been successfully deleted`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSList", { params: { project_id: currentProj.value.id } });
            } else {
              context.root.$store.dispatch(
                "HOMEPAGE/showErrorToastWS",
                `Failed to Delete '${data.name}' Deka NFS`,
                { root: true }
              );
              context.root.$store.dispatch("NFS/getNFSList", { params: { project_id: currentProj.value.id } });
            }
            break;
        }
      }

      // GET INSTANCES STATUS
      if (data.action === "get_instances_status" && data.status === "success") {
        context.root.$store.commit('INSTANCE/setInstancesStatus', data.instances_status);
      }

      // CREATE LOAD BALANCER
      if (data.action === "create_load_balancer") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Load balancer ${data.load_balancer_name} has been successfully created`,
            { root: true }
          );

          context.root.$store.dispatch('NETWORKLOADBALANCER/fetchLoadBalancers');
        } else {
          context.root.$store.dispatch(
            'HOMEPAGE/showErrorToastWS',
            `Failed to build load balancer ${data.load_balancer_name}`,
            { root: true }
          );
          context.root.$store.dispatch('NETWORKLOADBALANCER/fetchLoadBalancers');
        }
      }

      // UPDATE LOAD BALANCER
      if (data.action === "update_load_balancer") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Load balancer ${data.load_balancer_name} has been successfully updated`,
            { root: true }
          );
          context.root.$store.dispatch('NETWORKLOADBALANCER/fetchLoadBalancers');
        } else {
          context.root.$store.dispatch(
            'HOMEPAGE/showErrorToastWS',
            `Failed to update load balancer ${data.load_balancer_name}`,
            { root: true }
          );
          context.root.$store.dispatch('NETWORKLOADBALANCER/fetchLoadBalancers');
        }
      }

      // DELETE INSTANCE
      if (data.action === "delete_instance") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Instance ${data.instance_name} has been successfully destroyed`,
            { root: true }
          );

          context.root.$store.dispatch('INSTANCE/fetchPaginatedInstances');
          context.root.$store.commit('INSTANCE/setIsLoadingTurn', false);
        } else {
          context.root.$store.dispatch(
            'HOMEPAGE/showErrorToastWS',
            `Failed to destroy instance ${data.instance_name}`,
            { root: true }
          );
          context.root.$store.dispatch('INSTANCE/fetchPaginatedInstances');
          context.root.$store.commit('INSTANCE/setIsLoadingTurn', false);
        }
      }

      // DELETE INSTANCE
      if (data.action === "delete_instance") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Instance ${data.instance_name} has been successfully destroyed`,
            { root: true }
          );

          context.root.$store.dispatch('INSTANCE/fetchPaginatedInstances', data.instance_id);
          context.root.$store.commit('INSTANCE/setIsLoadingTurn', false);
        } else {
          context.root.$store.dispatch(
            'HOMEPAGE/showErrorToastWS',
            `Failed to destroy instance ${data.instance_name}`,
            { root: true }
          );
          context.root.$store.dispatch('INSTANCE/fetchPaginatedInstances', data.instance_id);
          context.root.$store.commit('INSTANCE/setIsLoadingTurn', false);
        }
      }

      // POWER ON INSTANCE ..
      if (data.action === "vm_start") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Instance ${data.instance_name} has been successfully turned on`,
            { root: true }
          );

          // context.root.$store.dispatch('INSTANCE/fetchInstanceDetail', data.instance_id);
          context.root.$store.dispatch('INSTANCE/fetchPaginatedInstances');
          context.root.$store.commit('INSTANCE/removeInstancesLoadingTurn', data.instance_id);
        } else {
          context.root.$store.dispatch(
            'HOMEPAGE/showErrorToastWS',
            `Failed to power on instance ${data.instance_name}`,
            { root: true }
          );
          context.root.$store.dispatch('INSTANCE/fetchInstanceDetail', data.instance_id);
          context.root.$store.commit('INSTANCE/removeInstancesLoadingTurn', data.instance_id);
        }
      }

      // POWER OFF INSTANCE ..
      if (data.action === "vm_stop") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Instance ${data.instance_name} has been successfully turned off`,
            { root: true }
          );
          // context.root.$store.dispatch('INSTANCE/fetchInstanceDetail', data.instance_id);
          context.root.$store.dispatch('INSTANCE/fetchPaginatedInstances');
          context.root.$store.commit('INSTANCE/removeInstancesLoadingTurn', data.instance_id);
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to shutdown instance ${data.instance_name}`,
            { root: true }
          );
          context.root.$store.dispatch('INSTANCE/fetchInstanceDetail', data.instance_id);
          context.root.$store.commit('INSTANCE/removeInstancesLoadingTurn', data.instance_id);
        }
      }

      // RESTARTING INSTANCE ..
      if (data.action === "vm_restart") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Instance ${data.instance_name} has been successfully restarted`,
            { root: true }
          );
          context.root.$store.dispatch('INSTANCE/fetchInstanceDetail', data.instance_id);
          context.root.$store.commit('INSTANCE/setIsLoadingReboot', false);
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to restart instance ${data.instance_name}`,
            { root: true }
          );
          context.root.$store.dispatch('INSTANCE/fetchInstanceDetail', data.instance_id);
          context.root.$store.commit('INSTANCE/setIsLoadingReboot', false);
        }
      }

      // RESIZING INSTANCE ..
      if (data.action === "vm_resize") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Instance ${data.instance_name} has been successfully resized`,
            { root: true }
          );
          context.root.$store.dispatch('INSTANCE/fetchInstanceDetail', data.instance_id);
          context.root.$store.commit('INSTANCE/setIsLoading', false);
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to resize instance ${data.instance_name}`,
            { root: true }
          );
          context.root.$store.commit('INSTANCE/setIsLoading', false);
        }
      }

      // CREATING INSTANCE ..
      if (data.action === "create_instance") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Instance ${data.instance_name} has been successfully created`,
            { root: true }
          );
          context.root.$store.dispatch("INSTANCE/fetchPaginatedInstances");
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to build instance ${data.instance_name}`,
            { root: true }
          );
          context.root.$store.dispatch("INSTANCE/fetchPaginatedInstances");
        }
      }

      // CREATING INSTANCE ..
      if (data.action === "resize_root_disk") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Instance ${data.instance_name} root disk has been successfully increased`,
            { root: true }
          );
          context.root.$store.dispatch("INSTANCE/fetchPaginatedInstances");
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to increase instance ${data.instance_name} root disk`,
            { root: true }
          );
          context.root.$store.dispatch("INSTANCE/fetchPaginatedInstances");
        }
      }

      // DELETE OBJECT STORAGE ..
      if (data.action === "delete_object_storage") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Deka Box ${data.object_storage_name} has been successfully destroyed`,
            { root: true }
          );
          context.root.$store.dispatch("OBJECTSTORAGE/fetchObjectStorages");
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to destroy ${data.object_storage_name}`,
            { root: true }
          );
          context.root.$store.dispatch("INSTANCE/fetchObjectStorages");
        }
      }

      // IMPORT CUSTOM IMAGE BY URL
      if (data.action === "image_upload") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `${data.image_name} has been successfully imported`,
            { root: true }
          );
          context.root.$store.dispatch("IMAGES/fetchCustomImages");
          context.root.$store.commit("IMAGES/setIsLoading", false);
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to import custom image`,
            { root: true }
          );
          context.root.$store.dispatch("IMAGES/fetchCustomImages");
          context.root.$store.commit("INSTANCE/setIsLoadingTurn", false);
        }
      }

      // SNAPSHOTS
      if (data.action === "create_snapshot") {
        const { instanceid } = context.root._route.params
        const isInInstanceDetailsPage = instanceid ? true : false
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Snapshot ${data.image_name} has been successfully created`,
            { root: true }
          );

          if (isInInstanceDetailsPage) context.root.$store.dispatch('IMAGES/fetchInstanceSnapshotsByInstanceID', { instance_id: instanceid })
          else context.root.$store.dispatch('IMAGES/fetchInstanceSnapshots')

          context.root.$store.dispatch('IMAGES/fetchStorageSnapshots');
          context.root.$store.commit('IMAGES/setIsLoading', false);
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create snapshot`,
            { root: true }
          );
          context.root.$store.dispatch('IMAGES/fetchStorageSnapshots');
          if (isInInstanceDetailsPage) context.root.$store.dispatch('IMAGES/fetchInstanceSnapshotsByInstanceID', { instance_id: instanceid })
          else context.root.$store.dispatch('IMAGES/fetchInstanceSnapshots')
          context.root.$store.commit('INSTANCE/setIsLoadingTurn', false);
        }
      }

      if (data.action === "delete_snapshot") {
        const { instanceid } = context.root._route.params
        const isInInstanceDetailsPage = instanceid ? true : false
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Snapshot ${data.image_name} has been successfully deleted`,
            { root: true }
          );

          if (isInInstanceDetailsPage) context.root.$store.dispatch('IMAGES/fetchInstanceSnapshotsByInstanceID', { instance_id: instanceid })
          else context.root.$store.dispatch('IMAGES/fetchInstanceSnapshots')

          context.root.$store.dispatch('IMAGES/fetchStorageSnapshots');
          context.root.$store.commit('IMAGES/setIsLoading', false);
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete snapshot`,
            { root: true }
          );
          context.root.$store.dispatch('IMAGES/fetchStorageSnapshots');
          if (isInInstanceDetailsPage) context.root.$store.dispatch('IMAGES/fetchInstanceSnapshotsByInstanceID', { instance_id: instanceid })
          else context.root.$store.dispatch('IMAGES/fetchInstanceSnapshots')
          context.root.$store.commit('INSTANCE/setIsLoadingTurn', false);
        }
      }

      // SSL
      if (data.action === "create_ssl") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `SSL ${data.domain_name} has been successfully created`,
            { root: true }
          );
          context.root.$store.commit('SSL/setIsLoading', false);
          context.root.$store.commit('SSL/setIsCreated', true);
          context.root.$store.dispatch('SSL/getListSSL');
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create SSL ${data.domain_name}`,
            { root: true }
          );
          context.root.$store.dispatch('SSL/getListSSL');
          context.root.$store.commit('SSL/setIsLoading', false);
        }
      }

      if (data.action === "renewal_ssl") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `SSL ${data.domain_name} has been successfully renewal`,
            { root: true }
          );
          context.root.$store.commit('SSL/setIsLoadingRenewal', false);
          context.root.$store.commit('SSL/removeRenewalData', data.domain_name);
          context.root.$store.dispatch('SSL/getListSSL');
          context.root.$store.dispatch('SSL/getDetailSSL', data.id);
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to renewal SSL ${data.domain_name}`,
            { root: true }
          );
          context.root.$store.commit('SSL/setIsLoadingRenewal', false);
          context.root.$store.commit('SSL/removeRenewalData', data.domain_name);
          context.root.$store.dispatch('SSL/getListSSL');
          context.root.$store.dispatch('SSL/getDetailSSL', data.id);
        }
      }

      if (data.action === "delete_ssl") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `SSL ${data.domain_name} has been successfully deleted`,
            { root: true }
          );
          context.root.$store.dispatch('SSL/getListSSL');
          context.root.$store.commit('SSL/setIsLoadingDelete', false);
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete SSL ${data.domain_name}`,
            { root: true }
          );
          context.root.$store.dispatch('SSL/getListSSL');
          context.root.$store.commit('SSL/setIsLoadingDelete', false);
        }
      }
      if (data.action === "slb_create") {
        if (data.status === "SUCCESS") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Load balancer ${data.slb_instance_name} has successfully created!`,
            { root: true }
          );
          context.root.$store.commit('SLB/setIsLoading', false);
          context.root.$store.dispatch('SLB/fetchSlb', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create Load balancer ${data.slb_instance_name}`,
            { root: true }
          );
          context.root.$store.commit('SLB/setIsLoading', false);
          context.root.$store.dispatch('SLB/fetchSlb', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id });
        }
      }
      if (data.action === "slb_delete") {
        if (data.status === "SUCCESS") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Load balancer ${data.slb_instance_name} has successfully deleted!`,
            { root: true }
          );
          context.root.$store.commit('SLB/setIsLoading', false);
          context.root.$store.dispatch('SLB/fetchSlb', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id });
        } else {
          console.log(`Failed to delete Load Balancer ${data.slb_instance_name}`)
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete Load balancer ${data.slb_instance_name}`,
            { root: true }
          );
          context.root.$store.commit('SLB/setIsLoading', false);
          context.root.$store.dispatch('SLB/fetchSlb', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id });
        }
      }
      if (data.action === "raas_create") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `NAT Gateway ${data.vyos_name} has been successfully created`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/FETCH_VPC');
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create NAT Gateway ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/FETCH_VPC');
        }
      }
      if (data.action === "raas_delete") {
        // let is_network = localStorage.getItem('is_network')
        // let name = is_network == 'yes' ? 'Network' : 'VPC'
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `NAT Gateway ${data.vyos_name} has been successfully deleted`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/FETCH_VPC');

          // if(is_network == 'yes'){
          //   context.root.$store.dispatch('NETWORKVPC/fetchNetwork',{page: 1, itemsPerPage: 10, vpc_id: vpc.value.id});
          //   localStorage.removeItem('is_network')
          // }else{
          //   context.root.$store.dispatch('NETWORKVPC/FETCH_VPC');
          //   localStorage.removeItem('is_network')
          // }
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete NAT Gateway ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/FETCH_VPC');

          // if(is_network == 'yes'){
          //   context.root.$store.dispatch('NETWORKVPC/fetchNetwork',{page: 1, itemsPerPage: 10, vpc_id: vpc.value.id});
          //   localStorage.removeItem('is_network')
          // }else{
          //   context.root.$store.dispatch('NETWORKVPC/FETCH_VPC');
          //   localStorage.removeItem('is_network')
          // }
        }
      }

      if (data.action === "raas_create_interface") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Floating IP ${data.vyos_name} has been successfully created`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchInterfaces', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create Floating IP ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchInterfaces', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        }
      }
      if (data.action === "raas_delete_interface") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Floating IP ${data.vyos_name} has been successfully deleted`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchInterfaces', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to Floating IP ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchInterfaces', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        }
      }

      if (data.action === "raas_create_routing") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Routing ${data.vyos_name} has been successfully created`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchStaticRouting', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create Routing ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchStaticRouting', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        }
      }
      if (data.action === "raas_delete_routing") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Routing ${data.vyos_name} has been successfully deleted`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchStaticRouting', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete Routing ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchStaticRouting', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        }
      }

      if (data.action === "raas_create_nat") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `NAT ${data.vyos_name} has been successfully created`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchNatGateway', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create NAT ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchNatGateway', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        }
      }
      if (data.action === "raas_delete_nat") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `NAT ${data.vyos_name} has been successfully deleted`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchNatGateway', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete NAT ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoading', false);
          context.root.$store.dispatch('NETWORKVPC/fetchNatGateway', { page: 1, itemsPerPage: 10, instance_id: vyos.value.instance_id });
        }
      }

      if (data.action === "raas_create_router") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Set Gateway ${data.vyos_name} has been successfully created`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoadingSwitch', false);
          context.root.$store.dispatch('NETWORKVPC/fetchNetwork', { page: 1, itemsPerPage: 10, vpc_id: vyos.value.vpc_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to set Gateway ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoadingSwitch', false);
          context.root.$store.dispatch('NETWORKVPC/fetchNetwork', { page: 1, itemsPerPage: 10, vpc_id: vyos.value.vpc_id });
        }
      }
      if (data.action === "raas_delete_router") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Clear Gateway ${data.vyos_name} has been successfully deleted`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoadingSwitch', false);
          context.root.$store.dispatch('NETWORKVPC/fetchNetwork', { page: 1, itemsPerPage: 10, vpc_id: vyos.value.vpc_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to clear Gateway ${data.vyos_name}`,
            { root: true }
          );
          context.root.$store.commit('NETWORKVPC/setIsLoadingSwitch', false);
          context.root.$store.dispatch('NETWORKVPC/fetchNetwork', { page: 1, itemsPerPage: 10, vpc_id: vyos.value.vpc_id });
        }
      }
      if (data.action === "create_vpn_pfsense") {
        if (data.status === "SUCCESS") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `VPN ${data.pfsense_instance_name} has successfully created`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchPfsense', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create VPN ${data.pfsense_instance_name}`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchPfsense', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id });
        }
      }
      if (data.action === "delete_vpn_pfsense") {
        if (data.status === "SUCCESS") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `VPN ${data.pfsense_instance_name} has been successfully deleted`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchPfsense', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete VPN ${data.pfsense_instance_name}`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchPfsense', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id });
        }
      }
      if (data.action === "create_vpn_ipsec") {
        let currentVpn = JSON.parse(localStorage.getItem('vpn'))
        if (data.status === "SUCCESS") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `IPsec configuration ${data.ipsec_instance_name} has successfully created`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchIpsec', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, instance_name: currentVpn.instance_name });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create IPsec configuration ${data.ipsec_instance_name}`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchIpsec', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, instance_name: currentVpn.instance_name });
        }
      }

      if (data.action === "delete_vpn_ipsec") {
        let currentVpn = JSON.parse(localStorage.getItem('vpn'))
        if (data.status === "SUCCESS") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `IPsec configuration ${data.ipsec_instance_name} has successfully deleted`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchIpsec', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, instance_name: currentVpn.instance_name });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete IPsec configuration ${data.ipsec_instance_name}`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchIpsec', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, instance_name: currentVpn.instance_name });
        }
      }

      if (data.action === "create_openvpn") {
        let currentVpn = JSON.parse(localStorage.getItem('vpn'))
        if (data.status === "SUCCESS") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `OpenVPN configuration ${data.openvpn_instance_name} has successfully created`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchOpenVpn', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, instance_name: currentVpn.instance_name });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create OpenVPN configuration ${data.openvpn_instance_name}`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchOpenVpn', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, instance_name: currentVpn.instance_name });
        }
      }
      if (data.action === "delete_openvpn") {
        let currentVpn = JSON.parse(localStorage.getItem('vpn'))
        if (data.status === "SUCCESS") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `OpenVPN configuration ${data.openvpn_instance_name} has successfully deleted`,
            { root: true }
          );
          localStorage.removeItem('openvpn')
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.commit('VPN/setListUserOpenvpn', [])
          context.root.$store.dispatch('VPN/fetchOpenVpn', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, instance_name: currentVpn.instance_name });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete OpenVPN configuration ${data.openvpn_instance_name}`,
            { root: true }
          );
          context.root.$store.commit('VPN/setIsLoading', false);
          context.root.$store.dispatch('VPN/fetchOpenVpn', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, instance_name: currentVpn.instance_name });
        }
      }
      if (data.action === "cdn_create") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `CDN ${data.domain_name} has been successfully created`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoading', false);
          context.root.$store.dispatch('CDN/getListCDN');
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create CDN ${data.domain_name}`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoading', false);
          context.root.$store.dispatch('CDN/getListCDN');
        }
      }

      if (data.action === "cdn_delete") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `CDN ${data.domain_name} has been successfully deleted`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingDelete', false);
          context.root.$store.dispatch('CDN/getListCDN');
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete CDN ${data.domain_name}`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingDelete', false);
          context.root.$store.dispatch('CDN/getListCDN');
        }
      }

      if (data.action === "cdn_update_vcl") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `CDN ${data.domain_name} VCL has been successfully updated `,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingUpdateVcl', false);
          context.root.$store.dispatch('CDN/getListCDN');
          context.root.$store.dispatch('CDN/goToRoot')
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to update VCL ${data.domain_name}`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingUpdateVcl', false);
          context.root.$store.dispatch('CDN/getListCDN');
          context.root.$store.dispatch('CDN/goToRoot')
        }
      }

      if (data.action === "cdn_update_deployment") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `CDN ${data.domain_name} Location has been successfully updated `,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingUpdateDeployment', false);
          context.root.$store.commit("CDN/setIsValidPassword", false)
          setTimeout(() => context.root.$store.dispatch('CDN/reloadPage'), 1000)
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to update CDN Location ${data.domain_name}`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingUpdateDeployment', false);
          context.root.$store.commit('CDN/setIsValidPassword', false)
        }
      }
      if (data.action === "cdn_deploy") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `CDN ${data.domain_name} has been successfully deployed`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingDeploy', false);
          setTimeout(() => context.root.$store.dispatch('CDN/reloadPage'), 1000)
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to Deploy CDN ${data.domain_name}`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingDeploy', false);
          setTimeout(() => context.root.$store.dispatch('CDN/reloadPage'), 1000)
        }
      }
      if (data.action === "cdn_reupload_ssl") {
        if (data.status === "success") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Reupload SSL for CDN ${data.domain_name} successfully`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingRenewalSSL', false);
          setTimeout(() => context.root.$store.dispatch('CDN/reloadPage'), 1000)
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to Renewal ${data.domain_name}`,
            { root: true }
          );
          context.root.$store.commit('CDN/setIsLoadingRenewalSSL', false);
          setTimeout(() => context.root.$store.dispatch('CDN/reloadPage'), 1000)
        }
      }
      if (data.action === "claim_voucher_discount") {
        if (data.status === "success") {
          const message = data.message[0].toUpperCase() + data.message.slice(1);
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            message,
            { root: true }
          );
          context.root.$store.dispatch('MANAGEVOUCHER/fetchVoucherDiscountProjects', { voucherDiscountID: data.voucher_id });
        } else {
          const error = data.error[0].toUpperCase() + data.error.slice(1);
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            error,
            { root: true }
          );
        }
      }
      if (data.action === "dekarock_create_progress" && currentProj.value.id) {
        if (!data.finish) {
          context.root.$store.commit("DEKAROCK/setOpenshiftStatusUpdate", data);
        } else {
          if (data.status === "Created") {
            context.root.$store.dispatch(
              "HOMEPAGE/showSuccessToastWS",
              `Deka ROCK cluster has been successfully created`,
              { root: true }
            );
            context.root.$store.dispatch("DEKAROCK/getOpenshiftList", { params: { project_id: currentProj.value.id } });
          } else {
            context.root.$store.dispatch(
              "HOMEPAGE/showErrorToastWS",
              `Failed to build openshift ${data.openshift_name}`,
              { root: true }
            );
            context.root.$store.dispatch("DEKAROCK/getOpenshiftList", { params: { project_id: currentProj.value.id } });
          }
        }
      }
      if (data.action === "dekarock_delete_progress" && currentProj.value.id) {
        if (data.finish && data.status == "deleted") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Deka ROCK cluster has been successfully destroyed`,
            { root: true }
          );
          context.root.$store.dispatch("DEKAROCK/getOpenshiftList", { params: { project_id: currentProj.value.id } });
        }
      }
      if (data.action === "dekarock_delete_machine_set_progress" && currentProj.value.id) {
        if (data.finish && data.status == "deleted") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Machine set has been successfully deleted`,
            { root: true }
          );
          context.root.$store.dispatch("DEKAROCK/getOpenshiftMachineSetList", { payload: { id: data.openshift_id } });
          context.root.$store.dispatch("DEKAROCK/getOpenshiftDetail", data.openshift_id);
          context.root.$store.dispatch("DEKAROCK/getOpenshiftList", { params: { project_id: currentProj.value.id } });
        }
      }
      if (data.action === "dekarock_resize_machine_set_progress" && currentProj.value.id) {
        if (data.finish && data.status == "resized") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Machine set has been successfully resized`,
            { root: true }
          );
          context.root.$store.dispatch("DEKAROCK/getOpenshiftMachineSetList", { payload: { id: data.openshift_id } });
          context.root.$store.dispatch("DEKAROCK/getOpenshiftDetail", data.openshift_id);
          context.root.$store.dispatch("DEKAROCK/getOpenshiftList", { params: { project_id: currentProj.value.id } });
        }
      }
      if (data.action === "dekarock_add_machine_set_progress" && currentProj.value.id) {
        if (data.finish && data.status == "added") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Machine set has been successfully created`,
            { root: true }
          );
          context.root.$store.dispatch("DEKAROCK/getOpenshiftMachineSetList", { payload: { id: data.openshift_id } });
          context.root.$store.dispatch("DEKAROCK/getOpenshiftDetail", data.openshift_id);
          context.root.$store.dispatch("DEKAROCK/getOpenshiftList", { params: { project_id: currentProj.value.id } });
        }
      }
      if (data.action === "Deploy Cluster") {
        if (data.status === "succeed") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Cluster Deka Harbor ${data.name} has successfully created!`,
            { root: true }
          );
          context.root.$store.commit('DEKAHARBOR/setIsLoading', false);
          context.root.$store.dispatch('DEKAHARBOR/fetchCluster', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, sortBy: [], sortDesc: [], });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create Cluster Deka Harbor ${data.name}`,
            { root: true }
          );
          context.root.$store.commit('DEKAHARBOR/setIsLoading', false);
          context.root.$store.dispatch('DEKAHARBOR/fetchCluster', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, sortBy: [], sortDesc: [], });
        }
      }
      if (data.action === "Delete Cluster") {
        if (data.status === "succeed") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Cluster Deka Harbor ${data.name} has successfully deleted!`,
            { root: true }
          );
          context.root.$store.commit('DEKAHARBOR/setIsLoading', false);
          context.root.$store.dispatch('DEKAHARBOR/fetchCluster', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, sortBy: [], sortDesc: [], });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete Cluster Deka Harbor ${data.name}`,
            { root: true }
          );
          context.root.$store.commit('DEKAHARBOR/setIsLoading', false);
          context.root.$store.dispatch('DEKAHARBOR/fetchCluster', { page: 1, itemsPerPage: 10, projek: currentProj.value.openstack_project_id, sortBy: [], sortDesc: [], });
        }
      }
      if (data.action === "Deploy Worker") {
        if (data.status === "succeed") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Deka Harbor Worker ${data.name} has successfully created!`,
            { root: true }
          );
          context.root.$store.commit('DEKAHARBOR/setIsLoading', false);
          context.root.$store.dispatch('DEKAHARBOR/fetchHarborInstance', { page: 1, itemsPerPage: 10, harborid: context.root._route.params.harborid, type: 'all', sortBy: [], sortDesc: [], });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to create Deka Harbor Worker ${data.name}`,
            { root: true }
          );
          context.root.$store.commit('DEKAHARBOR/setIsLoading', false);
          context.root.$store.dispatch('DEKAHARBOR/fetchHarborInstance', { page: 1, itemsPerPage: 10, harborid: context.root._route.params.harborid, type: 'all', sortBy: [], sortDesc: [], });
        }
      }
      if (data.action === "Delete Worker") {
        if (data.status === "succeed") {
          context.root.$store.dispatch(
            "HOMEPAGE/showSuccessToastWS",
            `Deka Harbor Worker ${data.name} has successfully deleted!`,
            { root: true }
          );
          context.root.$store.commit('DEKAHARBOR/setIsLoading', false);
          context.root.$store.dispatch('DEKAHARBOR/fetchHarborInstance', { page: 1, itemsPerPage: 10, harborid: context.root._route.params.harborid, type: 'all', sortBy: [], sortDesc: [], });
        } else {
          context.root.$store.dispatch(
            "HOMEPAGE/showErrorToastWS",
            `Failed to delete Deka Harbor Worker ${data.name}`,
            { root: true }
          );
          context.root.$store.commit('DEKAHARBOR/setIsLoading', false);
          context.root.$store.dispatch('DEKAHARBOR/fetchHarborInstance', { page: 1, itemsPerPage: 10, harborid: context.root._route.params.harborid, type: 'all', sortBy: [], sortDesc: [], });
        }
      }
      if (data.action === "Generate Token") {
        if (data.status === "Succeed") {
          context.root.$store.commit('DEKAHARBOR/setIsLoadingBtn', false);
          context.root.$store.dispatch('DEKAHARBOR/getToken', { harborid: context.root._route.params.harborid });
        } else {
          context.root.$store.commit('DEKAHARBOR/setIsLoadingBtn', false);
          context.root.$store.dispatch('DEKAHARBOR/getToken', { harborid: context.root._route.params.harborid });
        }
      }
    }

    const user_role = localstorage.getItem("role");

    // ==============================
    // WEBSOCKET SUPER ADMIN CHANNEL
    // ==============================

    let connection = null
    if (user_role && user_role == "Superadmin") {
      connection = new WebSocket(`${process.env.VUE_APP_WS_BASE_URL}/admin`)
      connection.onmessage = (message) => {
        const data = JSON.parse(message.data);
        handleSocketMessage(data)
      }
      connection.onopen = (event) => {
        context.root.$store.commit('HOMEPAGE/setSuperAdminWebsocket', connection, { root: true })
      }
      connection.onclose = (event) => {
      }

    }

    // ==========================
    // WEBSOCKET PROJECT CHANNEL
    // ==========================
    if (currentProj.value && currentProj.value.id) {
      url = `${process.env.VUE_APP_WS_BASE_URL}?project_id=${currentProj.value.id}`;
      let ssl_url = `${process.env.VUE_APP_WS_BASE_URL_SSL}?project_id=${currentProj.value.id}`;
      let raas_url = `${process.env.VUE_APP_WS_BASE_URL_RAAS}?openstack_project_id=${currentProj.value.openstack_project_id}`;
      context.root.$connect(url);
      context.root.$connect(ssl_url);
      context.root.$connect(raas_url);
    }

    context.root.$options.sockets.onmessage = (message) => {
      const data = JSON.parse(message.data);
      handleSocketMessage(data)

    };

    watch(
      currentProj,
      () => {
        const currentProjectID = currentProj.value && currentProj.value.id ? currentProj.value.id : null;
        if (!currentProjectID) return;
        url = `${process.env.VUE_APP_WS_BASE_URL}?project_id=${currentProj.value.id}`;
        let ssl_url = `${process.env.VUE_APP_WS_BASE_URL_SSL}?project_id=${currentProj.value.id}`;
        let raas_url = `${process.env.VUE_APP_WS_BASE_URL_RAAS}?openstack_project_id=${currentProj.value.openstack_project_id}`;
        context.root.$connect(url);
        context.root.$connect(ssl_url);
        context.root.$connect(raas_url);
      },
      { deep: true }
    );
    // SLB
    if (currentProj.value && currentProj.value.openstack_project_id) {
      url = `${process.env.VUE_APP_WS_BASE_URL}?openstack_project_id=${currentProj.value.openstack_project_id}`;
      let slb_url = `${process.env.VUE_APP_WS_BASE_URL_SLB}?openstack_project_id=${currentProj.value.openstack_project_id}`;
      let pfsense_url = `${process.env.VUE_APP_WS_BASE_URL_PFSENSE}?openstack_project_id=${currentProj.value.openstack_project_id}`;
      let harbor_url = `${process.env.VUE_APP_WS_BASE_URL_HARBOR}?openstack_project_id=${currentProj.value.openstack_project_id}`;
      context.root.$connect(url);
      context.root.$connect(slb_url);
      context.root.$connect(pfsense_url);
      context.root.$connect(harbor_url);
    }

    context.root.$options.sockets.onmessage = (message) => {
      const data = JSON.parse(message.data);
      handleSocketMessage(data)
    };

    watch(
      currentProj,
      () => {
        const currentProjectID = currentProj.value && currentProj.value.openstack_project_id ? currentProj.value.openstack_project_id : null;
        if (!currentProjectID) return;
        url = `${process.env.VUE_APP_WS_BASE_URL}?openstack_project_id=${currentProj.value.openstack_project_id}`;
        let slb_url = `${process.env.VUE_APP_WS_BASE_URL_SLB}?openstack_project_id=${currentProj.value.openstack_project_id}`;
        let pfsense_url = `${process.env.VUE_APP_WS_BASE_URL_PFSENSE}?openstack_project_id=${currentProj.value.openstack_project_id}`;
        let harbor_url = `${process.env.VUE_APP_WS_BASE_URL_HARBOR}?openstack_project_id=${currentProj.value.openstack_project_id}`;
        context.root.$connect(url);
        context.root.$connect(slb_url);
        context.root.$connect(pfsense_url);
        context.root.$connect(harbor_url);
      },
      { deep: true }
    );
    // check idle time
    setIdleTimeout(1000 * 60 * 15, function () {
      context.root.$store.dispatch('HOMEPAGE/logout', 'Your session is expired due to inactivity.')
      const token = localstorage.getItem('token')
      if (token) {
        localStorage.removeItem('token')
      }
      // context.root.$store.dispatch('HOMEPAGE/showSuccessToast', 'Your session is expired due to inactivity.')
    }, function () {
    });
    function setIdleTimeout(millis, onIdle, onUnidle) {
      let timeout = 0;
      startTimer();
      function startTimer() {
        timeout = setTimeout(onExpires, millis);
        document.addEventListener("mousemove", onActivity);
        document.addEventListener("click", onActivity);
        document.addEventListener("scroll", onActivity);
        document.addEventListener("keypress", onActivity);
      }
      function onExpires() {
        timeout = 0;
        onIdle();
      }
      function onActivity() {
        if (timeout) clearTimeout(timeout);
        else onUnidle();
        //since the mouse is moving, we turn off our event hooks for 1 second
        document.removeEventListener("mousemove", onActivity);
        document.removeEventListener("click", onActivity);
        document.removeEventListener("scroll", onActivity);
        document.removeEventListener("keypress", onActivity);
        setTimeout(startTimer, 1000);
      }
    }


    return {
      connection,
      snackbar,
      toast,
      toastmessage,
      toastMode,
      snackbarWS,
      toastWS,
      toastWSMessage,
      toastWSMode,
      user,
      isEmpty,
      user_role
    };
  },
  watch: {
    $route() {
      if (this.$gtag) this.$gtag.pageview({ page_path: this.$route.path })

      // need OTP
      const need_validate = localstorage.getItem('need_validate')
      if (need_validate && need_validate === 'true') {
        this.$store.dispatch('HOMEPAGE/logout')
      }
    }
  },
  mounted() {
    if (this.$gtag) this.$gtag.pageview({ page_path: this.$route.path })
  },
  sockets: {
    connect: function () {
    },
  },
  created() {
    this.$worker.onmessage = (c) => {
      switch (c.data.type) {
        case "newToken":
          localStorage.setItem("token", c.data.data);
          break;
        case "invalidToken":
          this.$store.dispatch('HOMEPAGE/logout')
      }
    };
  },
  components: {
    LandingPageAppBar,
  },

  computed: {
    ...mapGetters({
      pagesMenu: "PAGES/pagesMenu",
      appBarButton: "HOMEPAGE/appBarButton",
    }),
  },
};
</script>
<style lang="scss">
$font-color: #556272;

.v-application {

  p,
  label,
  td,
  .v-menu__content {
    color: $font-color;

    .v-list-item__title {
      color: $font-color;
    }
  }

  .v-icon::after {
    background-color: transparent;
  }
}
</style>
