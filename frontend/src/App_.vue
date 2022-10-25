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
    </v-app-bar>

    <v-main>
      <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-img src="./assets/dialog.svg"/>
      </v-card>
    </v-dialog>
       <v-img
          alt="Vuetify Logo"
          class="shrink"
          contain
          :src="svg_data"
          transition="scale-transition"
          
        />
    </v-main>
  </v-app>
</template>

<script>
import io from "socket.io-client"
export default {
  name: 'App',


  data: () => ({
      sensor:{
        tmp:0,
        pres:0,
        heat:'0'

      },
      dialog:false,
      dialog_content:"",
      ws_connect:false,
      logdata: [
        ],
      svg_data: require("./assets/desktop_5_no.svg")
    
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
      socket.on("alert", ()=>{
        this.dialog = true
        // this.dialog_content = data
        // this.logdata.push(data)
        this.svg_data = require("./assets/desktop_5_yes.svg")
      })
      socket.on("ws_disconnect", (data)=>{
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
