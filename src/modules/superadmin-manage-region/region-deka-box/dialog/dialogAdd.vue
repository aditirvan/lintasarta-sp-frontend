<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">{{ editMode ? "Edit" : "Create New" }} Region</div>
      </v-card-text>
      <v-card-text class="pb-0">
        <p class="titletext">
          Name
          <small class="error--text" v-if="$v.name.$errors.length">&nbsp;*{{ $v.name.$errors[0].$message }}</small>
        </p>
        <v-text-field maxlength="100" v-model="name" :disabled="editMode" placeholder="Name" flat outlined></v-text-field>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-row>
          <v-col cols="12" class="pt-0">
            <p class="titletext">
              Volume Limit (GB)
              <small class="error--text" v-if="$v.volumeLimit.$errors.length">&nbsp;*{{ $v.volumeLimit.$errors[0].$message }}</small>
            </p>
            <v-text-field
              maxlength="100"
              placeholder="Volume Limit"
              v-model="volumeLimit"
              type="number"
              min="1"
              oninput="if(Number(this.value) < Number(this.min)) this.value = this.min;"
              flat
              outlined
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="12" class="pt-0">
            <p class="titletext">
              URL
              <small class="error--text" v-if="$v.s3_url.$errors.length">&nbsp;*{{ $v.s3_url.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="URL" v-model="s3_url" flat outlined></v-text-field>
          </v-col> -->
          <v-col cols="12" class="pt-0">
            <p class="titletext">
              API URL
              <small class="error--text" v-if="$v.s3_api_url.$errors.length">&nbsp;*{{ $v.s3_api_url.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="API URL" v-model="s3_api_url" flat outlined></v-text-field>
          </v-col>
          <!-- <v-col cols="12" class="pt-0">
            <p class="titletext">
              Region Name
              <small class="error--text" v-if="$v.s3_region_name.$errors.length">&nbsp;*{{ $v.s3_region_name.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Region Name" v-model="s3_region_name" flat outlined></v-text-field>
          </v-col> -->
          <v-col cols="12" class="pt-0">
            <p class="titletext">
              Admin Username
              <small class="error--text" v-if="$v.s3_admin_username.$errors.length">&nbsp;*{{ $v.s3_admin_username.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" placeholder="Admin Username" v-model="s3_admin_username" flat outlined></v-text-field>
          </v-col>
          <v-col cols="12" class="pt-0">
            <p class="titletext">
              {{ editMode ? "Change Admin Password" : "Admin Password" }}
              <small class="error--text" v-if="$v.s3_admin_password.$errors.length">&nbsp;*{{ $v.s3_admin_password.$errors[0].$message }}</small>
              <v-tooltip bottom v-if="editMode">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="grey" dark v-bind="attrs" v-on="on"> mdi-alert-circle </v-icon>
                </template>
                <span>Fill in the field below if you want to change your password</span>
              </v-tooltip>
            </p>
            <v-text-field
              maxlength="100"
              placeholder="Admin Password"
              v-model="s3_admin_password"
              flat
              outlined
              autocomplete="new-password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            ></v-text-field>
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
      <v-card-text class="pb-0">
        <p class="titletext">
          Type
        </p>
        <v-select
          v-model="typeRegion"
          :items="['Basic', 'Premium']"
          outlined
          placeholder="Select Type"
          required
        ></v-select>
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
import { computed, ref, watch } from "@vue/composition-api";
const { required, url, maxLength, minLength, minValue, requiredIf } = require("@vuelidate/validators");
import { useNamespacedState } from "vuex-composition-helpers";
import { DEKABOXREGION } from "../../namespace";

const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value", "selectedRegion", "formState"],
  setup(props, { root, emit }) {
    // Reset Form if create success
    root.$on("resetFormRegion", () => {
      resetForm();
    });

    const { isRegionLoading } = useNamespacedState(DEKABOXREGION, ["isRegionLoading"]);

    const name = ref(null);
    const volumeLimit = ref(null);
    const s3_url = ref(null);
    const s3_api_url = ref(null);
    const s3_region_name = ref(null);
    const s3_admin_username = ref(null);
    const s3_admin_password = ref(null);
    const description = ref(null);
    const typeRegion=ref('Basic');

    const editMode = ref(true);
    const show1 = ref(false);

    watch(
      () => props.formState,
      (val) => {
        resetForm();
        if (props.selectedRegion == null) {
          editMode.value = false;
        } else {
          editMode.value = true;
          name.value = props.selectedRegion.name;
          description.value = props.selectedRegion.description;
          volumeLimit.value = props.selectedRegion.volume_limit;
          s3_url.value = props.selectedRegion.s3_url;
          s3_api_url.value = props.selectedRegion.s3_api_url;
          s3_region_name.value = props.selectedRegion.s3_region_name;
          s3_admin_username.value = props.selectedRegion.s3_admin_username;
          typeRegion.value=props.selectedRegion.type_region;

        }
      }
    );

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        volumeLimit: {
          required,
          minValue: minValue(1),
        },
        // s3_url: {
        //   required,
        //   url,
        // },
        s3_api_url: {
          required,
          url,
        },
        // s3_region_name: {
        //   required,
        // },
        s3_admin_username: {
          required,
        },
        s3_admin_password: {
          required: requiredIf(!editMode),
          minLength: minLength(8),
        },
        description: {
          maxLength: maxLength(255),
        },
      },
      {
        name,
        description,
        // s3_url,
        s3_api_url,
        // s3_region_name,
        s3_admin_username,
        s3_admin_password,
        volumeLimit,
      }
    );

    const resetForm = () => {
      name.value = null;
      description.value = null;
      // s3_url.value = null;
      volumeLimit.value = null;
      s3_api_url.value = null;
      s3_admin_username.value = null;
      s3_admin_password.value = null;
      typeRegion.value='Basic';
      // s3_region_name.value = null;
      $v.value.$reset();
    };

    const save = async () => {
      $v.value.$touch();
      if ($v.value.$invalid) return false;

      const payload = {
        name: name.value,
        description: description.value,
        volume_limit: parseInt(volumeLimit.value),
        // s3_url: s3_url.value,
        s3_api_url: s3_api_url.value,
        // s3_region_name: s3_region_name.value,
        s3_admin_username: s3_admin_username.value,
        s3_admin_password: s3_admin_password.value,
        type_region:typeRegion.value,
      };

      if (props.selectedRegion) payload.ID = props.selectedRegion.id;
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
      description,
      s3_url,
      volumeLimit,
      s3_api_url,
      s3_region_name,
      s3_admin_username,
      s3_admin_password,
      show1,
      typeRegion,
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
