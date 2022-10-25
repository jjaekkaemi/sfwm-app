<template>
    <v-list class="mt-n4">
        <v-list-item v-for="(item, idx) in content_data" :key="idx">
            <v-list-item-icon >
                <v-icon color="black">
                    {{item.icon}}
                </v-icon>
            </v-list-item-icon>
            <v-list-item-content class="ml-n6">
                <v-list-item-title class="font-weight-bold">
                    {{item.title}}
                </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
                <div>
                    {{item.content}}
                </div>
            </v-list-item-icon>
        </v-list-item>
    </v-list>
</template>

<script>
export default {
    props:['content_data'],
}
</script>