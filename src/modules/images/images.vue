<template>
  <v-container fluid>
    <v-row>
      <v-col class="pa-0">
        <v-card class="rounded-lg elevation-0 mb-5">
          <v-card-text class="pb-0 px-7 pt-6 d-flex flex-column">
            <div class="headline font-weight-bold font--text">Image</div>
          </v-card-text>
          <v-card-actions>
            <v-tabs v-model="tab">
              <v-tab to="/image/snapshot"><span class="mx-5">Snapshot</span></v-tab>
              <v-tab to="/image/backups"><span class="mx-5">Backups</span></v-tab>
              <v-tab v-if="isDevMode && isCorporate && !isRestoreError" to="/image/restore"><span class="mx-5">Restore</span></v-tab>
              <v-tab to="/image/customimage"><span class="mx-5">Custom Image</span></v-tab>
            </v-tabs>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="pa-0">
        <v-tabs-items v-model="$route.path">
          <v-tab-item value="/image/snapshot">
            <v-card flat class="rounded-lg elevation-0 mb-5 pt-6 pb-5 px-7">
              <v-card-text class="pa-0">
                <div v-if="!read_only">
                  <v-row>
                    <v-col class="pb-0 pt-0">
                      <div class="headline mb-3 font-weight-bold font--text">Take a Snapshot for Instance</div>
                      <p>Power-down Instance before taking a snapshot to ensure data consistency.</p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <p><b>Billing Type</b></p>
                      <v-select
                        id="billingType"
                        placeholder="Choose Instance Billing Type"
                        v-model="selectedBillingType"
                        :error-messages="createErrorMessage('selectedBillingType', $vSnapshotInstance)"
                        :items="billingTypes"
                        outlined
                      ></v-select>
                      <p v-if="selectedBillingType === 'PPU'"> {{ snapshotPriceText() }}</p>
                    </v-col>
                    <v-col cols="4" v-if="selectedBillingType == 'Trial'">
                      <v-select
                        id="trialVoucher"
                        placeholder="Choose trial voucher to use"
                        v-model="selectedTrialVoucher"
                        :error-messages="createErrorMessage('selectedTrialVoucher', $vSnapshotInstance)"
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
                    <v-col md="4">
                      <v-autocomplete
                        id="snapshotFrom"
                        outlined
                        allow-overflow
                        v-model="snapshotFrom"
                        placeholder="Choose an Instance"
                        :items="instancesActive"
                        hide-no-data
                        item-text="text"
                        item-value="value"
                        :error-messages="createErrorMessage('snapshotFrom', $vSnapshotInstance)"
                      >
                        <template v-slot:selection="data">
                          <v-icon v-if="data.item.value.instanceName" left>mdi-television</v-icon>
                          <v-icon v-else left>mdi-database</v-icon>
                          <div>{{ data.item.text }}</div>
                        </template>
                        <template v-slot:item="data">
                          <div v-if="data.item.value.instanceName">
                            <v-icon left>mdi-television</v-icon>
                          </div>
                          <div v-else>
                            <v-icon left>mdi-database</v-icon>
                          </div>
                          <div>{{ data.item.text }}</div>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col md="4">
                      <v-row>
                        <v-col class="py-0">
                          <div class="d-flex flex-row align-center">
                            <v-text-field
                              id="snapshotName"
                              v-model="snapshotName"
                              outlined
                              placeholder="Enter Snapshot Name"
                              :error-messages="createErrorMessage('snapshotName', $vSnapshotInstance)"
                            ></v-text-field>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="2">
                      <v-btn
                        v-if="user.role.toLowerCase() !== 'superadmin'"
                        depressed
                        width="150"
                        height="50"
                        color="secondary"
                        @click="
                          validateprivilages(['Images', 'editor']).then(() => {
                            isDevModeChargingForSnapshot ? displaySnapshotDialog() : doTakeSnapshot();
                          })
                        "
                      >
                        <beat-loader
                          v-if="snapshotInstanceIsLoading"
                          :loading="snapshotInstanceIsLoading"
                          :color="'white'"
                          :size="'10px'"
                          class="ml-2"
                        ></beat-loader>
                        <span v-else>Take Snapshot</span>
                      </v-btn>
                      <v-btn
                        v-else
                        depressed
                        width="150"
                        height="50"
                        color="secondary"
                        @click="
                          validateprivilages(['Images', 'editor']).then(() => {
                            doTakeSnapshot();
                          })
                        "
                      >
                        <beat-loader
                          v-if="snapshotInstanceIsLoading"
                          :loading="snapshotInstanceIsLoading"
                          :color="'white'"
                          :size="'10px'"
                          class="ml-2"
                        ></beat-loader>
                        <span v-else>Take Snapshot</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>

                <v-row>
                  <v-col v-if="instanceSnapshots.length">
                    <v-data-table
                      id="TableSnapshotInstance"
                      :hide-default-footer="true"
                      :headers="headers"
                      :items="instanceSnapshots.filter((x) => x.is_snapshot)"
                      :items-per-page="10"
                      class="elevation-0"
                    >
                      <template v-slot:item.name="{ item }">
                        <div class="d-flex">
                          <div class="dotblue mb-1" style="transform: translateY(2px)"></div>
                          <div>
                            <span class="primary--text">
                              {{ item.name }}
                            </span>
                          </div>
                        </div>
                      </template>

                      <template v-slot:item.size="{ item }">
                        <div>{{ item.size ? `${item.size} GB` : "-" }}</div>
                      </template>

                      <template v-slot:item.status="{ item }">
                        <span v-if="!item.is_upload_success && !item.is_upload_failed"> Not Ready Yet </span>
                        <span v-else-if="item.is_upload_success" class="primary--text mb-0"> Active </span>
                        <span v-else-if="item.is_upload_failed" class="error--text mb-0"> Failed </span>
                        <span v-else>N/A</span>
                      </template>

                      <template v-slot:item.instance="{ item }">
                        <router-link v-if="item.instance" :to="`/project/${projectName}/${item.instance.project_id}/${item.instance.id}/`">
                          <div class="d-flex align-items-center">
                            <div class="dotblue" style="transform: translateY(2px)"></div>
                            <div>
                              <span class="primary--text">
                                {{ item.instance.name }}
                              </span>
                            </div>
                          </div>
                        </router-link>
                        <div v-else>-</div>
                      </template>

                      <template v-slot:item.createddate="{ item }">
                        {{ moment(item.createddate).format("DD/MM/YYYY") }}
                      </template>

                      <template v-slot:item.action="{ item }">
                        <popupquote v-model="item.open" :offsetTop="21" :documentid="'popup' + item.id" offset-y allow-overflow>
                          <template v-slot:activator="{ on, attrs }">
                            <label
                              v-bind="attrs"
                              class="primary--text linkpointer"
                              style="position: relative; white-space: nowrap"
                              @click="
                                ($event) => {
                                  if (read_only) {
                                    return;
                                  }
                                  on.click($event);
                                  show($event, item);
                                  selectedSnapshot = item;
                                }
                              "
                              :style="[read_only ? { color: '#a9a9a9 !important' } : {}]"
                              >More
                              <v-icon
                                :class="{
                                  rotate: item.open,
                                }"
                                :id="'popup' + item.id"
                                color="primary"
                                >mdi-chevron-down</v-icon
                              >
                            </label>
                          </template>
                          <v-list>
                            <v-list-item
                              :disabled="!item.is_upload_success || disabledField"
                              :to="item.instance ? `/instance/create?image_ref=${item.id}&instance_ref=${item.instance.id}` : '/instance/create'"
                              exact
                            >
                              <v-list-item-title>Create Instance</v-list-item-title>
                            </v-list-item>

                            <v-list-item
                              @click="
                                () => {
                                  dialogRestore = true;
                                  selectedSnapshot = item;
                                }
                              "
                              style="border-bottom: 1px lightgrey solid"
                              :disabled="true"
                            >
                              <!-- temporary disabled -->
                              <!-- !item.is_upload_success || disabledField -->
                              <v-list-item-title> Restore Instance </v-list-item-title>
                            </v-list-item>

                            <v-list-item
                              :disabled="!item.is_upload_success || disabledField"
                              @click="
                                () => {
                                  validateprivilages(['Images', 'editor']).then(() => {
                                    dialogDel = true;
                                  });
                                }
                              "
                            >
                              <v-list-item-title><span class="error--text">Delete</span></v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </popupquote>
                      </template>
                      <template v-if="instanceSnapshots.length > 5" v-slot:footer="{ props }">
                        <custom-footer-datatable :props="props" />
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col v-else md="6" style="padding-top: 77px; padding-bottom: 76px" class="d-flex flex-column text-center ma-auto">
                    <p style="font-size: 16px" class="font-weight-bold">Looks like you don’t have any instance snapshots.</p>
                    <p style="color: #a5b3bf">
                      Snapshots allow you to manually copy and store an image of your volume. Take one using the form up top or from the “More” dropdown menu on
                      any volume.
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card flat class="rounded-lg elevation-0 mb-5 pt-6 pb-5 px-7">
              <v-card-text class="pa-0">
                <div v-if="!read_only">
                  <v-row>
                    <v-col class="pb-0 pt-0">
                      <div class="headline mb-3 font-weight-bold font--text" id="snapshotStorage">Take a Snapshot for Storage</div>
                      <p>Power-down Instance before taking a snapshot to ensure data consistency.</p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <p><b>Billing Type</b></p>
                      <v-select
                        id="billingType"
                        placeholder="Choose Snapshot Billing Type"
                        v-model="selectedStorageBillingType"
                        :error-messages="createErrorMessage('selectedStorageBillingType', $vStorage)"
                        :items="billingTypes"
                        outlined
                      ></v-select>
                      <p v-if="selectedStorageBillingType === 'PPU'"> {{ snapshotPriceText() }}</p>
                    </v-col>
                    <v-col cols="4" v-if="selectedStorageBillingType == 'Trial'">
                      <p><b>Trial Voucher</b></p>
                      <v-select
                        id="trialVoucher"
                        placeholder="Choose trial voucher to use"
                        v-model="selectedStorageTrialVoucher"
                        :error-messages="createErrorMessage('selectedStorageTrialVoucher', $vStorage)"
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
                    <v-col md="4">
                      <v-autocomplete
                        outlined
                        allow-overflow
                        v-model="snapshotStorageFrom"
                        placeholder="Choose a Storage"
                        :items="storageSelect"
                        hide-no-data
                        item-text="text"
                        item-value="value"
                        :error-messages="createErrorMessage('snapshotStorageFrom', $vStorage)"
                      >
                        <template v-slot:selection="data">
                          <v-icon v-if="data.item.value.instanceName" left>mdi-television</v-icon>
                          <v-icon v-else left>mdi-database</v-icon>
                          <div>{{ data.item.text }}</div>
                        </template>
                        <template v-slot:item="data">
                          <div v-if="data.item.value.instanceName">
                            <v-icon left>mdi-television</v-icon>
                          </div>
                          <div v-else>
                            <v-icon left>mdi-database</v-icon>
                          </div>
                          <div>{{ data.item.text }}</div>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col md="4">
                      <v-row>
                        <v-col class="py-0">
                          <div class="d-flex flex-row align-center">
                            <v-text-field
                              v-model="snapshotStorageName"
                              outlined
                              placeholder="Enter Snapshot Name"
                              :error-messages="createErrorMessage('snapshotStorageName', $vStorage)"
                            ></v-text-field>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col md="2">
                      <v-btn
                        v-if="user.role.toLowerCase() !== 'superadmin'"
                        depressed
                        width="150"
                        height="50"
                        color="secondary"
                        @click="
                          validateprivilages(['Images', 'editor']).then(() => {
                            isDevModeChargingForSnapshot ? displaySnapshotDialog2() : doTakeSnapshotStorage();
                          })
                        "
                      >
                        <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'" class="ml-2"></beat-loader>
                        <span v-else>Take Snapshot</span>
                      </v-btn>
                      <v-btn
                        v-else
                        depressed
                        width="150"
                        height="50"
                        color="secondary"
                        @click="
                          validateprivilages(['Images', 'editor']).then(() => {
                            doTakeSnapshotStorage();
                          })
                        "
                      >
                        <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'" class="ml-2"></beat-loader>
                        <span v-else>Take Snapshot</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
                <v-row>
                  <v-col v-if="storageSnapshots.length" key="">
                    <v-data-table
                      id="TablestorageSnapshots"
                      :hide-default-footer="true"
                      :headers="headerstorage"
                      :items="storageSnapshots"
                      :items-per-page="10"
                      class="elevation-0"
                    >
                      <template v-slot:item.name="{ item }">
                        <div class="d-flex align-items-center">
                          <div class="dotblue"></div>
                          <div>
                            <span class="primary--text">
                              {{ item.name }}
                            </span>
                            <!-- <p>create from {{ item.storage.name }}</p> -->
                          </div>
                        </div>
                      </template>

                      <template v-slot:item.size="{ item }">
                        <div>{{ item.size ? `${item.size} GB` : "-" }}</div>
                      </template>

                      <template v-slot:item.status="{ item }">
                        <p class="mb-0 primary--text" v-if="item.is_upload_success">Active</p>
                        <p class="mb-0 red--text" v-else-if="item.is_upload_failed">Failed</p>
                        <p class="mb-0" v-else>Not Ready Yet</p>
                      </template>
                      <template v-slot:item.storage="{ item }">
                        <div class="d-flex align-items-center mb-0" v-if="item.storage">
                          <div class="dotblue"></div>
                          <div>
                            <span class="primary--text">
                              {{ item.storage.name }}
                            </span>
                          </div>
                        </div>
                        <div v-else>
                          <span>-</span>
                        </div>
                      </template>
                      <template v-slot:item.createddate="{ item }">
                        <p class="ma-0">
                          {{ moment(item.createddate).format("DD/MM/YYYY") }}
                        </p>
                      </template>

                      <template v-slot:item.action="{ item }">
                        <popupquote v-model="item.open" :offsetTop="21" :documentid="'popup' + item.id" offset-y allow-overflow>
                          <template v-slot:activator="{ on, attrs }">
                            <label
                              v-bind="attrs"
                              class="primary--text linkpointer"
                              style="position: relative; white-space: nowrap"
                              @click="
                                ($event) => {
                                  if (read_only) {
                                    return;
                                  }
                                  on.click($event);
                                  show($event, item);
                                  selectedSnapshot = item;
                                }
                              "
                              :style="[read_only ? { color: '#a9a9a9 !important' } : {}]"
                              >More
                              <v-icon
                                :class="{
                                  rotate: item.open,
                                }"
                                :id="'popup' + item.id"
                                color="primary"
                                >mdi-chevron-down</v-icon
                              >
                            </label>
                          </template>
                          <v-list>
                            <v-list-item :disabled="!item.is_upload_success">
                              <v-list-item-title
                                ><router-link tag="button" style="cursor: pointer" :to="`/storage/create?psid=${item.storage.id}&iid=${item.id}`">
                                  <span class="primary--text">Create Storage</span>
                                </router-link></v-list-item-title
                              >
                            </v-list-item>

                            <v-list-item
                              :disabled="!item.is_upload_success && !item.is_upload_failed"
                              @click="
                                () => {
                                  validateprivilages(['Images', 'editor']).then(() => {
                                    selectedSnapshot = item;
                                    dialogDel = true;
                                  });
                                }
                              "
                            >
                              <v-list-item-title><span class="error--text">Delete</span></v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </popupquote>
                      </template>

                      <!-- <template v-slot:item.action="{ item }">
                        <div class="d-flex align-items-center">
                          <router-link tag="button" style="cursor: pointer" :to="`/storage/create?psid=${item.storage.id}&iid=${item.id}`">
                            <span class="primary--text">Create Storage</span>
                          </router-link>
                          <span style="height: auto; width: 20px; display: inline-block" />

                          <div disabled class="error--text hd-shd">
                            <span
                              @click="
                                () => {
                                  validateprivilages(['Images', 'editor']).then(() => {
                                    selectedSnapshot = item;
                                    dialogDel = true;
                                  });
                                }
                              "
                              style="cursor: pointer"
                            >
                              Delete</span
                            >
                          </div>
                        </div>
                      </template> -->

                      <template v-if="storageSnapshots.length > 5" v-slot:footer="{ props }">
                        <custom-footer-datatable :props="props" />
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col v-else md="6" style="padding-top: 77px; padding-bottom: 76px" class="d-flex flex-column text-center ma-auto">
                    <p style="font-size: 16px" class="font-weight-bold">Looks like you don’t have any volume snapshots.</p>
                    <p style="color: #a5b3bf">
                      Snapshots allow you to manually copy and store an image of your volume. Take one using the form up top or from the “More” dropdown menu on
                      any volume.
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item value="/image/backups">
            <v-card flat class="rounded-lg elevation-0 mb-5 pt-6 pb-5 px-7">
              <v-card-text class="pa-0">
                <div v-if="!read_only">
                  <v-row>
                    <v-col>
                      <div class="headline font-weight-bold font--text pb-4">Enable Backups</div>
                      <br />
                      <p>A backup is an automatic snapshot of your instance. Backups are made once a day and retained based on duration days information.</p>
                    </v-col>
                  </v-row>
                  <v-row class="align-center">
                    <v-col cols="6" md="5" class="pb-0">
                      <v-row>
                        <v-col cols="6" class="pb-0">
                          <div class="d-flex flex-column">
                            <h4 class="mb-2">Instance</h4>
                            <v-select
                              outlined
                              v-model="selectedInstance"
                              :items="instancecanbackupselected"
                              :no-data-text="isInstancesLoading ? 'Loading..' : 'No data available'"
                              :error-messages="createErrorMessage('selectedInstance', $vBackup)"
                              placeholder="Choose an Instance"
                            >
                              <template v-slot:selection="{ item }">
                                {{ item.text }}
                              </template>
                            </v-select>
                          </div>
                        </v-col>
                        <v-col cols="6" class="pb-0">
                          <div class="d-flex flex-column">
                            <h4 class="mb-2">Backup Time</h4>
                            <v-select
                              outlined
                              placeholder="Choose backup time"
                              :items="timeOptions"
                              v-model="selectedTime"
                              :error-messages="createErrorMessage('selectedTime', $vBackup)"
                            >
                            </v-select>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="6" md="5" class="pb-0">
                      <v-row>
                        <v-col cols="6" class="pb-0">
                          <div class="d-flex flex-column">
                            <h4 class="mb-2">Duration</h4>
                            <v-select
                              outlined
                              placeholder="Choose backup keep duration"
                              :items="durationOptions"
                              v-model="selectedDuration"
                              :error-messages="createErrorMessage('selectedDuration', $vBackup)"
                            >
                            </v-select>
                          </div>
                        </v-col>
                        <v-col cols="6" class="pb-0">
                          <div class="d-flex flex-column">
                            <h4 class="mb-2">Backup Name</h4>
                            <v-text-field
                              placeholder="Enter backup scheduler name"
                              outlined
                              v-model="backupName"
                              :error-messages="createErrorMessage('backupName', $vBackup)"
                            >
                              <template v-slot:selection="{ item }">
                                {{ item.text }}
                              </template>
                            </v-text-field>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="auto" md="2" class="pb-0">
                      <div class="d-flex flex-column">
                        <v-btn 
                          :disabled="disabledField" 
                          v-if="user.role.toLowerCase() !== 'superadmin'"
                          depressed 
                          width="150" 
                          class="mt-4" 
                          height="55" 
                          color="secondary" 
                          @click="validateprivilages(['Images', 'editor']).then(() => {
                            isDevModeChargingForSnapshot ? displayEnableBackupDialog() : doEnableBackup();
                          })"
                        >
                          Enable Backups
                        </v-btn>
                        <v-btn
                          :disabled="disabledField" 
                          v-else
                          depressed 
                          width="150" 
                          class="mt-4" 
                          height="55" 
                          color="secondary" 
                          @click="validateprivilages(['Images', 'editor']).then(() => {
                            doEnableBackup();
                          })"
                        >
                          Enable Backups
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="pt-1">
                      {{ backupPriceText() }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0 mt-4">
                      <div class="headline font-weight-bold font--text">Backup Scheduler</div>
                    </v-col>
                  </v-row>
                </div>

                <v-row>
                  <v-col>
                    <v-card flat class="tablecard">
                      <v-card-text class="py-0 px-3">
                        <v-row class="rounded-lg" style="background-color: #f1f2f2; font-weight: 700; border-bottom: thin solid rgba(0, 0, 0, 0.12)">
                          <v-col> Name </v-col>
                          <v-col> Instance </v-col>
                          <v-col> Backup Time </v-col>
                          <v-col> Duration </v-col>
                          <v-col> Number of Backup </v-col>
                          <v-col> Created At </v-col>
                          <v-col> Action </v-col>
                        </v-row>
                        <div class="font-weight-bold text-center mt-4" v-if="!backups.length">
                          {{ backupIsLoading ? "Loading.." : "No data available" }}
                        </div>
                        <div v-else>
                          <div v-for="(item, i) in backups" :key="i">
                            <v-row class="tbody" style="border-bottom: thin solid rgba(0, 0, 0, 0.12)">
                              <v-col class="d-flex align-center">
                                <p class="mb-0">{{ item.name }}</p>
                              </v-col>
                              <v-col class="d-flex align-center">
                                <router-link
                                  class="mb-0"
                                  v-if="item.instance"
                                  :to="`/project/${item.instance.project.name}/${item.project_id}/${item.instance.id}/agent`"
                                  >{{ item.instance.name }}</router-link
                                >
                                <p class="mb-0" v-else>-</p>
                              </v-col>
                              <v-col class="d-flex align-center">
                                <p class="mb-0">
                                  {{ item.hour >= 10 ? `${item.hour}:00` : `0${item.hour}:00` }}
                                </p>
                              </v-col>
                              <v-col class="d-flex align-center">
                                <p class="mb-0">{{ item.day_duration }} days</p>
                              </v-col>
                              <!-- <v-col class="d-flex align-center">
                                <p
                                  @click="
                                    () => {
                                      if (item.images.length) {
                                        if (openListBackup == i)
                                          openListBackup = null;
                                        else openListBackup = i;
                                      }
                                    }
                                  "
                                  class="mb-0"
                                  :class="{ linkpointer: item.images.length }"
                                >
                                  <span>
                                    {{
                                      item.images.length
                                        ? item.images.length
                                        : ""
                                    }}
                                    {{
                                      item.images.length > 1
                                        ? "Backups"
                                        : "Backup"
                                    }}
                                  </span>
                                  <v-icon
                                      color="primary"
                                      v-if="
                                      item.images.length && openListBackup == i
                                    "
                                  >mdi-chevron-up</v-icon
                                  >
                                  <v-icon
                                      color="primary"
                                      v-else-if="item.images.length"
                                  >mdi-chevron-down</v-icon
                                  >
                                </p>
                              </v-col> -->
                              <v-col class="d-flex align-center">
                                <p class="mb-0">
                                  <span>
                                    {{ item.images.length ? item.images.length : "" }}
                                    {{ item.images.length ? (item.images.length > 1 ? "Backups" : "Backup") : "-" }}
                                  </span>
                                </p>
                              </v-col>
                              <v-col class="d-flex align-center">
                                <p class="mb-0">
                                  {{ moment(item.created_at).format("DD/MM/YYYY") }}
                                </p>
                              </v-col>
                              <v-col class="d-flex align-center">
                                <p
                                  :style="[read_only ? { color: '#a9a9a9 !important' } : {}]"
                                  class="linkpointer error--text mb-0"
                                  @click="
                                    () => {
                                      if (read_only) {
                                        return;
                                      }
                                      validateprivilages(['Images', 'editor']).then(() => {
                                        // showDialogDeleteBackup(item);
                                        showDialogDeleteBackup(item, ['Images', 'editor']);
                                      });
                                    }
                                  "
                                >
                                  Delete
                                </p>
                              </v-col>
                            </v-row>
                            <!-- <transition name="slide-fade">
                              <div v-if="openListBackup == i">
                                <v-row
                                  class="tbody"
                                  v-for="(image, index) in item.images"
                                  :key="index"
                                >
                                  <v-col cols="12" md="10" class="pl-7">
                                    <div class="d-flex">
                                      <div class="dotblue mt-2"></div>
                                      <div style="color: #556272">
                                        {{ image.name }}
                                        <p
                                          class="accent--text"
                                          style="font-weight: 500"
                                        >
                                          Created
                                          {{
                                            moment(image.created_at).fromNow()
                                          }}
                                        </p>
                                      </div>
                                    </div>
                                  </v-col>
                                  <v-col class="d-flex align-center pt-0">
                                    <popupquote
                                      v-model="image.open"
                                      :offsetTop="24"
                                      :documentid="'popup' + image.id"
                                      offset-y
                                      :nudge-left="70"
                                      allow-overflow
                                    >
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <label
                                          v-bind="attrs"
                                          class="primary--text linkpointer"
                                          style="
                                            position: relative;
                                            white-space: nowrap;
                                          "
                                          @click="
                                            ($event) => {
                                              on.click($event);
                                            }
                                          "
                                          >More
                                          <v-icon
                                            :class="{
                                              rotate: image.open,
                                            }"
                                            :id="'popup' + image.id"
                                            color="primary"
                                            >mdi-chevron-down</v-icon
                                          >
                                        </label>
                                      </template>
                                      <v-list>
                                        <v-list-item
                                          to="/instance/create"
                                          exact
                                        >
                                          <v-list-item-title>
                                            Create Instance
                                          </v-list-item-title>
                                        </v-list-item>
                                        <v-list-item
                                          @click="
                                            () => {
                                              dialogRestore = true;
                                              selectedSnapshot = item;
                                            }
                                          "
                                        >
                                          <v-list-item-title>
                                            Restore Instance
                                          </v-list-item-title>
                                        </v-list-item>
                                      </v-list>
                                    </popupquote>
                                  </v-col>
                                </v-row>
                              </div>
                            </transition> -->
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <br />
              </v-card-text>
            </v-card>
            <v-card class="elevation-0 pt-6 pb-5 px-7">
              <v-card-text class="pa-0">
                <v-row>
                  <v-col class="py-0">
                    <div class="headline font-weight-bold font--text">Backup Results</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col v-if="instanceSnapshots.length">
                    <v-data-table
                      id="TableSnapshotInstance"
                      :hide-default-footer="true"
                      :headers="headers"
                      :items="instanceSnapshots.filter((x) => x.is_backup)"
                      :items-per-page="10"
                      class="elevation-0"
                    >
                      <template v-slot:item.name="{ item }">
                        <div class="d-flex">
                          <div class="dotblue"></div>
                          <div>
                            <span class="primary--text">
                              {{ item.name }}
                            </span>
                          </div>
                        </div>
                      </template>

                      <template v-slot:item.size="{ item }">
                        <div>{{ item.size ? `${item.size} GB` : "-" }}</div>
                      </template>

                      <template v-slot:item.status="{ item }">
                        <span v-if="!item.is_upload_success && !item.is_upload_failed"> Not Ready Yet </span>
                        <span v-else-if="item.is_upload_success" class="primary--text mb-0"> Active </span>
                        <span v-else-if="item.is_upload_failed" class="error--text mb-0"> Failed </span>
                        <span v-else>N/A</span>
                      </template>

                      <template v-slot:item.instance="{ item }">
                        <router-link
                          v-if="item.instance"
                          :to="`/project/${projectName}/${item.instance.project_id}/${item.instance.id}/agent`"
                        >
                          <div class="d-flex align-items-center">
                            <div class="dotblue"></div>
                            <div>
                              <span class="primary--text">
                                {{ item.instance.name }}
                              </span>
                            </div>
                          </div>
                        </router-link>
                        <div v-else>-</div>
                      </template>

                      <template v-slot:item.createddate="{ item }">
                        {{ moment(item.createddate).format("DD/MM/YYYY") }}
                      </template>

                      <template v-slot:item.action="{ item }">
                        <popupquote v-model="item.open" :offsetTop="21" :documentid="'popup' + item.id" offset-y allow-overflow>
                          <template v-slot:activator="{ on, attrs }">
                            <label
                              v-bind="attrs"
                              class="primary--text linkpointer"
                              style="position: relative; white-space: nowrap"
                              @click="
                                ($event) => {
                                  on.click($event);
                                  show($event, item);
                                  selectedSnapshot = item;
                                }
                              "
                              >More
                              <v-icon
                                :class="{
                                  rotate: item.open,
                                }"
                                :id="'popup' + item.id"
                                color="primary"
                                >mdi-chevron-down</v-icon
                              >
                            </label>
                          </template>
                          <v-list>
                            <v-list-item :disabled="!item.is_upload_success || disabledField" :to="item.instance ? `/instance/create?image_ref=${item.id}&instance_ref=${item.instance.id}` : '/instance/create'" exact>
                              <v-list-item-title>Create Instance</v-list-item-title>
                            </v-list-item>

                            <v-list-item
                              @click="
                                () => {
                                  dialogRestore = true;
                                  selectedSnapshot = item;
                                }
                              "
                              style="border-bottom: 1px lightgrey solid"
                              :disabled="true"
                            >
                              <v-list-item-title> Restore Instance </v-list-item-title>
                            </v-list-item>
                            <!-- temporary disabled
                            !item.is_upload_success || disabledField -->

                            <v-list-item
                              :disabled="disabledField"
                              @click="
                                () => {
                                  validateprivilages(['Images', 'editor']).then(() => {
                                    dialogDel = true;
                                  });
                                }
                              "
                            >
                              <v-list-item-title><span class="error--text">Delete</span></v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </popupquote>
                      </template>
                      <template v-if="instanceSnapshots.length > 5" v-slot:footer="{ props }">
                        <custom-footer-datatable :props="props" />
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col v-else md="6" style="padding-top: 77px; padding-bottom: 76px" class="d-flex flex-column text-center ma-auto">
                    <p style="font-size: 16px" class="font-weight-bold">Looks like you don’t have any instance snapshots.</p>
                    <p style="color: #a5b3bf">
                      Snapshots allow you to manually copy and store an image of your volume. Take one using the form up top or from the “More” dropdown menu on
                      any volume.
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item value="/image/customimage">
            <v-card flat class="rounded-lg elevation-0 mb-5 pt-6 pb-5 px-7">
              <v-card-text class="pa-0">
                <v-row>
                  <v-col>
                    <div class="headline font-weight-bold font--text pb-4">Custom Image</div>
                  </v-col>
                  <v-col class="flex-row text-right">
                    <v-btn
                      v-if="!read_only"
                      style="border: 3px solid"
                      depressed
                      width="150"
                      height="50"
                      class="secondary"
                      :disabled="disabledField"
                      @click="
                        () => {
                          showDialogImportImageURL = true;
                        }
                      "
                      >Import via URL</v-btn
                    >
                    <div style="height: auto; display: inline-block; width: 30px" />
                  </v-col>
                </v-row>

                <v-row
                  ><v-col>
                    <v-data-table
                      hide-default-footer
                      :headers="headercustomimage"
                      :items="customImages.filter((x) => x.is_custom === 1)"
                      :items-per-page="10"
                      class="elevation-0"
                    >
                      <template v-slot:item.image="{ item }">
                        <div class="d-flex">
                          <div class="dotblue mt-2"></div>
                          <div>
                            <span class="primary--text">
                              {{ item.name }}
                            </span>
                            <p>version {{ item.version }}</p>
                          </div>
                        </div>
                      </template>

                      <template v-slot:item.status="{ item }">
                        <p class="mb-0" v-if="item.is_upload_success">Active</p>
                        <p class="mb-0 red--text" v-else-if="item.is_upload_failed">Failed</p>
                        <p class="mb-0" v-else>Not Ready Yet</p>
                      </template>

                      <template v-slot:item.createddate="{ item }">
                        <p class="mb-0">
                          {{ moment(item.created_at).format("DD/MM/YYYY") }}
                        </p>
                      </template>

                      <template v-slot:item.action="{ item }">
                        <span style="height: auto; width: 20px; display: inline-block" />
                        <label
                          style="cursor: pointer"
                          @click="
                            () => {
                              if (read_only) {
                                return;
                              }
                              validateprivilages(['Images', 'editor']).then(() => {
                                selectedCustomImage = item;
                                showDialogDeleteCustomImage = true;
                              });
                            }
                          "
                          :style="[read_only ? { color: '#a9a9a9 !important' } : {}]"
                          ><span class="error--text">Delete</span></label
                        >
                      </template>
                      <template v-if="customImages.length > 5" v-slot:footer="{ props }">
                        <custom-footer-datatable :props="props" />
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="isCorporate && !isRestoreError" value="/image/restore">
            <restore :restore-total="restoreTotal" :restore-expired-date="restoreExpiredDate" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <dialogDeleteCustomImage v-model="showDialogDeleteCustomImage" :selectedCustomImage="selectedCustomImage" />
    <dialogDeleteBackup v-model="openDialogDeleteBackup" :selectedBackup="selectedBackup" @delete="doDeleteBackup(selectedBackup.id)" />
    <!-- <dialogUploadImage
      v-model="dialoguploadimage"
      @close="
        () => {
          dialoguploadimage = false;
        }
      "
    /> -->
    <dialogImportImageURL
      v-model="showDialogImportImageURL"
      @close="
        () => {
          showDialogImportImageURL = false;
        }
      "
    />
    <dialogBeforeRestoreInstance
      v-model="opendialogbeforerestoreinstance"
      @close="
        ($event) => {
          opendialogbeforerestoreinstance = $event;
        }
      "
      :item="payloadbeforerestore"
    />
    <dialogRestoreInstance
      v-model="dialogRestore"
      :selectedSnapshot="selectedSnapshot"
      @close="
        ($event) => {
          dialogRestore = $event;
        }
      "
      @submit="
        ($event) => {
          dialogRestore = false;
          opendialogbeforerestoreinstance = true;
          payloadbeforerestore = $event;
        }
      "
    />
    <dialogDelete
      v-if="selectedSnapshot"
      :snapshot="selectedSnapshot"
      v-model="dialogDel"
      @close="
        ($event) => {
          dialogDel = $event;
        }
      "
    />
    <!-- dialog purchase snapshot instance -->
    <dialogNewServiceAvailability
      v-if="snapshotDialog"
      :onClose="() => {snapshotDialog = false}"
      serviceName="Snapshot"
      actionName="Take Snapshot"
      :onAvailable="doTakeSnapshot"
    />

    <!-- dialog purchase snapshot storage -->
    <dialogNewServiceAvailability
      v-if="snapshotDialog2"
      :onClose="() => {snapshotDialog2 = false}"
      serviceName="Snapshot"
      actionName="Take Snapshot"
      :onAvailable="doTakeSnapshotStorage"
    />

    <!-- dialog purchase backup -->
    <dialogNewServiceAvailability
      v-if="backupDialog" 
      :onClose="() => {backupDialog = false}"
      serviceName="Backup"
      actionName="Create Backup Scheduler"
      :onAvailable="doEnableBackup"
    />
  </v-container>
</template>

<script>
import restore from "./restore";
import dialogBeforeRestoreInstance from "./dialogBeforeRestoreInstance";
import dialogUploadImage from "./dialogUploadImage";
import dialogImportImageURL from "./dialogImportImageURL";
import dialogRenameImage from "./dialogRenameImage";
import dialogAddtoRegion from "./dialogAddtoRegion";
import dialogRestoreInstance from "./dialogRestoreInstance";
import dialogTransfer from "./dialogTransfer";
import dialogDelete from "./dialogDelete";
import { computed, ref, onMounted, watch } from "@vue/composition-api";
import { useCreateStorage } from "../storage/composableapi/usecreatestorage";
import { useCreateSnapshot } from "./composableapi/usecreatesnapshot";
import { useBackupInstance } from "./composableapi/usebackupinstance";
import DialogImportImageURL from "./dialogImportImageURL.vue";
import libProject from "@/lib/project";
import { useNamespacedActions, useNamespacedState, useNamespacedGetters } from "vuex-composition-helpers";
import moment from "moment";
import Vue from "vue";
import dialogDeleteCustomImage from "./dialogDeleteCustomImage";
import dialogDeleteBackup from "./dialogDeleteBackup";
import { useVoucher } from "@/modules/voucher/useVoucher";
const { required, requiredIf, helpers, minLength } = require("@vuelidate/validators");
import useVuelidate from "@vuelidate/core";
import localstorage from "@/lib/localstorage";
import api from "@/lib/api";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import { mapGetters } from "vuex";
import { toIDRWithDotFormat } from "@/lib/formatter";
// const isDevMode = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevMode = false;
// const isDevModeChargingForSnapshot = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevModeChargingForSnapshot = true;

import { AccessControl } from "@/lib/middleware";

export default {
  setup(props, context) {
    const headers = ref([
      { text: "Name", value: "name" },
      { text: "Status", value: "status" },
      { text: "Instance Name", value: "instance" },
      { text: "Size", value: "size" },
      { text: "Created Date", value: "createddate" },
      { text: "Action", sortable: false, align: "center", value: "action" },
    ]);
    const headerstorage = ref([
      { text: "Name", value: "name" },
      { text: "Status", value: "status" },
      { text: "Storage Name", value: "storage" },
      { text: "Size", value: "size" },
      { text: "Created Date", value: "createddate" },
      { text: "Action", sortable: false, align: "center", value: "action" },
    ]);
    const headercustomimage = ref([
      { text: "Image", value: "image" },
      { text: "Region", value: "region" },
      { text: "Status", value: "status" },
      { text: "Created Date", value: "createddate" },
      { text: "Action", sortable: false, align: "center", value: "action" },
    ]);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Project Images"));
    const snapshotDialog = ref(false);
    const snapshotDialog2 = ref(false);
    const backupDialog = ref(false);
    const selectedBillingType = ref("");
    const selectedTrialVoucher = ref(null);
    const trialVoucherError = ref("");
    const selectedStorageBillingType = ref("");
    const selectedStorageTrialVoucher = ref(null);

    const { isLoading: isInstancesLoading } = useNamespacedState("INSTANCE", ["isLoading"]);

    const {checkAvailability} = useNewServiceAvailability()

    const selectedSnapshot = ref(null);

    const Composable = {
      ...useBackupInstance(),
      ...useCreateStorage(),
      ...useCreateSnapshot(),
    };
    
    const { snapshotFrom, snapshotName, snapshotStorageFrom, snapshotStorageName, takeInstanceSnapshot, takeStorageSnapshot } = Composable;

    const { storageSelect, instanceSelect, fetchinstances, fetchstorages, instancesActive } = Composable;
    const storageAndInstanceSelect = computed(() => {
      const con = instancesActive.value.concat(storageSelect.value);
      return con;
    });

    const searchinstance = ref("");
    const filteredInstance = ref([]);

    const $vSnapshotInstance = useVuelidate(
      {
        selectedBillingType: { required },
        snapshotName: {
          required,
          minLength: minLength(5),
          specialChars: helpers.withMessage("Cannot contain special character", (val) => {
            return !val.match(/[^A-Za-z0-9-_]/g);
          }),
        },
        snapshotFrom: { required },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value === "Trial";
          }),
        },
      },
      {
        selectedBillingType,
        snapshotName,
        snapshotFrom,
        selectedTrialVoucher, 
      },
      { lazy: true }
    );

    const $vStorage = useVuelidate(
      {
        selectedStorageBillingType: { required },
        snapshotStorageName: {
          required,
          minLength: minLength(5),
          specialChars: helpers.withMessage("Cannot contain special character", (val) => {
            return !val.match(/[^A-Za-z0-9-_]/g);
          }),
        },
        snapshotStorageFrom: { required },
        selectedStorageTrialVoucher: {
          required: helpers.withMessage("The value is required", (val) => {
            if (selectedStorageBillingType.value == "Trial" && selectedStorageTrialVoucher.value) return true;
            else if (selectedStorageBillingType.value != "Trial") return true;
            else return false;
          }),
        },
      },
      {
        snapshotStorageName,
        snapshotStorageFrom,
        selectedStorageTrialVoucher,
        selectedStorageBillingType,
      },
      { lazy: true }
    );

    const displaySnapshotDialog = async () => {
      $vSnapshotInstance.value.$touch();

      if (
        $vSnapshotInstance.value.selectedTrialVoucher.$invalid ||
        $vSnapshotInstance.value.snapshotName.$invalid ||
        $vSnapshotInstance.value.snapshotFrom.$invalid ||
        $vSnapshotInstance.value.selectedBillingType.$invalid
      )
        return false;

      if (selectedBillingType.value.toLowerCase() === "trial") {
        await doTakeSnapshot();
        return;
      }

      await checkAvailability(
        {
          by: "service", 
          item: {
            service_name: 'SNAPSHOT', 
            id: defaultSnapshotPrice.value.id,
            tags: [
              {
                name:'Volume',
                qty: parseInt(snapshotFrom.value.package.root_disk || 0) + parseInt(snapshotFrom.value.package.data_disk_total || 0),
              }
            ]
          }
        }
      )

      snapshotDialog.value = true;
    };

    const displaySnapshotDialog2 = async () => {
      $vStorage.value.snapshotStorageFrom.$touch();
      $vStorage.value.snapshotStorageName.$touch();
      $vStorage.value.selectedStorageBillingType.$touch();
      $vStorage.value.selectedStorageTrialVoucher.$touch();

      if (
        $vStorage.value.selectedStorageTrialVoucher.$invalid ||
        $vStorage.value.snapshotStorageName.$invalid ||
        $vStorage.value.snapshotStorageFrom.$invalid ||
        $vStorage.value.selectedStorageBillingType.$invalid
      )
        return false;
      
      if (selectedStorageBillingType.value.toLowerCase() === "trial") {
        await doTakeSnapshotStorage();
        return;
      }

      const size = snapshotStorageFrom.value.size.split(" ");
      await checkAvailability(
        {
          by: "service", 
          item: {
            service_name: 'SNAPSHOT', 
            id: defaultSnapshotPrice.value.id,
            tags: [
              {
                name:'Volume',
                qty: parseInt(size[0]),
              }
            ]
          }
        }
      )

      snapshotDialog2.value = true;
    };

    const displayEnableBackupDialog = async () => {
      $vBackup.value.$touch();

      if ($vBackup.value.backupName.$error) return;
      if ($vBackup.value.selectedDuration.$error) return;
      if ($vBackup.value.selectedTime.$error) return;
      if ($vBackup.value.selectedInstance.$error) return;

      const payload = {
        name: backupName.value,
        day_duration: selectedDuration.value,
        hour: selectedTime.value,
        instance_id: selectedInstance.value.id,
      };

      await checkAvailability(
        {
          by: "service", 
          item: {
            service_name: 'DAILY_BACKUP', 
            id: defaultBackupPrice.value.id,
            tags: [
              {
                name:'Volume',
                qty: parseInt(selectedInstance.value.package.root_disk || 0) + parseInt(selectedInstance.value.package.data_disk_total || 0),
              }
            ]
          }
        }
      )

      backupDialog.value = true
    };

    const { getDefaultSnapshotPrice, getDefaultBackupPrice } = useNamespacedActions("IMAGESBILLING", [
      "getDefaultSnapshotPrice", "getDefaultBackupPrice",
    ]);
    const { defaultSnapshotPrice, defaultBackupPrice } = useNamespacedGetters("IMAGESBILLING", [
      "defaultSnapshotPrice", "defaultBackupPrice",
    ]);

    const snapshotPriceText = () => {
      if (defaultSnapshotPrice.value.price_per_hour || defaultSnapshotPrice.value.price_per_month) {
        const currProjJson = localstorage.getItem("currentProj");
        const currProj = currProjJson && currProjJson !== "undefined" ? JSON.parse(currProjJson) : {};
        let text = "*Snapshot price is "
        if (currProj.payment_method === "postpaid") return text + toIDRWithDotFormat(defaultSnapshotPrice.value.price_per_month) + " /month (Per GB)"
        else return text + toIDRWithDotFormat(defaultSnapshotPrice.value.price_per_hour) + " /hour (Per GB)"
      }
      return ""
    }

    const backupPriceText = () => {
      if (defaultBackupPrice.value.price_per_hour || defaultBackupPrice.value.price_per_month) {
        const currProjJson = localstorage.getItem("currentProj");
        const currProj = currProjJson && currProjJson !== "undefined" ? JSON.parse(currProjJson) : {};
        let text = "*Backup price is "
        if (currProj.payment_method === "postpaid") return text + toIDRWithDotFormat(defaultBackupPrice.value.price_per_month) + " /month (Per GB)"
        else return text + toIDRWithDotFormat(defaultBackupPrice.value.price_per_hour) + " /hour (Per GB)"
      }
      return ""
    }
    
    const { CreateSnapshot, CreateStorageSnapshot, isLoading: snapshotInstanceIsLoading } = useCreateSnapshot();

    const { selectedDuration, selectedTime, backupName, selectedInstance, enableBackup, disableBackup } = useBackupInstance();

    const doTakeSnapshot = async () => {
      $vSnapshotInstance.value.$touch();

      if (
        $vSnapshotInstance.value.selectedTrialVoucher.$invalid ||
        $vSnapshotInstance.value.snapshotName.$invalid ||
        $vSnapshotInstance.value.snapshotFrom.$invalid ||
        $vSnapshotInstance.value.selectedBillingType.$invalid
      ) {
        return false;
      }

      const activeProjectID = await libProject.getActiveProjectID();
      let payload = {
        project_id: activeProjectID,
        name: snapshotName.value,
        instance_id: snapshotFrom.value.id,
        billing_type: selectedBillingType.value,
        filterByInstance: false,
        snapshot_service_id: defaultSnapshotPrice.value.id,
      };

      if (selectedBillingType.value == "Trial" && selectedTrialVoucher.value) payload.voucher_id = selectedTrialVoucher.value;

      const response = await takeInstanceSnapshot(payload);

      snapshotName.value = null;
      snapshotFrom.value = null;
      selectedTrialVoucher.value = null;
      selectedBillingType.value = "Default";
      snapshotDialog.value = false;

      $vSnapshotInstance.value.$reset();
      snapshotDialog.value = false;
    };

    const doTakeSnapshotStorage = async () => {
      $vStorage.value.$touch();
      if ($vStorage.value.snapshotStorageName.$invalid || $vStorage.value.snapshotStorageFrom.$invalid || $vStorage.value.selectedStorageBillingType.$invalid || $vStorage.value.selectedStorageTrialVoucher.$invalid) {
        return false;
      }

      const data = {
        project_id: await libProject.getActiveProjectID(),
        name: snapshotStorageName.value,
        storage_id: snapshotStorageFrom.value?.id,
        billing_type: selectedStorageBillingType.value,
        storage_service_id: defaultSnapshotPrice.value.id,
      };

      if (selectedStorageBillingType.value == "Trial" && selectedStorageTrialVoucher.value) data.voucher_id = selectedStorageTrialVoucher.value;
      await takeStorageSnapshot(data);
      snapshotStorageName.value = null;
      snapshotStorageFrom.value = null;
      selectedStorageTrialVoucher.value = null;
      selectedStorageBillingType.value = "";
      $vStorage.value.$reset();

      snapshotDialog2.value = false;
    };

    const doEnableBackup = async () => {
      const payload = {
        name: backupName.value,
        day_duration: selectedDuration.value,
        hour: selectedTime.value,
        instance_id: selectedInstance.value.id,
      };

      await enableBackup(payload)

      backupName.value = ""
      selectedDuration.value = null
      selectedTime.value = null 
      selectedInstance.value = null

      $vBackup.value.$reset();

      backupDialog.value = false;
    }

    const { vouchers, fetchVouchers } = useVoucher();
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

    const billingTypes = ref(postpaid_type && postpaid_type === "fixed" ? fixedPostpaid : defaultBillingTypes);

    watch(selectedTrialVoucher, (val) => {
      if (val) trialVoucherError.value = "";
    });

    const $vBackup = useVuelidate(
      {
        selectedDuration: { required, $autoDirty: true },
        selectedTime: { required, $autoDirty: true },
        backupName: {
          required,
          $autoDirty: true,
          minLength: minLength(5),
        },
        selectedInstance: { required, $autoDirty: true },
      },
      {
        selectedInstance,
        selectedDuration,
        selectedTime,
        backupName,
      }
    );

    const createErrorMessage = (element, validate) => {
      return validate[element].$errors.length ? validate[element].$errors[0].$message : "";
    };

    const disabledField = ref(false);
    const { validateprivilages, validateprivilagesync, validateprivilagesyncnew, openDialogDontHavePermition } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
      "openDialogDontHavePermition",
    ]);

    validateprivilagesyncnew(["Images", "editor"]).then((res) => {
      disabledField.value = res;
    });

    const doDeleteBackup = async (id) => {
      const response = await disableBackup(id);
      if (response.status == 200) {
        openDialogDeleteBackup.value = false;
        selectedBackup.value = null;
      }
    };

    const doRestoreInstance = async (event) => {
      console.log("event : ", event);
      // const response = await disableBackup(id);
      // if (response.status == 200) {
      //   openDialogDeleteBackup.value = false;
      //   selectedBackup.value = null;
      // }
    };

    // Custom Images
    const { customImages, instanceSnapshots, storageSnapshots, backups } = useNamespacedState("IMAGES", [
      "customImages",
      "instanceSnapshots",
      "storageSnapshots",
      "backups",
    ]);
    const { fetchCustomImage, fetchBackups, deleteCustomImage, fetchInstanceSnapshots, fetchStorageSnapshots, checkValidationSnapshot, checkValidationBackup } = useNamespacedActions(
      "IMAGES",
      ["fetchCustomImage", "deleteCustomImage", "fetchInstanceSnapshots", "fetchStorageSnapshots", "fetchBackups", "checkValidationSnapshot", "checkValidationBackup"]
    );

    onMounted(async () => {
      fetchinstances();
      fetchstorages();
      fetchCustomImage();
      fetchInstanceSnapshots();
      fetchStorageSnapshots();
      fetchBackups();
      fetchVouchers();
      getDefaultSnapshotPrice();
      getDefaultBackupPrice();

      if (read_only.value) {
        headers.value.pop();
        headerstorage.value.pop();
        headercustomimage.value.pop();
      }
    });

    const showDialogDeleteCustomImage = false;
    const selectedCustomImage = ref("");
    const openListBackup = ref(null);

    const selectedBackup = ref(null);
    const openDialogDeleteBackup = ref(false);
    const showDialogDeleteBackup = (item, payload) => {
      validateprivilagesyncnew(["Images", "editor"]).then((res) => {
        if (res) {
          openDialogDontHavePermition(payload);
        } else {
          openDialogDeleteBackup.value = true;
          selectedBackup.value = item;
        }
      });
    };

    return {
      read_only,
      headers,
      headerstorage,
      headercustomimage,
      isInstancesLoading,
      snapshotDialog,
      snapshotDialog2,
      backupDialog,
      displaySnapshotDialog,
      displaySnapshotDialog2,
      displayEnableBackupDialog,
      ...Composable,
      selectedBackup,
      openDialogDeleteBackup,
      showDialogDeleteBackup,
      openListBackup,
      doDeleteBackup,
      projectName: localStorage.getItem("projectname"),
      showDialogDeleteCustomImage,
      selectedCustomImage,
      moment,
      disabledField,
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      customImages,
      $vStorage,
      selectedSnapshot,
      snapshotStorageFrom,
      snapshotStorageName,
      snapshotFrom,
      snapshotName,
      createErrorMessage,
      searchinstance,
      filteredInstance,
      storageAndInstanceSelect,
      selectedDuration,
      selectedTime,
      backupName,
      selectedInstance,
      $vSnapshotInstance,
      $vBackup,
      vouchers,
      selectedTrialVoucher,
      selectedStorageTrialVoucher,
      selectedBillingType,
      selectedStorageBillingType,
      billingTypes,
      doTakeSnapshot,
      trialVoucherError,
      snapshotInstanceIsLoading,
      instanceSelect,
      instancesActive,
      doTakeSnapshotStorage,
      doEnableBackup,
      doRestoreInstance,
      checkValidationSnapshot,
      snapshotPriceText,
      backupPriceText,
      defaultSnapshotPrice,
    };
  },
  created() {},
  beforeRouteUpdate(to, from, next) {
    next();
  },
  watch: {},
  data() {
    const customimage = [];
    return {
      tnc1: false,
      tnc2: false,
      dataTnc1: {},
      dataTnc2: {},
      isDevMode,
      isDevModeChargingForSnapshot,
      isRestoreError: true,
      restoreTotal: 0,
      restoreExpiredDate: "",
      payloadbeforerestore: null,
      opendialogbeforerestoreinstance: false,
      dialogDel: false,
      dialogT: false,
      dialogRestore: false,
      dialogCreateStorage: false,
      dialogRegion: false,
      dialogRename: false,
      dialoguploadimage: false,
      showDialogImportImageURL: false,
      editfilelisting: false,
      editcdn: false,
      tab: null,
      tab1: null,
      customimage,
      headers1: [
        { text: "Name", value: "name" },
        { text: "Action", value: "action", sortable: false },
      ],
      panel: [0],
      showMenu: false,
      x: 0,
      y: 0,
    };
  },
  methods: {
    log(e) {
      console.log(e);
    },
    show(e, snapshot) {
      this.selectedSnapshot = snapshot;
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY + 10;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
  },
  components: {
    dialogNewServiceAvailability,
    restore,
    dialogBeforeRestoreInstance,
    dialogDeleteCustomImage,
    dialogImportImageURL,
    dialogDeleteBackup,
    // dialogUploadImage,
    // dialogRenameImage,
    // dialogAddtoRegion,
    dialogRestoreInstance,
    // dialogTransfer,
    dialogDelete,
  },
  computed: {
    isCorporate() {
      return localstorage.getItem("type") === "C";
    },
    ...mapGetters({
      projectId: "PROJECT/getprojectid",
      user: "ROLEPERMISSION/getuser",
    }),
  },
  mounted(){
    this.$nextTick(()=>{
      let self = this
      console.log(self.$refs) // Shows the mapRef object reference
      console.log(self.$refs.mapRef) // returns undefined ???
    });
  }
  // mounted() {
  //   this.getRestoreQuota();
  // },
};
</script>

<style lang="scss" scoped>
.v-window.v-item-group {
  background-color: transparent;
}

.v-input-append {
  ::v-deep .v-input__slot {
    background: lightgray !important;
  }
}
.v-tab:not(.v-tab--active) {
  color: #a5b3bf !important;
}
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
.v-data-table {
  ::v-deep table {
    border-bottom: 0px solid #e0e0e0;
  }
  ::v-deep td {
    border-bottom: 1px solid #e0e0e0;
  }
}
.table-status {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-transform: capitalize;
  color: #a5b3bf;
  padding-top: 5px;
}
.tablecard {
  .row {
    font-weight: 600;
  }
  .tbody {
    // border-bottom: thin solid rgba(0, 0, 0, 0.12);
    .col {
      padding-top: 20px;
      padding-bottom: 14px;
    }
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 100ms ease-in;
  max-height: 300px;
  overflow: hidden;
}
.slide-fade-enter,
.slide-fade-leave-to {
  max-height: 0px;
}
.hd-shd {
  box-shadow: none !important;
}
.theme--light.v-btn.v-btn--has-bg {
  background-color: transparent;
}
</style>
