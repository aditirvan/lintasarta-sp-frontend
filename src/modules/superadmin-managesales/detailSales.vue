<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-row>
      <v-col class="d-flex flex-row align-center">
        <p class="mb-0 font-weight-bold fz-21">Detail Sales</p>
      </v-col>
    </v-row>

    <p v-if="loading" class="text-center">
      <beat-loader color="gray" size="10px" class="mr-2" />
    </p>

    <template v-else>
      <template v-if="sales">
        <v-row>
          <v-col>
            <p>
              <b>Name</b>
            </p>

            <p>{{ sales.fullname }}</p>
          </v-col>

          <v-col>
            <p>
              <b>Phone Number</b>
            </p>

            <p>{{ sales.phone_number }}</p>
          </v-col>

          <v-col>
            <p>
              <b>Email</b>
            </p>

            <p>{{ sales.email }}</p>
          </v-col>

          <v-col>
            <p>
              <b>Join Date</b>
            </p>

            <p>{{ $moment(sales.created_at).format("DD MMMM YYYY") }}</p>
          </v-col>

          <v-col>
            <p>
              <b>Organization</b>
            </p>

            <p>{{ sales.organization.name || "-" }}</p>
          </v-col>

          <v-col>
            <p>
              <b>Role</b>
            </p>

            <p>{{ "diisi dr property yg mana y" }}</p>
          </v-col>

          <v-col>
            <p>
              <b>Status</b>
            </p>

            <p>{{ sales.status }}</p>
          </v-col>
        </v-row>
      </template>
    </template>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      sales: null,
    };
  },
};
</script>
