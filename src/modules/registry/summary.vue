<template>
  <div>
    <v-container class="mt-6" v-if="isLoading">
      <div class="d-flex justify-center">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </v-container>
    <v-container class="pt-0" v-else>
      <!-- <v-col cols="12"> -->
        <v-row class="ml-2">
          <v-col cols="6" class="py-0">
            <v-row
              ><v-col cols="6">Repositories</v-col
              ><v-col cols="6">{{ listProjects.repo_count }}</v-col></v-row
            >
            <!-- <v-row
              ><v-col cols="6">Member</v-col><v-col cols="6">11</v-col></v-row
            > -->
          </v-col>
        </v-row>
        <v-row class="ml-2">
          <v-col cols="6" class="py-0">
            <v-row>
              <v-col cols="6">Type</v-col>
              <v-col cols="6"> {{ listProjects && listProjects.metadata && listProjects.metadata.public == 'true' ? 'Public' : 'Private' }} </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="ml-2">
          <v-col cols="6" class="py-0">
            <v-row>
              <v-col cols="6">Description</v-col>
              <v-col cols="6"> {{ listProjects.description ? listProjects.description : '-' }} </v-col>
            </v-row>
          </v-col>
        </v-row>
      <!-- </v-col> -->
      <!-- <v-col cols="6"> -->
        <v-row class="ml-2">
          <v-col cols="3">Quotas</v-col>
          <v-col cols="4"
            ><span>Storage used </span
            >
            <span class="float-right" v-if="hard=='-1'">
              {{ $formatSize(storage) }} of unlimited
            </span>
            <span class="float-right" v-else>
              {{ $formatSize(storage) }} of {{ $formatSize(hard) }}
            </span>
            <div>
              <v-progress-linear
                :value="power1"
                color="light-green"
                height="25"
                stream
              ></v-progress-linear>
              </div
          ></v-col> 
        </v-row>
    <!-- </v-col>    -->
    </v-container>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
export default {
  setup() {
    onMounted(async () => {
      // setLoadCard(false);
      await getListProjects();
      // console.log("status==============",status.value)
      // console.log(status.value)
      // if (!listProjects.value || (status.value==204 || status.value>299)) {
      //   setLoadCard(true);
      // }
      //  else {
      //   setLoadCard(false);
      // }

      if (listProjects.value) {
        storage.value = listProjects.value.quota.used.storage;
        hard.value = listProjects.value.quota.hard.storage;
        if(hard.value==-1){
          power1.value=0
        }else{
          power1.value=Math.ceil((storage.value/hard.value)*100)
        }
      }
    });
    const { listProjects, isLoading, dataSummary,status } = useNamespacedGetters(
      REGISTRY,
      ["listProjects", "isLoading", "dataSummary","status"]
    );

    const { getSummary, getListProjects } = useNamespacedActions(REGISTRY, [
      "getSummary",
      "getListProjects",
    ]);
    
    const deleteRegistry = ref(false);
    const { setLoadCard } = useNamespacedMutations(REGISTRY, ["setLoadCard"]);
    const power = ref(12);
    const artifac = ref(0);
    const storage = ref(0);
    const hard = ref(0);
    const power1 = ref(0);
    const nameProject = ref(
      JSON.parse(localStorage.getItem("currentProj") || "{}")
    );
    const role = localStorage.getItem("role")
    return {
      getListProjects,
      listProjects,
      getSummary,
      dataSummary,
      power,
      power1,
      isLoading,
      nameProject,
      role,
      artifac,
      storage,
      hard,
      setLoadCard,
      status,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>