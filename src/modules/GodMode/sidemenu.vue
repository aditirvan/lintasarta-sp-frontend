<template>
	<v-container fluid class="pa-0">
		<v-expansion-panel
			:style="{ 'background-color': $vuetify.theme.themes.light.primary }"
		>
			<v-expansion-panel-header> MANAGE SUPER ADMIN </v-expansion-panel-header>
			<v-expansion-panel-content>
			
				<v-list-item  to="/manage-superadmin" exact>
					<v-list-item-icon>
						<v-icon>$vuetify.icons.managesuperadminIcon</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Manage Super Admin</v-list-item-title>
					</v-list-item-content>
				</v-list-item>


				

				
				<!-- <v-list-item @click.native="()=>{setCurrentOrg(null)}" to="/manage-price" exact>
					<v-list-item-icon>
						<v-icon>mdi-package-variant-closed</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Manage Price</v-list-item-title>
					</v-list-item-content>
				</v-list-item> -->

				<!-- <v-list-item @click.native="()=>{setCurrentOrg(null)}" to="/manage-flavors" exact>
					<v-list-item-icon>
						<v-icon>$vuetify.icons.manageflavorsIcon</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Manage Flavors</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click.native="()=>{setCurrentOrg(null)}" to="/manage-os" exact>
					<v-list-item-icon>
						<v-icon>$vuetify.icons.manageosIcon</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Manage Image</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item @click.native="()=>{setCurrentOrg(null)}" to="/manage-ticket" exact>
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
	
	</v-container>
</template>
<script>
import { ref } from '@vue/composition-api'
import {useNamespacedMutations, useNamespacedState} from 'vuex-composition-helpers'
// import dialogSelectFirst from '@/modules/superadmin/dialogSelectFirst'
// import dialogSelectOrg from '@/modules/superadmin/dialogSelectOrg'
export default {
	components:{},
	setup(props, context){
		// const {setCurrentOrg} = useNamespacedMutations('SUPERADMIN',['setCurrentOrg'])
		// const {currentOrg} = useNamespacedState('SUPERADMIN',['currentOrg'])
		// const opendialogselectfirst = ref(false)
		const createselectfirst = (path)=>{
			return function(){
				context.root.$router.push(path)
			}
		}
		return{
			// opendialogselectfirst,
			// setCurrentOrg,
			// currentOrg,
			// createselectfirst,
			// opendialogselectorg: ref(false)
		}
	}
}
</script>