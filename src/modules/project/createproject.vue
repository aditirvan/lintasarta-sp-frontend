<template>
  <v-dialog v-if="CrateModal" v-model="CrateModal" max-width="543px">
    <v-card flat class="rounded-lg">
      <v-container class="pa-6">
        <div class="title">Add New Project</div>
        <div style="padding-top: 30px; padding-y: 10px">
          <div class="label">Project Name</div>
          <v-text-field
            placeholder="Enter Name"
            single-line
            outlined
            v-model="name"
            maxlength="30"
            :error-messages="createErrorMessage('name')"
          ></v-text-field>
          <br />          
          <div class="label">Choose Region</div>
          <v-select
            id="SelectRegion"
            v-model="selected_region"
            outlined
            :items="selectRegions"
            placeholder="Choose Region"         
            :error-messages="createErrorMessage('selected_region')"   
          >
          </v-select>                    
          <br />
          <div class="label">Description Project</div>
          <v-textarea
            outlined
            name="input-7-4"
            placeholder="Enter Description"
            v-model="description"
            maxlength="225"
            :error-messages="createErrorMessage('description')"
          ></v-textarea>

          <br />
          <div class="label">Business VAT ID</div>
          <v-text-field
            maxlength="20"
            @keydown="vatidKeydown($event)"
            flat
            outlined
            v-model="vatid"
            placeholder="Business VAT ID"
            :error-messages="createErrorMessage('vatid')"
          />

          <div class="label mt-4" style="margin-bottom: -35px">
            Payment Method
          </div>

          <v-radio-group v-model="payment_method" row>
            <v-row>
              <v-col v-if="!hidePrepaid">
                <v-radio label="Prepaid" value="prepaid">
                  <template v-slot:label>
                    <span class="fs-14">Prepaid</span>
                  </template>
                </v-radio>
              </v-col>

              <v-col v-if="typeUser == 'C'">
                <v-radio id="postpaid" label="Postpaid" value="postpaid">
                  <template v-slot:label>
                    <span class="fs-14">Postpaid</span>
                  </template>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>

          <v-text-field
            placeholder="Enter Voucher Discount Code"
            single-line
            outlined
            v-model="voucher_discount_code"
            maxlength="30"
          ></v-text-field>

          <p v-if="payment_method === 'postpaid'" :style="{ color: 'red', backgroundColor: 'pink', padding: '10px' }">
            Please contact our Team to activate your Postpaid account.
          </p>

          <v-row>
            <v-col cols="6">
              <v-btn
                block
                @click="
                  () => {
                    CrateModal = false;
                    reset();
                  }
                "
                depressed
                dark
                class="rounded-lg accent"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                class="rounded-lg secondary"
                @click="
                  () => {
                    createproject();
                  }
                "
                depressed
                >Create</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { useCreateProject } from "./useCreateProject";
import { defineComponent, onMounted, ref, watch, } from "@vue/composition-api";
import { useNamespacedMutations, useNamespacedActions } from 'vuex-composition-helpers'
import { MANAGESERVICE } from '../manage-service/namespace';
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import localstorage from '@/lib/localstorage';
import api from '@/lib/api';
const { required, minLength } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;

// const hidePrepaid = process.env.VUE_APP_DEV_MODE !== "fase-1.3";

export default defineComponent({
  setup(props, context) {
    const { selectregions: selectRegions, fetchregions } = useRegion()
    
    onMounted(() => {
      fetchregions()
    });

    const {
      name,
      description,
      payment_method,
      descValidation,
      regValidation,
      CreateProject,
      CrateModal,      
      selected_region,
      voucher_discount_code,
      vatid,
      vatidValidation,
    } = useCreateProject();

    watch(vatid, (newVal) => {
      vatid.value = newVal.replace(/[^a-zA-Z0-9]/g, '');
    })

    const vatidKeydown = (e) => {
      if (/[^a-zA-Z0-9]/g.test(e.key)) {
        e.preventDefault();
      }
    }

    const opendialogfailcreate = ref(false);
    const messagefailcreate = ref("");
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);
    const { loginMS } = useNamespacedActions(MANAGESERVICE, ["loginMS"])

    const typeUser = localStorage.getItem("type");

    const reset = async () => {
      name.value = "";
      description.value = "";
      payment_method.value = typeUser == "P" ? "prepaid" : "postpaid";
      selected_region.value = "";
      voucher_discount_code.value = "";
      vatid.value = "";
    };

    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
          alpha: {
            $message: "value must alpha or alphanumeric",
            $validator: (v) => {
              let val = v;
              return /^[a-zA-Z0-9- ]+$/.test(val);
            },
          },
        },
        description: { required },
        payment_method: { required },
        selected_region: { required },
        vatid: { required },
      },
      {
        name,
        description,
        payment_method,
        selected_region,
        vatid,
      }
    );

    function createErrorMessage(element) {
      return $v.value[element].$errors.length
        ? $v.value[element].$errors[0].$message
        : "";
    }

    const createproject = async () => {
      $v.value.$touch();
      console.log($v.value.$invalid);
      if ($v.value.$invalid) return;

      await CreateProject()
        .then((e) => {
          console.log(e);
          const organisation = localStorage.getItem('currentOrg')
          const organisationID = organisation ? JSON.parse(organisation).id : null
          const projectId = localStorage.getItem('projectid')

          const paramsMS = {
            organization_id: organisationID,
            project_id: projectId,
            user_id: localStorage.getItem("userId")?.replaceAll('"', "")
          }
          loginMS(paramsMS)

          context.root.$router.push(`/project/${name.value}/${projectId}`);
          setopendialogcommonsuccess(true);
          name.value = "";
          description.value = "";
          payment_method.value = typeUser == "P" ? "prepaid" : "postpaid";
          selected_region.value = "";
          voucher_discount_code.value = "";
          vatid.value = "";
          location.reload()
        })
        .catch((e) => {
          if (!e.response) return;
          const { data } = e.response.data;
          context.root.$store.dispatch('HOMEPAGE/showErrorToast', data, { root: true })
          opendialogfailcreate.value = true;
          name.value = "";
          description.value = "";
          payment_method.value = typeUser == "P" ? "prepaid" : "postpaid";
          selected_region.value = "";
          voucher_discount_code.value = "";
          vatid.value = "";
        });

        
    };

    return {
      reset,
      createErrorMessage,
      opendialogfailcreate,
      createproject,
      name,
      description,
      payment_method,
      descValidation,
      vatid,
      CreateProject,
      CrateModal,
      typeUser,
      selectRegions,      
      selected_region,
      voucher_discount_code,
      regValidation,
      vatidKeydown,
    };
  },
  data() {
    const json = localstorage.getItem("currentOrg");
    var org = undefined
    if (json) {
      org = JSON.parse(json);
    }
   
    return {
      hidePrepaid: org ? !org.is_personal : false,
      personalStatus: false,
      loading: false,
    }
  },
  methods: {
    async getPersonalStatus() {
      this.loading = true;

      try {
        const res = await api.GET("/user/personal-status");
        this.personalStatus = res.data.personal_active;
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying data";
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

      this.loading = false;
    },
  },
  mounted() {
    this.getPersonalStatus();
  },
});
</script>

<style scoped>
.v-btn {
  height: 50px !important;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 140%;
}

.title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.label {
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 140%;
  color: #556272;
  padding-bottom: 14px;
}
</style>
