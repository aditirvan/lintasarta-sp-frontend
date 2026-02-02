<template>
  <v-dialog max-width="1000" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">{{ editMode ? "Edit" : "Create New" }} Region</div>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-row>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Region Name
              <small class="error--text" v-if="$v.actual_name.$errors.length">&nbsp;*{{ $v.actual_name.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" v-model="actual_name" :disabled="editMode" placeholder="Region Name" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Alias
              <small class="error--text" v-if="$v.name.$errors.length">&nbsp;*{{ $v.name.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" v-model="name" :disabled="editMode" placeholder="Alias" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              CPU Limit
              <small class="error--text" v-if="$v.cpuLimit.$errors.length">&nbsp;*{{ $v.cpuLimit.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" type="number" placeholder="CPU Limit" v-model="cpuLimit" flat outlined>
              <template v-slot:append><span class="font--text">GB</span></template>
            </v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Memory Limit
              <small class="error--text" v-if="$v.memoryLimit.$errors.length">&nbsp;*{{ $v.memoryLimit.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Memory Limit" v-model="memoryLimit" flat outlined>
              <template v-slot:append><span class="font--text">GB</span></template>
            </v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Root Disk
              <small class="error--text" v-if="$v.rootDisk.$errors.length">&nbsp;*{{ $v.rootDisk.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Root Disk" v-model="rootDisk" flat outlined>
              <template v-slot:append><span class="font--text">GB</span></template>
            </v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Data Disk
              <small class="error--text" v-if="$v.dataDisk.$errors.length">&nbsp;*{{ $v.dataDisk.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Data Disk" v-model="dataDisk" flat outlined>
              <template v-slot:append><span class="font--text">GB</span></template>
            </v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Snapshot Instance Volume
              <small class="error--text" v-if="$v.snapshotInstanceVol.$errors.length">&nbsp;*{{ $v.snapshotInstanceVol.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Snapshot Instance Vol" v-model="snapshotInstanceVol" flat outlined>
              <template v-slot:append><span class="font--text">GB</span></template>
            </v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Snapshot Storage Volume
              <small class="error--text" v-if="$v.snapshotStorageVol.$errors.length">&nbsp;*{{ $v.snapshotStorageVol.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Snapshot Storage Vol" v-model="snapshotStorageVol" flat outlined>
              <template v-slot:append><span class="font--text">GB</span></template>
            </v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Daily Backup Volume
              <small class="error--text" v-if="$v.dailyBackupVol.$errors.length">&nbsp;*{{ $v.dailyBackupVol.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Daily Backup Vol" v-model="dailyBackupVol" flat outlined>
              <template v-slot:append><span class="font--text">GB</span></template>
            </v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Custom Image Volume
              <small class="error--text" v-if="$v.customImageVol.$errors.length">&nbsp;*{{ $v.customImageVol.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Custom Image Vol" v-model="customImageVol" flat outlined>
              <template v-slot:append><span class="font--text">GB</span></template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="pb-0">
        <p class="titletext">
          Description
          <small class="error--text" v-if="$v.description.$errors.length">&nbsp;*{{ $v.description.$errors[0].$message }}</small>
        </p>
        <v-textarea
          rows="5"
          id="description"
          flat
          outlined
          maxlength="255"
          v-model="description"
          placeholder="Description"
          style="margin-bottom: 22px"
          required
        ></v-textarea>
      </v-card-text>
      <v-card-text>
        <div class="headline font-weight-bold font--text">{{ editMode ? "Edit" : "Create New" }} Credential Openstack</div>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-row>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Admin Username
              <small class="error--text" v-if="$v.adminUsername.$errors.length">&nbsp;*{{ $v.adminUsername.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Admin Username" v-model="adminUsername" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0" v-if="editMode">
            <p class="titletext">
              Change Password
              <!-- <small class="error--text" v-if="$v.changePassword.$errors.length ">&nbsp;*{{ $v.changePassword.$errors[0].$message }}</small> -->
            </p>
            <v-text-field maxlength="100" placeholder="Change Password" v-model="changePassword" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0" v-else>
            <p class="titletext">
              Admin Password
              <small class="error--text" v-if="$v.adminPassword.$errors.length">&nbsp;*{{ $v.adminPassword.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Admin Password" v-model="adminPassword" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Project ID
              <small class="error--text" v-if="$v.projectID.$errors.length">&nbsp;*{{ $v.projectID.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Project ID" v-model="projectID" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Admin ID
              <small class="error--text" v-if="$v.adminID.$errors.length">&nbsp;*{{ $v.adminID.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Admin ID" v-model="adminID" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Role Admin ID
              <small class="error--text" v-if="$v.roleAdminID.$errors.length">&nbsp;*{{ $v.roleAdminID.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Role Admin ID" v-model="roleAdminID" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Role Member ID
              <small class="error--text" v-if="$v.roleMemberID.$errors.length">&nbsp;*{{ $v.roleMemberID.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Role Member ID" v-model="roleMemberID" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              External Network ID
              <small class="error--text" v-if="$v.externalNetworkID.$errors.length">&nbsp;*{{ $v.externalNetworkID.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="External Network ID" v-model="externalNetworkID" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Load Balancer Url
              <small class="error--text" v-if="$v.loadBalancerUrl.$errors.length">&nbsp;*{{ $v.loadBalancerUrl.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Load Balancer Url" v-model="loadBalancerUrl" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Auth Url
              <small class="error--text" v-if="$v.authUrl.$errors.length">&nbsp;*{{ $v.authUrl.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Auth Url" v-model="authUrl" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Alarm Url
              <small class="error--text" v-if="$v.alarmUrl.$errors.length">&nbsp;*{{ $v.alarmUrl.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Alarm Url" v-model="alarmUrl" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Openstack Url
              <small class="error--text" v-if="$v.openstackUrl.$errors.length">&nbsp;*{{ $v.openstackUrl.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Openstack Url" v-model="openstackUrl" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Metric Url
              <small class="error--text" v-if="$v.metricUrl.$errors.length">&nbsp;*{{ $v.metricUrl.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Metric Url" v-model="metricUrl" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Network Url
              <small class="error--text" v-if="$v.networkUrl.$errors.length">&nbsp;*{{ $v.networkUrl.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Network Url" v-model="networkUrl" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Compute Url
              <small class="error--text" v-if="$v.computeUrl.$errors.length">&nbsp;*{{ $v.computeUrl.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Compute Url" v-model="computeUrl" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Volume Url
              <small class="error--text" v-if="$v.volumeUrl.$errors.length">&nbsp;*{{ $v.volumeUrl.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Colume Url" v-model="volumeUrl" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Image Url
              <small class="error--text" v-if="$v.imageUrl.$errors.length">&nbsp;*{{ $v.imageUrl.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Image Url" v-model="imageUrl" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Domain ID
              <small class="error--text" v-if="$v.domainID.$errors.length">&nbsp;*{{ $v.domainID.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Domain ID" v-model="domainID" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Domain Name
              <small class="error--text" v-if="$v.domainName.$errors.length">&nbsp;*{{ $v.domainName.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Domain Name" v-model="domainName" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Openstack Project Name
              <small class="error--text" v-if="$v.projectName.$errors.length">&nbsp;*{{ $v.projectName.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Openstack Project Name" v-model="projectName" flat outlined></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="titletext">
              Openstack DNS Name Servers
              <small class="error--text" v-if="$v.dnsNameservers.$errors.length">&nbsp;*{{ $v.dnsNameservers.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Openstack DNS Name Servers" v-model="dnsNameservers" flat outlined></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="
                () => {
                  resetForm();
                  $emit('input', false);
                }
              "
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn id="Add" depressed height="45" block class="secondary" @click="save" :disabled="isRegionLoading">
              <beat-loader v-if="isRegionLoading" size="10px" color="white" :loading="isRegionLoading" />
              <span v-else>
                {{ editMode ? "Save Changes" : "Add" }}
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed, onMounted, ref, watch } from "@vue/composition-api";
const { required, maxLength, minValue, maxValue, minLength } = require("@vuelidate/validators");
import dialogfailcreate from "./dialogFailCreate";
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import { DEKAFLEXIREGION } from "../../namespace";
import { async } from "@firebase/util";

const allowedTypes = ["application/json"];

const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value", "selectedRegion"],
  setup(props, { root, emit }) {
    // Reset Form if create success
    root.$on("resetFormRegion", () => {
      resetForm();
    });

    const { isRegionLoading } = useNamespacedState(DEKAFLEXIREGION, ["isRegionLoading"]);

    const editMode = ref(false);
    watch(
      () => props.selectedRegion,
      (val) => {
        if (val === null) {
          editMode.value = false;
          resetForm();
        } else {
          editMode.value = true;
          name.value = props.selectedRegion.name;
          actual_name.value = props.selectedRegion.actual_name;
          description.value = props.selectedRegion.description;
          cpuLimit.value = props.selectedRegion.cpu_limit;
          memoryLimit.value = props.selectedRegion.ram_limit;
          // gpuLimit.value = props.selectedRegion.gpu_limit
          rootDisk.value = props.selectedRegion.root_disk;
          dataDisk.value = props.selectedRegion.data_disk;
          snapshotInstanceVol.value = props.selectedRegion.snapshot_instance_vol;
          snapshotStorageVol.value = props.selectedRegion.snapshot_storage_vol;
          dailyBackupVol.value = props.selectedRegion.daily_backup_vol;
          customImageVol.value = props.selectedRegion.custom_image_vol;
          adminUsername.value = props.selectedRegion.credential_openstack.username;
          adminPassword.value = props.selectedRegion.credential_openstack.password;
          projectID.value = props.selectedRegion.credential_openstack.project_id;
          adminID.value = props.selectedRegion.credential_openstack.admin_id;
          roleAdminID.value = props.selectedRegion.credential_openstack.role_admin_id;
          roleMemberID.value = props.selectedRegion.credential_openstack.role_member_id;
          externalNetworkID.value = props.selectedRegion.credential_openstack.external_network_id;
          loadBalancerUrl.value = props.selectedRegion.credential_openstack.load_balancer_url;
          authUrl.value = props.selectedRegion.credential_openstack.auth_url;
          alarmUrl.value = props.selectedRegion.credential_openstack.alarm_url;
          openstackUrl.value = props.selectedRegion.credential_openstack.url;
          metricUrl.value = props.selectedRegion.credential_openstack.metric_url;
          networkUrl.value = props.selectedRegion.credential_openstack.network_url;
          computeUrl.value = props.selectedRegion.credential_openstack.compute_url;
          volumeUrl.value = props.selectedRegion.credential_openstack.volume_url;
          imageUrl.value = props.selectedRegion.credential_openstack.image_url;
          domainID.value = props.selectedRegion.credential_openstack.domain_id;
          domainName.value = props.selectedRegion.credential_openstack.domain_name;
          projectName.value = props.selectedRegion.credential_openstack.project_name;
          dnsNameservers.value = props.selectedRegion.credential_openstack.dns_nameservers;
        }
      }
    );

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    const name = ref(null);
    const actual_name = ref(null);
    const cpuLimit = ref(null);
    const memoryLimit = ref(null);
    // const gpuLimit = ref(null)
    const rootDisk = ref(null);
    const dataDisk = ref(null);
    const snapshotInstanceVol = ref(null);
    const snapshotStorageVol = ref(null);
    const dailyBackupVol = ref(null);
    const customImageVol = ref(null);
    const description = ref(null);
    const adminUsername = ref(null);
    const adminPassword = ref(null);
    const changePassword = ref(null);
    const projectID = ref(null);
    const adminID = ref(null);
    const roleAdminID = ref(null);
    const roleMemberID = ref(null);
    const externalNetworkID = ref(null);
    const loadBalancerUrl = ref(null);
    const authUrl = ref(null);
    const alarmUrl = ref(null);
    const openstackUrl = ref(null);
    const metricUrl = ref(null);
    const networkUrl = ref(null);
    const computeUrl = ref(null);
    const volumeUrl = ref(null);
    const imageUrl = ref(null);
    const domainID = ref(null);
    const domainName = ref(null);
    const projectName = ref(null);
    const dnsNameservers = ref(null);

    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        actual_name: {
          required,
        },
        cpuLimit: {
          required,
          minValue: minValue(1),
        },
        memoryLimit: {
          required,
          minValue: minValue(1),
        },
        // gpuLimit: {
        //   required,
        //   minValue: minValue(1),
        // },
        rootDisk: {
          required,
          minValue: minValue(1),
        },
        dataDisk: {
          required,
          minValue: minValue(1),
        },
        snapshotInstanceVol: {
          required,
          minValue: minValue(1),
        },
        snapshotStorageVol: {
          required,
          minValue: minValue(1),
        },
        dailyBackupVol: {
          required,
          minValue: minValue(1),
        },
        customImageVol: {
          required,
          minValue: minValue(1),
        },
        description: {
          maxLength: maxLength(255),
        },
        adminUsername: {
          required,
          minValue: maxLength(255),
        },
        adminPassword: {
          required,
          minValue: maxLength(255),
        },
        changePassword: {
          // required,
          minValue: maxLength(255),
        },
        projectID: {
          required,
          minValue: maxLength(255),
        },
        adminID: {
          required,
          minValue: maxLength(255),
        },
        roleAdminID: {
          required,
          minValue: maxLength(255),
        },
        roleMemberID: {
          required,
          minValue: maxLength(255),
        },
        externalNetworkID: {
          required,
          minValue: maxLength(255),
        },
        loadBalancerUrl: {
          required,
          minValue: maxLength(255),
        },
        authUrl: {
          required,
          minValue: maxLength(255),
        },
        alarmUrl: {
          required,
          minValue: maxLength(255),
        },
        openstackUrl: {
          required,
          minValue: maxLength(255),
        },
        metricUrl: {
          required,
          minValue: maxLength(255),
        },
        networkUrl: {
          required,
          minValue: maxLength(255),
        },
        computeUrl: {
          required,
          minValue: maxLength(255),
        },
        volumeUrl: {
          required,
          minValue: maxLength(255),
        },
        imageUrl: {
          required,
          minValue: maxLength(255),
        },
        domainID: {
          required,
          minValue: maxLength(255),
        },
        domainName: {
          required,
          minValue: maxLength(255),
        },
        projectName: {
          required,
          minValue: maxLength(255),
        },
        dnsNameservers: {
          required,
          minValue: maxLength(255),
        },
      },
      {
        name,
        actual_name,
        description,
        memoryLimit,
        // gpuLimit,
        cpuLimit,
        rootDisk,
        dataDisk,
        snapshotInstanceVol,
        snapshotStorageVol,
        dailyBackupVol,
        customImageVol,
        adminUsername,
        adminPassword,
        changePassword,
        projectID,
        adminID,
        roleAdminID,
        roleMemberID,
        externalNetworkID,
        loadBalancerUrl,
        authUrl,
        alarmUrl,
        openstackUrl,
        metricUrl,
        networkUrl,
        computeUrl,
        volumeUrl,
        imageUrl,
        domainID,
        domainName,
        projectName,
        dnsNameservers,
      }
    );

    const resetForm = () => {
      name.value = null;
      actual_name.value = null;
      description.value = null;
      memoryLimit.value = null;
      cpuLimit.value = null;
      // gpuLimit.value = null
      rootDisk.value = null;
      dataDisk.value = null;
      snapshotInstanceVol.value = null;
      snapshotStorageVol.value = null;
      dailyBackupVol.value = null;
      customImageVol.value = null;
      adminUsername.value = null;
      adminPassword.value = null;
      changePassword.value = null;
      projectID.value = null;
      adminID.value = null;
      roleAdminID.value = null;
      roleMemberID.value = null;
      externalNetworkID.value = null;
      loadBalancerUrl.value = null;
      authUrl.value = null;
      alarmUrl.value = null;
      openstackUrl.value = null;
      metricUrl.value = null;
      networkUrl.value = null;
      computeUrl.value = null;
      volumeUrl.value = null;
      imageUrl.value = null;
      domainID.value = null;
      domainName.value = null;
      projectName.value = null;
      dnsNameservers.value = null;
      $v.value.$reset();
    };

    const save = async () => {
      $v.value.$touch();
      if ($v.value.$invalid) return false;
      const payload = {
        name: name.value,
        actual_name: actual_name.value,
        description: description.value,
        cpu_limit: parseInt(cpuLimit.value),
        // gpu_limit: parseInt(gpuLimit.value),
        ram_limit: parseInt(memoryLimit.value),
        root_disk: parseInt(rootDisk.value),
        data_disk: parseInt(dataDisk.value),
        snapshot_instance_vol: parseInt(snapshotInstanceVol.value),
        snapshot_storage_vol: parseInt(snapshotStorageVol.value),
        daily_backup_vol: parseInt(dailyBackupVol.value),
        custom_image_vol: parseInt(customImageVol.value),
        username: adminUsername.value,
        password: adminPassword.value,
        change_password: changePassword.value,
        project_id: projectID.value,
        admin_id: adminID.value,
        role_admin_id: roleAdminID.value,
        role_member_id: roleMemberID.value,
        external_network_id: externalNetworkID.value,
        load_balancer_url: loadBalancerUrl.value,
        auth_url: authUrl.value,
        alarm_url: alarmUrl.value,
        url: openstackUrl.value,
        metric_url: metricUrl.value,
        network_url: networkUrl.value,
        compute_url: computeUrl.value,
        volume_url: volumeUrl.value,
        image_url: imageUrl.value,
        domain_id: domainID.value,
        domain_name: domainName.value,
        project_name: projectName.value,
        dns_nameservers: dnsNameservers.value,
      };
      if (props.selectedRegion) payload.sourceName = props.selectedRegion.name;
      if (editMode.value) emit("update", payload);
      else emit("create", payload);
    };

    return {
      resetForm,
      editMode,
      dialog,
      save,
      isRegionLoading,
      $v,
      name,
      actual_name,
      description,
      memoryLimit,
      cpuLimit,
      // gpuLimit,
      rootDisk,
      dataDisk,
      snapshotInstanceVol,
      snapshotStorageVol,
      dailyBackupVol,
      customImageVol,
      adminUsername,
      adminPassword,
      changePassword,
      projectID,
      adminID,
      roleAdminID,
      roleMemberID,
      externalNetworkID,
      loadBalancerUrl,
      authUrl,
      alarmUrl,
      openstackUrl,
      metricUrl,
      networkUrl,
      computeUrl,
      volumeUrl,
      imageUrl,
      domainID,
      domainName,
      projectName,
      dnsNameservers,
    };
  },
};
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>
