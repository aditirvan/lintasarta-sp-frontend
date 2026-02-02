<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          Edit Logo
        </div>
      </v-card-text>

      <v-card-text v-show="is_white_label">
        <p class="titletext"></p>
        <v-row>
          <v-col>
            <v-btn
              id="Add"
              depressed
              height="45"
              block
              class="secondary btn-upload"
              @click="onBtnUploadClick"
              >Upload File</v-btn
            >
            <input
              ref="uploadFiles"
              type="file"
              class="btn-primary d-none"
              accept="image/*"
              @change="onFilesChange"
            />

            <p v-if="fileError" class="red--text mt-11px">
              {{ fileError }}
            </p>

          </v-col>
          <v-col class="d-flex align-items-center">
            <div v-if="!white_label_logo_path">
              <p class="mb-0 error--text">
                {{ white_label_logo_warning }}
              </p>
            </div>
            <div v-else>
              <p class="mb-0">{{ white_label_logo_path }}</p>
            </div>
          </v-col>
        </v-row>
        <p class="">Image resolution must be 200px width and 58px height</p>

      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              @click="
                () => {
                  $emit('input', false);
                }
              "
              depressed
              height="45"
              block
              class="accent"
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn
              @click="
                () => {
                  submit();
                }
              "
              depressed
              height="45"
              block
              class="secondary"
              >Update</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { SUPERADMIN } from "../superadmin/namespace";
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import { useDialog } from "@/composable/usedialog";
import localstorage from "@/lib/localstorage";
import { ORGANIZATION } from "./namespace";
import useVuelidate from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import api from "@/lib/api";
const allowedTypes = ["image/png", "image/jpeg", "image/x-icon"];

export default {
  props: ["value", "organization"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    const details = ref(props.organization.details);
    const address = ref(props.organization.address);
    const phone = ref(props.organization.phone_number_org.replace("+62", ""));
    const npwp = ref(props.organization.npwp_corporate);
    const sales_id = ref(props.organization.sales_id);
    const is_personal = ref(props.organization.is_personal);
    const is_white_label = ref(props.organization.is_white_label)
    const white_label_logo_path = ref();
    const white_label_logo = ref();
    const white_label_logo_warning = ref("");
    const fileError = ref("");
    const { setCurrentOrg, setCurrentProj } = useNamespacedMutations(
      SUPERADMIN,
      ["setCurrentOrg", "setCurrentProj"]
    );
    const user_role = localstorage.getItem("role");
    const store =
      user_role == "Superadmin" ? SUPERADMINMANAGEORG : ORGANIZATION;
    const { editorganization, editlogowhitelabel } = useNamespacedActions(store, [
      "editorganization", 'editlogowhitelabel',
    ]);
    const onFilesChange = (e) => {
      white_label_logo_path.value = e.target.files[0].name;
      white_label_logo.value = e.target.files[0];
      console.log(white_label_logo.value.type)
      if (e.target.files[0].size > 1024000) {
        fileError.value = "File size is too large (max 1MB)";
      } else if (!allowedTypes.includes(white_label_logo.value.type)) {
        fileError.value = "Only jpg, jpeg, ico and png files are allowed";
      } else {
        let reader = new FileReader();
        const file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = evt => {
          let img = new Image();
          img.onload = () => {
            const width = img.width;
            const height = img.height;
            // console.log(width);       
            // console.log(height);
            if (width > "200" || height > "58") {
              fileError.value = "Image resolution is not allowed";
            } else {
              fileError.value = "";
            }
            
          }
          img.src = evt.target.result;
          // console.log(img.src)
        }
        // fileError.value = "";
      }

    };
    const toFormData = (o) => {
      return Object.entries(o).reduce(
        (d, e) => (d.append(...e), d),
        new FormData()
      );
    };
    const $v = useVuelidate(
      {
        // details: { required },
      },
      {
        // details,
      }
    );
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);
    const submit = function() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      if (fileError.value != "") {
        return;
      }

      const Value =
        {
          id: props.organization.id,
          white_label_logo: white_label_logo.value,
        }
      // console.log(Value)
      return editlogowhitelabel(toFormData(Value)).then( function () {
        context.emit('update-image-logo')
        dialog.value = false;
        context.emit("updated");
        setopendialogcommonsuccess(true);
      });
    };
    return {
      $v,
      submit,
      dialog,
      is_white_label,
      onFilesChange,
      white_label_logo_path,
      white_label_logo,
      white_label_logo_warning,
      toFormData,
      fileError
    };
  },
  data() {
    return {
      saleses: [],
    };
  },
  computed: {
    isNotSuperadmin() {
      const role = localstorage.getItem("role");
      return role !== "Superadmin";
    },
  },
  methods: {
    async getSaleses() {
      // this.isLoading = true

      try {
        const res = await api.GET("/user/sales/active");
        const data = res.data;

        if (data) {
          this.saleses = data;
        }
      } catch (err) {
        let errmsg = "Sorry, an error occurred while getting the sales";
        const thereIsErrorMessage = err && err.response && err.response.data;

        if (thereIsErrorMessage && err.response.data.message) {
          errmsg = err.response.data.message;
        }

        if (
          thereIsErrorMessage &&
          err.response.data.data !== "record not found"
        ) {
          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
      }

      // this.isLoading = false
    },
    onBtnUploadClick() {
      this.$refs.uploadFiles.click();
    },
  },
  mounted() {
    this.getSaleses();
  },
};
</script>

<style lang="scss" scoped>
.titletext {
  font-weight: 700;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>