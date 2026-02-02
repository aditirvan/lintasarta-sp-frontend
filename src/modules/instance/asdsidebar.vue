<template>
  <v-col cols="12" sm="4" md="2" class="pt-0">
    <v-card flat class="rounded-lg pa-3">
      <v-card-text>
        <router-link replace to="usage" class="flex-row d-flex">
          <p class="mb-0">Usage</p>
          <v-spacer />
          <v-icon>mdi-chevron-right</v-icon>
        </router-link>
      </v-card-text>

      <v-card-text>
        <router-link replace to="instance" class="flex-row d-flex">
          <p class="mb-0">Instance</p>
          <v-spacer />
          <v-icon>mdi-chevron-right</v-icon>
        </router-link>
      </v-card-text>

      <v-card-text>
        <router-link replace to="load-balancer" class="flex-row d-flex">
          <p class="mb-0">Load Balancer</p>
          <v-spacer />
          <v-icon>mdi-chevron-right</v-icon>
        </router-link>
      </v-card-text>

      <v-card-text>
        <router-link replace to="alarm" class="flex-row d-flex">
          <p class="mb-0">Alarm</p>
          <v-spacer />
          <v-icon>mdi-chevron-right</v-icon>
        </router-link>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {};
</script>

<style scoped>
.router-link-exact-active {
  font-weight: bold;
}

.router-link-exact-active > * {
  color: #1f60a8;
}
</style>
