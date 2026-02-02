<template>
  <div>
    <div class="row">
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container class="pa-8">
            <v-row>
              <v-col class="d-flex flex-row align-center pb-8">
                <p class="mb-0 fz-21 font-weight-bold">Open Support Ticket</p>
                <v-spacer/>
                <div class="linkpointer font-weight-bold fz-16">Ticket History</div>
                <div style="heigh:auto; width:30px"/>
                <v-btn to='/ticket/create-ticket' exact depressed class="secondary" width="165"><span class="fz-14">Create Ticket</span>
                </v-btn>
              </v-col>

            </v-row>
            <v-data-table
              :headers="headers"
              hide-default-footer
              :items="tickets"
              :items-per-page="5"
            >
              <template v-slot:footer="{ props }">
                <custom-footer-datatable :props="props"/>
              </template>
            </v-data-table>


          </v-container>
        </v-card>
      </v-col>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const headers = ref([
      { text: 'Subjet', value: 'subject' },
      { text: 'Ticket ID', value: 'id' },
      { text: 'Created Date', value: 'createddate' },
      { text: 'Status', value: 'status' },
    ])
    const tickets = ref([
      {
        subject: 'Account and billing support',
        id: '7999968969',
        createddate: 'Nov 1, 2020',
        status: 'Resolved'
      },
      {
        subject: 'Account and billing support',
        id: '7999968969',
        createddate: 'Nov 2, 2020',
        status: 'Resolved'
      },
      {
        subject: 'Sevice Limit Increase',
        id: '7999968969',
        createddate: 'Nov 4, 2020',
        status: 'Resolved'
      },
      {
        subject: 'Sevice Limit Increase',
        id: '7999968969',
        createddate: 'Nov 5, 2020',
        status: 'Resolved'
      },
      {
        subject: 'Sevice Limit Increase',
        id: '7999968969',
        createddate: 'Nov 4, 2020',
        status: 'Resolved'
      },
      {
        subject: 'Sevice Limit Increase',
        id: '7999968969',
        createddate: 'Nov 5, 2020',
        status: 'Resolved'
      },
      {
        subject: 'Sevice Limit Increase',
        id: '7999968969',
        createddate: 'Nov 4, 2020',
        status: 'Resolved'
      },
      {
        subject: 'Sevice Limit Increase',
        id: '7999968969',
        createddate: 'Nov 5, 2020',
        status: 'Resolved'
      }
    ])
    return {
      headers,
      tickets
    }
  }
})
</script>

<style scoped>
.v-btn {
  height: 55px !important;
}
</style>