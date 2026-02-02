<template>
  <div>
    <v-row>
      <v-col>
        <p class="mb-0 font-weight-bold fz-21">Broadcast</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select
          v-model="month"
          outlined
          :items="months"
          error-messages=""
          placeholder="Month"
        />
      </v-col>

      <v-col>
        <v-select
          v-model="year"
          outlined
          :items="years"
          :error-messages="year_error"
          placeholder="Year"
        />
      </v-col>

      <v-col cols="2">
          <v-btn
            depressed
            block
            height="50"
            class="secondary"
            @click="() => { month = null; year = null; year_error = ''; }"
          >
            Clear
          </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const year = 2022; // this year fase 1.3 team develop the broadcast feature
const years = [year];
const currentYear = new Date().getFullYear();
const longYear = currentYear - year;

for (let i = 0; i < longYear; i++) {
  years.push(year + i + 1);
}

export default {
  data() {
    return {
      search: "",
      month: null,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "November",
        "Desember",
      ],
      year: null,
      years,
      year_error: "",
    };
  },
  methods: {
    monthToNumber(month) {
      const index = this.months.findIndex((m) => m === month);
      return index + 1;
    },
  },
  watch: {
    year(newVal) {
      if (newVal) {
        this.year_error = "";
      }

      this.$router.push({
        query: { month: this.monthToNumber(this.month), year: newVal },
      });
    },
    month(newVal) {
      if (this.year) {
        this.$router.push({
          query: { year: this.year, month: this.monthToNumber(newVal) },
        });
      } else {
        this.year_error = "Value is required";
      }
    },
  },
};
</script>
