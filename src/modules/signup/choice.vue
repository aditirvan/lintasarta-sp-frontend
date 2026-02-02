<template>
  <v-container class="responsive-container">
    <h1 class="text-center" style="margin: 30px 0 50px">
      What will you be using for?
    </h1>

    <v-row>
      <v-col cols="12" sm="6">
        <v-card
          border-color="primary"
          outlined
          cols="12"
          sm="6"
          class="choice"
          @mouseover="personalhover = true"
          @mouseleave="personalhover = false"
          @click="changeType('P')"
        >
          <v-icon x-large :color="personalhover ? '#1F60A8' : '#556272'">
            mdi-account
          </v-icon>

          <h2 style="margin: 10px 0">SME</h2>

          <p style="color: #a5b3bf" class="fz-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card
          border-color="primary"
          outlined
          cols="12"
          sm="6"
          class="choice"
          @mouseover="corporatehover = true"
          @mouseleave="corporatehover = false"
          @click="changeType('C')"
        >
          <v-icon x-large :color="corporatehover ? '#1F60A8' : '#556272'">
            mdi-domain
          </v-icon>

          <h2 style="margin: 10px 0">Enterprise</h2>

          <p style="color: #a5b3bf" class="fz-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import localstorage from "@/lib/localstorage";

export default {
  props: {
    type: {
      type: String,
      default: () => "C",
    },
  },
  data() {
    return {
      hover: false,
      personalhover: false,
      corporatehover: false,
    };
  },
  methods: {
    changeType(char) {
      localstorage.setItem("type", char);
      this.$emit("changeType", char);
    },
  },
};
</script>

<style scoped>
.choice {
  cursor: pointer;
  padding: 30px;
  height: 175px;
  border-radius: 10px;
}

.choice:hover {
  border-color: #1f60a8;
}

.choice:hover > h2 {
  color: #1f60a8;
}

.responsive-container {
  width: 870px;
}

@media only screen and (max-width: 870px) {
  .responsive-container {
    width: 100%;
  }
}
</style>
