<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4">
        Custom Deka AST Limit
      </div>
      <v-card class="rounded-lg" flat v-if="isLoading">
        <v-card-text class="d-flex justify-center">
          <v-progress-circular
            style="margin: auto"
            :size="200"
            color="primary"
            indeterminate
            :min="-1"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
      <div v-else>
        <v-row>
          <v-col cols="3" class="dl">
           Deka AST Limit
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon ><v-icon>mdi-alert-circle-outline</v-icon></v-btn>
                </template>
                <span>
                  Disable or enable Deka AST Limit
                </span>
              </v-tooltip>
            </v-col>
          <v-col cols="12">
            <!-- <p class="font-weight-bold">Storage</p> -->
            <v-switch
                class="mt-0 mb-2"
                :true-value="1"
                :false-value="0"
                @change="handleSwitchChange"
                v-model="switchValue"
               

               
              ></v-switch>
          </v-col>
        </v-row>
        <v-row v-if="switchValue === 1">
          <v-col cols="6" class="dl">
          Project Limit
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon ><v-icon>mdi-alert-circle-outline</v-icon></v-btn>
                </template>
                <span>
                  Limit For Project
                </span>
              </v-tooltip>
            </v-col>
            <v-col cols="6" class="dl">
          Site Limit
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon ><v-icon>mdi-alert-circle-outline</v-icon></v-btn>
                </template>
                <span>
                  Limit For Site
                </span>
              </v-tooltip>
            </v-col>
        </v-row>
         <v-row v-if="switchValue === 1">
          <v-col cols="6"> <!-- Adjust the column width as needed -->
            <v-text-field flat outlined
            v-model="projectValue"
                  type="number"
                  :error-messages="
                    $v.projectValue.$errors.length
                      ? $v.projectValue.$errors[0].$message
                      : ''
                  "
            
            ></v-text-field>
          </v-col>
          <v-col cols="6"> <!-- Adjust the column width as needed -->
            <v-text-field flat outlined  type="number" 
            v-model="siteValue"
                  :error-messages="
                    $v.siteValue.$errors.length
                      ? $v.siteValue.$errors[0].$message
                      : ''
                  "
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-btn
            id="CreateNewRoleNav"
            height="50"
            block
            @click="redirectBack"
            class="grey"
            >Cancel</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
            id="CreateNewRoleNav"
            block
            height="50"
            @click="handleUpdateLimit"
            class="secondary"
            >Submit</v-btn>
          </v-col>
            
        </v-row>
      </div>
    </v-container>
    <dialogDeleteI3gis
      v-if="opendeleteproject"
      :selectedproject="selectedProj"
      v-model="opendeleteproject"
      @close="
        () => {
          opendeleteproject = false;
        }
      "
      @deleteproject="
        () => {
          opendialogareyousure = true;
        }
      "
    />

    <dialogConfirmation
      v-if="opendialogareyousure"
      :project="selectedProj"
      v-model="opendialogareyousure"
      @deleted="
        () => {}
      "
      @error="
        (response) => {
          opendeleteproject = false;
          dialogerrormsg = response.data.data;
          opendialogerror = true;
        }
      "
    />

    <dialogErrorDelete v-model="opendialogerror" :message="dialogerrormsg" />
    <router-link
      id="buttonCancel"
      height="58"
      tag="button"
      depressed
      block
      :to="`/organization-detail/${currOrg.id}`"
      style="display: none;"
      >
      Cancel
      </router-link>
  </v-card>
</template>

<script lang="ts">
import { ref, onMounted, watch } from "@vue/composition-api";
import  dialogErrorDelete  from "../sast/dialogErrorDelete.vue";
import  dialogConfirmation  from "../sast/dialogConfirmation.vue";
import  dialogDeleteI3gis  from "../sast/dialogDeleteI3gis.vue";
import useVuelidate from "@vuelidate/core";
import { required, minValue, helpers } from "@vuelidate/validators";

import {
  useNamespacedActions,
  useNamespacedState,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { I3GIS } from '../sast/namespace'
export default {

  components: {
    dialogConfirmation,
    dialogErrorDelete,
    dialogDeleteI3gis,
  },
  
  setup(props, context) {
    
    const selectedProj = ref("");
    const opendeleteproject = ref(false);
    const dialogerrormsg = ref("");
    const opendialogareyousure = ref(false);
    const opendialogerror = ref(false);
    const switchValue = ref(0);
    const siteValue = ref(0);
    const projectValue = ref(0);
    const projectId = localStorage.getItem("projectid");
    const userId = JSON.parse(localStorage.getItem("userId"));
    const curOrg = localStorage.getItem("currentOrg");
    const currOrg = JSON.parse(curOrg);
    const isButtonDisabled = ref(true);

    const { getquotalimitI3gis,updateQuotalimitI3gis } = useNamespacedActions(I3GIS, ["getquotalimitI3gis","updateQuotalimitI3gis"]);
    const { quotalimitsI3gis,quotastatusI3gis } = useNamespacedGetters(I3GIS, ["quotalimitsI3gis"]);
    const rules = ref({
      required: (value) => !!value || "Value is required",
      nonNegative: (value) => value >= 0 || "Minimum value is 0"

    });


    const $v = useVuelidate(
      {
        projectValue: { $autoDirty: true, required, maxWeight: helpers.withMessage(
            "Minimum value is 0",
            val => { 
              let valid = true
              if(parseInt(val) < 0){
                valid = false
              } 
              return valid
            }
          )},

        siteValue: { $autoDirty: true, required, maxWeight: helpers.withMessage(
            "Minimum value is 0",
            val => { 
              let valid = true
              if(parseInt(val) < 0){
                valid = false
              } 
              return valid
            }
          )},
      },
      {
        projectValue,siteValue
      }
    );

    const handleSwitchChange = async ()=> {
      const status = switchValue.value
      const oldLimit = quotalimitsI3gis.value
    }

    const handleUpdateLimit = async()=>{
  
      if(switchValue.value==0){
        console.log("handle switch");
        opendeleteproject.value=true
        
      }else{

        $v.value.$touch();
      if ($v.value.$errors.length) return;
        // const isValid = rules.value.required(projectValue.value) === true &&
        //             rules.value.required(siteValue.value) === true &&
        //             rules.value.nonNegative(projectValue.value) === true &&
        //             rules.value.nonNegative(siteValue.value) === true;
    
      // if (!isValid) {
      //   console.error("Validation error: One or more rules are violated.");
      //   return;
      // }


        const data = {
          organization_id: currOrg.id,
          project_id: projectId,
          user_id: userId,
          limit:1,
          limit_project:Number(projectValue.value),
          limit_site:Number(siteValue.value),
      };
      console.log("get data ", data);
      await updateQuotalimitI3gis(data)
        .then((res: any) => {
          const resp = res.data
          console.log("resp ",resp)
          switchValue.value=resp.data.limit
          const cancelButton = document.getElementById("buttonCancel");
          if (cancelButton) {
              cancelButton.click();
          }
          return Promise.resolve();
        })
        .catch((error: any) => {
         
          console.log("Error updateQuotalimitI3gis:", error);
          // handle error disini
        });
      }
    }

    const redirectBack = async()=>{
        const cancelButton = document.getElementById("buttonCancel");
          if (cancelButton) {
              cancelButton.click();
          }
    }

    onMounted(async () => {
      if (userId && curOrg && projectId ) {
        const data = {
          organization_id: currOrg.id,
          project_id: projectId,
          user_id: userId,
        };
        console.log("data ", data)
        await getquotalimitI3gis(data).then((res: any) => {
          const resp = res.data
        
          console.log("resp ",resp)
          if(resp.statusCode <=200){
            switchValue.value=resp.data.limit
            projectValue.value=resp.data.limit_project
            siteValue.value=resp.data.limit_site

          }
          return Promise.resolve();
        });
      }
    })
    const isLoading = ref(false);
    const color_progres = ref("light-green");

   
    return {
      quotalimitsI3gis,
      color_progres,
      isLoading,
      switchValue,
      handleSwitchChange,
      selectedProj,
      opendeleteproject,
      dialogerrormsg,
      opendialogareyousure,
      opendialogerror,
      siteValue,
      projectValue,
      handleUpdateLimit,
      currOrg,
      rules,
      isButtonDisabled,
      redirectBack,
      $v,

    };
  }
};
</script>

<style lang="scss" scoped>
.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -4;
  }
}
.btn-delete-flavor {
  font-size: 14px;
  height: 50px !important;
}

.dl {
   vertical-align: middle;
}

</style>