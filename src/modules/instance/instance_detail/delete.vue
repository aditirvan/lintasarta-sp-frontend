<template>
  <v-container fluid>
    <v-row>
      <v-col cols=12 class="px-0 py-0">
        <v-card flat class="pa-3 rounded-lg">
          <v-card-title>
            <div class="headline font-weight-bold font--text">Delete</div>
          </v-card-title>
          <v-card-text>
            <p>This is irreversible. All Instance data will be scrubbed and irretrievable.</p>
            <p>
              <b>Associated Resources</b></p>
            <p>Resources associated with this Instance will not be automatically destroyed, and you may continue to be
              billed for them.</p>
            <p>You can select some or all of these resources to be destroyed along with the Instance.</p>
          </v-card-text>
          <v-card-text>
            <v-btn
                :disabled="isLoading "
                depressed
                 @click="
                  () => {
                    validateprivilages([
                      'Storage',
                      'editor',
                    ]).then(() => {
                    opendialogdeleteinstance = true
                    });
                  }
                              "
                class="error" height="50" width="150">
              <span style="font-size:12px">{{ isLoading ? 'Loading...' : 'Delete this Instance' }}</span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <dialogDeleteInstance v-model="opendialogdeleteinstance" @close="doDelete"/>
  </v-container>
</template>
<script>
import dialogDeleteInstance from './dialogDeleteInstance'
import {mapGetters} from "vuex";
import {useNamespacedActions} from "vuex-composition-helpers";
import {INSTANCE} from "@/modules/instance/namespace";

export default {
  computed: {
    ...mapGetters({
      instanceDetail: "INSTANCE/getInstanceDetail",
      isLoading: "INSTANCE/getIsLoading",
    }),
  },
  setup(props, context) {
    const {
      deleteInstance,
    } = useNamespacedActions(INSTANCE, ["deleteInstance"]);
    const {
      validateprivilages,
      validateprivilagesync,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
    ]);
    return {
      validateprivilages,
      validateprivilagesync,
      deleteInstance
    }
  },
  components: {dialogDeleteInstance},
  data() {
    return {
      opendialogdeleteinstance: false
    }
  },
  methods: {
    async doDelete(val) {
      this.opendialogdeleteinstance = false
      if (val) {
        const res = await this.deleteInstance({
          project_id: this.instanceDetail.project_id,
          instance_id: this.instanceDetail.id
        })
        if (res) return this.$router.push('/instance')
      }
    }
  }
}
</script>
<style scoped>
.headline {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>