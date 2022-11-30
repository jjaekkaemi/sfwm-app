<template>
  <v-app>
    <v-app-bar
      app
      color="black"
      dark
    >
      <div class="d-flex align-center" style="font-size:36px">
        DASHBOARD
      </div>

      <v-spacer></v-spacer>
      <v-btn
          @click="screct()"
          >WEBSOCKET {{ws_connect ? "disconnect":"connect"}}
      </v-btn>

    </v-app-bar>

    <v-main style="background:#EDEDED;">
      <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card class="text-center">
        <!-- <v-card-title class="text-h5 red lighten-2">
          Alert
        </v-card-title> -->
        <v-card-text height="200"/>
        <v-img src="./assets/alert.svg" width="100" class="mx-auto"></v-img>
        <v-card-text height="200"/>
        <v-card-text class="text-center title" v-text="dialog_content">
          
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="black"
            class="white--text subtitle-1"
            @click="dialog = false"
          >
            확인
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="alert_dialog"
      max-width="600"
    >
      <v-card class="text-center">
        <!-- <v-card-title class="text-h5 red lighten-2">
          Alert
        </v-card-title> -->
        <v-img 
          :src="img_data"
          height="300px">

        </v-img>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="black"
            class="white--text"
            @click="alert_dialog = false"
          >
            확인
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <HelloWorld :sensor="sensor" :logdata="logdata" :detect="car_detect" @onalert="onAlert"/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import io from "socket.io-client"
export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
      sensor:{
        tmp:0,
        pres:0,
        heat:0

      },
      alert_dialog:false,
      dialog:false,
      car_detect: false,
      dialog_content:"불법 주ㆍ정차가 감지되었습니다.",
      ws_connect:false,
      logdata: [{
        id: 1,
        datetime:"2022-10-04 11:09:01",
        type:"불법 주·정차가 감지되었습니다."
      }
      ],
      img_data:"https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
    
  }),
  async mounted(){
      let socket = io('211.34.247.114:8081',{transports: ["websocket"]})
      let result = await this.$http.get("log")
      console.log(result)
      this.logdata = result.data
      socket.on("msg", (data)=>{
        console.log("msg!!!", data)
      })
      socket.on("data", (data)=>{
        this.sensor = data
        console.log("data!", data)
      })
      socket.on("alert", (data)=>{
        
        this.dialog_content = "불법 주·정차가 감지되었습니다."
        this.dialog = true
        this.logdata.push({id: data.id, datetime: data.datetime, type: "불법 주·정차가 감지되었습니다.", value: data.value})
      })
      socket.on("ws_connect", (data)=>{
        this.ws_connect = data
        console.log("data!", data)
      })
      socket.on("detect", (data)=>{
        console.log("detect",data)
        if(data==null) {
          this.dialog = false
          this.car_detect = false
        }
        else{
          this.car_detect = true
        }
      })
      
  },
  methods:{
    async screct(){
      let result = await this.$http.get("screct")
      console.log(result)
    },
    onAlert(id){
      this.img_data = `data:image/jpg;base64,${id}`
      this.alert_dialog = true
    }
  }
};
</script>
