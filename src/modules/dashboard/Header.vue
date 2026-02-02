<template>
  <v-app-bar app color="white" :clipped-left="$vuetify.breakpoint.lgAndUp" flat>
    <v-app-bar-nav-icon @click="triggerdrawer">
      <v-icon>mdi-menu</v-icon>
    </v-app-bar-nav-icon>

    <v-toolbar-title style="width: 195px" class="ml-0 pl-2">
      <router-link to="/">
        <v-img
          v-if="imgLogo"
          max-height="64px"
          width="160px"
          :src="imgLogo" />
      </router-link>
    </v-toolbar-title>
    <component
      v-for="item in leftnavmenu"
      :key="item.component"
      :is="item.component"
    ></component>
    <v-spacer />
    <v-toolbar-items>
      <component
        v-for="item in navCustomMenu"
        :key="item.name"
        :is="item.name"
      ></component>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import {
  useGetters,
  useMutations,
  useNamespacedState,
  useNamespacedGetters
} from "vuex-composition-helpers";
import selectproject from "@/modules/project/selectproject";
import { computed, ref, onMounted } from "@vue/composition-api";
import api from "@/lib/api";
import externalSubDomain from '@/lib/externalSubDomain'

export default {
  setup() {
    const { openModal, activeProject } = selectproject();
    const { getleftnavmenu: leftnavmenu,getnavcustommenu: navCustomMenu } = useNamespacedGetters("ROLEPERMISSION", [
      "getleftnavmenu", "getnavcustommenu"
    ]);
    const { triggerdrawer } = useMutations({
      triggerdrawer: "DASHBOARD/triggerdrawer",
    });
    const navCustomeMenuSorted = computed(() => {
      return navCustomMenu.value.slice().sort((a, b) => {
        return b.sort - a.sort;
      });
    });
    const host = window.location.host;
    const parts = host.split('.');
    const subDomain = parts[0];
    const subDomainCloudeka = externalSubDomain.subDomainCloudekaArray;
    const imgLogo = ref('');

    onMounted(() => {
      if (subDomainCloudeka.includes(subDomain)) {
        imgLogo.value = require('@/assets/logo1.svg')
      } else {
        getNameImage(subDomain)
        // imgLogo.value = 'logo-bank-sumut.png'
      }
    });

     async function getNameImage(subDomain) {
      try {
        const res = await api.GET(
          "/label/get-image/" + subDomain
        );
        imgLogo.value = res.data.logo_name
      } catch (err) {
        imgLogo.value = require('@/assets/logo1.svg')
      }
    }
    return {
      leftnavmenu,
      openModal,
      activeProject,
      navCustomMenu: navCustomeMenuSorted,
      triggerdrawer,
      imgLogo,
    };
  },
  methods: {
    getImgUrl(pic) {
      return require('@/assets/'+ pic)
    },
  },
};
</script>