<template>
  <v-dialog v-if="dialog" v-model="dialog" max-width="543px">
    <v-card flat class="rounded-lg">
      <v-container class="pa-6">
        <!-- <div class="title">Create Openstack</div> -->
        <div style="padding-top: 30px; padding-y: 10px">       
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

          <v-row>
            <v-col cols="6">
              <v-btn
                block
                @click="
                  () => {
                    dialog = false;
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
import { useCreateOpenstack } from "./useCreateOpenstack";
import { defineComponent, onMounted, ref, computed } from "@vue/composition-api";
import { useNamespacedMutations, useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'
import { MANAGESERVICE } from '../manage-service/namespace';
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import localstorage from '@/lib/localstorage';
import api from '@/lib/api';
import { PROJECT } from "./namespace";
const { required, minLength } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;

// const hidePrepaid = process.env.VUE_APP_DEV_MODE !== "fase-1.3";

export default defineComponent({
  setup(props, context) {
    const { selectregionsbystatus: selectRegions, fetchregionbystatus } = useRegion()
    
    onMounted(() => {
      fetchregionbystatus()
    });

    const {
      $v,
      CreateOpenstack,
      selected_region,
    } = useCreateOpenstack();

    const opendialogfailcreate = ref(false);
    const messagefailcreate = ref("");
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);

    const typeUser = localStorage.getItem("type");

    const reset = async () => {
      selected_region.value = "";
      $v.value.$reset();
    };

    // const $v = useVuelidate();

    function createErrorMessage(element) {
      return $v.value[element].$errors.length
        ? $v.value[element].$errors[0].$message
        : "";
    }

    const createproject = async () => {
      $v.value.$touch();
      if ($v.value.$invalid) return;

      await CreateOpenstack()
        .then((e) => {
          const currentProj = JSON.parse(localStorage.getItem('currentProj'))

          
          setopendialogcommonsuccess(true);
          
          reset();
          // location.reload()
          dialog.value = false
          context.root.$router.push(`/project/${currentProj.name}/${currentProj.id}`);
        })
        .catch((e) => {
          if (!e.response) return;
          const { data } = e.response;
          context.root.$store.dispatch('HOMEPAGE/showErrorToast', data, { root: true })
          opendialogfailcreate.value = true;
          dialog.value = false
        });

        
    };

    const { opendialogcreateopenstack } = useNamespacedState(PROJECT, ['opendialogcreateopenstack'])
    const { setopendialogcreateopenstack } = useNamespacedMutations(PROJECT, ['setopendialogcreateopenstack'])

    const dialog = computed({
      get: () => opendialogcreateopenstack.value,
      set: (val) => setopendialogcreateopenstack(val)
    })

    return {
      reset,
      createErrorMessage,
      opendialogfailcreate,
      createproject,
      CreateOpenstack,
      typeUser,
      selectRegions,      
      selected_region,
      dialog,
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
