<template>
  <div class="d-flex justify-center align-center">
    <v-menu ref="menu" v-model="showMenu" offset-y allow-overflow>
      <template v-slot:activator="{ on, attrs }">

        <div id="OrganizationNav" v-on="on" v-bind="attrs" style="cursor: pointer" class="d-flex justify-center align-center navmenu">
          <v-icon style="width: 20px; height: 20px" class="mr-3">$vuetify.icons.organizationIcon</v-icon>
          <p class="mb-0">
            {{ userType === "C" ? "Organization" : "Manage Project" }}
          </p>
         
          <transition name="rotate">
            <v-icon id="IconOrg" :class="{ rotate: !showMenu }">mdi-chevron-up</v-icon>
          </transition>
        </div>
      </template>

      <v-list v-if="userType === 'C'">
        <v-list-item to="/voucher"
        :style="{ 'display': arrayListItemMenuNotShow.includes('voucher') ? 'none': '' }"
        >
          <v-list-item-title>Voucher</v-list-item-title>
        </v-list-item>
        <v-list-item to="/role-permission"
        :style="{ 'display': arrayListItemMenuNotShow.includes('manage role') ? 'none': '' }"
        >
          <v-list-item-title>Manage Role</v-list-item-title>
        </v-list-item>
        <v-list-item to="/setting-organization"
        :style="{ 'display': arrayListItemMenuNotShow.includes('organization') ? 'none': '' }"
        >
          <v-list-item-title>Setting Organization</v-list-item-title>
        </v-list-item>
        <v-list-item to="/project">
          <v-list-item-title>List Project</v-list-item-title>
        </v-list-item>
        <v-list-item to="/audit-log">
          <v-list-item-title>Audit Log</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else>
        <v-list-item to="/voucher">
          <v-list-item-title>Voucher</v-list-item-title>
        </v-list-item>
        <v-list-item to="/project">
          <v-list-item-title>List Project</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item v-if="!loading && !unlimited && userType === 'C'" to="/service-limit">
          <v-list-item-title>Service Limit</v-list-item-title>
        </v-list-item> -->
        <v-list-item to="/audit-log">
          <v-list-item-title>Activity</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="personalStatus" to="/setting-organization">
          <v-list-item-title>Setting Organization</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    
    <BroadcastBtn v-if="isShowComponentBroadcast" />
  </div>
</template>

<script>
import localstorage from "@/lib/localstorage";
import BroadcastBtn from "./navmenu/broadcastBtn.vue";
import api from "@/lib/api";
import externalSubDomain from '@/lib/externalSubDomain'
import {ref} from '@vue/composition-api'

export default {
  components: {
    BroadcastBtn,
  },
  data() {
    return {
      caret: false,
      showMenu: false,
      x: null,
      y: null,
      tri: null,
      personalStatus: false,
      isShowComponentBroadcast: true,
      arrayListItemMenuNotShow: [],
    };
  },
  computed: {
    userType() {
      return localstorage.getItem("type");
    },
  },
  watch: {
    showMenu: function (val) {
      if (val) {
        const nav = document.getElementById("IconOrg");
        const content = document.getElementsByTagName("BODY")[0];
        const img = document.createElement("img");
        img.src = require("@/assets/tri.png");
        img.id = "profile-arrow";
        img.style.position = "fixed";
        img.style.top = `${nav.offsetTop + nav.offsetHeight - 4}px`;
        img.style.left = `${nav.offsetLeft}px`;
        img.style.zIndex = "20";
        this.tri = img;
        content.insertBefore(img, content.firstElementChild);
      } else {
        this.tri.remove();
      }
    },
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

        if (thereIsErrorMessage && err.response.data.data !== "record not found") {
          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
      }
      this.loading = false;
    },
    async setBroadcast() {
      const host = window.location.host;
      const parts = host.split('.');
      const subDomain = parts[0];
      const subDomainCloudeka = externalSubDomain.subDomainCloudekaArray;
      if (subDomainCloudeka.includes(subDomain)) {
          this.isShowComponentBroadcast = true;
        } else {
          this.isShowComponentBroadcast = false;
        }
    },
    async setShowingMenuHeaderNav() {
      const role = localStorage.getItem('role')
      if (role !== "Superadmin" || role === 'Customer-Care' || role === 'GodMode') {
        const privilages = JSON.parse(localStorage.getItem('privilages'));
        privilages.map((x) => {
          let name = x.name.toLowerCase()
          if (x.disable) {
            this.arrayListItemMenuNotShow.push(name)
          }
        })      
      }

    },
  },
  mounted() {
    this.getPersonalStatus();
    this.setBroadcast();
    this.setShowingMenuHeaderNav();
  },
};
</script>

<style lang="scss" scoped>
[role="menu"] {
  margin-top: 10px;
}
.rotate {
  transform: rotate(+180deg);
}
.v-list-item {
  min-height: 38px;
}
p,
.v-list-item__title {
  font-weight: 700;
  font-size: 12px;
  line-height: 1.4;
}
</style>
