<template>
  <v-main style="margin-top: 65px">
    <v-container fluid :style="{
        'background-image': 'url(' + require('@/assets/RegisterPage.png') + ')',
        'background-position': 'bottom right',
        'padding-bottom': '50px',
        'background-size':'contain',
        'height': '100%'
      }">
      <v-row>
        <v-col cols="10" offset="1" class="mt-7 pt-7 p-0 m-0">
          <v-card class="">
            <v-card-actions style="padding: 0px;">
              <v-tabs grow>
                <v-tab class="p-5" to="/image/snapshot"><h3 class="">Compute</h3></v-tab>
                <v-tab class="p-5" to="/image/backups"><h3 class="">Object Storage</h3></v-tab>
              </v-tabs>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="10" offset="1" class="">
          <v-card class="">
            <v-card-actions>
              <v-row>
                <v-col cols="6" class="pl-8">
                  <div class="headline font-weight-bold font--text pb-5">
                    Calculator Billing
                  </div>

                  <v-col cols="12" style="border-right: 1px solid #F1F2F2" class="pl-0 pr-15 pt-0">
                    <v-row>
                      <v-col sm="12">
                        <p class="font-weight-bold">Instance</p>
                        <v-text-field
                            maxlength="3"
                            id="Instance"
                            outlined
                            placeholder="Number of Instances"
                            v-model="instances">

                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col sm="12">
                        <p class="font-weight-bold">Select Operating System</p>
                        <v-select
                            id='SelectOS'
                            v-model="osSelected"
                            outlined
                            :items="selectOs"
                            placeholder="Select OS"
                        >
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col sm="12">
                        <p class="font-weight-bold">Memory</p>
                        <v-text-field
                            maxlength="3"
                            id="Memory"
                            outlined
                            placeholder="Number of Memory"
                            v-model="memory">

                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col sm="12">
                        <p class="font-weight-bold">vCPU</p>
                        <v-text-field
                            maxlength="3"
                            id="vCPU"
                            outlined
                            placeholder="Number of vCPU"
                            v-model="memory">

                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col sm="12">
                        <p class="font-weight-bold">Volume Storage</p>
                        <v-text-field
                            maxlength="3"
                            id="storage"
                            outlined
                            placeholder="Number of Volume Storage"
                            v-model="storage">

                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col sm="12">
                        <v-btn
                            depressed
                            id="AddToEstimate"
                            block
                            height="58"
                            class="secondary"
                        >
                          <span style="font-size:16px">Add to Estimate</span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
                <v-col cols="6" class="pl-15 pr-15">
                  <div class="headline font-weight-bold font--text pb-5">
                    Summary
                  </div>

                  <v-row>
                    <v-col sm="12">
                      <p class="font-weight-bold primary--text">Compute</p>
                      <div class="d-flex">
                        <p class="p-2">2 Ghz Processor</p>
                        <p class="ml-auto p-2 font-weight-bold">IDR 400,000</p>
                      </div>
                      <div class="d-flex">
                        <p>2 GB RAM</p>
                        <p class="ml-auto p-2 font-weight-bold">IDR 360,000</p>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col sm="12">
                      <p class="font-weight-bold primary--text">Storage</p>

                      <div class="d-flex">
                        <p class="p-2">0 GB ioSTOR-100 100 GB ioSTOR-250</p>
                        <p class="ml-auto p-2 font-weight-bold">IDR 400,000</p>
                      </div>

                      <div class="d-flex">
                        <p class="p-2">2 GB RAM</p>
                        <p class="ml-auto p-2 font-weight-bold">IDR 360,000</p>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col sm="12">
                      <p class="font-weight-bold primary--text">Network</p>

                      <div class="d-flex">
                        <p class="p-2">NSX Edge - Compact</p>
                        <p class="ml-auto p-2 font-weight-bold">IDR 400,000</p>
                      </div>

                      <div class="d-flex">
                        <p class="p-2">3000 GB Traffic</p>
                        <p class="ml-auto p-2 font-weight-bold">IDR 360,000</p>
                      </div>

                      <div class="d-flex">
                        <p class="p-2">1 IPv4 Addresses</p>
                        <p class="ml-auto p-2 font-weight-bold">IDR 360,000</p>
                      </div>

                      <hr style="border: 1px solid #F1F2F2"/>

                      <v-row>
                        <v-col sm="12">
                          <v-btn
                              depressed
                              block
                              height="80"
                          >
                            <span style="font-size:16px">IDR 2,000,000 / Month</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>

export default {
  data() {
    return {
      instances: '',
      memory: '',
      vcpu: '',
      storage: '',
    };
  },
}
</script>