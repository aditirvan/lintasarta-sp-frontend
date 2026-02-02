<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4">
        Custom Registry Limit
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
          <v-col cols="12" class="dl">
              Registry
          </v-col>
          <v-col cols="12">
            <!-- <p class="font-weight-bold">Storage</p> -->
            <v-text-field
              outlined
              single-line
              v-model="registrylimit"
              type="number"
                :error-messages="$v.registrylimit.$errors.length ? $v.registrylimit.$errors[0].$message : ''"
            />
          </v-col>
          <v-col cols="6" class="dl">
            Default storage consumption
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon ><v-icon>mdi-alert-circle-outline</v-icon></v-btn>
              </template>
              <span>
                For unlimited  quota enter '-1'.
              </span>
            </v-tooltip>
          </v-col>
          <v-col cols="6" class="dl">
          </v-col>
          <v-col cols="6">
            <!-- <p class="font-weight-bold">Storage</p> -->
            <v-text-field
              outlined
              placeholder="Storage"
              single-line
              v-model="storage"
              type="number"
                :error-messages="$v.storage.$errors.length ? $v.storage.$errors[0].$message : ''"
            />
          </v-col>
          <v-col cols="6">
            <v-autocomplete
            v-model="storageUnit"
            :items="items"
            placeholder="Size"
            outlined
            autocomplete="off"
            item-title="text"
            item-value="value"
                :error-messages="$v.storageUnit.$errors.length ? $v.storageUnit.$errors[0].$message : ''"
          ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              height="58"
              depressed
              block
              color="accent"
              :to="`/organization-detail/${organizationId}`"
              exact
            >
              <span style="font-size: 16px"> Cancel</span>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              height="58"
              depressed
              block
              color="secondary"
              @click="submit"
            >
              <span style="font-size: 16px"> Submit</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedState,
  useNamespacedGetters,
} from "vuex-composition-helpers";
export default {
  data () {
    return {
      items: [
        // { text: 'MiB', value:1048576 },
        { text: 'GiB', value: 1073741824 },
        { text: 'TiB', value: 1099511627776 },
      ],
    }
  },
  setup(props, context) {
    const {getquotalimits,managequotalimits,getdetailquota } = useNamespacedActions(
      "REGISTRY",
      ["getquotalimits","managequotalimits","getdetailquota" ]
    );
    const { quotalimits,quotastatus,detailquotalimits,detailquotastatus} =
      useNamespacedGetters("REGISTRY", [
        "quotalimits","quotastatus","detailquotalimits","detailquotastatus"
      ]);

    onMounted(async () => {
      await getquotalimits()
      // console.log("setquotastatus=====",quotastatus)
      if(quotastatus.value==200){
        // console.log("quotalimits=====",quotalimits.value)
        const quota=convertBytes(quotalimits.value.limits).split(" ");
        // console.log("res quota=====",quota[1])
        storage.value=quota[0]
        registrylimit.value=quotalimits.value.limits_registry
        if(quota[1]=="GiB"){
          storageUnit.value= 1073741824 
        }
        else if(quota[1]=="TiB"){
          storageUnit.value=1099511627776 
        }
        else if(quota[1]=="MiB"){
          storageUnit.value= 1048576 
        }
        // await getdetailquota()
        // if(detailquotastatus.value==200){
        //   console.log("detailquotastatus===============",detailquotalimits.value[0].id)
        //   id_quota.value=detailquotalimits.value[0].id
        //   console.log("id_quota===============",id_quota)
          
        //   storages.value = detailquotalimits.value[0].used.storage;
        //   hard.value = detailquotalimits.value[0].hard.storage;
        //   if(hard.value==-1){
        //     power1.value=0
        //   }else{
        //     power1.value=Math.ceil((storage.value/hard.value)*100)
        //   }
        // }
      }

    })
    const isLoading = ref(false);
    const storage=ref("")
    const registrylimit=ref(0)
    // const id_quota=ref(0)
    const storageUnit=ref()
    const limit_storage=ref()
    const storages = ref(0);
    const hard = ref(0);
    const power1 = ref(0);
    const color_progres = ref("light-green");
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const organizationId = ref(currentOrg.id);
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const projectId = ref(currentProj.id);
    const content_error = ref("")
    const $v = useVuelidate(
    {
        storage: { required },
        storageUnit: { required },
        registrylimit: { required }
        
    },
    {
        storage,
        storageUnit,
        registrylimit
    }
)

    const submit = () => {
      $v.value.$touch();
      content_error.value = $v.value.$errors.length ? "value is required" : ""
      if ($v.value.$errors.length) return;
      // console.log("id===============",id_quota)
      if(storage.value==0){
      limit_storage.value=0
      }else{
      limit_storage.value=storage.value*storageUnit.value
      }
      
      const param = {
        // body:{
        limits: limit_storage.value,
        limits_registry: parseInt(registrylimit.value),
        project_id: projectId.value,
        organization_id:organizationId.value,
        // },
        // id_quota:id_quota.value,
      }
      // console.log("param==================",param)
      managequotalimits(param)
    }
    const convertBytes = function(bytes) {
      const sizes = ["Bytes", "KB", "MiB", "GiB", "TiB"]

      if (bytes == 0) {
        return "n/a"
      }

      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

      if (i == 0) {
        return bytes + " " + sizes[i]
      }

      return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
    }
    return {
      color_progres,
      isLoading,
      convertBytes,
      organizationId,
      projectId,
      storage,
      registrylimit,
      submit,
      storageUnit,
      limit_storage,
      // id_quota,
      quotastatus,
      detailquotalimits,
      detailquotastatus,
      storages,
      hard,
      power1,
      $v,
      content_error,
    };
  },
};
</script>

<style lang="scss" scoped>

.m-t-1 {
  margin-top: -25px;
}
::v-deep .v-text-field__details {
  position: static;
}
.btn-delete-flavor {
  font-size: 14px;
  height: 50px !important;
}

.dl {
   vertical-align: middle;
}

.hideinput{
  ::v-deep input{
    position: relative;
    bottom:150px;
    z-index: -2;
  }
}
.markdown-error {
  border: 1px solid red;
}
</style>
