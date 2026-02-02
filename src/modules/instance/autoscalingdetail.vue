<template>
  <div>
    <!-- header -->
    <asdheader />

    <v-row>
      <!-- sidebar -->
      <asdsidebar />

      <!-- body -->
      <v-col cols="12" sm="8" md="10" class="pt-0">
        <!-- <router-view
                v-if="instanceDetail"
                :instanceid="instanceDetail.id"
                :instance="instanceDetail"
              ></router-view> -->
        <v-card flat class="rounded-lg pa-3">
          <v-card-text>
            <router-view />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import asdheader from "./asdheader.vue";
import asdsidebar from "./asdsidebar.vue";

export default {
  components: {
    asdheader,
    asdsidebar,
  },
  data() {
    return {
      loading: false,
    };
  },
};
</script>
