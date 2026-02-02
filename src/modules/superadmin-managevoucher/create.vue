<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div v-if="voucheredit" class="headline font-weight-bold font--text">Detail Voucher Trial</div>
      <div v-else class="headline font-weight-bold font--text">Create Voucher Trial</div>
      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Voucher Name</p>
          <v-text-field
            id="Name"
            outlined
            placeholder="Enter Voucher Name"
            single-line
            v-model="name"
            :disabled="voucheredit"
            :error-messages="
              $v.name.$errors.length ? $v.name.$errors[0].$message : ''
            "
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Voucher Claim Period</p>
          <v-menu
            offset-y
            :max-width="258"
            :close-on-click="true"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                depressed
                :ripple="false"
                outlined
                v-bind="attrs"
                v-on="on"
                block
                height="50"
                style="border: 1px solid #cad6e1; justify-content: left"
              >
                <v-icon class="mr-2" style="width: 16px; height: 16px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
                <p class="black--text mb-0 fz-14" style="font-weight: 400">
                  {{ $moment(period.start).format("YYYY-MM-DD") }} -
                  {{ $moment(period.end).format("YYYY-MM-DD") }}
                </p>
              </v-btn>
            </template>
            <vc-date-picker
              v-if="voucheredit" 
              :readonly="voucheredit"
              :disabled-dates="{ start: null, end: null }" 
              v-model="period" 
              is-range 
            />
            <div
              v-else
            >
              <vc-date-picker 
                v-model="period" 
                is-range 
              />
              
            </div>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Description</p>
          <v-textarea
            id="Description"
            placeholder="Enter Description"
            outlined
            single-line
            v-model="description"
            :disabled="voucheredit"
          ></v-textarea>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">
            Duration/Expired Date
            <br>
          </p>
          <v-select
             v-model="day_duration"
            :items="duration_options"
            v-if="duration_input == 'select'"
            item-text="text"
            item-value="value"
            outlined>
          </v-select>
          <v-row v-if="duration_input == 'manual'">
            <v-col cols="10" class="pb-0 pt-0">
              <v-text-field
                type="number"
                v-model.number="day_duration_manual"
                outlined
                single-line>
              </v-text-field>
            </v-col>
            <v-col cols="2" class="pb-0 pt-0">
              <v-btn
                icon
                color="blue-grey"
                class="mt-2"
                @click="ToSelectInput">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="duration_input == 'date'">
            <v-col cols="10" class="pb-0 pt-0">
              <v-menu
                offset-y
                :max-width="258"
                :close-on-click="true"
                :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    depressed
                    :ripple="false"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    block
                    height="50"
                    style="border: 1px solid #cad6e1; justify-content: left">
                    <v-icon class="mr-2" style="width: 16px; height: 16px">$vuetify.icons.calendarIcon</v-icon>
                    <p class="black--text mb-0 fz-14" style="font-weight: 400">
                      {{ $moment(expired_date).format("YYYY-MM-DD") }}
                    </p>
                  </v-btn>
                </template>
                <vc-date-picker v-model="expired_date" :disabled-dates="{ start: null, end: $moment(period.end).format('YYYY-MM-DD') }" />
              </v-menu>
            </v-col>
            <v-col cols="2" class="pb-0 pt-0">
              <v-btn
                class="mt-2"
                icon
                color="blue-grey"
                @click="ToSelectInput">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">
            Voucher Quota
            <br>
            <small style="font-weight: normal;">Amount of voucher code will be generated.</small>
          </p>
          <v-text-field
            id="quota"
            type="number"
            v-model.number="quota"
            :disabled="voucheredit"
            :error-messages="
              $v.quota.$errors.length ? $v.quota.$errors[0].$message : ''"
            outlined
            single-line
            placeholder="0"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">
            Voucher Prefix Code
            <br>
            <small style="font-weight: normal;">Generated voucher code will starts with this prefix code.</small>
          </p>
          <v-text-field
            id="Kode"
            outlined
            single-line
            placeholder="Enter Code Voucher"
            v-model="code"
            :disabled="voucheredit"
            :error-messages="
              $v.code.$errors.length ? $v.code.$errors[0].$message : ''
            "
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider />

      <div class="headline font-weight-bold font--text pt-8">Setting Limit Service</div>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Instance</p>
          <v-text-field
            id="Instance"
            type="number"
            v-model.number="instance"
            :disabled="voucheredit"
            :error-messages="
              $v.instance.$errors.length ? $v.instance.$errors[0].$message : ''
            "
            outlined
            single-line
            placeholder="0"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">vCPU</p>
          <v-text-field
            id="Cpu"
            type="number"
            v-model="cpu"
            :disabled="voucheredit"
            :error-messages="
              $v.cpu.$errors.length ? $v.cpu.$errors[0].$message : ''
            "
            outlined
            placeholder="0"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Memory</p>
          <v-text-field
            id="RAM"
            type="number"
            suffix="GB"
            v-model.number="ram"
            :disabled="voucheredit"
            :error-messages="
              $v.ram.$errors.length ? $v.ram.$errors[0].$message : ''
            "
            outlined
            single-line
            placeholder="0"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Root Disk Size</p>
          <v-text-field
            id="RootDiskSize"
            type="number"
            suffix="GB"
            v-model.number="root_disk_size"
            :disabled="voucheredit"
            :error-messages="
              $v.root_disk_size.$errors.length ? $v.root_disk_size.$errors[0].$message : ''
            "
            outlined
            placeholder="0"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Data Disk</p>
          <v-text-field
            id="total_volume"
            type="number"
            v-model="total_volume"
            :disabled="voucheredit"
            :error-messages="
              $v.total_volume.$errors.length ? $v.total_volume.$errors[0].$message : ''
            "
            outlined
            placeholder="0"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Data Disk Size</p>
          <v-text-field
            id="VolumeSize"
            type="number"
            suffix="GB"
            v-model.number="volume_size"
            :disabled="voucheredit"
            :error-messages="
              $v.volume_size.$errors.length ? $v.volume_size.$errors[0].$message : ''
            "
            outlined
            placeholder="0"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Object Storage</p>
          <v-text-field
            type="number"
            v-model="total_object_volume"
            :disabled="voucheredit"
            :error-messages="
              $v.total_object_volume.$errors.length ? $v.total_object_volume.$errors[0].$message : ''
            "
            outlined
            placeholder="0"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Object Storage Size</p>
          <v-text-field
            type="number"
            suffix="GB"
            v-model.number="object_volume_size"
            :disabled="voucheredit"
            :error-messages="
              $v.object_volume_size.$errors.length ? $v.object_volume_size.$errors[0].$message : ''
            "
            outlined
            placeholder="0"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Snapshot</p>
          <v-text-field
            id="TotalSnapshot"
            type="number"
            v-model.number="total_snapshot"
            :disabled="voucheredit"
            :error-messages="
              $v.total_snapshot.$errors.length ? $v.total_snapshot.$errors[0].$message : ''
            "
            outlined
            single-line
            placeholder="0"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Snapshot Size</p>
          <v-text-field
            id="SnapshotSize"
            type="number"
            suffix="GB"
            v-model.number="snapshot_size"
            :disabled="voucheredit"
            :error-messages="
              $v.snapshot_size.$errors.length ? $v.snapshot_size.$errors[0].$message : ''
            "
            outlined
            single-line
            placeholder="0"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">VPC</p>
          <v-text-field
            id="Router"
            type="number"
            v-model="s_router"
            :disabled="voucheredit"
            :error-messages="
              $v.s_router.$errors.length ? $v.s_router.$errors[0].$message : ''
            "
            outlined
            placeholder="0"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Floating IP</p>
          <v-text-field
            id="Floating IP"
            type="number"
            v-model.number="floating_ip"
            :disabled="voucheredit"
            :error-messages="
              $v.floating_ip.$errors.length ? $v.floating_ip.$errors[0].$message : ''
            "
            outlined
            single-line
            placeholder="0"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">NAT Gateway</p>
          <v-text-field
            id="NatGateway"
            type="number"
            v-model="nat_gateway"
            :disabled="voucheredit"
            :error-messages="
              $v.nat_gateway.$errors.length ? $v.nat_gateway.$errors[0].$message : ''
            "
            outlined
            placeholder="0"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Floating IP NAT Gateway</p>
          <v-text-field
            id="NatGateway Floating IP"
            type="number"
            v-model.number="nat_gateway_fip"
            :disabled="voucheredit"
            :error-messages="
              $v.nat_gateway_fip.$errors.length ? $v.nat_gateway_fip.$errors[0].$message : ''
            "
            outlined
            single-line
            placeholder="0"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="!voucheredit">
        <v-col>
          <v-btn
            height="58"
            depressed
            block
            color="accent"
            to="/manage-voucher/trial"
            exact
          >
            <span style="font-size: 16px"> Cancel</span>
          </v-btn>
        </v-col>
        <v-col v-if="!voucheredit">
          <v-btn
            @click="createVoucher"
            height="58"
            depressed
            block
            color="secondary"
          >
            <span style="font-size: 16px"> Create Voucher Trial</span>
          </v-btn>
        </v-col>
        <v-col v-else-if="voucheredit">
          <v-btn
            @click="
              () => {
                editVoucher(voucher);
              }
            "
            height="58"
            depressed
            block
            color="secondary"
          >
            <span style="font-size: 16px"> Save</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api"
import { useCreateVoucher } from "./useCreateVoucher"
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'
import moment from 'moment'
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { MANAGEVOUCHER } from "./namespace";
export default {
  data: () => ({
    dates: ["2020-01-20", "2020-02-20"],
    duration_options: [
          { value: 'manual', text: 'Input Manual' },
          { value: 'date', text: 'Input Date' },
          { value: '1', text: '1 Day' },
          { value: '5', text: '5 Days' },
          { value: '7', text: '1 Week' },
          { value: '14', text: '2 Week' },
          { value: '30', text: '1 Month' },
          { value: '60', text: '2 Month' },
          { value: '90', text: '3 Month' },
    ],
  }),
  methods:{
    ToSelectInput(){
      this.duration_input = 'select'
      this.day_duration = this.duration_options[6]
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.join("   -   ");
    },
  },
  setup(props,context) {
    const { 
      fetchvouchers,
      fetchvoucher,
      addvoucher,
    } = useNamespacedActions(MANAGEVOUCHER, [
      "fetchvouchers",
      "fetchvoucher",
      "addvoucher",
    ]);
    
    const {
      voucher,
    } = useNamespacedState(MANAGEVOUCHER, [
      "voucher",
    ]);

    const { id } = context.root.$route.params
    const { 
      voucheredit,
      name,
      description,
      quota,
      code,
      instance,
      cpu,
      ram,
      volume_size,
      object_volume_size,
      root_disk_size,
      snapshot_size,
      total_volume,
      total_object_volume,
      total_snapshot,
      s_router,
      floating_ip,
      total_lb, 
      nat_gateway,
      nat_gateway_fip,
    } = useCreateVoucher()


    const createVoucher = async () => {
        $v.value.$touch()
        if($v.value.$errors.length) return
        const data = {
            name: name.value,
            claim_period_start: period.value.start.toISOString(),
            claim_period_end: period.value.end.toISOString(),
            description: description.value,
            quota: quota.value,
            code: code.value,
            expired_date: null,
            day_duration: null,
            setting: {
                instance: parseInt(instance.value),
                cpu: parseInt(cpu.value),
                ram: parseInt(ram.value),
                root_disk_size: parseInt(root_disk_size.value),
                volume_size: parseInt(volume_size.value),
                snapshot_size: parseInt(snapshot_size.value),
                total_object_volume: parseInt(total_object_volume.value),
                object_volume_size: parseInt(object_volume_size.value),
                total_volume: parseInt(total_volume.value),
                total_snapshot: parseInt(total_snapshot.value),
                router: parseInt(s_router.value),
                floating_ip: parseInt(floating_ip.value),
                total_lb: parseInt(total_lb.value),
                nat_gateway: parseInt(nat_gateway.value),
                nat_gateway_fip: parseInt(nat_gateway_fip.value),
            }
        }
        if (duration_input.value == 'select'){
          if (day_duration.value instanceof Object){
            data.day_duration = parseInt(day_duration.value.value)
          }else{
            data.day_duration = parseInt(day_duration.value)
          }
        }else if(duration_input.value == 'manual'){
          data.day_duration = parseInt(day_duration_manual.value)
        }else if(duration_input.value == 'date'){
          data.expired_date = expired_date.value.toISOString()
        }
        const res = await addvoucher(data)
        if(res.code == 200){
            context.root.$router.replace('/manage-voucher')
            fetchvouchers()
        }
    }

    const $v = useVuelidate(
        {
            name: {
              required,
              minLength: minLength(5),
            },
            quota: { 
              required,
              $autoDirty: true,
              notZero: helpers.withMessage('Quota must be more than 0', (val) => {
                return val > 0
              })
            },
            code: { required },
            instance: {
              required,
              $autoDirty: true,
             },
            cpu: {
              required,
              $autoDirty: true,
             },
            ram: {
              required,
              $autoDirty: true,
             },
            volume_size: {
              required,
              $autoDirty: true,
            },
            root_disk_size: {
              required,
              $autoDirty: true,
             },
            snapshot_size: {
              required,
              $autoDirty: true,
            },
            total_volume: {
              required,
              $autoDirty: true,
            },
            total_snapshot: {
              required,
              $autoDirty: true,
            },
            s_router: {
              required,
              $autoDirty: true,
            },
            floating_ip: {
              required,
              $autoDirty: true,
            },
            total_lb: {
              required,
              $autoDirty: true,
            },
            object_volume_size: {
              required,
              $autoDirty: true,
            },
            total_object_volume: {
              required,
              $autoDirty: true,
            },
            nat_gateway: {
              required,
              $autoDirty: true,
            },
            nat_gateway_fip: {
              required,
              $autoDirty: true,
            },
        },
        { name, quota, code, instance, cpu, ram, root_disk_size, volume_size, snapshot_size, total_volume, total_snapshot, s_router, floating_ip, total_lb, object_volume_size, total_object_volume, nat_gateway, nat_gateway_fip }
    )

    const Save = () => {
        $v.value.$touch()
        if($v.value.$invalid) return
        const Value = {
            name: name.value,
            claimperiod: period.value,
            description: description.value,
            quota: quota.value,
            code: code.value,
            day_duration: day_duration.value,
            setting: {
                instance: instance.value,
                cpu: cpu.value,
                ram: ram.value,
                volume_size: volume_size.value,
                snapshot_size: snapshot_size.value,
                root_disk_size: root_disk_size.value,
                total_volume: total_volume.value,
                total_object_volume:total_object_volume.value,
                object_volume_size: object_volume_size.value,
                total_snapshot: total_snapshot.value,
                s_router: s_router.value,
                floating_ip: floating_ip.value,
                total_lb: total_lb.value,
                nat_gateway: nat_gateway.value,
                nat_gateway_fip: nat_gateway_fip.value,
            }
        }
        voucheredit.value.ref.update(Value).then(()=>{
            fetchvouchers()
        })
    }

    const setVoucherEdit = (val)=>{
        voucheredit.value = val
        name.value = val.name
        description.value = val.description
        quota.value = val.quota
        code.value = val.code
        day_duration.value.value = val.day_duration
        period.value.start = new Date(val.claim_period_start)
        period.value.end = new Date(val.claim_period_end)
        instance.value = val.setting.instance
        cpu.value = val.setting.cpu
        ram.value = val.setting.ram
        total_object_volume.value = val.setting.total_object_volume,
        object_volume_size.value = val.setting.object_volume_size,
        root_disk_size.value = val.setting.root_disk_size
        volume_size.value = val.setting.volume_size
        snapshot_size.value = val.setting.snapshot_size
        total_volume.value = val.setting.total_volume
        total_snapshot.value = val.setting.total_snapshot
        s_router.value = val.setting.router
        floating_ip.value = val.setting.floating_ip
        total_lb.value = val.setting.total_lb
        nat_gateway.value = val.setting.nat_gateway
        nat_gateway_fip.value = val.setting.nat_gateway_fip
    }

    const period = ref({
      start: moment(),
      end: moment().add(30, 'd'),
    })

    const day_duration = ref({ value: '30', text: '1 Month' })
    const day_duration_manual = ref(30)
    const expired_date = ref(moment().add(30, 'd'))
    const duration_input = ref('select')

    onMounted(async () => {
      if (id) {
        await fetchvoucher({ id })
        setVoucherEdit(voucher.value)
      }
    })

    watch(
      day_duration, (newval, _) => {
        if (newval == "select" || newval == "manual" || newval == "date"){
          duration_input.value = newval
        }
      }
    )
    
    return {
      ...useCreateVoucher(props,context),
      $v,
      root_disk_size,
      period,
      day_duration,
      day_duration_manual,
      expired_date,
      duration_input,
      Save,
      createVoucher,
      voucher,
      voucheredit,
      name,
      description,
      quota,
      code,
      instance,
      cpu,
      ram,
      volume_size,
      object_volume_size,
      total_object_volume,
      snapshot_size,
      total_volume,
      total_snapshot,
      s_router,
      floating_ip,
      total_lb,
      nat_gateway,
      nat_gateway_fip,
    };
  },
};
</script>
<style lang="scss" scoped>
.hideinput{
  ::v-deep input{
    position: relative;
    bottom:50px;
    z-index: -4;
  }
}
</style>
