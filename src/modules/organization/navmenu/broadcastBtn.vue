<template>
  <v-menu ref="menu" v-model="showMenu" offset-y allow-overflow bottom left nudge-right="25">
    <template v-slot:activator="{ on, attrs }">
      <div
        id="BroadcastMemberNav"
        v-on="on"
        v-bind="attrs"
        v-if="role !== 'Superadmin'"
        style="cursor: pointer"
        class="d-flex justify-center align-center navmenu"
      >
        <v-icon style="width: 20px; height: 20px" class="mr-3"> $vuetify.icons.broadcastBlue </v-icon>

        <p class="mb-0">Broadcast</p>
        <transition name="rotate">
          <v-icon id="IconBroadc" :class="{ rotate: !showMenu }">mdi-chevron-up</v-icon>
        </transition>
      </div>
    </template>

    <v-list>
      <v-list-item v-if="loading">
        <v-list-item-title class="text-center">
          <beat-loader color="gray" size="10px" class="mr-2" />
        </v-list-item-title>
      </v-list-item>

      <template v-else>
        <template v-if="broadcasts.length">
          <ListItem v-for="broadcast in broadcasts" :key="'list-item-' + broadcast.id" :item="broadcast" />
        </template>

        <v-list-item v-else>
          <v-list-item-title class="text-center"> No broadcast </v-list-item-title>
        </v-list-item>
      </template>

      <v-list-item>
        <v-list-item-title>
          <v-btn to="/broadcast-user" depressed block height="58" class="secondary fz-16px"> See All Broadcast </v-btn>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import localstorage from "@/lib/localstorage";
import ListItem from "./listItem.vue";
import api from "@/lib/api";

export default {
  components: {
    ListItem,
  },
  data() {
    return {
      showMenu: false,
      loading: false,
      broadcasts: [],
    };
  },
  computed: {
    role() {
      return localstorage.getItem("role");
    },
  },
  methods: {
    async getBroadcasts() {
      this.loading = true;

      try {
        const res = await api.GET("/user/broadcast");
        this.broadcasts = res.data && res.data.length ? res.data : [];
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying broadcasts";
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
  },
  mounted() {
    this.getBroadcasts();
  },
  watch: {
    showMenu: function (val) {
      if (val) {
        const nav = document.getElementById("IconBroadc");
        const content = document.getElementsByTagName("BODY")[0];
        const img = document.createElement("img");
        img.src = require("@/assets/tri.png");
        img.id = "profile-arrow";
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
};
</script>

<style scoped>
[role="menu"] {
  margin-top: 9px;
}

.v-list-item__title {
  font-size: 12px;
}

#BroadcastMemberNav p {
  font-weight: 700;
  font-size: 12px;
}

.fz-16px {
  font-size: 16px;
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
