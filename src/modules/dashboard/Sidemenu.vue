<template>
  <v-navigation-drawer
    id="NavigationDrawer"
    v-model="drawer"
    app
    :clipped="$vuetify.breakpoint.lgAndUp"
    dark
    class="darkblue"
    width="248"
  >
    <v-expansion-panels v-model="panels" value="panels" multiple app flat>
      <component
        v-for="menu in customMenu"
        :is="menu.component"
        :key="menu.component"
      />

      <!-- <v-expansion-panel
        v-if="userRole.role == 'Superadmin'"
        v-for="item in menus"
        :key="item.header"
        :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
      >
        <v-expansion-panel-header>
          {{ item.header }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item
            v-for="submenu in item.list"
            :key="submenu.link"
            router
            @click="menuclick(submenu.link)"
          >
            <v-list-item-icon>
              <v-icon>${{ submenu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="submenu.name"></v-list-item-title>
            </v-list-item-content> </v-list-item
        ></v-expansion-panel-content>
      </v-expansion-panel> -->

        <!-- v-for="item in datamenu[menuindex].value" -->
      <v-expansion-panel
        v-if="userRole.role != 'Superadmin'"
        v-for="item in datamenu[menuindex].value"
        :key="item.header"
        :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
      >
        <v-expansion-panel-header v-if="!arrayListHeaderMenuNotShow.includes(item.header)">
          {{ item.header }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
          v-for="submenu in item.list"
          :key="submenu.link">
          <!-- None Deka AST -->
            <v-list-item
              v-if="submenu.name != 'Deka AST'"
              router
              @click="menuclick(submenu.link)"
              :style="{ 'display': arrayListItemMenuNotShow.includes(submenu.name.toLowerCase()) ? 'none': '' }"
            >
              <v-list-item-icon v-if="!arrayListItemMenuNotShow.includes(submenu.name.toLowerCase())">
                <v-icon>${{ submenu.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content v-if="!arrayListItemMenuNotShow.includes(submenu.name.toLowerCase())">
                <v-list-item-title v-text="submenu.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- End None Deka AST -->

            <div v-else>
              <v-expansion-panel
              :style="{
                'background-color': $vuetify.theme.themes.light.primary,
              }">
                <v-expansion-panel-header style="" v-if="!arrayListItemMenuNotShow.includes(submenu.name.toLowerCase())">
                  <div class="d-flex">
                    <v-icon class="mr-5" style="height: 20px !important; display: inline !important;">$dekaAstIcon</v-icon>
                    <span style="" class="align-self-center">
                    {{ submenu.name }}
                    </span>
                  </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content v-if="!arrayListItemMenuNotShow.includes(submenu.name.toLowerCase())">
                  <!-- Limit = 1 -->
                  <div v-if="loginI3GISGetters.value != 0 ">
                    <v-list-item
                    v-for="(val, key, idx) in submenu.list"
                    :key="idx"
                    >
                      <v-expansion-panel
                      :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
                      v-if="val[0].childsub || val[0].list[0].childsub">
                        <v-expansion-panel-header style="padding-left:10px; padding-right:8.5px">
                          {{ key }}
                        </v-expansion-panel-header>
                          <v-expansion-panel-content                 
                          :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
                          style="margin-left:-25px"
                          >
                            <v-list-item
                            v-for="(val2, key2, idx2) in submenu.list[key]" :key="idx2"
                            v-if="val2.childsub"
                            >
                              <v-expansion-panel
                              :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
                              >
                                <v-expansion-panel-header style="padding-right: 0px; width: 105%">
                                  {{ val2.childsub }}
                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                  <v-expansion-panel
                                  :style="{ 'background-color': $vuetify.theme.themes.light.primary }">

                                    <v-list-item
                                    v-for="(childList, idx3) in val2.list"
                                    :key="idx3"
                                    link
                                    @click="menuclick(childList.link)"
                                    >
                                      <v-list-item-content v-if="!arrayListItemMenuNotShow.includes(childList.child2sub.toLowerCase())">
                                        <v-list-item-title class="pl-2">{{ childList.child2sub }}</v-list-item-title>
                                      </v-list-item-content>
                                    </v-list-item>

                                  </v-expansion-panel>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-list-item>
                            <v-list-item
                            v-else
                            router
                            link
                            class="pl-4"
                            @click="menuclick(val2.list[0].link)"
                            >
                              <v-expansion-panel-content>
                                <v-list-item-content v-if="!arrayListItemMenuNotShow.includes(val2.list[0].name.toLowerCase())">
                                  <v-list-item-title class="pl-8">{{ val2.list[0].name }}</v-list-item-title>
                                </v-list-item-content>
                              </v-expansion-panel-content>
                            </v-list-item>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <v-expansion-panel	
                      v-else	
                      :style="{ 'background-color': $vuetify.theme.themes.light.primary } ">	
                        <v-list-item	
                        link	
                        @click="menuclick(val[0].list[0].link)"
                        style="margin-left: -14px"
                        >	
                          <!-- <v-expansion-panel-content> -->	
                            <v-list-item-content>	
                              <v-list-item-title >{{ key }}</v-list-item-title>	
                            </v-list-item-content>	
                          <!-- </v-expansion-panel-content> -->	
                        </v-list-item>	
                      </v-expansion-panel>
                    </v-list-item>
                  </div>
                  <!-- End Limit = 1 -->

                  <div v-else>
                    <v-expansion-panel
                    v-for="(val, key, idx) in submenu.list"
                    :key="idx"
                    :style="{ 'background-color': $vuetify.theme.themes.light.primary } "
                    v-if="key == 'Summary Project'">	
                      <v-list-item	
                      link	
                      @click="menuclick(val[0].list[0].link)"
                      style="margin-left: 10px"
                      >	
                        <!-- <v-expansion-panel-content> -->	
                          <v-list-item-content>	
                            <v-list-item-title >{{ key }}</v-list-item-title>	
                          </v-list-item-content>	
                        <!-- </v-expansion-panel-content> -->	
                      </v-list-item>	
                    </v-expansion-panel>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <dialogSelectFirst />
    <dialogOpenstackNotFound />
    <createopenstack />
    <dialogDontHavePermission />
    <dialogReachLimit />
    <dialogBalance />
    <dialoghavebeensubmitted />
    <dialogCommonWarning />
    <dialogCommonSucess />
    <Createproject />
  </v-navigation-drawer>
</template>

<script>
import { computed, onMounted, ref, watch } from "@vue/composition-api";
import {
  useGetters,
  useNamespacedState,
  useNamespacedMutations,
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { PROJECT } from "../project/namespace";
import dialogSelectFirst from "@/modules/project/dialogSelectFirst";
import dialogOpenstackNotFound from "@/modules/project/dialogOpenstackNotFound";
import createopenstack from "@/modules/project/createopenstack";
import dialogDontHavePermission from "./dialogDontHavePermission.vue";
import dialogReachLimit from "./dialogReachLimit";
import dialoghavebeensubmitted from "./dialogHaveBeenSubmitted";
import dialogCommonWarning from "./dialogCommonWarning";
import dialogCommonSucess from "./dialogCommonSuccess";
import Createproject from "../project/createproject.vue";
import dialogBalance from "./dialogBalance.vue";

import { AccessControl } from "@/lib/middleware";
import { async } from "@firebase/util";


export default {
  components: {
    dialogSelectFirst,
    dialogOpenstackNotFound,
    createopenstack,
    dialogDontHavePermission,
    dialogReachLimit,
    dialoghavebeensubmitted,
    dialogCommonWarning,
    dialogCommonSucess,
    Createproject,
    dialogBalance,
  },

  setup(props, context) {
    props;
    const access_control = new AccessControl(context.root.$store);
    const menus = ref([]);
    const { drawer: getdrawer } = useNamespacedState("DASHBOARD", ["drawer"]);
    const { setdrawer } = useNamespacedMutations("DASHBOARD", ["setdrawer"]);
    const { loginPrime } = useNamespacedGetters("VDC", ["loginPrime"]);
    const { getquotalimitI3gis } = useNamespacedActions("I3GIS",["getquotalimitI3gis"]);
    const { quotalimitsI3gis } = useNamespacedState("I3GIS", ["quotalimitsI3gis"]);
    const currentProj = JSON.parse(localStorage.getItem('currentProj'))


    const loginPrimeGetters = computed(() => loginPrime);

    const loginI3GISGetters = computed(() => quotalimitsI3gis);

    const menunoproject = ref([]) // index 0
    const menudekaflexi = ref([]) // index 1
    const menudekaprime = ref([]) // index 2
    const menui3gis = ref([]) // index 3
    const datamenu = [menunoproject, menudekaflexi, menudekaprime, menui3gis]

    let drawer = computed({
      get: () => getdrawer.value,
      set: (val) => setdrawer(val),
    });
    if (context.root.$vuetify.breakpoint.mdAndDown) {
      drawer.value = false;
    }

    onMounted(() => {
      menu.value.map((item) => {
        if (item.header != "DEKA PRIME" && item.header != "DEKA FLEXI") {
          datamenu[0].value.push(item)
          // if (item.header == "PLATFORM"){
          //   let submenu = [];
          //   item.list.map((x) => {
          //     if(x.name != "Deka Rock" && x.name != "Deka Harbor"){
          //       submenu.push(x)
          //     }
          //   })
          //   datamenu[0].value.push({
          //     header:item.header,
          //     list:submenu
          //   })
          // }else{
          //   datamenu[0].value.push(item)
          // }
        }
      });

      menu.value.map((item) => {
        if (item.header != "DEKA PRIME") {
          datamenu[1].value.push(item)
        }
      })

      menu.value.map((item) => {
        datamenu[2].value.push(item)
        // if (item.header != "DEKA FLEXI") {
        //   if (item.header == "PLATFORM"){
        //     let submenu = [];
        //     item.list.map((x) => {
        //       if(x.name != "Deka Rock" && x.name != "Deka Harbor"){
        //         submenu.push(x)
        //       }
        //     })
        //     datamenu[2].value.push({
        //       header:item.header,
        //       list:submenu
        //     })
        //   }else{
        //     datamenu[2].value.push(item)
        //   }
        // }
      })
    });

    const menuindex = ref(0)

    watch(loginPrimeGetters.value, (newVal, oldVal) => {
      const dekaPrime = localStorage.getItem("dekaPrime")
      const projectid = localStorage.getItem("projectid")

      if (projectid) {
        if (dekaPrime) {
          menuindex.value = 2 // menudekaprime
        } else {
          menuindex.value = 1 // menudekaflexi
        }
      } else {
        menuindex.value = 0 // menunoproject
      }
    })

    const { menu, customMenu, userRole } = useGetters({
      menu: "ROLEPERMISSION/getmenu",
      customMenu: "ROLEPERMISSION/getcustommenu",
      userRole: "ROLEPERMISSION/getuser",
    });
    const { projectname } = useNamespacedState(PROJECT, ["projectname"]);
    const { opendialogselectproject } = useNamespacedActions(PROJECT, [
      "opendialogselectproject",
    ]);
    const opendialogselectfirst = ref(false);
    const opendialogopenstacknotfound = ref(false);
    const menuDp = ref([]);
    const showDp = ref(false);
    let arrayListItemMenuNotShow = ref([]);
    let arrayListHeaderMenuNotShow = ref([]);

    const menuclick = (link) => {
      if (context.root.$router.history.current.fullPath != `/${link}`)
        context.root.$router.push(`/${link}`);
    };

    onMounted(async() => {
      let exception = [
        "DATABASE",
        "Deka ROCK"
      ]
      if(localStorage.getItem("projectid")){
        const params = {
          organization_id: currentProj.organization_id,
          project_id: currentProj.id,
          user_id: localStorage.getItem("userId")?.replaceAll('"', "")
        }
        await getquotalimitI3gis(params)
      }
      menu.value.map(x => {
        let exist = false;
        let child_menu = [];
          x.list.map((xx) => {
          // console.log("xx.name ", xx.name);
            if (
              access_control.isNotHideMenu(xx.name) ||
              exception.includes(x.header)
            ) {
              exist = true;
              child_menu.push(xx);
            }
          });
        if (exist) {
          child_menu.map((i) => {
            i.name = (i.name == 'Deka Alerting') ? 'Alerting': i.name;
          })
          menus.value.push({
            header: x.header,
            list: child_menu,
          });
        }
      });

      const role = localStorage.getItem('role')
      if (role !== "Superadmin" || role === 'Customer-Care' || role === 'GodMode') {
        const privilages = JSON.parse(localStorage.getItem('privilages'));
        privilages.map((x) => {
          let name = x.name.toLowerCase()
          if (x.disable) {
            if (name == 'rdbms') {
              name = 'database'
            } else if (name == 'registry') {
              name = 'deka registry'
            } else if (name == 'dekarock') {
              name = 'deka rock'
            } else if (name == 'dns') {
              name = 'deka dns'
            } else if (name == 'ticket') {
              name = 'list ticket'
            } else if (name == 'object storage') {
              name = 'deka box'
            } else if (name == 'cdn') {
              name = 'deka cdn'
            } else if (name == 'ssl') {
              name = 'deka ssl'
            }else if (name == 'nfs') {
              name = 'deka nfs'
            }
            // console.log('x.name', name)
            // console.log('x.name.toLowerCase()', x.name.toLowerCase())
            arrayListItemMenuNotShow.value.push(name)
          }
          // if(name == 'deka ast'){
          //   if(quotalimitsI3gis.value == 0){
          //     if(arrayListItemMenuNotShow.value.indexOf(name) == -1){
          //       arrayListItemMenuNotShow.value.push(name)
          //     }
          //   }
          // }
        });
        menus.value.map((x) => {
          let countItemMenuHeaderNotShow = 0
          for (let index = 0; index < x.list.length; index++) {
              // console.log('x.list[index].name.toLowerCase()', x.list[index].name.toLowerCase())
            if (arrayListItemMenuNotShow.value.includes(x.list[index].name.toLowerCase())) {
              countItemMenuHeaderNotShow++
              if (x.list.length == countItemMenuHeaderNotShow) {
                arrayListHeaderMenuNotShow.value.push(x.list[index].header)
              }
            }          
          }
        });
      }
      const dekaPrime = localStorage.getItem("dekaPrime")
      const projectid = localStorage.getItem("projectid")

      if (projectid) {
        if (dekaPrime) {
          menuindex.value = 2 // menudekaprime
        } else {
          menuindex.value = 1 // menudekaflexi
        }
      } else {
        menuindex.value = 0 // menunoproject
      }
    });

    return {
      opendialogselectproject,
      opendialogselectfirst,
      opendialogopenstacknotfound,
      menuclick,
      drawer,
      menus,
      customMenu,
      panels: ref([]),
      loginPrime,
      userRole,
      datamenu,
      menuindex,
      arrayListItemMenuNotShow,
      arrayListHeaderMenuNotShow,
      loginI3GISGetters,
    };
  },
};
</script>

<style lang="scss">
#NavigationDrawer {
  .v-expansion-panel::before {
    box-shadow: none;
  }
  .v-expansion-panel-header {
    min-height: 44px;
    padding-top: 0px;
    padding-bottom: 0px;
    font-weight: 700;
    font-size: 14px;
  }
  .v-expansion-panel-content__wrap {
    padding: 0px;
    .v-list-item {
      padding-left: 24px;
    }
  }
  .v-list-item--active {
    background-color: #2c94d2;
    .v-list-item__title {
      color: white;
    }
  }
  .v-list-item__icon {
    margin-right: 15px !important;
    margin-top: auto;
    margin-bottom: auto;
  }
  .v-list-item__title {
    font-weight: 600 !important;
    font-size: 14px;
  }

  .v-icon {
    height: 20px;
    width: 20px;
  }
  .v-list-item {
    min-height: 44px;
  }

  .v-application--is-ltr .v-list-item__action:last-of-type:not(:only-child),
  .v-application--is-ltr .v-list-item__avatar:last-of-type:not(:only-child),
  .v-application--is-ltr .v-list-item__icon:last-of-type:not(:only-child) {
    margin-left: 0px;
  }
}
</style>
