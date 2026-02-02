<template>
  <div>
    <v-card class="rounded-lg pa-7" flat>
      <v-row>
        <v-col>
          <!-- <div class="d-flex">
            <span class="page-title pb-5">Client Export</span>
          </div> -->
            <v-row>
              <v-col class="pb-0 " cols="8" md="7">
                <div class="d-flex buttonsizing">
                  <v-btn
                  text
                  width="200"
                  class="fz-14 mr-2"
                  color="secondary"
                  depressed
                  @click="() => {
                    validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                      title = 'kubeconfig'
                      openDialogPw = true
                    })
                  }"
                  >
                    Download Kubernetes Config
                    <v-icon
                    right
                    dark
                    >mdi-download</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col class="mb-0 pb-0 pt-0" cols="8" md="7">
                <div class="d-flex buttonsizing">
                  <v-btn
                  text
                  width="100"
                  class="fz-14 mr-2"
                  color="secondary"
                  depressed
                  :disabled="isLoadingBtn"
                  :loading="isLoadingBtn"
                  @click="() => {
                    validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                      title = 'generateToken'
                      openDialogPw = true
                    })
                  }"
                  >
                    Generate Token
                  </v-btn>
                </div>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12" md="6">
                <!-- <p class="font-weight-bold">Token</p> -->
                <v-textarea
                v-if="showToken"
                rows="15"
                outlined
                name="input-7-4"
                placeholder=""
                readonly
                :value="tokenDashboard"
                ></v-textarea>
              </v-col>
            </v-row>
        </v-col>
      </v-row>
      <dialog-pw
      v-if="openDialogPw"
      v-model="openDialogPw"
      :title="title"
      />
    </v-card>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from '@vue/composition-api'
import dialogPw from './dialog-password.vue'
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from 'vuex-composition-helpers'
import { HARBOR } from './namespace'

export default {
  components: {
    dialogPw
  },
  setup(props, context) {
    const { getToken, generateToken } = useNamespacedActions(HARBOR, ["getToken", "generateToken"])
    const { isLoadingBtn, tokenDashboard, } = useNamespacedGetters(HARBOR, ["isLoadingBtn", "tokenDashboard", ])
    const { showToken } = useNamespacedState(HARBOR, ["showToken"])
    const { harborid } = context.root._route.params;

    const title = ref('')
    const openDialogPw = ref(false)
    const {
      validateprivilages,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
    ]);

    const generate = () => {
      generateToken({harborid: harborid})
    }

    onMounted(() => {
      // getToken({harborid: harborid})
    })
    
    return{
      openDialogPw,
      validateprivilages,
      tokenDashboard,
      generate,
      isLoadingBtn,
      title,
      showToken
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEKAHARBOR/setShowToken', false)
    next()
  }
}
</script>

<style scoped>
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

@media only screen and (max-width: 600px) {
  .buttonsizing {
    flex-direction: column;
  }
  .v-btn{
    margin-bottom: 4px;
  }
}
</style>