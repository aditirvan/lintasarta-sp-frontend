<template>
	<v-dialog v-model="isOpen" width="800px" scrollable>
		<v-card flat>
			<v-card-title>
				<v-row>
					<v-col cols="11" style="font-size: 14px">
						<h3>Edit alert recipients</h3>
						<p>Select the team members you wish to be notified.</p></v-col
					>
					<v-col cols="1" class="text-right">
						<v-icon @click="isOpen = false">mdi-close</v-icon>
					</v-col>
				</v-row>
			</v-card-title>

			<v-divider></v-divider>
			<v-card-text style="height: 500px" v-if="members">
				<div style="position:sticky;top:0px; background:white; z-index:8" class="pt-4">
					<v-checkbox
						v-model="checkTeam"
						@change="checkTeamChange"
						label="Team Member"
						class="font-weight-bold"
						:indeterminate="emailSelected.length < members.length &&  emailSelected.length > 0 "
					></v-checkbox>
					<v-divider/>
				</div>
				<div v-for="(member, i) in members" :key="i" >
					<div>
						<v-checkbox v-model="emailSelected" :value="member.email" :label="member.email">
							<template v-slot:label>
								<div class="d-flex flex-column">
									<div class="mb-2">
										{{member.fullname}}
									</div>
									<div>
										{{member.email}}
									</div>
								</div>
							</template>
						</v-checkbox>
					</div>
					<v-divider/>
				</div>
			</v-card-text>
			<v-card-actions class="px-7">
				<div style="width: 760px; height: 55px">
					<v-btn block class="secondary" @click="addRecipients"
						>Add Recipients to Alert</v-btn
					>
				</div>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useNamespacedActions } from 'vuex-composition-helpers';
import { ref, onMounted, watch } from '@vue/composition-api'
import useralerting from "./useralerting";
export default {
	props: ['members', 'selectedMembers'],
	setup(props, context) {
		const { openModal, closeModal, isOpen } = useralerting();
		const emails = ref([])
		const checkTeam = ref(false)
		const emailSelected = ref([])

		const checkTeamChange = (val) => {
			if (val) emailSelected.value = props.members.map(x => x.email)
			else emailSelected.value = []
		}
		
		const addRecipients = () => {
			context.emit('addRecipients', emailSelected.value)
			isOpen.value = false
		}

		watch(() => props.selectedMembers, () => {
			emailSelected.value = props.selectedMembers
			if (emailSelected.value.length == 0) checkTeam.value = false
		})

		watch(() => emailSelected.value, () => {
			if (emailSelected.value.length == 0) checkTeam.value = false
			if (emailSelected.value.length == props.members.length) checkTeam.value = true
		})

		return {
			addRecipients,
			closeModal,
			openModal,
			isOpen,
			emails,
			checkTeamChange,
			checkTeam,
			emailSelected,
		};
	},
	created(){
	}
};
</script>

<style lang="scss" scoped>
.v-btn {
	height: 40px !important;
}

.v-card__title {
	height: 80px !important;
	padding-bottom: 0px !important;
	padding-top: 0px !important;
}
</style>