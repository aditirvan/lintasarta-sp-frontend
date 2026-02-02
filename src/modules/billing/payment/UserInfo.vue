<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text>
      <p class="fz-21 font-weight-bold">
        Detail Payment
      </p>
    </v-card-text>

    <v-card-text class="pt-0">
      <v-row>
        <v-col>
          <p>
            <b>
              Organization
            </b>
          </p>
          <p>
            {{ currentOrg.name }}
          </p>
        </v-col>

        <v-col>
          <p><b>Total Project</b></p>
          <p>
            {{ totalproject }}
          </p>
        </v-col>

        <v-col>
          <p><b>Project</b></p>
          <p
            :class="{
              'red--text': error,
            }"
          >
            {{ projectname }}
            {{ error ? "Sorry, project not found" : "" }}
          </p>
        </v-col>

        <v-col>
          <p>
            <b>
              Email
            </b>
          </p>
          <p :style="{ color: '#1F60A8' }">
            {{ userprofile.email }}
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["currentOrg", "totalproject", "projectname", "error", "userprofile"],
};
</script>
