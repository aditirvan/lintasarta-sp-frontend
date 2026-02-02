<template>
  <div>
    <v-col cols="3" class="ml-6"
      ><v-menu bottom right max-width="42%" :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            v-bind="attrs"
            v-on="on"
            class="bs"
            color="secondary"
            height="45"
          >
            Push Image Docker Command</v-btn
          >
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title class="fz-18">
              Push Image Docker Command
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="grey "
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="ml-2"
                  >
                    mdi-information
                  </v-icon>
                </template>
                <span
                  >Command references for pushing an image to this project</span
                >
              </v-tooltip>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-list-item-content>
                <v-list-item-title class="mb-4"
                  >Tag an image for this project:</v-list-item-title
                >
                <v-list-item-title
                  ><strong
                    >docker tag REPOSITORY[:TAG]
                    {{ dataSystem.registry_url }}/{{
                      projectName
                    }}/REPOSITORY[:TAG]</strong
                  ><v-btn
                    class="bs-tr"
                    @click="copy('tag')"
                    ref="tag"
                    :value="`docker tag REPOSITORY[:TAG] ${dataSystem.registry_url}/${projectName}/REPOSITORY[:TAG]`"
                    ><v-icon class="text-center"
                      >mdi-content-copy</v-icon
                    ></v-btn
                  ></v-list-item-title
                >
              </v-list-item-content>
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="mb-4">
            <v-list-item-title>
              <v-list-item-content>
                <v-list-item-title class="mb-4"
                  >Push an image to this project:</v-list-item-title
                >
                <v-list-item-title
                  ><strong
                    >docker push {{ dataSystem.registry_url }}/{{
                      projectName
                    }}/REPOSITORY[:TAG]</strong
                  ><v-btn
                    class="bs-tr"
                    @click="copy('push')"
                    ref="push"
                    :value="`docker push ${dataSystem.registry_url}/${projectName}/REPOSITORY[:TAG]`"
                    ><v-icon class="text-center"
                      >mdi-content-copy</v-icon
                    ></v-btn
                  ></v-list-item-title
                >
              </v-list-item-content>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu></v-col
    >
  </div>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
export default {
  props: {
    dataSystem: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    // onMounted(() => {
    //   getSystemInfo();
    // });
    // const { infoSystem } = useNamespacedGetters(REGISTRY, ["infoSystem"]);

    // const { getSystemInfo } = useNamespacedActions(REGISTRY, ["getSystemInfo"]);

    const projectName = computed(() => {
      return localStorage
        .getItem("projectname")
        .toLowerCase()
        .replace(" ", "-");
    });
    function copy(field) {
      const input = this.$refs[field].value;
      navigator.clipboard.writeText(input);
    }

    return {
      projectName,
      copy,
    };
  },
};
</script>

<style lang="scss" scoped>
.bs-tr {
  box-shadow: none !important;
  background-color: transparent !important;
}
.bs-tr::before {
  background-color: transparent;
}
</style>