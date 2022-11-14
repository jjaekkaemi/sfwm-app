<template>
  <v-container fluid class="pa-6" >
    <v-row >
      <v-col cols="12" md="5" >
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>소화전 정보</v-card-title>
              <v-divider width="95%" class="ml-4 font-weight-medium mt-n3"/>
              <v-card-text>
                <Content :content_data="fire_hydrant_info"/>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card >
              <v-card-title>소화전 상태</v-card-title>
              <v-divider width="95%" class="ml-4 font-weight-medium mt-n3"/>
              <v-card-text>
                <Content :content_data="returnFireStatus"/>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="7">
        <v-card>
          <v-card-title >소화전 위치도</v-card-title>
          <v-divider width="95%" class="ml-4 font-weight-medium mt-n3"/>
          <v-card-text class="mt-2 text-center" style="height:64vh" id="map" >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-card>
          <v-card-title >로그</v-card-title>
          <v-divider width="95%" class="ml-4 font-weight-medium mt-n3"/>
          <Table :loglist="logdata" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
 <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD4Ab3x39_veJPXrcq6KJ-uSCP5TzO3Ef0"></script>
<script>
import Content from "./content.vue"
import Table from "./table.vue"
  export default {
    name: 'HelloWorld',
    components: {Content, Table},
    props:['sensor', 'logdata'],
    computed: {
      returnFireStatus: function(){
        return [{
          icon: "mdi-thermometer",
          title: "온도",
          content: this.sensor.tmp+" °C"
        },
        {
          icon: "mdi-arrow-collapse-vertical",
          title: "압력",
          content: this.sensor.pres+" bar"
        },
        {
          icon: "mdi-heating-coil",
          title: "히터",
          content: this.sensor.heat==='0'?"OFF":"ON"
        },
        {
          icon: "mdi-car",
          title: "차량 감지",
          content: "NO"
        }]
      }
    },
    mounted(){
    
      this.map = new google.maps.Map(document.getElementById("map"), { //getElementById로 map id 속성의 요소를 가져온다.
        center: this.mapCenter, //center로 할 위도, 경도를 지정한다.
        zoom: 15, //zoom size를 지정.
        maxZoom: 20,
        minZoom: 3,
        streetViewControl: true,
        mapTypeControl: true,
        fuulscreenControl: true,
        zoomControl: true,
      });
      const marker1 = this.setMarker(this.fire_hydrant, require('../assets/mdi_fire-hydrant.svg'))
      this.setMarker(this.fire_hydrant1, require('../assets/mdi_fire-hydrant.svg'))
      this.setMarker(this.fire_hydrant2, require('../assets/mdi_fire-hydrant.svg'))
      this.setMarker(this.fire_hydrant3, require('../assets/mdi_fire-hydrant.svg'))
      this.setMarker(this.fire_hydrant4, require('../assets/mdi_fire-hydrant.svg'))
      setTimeout(()=>{
        marker1.setIcon({url:require('../assets/mdi_fire-hydrant-alert.svg')})
      },10000)
    },
    methods:{
      setMarker(Points, icon) {//지도에 마커를 찍는 함수.
      const markers = new google.maps.Marker({
        position: Points,
        map: this.map,
        icon:icon
      });
      return markers
    },
    },
    data: (vm) => ({
      map:null,
      mapCenter: { lat: 36.103487, lng: 128.384989 },
      fire_hydrant:{ //창보
        lat:36.101921,
        lng:128.379059
      },
      fire_hydrant1:{//의료기술타워
        lat:36.107181,
        lng:128.383846
      },
            fire_hydrant2:{//스타벅스
        lat:36.102910,
        lng:128.386135
      },
            fire_hydrant3:{//LS전선
        lat:36.107149,
        lng:128.392762
      },
                  fire_hydrant4:{//한화시스템
        lat:36.100750,
        lng:128.392758
      },
      loglist:[{
        id: 1,
        datetime: "2022-09-01 09:01:01"
      },
      {
        id: 2,
        datetime: "2022-09-01 09:01:01"
      }],
        //       headers: [
        //   {
        //     text: 'Num',
        //     align: 'start',
        //     value: 'id',
        //   },
        //   { text: 'Type', value: 'data_type' },
        //   { text: 'Value', value: 'value' },
        //   { text: 'Datetime', value: 'datetime' }
        // ],
              headers: [
          {
            text: '번호',
            value: 'id',
          },
          { text: '시간',  value: 'datetime' },
          { text: '구분',value: 'type' },
           { text: '', value: 'actions', sortable: false, show:false},
        ],
        fire_hydrant_info: [{
          icon: "mdi-pound-box",
          title: "번호",
          content: "0001"
        },
        {
          icon: "mdi-map-marker",
          title: "위치",
          content: "36.101921° 128.379059°"
        }],
        fire_hydrant_status: [{
          icon: "mdi-thermometer",
          title: "온도",
          content: vm.sensor.tmp+" °C"
        },
        {
          icon: "mdi-arrow-collapse-vertical",
          title: "압력",
          content: vm.sensor.pres+" bar"
        },
        {
          icon: "mdi-heating-coil",
          title: "히터",
          content: vm.sensor.heat==='0'?"OFF":"ON"
        },
        {
          icon: "mdi-car",
          title: "차량 감지",
          content: "NO"
        }],
    }),
  }
</script>
<style lang="scss">
.list-item {
  align-self: center; // [jk]
}
</style>