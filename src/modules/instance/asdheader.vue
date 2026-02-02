<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg elevation-0 mb-4">
        <v-card-title class="px-7 py-4">
          <v-row class="align-center asd-header-container">
            <!-- blue circle -->
            <v-col class="flex-grow-0 blue-circle-col">
              <div class="primary blue-circle" />
            </v-col>

            <!-- instance info -->
            <v-col class="py-0 justify-start">
              <div class="headline font-weight-bold font--text text-uppercase">
                nama instance
              </div>
              <p class="my-0" style="font-size: 12px">
                in nama project / 1 vCPU / 1 GB RAM / 1 GB Root Disk
              </p>
            </v-col>

            <!-- on off & console btn -->
            <v-col class="d-flex flex-grow-0 flex-row justify-end pt-0">
              <p
                class="align-self-center mb-0 font-weight-bold"
                style="white-space:nowrap"
              >
                ON
              </p>

              <div style="display: inline-block; width: 20px; height: auto" />

              <v-switch
                :disabled="loading"
                v-model="isTurnedOn"
                inset
                @click="toggleSwitch"
              />
            </v-col>
          </v-row>
        </v-card-title>

        <v-divider />

        <!-- ips -->
        <v-card-text class="py-0">
          <v-row>
            <v-col>
              <p class="mb-0" style="font-size: 12px">
                <span style="font-weight: 700">IP Internal:</span>
                -
              </p>
            </v-col>

            <v-col>
              <p class="mb-0 " style="font-size: 12px">
                <span style="font-weight: 700">IP Gateway:</span>
                -
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      isTurnedOn: true,
    };
  },
  methods: {
    toggleSwitch() {
      this.isTurnedOn = !this.isTurnedOn;
    },
  },
};
</script>

<style lang="scss" scoped>
.blue-circle {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}

.router-link-active {
  p,
  .v-icon {
    color: var(--v-primary);
    font-weight: 700;
  }
}

.v-card__text {
  padding-top: 15px;
  padding-bottom: 15px;
  font-weight: 400;
}

.linkpointer {
  font-weight: 600;
}

.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }

  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}

.blue-circle-col {
  display: none;
}

.asd-header-container {
  flex-direction: column !important;
}

@media only screen and (min-width: 768px) {
  .blue-circle-col {
    display: block;
  }

  .asd-header-container {
    flex-direction: row !important;
  }
}
</style>
