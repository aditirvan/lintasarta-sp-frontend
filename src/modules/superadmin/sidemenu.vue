<template>
  <v-container fluid class="pa-0">
    <v-expansion-panel :style="{ 'background-color': $vuetify.theme.themes.light.primary }">
      <v-expansion-panel-header> MANAGE SUPER ADMIN </v-expansion-panel-header>
      <v-expansion-panel-content>
        <!-- <v-list-item @click.native="()=>{setCurrentOrg(null)}" to="/" exact>
					<v-list-item-icon>
						<v-icon>$vuetify.icons.instanceIcon</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Dashboard</v-list-item-title>
					</v-list-item-content>
				</v-list-item> -->
        <v-list-item
          v-if="role == 'GodMode' || access_control.isNotHideMenu('Manage Superadmin')"
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-superadmin"
          exact
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.managesuperadminIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Super Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="role == 'GodMode'"
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-superadmin-roles"
          exact
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.managesuperadminRoles</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Admin Roles</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-organization"
          exact
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.gg_organizationIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Organization</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-audit"
          exact
          v-if="access_control.isNotHideMenu('Manage Audit')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.manageauditIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Audit</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-user"
          exact
          v-if="access_control.isNotHideMenu('Manage User')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.manageuserIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage User</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-sales"
          exact
          v-if="access_control.isNotHideMenu('Manage Sales')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.managesalesIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Sales</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-voucher"
          exact
          v-if="access_control.isNotHideMenu('Manage Voucher')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.voucherIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Voucher</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-pricing"
          exact
          v-if="access_control.isNotHideMenu('Manage Pricing')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.manageflavorsIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Pricing</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-region"
          exact
          v-if="access_control.isNotHideMenu('Manage Region')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.manageRegionIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Region</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-flavor"
          exact
          v-if="access_control.isNotHideMenu('Manage Flavor')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.manageFlavorIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Flavor</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-os"
          exact
          v-if="access_control.isNotHideMenu('Manage Image')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.manageosIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Image</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-package"
          exact
          v-if="access_control.isNotHideMenu('Manage Package')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.managePackageIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Package</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-eula"
          exact
          v-if="access_control.isNotHideMenu('Manage EULA')"
        >
          <v-list-item-icon>
            <img src="../../assets/Vector.png" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage EULA</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-orgdp"
          exact
          >
          <v-list-item-icon>
            <img src="../../assets/Vector.png" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Organizations DP</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-orgvdc"
          exact
          >
          <v-list-item-icon>
            <img src="../../assets/Vector.png" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Organizations VDC</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/manage-edge"
          exact
          >
          <v-list-item-icon>
            <img src="../../assets/Vector.png" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Edge Gateway</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item
        @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/mailbox-log"
          exact
          v-if="access_control.isNotHideMenu('MailBox Log')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.emailIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mailbox Log</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/config-e-materai"
          exact
          v-if="access_control.isNotHideMenu('Config E-Materai')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.configemateraiIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Config E-Materai</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/manual-payment" exact v-if="access_control.isNotHideMenu('Manual Payment')">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.manualPaymentIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manual Payment</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          @click.native="
            () => {
              setCurrentOrg(null);
            }
          "
          to="/broadcast"
          exact
          v-if="access_control.isNotHideMenu('Broadcast')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.broadcast</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Broadcast</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- <div>
          <v-expansion-panel
          :style="{
            'background-color': $vuetify.theme.themes.light.primary,
          }">
            <v-expansion-panel-header style="margin-left: 0px; width: 101%" >
              <div class="d-flex">
                <v-icon class="" style="">mdi-cloud-braces</v-icon>
                <span style="" class="align-self-center ml-4">
                Manage Deka Prime
                </span>
              </div>
              </v-expansion-panel-header>
            <v-expansion-panel-content >
              <v-expansion-panel
              :style="{
                'background-color': $vuetify.theme.themes.light.primary,
              }">	
                <v-list-item	
                @click.native="
                  () => {
                    setCurrentOrg(null);
                  }
                "
                to="/manage-orgdp"
                exact
                style=""
                >	
                  <v-list-item-content class="ml-4">	
                    <v-list-item-title >Organizations</v-list-item-title>	
                  </v-list-item-content>	
                </v-list-item>

                <v-list-item	
                @click.native="
                  () => {
                    setCurrentOrg(null);
                  }
                "
                to="/manage-orgvdc"
                exact
                style=""
                >	
                  <v-list-item-content class="ml-4">	
                    <v-list-item-title >Organizations VDC</v-list-item-title>	
                  </v-list-item-content>	
                </v-list-item>	

                <v-list-item	
                @click.native="
                () => {
                  setCurrentOrg(null);
                }
                "
                to="/manage-edge"
                exact
                style=""
                >	
                  <v-list-item-content class="ml-4">	
                    <v-list-item-title >Edge Gateway</v-list-item-title>	
                  </v-list-item-content>	
                </v-list-item>

              </v-expansion-panel>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div> -->

        <!-- <v-list-item @click.native="()=>{setCurrentOrg(null)}" to="/manage-ticket" exact>
					<v-list-item-icon>
						<v-icon>$vuetify.icons.managetiketIcon</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Manage Ticket</v-list-item-title>
					</v-list-item-content>
				</v-list-item> -->

        <!-- <v-list-item @click.native="() => { setCurrentOrg(null) }" to="/commitment-fee" exact>
					<v-list-item-icon>
						<v-icon>$vuetify.icons.voucherIcon</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Commitment Fee</v-list-item-title>
					</v-list-item-content>
				</v-list-item> -->
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel :style="{ 'background-color': $vuetify.theme.themes.light.primary }">
      <v-expansion-panel-header> DEKA FLEXI </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item @click="createselectfirst('/instance')()" v-if="access_control.isNotHideMenu('Project Instance')">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.instanceIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Instance</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="createselectfirst('/storage')()" v-if="access_control.isNotHideMenu('Project Storage')">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.storageIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Storage</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item @click="createselectfirst('/object-storage')()" v-if="access_control.isNotHideMenu('Project Object Storage')">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.objectstorageIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Object Storage</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item @click="createselectfirst('/image')()" v-if="access_control.isNotHideMenu('Project Images')">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.imagesIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Images</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="createselectfirst('/network')()" v-if="access_control.isNotHideMenu('Project Network')">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.networkIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Network</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="createselectfirst('/security')()" v-if="access_control.isNotHideMenu('Project Security')">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.securityIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Security</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-expansion-panel :style="{ 'background-color': $vuetify.theme.themes.light.primary }">
          <v-expansion-panel-header> TICKETING </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list-item @click="createselectfirst('/manage-ticket')()">
              <v-list-item-icon>
                <v-icon>$vuetify.icons.managetiketIcon</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Manage Tickets</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <v-list-item @click="createselectfirst('/overview')()">
              <v-list-item-icon>
                <v-icon>$vuetify.icons.manageserviceIcon</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Manage Service</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel> -->
        <!-- <v-list-item @click="createselectfirst('/alerting')()">
					<v-list-item-icon>
						<v-icon>$vuetify.icons.alertingIcon</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Alerting</v-list-item-title>
					</v-list-item-content>
				</v-list-item> -->
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- Deka Prime menu -->
    <!-- <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
    >
      <v-expansion-panel-header> Deka Prime </v-expansion-panel-header>
      <v-expansion-panel-content>
 
      </v-expansion-panel-content>
    </v-expansion-panel> -->
    <v-expansion-panel
      v-if="userRole.role == 'Superadmin'"
      v-for="item in menus"
      :key="item.name"
      :style="{ 'background-color': $vuetify.theme.themes.light.primary,
        'display': item.list.length > 0 ? '': 'none'
      }"
    >
      <v-expansion-panel-header v-if="item.header == 'DEKA PRIME'" >
        {{ item.header }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          v-for="submenu in item.list"
          :key="submenu.link"
          router
          @click="menuclick(submenu.link)"
          :style="{ 'display': access_control.isNotHideMenu(submenu.name) ? '': 'none' }"
        >
          <v-list-item-icon>
            <v-icon>${{ submenu.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="submenu.name"></v-list-item-title>
          </v-list-item-content> </v-list-item
      ></v-expansion-panel-content>
    </v-expansion-panel>

    <!-- Storage menu -->
    <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary,
        'display': isShowSTORAGEMenu ? '': 'none'      
      }"
    >
      <v-expansion-panel-header> STORAGE </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          @click="createselectfirst('/object-storage')()"
          v-if="access_control.isNotHideMenu('Project Object Storage')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.objectstorageIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka Box</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="createselectfirst('/network-file-system')()"
          v-if="access_control.isNotHideMenu('NFS')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.nfsIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka NFS</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- Network menu -->
    <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary,
      'display': isShowNETWORKMenu ? '': 'none'
      }"
    >
      <v-expansion-panel-header> NETWORK </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          @click="createselectfirst('/cdn')()"
          v-if="access_control.isNotHideMenu('CDN')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.cdnIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka CDN</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="createselectfirst('/dns')()"
          v-if="access_control.isNotHideMenu('DNS')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.dnsIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka DNS</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
    </v-expansion-panel>

     <!-- Platform menu -->
    <!-- <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
    >
      <v-expansion-panel-header> PLATFORM </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          @click="createselectfirst('/deka-rock')()"
          v-if="access_control.isNotHideMenu('DekaRock')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.databaseIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka Rock</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
 
      </v-expansion-panel-content>
    </v-expansion-panel> -->

    <v-expansion-panel
      v-if="userRole.role == 'Superadmin'"
      v-for="item in menus"
      :key="item.name"
      :style="{ 'background-color': $vuetify.theme.themes.light.primary,
        'display': item.list.length > 0 ? '': 'none'
      }"
    >
      <v-expansion-panel-header v-if="item.header == 'PLATFORM'" >
        {{ item.header }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          v-for="submenu in item.list"
          :key="submenu.link"
          router
          @click="menuclick(submenu.link)"
          :style="{ 'display': access_control.isNotHideMenu(submenu.name) ? '': 'none' }"
        >
          <v-list-item-icon>
            <v-icon>${{ submenu.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="submenu.name"></v-list-item-title>
          </v-list-item-content> </v-list-item
      ></v-expansion-panel-content>
    </v-expansion-panel>

    <!-- <v-list-item
          @click="createselectfirst('/harbor')()"
          v-if="access_control.isNotHideMenu('Harbor')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.harborIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Harbor</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->

    <!-- Security menu -->
    <!-- <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary ,
        'display': isShowSECURITYMenu ? '': 'none'
      }"
    >
      <v-expansion-panel-header> SECURITY </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          @click="createselectfirst('/ssl')()"
          v-if="access_control.isNotHideMenu('SSL')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.sslIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka SSL</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
    </v-expansion-panel> -->
    <v-expansion-panel
      v-if="userRole.role == 'Superadmin'"
      v-for="item in menus"
      :key="item.header"
      :style="{ 'background-color': $vuetify.theme.themes.light.primary,
        'display': item.list.length > 0 ? '': 'none'
      }"
    >
      <v-expansion-panel-header v-if="item.header == 'SECURITY'" >
        {{ item.header }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div
        v-for="submenu in item.list"
        :key="submenu.link">
          <v-list-item
          v-if="submenu.name != 'Deka AST'"
          router
          @click="menuclick(submenu.link)"
          :style="{ 'display': access_control.isNotHideMenu(submenu.name) ? '': 'none' }"
          >
            <v-list-item-icon>
              <v-icon>${{ submenu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="submenu.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <div v-else>
            <v-expansion-panel
            :style="{
              'background-color': $vuetify.theme.themes.light.primary,
              'display': isShowDekaAstMenu ? '': 'none'
            }">
              <v-expansion-panel-header style="">
                <div class="d-flex">
                  <v-icon class="mr-5" style="height: 20px !important; display: inline !important;">$dekaAstIcon</v-icon>
                  <span style="" class="align-self-center">
                  {{ submenu.name }}
                  </span>
                </div>
                </v-expansion-panel-header>
              
              <v-expansion-panel-content>
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
                                    <v-list-item-content>
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
                              <v-list-item-content>
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

    <!-- CI/CD menu -->
    <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary,
        'display': isShowCIorCDMenu ? '': 'none'
      }"
    >
      <v-expansion-panel-header> CI/CD </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          @click="createselectfirst('/registry')()"
          v-if="access_control.isNotHideMenu('Registry')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.registryIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka Registry</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- Deka POP menu -->
    <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary,
        'display': isShowDekaPopMenu ? '': 'none'
      }"
    >
      <v-expansion-panel-header> SOFTWARE </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          @click="createselectfirst('/dekapop')()"
          v-if="access_control.isNotHideMenu('Deka POP')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.dekapopIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka POP</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <v-list-item
          @click="createselectfirst('/dekapop-list')()"
          v-if="access_control.isNotHideMenu('Deka POP')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.dekaPopList</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka POP List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
    </v-expansion-panel>

     <!-- Monitoring menu -->
    <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary,
        'display': isShowMONITORINGMenu ? '': 'none'
       }"
    >
      <v-expansion-panel-header> MONITORING </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          @click="createselectfirst('/alerting')()"
          v-if="access_control.isNotHideMenu('Project Alerting')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.alertingIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Alerting</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          @click="createselectfirst('/deka-agent')()"
          v-if="access_control.isNotHideMenu('Deka Agent')"
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.monitorIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deka Agent</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
    </v-expansion-panel>

     

     <!-- Support menu -->
    <!-- <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
    >
      <v-expansion-panel-header> SUPPORT </v-expansion-panel-header>
      <v-expansion-panel-content>
 
      </v-expansion-panel-content>
    </v-expansion-panel> -->

    <v-expansion-panel
      v-if="userRole.role == 'Superadmin'"
      v-for="item in menus"
      :key="item.name"
      :style="{ 'background-color': $vuetify.theme.themes.light.primary,
        'display': item.list.length > 0 ? '': 'none'
      }"
    >
      <v-expansion-panel-header v-if="item.header == 'SUPPORT'" >
        {{ item.header }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          v-for="submenu in item.list"
          :key="submenu.link"
          router
          @click="menuclick(submenu.link)"
          :style="{ 'display': access_control.isNotHideMenu(submenu.name) ? '': 'none' }"
        >
          <v-list-item-icon>
            <v-icon>${{ submenu.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="submenu.name"></v-list-item-title>
          </v-list-item-content> </v-list-item
      ></v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel
      v-if="userRole.role == 'Superadmin'"
      v-for="item in menus"
      :key="item.name"
      :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
    >
      <v-expansion-panel-header v-if="item.header == 'BILLING'" >
        {{ item.header }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          v-for="submenu in item.list"
          :key="submenu.link"
          router
          @click="menuclick(submenu.link)"
          :style="{ 'display': access_control.isNotHideMenu(submenu.name) ? '': 'none' }"
        >
          <v-list-item-icon>
            <v-icon>${{ submenu.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="submenu.name"></v-list-item-title>
          </v-list-item-content> </v-list-item
      ></v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel
      v-if="userRole.role == 'Superadmin'"
      v-for="item in menus"
      :key="item.name"
      :style="{ 
        'background-color': $vuetify.theme.themes.light.primary,
        'display': isShowMONITORINGMenu ? '': 'none'
        }"
    >
      <div v-if="item.header == 'Deka AST'">
        <v-expansion-panel-header>
          {{ item.header }}
        </v-expansion-panel-header>
        
        <v-expansion-panel-content>
          <v-list-item
          v-for="(val, key, idx) in item.list"
          :key="idx"
          >
            <v-expansion-panel
            :style="{ 'background-color': $vuetify.theme.themes.light.primary }">
              <v-expansion-panel-header class="subhead" style="padding-left:10px; padding-right:8.5px">
                {{ key }}
              </v-expansion-panel-header>
                <v-expansion-panel-content                 
                :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
                style="margin-left:-25px"
                >
                  <v-list-item
                  v-for="(val2, key2, idx2) in item.list[key]" :key="idx2"
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
                            <v-list-item-content>
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
                      <v-list-item-content>
                        <v-list-item-title class="pl-8">{{ val2.list[0].name }}</v-list-item-title>
                      </v-list-item-content>
                    </v-expansion-panel-content>
                  </v-list-item>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-list-item>
        </v-expansion-panel-content>
      </div>
    </v-expansion-panel>
    
    <!-- <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
    >
      <v-expansion-panel-header> PROJECT </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item to="/import" exact>
          <v-list-item-icon>
            <v-icon>$vuetify.icons.importIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Import Deka Prime</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
    </v-expansion-panel> -->

    <!-- <v-expansion-panel
      :style="{ 'background-color': $vuetify.theme.themes.light.primary }"
    >
    <v-expansion-panel-header> TICKETING </v-expansion-panel-header>
    <v-expansion-panel-content>
        <v-list-item @click="createselectfirst('/manage-ticket')()">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.managetiketIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Ticket</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="createselectfirst('/overview')()">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.manageserviceIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Manage Service</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
    </v-expansion-panel-content>
    </v-expansion-panel> -->
    <!-- <v-expansion-panel
			:style="{ 'background-color': $vuetify.theme.themes.light.primary }"
		>
			<v-expansion-panel-header> BILLING </v-expansion-panel-header>
			<v-expansion-panel-content>
				<v-list-item @click="createselectfirst('/billing')()">
					<v-list-item-icon>
						<v-icon>$vuetify.icons.billingIcon</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Billing</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click="createselectfirst('/billing/payment')()">
					<v-list-item-icon>
						<v-icon>$vuetify.icons.billingPaymentIcon</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Billing Payment</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-expansion-panel-content>
		</v-expansion-panel> -->
    <dialogSelectFirst
      v-model="opendialogselectfirst"
      @selectproject="
        () => {
          opendialogselectorg = true;
        }
      "
    />
    <dialogSelectOrg v-model="opendialogselectorg" />
  </v-container>
</template>
<script>
import { ref, onMounted, computed, watch } from "@vue/composition-api";
import {
  useGetters,
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import dialogSelectFirst from "./dialogSelectFirst";
import dialogSelectOrg from "./dialogSelectOrg";
import { AccessControl } from "@/lib/middleware";
export default {
  components: { dialogSelectFirst, dialogSelectOrg },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const { getquotalimitI3gis } = useNamespacedActions("I3GIS",["getquotalimitI3gis"]);
    const { quotalimitsI3gis } = useNamespacedState("I3GIS", ["quotalimitsI3gis"]);
    const currentProj = JSON.parse(localStorage.getItem('currentProj'))

    const menus = ref([]);
    const isShowDekaFlexyMenu = ref(false);
    const isShowSTORAGEMenu = ref(false);
    const isShowNETWORKMenu = ref(false);
    const isShowSECURITYMenu = ref(false);
    const isShowCIorCDMenu = ref(false);
    const isShowMONITORINGMenu = ref(false);
    const isShowDekaAstMenu = ref(false);
    const isShowDekaPopMenu = ref(false);
    const { menu, customMenu, userRole } = useGetters({
      menu: "ROLEPERMISSION/getmenu",
      customMenu: "ROLEPERMISSION/getcustommenu",
      userRole: "ROLEPERMISSION/getuser",
    });

    const menuclick = (link) => {
      if (context.root.$router.history.current.fullPath != `/${link}`)
        context.root.$router.push(`/${link}`);
    };

    const loginI3GISGetters = computed(() => quotalimitsI3gis);
    watch(loginI3GISGetters.value, (newVal, oldVal) => {
      // if(newVal==1){
      //   isShowDekaAstMenu.value = true
      // }else{
      //   isShowDekaAstMenu.value = false
      // }
    })

    onMounted(async() => {
      role.value = localStorage.getItem("role");

      let exception = [ // must be uppercase
        "DATABASE",
        "DEKA ROCK"
      ]
      menu.value.map(x => {
        let exist = false;
        let child_menu = [];
        // console.log(x)
          x.list.map((xx) => {
            // console.log('xx', xx)
            // console.log("xx.name ", xx.name);
            if (
              access_control.isNotHideMenu((xx.name)) ||
              exception.includes(String(x.header).toUpperCase())
            ) {
              if (!(String(x.header).toUpperCase() == 'SUPPORT' && String(xx.name).toUpperCase() == 'DEKAROCK')) {
              exist = true;
              child_menu.push(xx);
              }
            }
          });
        if (exist) {
          menus.value.push({
            header: x.header,
            list: child_menu,
          });
        }
      });

      if ( access_control.isNotHideMenu('Project Instance') || access_control.isNotHideMenu('Project Storage') || access_control.isNotHideMenu('Project Images') || access_control.isNotHideMenu('Project Network') || access_control.isNotHideMenu('Project Security') ) {
        isShowDekaFlexyMenu.value = true;
      }

      if ( access_control.isNotHideMenu('Project Object Storage') ) {
        isShowSTORAGEMenu.value = true;      
      }

      if ( access_control.isNotHideMenu('CDN') || access_control.isNotHideMenu('DNS') ) {
        isShowNETWORKMenu.value = true;
      }

      if (access_control.isNotHideMenu('SSL')) {
        isShowSECURITYMenu.value = true;
      }

      if (access_control.isNotHideMenu('Registry')) {
        isShowCIorCDMenu.value = true;
      }

      if (access_control.isNotHideMenu('Project Alerting')) {
        isShowMONITORINGMenu.value = true;
      }

      if (access_control.isNotHideMenu('Deka AST')) {
        isShowDekaAstMenu.value = true;
      }

      if (access_control.isNotHideMenu('Deka POP')) {
        isShowDekaPopMenu.value = true;
      }

      if(currentProj){
        const params = {
          organization_id: currentProj.organization_id,
          project_id: currentProj.id,
          user_id: localStorage.getItem("userId")?.replaceAll('"', "")
        }
        await getquotalimitI3gis(params)
      }
      // if (quotalimitsI3gis.value == 0) {
      //   isShowDekaAstMenu.value = false;
      // }else{
      //   isShowDekaAstMenu.value = true
      // }

    });
    const { setCurrentOrg } = useNamespacedMutations("SUPERADMIN", ["setCurrentOrg"]);
    const { currentOrg } = useNamespacedState("SUPERADMIN", ["currentOrg"]);
    const opendialogselectfirst = ref(false);
    const role = ref("");
    const createselectfirst = (path) => {
      return function () {
        context.root.$router.push(path);
      };
    };
    return {
      access_control,
      opendialogselectfirst,
      setCurrentOrg,
      currentOrg,
      createselectfirst,
      opendialogselectorg: ref(false),
      role,
      menus,
      userRole,
      menuclick,
      isShowDekaFlexyMenu,
      isShowSTORAGEMenu,
      isShowNETWORKMenu,
      isShowSECURITYMenu,
      isShowCIorCDMenu,
      isShowMONITORINGMenu,
      isShowDekaAstMenu,
      loginI3GISGetters,
      isShowDekaPopMenu,
    };
  },
};
</script>
