<template>
    <div>
        <v-list>
            <v-list-item>
                <v-list-item-icon class="ml-3 list-item">
                    <div class="font-weight-bold">번호</div>
                </v-list-item-icon>

                <v-list-item-content class="ml-16 list-item">
                    <v-list-item-title class="font-weight-bold">시간</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content class="ml-5 list-item">
                    <v-list-item-title class="font-weight-bold">구분</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-divider width="94%" class="ml-6 font-weight-medium mt-n3"/>
        <v-list v-for="(item,idx) in loglist" :key="idx">
            <v-list-item>
                <v-list-item-icon class="ml-5 list-item">
                    <div>{{idx+1}}</div>
                </v-list-item-icon>

                <v-list-item-content class="ml-5 list-item">
                    <v-list-item-title>{{item.datetime}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon class="list-item">
                    <div>불법 주·정차가 감지되었습니다.</div>
                </v-list-item-icon>
                <v-list-item-icon class="mr-10 list-item ">
                    <v-btn class="black white--text" @click="onAlert(item.value)">보기</v-btn>
                </v-list-item-icon>
            </v-list-item>

        </v-list>
    </div>
</template>
<script>
export default {
    props:['loglist'],
    methods:{
        onAlert(id){
            this.$emit('onalert' , id)
        }
    }
}
</script>