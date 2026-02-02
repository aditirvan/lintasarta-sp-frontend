<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Edit New Type</div>
      </v-card-text>

      <v-card-text>
        <p class="titletext">Name</p>
        <v-text-field
          maxlength="100"
          v-model="name"
          placeholder="Name"
          flat
          outlined
          :error-messages="nameErrors.length ? nameErrors[0].$message : ''"
        ></v-text-field>
      </v-card-text>

      <v-card-text>
        <p class="titletext">Description</p>
        <v-textarea
          rows="5"
          id="description"
          flat
          outlined
          maxlength="255"
          v-model="description"
          placeholder="Description Project"
          required
        ></v-textarea>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Type Operating System</p>
        <v-select
          :label="typeselectedvalue.type_os"
          single-line
          outlined
          disabled
        ></v-select>
      </v-card-text>
      <v-card-text v-if="typeselectedvalue.type_os == 'paid'">
        <p class="titletext">Price</p>
        <v-text-field
          :label="toThousandsWithDotFormat(typeselectedvalue.price)"
          flat
          outlined
          prefix="IDR | "
          disabled
        ></v-text-field>
      </v-card-text>

      <v-card-text>
        <p class="titletext">Upload Image</p>
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
          </v-col>
          <v-col class="d-flex align-items-center">
            <div v-if="!os_logo_path">
              <p class="mb-0 error--text">
                {{ os_logo_warning }}
              </p>
            </div>
            <div v-else>
              <p class="mb-0">{{ os_logo_path }}</p>
            </div>
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
                  $emit('input', false);
                }
              "
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn
              id="Update"
              depressed
              height="45"
              block
              class="secondary"
              @click="editType"
              >Update</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
    <dialogfailedit :message="messagefailcreate" v-model="opendialogfailedit" />
  </v-dialog>
</template>
<script>
import { toThousandsWithDotFormat } from "@/lib/formatter";
import { useType } from "./useType";
import { ref, computed, watch, onMounted } from "@vue/composition-api";
import dialogfailedit from "./dialogFailEdit";
import { useDialog } from "@/composable/usedialog";
import { useNamespacedMutations } from "vuex-composition-helpers";
//import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import useVuelidate from "@vuelidate/core";

const { required, email: vemail, numeric, minLength } = require("@vuelidate/validators");

export default {
  props: ["value", "typeselectedvalue"],
  components: { dialogfailedit },
  setup(props, { emit, root }) {
    const { dialog } = useDialog(props, { emit });
    const Composable = {
      ...useType(),
    };

    const opendialogfailedit = ref(false);
    const messagefailcreate = ref("");

    const name = ref("");
    const description = ref("");
    const os_logo = ref();
    const os_logo_path = ref();
    const os_logo_warning = ref("");

    const { editOstype } = Composable;

    name.value = props.typeselectedvalue.name || "";
    //console.log(name.value);
    description.value = props.typeselectedvalue.description || "";
    console.log(description.value);
    onMounted(() => {});

    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
      },
      { name, description }
    );
    const onFilesChange = (e) => {
      os_logo_path.value = e.target.files[0].name;
      os_logo.value = e.target.files[0];
    };
    const toFormData = (o) => {
      return Object.entries(o).reduce(
        (d, e) => (d.append(...e), d),
        new FormData()
      );
    };

    function createErrors(obj) {
      const key = Object.keys(obj);
      const res = {};
      key.forEach((k) => {
        res[k + "Errors"] = computed(() => {
          return $v.value[k].$errors;
        });
      });
      return res;
    }
    const Errors = createErrors({ name, description });
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);

    return {
      toThousandsWithDotFormat,
      name,
      description,
      os_logo,
      os_logo_path,
      os_logo_warning,
      toFormData,
      onFilesChange,
      ...Composable,
      ...Errors,
      dialog,
      messagefailcreate,
      opendialogfailedit,
      editType: () => {
        $v.value.$touch();
        if ($v.value.$errors.length) return;
        let Value = {};
        os_logo.value
          ? (Value = toFormData({
              id: props.typeselectedvalue.id,
              name: name.value,
              description: description.value,
              os_logo: os_logo.value,
            }))
          : (Value = {
              id: props.typeselectedvalue.id,
              name: name.value,
              description: description.value,
            });
        editOstype(Value)
          .then(() => {
            dialog.value = false;
            emit("updated");
            setopendialogcommonsuccess(true);
          })
          .catch((e) => {
            console.log(e.response);
            //const data = e.response.data.data;
            const data = e.response.data.data;
            messagefailcreate.value = data;
            opendialogfailedit.value = true;
          });
      },
    };
  },
  methods: {
    onBtnUploadClick() {
      this.$refs.uploadFiles.click();
    },
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
