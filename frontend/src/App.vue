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
          @click="connect()"
          >WEBSOCKET {{ws_connect ? "disconnect":"connect"}}
      </v-btn>

    </v-app-bar>

    <v-main style="background:#EDEDED;">
      <v-dialog
      v-model="dialog"
      max-width="400"
      
    >
      <v-card class="text-center">
        <!-- <v-card-title class="text-h5 red lighten-2">
          Alert
        </v-card-title> -->
        <v-card-text height="100"/>
        <v-img src="./assets/alert.svg" width="70" class="mx-auto"></v-img>
        <v-card-text height="100"/>
        <v-card-text class="text-center subtitle-1" v-text="dialog_content">
          
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="black"
            class="white--text"
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
      max-width="500"
    >
      <v-card class="text-center">
        <!-- <v-card-title class="text-h5 red lighten-2">
          Alert
        </v-card-title> -->
        <v-img 
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
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
    
  }),
  async mounted(){
      let socket = io('localhost:8081',{transports: ["websocket"]})
      // let result = await this.$http.get("log")
      // this.logdata = result.data
      // for(let l of result.data){
      //   this.logdata.push({id: l.id, datetime: l.datetime, type: "불법 주·정차가 감지되었습니다.", value: l.value})
      // }
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
      })
      
  },
  methods:{
    async connect(){
      let result = await this.$http.get("websocket")
      this.ws_connect = result.data.ws 
    },
    onAlert(id){
      console.log(id)
      this.alert_dialog = true
    }
  }
};
</script>
