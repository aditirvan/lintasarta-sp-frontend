<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">General</p> </v-col>
          </v-row>
        </div>
        
        <div class="d-flex flex-column">
          <v-row >
            <v-col cols="12" md="8">
              <p class="font-weight-bold">Name</p>
              <v-text-field
                maxlength="50"
                placeholder="Insert Name"
                single-line
                outlined
                v-model="value.nameOrg"
                dense
                :error-messages="$v.rule.nameOrg.$errors.length ? $v.rule.nameOrg.$errors[0].$message : ''"
                ></v-text-field>
                <!-- :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''" -->
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="8">

              <p class="font-weight-bold">Business VAT ID</p>
              <v-text-field
                maxlength="20"
                @keydown="vatidKeydown($event)"
                single-line
                outlined
                v-model="value.vatid"
                placeholder="Business VAT ID"
                dense
              />
                <!-- :error-messages="$v.rule.vatid.$errors.length ? $v.rule.vatid.$errors[0].$message : ''" -->
              <!-- /> -->

            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="8" class="pb-0">
              <!-- <v-card-text> -->
              <p class="font-weight-bold">Description</p>
              <v-textarea
                placeholder="description"
                flat
                outlined
                v-model="value.description"
                dense
                ></v-textarea>
                <!-- :error-messages="$v.description.$errors.length ? $v.description.$errors[0].$message : ''" -->
              <!-- </v-card-text> -->
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="8" class="pt-0 mt-0">
              <v-checkbox
              hide-details
              v-model="value.isEnabled"
              :label="`Enable the Organization VDC`">
              </v-checkbox>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-16 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-16 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 6" class="white--text fz-16" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
            </v-col>
          </v-row>
        </div>
          
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, ref, watch } from '@vue/composition-api';
import useVuelidate from '@vuelidate/core';
import { required, minValue,  } from '@vuelidate/validators'

export default {
  props: ["value", "step"],
  setup(props, context) {

    // const generalVar = computed({
    //     get: () => props.value,
    //     set: (val) => {
    //       console.log(val)
    //       // context.emit("input", val);
    //     },
    //   });

    const vatid = ref('')

    watch(vatid, (newVal) => {
      vatid.value = newVal.replace(/[^a-zA-Z0-9]/g, '');
    })

    const vatidKeydown = (e) => {
      if (/[^a-zA-Z0-9]/g.test(e.key)) {
        e.preventDefault();
      }
    }

    const name = ref('')
    const description = ref('')
    // const vatid = ref('')
    const checkEnable = ref(false)

    const $v = useVuelidate(
      {
        rule: {
          nameOrg: {
            required,
            $autoDirty: true,
            conditional: {
              $message: "The special character or spaces are not allowed",
              $validator: (val) => {
                return /^[A-Za-z0-9//g\-_(),$.]+$/g.test(val);
              },
            },
          },
          // vatid: {
          //   required
          // },
          // description: { required },
        }
      },
      {
        // name, description
        rule: props.value
      })

    const next = () => {
      // getEdgeConnection(detailInstance.value.Name);
      $v.value.$touch();
      if ($v.value.$errors.length) return

      // let payload = {
      //   name: name.value,
      //   description: description.value,
      //   isEnabled: checkEnable.value
      // }
      
      // console.log(payload)
      // context.emit('generalVal', payload)
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return{
      next,
      prev,
      name,
      vatid,
      description,
      checkEnable,
      $v,
      vatidKeydown,
      // generalVar,
    }
  },
}
</script>