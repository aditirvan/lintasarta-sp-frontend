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
        <v-col cols="12" class="d-flex pt-7 justify-center">
          <v-card style="background: #FFFFFF;
box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
border-radius: 20px;" width="460">
            <create-new-project-form/>

          </v-card>
        </v-col>
      </v-row>

    </v-container>

  </v-main>
</template>
<script>
import createNewProjectForm from '@/modules/create-new-project/create-new-project-form'

export default {
  components: {createNewProjectForm},
}
</script>