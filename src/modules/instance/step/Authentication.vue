<template>
  <div>
    <v-card-text class="pt-0">
      <v-row>
        <v-col>
          <p class="font-weight-bold fz-21">Authentication</p>
          <p class="accent--text">
            The most commonly used settings are selected by default. You can change them at any time by clicking “Edit Advanced Settings”.
          </p>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pt-0 pb-0">
      <v-row>
        <v-col cols="12" sm="6" md="6" class="d-flex flex-nowrap">
          <v-card
            @click="
              () => {
                authentication = 'ssh';
              }
            "
            class="rounded-lg d-flex flex-grow-1"
            flat
            outlined
            :style="{
              border: $v.authentication.$errors.length ? '2px solid #eb5757 !important' : `2px solid ${authentication == 'ssh' ? '#2C94D2' : '#BDBDBD'}`,
            }"
          >
            <v-card-title class="d-flex flex-nowrap">
              <div class="align-self-lg-start">
                <v-radio-group
                  hide-details
                  v-model="authentication"
                  :error-messages="$v.authentication.$errors.length ? $v.authentication.$errors[0].$message : ''"
                >
                  <v-radio class="authentication" value="ssh"></v-radio>
                </v-radio-group>
              </div>
              <div class="ml-2">
                <p class="my-0 font-weight-bold fz-21">SSH Keys</p>
                <p class="my-0 accent--text fz-12">A more secure authentication method</p>
              </div>
            </v-card-title>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="6" class="d-flex flex-nowrap">
          <v-card
            @click="
              () => {
                authentication = 'password';
              }
            "
            class="rounded-lg d-flex flex-grow-1"
            flat
            outlined
            :style="{
              border: $v.authentication.$errors.length ? '2px solid #eb5757 !important' : `2px solid ${authentication == 'password' ? '#2C94D2' : '#BDBDBD'}`,
            }"
          >
            <v-card-title class="d-flex flex-nowrap">
              <div class="align-self-lg-start">
                <v-radio-group
                  hide-details
                  v-model="authentication"
                  :error-messages="$v.authentication.$errors.length ? $v.authentication.$errors[0].$message : ''"
                >
                  <v-radio class="authentication" value="password"></v-radio>
                </v-radio-group>
              </div>
              <div class="ml-2">
                <p class="my-0 font-weight-bold fz-21">Password</p>
                <p class="my-0 accent--text fz-12">Create a root password to access VM (less secure)</p>
              </div>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="$v.authentication.$errors.length" class="ml-3 red--text pt-0 pb-0">You are required to choose one authentication method</v-card-text>
    <v-card-text>
      <v-row style="position: relative">
        <transition name="slide-fade">
          <v-col cols="12" md="12" v-show="authentication == 'ssh'" class="ssh" id="col_ssh">
            <v-card class="rounded-lg d-flex flex-grow-1" flat outlined>
              <v-card-title class="d-flex flex-nowrap">
                <div class="ml-2">
                  <div class="d-flex mb-0">
                    <p class="font-weight-bold">Choose your SSH Keys</p>
                  </div>

                  <div class="d-flex flex-wrap">
                    <div class="d-flex flex-wrap mr-5" v-for="sshkey in sshkeys" :key="sshkey.id">
                      <v-checkbox v-model="selectedssh" :key="sshkey.id" :value="sshkey.id" class="m-0 mr-0" :label="sshkey.name"></v-checkbox>
                      <v-icon
                        color="red"
                        @click="
                          () => {
                            keyid = sshkey.id;
                            openDialogDeleteSsh = true;
                          }
                        "
                      >
                      </v-icon>
                      <v-icon
                        class="mb-2"
                        color="secondary"
                        @click="
                          () => {
                            sshkeyselected = sshkey;
                            dialogupdate = true;
                          }
                        "
                        >mdi-pencil-box-outline
                      </v-icon>
                    </div>
                  </div>
                  <div class="w-100">
                    <small class="error--text" v-if="errorsshkey"> SSH Key must be chosen </small>
                  </div>
                  <div class="d-flex">
                    <v-btn depressed id="NewKey" height="45" @click="dialogssh = true" color="secondary" outlined>
                      <span class="fz-16">Add New SSH Key</span>
                    </v-btn>
                  </div>
                </div>
              </v-card-title>
            </v-card>
          </v-col>
        </transition>
        <transition name="slide-fade">
          <v-col cols="12" v-show="authentication == 'password'" class="password" id="col_password">
            <v-card flat outlined class="rounded-lg">
              <v-card-text class="pb-0">
                <span class="font-weight-bold fz-16">Create root password</span>
              </v-card-text>
              <v-card-text>
                <v-text-field
                  id="createpassword"
                  :error-messages="$v.password.$errors.length ? $v.password.$errors[0].$message : ''"
                  placeholder="Type your password"
                  outlined
                  v-model="password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                ></v-text-field>
                <p class="accent--text">
                  <v-icon color="primary" left>mdi-alert-circle-outline </v-icon>
                  You will not be sent an email containing the Instance details or password. Please store your password securely.
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </transition>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula">
          <div class="d-flex align-center">
            <v-checkbox v-model="agree" label="By Creating Instance You Agree To The"> </v-checkbox>
            <span class="text-decoration-underline primary--text ml-2 fz-16 mb-2 font-weight-bold cursor-pointer" @click="getEula()">Terms of Service</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="mt-4">
      <v-row class="d-flex justify-end">
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="fz-16" color="secondary" block outlined height="45" @click="prev()"> Previous </v-btn>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn :disabled="isLoading" class="white--text fz-16" color="secondary" block height="45" @click="submit()" v-if="role.toLowerCase() == 'superadmin'">
            Submit
          </v-btn>
          <v-btn class="white--text fz-16" color="secondary" block height="45" @click="displayInstanceDialog()" :disabled="isLoading" v-else-if="statusCheckEula">
            Submit
          </v-btn>
          <v-btn class="white--text fz-16" color="secondary" block height="45" @click="displayInstanceDialog()" :disabled="!agree || isLoading" v-else>
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <dialogcreatessh
      v-model="dialogssh"
      @close="
        () => {
          dialogssh = false;
        }
      "
    />
    <dialogupdatessh
      v-if="dialogupdate"
      :sshselected="sshkeyselected"
      v-model="dialogupdate"
      @close="
        () => {
          dialogupdate = false;
        }
      "
    />
    <dialogNewServiceAvailability
      v-if="instanceDialog"
      :onClose="
        () => {
          instanceDialog = false;
        }
      "
      serviceName="Instance"
      actionName="Create Instance"
      :onAvailable="submit"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import { helpers, requiredIf, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import INSTANCE from "../namespace";
import dialogcreatessh from "../dialogcreatessh.vue";
import dialogupdatessh from "../dialogupdatessh.vue";
import dialogNewServiceAvailability from "../../project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import { isLimitError, createLimitErrorMsg } from "@/lib/validator";
export default {
  components: {
    dialogcreatessh,
    dialogupdatessh,
    dialogNewServiceAvailability,
  },
  props: {
    step: {
      type: Number,
      default: 0,
    },
    dataDetails: {
      type: Object,
      default: () => {},
    },
    dataVolume: {
      type: Object,
      default: () => {},
    },
    dataNetwork: {
      type: Object,
      default: () => {},
    },
    dataSecurity: {
      type: Object,
      default: () => {},
    },
    // dataServer: {
    //   type: Object,
    //   default: () => {},
    // },
  },
  setup(props, context) {
    const { fetchsshkeys, createinstance, checkEula, validateEula } = useNamespacedActions(INSTANCE, [
      "fetchsshkeys",
      "createinstance",
      "checkEula",
      "validateEula",
    ]);
    const { sshkeys, isLoading, statusCheckEula } = useNamespacedState(INSTANCE, ["sshkeys", "isLoading", "statusCheckEula"]);
    const { multiCheckAvailability } = useNewServiceAvailability();
    onMounted(async () => {
      const params = new URLSearchParams();
      params.append("project_id", localStorage.getItem("projectid"));
      params.append("form_name", "Form Create Instance");
      await checkEula(params);
      await fetchsshkeys();
      // await checkEula(localStorage.getItem("projectid"));
    });
    const selectedssh = ref([]);
    const sshkeyselected = ref("");
    const agree = ref(false);
    const dialogssh = ref(false);
    const dialogupdate = ref(false);
    const instanceDialog = ref(false);
    const role = ref(localStorage.getItem("role"));
    const show1 = ref(false);
    const errorsshkey = ref(false);
    const authentication = ref("");
    const password = ref("");
    const $v = useVuelidate(
      {
        authentication: {
          required: helpers.withMessage("Authentication couldnt be empty.", (val) => {
            return val;
          }),
        },
        password: {
          required: requiredIf((val) => {
            return authentication.value === "password";
          }),
          uppercase: {
            $message: "Must contains at least one uppercase character",
            $validator: (val) => {
              if (authentication.value == "password") {
                return /^(?=.*[A-Z])/g.test(val);
              } else {
                return true;
              }
            },
          },
          lowercase: {
            $message: "Must contains at least one lowercase character",
            $validator: (val) => {
              if (authentication.value == "password") {
                return /^(?=.*[a-z])/g.test(val);
              } else {
                return true;
              }
            },
          },
          numeric: {
            $message: "Must contains at least one numeric character",
            $validator: (val) => {
              if (authentication.value == "password") {
                return /^(?=.*[0-9])/g.test(val);
              } else {
                return true;
              }
            },
          },
          symbol: {
            $message: "Must contains at least one symbol (!@#$%^&*)",
            $validator: (val) => {
              if (authentication.value == "password") {
                return /^(?=.*[!@#$%^&*])/g.test(val);
              } else {
                return true;
              }
            },
          },
          minLength: minLength(8),
        },
      },
      {
        authentication,
        password,
      }
    );
    const getEula = () => {
      const routeData = context.root.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create Instance" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    };
    const submit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const dataAuth = {};
      if (authentication.value == "password") dataAuth.password_manual = password.value;
      if (authentication.value == "ssh") {
        if (selectedssh.value.length == 0) {
          errorsshkey.value = true;
          return;
        } else {
          dataAuth.ssh_key_id = selectedssh.value;
        }
      }
      if (props.dataDetails.typeInstance) delete props.dataDetails.typeInstance;
      if (props.dataDetails.osSelected) delete props.dataDetails.osSelected;
      if (props.dataVolume.planSelected) delete props.dataVolume.planSelected;
      if (props.dataVolume.processor) delete props.dataVolume.processor;
      if (props.dataVolume.dataDisk) delete props.dataVolume.dataDisk;
      if (props.dataVolume.customRootDiskSize) delete props.dataVolume.customRootDiskSize;

      const payload = {
        ...props.dataDetails,
        ...props.dataNetwork,
        ...props.dataVolume,
        // ...props.dataSecurity,
        // ...props.dataServer,
        ...dataAuth,
        instance_amount: 1,
        project_id: JSON.parse(localStorage.getItem("currentProj") || "{}").id,
      };

      // console.log("payload", payload);
      createinstance(payload)
        .then(() => {
          context.root.$store.dispatch("HOMEPAGE/showProcessToastWS", `Building instance ${props.dataDetails.name}`, { root: true });
          if (role.value.toLowerCase() !== "superadmin" && statusCheckEula.value == false) {
            const payload = {
              form_name: "Form Create Instance",
              project_id: localStorage.getItem("projectid"),
            };
            validateEula(payload);
            context.root.$router.push("/instance");
          }
          if (role.value.toLowerCase() !== "superadmin" && statusCheckEula.value == true) {
            context.root.$router.push("/instance");
          }
          if (role.value.toLowerCase() === "superadmin") {
            context.root.$router.push("/instance");
          }
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.code == "INS-007") {
            if (e.response.data.data.includes("instance name in project must be unique"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Instance name has been already used in this project.", { root: true });
            else if (e.response.data.data.includes("total instance voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Instance quota has reached the limit!", { root: true });
            else if (e.response.data.data.includes("total volume voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Data disk quota has reached the limit!", { root: true });
            else if (e.response.data.data.includes("this package has already reached region limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Unable to use the instance flavor due to stock availability.", { root: true });
            else if (e.response.data.data.includes("RAM instance voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "RAM size has reached the limit!", { root: true });
            else if (e.response.data.data.includes("CPU instance voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "vCPU quota has reached the limit!", { root: true });
            else if (e.response.data.data.includes("instance root disk size voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Root disk size has reached the limit!", { root: true });
            else if (e.response.data.data.includes("you cant use trial instance with not trial storage disk"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Trial instance only can bind with trial storage disk.", { root: true });
            else if (e.response.data.data.includes("ram limit has reached in this region"))
              context.root.$store.dispatch(
                "HOMEPAGE/showErrorToast",
                "Unable to use the flavor in this region due to limitation. Please contact administrator.",
                { root: true }
              );
            else if (e.response.data.data.includes("RAM has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "RAM has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("vCPU has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "vCPU has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("Storage has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Storage has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("Storage sizes has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Storage size has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("cannot create trial instance with basic vpc")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Cannot create trial instance with basic VPC.", { root: true });
            } else if (e.response.data.data.includes("total volume size voucher has reached limit")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Data disk size has reached the limit!", { root: true });
            } else if (isLimitError(e.response.data.data)) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", createLimitErrorMsg(e.response.data.data), { root: true });
            } else if (e.response.data.data.includes("cannot create basic instance with trial vpc")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Cannot create basic instance with trial TRIAL VPC.", { root: true });
            } else if (e.response.data.data.includes("vpc id is not found")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "VPC is not found, please reload page to get list vpc.", { root: true });
            } else if (e.response.data.data.includes("voucher has already expired")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "This voucher is expired.", { root: true });
            } else if (e.response.data.data.includes("Instance has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Instance has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("cpu limit has reached in this region"))
              context.root.$store.dispatch(
                "HOMEPAGE/showErrorToast",
                "Unable to use the flavor in this region due to limitation. Please contact administrator.",
                { root: true }
              );
            // else if(e.response.data.data.includes('Your balance is not enough')) context.root.$store.dispatch('HOMEPAGE/showErrorToast', e.response.data.data, { root: true })
            else if (e.response.data.data.includes("Your balance is not enough")) {
              setopendialogbalance(true);
              setopendialogbalancemsg(e.response.data.data);
            } else if (e.response.data.data.includes("Service activation")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", e.response.data.data, { root: true });
            } else if (
              e.response.data.data.includes("You do not have enough limits to create instance with paid OS. Please get in touch with the administrator.")
            ) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", e.response.data.data, { root: true });
            } else {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Cannot create instance. Please contact administrator.", { root: true });
            }
          } else if (e.response.data.data.includes("maximal limit for your organization")) {
            context.root.$store.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          } else if (e.response.data.data.includes("Service activation")) {
            context.root.$store.dispatch("HOMEPAGE/showErrorToast", e.response.data.data, { root: true });
          }

          if (errorMessage !== "") {
            context.root.$store.dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
          }
        });

      // context.emit("update:step", props.step + 1);
    };

    const displayInstanceDialog = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      let os =
        props.dataDetails.typeInstance === "operatingsystem"
          ? {
              by: "custom",
              item: {
                service_name: "OS_CHARGING",
                id: props.dataDetails.osSelected,
              },
            }
          : undefined;

      let rootDisk = {
        by: props.dataVolume.customRootDiskSize ? "service" : "item",
        item: {
          service_name: "ROOT_DISK",
          id: props.dataVolume.customRootDiskSize ? props.dataVolume.vm_root_disk_type_id : props.dataVolume.vm_root_disk_id,
          ...(props.dataVolume.customRootDiskSize
            ? {
                tags: [
                  {
                    name: "Volume",
                    qty: props.dataVolume.customRootDiskSize,
                  },
                ],
              }
            : undefined),
        },
      };

      let dataDisk = [];
      if (props.dataVolume.dataDisk) {
        dataDisk.push(
          ...props.dataVolume.dataDisk.map((data) =>
            data.package_storage_id == data.type
              ? {
                  by: "service",
                  item: {
                    service_name: "STORAGE",
                    id: data.type,
                    tags: [
                      {
                        name: "Volume",
                        qty: data.size,
                      },
                    ],
                  },
                }
              : {
                  by: "item",
                  item: {
                    service_name: "STORAGE",
                    id: data.package_storage_id,
                  },
                }
          )
        );
      }

      let items = [
        {
          by: "item", 
          item: {
            service_name: 'INSTANCE', 
            id: props.dataVolume.item_id,
          }
        }
      ]

      if (os) items.push(os)
      if (rootDisk) items.push(rootDisk)
      if (dataDisk) items.push(...dataDisk)

      await multiCheckAvailability(items);

      instanceDialog.value = true;
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    watch(selectedssh, () => {
      errorsshkey.value = "";
    });
    return {
      prev,
      submit,
      authentication,
      $v,
      sshkeys,
      errorsshkey,
      password,
      show1,
      dialogssh,
      dialogupdate,
      role,
      agree,
      getEula,
      sshkeyselected,
      selectedssh,
      isLoading,
      statusCheckEula,
      displayInstanceDialog,
      instanceDialog,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-btn.v-size--default {
  font-size: 16px;
}

::v-deep .v-input--selection-controls {
  padding-top: 0px;
}
</style>
