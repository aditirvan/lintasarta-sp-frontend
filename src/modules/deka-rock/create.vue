<template>
  <v-container fluid>
    <v-row>
      <v-col lg="12" md="12" cols="12">
        <v-card flat class="pa-3 rounded-lg">
          <v-card-text>
            <v-row>
              <v-col class="d-flex flex-row align-center">
                <p class="font-weight-bold fz-21">Create Deka ROCK</p>
                <v-spacer />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="pt-0 pb-0">
                <p class="font-weight-bold">Name</p>
                <v-text-field
                  outlined
                  single-line
                  placeholder="Enter Dekarock Cluster Name"
                  v-model="name"
                  @blur="$v.name.$touch()"
                  :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="pt-0 pb-0">
                <p class="font-weight-bold">Version</p>
                <v-select
                  :items="listVersion"
                  item-text="version"
                  item-value="version"
                  v-model="version"
                  placeholder="Choose Version"
                  outlined
                  @blur="$v.version.$touch()"
                  :error-messages="$v.version.$errors.length ? $v.version.$errors[0].$message : ''"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="pt-0 pb-0">
                <p class="font-weight-bold">Zone</p>
                <v-select
                  :items="zoneByProject"
                  item-text="name"
                  item-value="name"
                  v-model="zone"
                  placeholder="Choose Zone"
                  outlined
                  @blur="$v.zone.$touch()"
                  :error-messages="$v.zone.$errors.length ? $v.zone.$errors[0].$message : ''"
                ></v-select>
              </v-col>
            </v-row>

            <v-row v-if="!ready">
              <v-row>
                <v-col cols="4" offset="4">
                  Loading the flavor list ...
                  <v-progress-linear color="blue darken-4 accent-4" indeterminate rounded height="6"></v-progress-linear>
                </v-col>
              </v-row>
            </v-row>
            <v-row v-else-if="!listFlavorDekaRock || listFlavorDekaRock.length == 0">
              <v-col class="pb-0" cols="12">
                <p>
                  <span class="font-weight-bold mb-0">Select Flavor</span>
                </p>
                <v-card width="170" border-color="primary" outlined class="rounded-lg select-instance mb-4">
                  <v-card-text class="p-0 text-center">
                    <p class="mb-0">Flavors is empty, tell your system administrator</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col class="pb-0" cols="12">
                <p>
                  <span class="font-weight-bold mb-0">Select Flavor</span>
                </p>
              </v-col>
              <v-slide-group class="py-4 pt-0" show-arrows="always" mandatory>
                <template v-slot:prev>
                  <span @click="prevFlavor()" aria-hidden="true" class="v-icon notranslate v-icon--disabled theme--light">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg">
                      <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
                    </svg>
                  </span>
                </template>
                <template v-slot:next>
                  <span @click="nextFlavor()" aria-hidden="true" class="v-icon notranslate theme--light">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                    </svg>
                  </span>
                </template>
                <v-col class="d-flex pt-0 flex-wrap pb-0">
                  <v-card
                    v-for="flavor in listFlavorDekaRock"
                    :key="flavor.id"
                    width="170"
                    border-color="primary"
                    outlined
                    class="rounded-lg select-instance mb-4"
                    @click="
                      () => {
                        selectedFlavor = flavor;
                      }
                    "
                    :class="selectedFlavor.id == flavor.id ? 'selected' : ''"
                    style="text-align: center; margin-right: 10px"
                    :style="{
                      border: $v.selectedFlavor.$errors.length ? '1px solid #eb5757 !important' : '',
                    }"
                  >
                    <!-- :style="selectedFlavor.id != flavor.id ? 'height: 190px;': ''" -->
                    <v-card-text class="pb-0 pt-5">
                      <div>
                        <p class="font-weight-bold">
                          {{ flavor.type_name }}
                        </p>
                      </div>
                    </v-card-text>
                    <v-divider />
                    <v-card-text class="d-flex flavor-card">
                      <p class="mb-0">{{ flavor.vcpu }} vCPU / {{ flavor.ram }} GB RAM</p>
                    </v-card-text>
                    <!-- <v-divider v-if="selectedFlavor.id == flavor.id" /> -->
                    <v-card-text v-if="selectedFlavor.id == flavor.id && false">
                      <!-- dont show this -->
                      <p class="mb-0">{{ total_worker }} Worker</p>
                      <v-slider direction="vertical" v-model="total_worker" :min="2" :max="20" style="height: 15px"></v-slider>
                    </v-card-text>
                    <!-- <v-divider /> -->
                    <!-- <v-card-text class="pa-0" v-if="selectedFlavor.id == flavor.id">
                      <v-text-field class="px-4 pt-2 input-center" readonly @keydown="(ev) => (disk_size = addGBText(ev, disk_size))" max="100" value="100 GB">
                      </v-text-field>
                    </v-card-text>
                    <v-card-text class="pa-0" v-else>
                      <v-text-field disabled value="100 GB" class="px-4 pt-2 input-center" max="100"> </v-text-field>
                    </v-card-text> -->
                  </v-card>
                </v-col>
              </v-slide-group>
            </v-row>
            <v-row>
              <v-col cols="6" class="pt-0 pb-0"
                ><p class="font-weight-bold mb-0">Subnet</p>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="subnet"
                      placeholder="IP Network"
                      outlined
                      @keypress="numbersOnly($event)"
                      @blur="$v.subnet.$touch()"
                      :error-messages="$v.subnet.$errors.length ? $v.subnet.$errors[0].$message : ''"
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col>
                    <v-text-field
                      prefix="/"
                      v-model="subnetPrefix"
                      placeholder="IP Prefix (Min: 16, Max: 24)"
                      outlined
                      @keypress="numbersOnly($event)"
                      @blur="$v.subnetPrefix.$touch()"
                      :error-messages="$v.subnetPrefix.$errors.length ? `${$v.subnetPrefix.$errors[0].$message} (Min: 16, Max: 24)` : ''"
                    ></v-text-field>
                  </v-col>  -->
                  <v-col>
                    <!-- <v-text-field
                    v-model="subnetPrefix"
                    placeholder="IP Prefix"
                    outlined
                    type="number"
                    prefix="/"
                    @blur="$v.subnetPrefix.$touch()"
                    :error-messages="$v.subnetPrefix.$errors.length ? $v.subnetPrefix.$errors[0].$message : ''">
                    </v-text-field> -->

                    <v-select
                      v-model="subnetPrefix"
                      placeholder="IP Prefix"
                      :items="listPrefix"
                      outlined
                      prefix="/"
                      @blur="$v.subnetPrefix.$touch()"
                      :error-messages="$v.subnetPrefix.$errors.length ? $v.subnetPrefix.$errors[0].$message : ''"
                    ></v-select>
                  </v-col>
                </v-row></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="6" class="pt-0 pb-0">
                <p class="font-weight-bold">Description</p>
                <v-textarea
                  id="Description"
                  placeholder="Enter Description"
                  outlined
                  single-line
                  v-model="description"
                  @blur="$v.description.$touch()"
                  :error-messages="$v.description.$errors.length ? $v.description.$errors[0].$message : ''"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0">
                <div class="d-flex align-center">
                  <v-checkbox v-model="agree" label="By Creating Deka Rock You Agree To The"> </v-checkbox>
                  <span class="text-decoration-underline primary--text ml-2 fz-16 mb-1 font-weight-bold cursor-pointer" @click="getEula()"
                    >Terms of Service</span
                  >
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="pb-0">
                <v-btn height="50" width="40%" class="mr-2" depressed color="accent" to="/deka-rock" exact> Cancel </v-btn>
                <v-btn v-if="role.toLowerCase() == 'superadmin'" depressed height="50" width="50%" class="primary flex-grow-1" @click="submit">Create</v-btn>
                <v-btn v-else-if="statusCheckEula" depressed height="50" width="50%" class="primary flex-grow-1" @click="submit">Create</v-btn>
                <v-btn v-else depressed height="50" width="50%" class="primary flex-grow-1" :disabled="!ready || !agree" @click="submit">Create</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { required, minLength, minValue } from "@vuelidate/validators";
import { DEKAROCK, DEKAROCKBILLING } from "@/modules/deka-rock/namespace";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { addGBText, removeGBText } from "@/lib/formatter";
import { parseInt, toInteger } from "lodash";
import { MANAGEZONE } from "../superadmin-manageflavors/namespace";
import { INSTANCE } from "../instance/namespace.ts";

export default {
  setup(props, context) {
    const role = ref(localStorage.getItem("role"));
    const agree = ref(false);
    const ready = ref(false);
    const name = ref("");
    const total_worker = ref(0);
    const username = ref("");
    const host = ref("");
    const description = ref("");
    const selectedFlavor = ref("");
    const disk_size = ref("");
    const version = ref("");
    const zone = ref("");
    const subnetPrefix = ref("");
    const subnet = ref("");
    const listPrefix = ref([16, 24]);

    const { getDekarockFlavors, getVersion } = useNamespacedActions(DEKAROCK, ["getDekarockFlavors", "getVersion"]);
    const { flavor_list, flavor_pagination, listVersion } = useNamespacedState(DEKAROCK, ["flavor_list", "flavor_pagination", "listVersion"]);

    const { currentProj } = useNamespacedState("SUPERADMIN", ["currentProj"]);
    const { createOpenshift } = useNamespacedActions(DEKAROCK, ["createOpenshift"]);
    const { fetchZoneByProject } = useNamespacedActions(MANAGEZONE, ["fetchZoneByProject"]);
    const { zoneByProject } = useNamespacedState(MANAGEZONE, ["zoneByProject"]);
    const { getFlavorDekaRock } = useNamespacedActions(DEKAROCKBILLING, ["getFlavorDekaRock"]);
    const { listFlavorDekaRock } = useNamespacedGetters(DEKAROCKBILLING, ["listFlavorDekaRock"]);
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);

    async function submit() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      // context.root.$store.dispatch("HOMEPAGE/showProcessToastWS", `Creating the Deka Rock cluster`, { root: true });
      let res = await createOpenshift({
        project_id: currentProj.value.id,
        item_id: selectedFlavor.value.id,
        flavor_id: selectedFlavor.value.flavor_id,
        flavor_type: selectedFlavor.value.type_name,
        name: name.value,
        version: version.value,
        zone: zone.value,
        description: description.value,
        network_ip: subnet.value,
        prefix_subnet: parseInt(subnetPrefix.value),
      });

      if (res.status == 200) {
        if (!statusCheckEula.value && role.value.toLowerCase() !== 'superadmin') {
          const payload = {
            form_name: "Form Create Deka Rock",
            project_id: localStorage.getItem("projectid"),
          };
          validateEula(payload);
        }
        this.$router.push("/deka-rock");
      }
    }

    async function nextFlavor() {
      console.log("hello");
    }

    async function prevFlavor() {
      console.log("prev data");
    }

    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        description: { required },
        version: { required },
        zone: { required },
        subnetPrefix: { required, minValue: minValue(1) },
        subnet: { required },
        selectedFlavor: { required },
      },
      { name, description, version, zone, subnetPrefix, subnet, selectedFlavor }
    );

    async function getEula() {
      const routeData = this.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create Deka Rock" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    }

    const numbersOnly = (evt) => {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    };

    onMounted(async () => {
      const params1 = new URLSearchParams();
      params1.append("project_id", localStorage.getItem("projectid"));
      params1.append("form_name", "Form Create Deka Rock");
      checkEula(params1);
      // await getDekarockFlavors();
      await getVersion();
      const params = { project_id: currentProj.value.id };
      await fetchZoneByProject(params);

      const url_params = new URLSearchParams();
      url_params.append("project_id", currentProj.value.id);
      await getFlavorDekaRock(url_params);
      ready.value = true;
    });

    watch(agree, (val) => {
      if (listFlavorDekaRock.length == 0) {
        agree.value = false;
        return;
      }
    });

    return {
      submit,
      $v,
      selectedFlavor,
      disk_size,
      // flavor_list,
      listFlavorDekaRock,
      // listFlavorDekaRock,
      nextFlavor,
      prevFlavor,
      toIDRWithDotFormat,
      addGBText,
      name,
      total_worker,
      description,
      host,
      username,
      ready,
      agree,
      getEula,
      version,
      listVersion,
      zoneByProject,
      zone,
      subnetPrefix,
      subnet,
      numbersOnly,
      listPrefix,
      statusCheckEula,
      role,
    };
  },
};
</script>

<style scoped lang="scss">
.selected {
  border-color: #2c94d2;
}
::v-deep .input-center.theme--light.v-input input {
  text-align: center;
}
::v-deep .theme--light.v-input--is-disabled input {
  text-align: center;
}
::v-deep .v-text-field__details {
  position: static;
}
</style>
