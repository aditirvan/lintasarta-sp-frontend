<template>
  <div class="d-flex flex-row">
    <v-icon @click="$router.go(-1)" class="mr-2" v-if="items.length > 1">mdi-arrow-left</v-icon>
    <v-breadcrumbs :items="items">
      <template v-slot:item="{ item }">
        

        <v-breadcrumbs-item exact :to="convert(item.to)" v-if="item.to==''" :disabled="true" >
          {{ convert(item.text) }} 
        </v-breadcrumbs-item>

        <v-breadcrumbs-item exact :to="convert(item.to)" v-else>
          {{ convert(item.text) }} 
        </v-breadcrumbs-item>
     

      </template>
    </v-breadcrumbs>
  </div>
</template>
<script>
import { onMounted } from '@vue/composition-api';
export default {
  setup(props, context){
    return {}
  },
  methods: {
    convert(path) {
      const params = this.$route.params;
      const regex = /:(\w+)/gi
      const match = [...path.matchAll(regex)]
      if (match.length) {
        match.forEach((m)=>{
          path = path.replace(m[0],params[m[1]])
        })
        return path
      } else {
        return path;
      }
    },
  },
  computed: {
    items() {
      const matched = this.$route.matched[this.$route.matched.length - 1];
      var map = [];
      function generatemaps(route) {
        if (route.meta.breadcrumb) {
          map = [route.meta.breadcrumb].concat(map);
        }
        if (route.parent && route.parent.path !== "") {
          generatemaps(route.parent);
        }
      }
      generatemaps(matched);
      return map;
    },
  },
  watch: {
    $route: function () {},
  },
};
</script>


<style lang="scss" scoped>
.v-breadcrumbs {
  font-weight: 600;
  font-size: 14px;
  padding: 0px 0px;
  ::v-deep .v-breadcrumbs__divider{
    padding-left: 4px;
    padding-right: 4px;
  }
}
</style>