<template>
  <v-menu v-model="showMenu" offset-y allow-overflow>
    <template v-slot:activator="{ on, attrs }">
      <div
        id="fooAnchor"
        class="d-flex justify-center align-center navmenu"
        v-on="on"
        v-bind="attrs"
      >
        <v-icon color="#1F60A8">mdi-circle</v-icon>
        <p style="white-space: nowrap" id="JohnDoe" class="mb-0 ml-2">
          {{ userprofile.fullname }}
        </p>
        <transition name="rotate">
          <v-icon id="NavProvileIcon" :class="{ rotate: !showMenu }"
            >mdi-chevron-up</v-icon
          >
        </transition>
      </div>
    </template>
    <v-list>
      <v-list-item to="/profile">
        <v-list-item-title>My Profile</v-list-item-title>
      </v-list-item>
      <v-list-item @click="signout">
        <v-list-item-title class="error--text">Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { ref } from "@vue/composition-api";
import {
  useNamespacedMutations,
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { HOMEPAGE } from "../homepage/namespace";
import { SUPERADMIN } from "./namespace";
import { I3GIS } from "../sast/namespace";
export default {
  setup(props, context) {
    const { setuser } = useNamespacedMutations("ROLEPERMISSION", ["setuser"]);
    const { userprofile } = useNamespacedState("ROLEPERMISSION", [
      "userprofile",
    ]);
    const {setCurrentOrg} = useNamespacedMutations('SUPERADMIN',['setCurrentOrg'])
    const {logout} = useNamespacedActions("HOMEPAGE",['logout'])
    const $router = context.root.$router;
    const showMenu = ref(false)
    const {setIsLogout} = useNamespacedMutations(I3GIS,['setIsLogout'])
    const timeout= (ms) =>{
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const signout = async () => {
      setIsLogout(true)
      document.getElementById('profile-arrow').remove()
      await timeout(750) // tolong jgn di hapus. untuk delete session iframe
      
      showMenu.value = false
      setCurrentOrg(null);
      logout()
    }
    return {
      showMenu,
      signout,
      userprofile,
      setCurrentOrg,
    };
  },
  watch: {
    showMenu: function (val) {
      if (val) {
        const nav = document.getElementById("NavProvileIcon");
        const content = document.getElementsByTagName("BODY")[0];
        const img = document.createElement("img");
        img.src = require("@/assets/tri.png");
        img.id = 'profile-arrow'
        img.style.position = "fixed";
        img.style.top = `${nav.offsetTop + nav.offsetHeight - 5}px`;
        img.style.left = `${nav.offsetLeft}px`;
        img.style.zIndex = "20";
        this.tri = img;
        content.insertBefore(img, content.firstElementChild);
      } else {
        this.tri.remove();
      }
    },
  },
  data() {
    return {
      x: null,
      y: null,
      showUserMenu: false,
      showCorporateMenu: false,
    };
  },
};
</script>

<style lang="scss" scoped>
[role="menu"] {
  margin-top: -10px;
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