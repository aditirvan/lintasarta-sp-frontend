<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4">
        Custom Deka Flexi
      </div>
      <v-card class="rounded-lg" flat v-if="isLoading">
        <v-card-text class="d-flex justify-center">
          <v-progress-circular
            style="margin: auto"
            :size="200"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-card-text>
      </v-card>
      <div v-else>
        <div class="headline font-weight-bold darkblue--text mt-6">
          Instance
        </div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Instances</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="instances"
                  type="number"
                  :error-messages="
                    $v.instances.$errors.length
                      ? $v.instances.$errors[0].$message
                      : ''
                  "
                />
                <p class="font-weight-bold pt-6">RAM</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="ram"
                  suffix="GB"
                  type="number"
                  :error-messages="
                    $v.ram.$errors.length ? $v.ram.$errors[0].$message : ''
                  "
                />
              </v-col>
              <v-col>
                <p class="font-weight-bold">VCPUs</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="v_cpus"
                  type="number"
                  :error-messages="
                    $v.v_cpus.$errors.length
                      ? $v.v_cpus.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Server Groups</p>
                <v-text-field
                    outlined
                    placeholder="0"
                    single-line
                    v-model="server_groups"
                    type="number"
                    :error-messages="
                    $v.server_groups.$errors.length
                      ? $v.server_groups.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
              <v-col>
                <p class="font-weight-bold">Server Group Members</p>
                <v-text-field
                    outlined
                    placeholder="0"
                    single-line
                    v-model="server_group_members"
                    type="number"
                    :error-messages="
                    $v.server_group_members.$errors.length
                      ? $v.server_group_members.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider />
        <div class="headline font-weight-bold darkblue--text mt-6">Volume</div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Volumes</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="volumes"
                  type="number"
                  :error-messages="
                    $v.volumes.$errors.length
                      ? $v.volumes.$errors[0].$message
                      : ''
                  "
                />
                <p class="font-weight-bold pt-6">Volume Storage</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="volume_storage"
                  type="number"
                  suffix="GB"
                  :error-messages="
                    $v.volume_storage.$errors.length
                      ? $v.volume_storage.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
              <v-col>
                <p class="font-weight-bold">Volume Snapshots</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="volume_snapshots"
                  type="number"
                  :error-messages="
                    $v.volume_snapshots.$errors.length
                      ? $v.volume_snapshots.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider />
        <v-divider />
        <div class="headline font-weight-bold darkblue--text mt-6">Network</div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Floating IPs</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="floating_ips"
                  type="number"
                  :error-messages="
                    $v.floating_ips.$errors.length
                      ? $v.floating_ips.$errors[0].$message
                      : ''
                  "
                />
                <p class="font-weight-bold">Security Groups Rules</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="security_group_rules"
                  type="number"
                  :error-messages="
                    $v.security_group_rules.$errors.length
                      ? $v.security_group_rules.$errors[0].$message
                      : ''
                  "
                />
                <p class="font-weight-bold">Ports</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="ports"
                  type="number"
                  :error-messages="
                    $v.ports.$errors.length ? $v.ports.$errors[0].$message : ''
                  "
                />
              </v-col>
              <v-col>
                <p class="font-weight-bold">Security Groups</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="security_groups"
                  type="number"
                  :error-messages="
                    $v.security_groups.$errors.length
                      ? $v.security_groups.$errors[0].$message
                      : ''
                  "
                />
                <p class="font-weight-bold">Networks</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="networks"
                  type="number"
                  :error-messages="
                    $v.networks.$errors.length
                      ? $v.networks.$errors[0].$message
                      : ''
                  "
                />
                <p class="font-weight-bold">Routers</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="routers"
                  type="number"
                  :error-messages="
                    $v.routers.$errors.length
                      ? $v.routers.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider />
        <div class="headline font-weight-bold darkblue--text mt-6">
          Paid Os
        </div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold pt-6">Paid Os</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="paid_os"
                  type="number"
                  :error-messages="
                    $v.paid_os.$errors.length ? $v.paid_os.$errors[0].$message : ''
                  "
                />
              </v-col>
              <v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider />
        <div class="headline font-weight-bold darkblue--text mt-6">
          Backup Scheduler
        </div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold pt-6">Backup Scheduler</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="backup_scheduler"
                  type="number"
                  :error-messages="
                    $v.backup_scheduler.$errors.length ? $v.backup_scheduler.$errors[0].$message : ''
                  "
                />
              </v-col>
              <v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              height="58"
              depressed
              block
              color="accent"
              :to="`/organization-detail/${organizationId}`"
              exact
            >
              <span style="font-size: 16px"> Cancel</span>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              height="58"
              depressed
              block
              color="secondary"
              @click="submit"
            >
              <span style="font-size: 16px"> Submit</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required, minValue, helpers} from "@vuelidate/validators";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {
    const { fetchServiceLimit, updateServiceLimit } = useNamespacedActions(
      "LIMITSERVICE",
      ["fetchServiceLimit", "updateServiceLimit"]
    );
    const isLoading = ref(true);
    const instances = ref(0);
    const ram = ref(0);
    const v_cpus = ref(0);
    const server_groups = ref(0);
    const server_group_members = ref(0);
    const volumes = ref(0);
    const volume_storage = ref(0);
    const volume_snapshots = ref(0);
    const floating_ips = ref(0);
    const security_group_rules = ref(0);
    const ports = ref(0);
    const security_groups = ref(0);
    const networks = ref(0);
    const routers = ref(0);
    const paid_os = ref(0);
    const backup_scheduler = ref(0);
    const handle_backup_scheduler = ref(0);
    const handle_paid_os = ref(0);

    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const organizationId = ref(currentOrg.id);
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const projectId = ref(currentProj.id);
    onMounted(async() => {
      await fetchServiceLimit(projectId.value)
        .then(({ data: { data } }) => {
          console.log(data);
          instances.value = data.compute.instances.limit;
          ram.value = data.compute.ram.limit;
          v_cpus.value = data.compute.v_cpus.limit;
          server_groups.value = data.compute.server_groups.limit;
          server_group_members.value = data.compute.server_group_members.limit;
          volumes.value = data.volumes.volumes.limit;
          volume_storage.value = data.volumes.volume_storage.limit;
          volume_snapshots.value = data.volumes.volume_snapshots.limit;
          floating_ips.value = data.network.floating_ips.limit;
          networks.value = data.network.networks.limit;
          ports.value = data.network.ports.limit;
          routers.value = data.network.routers.limit;
          security_groups.value = data.network.security_groups.limit;
          security_group_rules.value = data.network.security_group_rules.limit;
          paid_os.value = data.paid_os.paid_os.limit;
          backup_scheduler.value = data.backup_scheduler.backup_scheduler.limit;
          if(data.paid_os.paid_os.limit == data.paid_os.paid_os.used){
            handle_paid_os.value = data.paid_os.paid_os.limit;
          }else{
            handle_paid_os.value = data.paid_os.paid_os.used;
          }

          if(data.backup_scheduler.backup_scheduler.limit == data.backup_scheduler.backup_scheduler.used){
            handle_backup_scheduler.value = data.backup_scheduler.backup_scheduler.limit;
          }else{
            handle_backup_scheduler.value = data.backup_scheduler.backup_scheduler.used;
          }
          isLoading.value = false;
        })
        .catch(() => {
          isLoading.value = false;
        });
    });

    const $v = useVuelidate(
      {
        instances: { required, minValue: minValue(1) },
        ram: { required, minValue: minValue(1) },
        v_cpus: { required, minValue: minValue(1) },
        server_groups: { required, minValue: minValue(1) },
        server_group_members: { required, minValue: minValue(1) },
        volumes: { required, minValue: minValue(1) },
        volume_storage: { required, minValue: minValue(1) },
        volume_snapshots: { required, minValue: minValue(1) },
        floating_ips: { required, minValue: minValue(1) },
        security_group_rules: { required, minValue: minValue(1) },
        security_groups: { required, minValue: minValue(1) },
        ports: { required, minValue: minValue(1) },
        networks: { required, minValue: minValue(1) },
        routers: { required, minValue: minValue(1) },
        paid_os: { $autoDirty: true, required, maxWeight: helpers.withMessage(
            "Value must be greater than existing value",
            val => { 
              let valid = true
              if(val < parseInt(handle_paid_os.value)){
                valid = false
              } 
              return valid
            }
          )},
        
        backup_scheduler: { $autoDirty: true, required, maxWeight: helpers.withMessage(
            "Value must be greater than existing value",
            val => { 
              let valid = true
              if(val < parseInt(handle_backup_scheduler.value)){
                valid = false
              } 
              return valid
            }
          )},
      },
      {
        instances,
        ram,
        v_cpus,
        server_groups,
        server_group_members,
        volumes,
        volume_storage,
        volume_snapshots,
        floating_ips,
        security_group_rules,
        security_groups,
        ports,
        networks,
        routers,
        paid_os,
        backup_scheduler,
      }
    );
    const { showErrorToast, showSuccessToast } = useNamespacedActions(
      "HOMEPAGE",
      ["showErrorToast", "showSuccessToast"]
    );
    const submit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        id: projectId.value,
        data: {
          compute: {
            instances: parseInt(instances.value),
            ram: parseInt(ram.value),
            v_cpus: parseInt(v_cpus.value),
            server_groups: parseInt(server_groups.value),
            server_group_members: parseInt(server_group_members.value),
          },
          volume: {
            volumes: parseInt(volumes.value),
            // volume_storage: parseInt(Math.ceil(volume_storage.value * 1.074)),
            volume_storage: parseInt(volume_storage.value),
            volume_snapshots: parseInt(volume_snapshots.value),
          },
          network: {
            floating_ips: parseInt(floating_ips.value),
            security_group_rules: parseInt(security_group_rules.value),
            security_groups: parseInt(security_groups.value),
            ports: parseInt(ports.value),
            networks: parseInt(networks.value),
            routers: parseInt(routers.value),
          },
          paid_os: {
            paid_os: parseInt(paid_os.value),
          },
          backup_scheduler: {
            backup_scheduler: parseInt(backup_scheduler.value),
          },
        },
      };
      isLoading.value = true;
      updateServiceLimit(payload)
        .then(() => {
          isLoading.value = false;
          showSuccessToast("Custom deka flexi has succesfully updated!");
        })
        .catch((err) => {
          const errorMessage = err.response.data.data;
            if (errorMessage.includes("server_groups must be greater than or equal")){
              showErrorToast("Server group limit must be greater than existing usage.");        
            } else if (errorMessage.includes(" because current used is ")){
              showErrorToast(errorMessage);
            } else{
              showErrorToast(err);            
            }              
          isLoading.value = false;
        });
    };

    return {
      $v,
      instances,
      ram,
      v_cpus,
      server_groups,
      server_group_members,
      volumes,
      volume_storage,
      volume_snapshots,
      floating_ips,
      security_group_rules,
      security_groups,
      ports,
      networks,
      routers,
      paid_os,
      backup_scheduler,
      submit,
      isLoading,
      organizationId,
      handle_backup_scheduler,
      handle_paid_os,
    };
  },
};
</script>

<style lang="scss" scoped>
.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -4;
  }
}
.btn-delete-flavor {
  font-size: 14px;
  height: 50px !important;
}
</style>
