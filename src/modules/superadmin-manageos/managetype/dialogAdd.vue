<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Create New Type</div>
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
          placeholder="Description"
          :error-messages="
            descriptionErrors.length ? descriptionErrors[0].$message : ''
          "
        ></v-textarea>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Type Operating System</p>
        <v-select
          id="type"
          v-model="type"
          :items="types"
          placeholder="Choose Type OS"
          single-line
          outlined
          :error-messages="typeErrors.length ? typeErrors[0].$message : ''"
        ></v-select>
      </v-card-text>
      <v-card-text v-if="type === 'paid'">
        <p class="titletext">Price</p>
        <v-text-field
          :class="{ hideinput: priceFocus === false }"
          id="price"
          type="number"
          v-model.number="price"
          placeholder="0"
          flat
          outlined
          @focus="priceFocus = true"
          @blur="priceFocus = false"
          :error-messages="priceErrors.length ? priceErrors[0].$message : ''"
        >
          <template v-slot:prepend-inner>
            <span class="mt-1">
              <span class="font--text">IDR | </span>
              {{ priceFocus ? "" : toThousandsWithDotFormat(price) }}
            </span>
          </template>
        </v-text-field>
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
              id="Add"
              depressed
              height="45"
              block
              class="secondary"
              @click="addType"
              >Add</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
    <dialogfailcreate
      :message="messagefailcreate"
      v-model="opendialogfailcreate"
    />
  </v-dialog>
</template>
<script>
import { toThousandsWithDotFormat } from "@/lib/formatter";
import { useType } from "./useType";
import { computed, onMounted, ref, watch } from "@vue/composition-api";
import dialogfailcreate from "./dialogFailCreate";
import { useNamespacedMutations } from "vuex-composition-helpers";
import { method } from "lodash";
const { required, requiredIf, minLength } = require("@vuelidate/validators");
//const { required, email: vemail, numeric } = require("@vuelidate/validators");
// import { useProjects } from "../project/useprojects";

const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value"],
  components: { dialogfailcreate },
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });
    const Composable = {
      ...useType(),
    };

    const name = ref("");
    const description = ref("");
    const types = ref([
      {
        text: "Paid",
        value: "paid",
      },
      {
        text: "Non Paid",
        value: "free",
      },
    ]);
    const type = ref("");
    const price = ref(0);
    const os_logo = ref();
    const os_logo_path = ref();
    const os_logo_warning = ref("");

    const { addOstype } = Composable;

    onMounted(() => {});
    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        description: { required },
        type: { required },
        price: {
          required: requiredIf((val) => {
            return type.value == "paid";
          }),
        },
      },
      { name, description, type, price }
    );

    const onFilesChange = (e) => {
      os_logo_path.value = e.target.files[0].name;
      os_logo.value = e.target.files[0];
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
    const toFormData = (o) => {
      return Object.entries(o).reduce(
        (d, e) => (d.append(...e), d),
        new FormData()
      );
    };
    const opendialogfailcreate = ref(false);
    const messagefailcreate = ref("");

    const Errors = createErrors({ name, description, type, price });
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);
    return {
      priceFocus: ref(false),
      toThousandsWithDotFormat,
      ...Composable,
      ...Errors,
      name,
      description,
      type,
      types,
      price,
      os_logo,
      os_logo_path,
      os_logo_warning,
      dialog,
      toFormData,
      onFilesChange,
      messagefailcreate,
      opendialogfailcreate,
      addType: () => {
        os_logo_path
          ? (os_logo_warning.value = "Value is required")
          : (os_logo_warning.value = "");
        $v.value.$touch();
        if ($v.value.$errors.length) return;
        const payload = {
          name: name.value,
          description: description.value,
          type_os: type.value,
          price: price.value ?? 0,
          os_logo: os_logo.value,
        };

        addOstype(toFormData(payload))
          .then(() => {
            dialog.value = false;
            emit("added");
            setopendialogcommonsuccess(true);
          })
          .catch((e) => {
            const data = e.response.data.data;
            messagefailcreate.value = data;
            opendialogfailcreate.value = true;
            name.value = "";
            description.value = "";
            type.value = "";
            price.value = "";
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
.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -2;
  }
}
</style>
