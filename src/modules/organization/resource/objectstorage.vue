<template>
	<div>
		<v-data-table
			id="DataTableListObjectStorage"
			hide-default-footer
			:headers="headers"
			:items="objectStorages"
			:items-per-page="5"
			class="elevation-0"
		>
			<template v-slot:item.name="{ item }">
				<div class="d-flex">
					<v-icon color="primary" class="mr-3">mdi-circle</v-icon>
					<div>
						<router-link :to="'' + item.id" append>
							<span class="primary--text">{{ item.objectstoragename }}</span>
						</router-link>
						<p>https://test-object-storage-lintasarta.cloud.lintasarta.com</p>
					</div>
				</div>
			</template>

			<template v-slot:item.size="{}">
				<p>10 GB</p>
				<p>5 items</p>
			</template>

			<template v-slot:item.createddate="{ item }">
				{{ $moment(new Date(item.createddate)).format("DD/MM/YYYY") }}
			</template>

			<template v-slot:item.action="{ item }">
				<popupquote
					v-model="item.open"
					:offsetTop="21"
					:documentid="'popup' + item.id"
					offset-y
					allow-overflow
				>
					<template v-slot:activator="{ on, attrs }">
						<label
							v-bind="attrs"
							class="primary--text linkpointer"
							style="position: relative; white-space: nowrap"
							@click="
								($event) => {
									on.click($event);
									show($event, item);
								}
							"
							>More
							<v-icon
								:class="{
									rotate: item.open,
								}"
								:id="'popup' + item.id"
								color="primary"
								>mdi-chevron-down</v-icon
							>
						</label>
					</template>
					<v-list>
						<v-list-item
							:to="'/object-storage/' + objectStorageSelected.id + '/files'"
							append
						>
							<v-list-item-title>Show Files</v-list-item-title>
						</v-list-item>
						<v-list-item
							:to="'/object-storage/' + objectStorageSelected.id + '/settings'"
							append
						>
							<v-list-item-title>Settings</v-list-item-title>
						</v-list-item>
						<v-list-item
							@click="
								() => {
									dialogMoveto = true;
								}
							"
							style="border-bottom: 1px solid lightgrey"
						>
							<v-list-item-title>Move to...</v-list-item-title>
						</v-list-item>
						<v-list-item
							@click="
								() => {
									dialogDelete = true;
								}
							"
						>
							<v-list-item-title class="error--text">Delete</v-list-item-title>
						</v-list-item>
					</v-list>
				</popupquote>
			</template>
			<template v-slot:footer="{ props }">
				<custom-footer-datatable :props="props"
				:style="{visibility:(objectStorages.length > 5)?'visible':'hidden'}"/>
			</template>
		</v-data-table>

		<v-menu
			v-model="showMenu"
			:position-x="x - 10"
			:position-y="y"
			absolute
			allow-overflow
		>
		</v-menu>
		<dialogDeleteObjectStorage
			v-model="dialogDelete"
			@close="
				() => {
					dialogDelete = false;
				}
			"
			@confirm="
				() => {
					deleteSelected();
				}
			"
		/>
		<dialogMovetoProject
			v-model="dialogMoveto"
			@close="
				() => {
					dialogMoveto = false;
				}
			"
		/>
	</div>
</template>

<script>
import { ref } from "@vue/composition-api";
import customFooterDatatable from "@/modules/customsharedcomponents/custom-footer-datatable.vue";
import { useObjectStorage } from "@/modules/objectstorage/composableapi/useobjectstorage";
import dialogDeleteObjectStorage from "@/modules/objectstorage/dialogDeleteObjectStorage";
import dialogMovetoProject from "@/modules/objectstorage/dialogMoveto";
export default {
	components: {
		customFooterDatatable,
		dialogDeleteObjectStorage,
		dialogMovetoProject,
	},
	setup() {
		const Composable = {
			...useObjectStorage(),
		};
		const { objectStorageSelected, deleteObjectStorage } = Composable;
		const selected = ref("list");
		function isSelected(val) {
			return selected.value == val;
		}
		function deleteSelected() {
			deleteObjectStorage(objectStorageSelected.value.id);
		}
		return {
			dialogMoveto: ref(false),
			dialogDelete: ref(false),
			...Composable,
			selected,
			isSelected,
			deleteSelected,
		};
	},
	data() {
		return {
			showMenu: false,
			headers: [
				{ text: "Name", value: "name" },
				{ text: "Size", value: "size" },
				{ text: "Created Date", value: "createddate" },
				{ text: "Action", sortable: false, align: "right", value: "action" },
			],

			x: 0,
			y: 0,
		};
	},
	created() {
		this.fetchObjectStorages();
	},
	methods: {
		selectpage(e, options) {
			options.itemsPerPage = e;
		},
		show(e, item) {
			e.preventDefault();
			this.objectStorageSelected = item;
			this.showMenu = false;
			this.x = e.clientX - 20;
			this.y = e.clientY + 10;
			this.$nextTick(() => {
				this.showMenu = true;
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.mdi-chevron-down.rotate::before {
	transform: rotate(-180deg);
	transition: 100ms linear all;
}
.mdi-chevron-down::before {
	transition: 100ms linear all;
}
p {
	margin-bottom: 0px;
	.ipaddress {
		display: inline-block;
		width: 50px;
		position: relative;
		.tik {
			position: absolute;
			right: 10px;
			display: inline-block;
		}
	}
}
.select-view {
	border: 6px solid #f2f2f2;
	border-radius: 4px;
	background-color: #f2f2f2;
	opacity: 0.5;
	&.selected {
		opacity: 1;
	}
}

.instanceinfo {
	.col:first-child {
		p {
			font-weight: 700;
		}
	}
	.col {
		padding: 0px 0px 0px 12px;
		font-size: 10px;
	}
}
</style>
<style lang="scss">
#DataTableListObjectStorage {
	font-weight: 600;
	td {
		padding-top: 20px;
		padding-bottom: 14px;
	}
}
</style>