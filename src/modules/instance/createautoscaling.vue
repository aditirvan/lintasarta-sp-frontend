<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg elevation-0">
        <v-container class="px-7 py-4" fluid>
          <v-row class="align-center mb-4">
            <v-col cols="12" md="12">
              <div class="headline font-weight-bold font--text">
                Add New Auto Scaling
              </div>
            </v-col>
          </v-row>

          <v-row v-if="error">
            <v-col>
              <p class="red--text">
                {{ error }}
              </p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <!-- row 1 (scaling group name & cooldown time) -->
              <v-row>
                <v-col cols="12" md="6">
                  <p class="font-weight-bold">Scaling Group Name</p>

                  <v-text-field
                    id="scalingGroupName"
                    maxlength="50"
                    v-model="scalingGroupName"
                    :error-messages="scalingGroupNameError"
                    outlined
                    placeholder="Enter Scaling Group Name"
                    @blur="onChangeHandler"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <p class="font-weight-bold">Default Cooldown Time (Second)</p>

                  <v-text-field
                    id="cooldownTime"
                    type="number"
                    v-model.number="cooldownTime"
                    :error-messages="cooldownTimeError"
                    outlined
                    placeholder="0"
                    @blur="onChangeHandler"
                    @keypress="isNumber($event)"
                  />
                </v-col>
              </v-row>

              <!-- row 2 (min & max instance) -->
              <v-row>
                <v-col cols="12" md="6">
                  <p class="font-weight-bold">Maximun Instance</p>

                  <v-text-field
                    id="maxInstance"
                    type="number"
                    v-model.number="maxInstance"
                    :error-messages="maxInstanceError"
                    outlined
                    placeholder="0"
                    @blur="onChangeHandler"
                    @keypress="isNumber($event)"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <p class="font-weight-bold">Minimum Instance</p>

                  <v-text-field
                    id="minInstance"
                    type="number"
                    v-model.number="minInstance"
                    :error-messages="minInstanceError"
                    outlined
                    placeholder="0"
                    @blur="onChangeHandler"
                    @keypress="isNumber($event)"
                  />
                </v-col>
              </v-row>

              <!-- row 3 -->
              <!-- <v-radio-group v-model="instanceConfigurationSource">
                <p class="font-weight-bold">
                  Instance Configuration Source
                </p>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-radio
                      label="Custom Scaling Configuration"
                      value="custom-scaling-configuration"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-radio label="Launch Template" value="launch-template" />
                  </v-col>
                </v-row>
              </v-radio-group> -->

              <!-- row 15 (network type) -->
              <v-radio-group v-model="networkType">
                <p class="font-weight-bold">
                  Network Type
                </p>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-radio label="VPC" value="VPC" />
                  </v-col>
                </v-row>
              </v-radio-group>

              <!-- row 4 (vpc id) -->
              <v-row>
                <v-col cols="12">
                  <!-- <v-col cols="12" md="6"> -->
                  <p class="font-weight-bold">VPC ID</p>

                  <v-select
                    id="vpcId"
                    placeholder="Select VPC Network"
                    outlined
                    v-model="vpcId"
                    :items="vpcIds"
                    @blur="onChangeHandler"
                    :error-messages="vpcIdError"
                  />
                </v-col>

                <!-- <v-col cols="12" md="6">
                  <p class="font-weight-bold">VPC Switch</p>

                  <v-select
                    placeholder="Select VPC Network"
                    v-model="vpcswitchselected"
                    :items="vpcSwitchs"
                    outlined
                  />
                </v-col> -->
              </v-row>

              <!-- row 5 (multizone scaling policy) -->
              <v-radio-group v-model="multiZoneScalingPolicy">
                <p class="font-weight-bold">Multizone Scaling Policy</p>

                <v-row>
                  <v-col cols="12" md="4">
                    <v-radio label="Priority" value="priority" />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-radio
                      label="Distribution Balancing"
                      value="distribution_balancing"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-radio label="Cost Optimazion" value="cost_optimazion" />
                  </v-col>
                </v-row>
              </v-radio-group>

              <!-- row 6 (reclaim mode) -->
              <v-radio-group v-model="reclaimMode">
                <p class="font-weight-bold">Reclaim Mode</p>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-radio label="Release Mode" value="release_mode" />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-radio
                      label="Shutdown and Reclaim Mode"
                      value="shutdown_and_reclaim_mode"
                    />
                  </v-col>
                </v-row>
              </v-radio-group>

              <!-- row 7 (slb & rds instance) -->
              <v-row>
                <v-col cols="12" md="6">
                  <p class="font-weight-bold">SLB Instances</p>

                  <v-select
                    id="slbInstance"
                    placeholder="Select SLB Instance"
                    outlined
                    v-model="slbInstance"
                    :items="slbInstances"
                    @blur="onChangeHandler"
                    :error-messages="slbInstanceError"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <p class="font-weight-bold">RDS Instances</p>

                  <v-select
                    placeholder="Select RDS Instance"
                    v-model="rdsInstance"
                    :items="rdsInstances"
                    outlined
                  />
                </v-col>
              </v-row>

              <!-- row 9 (plan) -->
              <v-row>
                <v-col cols="12" md="6" class="py-0">
                  <p><b>Choose a Plan</b></p>
                  <v-select
                    id="plan"
                    placeholder="Choose a Plan"
                    v-model="plan"
                    :items="plans"
                    outlined
                    :error-messages="planError"
                    @blur="onChangeHandler"
                  />
                </v-col>
              </v-row>

              <!-- row 10 (instance size) -->
              <v-row>
                <!-- desc -->
                <v-col v-if="plan" cols="12">
                  <p class="mb-0">
                    <span class="font-weight-bold mr-5">Instance Size</span>
                  </p>

                  <p style="margin: 20px 0">
                    If service usage has exceeded
                    <b class="primary--text">95%</b> in one month, payment will
                    be shifted from hourly to monthly
                  </p>
                </v-col>

                <v-col
                  style="margin-top: -40px"
                  class="d-flex flex-wrap"
                  id="SelectInstanceSize"
                >
                  <v-card
                    v-if="plan && !instances.length"
                    width="170"
                    height="100"
                    border-color="primary"
                    outlined
                    class="rounded-lg select-instance mb-5"
                    disabled
                  >
                    <v-card-text class="pb-0 text-center">
                      <p class="font-weight-bold mb-0">
                        There is no available flavor for selected plan
                      </p>
                    </v-card-text>
                  </v-card>

                  <!-- instance size slider -->
                  <v-sheet v-if="instances.length && plan" max-width="100%">
                    <!-- <v-slide-group
                      v-model="model" -->
                    <v-slide-group
                      class="pa-4"
                      active-class="success"
                      show-arrows
                    >
                      <v-card
                        width="170"
                        v-for="instance in instances"
                        :key="instance.id"
                        @click="selectInstance(instance.id)"
                        border-color="primary"
                        outlined
                        class="rounded-lg select-instance"
                        :class="{ selected: isSelected(instance.id) }"
                        style="margin-right: 20px"
                        :style="{
                          border: instanceError
                            ? '1px solid #eb5757 !important'
                            : '',
                        }"
                      >
                        <v-card-text class="m-0 p-0" style="padding: 20px">
                          <p class="fz-14" style="margin: 0; padding: 0">
                            <b>
                              {{ formatPrice(instance.price_per_month) }}/mo
                            </b>
                          </p>

                          <p class="fz-14" style="margin: 4px 0 0; padding: 0">
                            {{ formatPrice(instance.price_per_hours) }}/hour
                          </p>
                        </v-card-text>

                        <div
                          :style="{
                            height: '1px',
                            backgroundColor: instanceError
                              ? '#eb5757 !important'
                              : isSelected(instance.id)
                              ? '#2c94d2 !important'
                              : 'rgba(0, 0, 0, 0.12) !important',
                          }"
                        />

                        <v-card-text class="m-0 p-0" style="padding: 20px">
                          <p class="fz-12 m-0 p-0">
                            <b>{{ instance.vcpu }} CPU</b> /
                            {{ instance.ram }} GB Memory
                          </p>
                          <p v-if="instance.gpu" class="fz-12 m-0 p-0">
                            with <b>{{ instance.gpu }}</b> unit{{
                              instance.gpu > 1 ? "s" : ""
                            }}
                            Nvidia T4
                          </p>
                        </v-card-text>
                      </v-card>
                    </v-slide-group>
                  </v-sheet>

                  <span
                    class="mt-0 mb-5"
                    style="color: #eb5757"
                    v-if="instanceError"
                  >
                    Please select one instance size
                  </span>
                </v-col>
              </v-row>

              <!-- row 11 (instance name & region) -->
              <v-row>
                <v-col cols="12" md="6">
                  <p class="font-weight-bold">Instance Name</p>

                  <v-text-field
                    id="instanceName"
                    maxlength="50"
                    v-model="instanceName"
                    :error-messages="instanceNameError"
                    outlined
                    placeholder="Enter Instance Name"
                    @blur="onChangeHandler"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <!-- <v-col cols="12" md="6"> -->
                  <p class="font-weight-bold">Region</p>

                  <v-select
                    class="gray"
                    placeholder="Select Region"
                    v-model="regionselected"
                    :items="regions"
                    outlined
                    disabled
                    filled
                  />
                </v-col>
              </v-row>

              <!-- row 8 (os or instance) -->
              <v-row>
                <v-col class="d-flex flex-row">
                  <div
                    id="SelectOperatingSystem"
                    :style="{
                      border: `2px solid ${
                        selecttypeinstance == 'operatingsystem'
                          ? '#2C94D2'
                          : '#BDBDBD'
                      }`,
                      width: '233px',
                      cursor: 'pointer',
                    }"
                    @click="
                      () => {
                        selecttypeinstance = 'operatingsystem';
                      }
                    "
                    class="d-flex align-center flex-row px-4 rounded-lg"
                  >
                    <v-radio-group v-model="selecttypeinstance">
                      <v-radio value="operatingsystem"></v-radio>
                    </v-radio-group>
                    <p style="font-size: 16px" class="mb-0 font-weight-bold">
                      Operating System
                    </p>
                  </div>

                  <div style="width: 30px; height: auto" />

                  <div
                    :style="{
                      border: `2px solid ${
                        selecttypeinstance == 'instanceimage'
                          ? '#2C94D2'
                          : '#BDBDBD'
                      }`,
                      width: '233px',
                      cursor: 'pointer',
                    }"
                    @click="
                      () => {
                        selecttypeinstance = 'instanceimage';
                      }
                    "
                    class="d-flex align-center flex-row px-4 rounded-lg"
                  >
                    <v-radio-group v-model="selecttypeinstance">
                      <v-radio value="instanceimage"></v-radio>
                    </v-radio-group>
                    <p style="font-size: 16px" class="mb-0 font-weight-bold">
                      Instance Image
                    </p>
                  </div>
                </v-col>
              </v-row>

              <!-- row 14 (os field) -->
              <v-row v-if="selecttypeinstance == 'operatingsystem'">
                <v-col cols="12" class="pb-0">
                  <p class="font-weight-bold">Select Operating System</p>
                </v-col>

                <v-col sm="12" md="4" class="pt-0">
                  <v-select
                    id="os"
                    v-model="os"
                    outlined
                    :items="distinctOS"
                    placeholder="Select OS"
                    :error-messages="osError"
                  />
                </v-col>

                <v-col sm="12" md="4" class="pt-0">
                  <v-select
                    id="version"
                    v-model="version"
                    :disabled="!os"
                    outlined
                    :items="
                      images
                        .filter((x) => x.os_id === os)
                        .map((x) => {
                          return {
                            text: x.version_number,
                            value: x.version_number,
                          };
                        })
                    "
                    placeholder="Select Version"
                    :error-messages="versionError"
                  />
                </v-col>

                <v-col sm="12" md="4" class="pt-0">
                  <v-select
                    id="bitVersion"
                    v-model="bitVersion"
                    :disabled="!os || !version"
                    outlined
                    :items="
                      images
                        .filter(
                          (x) => x.os_id === os && x.version_number === version
                        )
                        .map((x) => {
                          return {
                            text: x.version.version_name,
                            value: x.id,
                          };
                        })
                    "
                    placeholder="Select Bit Version"
                    :error-messages="bitVersionError"
                  >
                  </v-select>
                </v-col>
              </v-row>

              <!-- row 14 (custom image field) -->
              <v-row v-if="selecttypeinstance == 'instanceimage'">
                <v-col cols="12" class="pb-0">
                  <p class="font-weight-bold">Instance Image</p>
                </v-col>

                <v-col sm="12" md="4" class="pt-0">
                  <v-select
                    id="os"
                    v-model="instanceImage"
                    outlined
                    :items="instanceImages"
                    placeholder="Choose Custom Image"
                    :error-messages="instanceImageError"
                  />
                </v-col>
              </v-row>

              <!-- row 12 (auth desc) -->
              <v-row>
                <v-col>
                  <p
                    style="font-size: 21px; margin-bottom: 10px"
                    class="font-weight-bold"
                  >
                    Authentication
                  </p>
                  <p class="accent--text">
                    The most commonly used settings are selected by default. You
                    can change them at any time by clicking “Edit Advanced
                    Settings”.
                  </p>
                </v-col>
              </v-row>

              <!-- row 13 (ssh or password) -->
              <v-row>
                <v-col cols="12" sm="6" md="4" class="d-flex flex-nowrap">
                  <v-card
                    @click="
                      () => {
                        authentication = 'ssh';
                      }
                    "
                    :style="{
                      border: `2px solid ${
                        authentication === 'ssh' ? '#2C94D2' : '#BDBDBD'
                      }`,
                    }"
                    class="rounded-lg d-flex flex-grow-1"
                    flat
                    outlined
                  >
                    <v-card-title class="d-flex flex-nowrap">
                      <div>
                        <v-radio-group
                          hide-details
                          style="margin-top: -10px"
                          v-model="authentication"
                        >
                          <v-radio class="authentication" value="ssh" />
                        </v-radio-group>
                      </div>
                      <div class="ml-2">
                        <p
                          style="font-size: 21px"
                          class="my-0 font-weight-bold"
                        >
                          SSH Keys
                        </p>
                        <p class="my-0 accent--text" style="font-size: 12px">
                          A more secure authentication method
                        </p>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="4" class="d-flex flex-nowrap">
                  <v-card
                    @click="
                      () => {
                        authentication = 'password';
                      }
                    "
                    :style="{
                      border: `2px solid ${
                        authentication == 'password' ? '#2C94D2' : '#BDBDBD'
                      }`,
                    }"
                    class="rounded-lg d-flex flex-grow-1"
                    flat
                    outlined
                  >
                    <v-card-title class="d-flex flex-nowrap">
                      <div>
                        <v-radio-group
                          hide-details
                          style="margin-top: -10px"
                          v-model="authentication"
                        >
                          <v-radio
                            class="authentication"
                            value="password"
                          ></v-radio>
                        </v-radio-group>
                      </div>
                      <div class="ml-2">
                        <p
                          style="font-size: 21px"
                          class="my-0 font-weight-bold"
                        >
                          Password
                        </p>
                        <p class="my-0 accent--text" style="font-size: 12px">
                          Create a root password to access VM (less secure)
                        </p>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>

              <!-- choose ssh key -->
              <v-row style="position: relative">
                <transition name="slide-fade">
                  <v-col
                    cols="12"
                    md="12"
                    v-show="authentication == 'ssh'"
                    class="ssh"
                  >
                    <v-card class="rounded-lg d-flex flex-grow-1" flat outlined>
                      <v-card-title class="d-flex flex-nowrap">
                        <div class="ml-2">
                          <div class="d-flex mb-0">
                            <p class="font-weight-bold">Choose your SSH Keys</p>
                          </div>

                          <div class="d-flex flex-wrap">
                            <v-checkbox
                              v-model="ssh"
                              v-for="sshkey in sshkeys"
                              :key="sshkey.id"
                              :value="sshkey.id"
                              class="m-0 mr-5"
                              :label="sshkey.name"
                              :error-messages="sshError"
                            />
                          </div>

                          <div class="d-flex">
                            <v-btn
                              depressed
                              id="NewKey"
                              height="45"
                              @click="dialogssh = true"
                              class="secondary"
                            >
                              <span style="font-size: 16px">New SSH Key</span>
                            </v-btn>
                          </div>
                        </div>
                      </v-card-title>
                    </v-card>
                  </v-col>
                </transition>

                <transition name="slide-fade">
                  <v-col
                    cols="12"
                    v-show="authentication === 'password'"
                    class="password"
                  >
                    <v-card flat outlined class="rounded-lg">
                      <v-card-text class="pb-0">
                        <span class="font-weight-bold" style="font-size: 16px">
                          Create root password
                        </span>
                      </v-card-text>
                      <v-card-text>
                        <v-text-field
                          id="password"
                          type="password"
                          :error-messages="passwordError"
                          placeholder="Type your password"
                          outlined
                          v-model="password"
                        />

                        <p class="accent--text">
                          <v-icon color="primary" left>
                            mdi-alert-circle-outline
                          </v-icon>
                          You will not be sent an email containing the Instance
                          details or password. Please store your password
                          securely.
                        </p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </transition>
              </v-row>

              <!-- buttons -->
              <v-row class="mt-5">
                <v-col cols="12" md="6">
                  <v-btn
                    depressed
                    style="background-color: #a5b3bf !important"
                    block
                    height="58"
                    class="primary"
                    to="/instance/auto-scaling"
                    exact
                  >
                    <span style="font-size: 16px">Cancel</span>
                  </v-btn>
                </v-col>

                <v-col cols="12" md="6">
                  <v-btn
                    depressed
                    @click="submit"
                    block
                    height="58"
                    class="secondary"
                  >
                    <span style="font-size: 16px">Create Auto Scaling</span>
                  </v-btn>
                </v-col>
              </v-row>

              <!-- select ssh -->
              <dialogcreatessh
                v-model="dialogssh"
                @close="
                  () => {
                    dialogssh = false;
                  }
                "
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import dialogcreatessh from "./dialogcreatessh.vue";

export default {
  components: {
    dialogcreatessh,
  },
  data() {
    return {
      dialogssh: false,
      loading: false,
      error: "",
      scalingGroupName: "",
      scalingGroupNameError: "",
      // cooldown time
      cooldownTime: 0,
      cooldownTimeError: "",
      // max instance
      maxInstance: 0,
      maxInstanceError: "",
      // min instance
      minInstance: 0,
      minInstanceError: "",
      // instanceConfigurationSource: "custom-scaling-configuration",
      networkType: "VPC",
      vpcIdError: "",
      vpcId: "",
      vpcIds: [],
      // vpcswitchselected: { text: "switch2", value: "switch2" },
      // vpcSwitchs: [
      //   { text: "switch1", value: "switch1" },
      //   { text: "switch2", value: "switch2" },
      // ],
      multiZoneScalingPolicy: "priority",
      reclaimMode: "release_mode",
      // slb instance
      slbInstanceError: "",
      slbInstance: "",
      slbInstances: [],
      // rds instance
      rdsInstance: "",
      rdsInstances: [],
      // plan
      plan: "",
      planError: "",
      plans: [],
      // instance sizes
      instance: null,
      instances: [],
      instanceError: false,
      // instance name
      instanceName: "",
      instanceNameError: "",
      // region
      regionselected: "TKP",
      regions: [{ text: "TKP", value: "TKP" }],
      // os
      images: [],
      selecttypeinstance: "operatingsystem",
      os: "",
      osError: "",
      instanceImage: "",
      instanceImageError: "",
      instanceImages: [],
      // distinctOS: [],
      version: "",
      versionError: "",
      bitVersion: "",
      bitVersionError: "",
      // auth
      authentication: "password",
      password: "",
      passwordError: "",
      ssh: "",
      sshError: "",
      sshkeys: [],
    };
  },
  computed: {
    userId() {
      return JSON.parse(localstorage.getItem("currentOrg")).user_id;
    },
    projectid() {
      return JSON.parse(localstorage.getItem("currentProj")).id;
    },
    distinctOS() {
      let osIds = [];
      return this.images
        .filter((img) => {
          if (!osIds.includes(img.os_id)) {
            osIds.push(img.os_id);
            return true;
          }
          return false;
        })
        .map((x) => {
          return {
            text: x.os.name,
            value: x.os.id,
          };
        });
    },
  },
  methods: {
    async submit() {
      this.error = "";

      // if fields empty
      if (
        !this.scalingGroupName ||
        !this.cooldownTime ||
        !this.maxInstance ||
        !this.minInstance ||
        !this.plan ||
        !this.instance ||
        !this.slbInstance ||
        !this.vpcId ||
        (this.authentication === "password" && !this.password) ||
        (this.authentication === "ssh" && !this.ssh) ||
        (this.selecttypeinstance === "operatingsystem" && !this.os) ||
        (this.selecttypeinstance === "operatingsystem" && !this.version) ||
        (this.selecttypeinstance === "operatingsystem" && !this.bitVersion) ||
        (this.selecttypeinstance === "instanceimage" && !this.instanceImage)
      ) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.error = "Ada field yang belum diisi";

        if (!this.scalingGroupName)
          this.scalingGroupNameError = "Value is required";
        if (this.scalingGroupName.length < 5)
          this.scalingGroupNameError = "This field should be at least 5 long";
        if (!this.cooldownTime) this.cooldownTimeError = "Value is required";
        if (!this.maxInstance) this.maxInstanceError = "Value is required";
        if (!this.minInstance) this.minInstanceError = "Value is required";
        if (!this.plan) this.planError = "Value is required";
        if (!this.instance) this.instanceError = true;
        if (!this.slbInstance) this.slbInstanceError = "Value is required";
        if (!this.vpcId) this.vpcIdError = "Value is required";
        if (this.authentication === "password" && !this.password)
          this.passwordError = "Value is required";
        if (this.authentication === "ssh" && !this.ssh)
          this.sshError = "Please select an ssh key";
        if (this.selecttypeinstance === "operatingsystem" && !this.os)
          this.osError = "Value is required";
        if (this.selecttypeinstance === "operatingsystem" && !this.version)
          this.versionError = "Value is required";
        if (this.selecttypeinstance === "operatingsystem" && !this.bitVersion)
          this.bitVersionError = "Value is required";
        if (this.selecttypeinstance === "instanceimage" && !this.instanceImage)
          this.instanceImageError = "Value is required";
      }

      // submit form (POST)
      else {
        // console.log("submit createautoscaling succeed");
        this.loading = true;

        try {
          const res = await api.POST("/user/autoscaling/create", {
            autoscaling_name: this.scalingGroupName,
            cooldown_time: this.cooldownTime,
            maximum_instance: this.maxInstance,
            minimum_instance: this.minInstance,
            network_type: this.networkType,
            vpc_id: this.vpcId,
            // multizone_scaling_policy: "priority",
            // reclaim_mode: "release_mode",
            multizone_scaling_policy: this.multiZoneScalingPolicy,
            reclaim_mode: this.reclaimMode,
            // slb_instance_id: "e097a93f-1901-4470-b1b3-b3a7718e35e6",
            // rds_instance_id: "621af9d9-c620-4f6b-9be3-dd83069a9459",
            slb_instance_id: this.slbInstance,
            rds_instance_id: "",
            autoscaling_configuration: 0,
            instance_name: this.instanceName,
            region: this.regionselected,
            tags: "",
            ssh_key_id:
              this.authentication === "ssh" && this.ssh ? [this.ssh] : [],
            project_id: this.projectid,
            image_os_id:
              this.selecttypeinstance === "operatingsystem"
                ? this.bitVersion
                : "",
            image_id:
              this.selecttypeinstance === "instanceimage"
                ? this.instanceImage
                : "",
            package_instance_id: this.instance,
            password_manual: this.password,
          });

          console.log(res.data, "res.data submit autoscaling");
        } catch {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "Sorry, an error occurred while submitting auto-scaling form"
          );
        }

        this.loading = false;
      }
    },
    onChangeHandler(e) {
      if (!this[e.target.id] && !this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "Value is required";
      }

      if (this[e.target.id] && this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "";
      }
    },
    // number input
    isNumber(e) {
      const charCode = e.which ? e.which : e.keyCode;

      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    async fetchPlans() {
      try {
        const res = await api.GET("/flavor/instance/type");
        this.plans = res.data.map((plan) => {
          return {
            text: plan.name,
            value: plan.id,
          };
        });
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Plans"
        );
      }
    },
    async fetchInstances() {
      try {
        const res = await api.GET("/flavor/instance?type_id=" + this.plan);
        this.instances = res.data.instance;
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Instance List"
        );
      }
    },
    async fetchVPCIds() {
      try {
        const res = await api.GET("/network/vpc/project/" + this.projectid);
        // console.log("res.data fetchVPCIds", res.data);
        if (res.data.length) {
          this.vpcIds = res.data.map((d) => {
            return {
              value: d.id,
              text: d.description,
            };
          });
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying VPC Ids"
        );
      }
    },
    async fetchSLBInstances() {
      try {
        const res = await api.GET(
          "/service/project/" + this.projectid + "/load-balancer"
        );
        if (res.data.length) {
          this.slbInstances = res.data.map((d) => {
            return {
              value: d.id,
              text: d.name,
            };
          });
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying SLB Instances"
        );
      }
    },
    async fetchImages() {
      try {
        const res = await api.GET("/flavor/image?limit=999");
        this.images = res.data.image;
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying operating systems"
        );
      }
    },
    isSelected(id) {
      return id === this.instance;
    },
    formatPrice(num) {
      return num.toLocaleString("id-ID");
    },
    selectInstance(id) {
      this.instance = id;
    },
    async fetchSSHKeys() {
      try {
        const res = await api.GET("/user/keypair/user/" + this.userId);
        // this.images = res.data.image;
        this.sshkeys = res.data;
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying ssh keys"
        );
      }
    },
    async fetchInstanceImages() {
      try {
        const endpoint = `/service/project/${this.projectid}/image/vm-snapshot-list`
        // const res = await api.GET("/user/images?pro_id=" + this.projectid);
        const res = await api.GET(endpoint);
        if (res.data.length) {
          const newArr = res.data
            .filter((x) => {
              if (x.is_snapshot && x.is_upload_success) return true;
              else if (x.is_backup) return true;
              else if (!x.is_backup && x.is_upload_success) return true;
              return false;
            })
            .filter((x) => {
              if (x.is_snapshot || x.is_backup) {
                if (x.openstack_snapshot_id || x.openstack_backup_id)
                  return true;
                else return false;
              }
              return true;
            })
            .sort((x) => (x.is_snapshot ? 1 : -1))
            .map((x) => {
              return {
                text: x.is_snapshot
                  ? `(Snapshot) ${x.name}`
                  : x.is_backup
                  ? `(Backup) ${x.name}`
                  : `${x.name} (version ${x.version})`,
                value: `${x.id}`,
              };
            });

          this.instanceImages = newArr;
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying instance images"
        );
      }

      // return customImages
      //   .filter((x) =>  {
      //     if (x.is_snapshot && x.is_upload_success) return true
      //     else if (x.is_backup) return true
      //     else if (!x.is_backup && x.is_upload_success) return true
      //     return false
      //   })
      //   .filter((x) => {
      //     if(x.is_snapshot || x.is_backup){
      //       if(x.openstack_snapshot_id || x.openstack_backup_id) return true
      //       else return false
      //     }
      //     return true
      //   })
      //   .sort((x) => (x.is_snapshot ? 1 : -1))
      //   .map((x) => {
      //     return {
      //       text: x.is_snapshot
      //         ? `(Snapshot) ${x.name}`
      //         : x.is_backup ? `(Backup) ${x.name}`
      //         : `${x.name} (version ${x.version})`,
      //       value: `${x.id}`,
      //     };
      //   });
    },
  },
  watch: {
    scalingGroupName() {
      this.onChangeHandler({ target: { id: "scalingGroupName" } });
    },
    cooldownTime() {
      this.onChangeHandler({ target: { id: "cooldownTime" } });
    },
    maxInstance() {
      this.onChangeHandler({ target: { id: "maxInstance" } });
    },
    minInstance() {
      this.onChangeHandler({ target: { id: "minInstance" } });
    },
    plan() {
      this.onChangeHandler({ target: { id: "plan" } });
      if (this.plan) {
        this.fetchInstances(); // use fetchPaginatedInstance instead
      }
    },
    instance() {
      this.onChangeHandler({ target: { id: "instance" } });
    },
    instanceName() {
      this.onChangeHandler({ target: { id: "instanceName" } });
    },
    os() {
      this.onChangeHandler({ target: { id: "os" } });
    },
    instanceImage() {
      this.onChangeHandler({ target: { id: "instanceImage" } });
    },
    version() {
      this.onChangeHandler({ target: { id: "version" } });
    },
    bitVersion() {
      this.onChangeHandler({ target: { id: "bitVersion" } });
    },
    slbInstance() {
      this.onChangeHandler({ target: { id: "slbInstance" } });
    },
    vpcId() {
      this.onChangeHandler({ target: { id: "vpcId" } });
    },
    ssh() {
      this.onChangeHandler({ target: { id: "ssh" } });
    },
    password() {
      this.onChangeHandler({ target: { id: "password" } });
    },
  },
  mounted() {
    this.fetchPlans();
    this.fetchVPCIds();
    this.fetchSLBInstances();
    this.fetchImages();
    this.fetchSSHKeys();
    this.fetchInstanceImages();
  },
};
</script>

<style scoped lang="scss">
.select-instance,
.select-storage {
  cursor: pointer;

  &.selected {
    border-color: #2c94d2;

    .v-divider {
      border-color: #2c94d2;
    }
  }
}
</style>
