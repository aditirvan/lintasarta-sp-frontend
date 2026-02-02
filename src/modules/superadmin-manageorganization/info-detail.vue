  <template>
  <div>
    <v-card flat>
      <v-card-text class="pa-7 pt-3 pb-3">
        <v-row>
          <!-- <v-col>
            <p class="mb-2">
              <b>Address:</b>
            </p>
            {{ currentOrg.address }}
          </v-col> -->

          <!-- <v-col>
            <p class="mb-2">
              <b>NPWP Number:</b>
            </p>
            {{ currentOrg.npwp_corporate }}
          </v-col> -->

          <!-- <v-col>
            <p class="mb-2"><b>Phone:</b></p>
            {{ currentOrg.phone_number_org }}
          </v-col> -->

          <v-col md="2">
            <p class="mb-2"><b>Type:</b></p>
            {{ currentOrg.is_personal ? 'SME' : 'Enterprise' }}
          </v-col>

          <v-col md="2">
            <p class="mb-2"><b>Created Date:</b></p>
            {{ $FormatDate(currentOrg.created_at) }}
          </v-col>

          <v-col md="2">
            <p class="mb-2"><b>Status:</b></p>
            <v-chip v-if="currentOrg.status === 1" class="mr-2 my-1" small :color="green" outlined>
              <b> {{ organizationStatus(currentOrg.status) }} </b>
            </v-chip>
            <v-chip v-else class="mr-2 my-1" small color="red" outlined>
              <b> {{ organizationStatus(currentOrg.status) }} </b>
            </v-chip>
          </v-col>
          <v-col md="2">
            <p class="mb-2"><b>Dekaprime:</b></p>
            <v-chip small :color="currentOrg.dekaprime_organization_id ? 'primary' : ''" :text-color="currentOrg.dekaprime_organization_id ? 'white' : ''">
              <b> {{ currentOrg.dekaprime_organization_id ? "Yes" : "No" }} </b>
            </v-chip>
          </v-col>

          <v-col md="2">
            <p class="mb-2">
              <b>Suspend Type:</b>
            </p>
            <v-badge v-if="currentOrg.suspend_type" :content="currentOrg.suspend_type" color="error" class="ml-1" />
            <span v-else>-</span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
        <v-card-text class="pa-7 pt-3 pb-3">
          <v-row>
            <v-col md="2">
              <p class="mb-2"><b>Primary or Business Address:</b></p>
              {{ currentOrg.address }}
            </v-col>
            <v-col>
            <p class="mb-2"><b>Phone:</b></p>
              {{ currentOrg.phone_number_org }}
            </v-col>
            <v-col md="2">
              <p class="mb-2"><b>Country:</b></p>
              {{ currentOrg.country }}
            </v-col>
            <v-col md="2">
              <p class="mb-2"><b>City:</b></p>
              {{ currentOrg.city }}
            </v-col>
            <v-col md="2">
              <p class="mb-2"><b>Region:</b></p>
              {{ currentOrg.region }}
            </v-col>
            <v-col md="2">
              <p class="mb-2"><b>Zip/Post:</b></p>
              {{ currentOrg.zip }}
            </v-col>
          </v-row>
        </v-card-text>
      <v-divider></v-divider>
      <v-card-text class="pa-7 pt-3 pb-3">
        <v-row>
          <v-col md="2">
            <p class="mb-2"><b>Sales:</b></p>
            {{ currentOrg.sales && currentOrg.sales.fullname ? currentOrg.sales.fullname : "-" }}
          </v-col>
          <v-col md="2">
            <p class="mb-2"><b>Sales Phone Number:</b></p>
            {{ currentOrg.sales && currentOrg.sales.phone_number ? currentOrg.sales.phone_number : "-" }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { organizationStatus } from "@/lib/formatter";

export default {
  props: {
    currentOrg: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    return {
      organizationStatus
    };
  },
};
</script>

<style lang="scss" scoped></style>
