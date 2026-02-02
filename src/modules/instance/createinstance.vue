<template>
  <div>
    <!-- contoh template -->
    <v-row>
      <v-col cols="12" id="col_selecttypeinstance">
        <v-card flat class="rounded-lg">
          <v-container class="pa-4">
            <v-row>
              <v-col cols="12">
                <div class="headline font-weight-bold font--text">Create Instance</div> 
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex flex-row">
                <div
                  id="SelectOperatingSystem"
                  :style="{
                    border: `2px solid ${selecttypeinstance == 'operatingsystem' ? '#2C94D2' : '#BDBDBD'}`,
                    width: '233px',
                    cursor: 'pointer',
                  }"
                  @click="
                    () => {
                      selecttypeinstance = 'operatingsystem';
                    }
                  "
                  class="d-flex align-center flex-row px-4 rounded-lg"
                >
                  <v-radio-group v-model="selecttypeinstance">
                    <v-radio value="operatingsystem"></v-radio>
                  </v-radio-group>
                  <p style="font-size: 16px" class="mb-0 font-weight-bold">Operating System</p>
                </div>
                <div style="width: 30px; height: auto" />
                <div
                  :style="{
                    border: `2px solid ${selecttypeinstance == 'instanceimage' ? '#2C94D2' : '#BDBDBD'}`,
                    width: '233px',
                    cursor: 'pointer',
                  }"
                  @click="
                    () => {
                      selecttypeinstance = 'instanceimage';
                    }
                  "
                  class="d-flex align-center flex-row px-4 rounded-lg"
                >
                  <v-radio-group v-model="selecttypeinstance">
                    <v-radio value="instanceimage"></v-radio>
                  </v-radio-group>
                  <p style="font-size: 16px" class="mb-0 font-weight-bold">Instance Image</p>
                </div>
              </v-col>
            </v-row>
            <small class="error--text">
              {{ $v.selecttypeinstance.$errors.length ? $v.selecttypeinstance.$errors[0].$message : "" }}
            </small>
            <!-- new ui/ux select os -->
            <v-row v-if="selecttypeinstance == 'operatingsystem'" id="col_osSelected">
              <v-col cols="12" class="mb-0 pb-0" id="col_versionSelected">
                <p class="font-weight-bold">Operating System & Version</p>
              </v-col>

              <v-col class="d-flex flex-wrap pt-0 pl-0 ml-0">
                <v-sheet max-width="100%" class="mt-0 pl-0 ml-0">
                  <v-slide-group class="py-2 pt-0 ma-0" active-class="success" show-arrows>
                    <v-card
                      v-for="os in distinctOS"
                      :key="os.value"
                      @click="
                        () => {
                          osSelected = os.value;
                        }
                      "
                      border-color="primary"
                      outlined
                      class="rounded-lg select-instance pb-0 d-flex flex-column"
                      :class="{
                        selected: is(osSelected, os.value),
                      }"
                      style="margin-right: 30px; max-width: 170px; width: 100%; flex: 1"
                      :style="{
                        border: `1px solid ${os.value === osSelected ? '#2C94D2' : '#A5B3BF'}`,
                        backgroundColor: os.value === osSelected ? '#2C94D205' : undefined,
                        cursor: 'pointer',
                      }"
                    >
                      <!-- :style="{
                        border: $v.osSelected.$errors.length
                          ? '1px solid #eb5757 !important'
                          : '',
                      }" -->
                      <!-- <v-overlay
                        :absolute="true"
                        :value="os.value !== osSelected"
                        :opacity="0.1"
                        color="#000000"
                      ></v-overlay> -->
                      <v-card-text class="py-3 d-flex flex-column" style="flex: 1">
                        <div class="pa-0 ma-0 d-flex justify-center flex-column align-center" style="flex: 1">
                          <v-img
                            v-if="os.logo"
                            :aspect-ratio="1 / 1"
                            :src="os.logo"
                            :alt="os.text"
                            width="32"
                            height="32"
                            class="mb-3"
                            style="max-height: 32px; max-width: 32px; background-image: contain"
                          />
                          <p
                            class="font-weight-bold mb-0 text-center"
                            style="font-size: 16px"
                            :style="{
                              color: `${os.value === osSelected ? '#1F60A8' : '#A5B3BF'}`,
                            }"
                          >
                            {{ os.text }}
                          </p>
                          <div v-if="os.price > 0 && osChargingDiscount && osChargingDiscount > 0">
                            <p class="mb-0 ma-1 body-2" style="font-weight: 600; text-decoration: line-through">
                              {{ os.price == 0 ? "Non Paid - Free" : toIDRWithDotFormat(os.price) }}
                            </p>
                            <p
                              class="mb-0 ma-1"
                              style="font-weight: 600"
                              :style="{
                                color: `${os.value === osSelected ? '#1F60A8' : '#A5B3BF'}`,
                              }"
                            >
                              {{ os.price == 0 ? "Non Paid - Free" : toIDRWithDotFormat(os.price - (os.price * osChargingDiscount) / 100) }}
                            </p>
                          </div>
                          <div v-else>
                            <p
                              class="mb-0 ma-1"
                              style="font-weight: 600"
                              :style="{
                                color: `${os.value === osSelected ? '#1F60A8' : '#A5B3BF'}`,
                              }"
                            >
                              {{ os.price == 0 ? "Non Paid - Free" : toIDRWithDotFormat(os.price) }}
                            </p>
                          </div>
                        </div>
                      </v-card-text>
                      <v-divider
                        :style="{
                          background: `${os.value === osSelected ? '#2C94D2' : '#A5B3BF'}`,
                        }"
                      />
                      <v-card-text class="ma-0 pa-0" style="max-height: 44px">
                        <v-select
                          v-if="os.value === osSelected"
                          id="SelectVersion"
                          v-model="versionSelected"
                          :error-messages="$v.versionSelected.$errors.length ? $v.versionSelected.$errors[0].$message : ''"
                          :items="
                            images
                              .filter((x) => x.os_id === osSelected)
                              .map((x) => {
                                return {
                                  text: `${x.version_number} ${x.version_name}`,
                                  value: x.id,
                                };
                              })
                          "
                          class="ma-0 px-0 py-0 select-version"
                          :placeholder="$v.versionSelected.$errors.length ? '' : 'Select Version'"
                          style="margin-top: -6px !important; color: #1f60a8"
                          outlined
                        >
                          <template class="pa-0 ma-0" v-slot:selection="{ item }">
                            <p class="font-weight-medium mb-0 my-0 pa-0">
                              {{ item.text }}
                            </p>
                          </template>
                          <template v-slot:item="{ item }" class="rounded-xl rounded-t-0" style="color: '#1F60A8'">
                            {{ item.text }}
                          </template>
                        </v-select>
                        <v-select
                          v-else
                          id="SelectVersion"
                          :error-messages="$v.versionSelected.$errors.length ? $v.versionSelected.$errors[0].$message : ''"
                          :items="
                            images
                              .filter((x) => x.os_id === osSelected)
                              .map((x) => {
                                return {
                                  text: `${x.version_number} ${x.version_name}`,
                                  value: x.id,
                                };
                              })
                          "
                          class="ma-0 px-0 py-0 select-version"
                          :placeholder="$v.versionSelected.$errors.length ? '' : 'Select Version'"
                          style="margin-top: -6px !important; color: '#A5B3BF'"
                          outlined
                        >
                          <template class="pa-0 ma-0" v-slot:selection="{ item }">
                            <p
                              class="font-weight-medium mb-0 my-0 pa-0"
                              :style="{
                                color: `${os.value === osSelected ? '#1F60A8' : '#BDBDBD'}`,
                              }"
                            >
                              {{ item.text }}
                            </p>
                          </template>
                          <template class="" v-slot:item="{ item }">
                            {{ item.text }}
                          </template>
                        </v-select>
                      </v-card-text>
                    </v-card>
                  </v-slide-group>
                </v-sheet>
              </v-col>
            </v-row>

            <v-row v-if="selecttypeinstance == 'instanceimage'" id="col_selectedCustomImage">
              <v-col sm="12" md="6">
                <p class="font-weight-bold">Instance Image</p>
                <v-select
                  id="selectCustomImages"
                  v-model="selectedCustomImage"
                  :error-messages="$v.selectedCustomImage.$errors.length ? $v.selectedCustomImage.$errors[0].$message : ''"
                  outlined
                  :items="selectCustomImages"
                  placeholder="Choose Custom Image"
                >
                </v-select>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col sm="12" md="6" class="pt-0">
                <p class="font-weight-bold">Region</p>
                <v-select
                  id="SelectRegion"
                  v-model="selectedRegion"
                  outlined
                  :disabled="!selecttypeinstance"
                  :items="selectregionbyproject"
                  placeholder="Select Region"
                >
                </v-select>
              </v-col>
            </v-row> -->
            <v-row id="col_selectedZoneModel">
              <v-col sm="12" md="6" class="pt-0">
                <p class="font-weight-bold">Zone</p>
                <v-select
                  id="SelectZone"
                  v-model="selectedZoneModel"
                  :error-messages="$v.selectedZoneModel.$errors.length ? $v.selectedZoneModel.$errors[0].$message : ''"
                  outlined
                  :items="selectzonebyproject"
                  placeholder="Choose Zone"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row id="col_selectedServerGroupModel">
              <v-col sm="12" md="6" class="pt-0">
                <p class="font-weight-bold">Server Group</p>
                <v-select
                  id="ServerGroup"
                  v-model="selectedServerGroupModel"                            
                  outlined
                  :items="selectservergroupbyproject"
                  placeholder="Choose Server Group"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="pt-0" id="col_selectedBillingType">
                <p><b>Instance Billing Type</b></p>
                <v-select
                  id="billingType"
                  placeholder="Choose Instance Billing Type"
                  v-model="selectedBillingType"
                  :error-messages="$v.selectedBillingType.$errors.length ? $v.selectedBillingType.$errors[0].$message : ''"
                  :items="billingTypes"
                  outlined
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6" sm="12" class="pt-0" id="col_vpcidselected">
                <p class="font-weight-bold">VPC Network</p>
                <v-select
                  id="VPCNetwork"
                  placeholder="Select VPC Network"
                  v-model="vpcidselected"
                  :error-messages="$v.vpcidselected.$errors.length ? $v.vpcidselected.$errors[0].$message : ''"
                  :items="vpcItems"
                  outlined
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="pt-0" v-if="selectedBillingType == 'Trial'" id="col_selectedTrialVoucher">
                <p><b>Trial Voucher</b></p>
                <v-select
                  id="trialVoucher"
                  placeholder="Choose trial voucher to use"
                  v-model="selectedTrialVoucher"
                  :error-messages="$v.selectedTrialVoucher.$errors.length ? $v.selectedTrialVoucher.$errors[0].$message : ''"
                  :items="vouchers"
                  item-value="id"
                  outlined
                >
                  <template v-slot:selection="{ item }"> {{ item.name }} - {{ item.code }} </template>
                  <template v-slot:item="{ item }"> {{ item.name }} - {{ item.code }} </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6" class="py-0" id="col_processorSelected">
                <p class="mb-0"><b>Processor</b></p>
                <v-item-group>
                  <v-row>
                    <v-col v-for="(row, index) in listProcessorType" :key="index" cols="12" md="4">
                      <v-item v-slot="{ active, toggle }">
                        <v-card
                          class="d-flex align-center rounded-lg no-shadow"
                          height="200"
                          @click="toggle"
                          :style="{ border: active ? '2px solid #1F60A8' : '2px solid #A5B3BF' }"
                          :class="{ 'error-red': $v.processor.$errors.length }"
                        >
                          <v-card-text class="ma-0 pa-0">
                            <v-img class="ma-7" :src="require(`@/assets/${row.img}`)" max-width="110" max-height="75"></v-img>
                            <p class="font-weight-bold mb-0 text-center">
                              {{ row.name }}
                            </p>
                            <v-divider :color="active ? '#1F60A8' : '#A5B3BF'" class="mt-2" :class="{ 'error-red': $v.processor.$errors.length }"></v-divider>
                            <v-card-text class="ma-0 pa-0">
                              <v-select
                                id="selectprocessor"
                                :placeholder="$v.processor.$errors.length ? '' : 'Select Processor'"
                                v-model="processor"
                                :error-messages="$v.processor.$errors.length ? $v.processor.$errors[0].$message : ''"
                                :items="row.text"
                                item-value="id"
                                item-text="name"
                                outlined
                                class="ma-0 pb-2 select-version"
                              >
                              </v-select>
                            </v-card-text>
                          </v-card-text>
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-item-group>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12" md="6" class="py-0" id="col_planSelected" v-if="processor">
                <p><b>Choose a Plan</b></p>
                <v-select
                  id="chooseaplan"
                  placeholder="Choose a Plan"
                  v-model="planSelected"
                  :error-messages="$v.planSelected.$errors.length ? $v.planSelected.$errors[0].$message : ''"
                  :items="listInstanceType"
                  item-text="name"
                  item-value="id"
                  @change="changeType($event)"
                  outlined
                ></v-select>
              </v-col>
            </v-row>

            <!-- new slider for instance size -->
            <v-row>
              <v-col v-if="listInstanceSize && Object.keys(planSelected).length > 0" cols="12" class="mb-2">
                <div>
                  <p class="mb-0">
                    <span class="font-weight-bold">Instance Size</span>
                  </p>
                  <p class="mt-2 mb-0" v-if="selectedBillingType == 'PPU'">
                    If service usage has exceeded
                    <b class="primary--text">95%</b> in one month, payment will be shifted from hourly to monthly
                  </p>
                </div>
              </v-col>

              <v-col class="d-flex flex-wrap pt-0" id="SelectInstanceSize">
                <v-card
                  v-if="Object.keys(planSelected).length && listInstanceSize.length == 0"
                  width="170"
                  height="175"
                  border-color="primary"
                  outlined
                  class="rounded-lg select-flavor mb-5"
                  style="display: flex; align-items: center;"
                  disabled
                >
                  <v-card-text class="pb-0 text-center">
                    <p class="mb-0">There is no available flavor for selected processor, plan & region</p>
                  </v-card-text>
                </v-card>

                <v-sheet v-if="Object.keys(planSelected).length && listInstanceSize.length" max-width="100%" class="mt-0" id="col_instanceselected">
                  <v-slide-group class="py-4 pt-0" active-class="success" show-arrows>
                    <v-card
                      v-for="(instance, index) in listInstanceSize"
                      :key="'flavor-'+index"
                      :set="(discount = getInstanceDiscount(instance.flavor_ids))"
                      @click="
                        () => {
                          instanceselected = instance;
                        }
                      "
                      border-color="primary"
                      outlined
                      class="rounded-lg select-instance"
                      :class="{
                        selected: isSelected(instance.id),
                      }"
                      style="margin-right: 20px; min-width: 170px"
                      :style="{
                        border: $v.instanceselected.$errors.length ? '1px solid #eb5757 !important' : '',
                      }"
                    >
                      <v-card-text class="pb-0 text-center">
                        <p class="ma-0 pb-2"> {{instance.name}} </p>
                        <!-- <p class="text-subtitle-2 ma-0 pb-2"> ({{instance.region}}) </p> -->
                      </v-card-text>
                      <v-divider />
                      <div v-if="discount">
                        <v-card-text class="pb-0 text-center">
                          <p class="body-2 mb-0" style="text-decoration: line-through">
                            {{ `${toIDRWithDotFormat(instance.price_per_month)}/mo` }}
                          </p>
                          <p class="font-weight-bold blue--text mb-0">
                            {{ `${toIDRWithDotFormat(instance.price_per_month - Math.round((instance.price_per_month * discount) / 100))}/mo` }}
                          </p>
                          <p class="body-2 mb-0">
                            {{ `${toIDRWithDotFormat(instance.price_per_hour)}/hour` }}
                          </p>
                          <p class="font-weight-bold blue--text">
                            {{ `${toIDRWithDotFormat(instance.price_per_hour - Math.round((instance.price_per_hour * discount) / 100))}/hour` }}
                          </p>
                        </v-card-text>
                        <v-divider />
                        <v-card-text class="m-0 p-0 text-center" style="padding: 20px">
                          <p class="fz-12 p-0" style="margin-bottom: 0">
                            <b>{{ instance.vcpu }} CPU</b> / {{ instance.ram }} GB Memory
                            <br />
                          </p>
                          <p v-if="instance.gpu" class="fz-12 ma-0 p-0">
                            with <b>{{ instance.gpu }}</b> unit{{ instance.gpu > 1 ? "s" : "" }}
                            Nvidia T4
                          </p>
                          <p v-if="instance.outOfStock" class="mb-0" style="font-size: 10px">Out of Stock</p>
                        </v-card-text>
                      </div>
                      <div v-else>
                        <v-card-text class="pb-0 text-center">
                          <p class="font-weight-bold mb-0">
                            {{ `${toIDRWithDotFormat(instance.price_per_month)}/mo` }}
                          </p>
                          <p>
                            {{ `${toIDRWithDotFormat(instance.price_per_hour)}/hour` }}
                          </p>
                        </v-card-text>
                        <v-divider />
                        <v-card-text class="m-0 p-0 text-center" style="padding: 20px">
                          <p class="fz-12 p-0" style="margin-bottom: 0">
                            <b>{{ instance.vcpu }} CPU</b> / {{ instance.ram }} GB Memory
                            <br />
                          </p>
                          <p v-if="instance.gpu" class="fz-12 ma-0 p-0">
                            with <b>{{ instance.gpu }}</b> unit{{ instance.gpu > 1 ? "s" : "" }}
                            Nvidia T4
                          </p>
                          <p v-if="instance.outOfStock" class="mb-0" style="font-size: 10px">Out of Stock</p>
                        </v-card-text>
                      </div>
                    </v-card>
                  </v-slide-group>
                </v-sheet>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6" class="pt-0" id="col_vm_root_disk_type_id">
                <p><b>Storage Type</b></p>
                <v-select
                  id="vm_root_disk_type_id"
                  placeholder="Choose Storage Type"
                  v-model="vm_root_disk_type_id"
                  :error-messages="$v.vm_root_disk_type_id && $v.vm_root_disk_type_id.$errors.length ? $v.vm_root_disk_type_id.$errors[0].$message : ''"
                  :items="listStorageTypeBilling"
                  item-value="id"
                  @change="changeTypeStorage($event)"
                  outlined
                > 
                <template v-slot:selection="{ item }"> {{ item.name }} - {{ item.description }} </template>
                <template v-slot:item="{ item }"> {{ item.name }} - {{ item.description }} </template>
              </v-select> 
              </v-col>
            </v-row>

            <v-row v-if="vm_root_disk_type_id" id="col_rootDiskSelected">
              <v-col class="py-0">
                <p class="font-weight-bold">
                  Instance Root Disk
                  <span class="primary--text ml-2" style="font-size: 12px" v-if="useRootDiskFromSnapshot">
                    *Instance root disk size automatically uses the size of root disk in the selected snapshot.
                  </span>
                  <span
                    :class="{
                      'error--text': $v.rootDiskSelected.$errors.length,
                    }"
                    class="ml-2"
                    style="font-size: 10px"
                    v-if="$v.rootDiskSelected.$errors.length"
                  >
                    *{{ $v.rootDiskSelected.$errors[0].$message }}
                  </span>
                  <span
                    :class="{
                      'error--text': $v.customRootDiskSize.$errors.length,
                    }"
                    class="ml-2 pt-1"
                    style="font-size: 10px"
                    v-if="$v.customRootDiskSize.$errors.length"
                  >
                    *{{ $v.customRootDiskSize.$errors[0].$message }}
                  </span>
                </p>
              </v-col>
            </v-row>

            <v-row v-if="vm_root_disk_type_id">
              <v-slide-group class="py-4 pt-0 px-0" active-class="success" show-arrows>
                <v-col class="d-flex py-0 px-0 flex-wrap">
                  <v-card
                    tabindex="0"
                    min-width="170"
                    border-color="primary"
                    outlined
                    :class="`rounded-lg select-instance mb-4 ${isCustomRootDiskSizeHighlighted || customRootDiskSize ? 'highlighted selected' : ''}`"
                    style="text-align: center; margin-right: 20px"
                    id="customSizeRootDisk"
                  >
                    <v-card-text v-if="isDevModeStorageTiering" class="pb-0 pt-5">
                      <div v-if="rootDiskDiscount && rootDiskDiscount > 0 && customRootDiskSize">
                        <p class="body-2 mb-0" style="text-decoration: line-through">{{ calculateCustomRootDisk() }}/mo</p>
                        <p class="font-weight-bold blue--text mb-1">{{ calculateCustomRootDisk(rootDiskDiscount) }}/mo</p>

                        <p class="body-2 mb-0" style="text-decoration: line-through">{{ calculateCustomRootDisk(undefined, "hour") }}/hour</p>
                        <p class="font-weight-bold blue--text">{{ calculateCustomRootDisk(rootDiskDiscount, "hour") }}/hour</p>
                      </div>
                      <div v-else>
                        <p class="font-weight-bold mb-0">{{ calculateCustomRootDisk() }}/mo</p>
                        <p class="font-weight-bold">{{ calculateCustomRootDisk(undefined, "hour") }}/hour</p>
                      </div>
                    </v-card-text>

                    <v-divider v-if="isDevModeStorageTiering" id="col_customRootDiskSize" />
                    <v-card-text class="pa-0">
                      <v-text-field
                        class="px-4 pt-2 mt-2"
                        style="width: 170px"
                        flat
                        label="Enter Size in GB"
                        @keydown="(ev) => (customRootDiskSize = addGBText(ev, customRootDiskSize))"
                        v-model="customRootDiskSize"
                        @focus="
                          () => {
                            rootDiskSelected = null;
                            isCustomRootDiskSizeHighlighted = true;
                          }
                        "
                        @blur="
                          () => {
                            if (!customRootDiskSize) isCustomRootDiskSizeHighlighted = false;
                          }
                        "
                      />
                    </v-card-text>
                    <!-- ? rootDiskVolumeSize.filter((v) => v.type_id === vm_root_disk_type_id) // else
                      : rootDiskVolumeSize -->
                  </v-card>
                  <v-card
                    width="170"
                    :class="{
                      bordererror: $v.rootDiskSelected.$errors.length,
                      highlight: (rootDiskSelected ? is(rootDiskSelected.id, storage.id) : false) || sizeActive == storage.volume_size ? true : false,
                      selected: (rootDiskSelected ? is(rootDiskSelected.id, storage.id) : false) || sizeActive == storage.volume_size ? true : false,
                    }"
                    v-for="storage in listInstanceRootDisk"
                    :key="storage.id"
                    @click="
                      () => {
                        rootDiskSelected = storage;
                        isCustomRootDiskSizeHighlighted = false;
                        customRootDiskSize = null;
                        sizeActive = null;
                      }
                    "
                    border-color="primary"
                    outlined
                    class="rounded-lg select-instance mb-4"
                    style="text-align: center; margin-right: 20px"
                  >
                    <v-card-text v-if="isDevModeStorageTiering && vm_root_disk_type_id" class="pb-0 pt-5">
                      <div v-if="rootDiskDiscount && rootDiskDiscount > 0">
                        <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_month)) }}/mo</p>
                        <p class="font-weight-bold blue--text mb-1">
                          {{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_month, rootDiskDiscount)) }}/mo
                        </p>

                        <p class="body-2 mb-0" style="text-decoration: line-through">
                          {{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_hour)) }}/hour
                        </p>
                        <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_hour, rootDiskDiscount)) }}/hour</p>
                      </div>
                      <div v-else>
                        <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_month)) }}/mo</p>

                        <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_hour)) }}/hour</p>
                      </div>
                    </v-card-text>

                    <v-card-text v-if="!vm_root_disk_type_id" class="pb-0 pt-5">
                      <div v-if="rootDiskDiscount && rootDiskDiscount > 0">
                        <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_month)) }}/mo</p>
                        <p class="font-weight-bold blue--text mb-1">
                          {{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_month, rootDiskDiscount)) }}/mo
                        </p>

                        <p class="body-2 mb-0" style="text-decoration: line-through">
                          {{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_hour)) }}/hour
                        </p>
                        <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_hour, rootDiskDiscount)) }}/hour</p>
                      </div>
                      <div v-else>
                        <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_month)) }}/mo</p>
                        <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateRootDisk(storage.price_per_hour)) }}/hour</p>
                      </div>
                    </v-card-text>

                    <v-divider v-if="isDevModeStorageTiering" />

                    <v-card-text>
                      <p class="font-weight-bold mb-0">{{ storage.volume_size }} GB</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-slide-group>
            </v-row>

            <v-row v-if="isDevModeStorageTiering2">
              <v-col>
                <p style="font-size: 21px; margin-bottom: 10px" class="font-weight-bold">Default Instance Data Disk</p>
              </v-col>
            </v-row>

            <template v-if="isDevModeStorageTiering2">
              <v-row>
                <v-col cols="12" md="5" class="pt-0">
                  <p><b>Volume Type</b></p>
                  <v-select
                    id="billingType"
                    placeholder="Choose Volume Type"
                    v-model="defaultDiskType"
                    :error-messages="defaultDiskTypeError"
                    :items="listStorageTypeBilling"
                    item-value="id"
                    @change="changeDataDiskSize($event)"
                    outlined
                  >
                    <template v-slot:selection="{ item }"> {{ item.name }} {{ item.description }} </template>
                    <template v-slot:item="{ item }"> {{ item.name }} {{ item.description }} </template>
                  </v-select>
                </v-col>

                <v-col cols="12" md="5" class="pt-0">
                  <p><b>Size</b></p>
                  <v-select
                    id="size"
                    placeholder="Choose Size"
                    v-model="defaultDiskSize"
                    :disabled="defaultDiskType === ''"
                    :error-messages="defaultDiskSizeError"
                    :items="defaultInstanceDataDisk"
                    :item-text="(item) => `${item.volume_size} GB`"
                    item-value="id"
                    outlined
                  />
                </v-col>
                <!-- defaultDiskType
                        ? dataDisks
                            .filter((disk) => disk.type_id === defaultDiskType)
                            .map((disk2) => {
                              return {
                                text: disk2.volume_size + ' GB',
                                value: disk2.id,
                              };
                            })
                        : dataDisks.map((disk2) => {
                            return {
                              text: disk2.volume_size + ' GB',
                              value: disk2.id,
                            };
                          }) -->

                <v-col cols="12" md="2" class="pt-0">
                  <p style="opacity: 0">asd</p>

                  <v-btn @click="addDefaultDisk" depressed outlined height="48" width="100%" class="secondary white--text"> Add </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <!-- err msg -->
                  <p
                    class="error--text"
                    :style="{
                      opacity: addDefaultDiskError ? 1 : 0,
                    }"
                  >
                    <b>{{ addDefaultDiskError }}</b>
                  </p>
                </v-col>
              </v-row>
            </template>

            <template v-else>
              <v-row>
                <v-col cols="12" md="6" class="pt-0">
                  <p><b>Volume Type</b></p>
                  <v-select
                    id="billingType"
                    placeholder="Choose Volume Type"
                    v-model="selectedVolumeType"
                    :error-messages="$v.selectedVolumeType && $v.selectedVolumeType.$errors.length ? $v.selectedVolumeType.$errors[0].$message : ''"
                    :items="listStorageTypeBilling"
                    item-value="id"
                    outlined
                  >
                    <template v-slot:selection="{ item }"> {{ item.name }} {{ item.description }} </template>
                    <template v-slot:item="{ item }"> {{ item.name }} {{ item.description }} </template>
                  </v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col class="pt-0">
                  <p class="font-weight-bold">Instance Data Disk</p>
                </v-col>
              </v-row>
            </template>

            <v-row v-if="isDevModeStorageTiering2" class="align-center" id="col_isDevModeStorageTiering2">
              <v-col>
                <h2>Custom Instance Data Disk (max 12 Data Disk)</h2>
              </v-col>

              <!-- <v-col style="width: 100%; display: flex; justify-content: end;"> -->
              <v-col class="d-flex flex-column align-end">
                <v-btn @click="addCustomDataDisk" depressed style="border: 3px solid #1f60a8" outlined height="45" width="150" class="primary--text">
                  Add Custom Data Disk
                </v-btn>

                <p
                  class="error--text"
                  :style="{
                    opacity: customDiskError ? 1 : 0,
                  }"
                >
                  {{ customDiskError }}
                </p>
              </v-col>
            </v-row>

            <v-row v-if="isDevModeStorageTiering2">
              <v-col>
                <v-data-table :headers="customDataDiskHeaders" :items="customDataDiskItems" :items-per-page="13" hide-default-footer>
                  <template v-slot:item.type="{ item }">
                    <v-select
                      placeholder="Choose Volume Type"
                      :value="item.type"
                      @input="
                        (e) => {
                          customDiskItemChange(item.index, 'type', e);
                        }
                      "
                      :error-messages="item.typeError ? 'Value is required' : ''"
                      :items="listStorageTypeBilling"
                      outlined
                      :disabled="item.disable"
                      :filled="item.disable"
                      item-value="id"
                    >
                      <template v-slot:selection="{ item }"> {{ item.name }} {{ item.description }} </template>
                      <template v-slot:item="{ item }"> {{ item.name }} {{ item.description }} </template>
                    </v-select>
                  </template>

                  <template v-slot:item.size="{ item }">
                    <v-text-field
                      :value="item.size"
                      @keypress="isNumber($event)"
                      @input="
                        (e) => {
                          customDiskItemChange(item.index, 'size', e ? parseInt(e) : e);
                        }
                      "
                      :error-messages="item.sizeError"
                      outlined
                      autocomplete="nope"
                      placeholder="Enter in GB"
                      type="number"
                      :disabled="item.disable"
                      :filled="item.disable"
                    >
                      <template v-if="item.size" v-slot:append>
                        <span class="font--text"> GB </span>
                      </template>
                    </v-text-field>
                  </template>

                  <template v-slot:item.index="{ item }">
                    <v-btn @click="deleteCustomDataDisk(item.index)" depressed outlined height="45" width="150" class="error white--text"> Delete </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>

            <!-- <v-row v-if="!isDevModeStorageTiering && addvolume === true"> -->
            <v-row v-else id="col_storageselected">
              <v-col class="d-flex pt-0 flex-wrap">
                <v-card
                  tabindex="0"
                  min-width="170"
                  :key="defaultstoragesize.id"
                  border-color="primary"
                  outlined
                  :class="`rounded-lg py-0 select-instance custom-flavor-card mb-4 ${isCustomSizeHighlighted ? 'highlighted selected' : ''}`"
                  style="text-align: center; margin-right: 20px"
                >
                  <v-card-text class="pa-0">
                    <v-text-field
                      class="px-4 pt-2"
                      style="width: 170px"
                      flat
                      label="Enter Size in GB"
                      v-model="customSize"
                      @keydown="(ev) => (customSize = addGBText(ev, customSize))"
                      @focus="
                        () => {
                          storageselected = null;
                          isCustomSizeHighlighted = true;
                        }
                      "
                      @blur="
                        () => {
                          if (!customSize) isCustomSizeHighlighted = false;
                        }
                      "
                    ></v-text-field>
                  </v-card-text>
                </v-card>

                <v-card
                  width="170"
                  :class="{
                    highlight: storageselected ? is(storageselected.id, storage.id) : false,
                    selected: storageselected ? is(storageselected.id, storage.id) : false,
                  }"
                  v-for="storage in selectedVolumeType ? dataDisks.filter((disk) => disk.type_id === selectedVolumeType) : dataDisks"
                  :key="storage.id"
                  @click="
                    () => {
                      storageselected = storage;
                      isCustomSizeHighlighted = false;
                      customSize = null;
                    }
                  "
                  border-color="primary"
                  outlined
                  class="rounded-lg select-instance mb-4 flavor-card"
                  style="text-align: center; margin-right: 20px"
                >
                  <v-card-text>
                    <p class="font-weight-bold mb-0">{{ storage.volume_size }} GB</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-divider />

            <v-row id="col_authentication">
              <v-col>
                <p style="font-size: 21px; margin-bottom: 10px" class="font-weight-bold">Authentication</p>
                <p class="accent--text">
                  The most commonly used settings are selected by default. You can change them at any time by clicking “Edit Advanced Settings”.
                </p>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="4" class="d-flex flex-nowrap">
                <v-card
                  @click="
                    () => {
                      authentication = 'ssh';
                    }
                  "
                  :style="{
                    border: $v.authentication.$errors.length ? '2px solid #eb5757 !important' : `2px solid ${authentication == 'ssh' ? '#2C94D2' : '#BDBDBD'}`,
                  }"
                  class="rounded-lg d-flex flex-grow-1"
                  flat
                  outlined
                >
                  <v-card-title class="d-flex flex-nowrap">
                    <div>
                      <v-radio-group
                        :error-messages="$v.authentication.$errors.length ? $v.authentication.$errors[0].$message : ''"
                        hide-details
                        v-model="authentication"
                        style="margin-top: -10px"
                      >
                        <v-radio class="authentication" value="ssh"></v-radio>
                      </v-radio-group>
                    </div>
                    <div class="ml-2">
                      <p style="font-size: 21px" class="my-0 font-weight-bold">SSH Keys</p>
                      <p class="my-0 accent--text" style="font-size: 12px">A more secure authentication method</p>
                    </div>
                  </v-card-title>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="d-flex flex-nowrap">
                <v-card
                  @click="
                    () => {
                      authentication = 'password';
                    }
                  "
                  :style="{
                    border: $v.authentication.$errors.length
                      ? '2px solid #eb5757 !important'
                      : `2px solid ${authentication == 'password' ? '#2C94D2' : '#BDBDBD'}`,
                  }"
                  class="rounded-lg d-flex flex-grow-1"
                  flat
                  outlined
                >
                  <v-card-title class="d-flex flex-nowrap">
                    <div>
                      <v-radio-group
                        :error-messages="$v.authentication.$errors.length ? $v.authentication.$errors[0].$message : ''"
                        hide-details
                        style="margin-top: -10px"
                        v-model="authentication"
                      >
                        <v-radio class="authentication" value="password"></v-radio>
                      </v-radio-group>
                    </div>
                    <div class="ml-2">
                      <p style="font-size: 21px" class="my-0 font-weight-bold">Password</p>
                      <p class="my-0 accent--text" style="font-size: 12px">Create a root password to access VM (less secure)</p>
                    </div>
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>

            <span v-if="$v.authentication.$errors.length" class="ml-3 red--text">You are required to choose one authentication method</span>
            <v-row style="position: relative">
              <transition name="slide-fade">
                <v-col cols="12" md="12" v-show="authentication == 'ssh'" class="ssh" id="col_ssh">
                  <v-card class="rounded-lg d-flex flex-grow-1" flat outlined>
                    <v-card-title class="d-flex flex-nowrap">
                      <div class="ml-2">
                        <div class="d-flex mb-0">
                          <p class="font-weight-bold">Choose your SSH Keys</p>
                        </div>

                        <div class="d-flex flex-wrap">
                          <div class="d-flex flex-wrap mr-5" v-for="sshkey in sshkeys" :key="sshkey.id">
                            <v-checkbox v-model="selectedssh" :key="sshkey.id" :value="sshkey.id" class="m-0 mr-0" :label="sshkey.name"></v-checkbox>
                            <v-icon
                              color="red"
                              @click="
                                () => {
                                  keyid = sshkey.id;
                                  openDialogDeleteSsh = true;
                                }
                              "
                            >
                            </v-icon>
                            <v-icon
                              color="secondary"
                              @click="
                                () => {
                                  sshkeyselected = sshkey;
                                  dialogupdate = true;
                                }
                              "
                              >mdi-pencil-box-outline
                            </v-icon>
                          </div>
                        </div>
                        <div class="w-100">
                          <small class="error--text" v-if="errorsshkey"> SSH Key must be chosen </small>
                        </div>
                        <div class="d-flex">
                          <v-btn depressed id="NewKey" height="45" @click="dialogssh = true" color="secondary" outlined>
                            <span style="font-size: 16px">Add New SSH Key</span>
                          </v-btn>
                        </div>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-col>
              </transition>
              <transition name="slide-fade">
                <v-col cols="12" v-show="authentication == 'password'" class="password" id="col_password">
                  <v-card flat outlined class="rounded-lg">
                    <v-card-text class="pb-0">
                      <span class="font-weight-bold" style="font-size: 16px">Create root password</span>
                    </v-card-text>
                    <v-card-text>
                      <v-text-field
                        id="createpassword"
                        :error-messages="$v.password.$errors.length ? $v.password.$errors[0].$message : ''"
                        placeholder="Type your password"
                        outlined
                        v-model="password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1"
                      ></v-text-field>
                      <p class="accent--text">
                        <v-icon color="primary" left>mdi-alert-circle-outline </v-icon>
                        You will not be sent an email containing the Instance details or password. Please store your password securely.
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </transition>
            </v-row>

            <v-row>
              <v-col cols="12" id="col_instanceName">
                <p class="font-weight-bold">Instance Name</p>
                <v-row>
                  <v-col cols="12" sm="12" md="6">
                    <v-text-field
                      maxlength="50"
                      id="instancename"
                      v-model="instanceName"
                      :error-messages="$v.instanceName.$errors.length ? $v.instanceName.$errors[0].$message : ''"
                      outlined
                      placeholder="Instance Name"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" v-if="user.role.toLowerCase() !== 'superadmin' && agree2 === false">
                <div class="d-flex align-center">
                  <v-checkbox v-model="agree">
                    <template v-slot:label>
                      <div>By Creating Instance You Agree To The</div>
                    </template>
                  </v-checkbox>

                  <button type="button" class="text-decoration-underline primary--text ml-2 fz-16" @click="getEula()">Terms of Service</button>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <v-btn depressed style="background-color: #a5b3bf !important" block height="58" class="primary" to="/instance" exact>
                  <span style="font-size: 16px">Cancel</span>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  v-if="user.role.toLowerCase() !== 'superadmin'"
                  depressed
                  :disabled="(agree === false && agree2 === false) || isLoading"
                  id="SubmitCreateInstance"
                  @click="displayInstanceDialog"
                  block
                  height="58"
                  class="secondary"
                >
                  <span style="font-size: 16px">Create Instance</span>
                </v-btn>
                <v-btn v-else :disabled="isLoading" depressed id="SubmitCreateInstance" @click="createInstance" block height="58" class="secondary">
                  <span style="font-size: 16px">Create Instance</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <dialogcreatessh
      v-model="dialogssh"
      @close="
        () => {
          dialogssh = false;
        }
      "
    />
    <dialogupdatessh
      v-if="sshkeyselected && dialogupdate"
      :sshselected="sshkeyselected"
      v-model="dialogupdate"
      @close="
        () => {
          dialogupdate = false;
        }
      "
    />

    <v-dialog v-model="openDialogDeleteSsh" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pb-4">Delete this Ssh key</div>
        </v-card-title>
        <v-card-text class="pb-0">
          <p>Are you sure you delete this ssh key?</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                color="accent"
                block
                depressed
                height="50"
                @click="
                  () => {
                    openDialogDeleteSsh = false;
                  }
                "
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="error"
                block
                height="50"
                depressed
                @click="
                  () => {
                    deletekey(keyid);
                  }
                "
              >
                <beat-loader
                  v-if="isLoading"
                  :loading="isLoading"
                  :color="'white'"
                  :size="'10px'"
                  style="transform: translateY(3px)"
                  class="mr-2"
                ></beat-loader>
                Yes
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog purchase instance -->
    <dialogNewServiceAvailability
      v-if="instanceDialog" 
      :onClose="() => {instanceDialog = false}"
      serviceName="Instance"
      actionName="Create Instance"
      :onAvailable="createInstance"
    />
  </div>
</template>
<script>
import dialogcreatessh from "./dialogcreatessh";
import dialogupdatessh from "./dialogupdatessh.vue";
import { toIDRWithDotFormat } from "../../lib/formatter";
import { useRegion } from "./compositionapi/useregion";
import { useVpc } from "./compositionapi/usevpc";
import { useImages } from "./compositionapi/useimages";
import { useInstance } from "./compositionapi/useinstance";
import { useStorage } from "./compositionapi/usestorage";
import { useSSHkeys } from "./compositionapi/usesshkeys";
import { useVoucher } from "../voucher/useVoucher";
import { useCreateInstance } from "./compositionapi/usecreateinstance";
import { computed, onMounted, ref, watch } from "@vue/composition-api";
import { addGBText, removeGBText } from "@/lib/formatter";
import { INSTANCE, MANAGEFLAVOR } from "./namespace";
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import { isLimitError, createLimitErrorMsg } from "@/lib/validator"
import { useZone } from "@/modules/instance/compositionapi/usezone";

const { required, requiredIf, helpers, minLength } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
import { useFlavor } from "../superadmin-manageflavors/useflavor";
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import Vue from "vue";

import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import { mapGetters } from "vuex";
import libProject from "@/lib/project";
import { VoucherDiscountDetailType } from "../superadmin-managevoucher/type";
import { includes } from "lodash";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";

// const isDevModeStorageTiering = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevModeStorageTiering = true;

// change Instance Data Disk UI
// const isDevModeStorageTiering2 = process.env.VUE_APP_DEV_MODE_CREATE_INSTANCE === 'fase-1.3'
const isDevModeStorageTiering2 = true;

export default {
  components: {
    dialogcreatessh,
    dialogupdatessh,
    dialogNewServiceAvailability,
  },
  setup(props, context) {
    props;
    const { fetchdefaulinstanceprice, defaultcpu, defaultram, plans, planSelected, planValidation, $v: planvalidator } = useFlavor(props, context);
    const { fetchVouchers, vouchers } = useVoucher();

    const instanceRefID = context.root.$route.query.instance_ref;
    const imageRefID = context.root.$route.query.image_ref;

    const useComposable = {
      ...useRegion(),
      ...useVpc(),
      ...useImages(),
      ...useInstance(),
      ...useStorage(),
      ...useSSHkeys(),
      ...useZone(),
    };
    const { showErrorToast, showSuccessToast } = useNamespacedActions("HOMEPAGE", ["showErrorToast", "showSuccessToast"]);
    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, ["fetchVoucherDiscountByProjectID"]);
    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);
    const {multiCheckAvailability} = useNewServiceAvailability()

    const {
      // selectedRegion,
      // bitVersionSelected,
      versionSelected,
      osSelected,
      vpcidselected,
      instanceselected,
      storageselected,
      rootDiskSelected,
      tags,
      images,
      version,
      defaultstoragesize,
      fetchimages,
      fetchCustomImages,
      fetchVolumeSize,
      volumeSize,
      customImages,
      masterInstances,
      fetchMasterInstances,
      fetchInstanceDetail,
      instanceDetail,
      selectedZoneModel,
      selectedServerGroupModel,
      regionByProject,
      zoneByProject,
    } = useComposable;

    const customRootDiskSize = ref(null);
    const isCustomRootDiskSizeHighlighted = ref(false);
    const customSize = ref(null);
    const isCustomSizeHighlighted = ref(false);

    const rootDiskVolumeSize = computed(() =>
      volumeSize.value.filter((flavorStorage) => {
        if (showCustomDiskFlavors) return flavorStorage.status === "active" && flavorStorage.volume_size;
        else return flavorStorage.status === "active" && flavorStorage.volume_size && !flavorStorage.organization_id;
      })
    );

    const dataDisks = computed(() =>
      volumeSize.value.filter((flavorStorage) => {
        const isActive = flavorStorage.status === "active" && flavorStorage.volume_size;
        if (showCustomDiskFlavors) {
          return isActive;
        }
        return isActive && !flavorStorage.organization_id;
      })
    );

    const filteredFlavors = ref([]);
    const showCustomDiskFlavors = process.env.VUE_APP_SHOW_CUSTOM_DISK_FLAVORS == "true" ? true : false;

    const customDataDiskHeaders = [
      { text: "Volume Type", value: "type", sortable: false },
      { text: "Size", value: "size", sortable: false },
      { text: "Action", value: "index", sortable: false },
    ];
    // const processorType = ref([
    //   { name: "Intel", text: [{ name: "Intel", value: "intel" }], img: "intel-logo.png" },
    //   {
    //     name: "AMD",
    //     text: [
    //       { name: "AMD High Core", value: "amd_high_core" },
    //       { name: "AMD High CPU", value: "amd_high_cpu" },
    //     ],
    //     img: "amd-logo.png",
    //   },
    // ]);
    const processor = ref("");

    const customDataDiskItems = ref([]);

    let diskSizeUsed = 0;

    const getDiskSizeUsed = async () => {
      try {
        const res = await api.GET("/user/usage");
        diskSizeUsed = res.data.storage_usage.storage_usage;
      } catch (err) {
        if (err && err.response && err.response.data && err.response.data.data !== "record not found") {
          context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Sorry, an error occurred while getting disk size used");
        }
      }
    };

    const checkCustomDataDiskFields = () => {
      const totalSize = customDataDiskItems.value.reduce((num, obj) => num + obj.size, 0);

      for (let i = 0; i < customDataDiskItems.value.length; i++) {
        if (!customDataDiskItems.value[i].type) {
          customDataDiskItems.value[i].typeError = true;
        } else {
          customDataDiskItems.value[i].typeError = false;
        }

        if (!customDataDiskItems.value[i].size) {
          customDataDiskItems.value[i].sizeError = "Value is required";
        } else {
          customDataDiskItems.value[i].sizeError = "";
        }
      }
    };

    const customDiskError = ref("");
    const errorsshkey = ref(false);

    const addCustomDataDisk = () => {
      if (customDiskError.value) customDiskError.value = "";

      const emptyTypeOrSize = customDataDiskItems.value.length && customDataDiskItems.value.some((item) => !item.type || !item.size);
      // const areFieldsWeird = emptyTypeOrSize;

      // max custom disks = 12
      if (customDataDiskItems.value.length && customDataDiskItems.value.length === 12) {
        customDiskError.value = "*Max 12 items";
      }

      // size or type is empty
      else if (emptyTypeOrSize) {
        customDiskError.value = "*Type or size is empty";
        checkCustomDataDiskFields();
      }

      // add new field
      else {
        customDataDiskItems.value.push({
          index: Math.random().toString(36).slice(2),
          type: "",
          size: null,
          typeError: false,
          sizeError: "",
          disable: false,
          price_per_hour: 0,
          price_per_month: 0,
          package_storage_id: "",
        });
      }
    };

    const deleteCustomDataDisk = (index) => {
      const index2 = customDataDiskItems.value.findIndex((item) => item.index === index);
      customDataDiskItems.value.splice(index2, 1);
    };

    const customDiskItemChange = async (index, property, value) => {
      if (property == "type") {
        const params = new URLSearchParams();
        params.append("storage_type_id", value);
        const res = await getDefaultInstancePriceDataDisk(params);
        if (res.status == 200) {
          const index2 = customDataDiskItems.value.findIndex((item) => item.index === index);
          customDataDiskItems.value[index2][property] = value;
          customDataDiskItems.value[index2]["package_storage_id"] = defaultInstancePriceDataDisk.value.id;
          checkCustomDataDiskFields();
        }
      } else {
        const index2 = customDataDiskItems.value.findIndex((item) => item.index === index);
        customDataDiskItems.value[index2][property] = value;
        customDataDiskItems.value[index2]["price_per_hour"] = defaultInstancePriceDataDisk.value.price_per_hour * value;
        customDataDiskItems.value[index2]["price_per_month"] = defaultInstancePriceDataDisk.value.price_per_month * value;
        checkCustomDataDiskFields();
      }
    };

    const selectedTrialVoucher = ref(null);
    const selectedCustomImage = ref({});
    const selectCustomImages = computed(() => {
      return (
        customImages.value
          // .filter((x) => {
          //   if (x.is_snapshot && x.is_upload_success) return true;
          //   else if (x.is_backup) return true;
          //   else if (!x.is_backup && x.is_upload_success) return true;
          //   return false;
          // })
          // .filter((x) => {
          //   if (x.is_snapshot || x.is_backup) {
          //     if (x.openstack_snapshot_id || x.openstack_backup_id) return true;
          //     else return false;
          //   }
          //   return true;
          // })
          .sort((x) => (x.is_snapshot ? 1 : -1))
          .map((x) => {
            return {
              text: x.is_snapshot ? `(Snapshot) ${x.name}` : x.is_backup ? `(Backup) ${x.name}` : `${x.name} (version ${x.version})`,
              value: `${x.id}`,
            };
          })
      );
    });

    // const filterProcessor = async () => {
    //   const projJson = JSON.parse(localStorage.getItem("currentProj") || "{}");
    //   const params = {
    //       region: projJson.region,
    //       limit: 999
    //     };
    //   await fetchMasterInstances(params);
    //   const data = masterInstances.value.filter((x) => x.processor.includes('amd'));
    //   filterAmd.value = data.length > 0 ? true : false;
    // };

    // const processorAvailable = computed(() => {
    //   const data = filterAmd.value == true ? processorType.value : processorType.value.filter((x) => x.name != 'AMD');
    //   return data;
    // })

    const distinctOS = computed(() => {
      let osIds = [];
      return images.value
        .filter((img) => {
          if (!osIds.includes(img.os_id)) {
            osIds.push(img.os_id);
            return true;
          }
          return false;
        })
        .map((x) => {
          return {
            text: x.os_name,
            value: x.os_id,
            logo: x.os_logo,
            version: x.version_name,
            price: x.os.price,
          };
        });
    });

    // const filterAmd = ref(null);
    const typeStorage = ref("");
    const sizeActive = ref("");
    const selectedVolumeType = ref("");
    const selectedStorageType = ref("");
    const vm_root_disk_type_id = ref("");
    const selectedBillingType = ref("");
    const authentication = ref("");
    const selectedssh = ref([]);
    const password = ref("");
    const instanceAmount = ref(1);
    const instanceName = ref("");
    const selecttypeinstance = ref("");
    const vpcItems = ref([]);
    const osChargingDiscount = ref(0);
    const rootDiskDiscount = ref(0);
    const instanceDialog = ref(0);
    const $v = useVuelidate(
      {
        selecttypeinstance: { required },
        osSelected: {
          required: requiredIf((val) => {
            return selecttypeinstance.value === "operatingsystem";
          }),
        },
        versionSelected: {
          required: requiredIf((val) => {
            return selecttypeinstance.value === "operatingsystem";
          }),
        },
        selectedCustomImage: {
          required: requiredIf((val) => {
            return selecttypeinstance.value === "instanceimage";
          }),
        },
        selectedZoneModel: { required, $autoDirty: true },
        selectedBillingType: { required, $autoDirty: true },
        vpcidselected: { required, $autoDirty: true },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value === "Trial";
          }),
        },
        planSelected: { required, $autoDirty: true },
        instanceselected: { required, $autoDirty: true },
        vm_root_disk_type_id: isDevModeStorageTiering ? { required, $autoDirty: true } : { $autoDirty: true },
        rootDiskSelected: {
          required: requiredIf((val) => {
            return customRootDiskSize.value === null && rootDiskSelected.value === null;
          }),
          moreThan20: helpers.withMessage("The minimum required size for the root disk is 20 GB", () => {
            if (!rootDiskSelected.value) return true;
            if (useRootDiskFromSnapshot.value) return true;
            let value = parseInt(rootDiskSelected.value.volume_size);
            return value >= 20;
          }),
        },
        customRootDiskSize: {
          required: requiredIf((val) => {
            return (customRootDiskSize.value == null || customRootDiskSize.value == "") && rootDiskSelected.value === null;
          }),
          moreThan20: helpers.withMessage("The minimum required size for the root disk is 20 GB", () => {
            if (!customRootDiskSize.value) return true;
            if (useRootDiskFromSnapshot.value) return true;
            let value = parseInt(removeGBText(customRootDiskSize.value));
            return value >= 20;
          }),
        },
        storageselected: isDevModeStorageTiering
          ? {
              required: requiredIf((val) => {
                return selectedVolumeType.value;
              }),
              $autoDirty: true,
            }
          : { $autoDirty: true },
        authentication: { required, $autoDirty: true },
        password: {
          conditional: {
            $message: "Value is required",
            $validator: (value) => {
              if (authentication.value === "password") {
                return !!value;
              } else {
                return true;
              }
            },
          },
          uppercase: {
            $message: "Must contains at least one uppercase character",
            $validator: (val) => {
              if (authentication.value == "password") {
                return /^(?=.*[A-Z])/g.test(val);
              } else {
                return true;
              }
            },
          },
          lowercase: {
            $message: "Must contains at least one lowercase character",
            $validator: (val) => {
              if (authentication.value == "password") {
                return /^(?=.*[a-z])/g.test(val);
              } else {
                return true;
              }
            },
          },
          numeric: {
            $message: "Must contains at least one numeric character",
            $validator: (val) => {
              if (authentication.value == "password") {
                return /^(?=.*[0-9])/g.test(val);
              } else {
                return true;
              }
            },
          },
          symbol: {
            $message: "Must contains at least one symbol (!@#$%^&*)",
            $validator: (val) => {
              if (authentication.value == "password") {
                return /^(?=.*[!@#$%^&*])/g.test(val);
              } else {
                return true;
              }
            },
          },
          minLength: minLength(8),
        },

        instanceName: {
          required,
          minLength: minLength(5),
          $autoDirty: true,
          whitespaceStart: helpers.withMessage("Can not start with whitespace", (val) => {
            if (val[0] === " ") return false;
            return true;
          }),
          whitespaceEnd: helpers.withMessage("Can not end with whitespace", (val) => {
            let endChar = val.length - 1;
            if (val[endChar] === " ") return false;
            return true;
          }),
          specialChars: helpers.withMessage("Can not contain special character", (val) => {
            return !val.match(/[^A-Za-z0-9-_]/g);
          }),
        },
        processor: { required },
        // selectedRegion: { required, $autoDirty: true },
        // selectedVolumeType: isDevModeStorageTiering ? { required, $autoDirty: true } : { $autoDirty: true },

        // bitVersionSelected: {
        //   required: requiredIf((val) => {
        //     return selecttypeinstance.value === "operatingsystem";
        //   }),
        // },
        // selectedssh: {
        // conditional: (value) => {
        //   if (authentication.value == 'ssh') {
        //     return !!value
        //   } else {
        //     return true
        //   }
        // }
        // },
      },
      {
        vm_root_disk_type_id,
        customRootDiskSize,
        rootDiskSelected,
        selectedVolumeType,
        storageselected,
        selectedBillingType,
        selecttypeinstance,
        // selectedRegion,
        selectedZoneModel,
        selectedServerGroupModel,
        versionSelected,
        // bitVersionSelected,
        selectedCustomImage,
        instanceselected,
        authentication,
        selectedssh,
        osSelected,
        vpcidselected,
        planSelected,
        password,
        instanceName,
        selectedTrialVoucher,
        processor,
      }
    );

    const defaultDiskType = ref("");
    const defaultDiskTypeError = ref("");
    const defaultDiskSize = ref("");
    const defaultDiskSizeError = ref("");
    const addDefaultDiskError = ref("");

    const addDefaultDisk = () => {
      addDefaultDiskError.value = "";

      const totalSize = customDataDiskItems.value.reduce((num, obj) => num + obj.size, 0);

      if (customDataDiskItems.value.length === 12) {
        addDefaultDiskError.value = "Max = 12 items";
        return;
      }

      if (!defaultDiskType.value) {
        defaultDiskTypeError.value = "Value is required";
        return;
      }

      if (!defaultDiskSize.value) {
        defaultDiskSizeError.value = "Value is required";
        return;
      }
      const disk = defaultInstanceDataDisk.value.find((elem) => elem.id === defaultDiskSize.value);
      const xxx = {
        index: Math.random().toString(36).slice(2),
        type: defaultDiskType.value,
        package_storage_id: defaultDiskSize.value,
        size: disk ? disk.volume_size : null,
        typeError: false,
        sizeError: "",
        disable: true,
        price_per_hour: disk.price_per_hour,
        price_per_month: disk.price_per_month,
      };

      customDataDiskItems.value.push(xxx);
      // customDataDiskItems.value.push({
      //   index: Math.random().toString(36).slice(2),
      //   type: defaultDiskType.value,
      //   package_storage_id: defaultDiskSize.value,
      //   size: disk ? disk.volume_size : null,
      //   typeError: false,
      //   sizeError: "",
      //   disable: true,
      // });
    };

    watch(vm_root_disk_type_id, () => {
      if (!useRootDiskFromSnapshot) {
        rootDiskSelected.value = null;
      }
    });

    watch(defaultDiskType, () => {
      addDefaultDiskError.value = "";
      defaultDiskSize.value = "";
      defaultDiskTypeError.value = "";
    });

    watch(defaultDiskSize, () => {
      addDefaultDiskError.value = "";
      defaultDiskSizeError.value = "";
    });

    watch(storageselected, (newVal) => {
      // if (newVal && selectedVolumeType.value) {
      //   addDefaultDisk()
      // }

      if (isDevModeStorageTiering2 && customDataDiskItems.value.length) {
        for (let i = 0; i < customDataDiskItems.value.length; i++) {
          if (customDataDiskItems.value[i].package_storage_id) {
            const disk = dataDisks.value.find((disk) => disk.id === newVal);

            customDataDiskItems.value[i].package_storage_id = newVal;
            customDataDiskItems.value[i].size = disk.volume_size;
          }
        }
      }
    });

    watch(selectedVolumeType, (newVal) => {
      storageselected.value = null;

      // if (newVal && storageselected.value) {
      //   addDefaultDisk()
      // }

      if (isDevModeStorageTiering2 && customDataDiskItems.value.length) {
        for (let i = 0; i < customDataDiskItems.value.length; i++) {
          if (customDataDiskItems.value[i].package_storage_id) {
            customDataDiskItems.value[i].type = newVal;
          }
        }
      }
    });

    watch(osSelected, (newVal, oldVal) => {
      // reset only if value changed and not first change
      if (newVal === oldVal || oldVal === "") return;
      context.root.$nextTick(() => {
        versionSelected.value = "";
        $v.value.versionSelected.$reset();
      });
    });

    watch(masterInstances, () => {
      filteredFlavors.value = masterInstances.value
        .filter((x) => {
          if (x.status == "active") {
            if (x.usage_limit == -1 || x.usage < x.usage_limit) return true; //check flavor limit (unused)
            return false;
          }
          return false;
        })
        .map((x) => {
          if (regionByProject.value) {
            if (
              x.vcpu <= regionByProject.value[0].cpu_limit - regionByProject.value[0].cpu_usage &&
              x.ram <= regionByProject.value[0].ram_limit - regionByProject.value[0].ram_usage &&
              x.gpu <= regionByProject.value[0].gpu_limit - regionByProject.value[0].gpu_usage
            )
              return x;
            else return { ...x, outOfStock: true };
          }
          return x;
        })
        .sort((a, b) => (a.vcpu > b.vcpu ? 1 : -1))
        .sort((a, b) => (a.ram > b.ram ? -1 : 1))
        .sort((a, b) => {
          if (regionByProject.value) {
            if (
              a.vcpu <= regionByProject.value[0].cpu_limit - regionByProject.value[0].cpu_usage &&
              a.ram <= regionByProject.value[0].ram_limit - regionByProject.value[0].ram_usage &&
              a.gpu <= regionByProject.value[0].gpu_limit - regionByProject.value[0].gpu_usage
            )
              return -1;
            else return 1;
          }
        });
    });

    // watch([planSelected], (val) => {
    //   let params = {
    //     type_id: planSelected.value,
    //     region: regionByProject.value[0].name,
    //     processor: processor.value,
    //   };
    //   fetchMasterInstances(params);
    // });
    watch([processor], async (val) => {
      const params = new URLSearchParams();
      params.append("project_id", projObj.id);
      params.append("processor_id", processor.value);
      params.append("type_id", planSelected.value);

      if (typeof planSelected.value !== 'object' && planSelected.value !== '') {
        await getListInstanceSize(params);
      }
      // await getListInstanceSize(params);

      // let params = {
      //   type_id: planSelected.value,
      //   region: regionByProject.value[0].name,
      //   processor: processor.value,
      // };
      // fetchMasterInstances(params);
    });

    watch(authentication, () => {
      // $v.value.password.$reset()
      // $v.value.selectedssh.$reset()
    });

    const useRootDiskFromSnapshot = ref(false);
    watch(selecttypeinstance, (val) => {
      if (selecttypeinstance != "instanceimage") {
        customRootDiskSize.value = null;
        rootDiskSelected.value = null;
        useRootDiskFromSnapshot.value = false;
      }
    });

    watch([selectedCustomImage], async (val) => {
      customRootDiskSize.value = null;
      sizeActive.value = null;
      rootDiskSelected.value = null;
      let image = customImages.value.filter((x) => x.id == val)[0];
      
      // await fetchInstanceDetail(image.instance_id)
      // await setInstanceRef(instanceDetail.value, image.id)
      if (image.instance_id !== undefined) {
        await fetchInstanceDetail(image.instance_id)
        await setInstanceRef(instanceDetail.value, image.id)
      }
      // if (image && image.metadata.length && volumeTypes.value.length) {
      //   // get root disk type id
      //   let rootDisk = {} 
      //   let rootDiskType = {}
      //   let flavor = {}
      //   rootDisk = image.metadata.find((x) => x.type == "Rootdisk") || {};
      //   rootDiskType = volumeTypes.value.filter((x) => x.name == rootDisk.storage_type) || {};

      //   if (rootDisk && rootDiskType) {
      //     flavor = volumeSize.value.find(
      //       (x) =>
      //         x.status == "active" &&
      //         !x.organization_id &&
      //         x.volume_size == rootDisk.size &&
      //         // add type id
      //         x.type_id == rootDiskType.value
      //     ) || {};
      //   }

      //   if (flavor) rootDiskSelected.value = flavor;
      //   else customRootDiskSize.value = `${rootDisk ? rootDisk.size : 0} GB`;
      //   useRootDiskFromSnapshot.value = true;
      //   sizeActive.value = image.size;
      //   typeStorage.value = image.metadata[0].storage_type;
      //   const id = volumeTypes.value.find((item) => {
      //     if (item.name == typeStorage.value) {
      //       return item;
      //     }
      //   }) || {};
      //   vm_root_disk_type_id.value = id.value;
      // } else {
      //   customRootDiskSize.value = null;
      //   rootDiskSelected.value = null;
      //   useRootDiskFromSnapshot.value = false;
      // }
    });

    const messagefail = ref("");
    const { createinstance } = useCreateInstance();
    const opendialogfailcreate = ref(false);
    const { setopendialogreachlimit, setopendialogbalance, setopendialogbalancemsg } = useNamespacedMutations("DASHBOARD", [
      "setopendialogreachlimit",
      "setopendialogbalance",
      "setopendialogbalancemsg",
    ]);

    const sshkeyselected = ref();

    const openDialogDeleteSsh = ref(false);
    const keyid = ref("");

    const { isLoading } = useNamespacedState("INSTANCE", ["isLoading"]);

    const {
      createsshkey,
      deletesshkey,
      getsshkey,
      getListInstanceSize,
      getListInstanceType,
      getListStorageType,
      getListInstanceRootDisk,
      getDefaultInstanceDataDisk,
      getDefaultPriceStorage,
      getDefaultInstancePriceDataDisk,
      getProcessorType,
    } = useNamespacedActions(INSTANCE, [
      "createsshkey",
      "deletesshkey",
      "getsshkey",
      "getListInstanceSize",
      "getListInstanceType",
      "getListStorageType",
      "getListInstanceRootDisk",
      "getDefaultInstanceDataDisk",
      "getDefaultPriceStorage",
      "getDefaultInstancePriceDataDisk",
      "getProcessorType",
    ]);
    const {
      listInstanceSize,
      listInstanceType,
      listStorageTypeBilling,
      listInstanceRootDisk,
      defaultInstanceDataDisk,
      defaultPriceStorage,
      defaultInstancePriceDataDisk,
      listProcessorType,
    } = useNamespacedGetters(INSTANCE, [
      "listInstanceSize",
      "listInstanceType",
      "listStorageTypeBilling",
      "listInstanceRootDisk",
      "defaultInstanceDataDisk",
      "defaultPriceStorage",
      "defaultInstancePriceDataDisk",
      "listProcessorType",
    ]);
    function updatekey(val) {
      getsshkey(val);
    }

    function deletekey(val) {
      deletesshkey(val).then(() => {
        showSuccessToast("Keypair deleted successfully");
        this.openDialogDeleteSsh = false;
      });
    }

    async function createInstance() {
      $v.value.$touch();
      // planvalidator.value.$touch();
      if ($v.value.$invalid) {
        let element = document.getElementById("col_" + $v.value.$errors[0].$property);
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
      const emptyTypeOrSize = customDataDiskItems.value.length && customDataDiskItems.value.some((item) => !item.type || !item.size);
      const areFieldsWeird = emptyTypeOrSize;

      if (isDevModeStorageTiering2 && areFieldsWeird) {
        checkCustomDataDiskFields();
        let element = document.getElementById("col_isDevModeStorageTiering2");
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
      let additionalInstancePayload = {};
      if (isDevModeStorageTiering) {
        additionalInstancePayload.vm_root_disk_type_id = vm_root_disk_type_id.value;
      }
      if (isDevModeStorageTiering2 && customDataDiskItems.value.length) {
        const itemsFormatted = customDataDiskItems.value.map((item) => {
          let additionalProp = {
            custom_size: item.size,
            package_storage_id: item.package_storage_id,
          };
          if (item.disable == true) {
            additionalProp = { package_storage_id: item.package_storage_id };
          }
          return {
            package_storage_type_id: item.type,
            ...additionalProp,
          };
        });
        if (!additionalInstancePayload.storages) {
          additionalInstancePayload.storages = itemsFormatted;
        } else {
          additionalInstancePayload.storages = [...additionalInstancePayload.storages, ...itemsFormatted];
        }
      }
      // projObj.value.id
      let newinstance = isDevModeStorageTiering
        ? {
            name: instanceName.value,
            region: regionByProject.value[0].name,
            zone: selectedZoneModel.value.zone,
            server_group_id: selectedServerGroupModel.value,
            vpc_id: vpcidselected.value,
            // package_instance_id: instanceselected.value.flavor_id,
            item_id: instanceselected.value.id,
            instance_amount: 1,
            billing_type: selectedBillingType.value,
            package_storage_type_name: getNameTypeStorage(vm_root_disk_type_id.value),
            vm_root_disk_type_id: vm_root_disk_type_id.value,
            project_id: JSON.parse(localStorage.getItem("currentProj") || "{}").id,
            // package_storage_type_id: selectedVolumeType.value,
            ...additionalInstancePayload,
          }
        : {
            name: instanceName.value,
            region: regionByProject.value[0].name,
            zone: selectedZoneModel.value.zone,
            server_group_id: selectedServerGroupModel.value,
            vpc_id: vpcidselected.value,
            // package_instance_id: instanceselected.value.flavor_id,
            item_id: instanceselected.value.id,
            instance_amount: 1,
            billing_type: selectedBillingType.value,
            package_storage_type_name: getNameTypeStorage(vm_root_disk_type_id.value),
            vm_root_disk_type_id: vm_root_disk_type_id.value,
            project_id: JSON.parse(localStorage.getItem("currentProj") || "{}").id,
            // package_storage_type_id: selectedVolumeType.value,
          };
      if (!isDevModeStorageTiering2 && storageselected.value) newinstance.package_storage_id = storageselected.value;
      if (selectedBillingType.value == "Trial") newinstance.voucher_id = selectedTrialVoucher.value;
      if (rootDiskSelected.value) newinstance.vm_root_disk_id = rootDiskSelected.value.id;
      if (customRootDiskSize.value) {
        newinstance.vm_root_disk_custom_service_id = defaultPriceStorage.value.id
        newinstance.vm_root_disk_custom_size = parseInt(removeGBText(customRootDiskSize.value))
        // const flavorSameSize = volumeSize.value.filter(
        //   (x) => parseInt(x.volume_size) === parseInt(removeGBText(customRootDiskSize.value)) && x.type_id === vm_root_disk_type_id.value
        // );
        // if (flavorSameSize.length > 0 && flavorSameSize[0].type_id == vm_root_disk_type_id.value) {
        //   newinstance.vm_root_disk_id = flavorSameSize[0].id;
        // } else newinstance.vm_root_disk_custom_size = parseInt(removeGBText(customRootDiskSize.value));
      }
      if (customSize.value) {
        const flavorSameSize = volumeSize.value.filter((x) => parseInt(x.volume_size) === parseInt(removeGBText(customSize.value)));
        if (flavorSameSize.length > 0) newinstance.package_storage_id = flavorSameSize[0].id;
        else newinstance.custom_size = parseInt(removeGBText(customSize.value));
      }
      if (selecttypeinstance.value === "operatingsystem") newinstance.image_os_id = versionSelected.value;
      else if (selecttypeinstance.value === "instanceimage") newinstance.image_id = selectedCustomImage.value;
      if (authentication.value == "ssh") {
        if (selectedssh.value.length == 0) {
          errorsshkey.value = true;
          // window.scrollTo({ top: 0, behavior: "smooth" });
          let element = document.getElementById("col_authentication");
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
        newinstance.ssh_key_id = selectedssh.value;
      } else if (authentication.value == "password") {
        newinstance.password_manual = password.value;
      }

      // newinstance.package_storage_id = vm_root_disk_type_id === defaultstoragesize[0].type.id ? defaultstoragesize[0].id : defaultstoragesize[1].id
      // console.log("payload create instance", newinstance);
      createinstance(newinstance)
        .then(() => {
          context.root.$store.dispatch("HOMEPAGE/showProcessToastWS", `Building instance ${instanceName.value}`, { root: true });
          if (this.user.role.toLowerCase() !== "superadmin" && this.agree2 === false) {
            this.validateEula();
          }
          if (this.user.role.toLowerCase() !== "superadmin" && this.agree2 === true) {
            this.$router.push("/instance");
          }
          if (this.user.role.toLowerCase() === "superadmin") {
            this.$router.push("/instance");
          }
        })
        .catch((e) => {
          if (e.response && e.response.data && isLimitError(e.response.data.data)) {
            context.root.$store.dispatch("HOMEPAGE/showErrorToast", createLimitErrorMsg(e.response.data.data), { root: true });
          } else if (e.response && e.response.data && e.response.data.code == "INS-007") {
            if (e.response.data.data.includes("instance name in project must be unique"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Instance name has been already used in this project.", { root: true });
            else if (e.response.data.data.includes("total instance voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Instance quota has reached the limit!", { root: true });
            else if (e.response.data.data.includes("total volume voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Data disk quota has reached the limit!", { root: true });
            else if (e.response.data.data.includes("this package has already reached region limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Unable to use the instance flavor due to stock availability.", { root: true });
            else if (e.response.data.data.includes("RAM instance voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "RAM size has reached the limit!", { root: true });
            else if (e.response.data.data.includes("CPU instance voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "vCPU quota has reached the limit!", { root: true });
            else if (e.response.data.data.includes("instance root disk size voucher has reached limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Root disk size has reached the limit!", { root: true });
            else if (e.response.data.data.includes("you cant use trial instance with not trial storage disk"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Trial instance only can bind with trial storage disk.", { root: true });
            else if (e.response.data.data.includes("ram limit has reached in this region"))
              context.root.$store.dispatch(
                "HOMEPAGE/showErrorToast",
                "Unable to use the flavor in this region due to limitation. Please contact administrator.",
                { root: true }
              );
            else if (e.response.data.data.includes("RAM has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "RAM has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("vCPU has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "vCPU has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("Storage has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Storage has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("Storage sizes has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Storage size has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("cannot create trial instance with basic vpc")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Cannot create trial instance with basic VPC.", { root: true });
            } else if (e.response.data.data.includes("total volume size voucher has reached limit")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Data disk size has reached the limit!", { root: true });
            } else if (e.response.data.data.includes("cannot create basic instance with trial vpc")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Cannot create basic instance with trial TRIAL VPC.", { root: true });
            } else if (e.response.data.data.includes("vpc id is not found")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "VPC is not found, please reload page to get list vpc.", { root: true });
            } else if (e.response.data.data.includes("voucher has already expired")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "This voucher is expired.", { root: true });
            } else if (e.response.data.data.includes("Instance has exceeded the limit"))
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Instance has exceeded the limit. Please contact administrator.", { root: true });
            else if (e.response.data.data.includes("cpu limit has reached in this region"))
              context.root.$store.dispatch(
                "HOMEPAGE/showErrorToast",
                "Unable to use the flavor in this region due to limitation. Please contact administrator.",
                { root: true }
              );
            // else if(e.response.data.data.includes('Your balance is not enough')) context.root.$store.dispatch('HOMEPAGE/showErrorToast', e.response.data.data, { root: true })
            else if (e.response.data.data.includes("Your balance is not enough")) {
              setopendialogbalance(true);
              setopendialogbalancemsg(e.response.data.data);
            } else if (e.response.data.data.includes("Service activation")) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", e.response.data.data, { root: true });
            } else if (
              e.response.data.data.includes("You do not have enough limits to create instance with paid OS. Please get in touch with the administrator.")
            ) {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", e.response.data.data, { root: true });
            } else {
              context.root.$store.dispatch("HOMEPAGE/showErrorToast", "Cannot create instance. Please contact administrator.", { root: true });
            }
          } else if (e.response.data.data.includes("maximal limit for your organization")) {
            context.root.$store.dispatch("HOMEPAGE/showErrorToast", e.response.data.message, { root: true });
          } else if (e.response.data.data.includes("Service activation")) {
            context.root.$store.dispatch("HOMEPAGE/showErrorToast", e.response.data.data, { root: true });
          }

          if (errorMessage !== "") {
            context.root.$store.dispatch("HOMEPAGE/showErrorToast", errorMessage, { root: true });
          }
        });
    }

    const displayInstanceDialog = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      let os = selecttypeinstance.value === "operatingsystem" ? 
          {
            by: "custom", 
            item: {
              service_name: 'OS_CHARGING', 
              id: osSelected.value,
            }
          } : undefined

      let rootDisk = {
        by: customRootDiskSize.value ? "service" : "item", 
        item: {
          service_name: 'ROOT_DISK', 
          id: customRootDiskSize.value ? vm_root_disk_type_id.value : rootDiskSelected.value.id,
          ...(customRootDiskSize.value ? {
              tags: [
                {
                  name:'Volume',
                  qty: parseInt(removeGBText(customRootDiskSize.value)),
                }
              ]
            } : undefined)
        }
      }
      
      let dataDisk = []
      if (customDataDiskItems.value) {
        dataDisk.push(...customDataDiskItems.value.map(data => (
          data.package_storage_id === data.type ? 
          {
            by: "service", 
            item: {
              service_name: 'STORAGE', 
              id: data.type,
              tags: [
                {
                  name:'Volume',
                  qty: data.size,
                }
              ]
            }
          }
          :
          {
            by: "item", 
            item: {
              service_name: 'STORAGE', 
              id: data.package_storage_id,
            }
          }
        )))
      } 

      let items = [
        {
          by: "item", 
          item: {
            service_name: 'INSTANCE', 
            id: instanceselected.value.id,
          }
        }
      ]

      if (os) items.push(os)
      if (rootDisk) items.push(rootDisk)
      if (dataDisk) items.push(...dataDisk)

      await multiCheckAvailability(items)
      
      instanceDialog.value = true;
    }

    function enterSizeInGB(e) {
      if (e.code.match(/^Digit/)) {
        defaultstoragesize.value[0].size = Number("" + defaultstoragesize.value[0].size + e.key);
      } else if (e.code == "Backspace") {
        defaultstoragesize.value[0].size = Math.floor(defaultstoragesize.value[0].size / 10);
      }
    }

    const defaultBillingTypes = [
      {
        text: "Pay Per Use (PPU)",
        value: "PPU",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ];

    const fixedPostpaid = [
      {
        text: "Fixed",
        value: "Fixed",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ];

    const projJson = localstorage.getItem("currentProj");
    const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};
    const postpaid_type = projObj.postpaid_type;

    const billingTypes = postpaid_type && postpaid_type === "fixed" ? fixedPostpaid : defaultBillingTypes;

    let paramFetchImages = {
      limit: 999,
      region: projObj.region,
    };

    async function getVpcs() {
      let params = { trial: false };
      if (selectedBillingType.value == "Trial") {
        params = { active_trial: true, trial: true };
      }
      const vpcs = await useComposable.fetchvpcs(params);

      vpcItems.value = vpcs.map((vpc) => {
        let listSubnet = null;
        if (vpc.subnets.length >= 1)
            for (var i = 0; i < vpc.subnets.length; i++) {
                if (listSubnet == null)
                    listSubnet = vpc.subnets[i].ip_prefix + "/" + vpc.subnets[i].network_size;
                else
                    listSubnet = listSubnet + ", " + vpc.subnets[i].ip_prefix + "/" + vpc.subnets[i].network_size;
            }
        else
            listSubnet = vpc.ip_prefix + "/" + vpc.network_size;
        return {
          text: vpc.name +" (" + listSubnet +")",
          value: vpc.id,
        };
      });
    }

    watch(selectedBillingType, (val) => {
      getVpcs();
    });

    const setInstanceRef = async (instanceRef, imageRefID) => {
      if (instanceRef) {
        // set selected os
        // if (instanceRef.image_os) {
        //   const selectedOs = distinctOS.value.filter(os => os.value === instanceRef.image_os.os.id)
        //   if (selectedOs.length > 0) {
        //     const filteredVersion = images.value.filter((x) => x.os_id === selectedOs[0].value && instanceRef.image_os.versions_id === x.versions_id)

        //     if (filteredVersion.length > 0) {
        //       selecttypeinstance.value = 'operatingsystem'
        //       osSelected.value = selectedOs[0].value
        //       versionSelected.value = filteredVersion[0].id
        //     }
        //   }
        // } else {
        if (imageRefID) {
          selecttypeinstance.value = "instanceimage";

          // set instance image
          const image = selectCustomImages.value.find((image) => image.value === imageRefID) || {};
          selectedCustomImage.value = image.value
        }

        // set selected zone
        if (zoneByProject.value.length) {
          selectedZoneModel.value = zoneByProject.value.find((zone) => zone.name === instanceRef.zone) || null;
        }
        

        // set selected billing type
        selectedBillingType.value = instanceRef.billing_type;

        // set selected vpc
        if (vpcItems.value.length) {
          const vpc = vpcItems.value.find((vpc) => vpc.value === instanceRef.vpc_id) || {};
          vpcidselected.value = vpc.value
        }

        // set selected processor
        if (listProcessorType.value.length) {
          for(let i=0;i<listProcessorType.value.length;i++) {
            const processors = listProcessorType.value[i].text
            for(let j=0;j<processors.length;j++) {
              if(processors[j].value === instanceRef.package_instance.processor) {
                processor.value = processors[j].id
                break
              }
            }
          }
        }

        // set selected plan
        if (plans.value.length) {
          const plan = plans.value.find((plan) => plan.value === instanceRef.package_instance.type_id) || {};
          planSelected.value = plan.value
        }

        const params = new URLSearchParams();
        params.append("project_id", projObj.id);
        params.append("processor_id", processor.value);
        params.append("type_id", planSelected.value);
        await getListInstanceSize(params);
        if (listInstanceSize.value) {
          instanceselected.value = listInstanceSize.value.find((instance) => 
          instance.flavor_ids.length 
          && instanceRef.package_instance
          && instance.flavor_ids.includes(instanceRef.package_instance.preset_id)) || {}
        }

        // set selected storage type
        if (listStorageTypeBilling.value.length) {
          const storageType = listStorageTypeBilling.value.find((storage) => storage.id === instanceRef.root_disk_package.type_id) || {};
          vm_root_disk_type_id.value = storageType.id
        }

        if (vm_root_disk_type_id.value) {
          const storageParams = new URLSearchParams();
          storageParams.append("storage_type_id", vm_root_disk_type_id.value); 
          await getListInstanceRootDisk(storageParams);


          // set rootdisk package
          if (listInstanceRootDisk.value.length) {
            rootDiskSelected.value = listInstanceRootDisk.value.find(
              (rootdisk) => 
              rootdisk.volume_size === instanceRef.root_disk_package.volume_size 
              && rootdisk.type_id === instanceRef.root_disk_package.type_id
            ) || null;

            // if item not found set root disk from service (default pricing)
            if (!rootDiskSelected.value) {
              const params = new URLSearchParams();
              params.append("storage_type_id", vm_root_disk_type_id.value);
              await getDefaultPriceStorage(params);
              customRootDiskSize.value = `${instanceRef.root_disk_package.volume_size} GB`
            }
          }
        }
      }
    };

    onMounted(async () => {
      const activeProjectID = await libProject.getActiveProjectID();
      let paramFetchRegionByProject = {
        project_id: activeProjectID,
      };
      const params = new URLSearchParams();
      params.append("project_id", activeProjectID); 
      await getListInstanceType();
      await getListStorageType(params);
      // filterProcessor();
      await getProcessorType(params);
      setTimeout(() => {
        Promise.all([
          fetchVouchers(),
          useComposable.fetchregions(),
          useComposable.fetchregionbyproject(paramFetchRegionByProject),
          useComposable.fetchimages(paramFetchImages),
          useComposable.fetchCustomImages(),
          useComposable.fetchVolumeSize({ limit: 999 }),
          useComposable.fetchdefaultstoragesize(),
          useComposable.fetchsshkeys(),
          getStorageTypes(),
          getDiskSizeUsed(),
          useComposable.fetchzonebyproject(paramFetchRegionByProject),
          useComposable.fetchServerGroupByProject(),
        ]);
      }, 500);

      getVpcs();

      if (postpaid_type && postpaid_type === "fixed") {
        selectedBillingType.value = "";
      } else {
        selectedBillingType.value = "";
      }

      await fetchVoucherDiscountByProjectID(projObj.id);
      if (voucherDiscountProject.value) {
        osChargingDiscount.value = voucherDiscountProject.value.voucher_discount_detail.os_charging;
        rootDiskDiscount.value = voucherDiscountProject.value.voucher_discount_detail.root_disk;
      }

      // set ref value
      if (instanceRefID) {
        await fetchInstanceDetail(instanceRefID)
        setTimeout(async() => {
          await setInstanceRef(instanceDetail.value, imageRefID)
        }, 500);
      }
    });

    const volumeTypes = ref([]);

    async function getStorageTypes() {
      if (isDevModeStorageTiering2) {
        try {
          const activeProjectID = await libProject.getActiveProjectID();
          const res = await api.GET("/flavor/storage/type/region/" + activeProjectID + "");

          if (res.data.length) {
            volumeTypes.value = res.data.map((type) => {
              const { name, id } = type;
              const formattedName = {
                Basic: "Basic Volume HDD",
                Premium: "Premium Volume SSD with 2250 - 4500 IOPS",
                Standard: "Standard Volume SSD with 750 - 2500 IOPS",
              };

              return {
                text: isDevModeStorageTiering2 ? formattedName[name] : name,
                value: id,
                name: name,
              };
            });
          }
        } catch (e) {
          await showErrorToast("Sorry, an error occurred while displaying storage types");
          console.error(e);
        }
      }
    }

    const getInstanceDiscount = (flavor_ids) => {
      const voucherDiscount = voucherDiscountProject.value;
      if (voucherDiscount) {
        if (voucherDiscount.voucher_discount_detail.type === VoucherDiscountDetailType.INSTANCE_BASED) {
          return voucherDiscount.voucher_discount_detail.instance_based;
        } else {
          const discountFlavors = voucherDiscount.voucher_discount_detail.instance_flavors;
          if (discountFlavors && discountFlavors.length) {
            const flavors = discountFlavors.filter((x) => flavor_ids.include(x.package_instance_id));
            if (flavors && flavors.length) return flavors[0].discount;
          }
        }
      }
      return null;
    };

    const calculateCustomRootDisk = (discount = 0, unit = "month") => {
      const size = customRootDiskSize.value ? Number(customRootDiskSize.value.slice(0, customRootDiskSize.value.length - 3)) : 0;

      let price = 0;
      if (unit == "hour") {
        price = defaultPriceStorage.value.price_per_hour;
      } else {
        price = defaultPriceStorage.value.price_per_month;
      }

      let total = 0;
      total = price * size;

      if (discount) {
        discount = (price * size * discount) / 100;
        total = total - discount;
        discount = (price * size * discount) / 100;
        total = total - discount;
      }

      return toIDRWithDotFormat(Math.round(total));
    };

    const calculateRootDisk = (price, discount = 0) => {
      let total = 0;
      total = price;

      if (discount) {
        discount = (price * discount) / 100;
        total = total - discount;
      }

      return Math.round(total);
    };

    const changeType = (event) => {
      const params = new URLSearchParams();
      params.append("project_id", projObj.id);
      params.append("processor_id", processor.value);
      params.append("type_id", event);
      getListInstanceSize(params);
    };

    const changeTypeStorage = (event) => {
      const params = new URLSearchParams();
      params.append("storage_type_id", event);
      getListInstanceRootDisk(params);
      getDefaultPriceStorage(params);
    };

    const changeDataDiskSize = (event) => {
      const params = new URLSearchParams();
      params.append("storage_type_id", event);
      getDefaultInstanceDataDisk(params);
    };

    const getNameTypeStorage = (event) => {
      const data = listStorageTypeBilling.value.find((row) => row.id == event);
      return data.name;
    };

    return {
      instanceDetail,
      toIDRWithDotFormat,
      defaultcpu,
      defaultram,
      vm_root_disk_type_id,
      rootDiskVolumeSize,
      defaultDiskType,
      defaultDiskTypeError,
      defaultDiskSize,
      defaultDiskSizeError,
      addDefaultDiskError,
      addDefaultDisk,
      dataDisks,
      customDiskError,
      customDiskItemChange,
      deleteCustomDataDisk,
      addCustomDataDisk,
      customDataDiskHeaders,
      customDataDiskItems,
      is: (a, b) => {
        return a == b;
      },
      vouchers,
      selectedTrialVoucher,
      addGBText,
      removeGBText,
      isCustomSizeHighlighted,
      customSize,
      selectedVolumeType,
      storageselected,
      selectedBillingType,
      billingTypes,
      selectedCustomImage,
      selectCustomImages,
      customImages,
      distinctOS,
      messagefail,
      errorsshkey,
      opendialogfailcreate,
      enterSizeInGB,
      useRootDiskFromSnapshot,
      plans,
      planSelected,
      planValidation,
      instanceAmount,
      authentication,
      selectedssh,
      password,
      $v,
      ...useComposable,
      instanceName,
      voucher: ref(""),
      createInstance,
      selecttypeinstance,
      addvolume: ref(false),
      vpcItems,
      customRootDiskSize,
      isCustomRootDiskSizeHighlighted,
      rootDiskSelected,
      filteredFlavors,
      showCustomDiskFlavors,
      deletekey,
      sshkeyselected,
      updatekey,
      openDialogDeleteSsh,
      keyid,
      isLoading,
      volumeTypes,
      dialogupdate: ref(false),
      show1: ref(false),
      typeStorage,
      sizeActive,
      getInstanceDiscount,
      osChargingDiscount,
      rootDiskDiscount,
      calculateCustomRootDisk,
      calculateRootDisk,
      listInstanceSize,
      listInstanceType,
      changeType,
      listStorageTypeBilling,
      changeTypeStorage,
      listInstanceRootDisk,
      defaultInstanceDataDisk,
      changeDataDiskSize,
      defaultPriceStorage,
      getNameTypeStorage,
      defaultInstancePriceDataDisk,
      // getDefaultInstancePriceDataDisk
      // processorType,
      processor,
      // filterProcessor,
      // filterAmd,
      // processorAvailable,
      listProcessorType,
      instanceDialog,
      displayInstanceDialog,
    };
  },
  data() {
    return {
      agree: false,
      agree2: false,
      tnc: false,
      dataTnc: {},
      dialogssh: false,
      isDevModeStorageTiering,
      isDevModeStorageTiering2,
    };
  },
  async created() {
    await this.checkEula();
    await this.fetchregions();
    // await this.fetchregionbyproject();
    const vpcs = await this.fetchvpcs();
    this.vpcItems = vpcs.map((vpc) => {
      let listSubnet = null;
        if (vpc.subnets.length >= 1)
            for (var i = 0; i < vpc.subnets.length; i++) {
                if (listSubnet == null)
                    listSubnet = vpc.subnets[i].ip_prefix + "/" + vpc.subnets[i].network_size;
                else
                    listSubnet = listSubnet + ", " + vpc.subnets[i].ip_prefix + "/" + vpc.subnets[i].network_size;
            }
        else
            listSubnet = vpc.ip_prefix + "/" + vpc.network_size;
      return {
        text: vpc.name + " (" + listSubnet + ")",
        value: vpc.id,
      };
    });
    const projJson = localstorage.getItem("currentProj");

    const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};

    let paramFetchImages = {
      limit: 999,
      region: projObj.region,
    };
    await this.fetchimages(paramFetchImages);
    await this.fetchCustomImages();
    await this.fetchsshkeys();
    await this.fetchVolumeSize({ limit: 999 });
    await this.fetchdefaultstoragesize();
    await this.getStorageTypes();
  },
  beforeRouteEnter(to, from, next) {
    const { id } = to.params;
    Vue.store
      .dispatch("INSTANCE/validateInstanceCreate", null)
      .then(() => {
        next();
      })
      .catch(() => {
        if (from.path == "/") {
          next("/");
        }
      });
  },
  computed: {
    ...mapGetters({
      projectId: "PROJECT/getprojectid",
      user: "ROLEPERMISSION/getuser",
    }),
  },
  methods: {
    async validateEula() {
      var res = await api.POST("/useradmin/validate/eula", {
        form_name: "Form Create Instance",
        project_id: this.projectId,
      });
      if (res.code === 200) {
        this.$router.push("/instance");
      }
    },
    async checkEula() {
      var res = await api.GET("/useradmin/check/eula?project_id=" + this.projectId + "&form_name=Form Create Instance");
      if (res.code === 200) {
        this.agree2 = res.data.is_check;
        console.log("agree : ", this.agree2);
      }
    },
    async getEula() {
      const routeData = this.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create Instance" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    },
    formatPrice(num) {
      const numString = num.toString();
      const sisa = numString.length % 3;
      let rupiah = numString.substr(0, sisa);
      let ribuan = numString.substr(sisa).match(/\d{3}/g);
      let separator = "";

      if (ribuan) {
        separator = sisa ? "," : "";
        rupiah += separator + ribuan.join(",");
      }

      return "IDR " + rupiah;
    },
    async getStorageTypes() {
      if (isDevModeStorageTiering) {
        try {
          const activeProjectID = await libProject.getActiveProjectID();
          const res = await api.GET("/flavor/storage/type/region/" + activeProjectID + "");

          if (res.data.length) {
            const newArr = res.data.map((type) => {
              const { name, id } = type;
              const formattedName = {
                Premium: "Premium Volume SSD with 2250 - 4500 IOPS",
                Standard: "Standard Volume SSD with 750 - 2500 IOPS",
              };

              return {
                text: isDevModeStorageTiering2 ? formattedName[name] : name,
                value: id,
                name: name,
              };
            });

            this.volumeTypes = newArr;
          }
        } catch {
          this.$store.dispatch("HOMEPAGE/showErrorToast", "Sorry, an error occurred while displaying volume types");
        }
      }
    },
    log(e) {
      console.log(e);
    },
    // number input
    isNumber(e) {
      const charCode = e.which ? e.which : e.keyCode;

      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
      } else {
        return true;
      }
    },
  },
};
</script>

<style lang="css">
#customSize .v-label--active {
  top: 10px !important;
}

.out-of-stock {
  background-color: #dedede !important;
}
</style>

<style scoped lang="scss">
.select-instance,
.select-storage {
  cursor: pointer;

  &.selected {
    border-color: #2c94d2;

    .v-divider {
      border-color: #2c94d2;
    }
  }
}

.v-card.select-storage {
  p {
    margin-bottom: 0px;
    text-align: left;
  }
}

.v-card__title {
  line-height: 1.5rem;
}

.slide-fade-enter-active {
  transition: all 0.3s;

  &.ssh {
    position: relative;
  }

  &.password {
    position: absolute;
  }
}

.slide-fade-leave-active {
  &.ssh {
    position: relative;
  }

  &.password {
    position: absolute;
  }

  transition: all 0.3s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  /* .slide-fade-leave-active below version 2.1.8 */
  &.ssh {
    transform: translateX(-1200px);
  }

  &.password {
    transform: translateX(1200px);
  }

  opacity: 0;
}

.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}

.authentication {
  ::v-deep .v-icon {
    height: 30px;
    width: 30px;
  }

  ::v-deep .v-icon__svg {
    height: 30px;
    width: 30px;
  }
}

.bordererror {
  border: 1px solid red;
}

.v-input--radio-group {
  ::v-deep .v-messages__message {
    position: absolute;
    width: 100px;
  }
}

.select-version.v-text-field--outlined {
  ::v-deep fieldset {
    border-color: transparent;
    color: #2c94d2;
  }
}
#SelectVersion .v-select .dropdown-toggle {
  margin: 0;
}

.v-application p,
.v-application label,
.v-application td,
.v-application .select-version .v-menu__content {
  border-radius: 15px 15px 50px 50px;
}

.no-shadow {
  box-shadow: none !important;
}
.error-red {
  border: 1px solid red !important;
}
</style>
