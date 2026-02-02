<template>
  <v-container fluid >
    <v-row>
      <v-col class="pa-0">
        <v-card flat class="rounded-lg pa-3">
          <v-card-text>
                        <div class="headline font-weight-bold font--text">Recovery</div>

            </v-card-text>
          <v-card-text>
            <p>
              Booting from a recovery ISO allows you to recover from kernel
              mismatches and perform repairs on corrupted file systems. Learn
              more.
            </p>
          </v-card-text>
          <v-card-text>
            <v-row class="ma-0">
              <v-col>
                <v-row
                  class="boot mr-3 rounded-lg pa-7"
                  style="height:100%; cursor:pointer"
                  @click="()=> radios = 'hdd'"
                  :class="{highlight: (()=> radios == 'hdd')()}"

                >
                  <v-col 
                  class="flex-grow-0 align-self-center px-0">
                    <v-radio-group hide-details class="mt-0" v-model="radios">
                      <v-radio value="hdd"> </v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col>
                    <h2>Boot from Hard Drive</h2>
                    <br />
                    <p class="mb-0" style="color:#A5B3BF; font-size:12px">
                      When this option is selected, your Instance will boot from
                      the hard drive the next time it is shut down completely
                      and restarted.
                    </p>
                  </v-col>
                </v-row>
              </v-col>
              <v-col>
                <v-row
                  class="boot ml-3 rounded-lg pa-7"
                  :class="{highlight: (()=> radios == 'iso')()}"
                  style="height:100%; cursor:pointer;"
                  @click="()=> radios = 'iso'"
                >
                  <v-col class="flex-grow-0 align-self-center ">
                    <v-radio-group hide-details class="mt-0" v-model="radios">
                      <v-radio value="iso"> </v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col>
                    <h2>Boot from Recovery ISO</h2>
                    <br />
                    <p style="color:#A5B3BF; font-size:12px">

                      When this option is selected, your Instance will boot from
                      the Recovery ISO the next time it is shut down completely
                      and restarted.
                    </p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <p>
              A Instance boots from its hard drive by default. If you have
              booted from the Recovery ISO and are ready to boot from the hard
              drive again:
            </p>

            <p>
              1. <b>Shut down completely:</b> From the command line or using the
              On/Off switch above, shut down the Instance. Note that a reboot is
              not sufficient to change the boot device.
            </p>
            <p>
              2. <b>Power on:</b> Use the On/Off switch above to power the
              Instance on and boot from its hard drive.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { useNamespacedActions } from 'vuex-composition-helpers';
export default {
  setup(){
    const {
      validateprivilages,
      validateprivilagesync,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
    ]);
    return {
      validateprivilagesync
    }
  },
  data() {
    return { radios: "" };
  },
};
</script>
<style scoped lang="scss">
.headline {
  font-weight: 600;
  font-family: "Poppins", sans-serif;
}
.v-input--radio-group{
  ::v-deep .v-icon__svg{
    transform: scale(1.5);
  }
}
.boot:not(.highlight){
  border: 1px solid #A5B3BF
}
.boot.highlight{
  border: 1px solid #2c94d2;
}
</style>