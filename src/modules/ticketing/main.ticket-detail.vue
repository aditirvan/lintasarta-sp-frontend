<template>
  <router-view v-if="currentTicket" :currentTicket="currentTicket" />
</template>
<script lang="ts">
import localstorage from "@/lib/localstorage";
import { defineComponent } from "@vue/composition-api";
import {
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { TICKET } from "./namespace";
import { fetchticketbyid } from "./fetchticketbyid";
export default defineComponent({
   setup() {
    const { setCurrentTicket } = useNamespacedMutations(
      TICKET,
      ["setCurrentTicket"]
    );
    const { currentTicket } = useNamespacedState(TICKET, ["currentTicket"]);
    return {
      setCurrentTicket,
      currentTicket,
    };
   },

  beforeRouteUpdate: function (to: any, from: any, next: any) {
    if (to.name.match(/^ticket-detail/))
    return next();
    fetchticketbyid(to.params.ticketid)
      .then((response) => {
        console.log("Log 1");
        const ticket = response.data.data;
        this.setCurrentTicket(ticket);
        next();
      })
      .catch(() => {
        console.log("Log 2");
        next("/notfound");
      });
  },
  beforeRouteEnter: function (to: any, from: any, next: any) {
    fetchticketbyid(to.params.ticketid)
      .then((response) => {
        console.log("Log 3");
        const ticket = response.data.data;
        console.log(ticket);
        this.setCurrentTicket(ticket);
        next();
      })
      .catch(() => {
        console.log("Log 4");
        // next("/notfound");
        next();
      });
  },
});
</script>