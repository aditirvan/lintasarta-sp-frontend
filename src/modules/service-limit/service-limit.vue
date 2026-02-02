<template>
  <v-container fluid class="pa-0">
    <v-card class="rounded-lg" flat v-if="loadingService || loadingDbaas">
      <v-card-text class="d-flex justify-center">
        <v-progress-circular
          style="margin: auto"
          :size="200"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-card-text>
    </v-card>
    <v-card v-else flat class="pa-8 rounded-lg">
      <div class="table-title">Region</div>
      <v-col cols="2">        
        <div class="usage-detail text-left">
          {{ project.region || "-" }}
        </div>          
      </v-col>      

      <div class="table-title">Instance</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.compute.instances"
              :data="{
                datasets: [
                  datasets(
                    limitservices.compute.instances.used,
                    limitservices.compute.instances.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Instance</div>
          <div class="usage-detail" v-if="limitservices.compute.instances">
            Used {{ limitservices.compute.instances.used }} of
            {{ limitservices.compute.instances.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.compute.v_cpus"
              :data="{
                datasets: [
                  datasets(
                    limitservices.compute.v_cpus.used,
                    limitservices.compute.v_cpus.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">VCPUs</div>
          <div class="usage-detail" v-if="limitservices.compute.v_cpus">
            Used {{ limitservices.compute.v_cpus.used }} of
            {{ limitservices.compute.v_cpus.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.compute.ram"
              :data="{
                datasets: [
                  datasets(
                    limitservices.compute.ram.used / 1024,
                    limitservices.compute.ram.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">RAM</div>
          <div class="usage-detail" v-if="limitservices.compute.ram">
            Used {{ formatFromMegabytes(limitservices.compute.ram.used) }} of
            {{ gbToText(limitservices.compute.ram.limit) }} 
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.compute.server_groups"
              :data="{
                datasets: [
                  datasets(
                    limitservices.compute.server_groups.used,
                    limitservices.compute.server_groups.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Server Groups</div>
          <div class="usage-detail" v-if="limitservices.compute.server_groups">
            Used {{ limitservices.compute.server_groups.used }} of
            {{ limitservices.compute.server_groups.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.compute.server_group_members"
              :data="{
                datasets: [
                  datasets(
                    limitservices.compute.server_group_members.used,
                    limitservices.compute.server_group_members.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4" style="width: 280px">Server Group Members</div>
          <div class="usage-detail" v-if="limitservices.compute.server_group_members">
            Used {{ limitservices.compute.server_group_members.used }} of
            {{ limitservices.compute.server_group_members.limit }}
          </div>
        </v-col>
      </v-row>
      <div class="table-title">Storage</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.volumes.volumes"
              :data="{
                datasets: [
                  datasets(
                    limitservices.volumes.volumes.used,
                    limitservices.volumes.volumes.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Volumes</div>
          <div class="usage-detail" v-if="limitservices.volumes.volumes">
            Used {{ limitservices.volumes.volumes.used }} of
            {{ limitservices.volumes.volumes.limit }} 
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.volumes.volume_snapshots"
              :data="{
                datasets: [
                  datasets(
                    limitservices.volumes.volume_snapshots.used,
                    limitservices.volumes.volume_snapshots.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Volumes Snapshots</div>
          <div
            class="usage-detail"
            v-if="limitservices.volumes.volume_snapshots"
          >
            Used {{ limitservices.volumes.volume_snapshots.used }} of
            {{ limitservices.volumes.volume_snapshots.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.volumes.volume_storage"
              :data="{
                datasets: [
                  datasets(
                    limitservices.volumes.volume_storage.used,
                    limitservices.volumes.volume_storage.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Volume Storages</div>
          <div class="usage-detail" v-if="limitservices.volumes.volume_storage">
            Used
            {{
              limitservices.volumes.volume_storage.used
                ? formatCalculateVolumeStorage(limitservices.volumes.volume_storage.used)
                : "0 Bytes"
            }}
            of
            {{
              limitservices.volumes.volume_storage.limit == -1
                ? "unlimited"
                : formatCalculateVolumeStorage(limitservices.volumes.volume_storage.limit)
            }}
          </div>
        </v-col>
      </v-row>
      <div class="table-title">Deka Box</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.object_storage.object_storage_total"
              :data="{
                datasets: [
                  datasets(
                    limitservices.object_storage.object_storage_total.used,
                    limitservices.object_storage.object_storage_total.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Deka Box</div>
          <div
            class="usage-detail"
            v-if="limitservices.object_storage.object_storage_total"
          >
            Used {{ limitservices.object_storage.object_storage_total.used }} of
            {{
              limitservices.object_storage.object_storage_total.limit == -1
                ? "unlimited"
                : limitservices.object_storage.object_storage_total.limit
            }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.object_storage.object_storage"
              :data="{
                datasets: [
                  datasets(
                    limitservices.object_storage.object_storage.used,
                    limitservices.object_storage.object_storage.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Deka Box Size</div>
          <div
            class="usage-detail"
            v-if="limitservices.object_storage.object_storage"
          >
            Used
            {{
              limitservices.object_storage.object_storage.used
                ? `${limitservices.object_storage.object_storage.used} GB`
                : "0 Bytes"
            }}
            of
            {{
              limitservices.object_storage.object_storage.limit == -1
                ? "unlimited"
                : limitservices.object_storage.object_storage.limit
            }}
            GB
          </div>
        </v-col>
      </v-row>
      <div class="table-title">Network</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.network.floating_ips"
              :data="{
                datasets: [
                  datasets(
                    limitservices.network.floating_ips.used,
                    limitservices.network.floating_ips.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Floating IPs</div>
          <div class="usage-detail" v-if="limitservices.network.floating_ips">
            Allocated {{ limitservices.network.floating_ips.used }} of
            {{ limitservices.network.floating_ips.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.network.security_groups"
              :data="{
                datasets: [
                  datasets(
                    limitservices.network.security_groups.used,
                    limitservices.network.security_groups.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Security Groups</div>
          <div
            class="usage-detail"
            v-if="limitservices.network.security_groups"
          >
            Used {{ limitservices.network.security_groups.used }} of
            {{ limitservices.network.security_groups.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.network.security_group_rules"
              :data="{
                datasets: [
                  datasets(
                    limitservices.network.security_group_rules.used,
                    limitservices.network.security_group_rules.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Security Group Rules</div>
          <div
            class="usage-detail"
            v-if="limitservices.network.security_group_rules"
          >
            Used {{ limitservices.network.security_group_rules.used }} of
            {{ limitservices.network.security_group_rules.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.network.networks"
              :data="{
                datasets: [
                  datasets(
                    limitservices.network.networks.used,
                    limitservices.network.networks.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Networks</div>
          <div class="usage-detail" v-if="limitservices.network.networks">
            Used {{ limitservices.network.networks.used }} of
            {{ limitservices.network.networks.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.network.ports"
              :data="{
                datasets: [
                  datasets(
                    limitservices.network.ports.used,
                    limitservices.network.ports.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Ports</div>
          <div class="usage-detail" v-if="limitservices.network.ports">
            Used {{ limitservices.network.ports.used }} of
            {{ limitservices.network.ports.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.network.routers"
              :data="{
                datasets: [
                  datasets(
                    limitservices.network.routers.used,
                    limitservices.network.routers.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Routers</div>
          <div class="usage-detail" v-if="limitservices.network.routers">
            Used {{ limitservices.network.routers.used }} of
            {{ limitservices.network.routers.limit }}
          </div>
        </v-col>
      </v-row>
      <div class="table-title">DBaaS</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="dbaasLimit"
              :data="{
                datasets: [
                  datasets(
                    dbaasLimit.used,
                    dbaasLimit.limit
                  ),
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Datastore</div>
          <div class="usage-detail" v-if="dbaasLimit">
            Used {{ dbaasLimit.used }} of
            {{ dbaasLimit.limit }}
          </div>
        </v-col>
      </v-row>
      <div class="table-title">Paid OS</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.paid_os.paid_os"
              :data="{
                datasets: [
                  datasets(
                    limitservices.paid_os.paid_os.used,
                    limitservices.paid_os.paid_os.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Paid OS</div>
          <div class="usage-detail" v-if="limitservices.paid_os.paid_os">
            Used {{ limitservices.paid_os.paid_os.used }} of
            {{ limitservices.paid_os.paid_os.limit }}
          </div>
        </v-col>
      </v-row>
      <div class="table-title">CDN</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="cdnLimit"
              :data="{
                datasets: [
                  datasets(
                    cdnLimit.used,
                    cdnLimit.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">CDN</div>
          <div class="usage-detail" v-if="cdnLimit">
            Used {{ cdnLimit.used }} of
            {{ cdnLimit.limit }}
          </div>
        </v-col>
      </v-row>
      <div class="table-title">Backup Scheduler</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.backup_scheduler.backup_scheduler"
              :data="{
                datasets: [
                  datasets(
                    limitservices.backup_scheduler.backup_scheduler.used,
                    limitservices.backup_scheduler.backup_scheduler.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Backup Scheduler</div>
          <div class="usage-detail" v-if="limitservices.backup_scheduler.backup_scheduler">
            Used {{ limitservices.backup_scheduler.backup_scheduler.used }} of
            {{ limitservices.backup_scheduler.backup_scheduler.limit }}
          </div>
        </v-col>
      </v-row>
      
      <div class="table-title">Registry Limit</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="detailquotastatus<299 && detailquotastatus!=204"
              :data="{
                datasets: [
                  datasets(
                    detailquotalimits.Limit_registry.used,
                    detailquotalimits.Limit_registry.hard
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Registry</div>
          <div class="usage-detail" v-if="detailquotastatus<299 && detailquotastatus!=204">
            Used {{ detailquotalimits.Limit_registry.used }} of
            {{ detailquotalimits.Limit_registry.hard }}
          </div>
          <div class="usage-detail" v-else>
            Used 0 of 0
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="detailquotastatus<299 && detailquotastatus!=204"
              :data="{
                datasets: [
                  datasets(
                    detailquotalimits.Limit_storage.used,
                    detailquotalimits.Limit_storage.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Storage</div>
          <div class="usage-detail" v-if="detailquotastatus<299 && detailquotastatus!=204">
            Used {{ $formatSize(detailquotalimits.Limit_storage.used) }} of
            {{ $formatSize(detailquotalimits.Limit_storage.limit) }}
          </div>
          <div class="usage-detail" v-else>
            Used 0 of 0
          </div>
        </v-col>
      </v-row>

      <!-- DEKAROCK -->
      <div class="table-title">Dekarock</div>
      <v-row v-if="!loadingDekarock">
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
                :data="{
                datasets: [datasets(dekarockSettings.limit.cluster_used,dekarockSettings.limit.cluster)],
                labels: ['used', 'remaining'],
              }"
                :options="{
                legend: {display: false},
                tooltips: {enabled: false},
              }"
            />
          </div>
          <div class="usage-title pt-4">Cluster</div>
          <div class="usage-detail">
            Used {{ dekarockSettings.limit.cluster_used }} of {{dekarockSettings.limit.cluster}}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
                :data="{
                datasets: [datasets(dekarockSettings.limit.machine_set_used,dekarockSettings.limit.machine_set)],
                labels: ['used', 'remaining'],
              }"
                :options="{
                legend: {display: false},
                tooltips: {enabled: false},
              }"
            />
          </div>
          <div class="usage-title pt-4">Machine Set</div>
          <div class="usage-detail">
            Used {{ dekarockSettings.limit.machine_set_used }} of {{dekarockSettings.limit.machine_set}}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
                :data="{
                datasets: [datasets(dekarockSettings.limit.worker_used,dekarockSettings.limit.worker)],
                labels: ['used', 'remaining'],
              }"
                :options="{
                legend: {display: false},
                tooltips: {enabled: false},
              }"
            />
          </div>
          <div class="usage-title pt-4">Worker</div>
          <div class="usage-detail">
            Used {{dekarockSettings.limit.worker_used}} of {{dekarockSettings.limit.worker}}
          </div>
        </v-col>
      </v-row>
      <v-row v-else><v-col cols="6" class="d-flex flex-column align-center">Get Dekarock Limit still Loading . . .</v-col></v-row>
      <!-- DEKAROCK END -->

      <!-- DEKAHARBOR -->
    <div class="table-title">Deka Harbor</div>
      <v-row v-if="!loadingDekaharbor">
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
                :data="{
                datasets: [datasets(limitHarbor.used_master,limitHarbor.master)],
                labels: ['used', 'remaining'],
              }"
                :options="{
                legend: {display: false},
                tooltips: {enabled: false},
              }"
            />
          </div>
          <div class="usage-title pt-4">Cluster</div>
          <div class="usage-detail">
            Used {{ limitHarbor.used_master }} of {{limitHarbor.master}}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
                :data="{
                datasets: [datasets(limitHarbor.used_worker,limitHarbor.worker)],
                labels: ['used', 'remaining'],
              }"
                :options="{
                legend: {display: false},
                tooltips: {enabled: false},
              }"
            />
          </div>
          <div class="usage-title pt-4">Worker</div>
          <div class="usage-detail">
            Used {{ limitHarbor.used_worker }} of {{limitHarbor.worker}}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
                :data="{
                datasets: [datasets(limitHarbor.used_load_balancer,limitHarbor.load_balancer)],
                labels: ['used', 'remaining'],
              }"
                :options="{
                legend: {display: false},
                tooltips: {enabled: false},
              }"
            />
          </div>
          <div class="usage-title pt-4">Load Balancer</div>
          <div class="usage-detail">
            Used {{ limitHarbor.used_load_balancer }} of {{limitHarbor.load_balancer}}
          </div>
        </v-col>
      </v-row>
      <v-row v-else><v-col cols="6" class="d-flex flex-column align-center">Get Deka Harbor Limit still Loading . . .</v-col></v-row>
      <!-- DEKAHARBOR END -->

      <!-- NAT Gateway -->
      <div class="table-title">NAT Gateway</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="getLimitRouter"
              :data="{
                datasets: [
                  datasets(
                    getLimitRouter.router,
                    getLimitRouter.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">NAT Gateway</div>
          <div class="usage-detail" v-if="getLimitRouter">
            Used {{ getLimitRouter.router }} of
            {{ getLimitRouter.limit }}
          </div>
        </v-col>
      </v-row>
      <!-- NAT Gateway END -->

      <!-- VPN Limit -->
      <div class="table-title">VPN</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="getLimitVpn"
              :data="{
                datasets: [
                  datasets(
                    getLimitVpn.vpn,
                    getLimitVpn.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">VPN</div>
          <div class="usage-detail" v-if="getLimitVpn">
            Used {{ getLimitVpn.vpn }} of
            {{ getLimitVpn.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="getLimitVpn"
              :data="{
                datasets: [
                  datasets(
                    getLimitVpn.usr_ovpn,
                    getLimitVpn.limit_ovpn
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">User OpenVPN</div>
          <div class="usage-detail" v-if="getLimitVpn">
            Used {{ getLimitVpn.usr_ovpn }} of
            {{ getLimitVpn.limit_ovpn }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="getLimitVpn"
              :data="{
                datasets: [
                  datasets(
                    getLimitVpn.ipsec_phase2,
                    getLimitVpn.limit_ipsec_phase2
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">IPSec Phase 2</div>
          <div class="usage-detail" v-if="getLimitVpn">
            Used {{ getLimitVpn.ipsec_phase2 }} of
            {{ getLimitVpn.limit_ipsec_phase2 }}
          </div>
        </v-col>
      </v-row>
      <!-- VPN Limit END -->

      <!-- SLB Limit -->
      <div class="table-title">Load Balancer</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitSlb"
              :data="{
                datasets: [
                  datasets(
                    limitSlb.used_load_balancer,
                    limitSlb.load_balancer
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Server Load Balancer</div>
          <div class="usage-detail" v-if="limitSlb">
            Used {{ limitSlb.used_load_balancer }} of
            {{ limitSlb.load_balancer }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitGlb"
              :data="{
                datasets: [
                  datasets(
                    limitGlb.used_load_balancer,
                    limitGlb.load_balancer
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Global Load Balancer</div>
          <div class="usage-detail" v-if="limitGlb">
            Used {{ limitGlb.used_load_balancer }} of
            {{ limitGlb.load_balancer }}
          </div>
        </v-col>
      </v-row>
      <!-- SLB Limit END -->

      <!-- Deka AST -->
      <div class="table-title">Deka AST</div>
      <v-row v-if="!loadingDekaAst">
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
                :data="{
                datasets: [datasets(getServiceListAst.used_project,getServiceListAst.limit_project)],
                labels: ['used', 'remaining'],
              }"
                :options="{
                legend: {display: false},
                tooltips: {enabled: false},
              }"
            />
          </div>
          <div class="usage-title pt-4">Limit Project</div>
          <div class="usage-detail">
            Used {{ getServiceListAst.used_project }} of {{getServiceListAst.limit_project}}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
                :data="{
                datasets: [datasets(getServiceListAst.used_site,getServiceListAst.limit_site)],
                labels: ['used', 'remaining'],
              }"
                :options="{
                legend: {display: false},
                tooltips: {enabled: false},
              }"
            />
          </div>
          <div class="usage-title pt-4">Limit Site</div>
          <div class="usage-detail">
            Used {{ getServiceListAst.used_site }} of {{getServiceListAst.limit_site}}
          </div>
        </v-col>
        
      </v-row>
      <v-row v-else><v-col cols="6" class="d-flex flex-column align-center">Get Deka AST Limit still Loading . . .</v-col></v-row>
      <!-- Deka AST END -->

      <!-- DNS Limit -->
      <div class="table-title">Deka DNS</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="getLimitDns"
              :data="{
                datasets: [
                  datasets(
                    getLimitDns.site,
                    getLimitDns.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Site</div>
          <div class="usage-detail" v-if="getLimitDns">
            Used {{ getLimitDns.site }} of
            {{ getLimitDns.limit }}
          </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="getLimitDns"
              :data="{
                datasets: [
                  datasets(
                    getLimitDns.row,
                    getLimitDns.limit_row
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Record</div>
          <div class="usage-detail" v-if="getLimitDns">
            Used {{ getLimitDns.row }} of
            {{ getLimitDns.limit_row }}
          </div>
        </v-col>
      </v-row>
      <!-- DNS Limit END -->

      <div class="table-title">Deka Agent Premium</div>
      <v-row>
        <v-col cols="2" class="d-flex flex-column align-center">
          <div style="width: 80px">
            <pie
              v-if="limitservices.deka_agent.deka_agent_total"
              :data="{
                datasets: [
                  datasets(
                    limitservices.deka_agent.deka_agent_total.used,
                    limitservices.deka_agent.deka_agent_total.limit
                  ),
                ],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['used', 'remaining'],
              }"
              :options="{
                legend: {
                  display: false,
                },
                tooltips: {
                  enabled: false,
                },
              }"
            />
          </div>
          <div class="usage-title pt-4">Deka Agent Premium</div>
          <div
            class="usage-detail"
            v-if="limitservices.deka_agent.deka_agent_total"
          >
            Used
            {{
              limitservices.deka_agent.deka_agent_total.used
            }}
            of
            {{
              limitservices.deka_agent.deka_agent_total.limit
            }}
          </div>
        </v-col>
      </v-row>


      

    </v-card>
  </v-container>
</template>
<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
import pie from "./pie.vue";
import { LIMITSERVICE } from "./namespace";

import {
  defineComponent,
  computed,
  onMounted,
  ref,
  watch,
} from "@vue/composition-api";
import localstorage from "@/lib/localstorage";
import { useProjects } from "@/modules/project/useprojects";
import { DEKAROCK } from '@/modules/deka-rock/namespace';
import { HARBOR } from '@/modules/harbor/namespace';
import { NETWORKVPC } from '@/modules/network/vpc/namespace';
import { NETWORKVPN } from '@/modules/network/vpc/namespace';
import { VPN } from '@/modules/network/vpn/namespace';
import { SLB } from '@/modules/network/slb/namespace';
import { I3GIS } from '@/modules/sast/namespace'
import { DNS } from '@/modules/dns/namespace';


export default defineComponent({
  components: { pie },

  setup(props, context) {
    const { fetchServiceLimit } = useNamespacedActions(LIMITSERVICE, [
      "fetchServiceLimit",
    ]);
    const { getdetailquota } = useNamespacedActions("REGISTRY", [
      "getdetailquota",
    ]);
    const { detailquotalimits,detailquotastatus } =
      useNamespacedGetters("REGISTRY", [
        "detailquotalimits","detailquotastatus",
      ]);
    const { limitservices } = useNamespacedState(LIMITSERVICE, [
      "limitservices",
    ]);

    const { fetchDbaasLimit } = useNamespacedActions("RDBMS", [
      "fetchDbaasLimit"
    ]);
    const { dbaasLimit } = useNamespacedState("RDBMS", ["dbaasLimit"]);

    const { getCDNLimit } = useNamespacedActions("CDN", [
      "getCDNLimit"
    ]);
    const { fetchRouterLimit } = useNamespacedActions(NETWORKVPC, [
      "fetchRouterLimit"
    ]);
    const { fetchVpnLimit } = useNamespacedActions(VPN, [
      "fetchVpnLimit"
    ]);
    const { fetchDnsLimit } = useNamespacedActions(DNS, [
      "fetchDnsLimit"
    ]);
    const { cdnLimit } = useNamespacedState("CDN", ["cdnLimit"]);
    const { getDekarockSetting } = useNamespacedActions(DEKAROCK, ["getDekarockSetting"]);
    const { settings:dekarockSettings } = useNamespacedState(DEKAROCK, ["settings"]);
    const { fetchLimitHarbor } = useNamespacedActions(HARBOR, ["fetchLimitHarbor"]);
    const { limitHarbor } = useNamespacedState(HARBOR, ["limitHarbor"])
    const { getLimitRouter } = useNamespacedGetters(NETWORKVPC, ["getLimitRouter"])
    const { getLimitVpn } = useNamespacedGetters(VPN, ["getLimitVpn"])
    const { fetchLimitSlb } = useNamespacedActions(SLB, ["fetchLimitSlb"]);
    const { limitSlb } = useNamespacedState(SLB, ["limitSlb"]);
    const { fetchLimitGlb } = useNamespacedActions(SLB, ["fetchLimitGlb"]);
    const { limitGlb } = useNamespacedState(SLB, ["limitGlb"]);
    const { getServiceListSast } = useNamespacedActions(I3GIS, ["getServiceListSast"]);
    const { getServiceListAst } = useNamespacedGetters(I3GIS, ["getServiceListAst"]);
    const { getLimitDns } = useNamespacedGetters(DNS, ["getLimitDns"])

    // const { loginDbaas } = useNamespacedActions(
    //   "SUPERADMIN",
    //   ["loginDbaas"]
    // );

    const projected = ref();

    // const loading = ref(true);
    const loadingService = ref(true);
    const loadingDbaas = ref(true);
    const loadingCdn = ref(true);
    const loadingDekarock = ref(true);
    const loadingDekaharbor = ref(true);
    const loadingSlb= ref(true);
    const loadingGlb= ref(true);
    const loadingRouter = ref(true);
    const loadingVpn = ref(true);
    const loadingDekaAst = ref(true);
    const loadingDns = ref(true);
    // const locals = JSON.parse(localStorage.getItem("currentOrg") || "{}");
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const projectId = ref(currentProj.id);
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const organizationId = ref(currentOrg.id);

    const paramsDbaas = {
      organizationId: organizationId.value,
      projectId: projectId.value,
      userId: localStorage.getItem("userId")?.replaceAll('"', ""),
      username: localStorage.getItem("username")
    }
    
    onMounted(() => {
      fetchServiceLimit(projectId.value)
        .then(() => {
          loadingService.value = false;
        })
        .catch(() => {
          loadingService.value = false;
        });

      // loginDbaas(paramsDbaas)
      //   .then(() => {
          fetchDbaasLimit(projectId.value)
            .then(() => {
              loadingDbaas.value = false;
            })
            .catch(() => {
              loadingDbaas.value = false;
            });
        // })
        // .catch(() => {
        //   loadingDbaas.value = false;
        // })

      fetchRouterLimit()
        .then(() => {
          loadingRouter.value = false;
        })
        .catch(() => {
          loadingRouter.value = false;
        })

      fetchVpnLimit()
        .then(() => {
          loadingVpn.value = false;
        })
        .catch(() => {
          loadingVpn.value = false;
        })

      fetchDnsLimit()
        .then(() => {
          loadingDns.value = false;
        })
        .catch(() => {
          loadingDns.value = false;
        })

      getdetailquota()
        getCDNLimit(projectId.value).then(()=>{
          loadingCdn.value = false;
        }).catch((err)=>{
          loadingCdn.value = false;
        })
        
        getDekarockSetting({project_id: projectId.value}).then(() => {
          loadingDekarock.value = false;
        })
        .catch(() => {
          loadingDekarock.value = false;
        })
        fetchLimitHarbor({openstack_id: currentProj.openstack_project_id}).then(() => {
          loadingDekaharbor.value = false;
        })
        .catch(() => {
          loadingDekaharbor.value = false;
        })
        fetchLimitSlb({openstack_id: currentProj.openstack_project_id, tier: 'slb'}).then(() => {
          loadingSlb.value = false;
        })
        .catch(() => {
          loadingSlb.value = false;
        })
        fetchLimitGlb({openstack_id: currentProj.openstack_project_id, tier: 'glb'}).then(() => {
          loadingGlb.value = false;
        })
        .catch(() => {
          loadingGlb.value = false;
        })
        getServiceListSast({project_id: projectId.value,organization_id:organizationId.value}).then(()=>{
          loadingDekaAst.value = false;
        }).catch((err)=>{
          loadingDekaAst.value = false;
        })
      });

    const datasets = (useData, totalData) => {
      return {
        data: [useData, totalData - useData],
        backgroundColor: [
          useData / totalData <= 0.5
            ? "#2C94D2"
            : useData / totalData > 0.5 && useData / totalData < 1
            ? "#FBD834"
            : "#D9544F",
          "#EEEEEE",
        ],
        borderWidth: 0,
      };
    };
    const formatFromMegabytes = (mb) => {
      const decimals = 1;
      if (mb === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["MB", "GB", "TB", "PB"];

      const i = Math.floor(Math.log(mb) / Math.log(k));
      return parseFloat((mb / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    function gbToText(totalInGB) {
      const units = ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      if (totalInGB < 1) {
        // kalo di bawah 1 GB, convert ke MB
        const sizeInMB = totalInGB * 1024;
        const displaySize = Number.isInteger(sizeInMB) ? sizeInMB : sizeInMB.toFixed(2);
        return `${displaySize} MB`;
      }

      let size = totalInGB;
      let unitIndex = 1; // mulai dari GB

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      const displaySize = Number.isInteger(size) ? size : size.toFixed(2);
      return `${displaySize} ${units[unitIndex]}`;
    }


    const formatCalculateVolumeStorage = (gb) => {
      if(gb == 999) return 1 + " " + "TB";

      if(gb >= 1000) return gb/1000 + " " + "TB";
      
      const decimals = 1;
      if (gb === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["GB", "TB", "PB"];

      const i = Math.floor(Math.log(gb) / Math.log(k));
      return parseFloat((gb / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const formatCalculateFromGib = (value) => {
      return Math.ceil(value / 1.074);
    }

    watch(projectId, (val) => {
      console.log(val);
      fetchServiceLimit(val);
    });
    const convertBytes = function(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

      if (bytes == 0) {
        return "0 Bytes"
      }

      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

      if (i == 0) {
        return bytes + " " + sizes[i]
      }

      return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
    }
    return {
      convertBytes,
      projected,
      loadingDekarock,
      loadingDekaharbor,
      loadingSlb,
      loadingService,
      loadingDbaas,
      loadingDekaAst,
      datasets,
      limitservices,
      formatFromMegabytes,
      gbToText,
      formatCalculateVolumeStorage,
      formatCalculateFromGib,
      dbaasLimit,
      cdnLimit,
      getdetailquota,
      detailquotalimits,
      dekarockSettings,
      detailquotastatus,
      limitHarbor,
      limitSlb,
      limitGlb,
      getLimitRouter,
      getLimitVpn,
      getServiceListAst,
      getLimitDns
    };
  },
  computed: {
    project() {
      return JSON.parse(localstorage.getItem("currentProj"));
    },
  },
});
</script>
<style scoped>
.table-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
  padding-top: 20px;
  padding-bottom: 30px;
}

.usage-title {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 140%;
  /* or 22px */

  text-align: center;

  /* Primary/Font */

  color: #556272;
}

.usage-detail {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 140%;
  /* identical to box height, or 20px */

  text-align: center;

  /* Primary/ Blue Grey */

  color: #a5b3bf;
}

.pie {
  position: absolute;
  top: 344px;
  left: 92px;
}
</style>
