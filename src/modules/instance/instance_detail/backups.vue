<template>
  <v-container fluid>
    <v-row>
      <v-col class="pa-0">
        <v-card flat class="rounded-lg pa-3 pb-5">

          <v-card-text>
            <div class="headline font-weight-bold font--text">Backups</div>
            <br/>
            <p>Enabling backups will automatically create a snapshot of your Instance once a week.
            </p>
            <!-- <p>Enabling backups for this VM will cost $4.00 per month.</p> -->

          </v-card-text>
          <v-card-text class="pt-0">
            <v-btn
                depressed
                @click="() => {
                  isEnableBackupDialogOpen = true;
                }"
                class="secondary" height="50" width="150">Enable Backups
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols=12 class="px-0 py-5">
        <v-card flat class="rounded-lg pa-3">
          <v-card-text>
            <div class="headline font-weight-bold font--text">Instance backups</div>
          </v-card-text>
          <v-card-text>
            <p>You currently don't have any backups for this Instance.</p>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
    <dialogEnableBackup
        v-model="isEnableBackupDialogOpen"
        @close="($event) => {
          isEnableBackupDialogOpen = $event;
        }"
    />
  </v-container>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api';
import dialogEnableBackup from './dialogEnableBackup'

export default defineComponent({
  components: {
    dialogEnableBackup,
  },
  setup() {
    const isEnableBackupDialogOpen = ref(false);

    return { isEnableBackupDialogOpen };
  },
})
</script>
<style scoped>
.headline {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>