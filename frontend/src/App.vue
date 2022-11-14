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
      width="500"
      
    >
      <v-card>
        <v-card-title class="text-h5 red lighten-2">
          Alert
        </v-card-title>

        <v-card-text v-text="dialog_content">
          
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <HelloWorld :sensor="sensor" :logdata="logdata"/>
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
        heat:'0'

      },
      dialog:false,
      dialog_content:"",
      ws_connect:false,
      logdata: [{
        id: 1,
        datetime:"2022-10-04 11:09:01",
        type:"불법 주·정차가 감지되었습니다."
      }
        ],
    
  }),
  async mounted(){
      let result = await this.$http.get("socket")
      let socket = io(`localhost:${result.data.port}`,{transports: ["websocket"]})
      result = await this.$http.get("log")
      this.logdata = result.data
      socket.on("msg", (data)=>{
        console.log("msg!!!", data)
      })
      socket.on("data", (data)=>{
        this.sensor = data
        console.log("data!", data)
      })
      socket.on("alert", (data)=>{
        this.dialog = true
        this.dialog_content = "불법 차량이 감지되었습니다."
        this.logdata.push(data)
      })
      socket.on("ws_connect", (data)=>{
        this.ws_connect = data
        console.log("data!", data)
      })
      
  },
  methods:{
    async connect(){
      let result = await this.$http.get("websocket")
      this.ws_connect = result.data.ws 
    }
  }
};
</script>
