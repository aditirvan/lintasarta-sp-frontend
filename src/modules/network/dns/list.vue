<template>
     <v-row>
        <v-col cols="12">
        <v-card class="rounded-lg">
            <v-container>
            <h3>Domain</h3>
            <v-simple-table>
                <thead>
                <tr>
                    <th>Domain</th>
                    <th>Direct to</th>
                    <th>Action</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="item in domain" :key="item.name">
                    <td><a href="#">{{item.name}}</a></td>
                    <td>{{item.ip}}</td>
                    <td>
                    <span class="text-primary">Action <v-icon>mdi-chevron-down</v-icon></span>
                    </td>
                </tr>
                </tbody>
            </v-simple-table>
            </v-container>
        </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data : () => ({
        domain : [
                    {name : 'xxx.yyy.xyz', ip: '192.000.111.02'}
                ],
        items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
    })
}
</script>

<style scoped>
.v-btn {
    height: 55px !important;
}
</style>