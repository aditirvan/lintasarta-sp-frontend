<template>
  <div>
    <v-card>
      <v-list-item>
        <v-list-item-content>
          <v-row>
            <v-col cols="8">
              <v-list-item-title class="firewall-title mb-4 mt-4 ml-2">
                Build, tag, and push Docker image
              </v-list-item-title>
            </v-col>
              <v-col cols="4">
                <div class="mb-4 mt-4 ml-2">
                  <a href="#"  style="float:right"
                    @click="download()" 
                  >
                  <v-icon color="info">mdi-download-box</v-icon>
                  DOWNLOAD CERTIFICATE
                  </a>
                </div>
              </v-col>
          </v-row>

          <v-divider></v-divider>

          <!-- <v-list-item-subtitle class="mb-2 mt-4 ml-4"
            >Update your nameserver setup</v-list-item-subtitle
          > -->
          <v-list-item-title class="mb-2 mt-4 ml-4">
            To install the Docker and for information on the steps below.
          </v-list-item-title>
          <!-- <v-list-item-title class="mb-2 mt-2 ml-4">
            1. Retrieve the docker login command that you can use authenticate
            your Docker client to your registry:
          </v-list-item-title>
          <v-list-item-title class="mb-2 mt-2 ml-4">
            <v-card style="background-color: #ebebeb" max-width="900">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    aws ecr get-login --no-include-email --region
                    us-west-1</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-list-item-title> -->
          <v-list-item-title class="mb-2 mt-2 ml-4">
            1. Run the Docker login command that was returned in the previous.
          </v-list-item-title>
          <v-list-item-title class="mb-2 mt-2 ml-4">
            <v-card style="background-color: #ebebeb" max-width="900">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    docker login {{ infoSystem.external_url }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-list-item-title>
          <v-list-item-title class="mb-2 mt-2 ml-4">
            2. Build your Docker image using the following command. For
            information on building a Docker file from scratch see the
            instruction
          </v-list-item-title>
          <v-list-item-title class="mb-2 mt-2 ml-4">
            <v-card style="background-color: #ebebeb" max-width="900">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    docker build -t "repo name" .
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-list-item-title>
          <v-list-item-title class="mb-2 mt-2 ml-4">
            3. After the build complete, tag your image so you can push the
            image to this repository:
          </v-list-item-title>
          <v-list-item-title class="mb-2 mt-2 ml-4">
            <v-card style="background-color: #ebebeb" max-width="900">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    docker tag REPOSITORY[:TAG]
                    {{ infoSystem.registry_url }}/{{
                      infoProj
                    }}/REPOSITORY[:TAG]
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-list-item-title>
          <v-list-item-title class="mb-2 mt-2 ml-4">
            4. Run the following command to push this image to your newly create
            cloudeka repository:
          </v-list-item-title>
          <v-list-item-title class="mb-6 mt-2 ml-4">
            <v-card style="background-color: #ebebeb" max-width="900">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    docker push
                    {{ infoSystem.registry_url }}/{{
                      infoProj
                    }}/REPOSITORY[:TAG]
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions>
        <v-row class="ml-4 mb-4">
          <v-btn
            color="primary"
            @click="$router.push(`/registry/${$route.params.project_name}`)"
            class="sd ml-2"
            height="45"
            width="180"
          >
            Back
          </v-btn>
          <!-- <v-btn
            color="success"
            height="45"
            width="180"
            outlined
            class="ml-8 sd"
          >
            Check Nameservers
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="grey darken-3"
                dark
                v-bind="attrs"
                v-on="on"
                class="ml-4"
              >
                mdi-information
              </v-icon>
            </template>
            <span>Check your site </span>
          </v-tooltip> -->
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
export default {
  setup() {
    onMounted(() => {
      getSystemInfo();
    });
     
    const { infoSystem,infoProj } = useNamespacedGetters(REGISTRY, ["infoSystem","infoProj"]);

    const { getSystemInfo,downloadCRT } = useNamespacedActions(REGISTRY, ["getSystemInfo","downloadCRT"]);

    // console.log("=======infoSystem============",infoSystem.value)
    // console.log("===================",infoProj.value)
    
    
    async function download() {
      await downloadCRT();
    }
    return {
      infoSystem,
      getSystemInfo,
      infoProj,
      download,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field--outlined fieldset {
  background: #ebebeb;
  color: black;
}

.v-list-item__title {
  white-space: normal;
}

.v-input {
  max-width: 400px;
}

::v-deep .v-btn--round .v-btn__content .v-icon {
  color: #d92c2c !important;
}

.sd {
  box-shadow: none;
  font-size: 14px;
}
</style>