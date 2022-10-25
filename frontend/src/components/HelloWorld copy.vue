<template>
  <v-container fluid class="pa-6" >
    <v-row class="text-center">
      <v-col cols="12" md="7" >
        <v-card >
          <v-card-title>실시간모니터링</v-card-title>
          <v-divider width="95%" class="ml-4"/>
          <v-card-text class="mt-5" >
            <v-row  >
              <v-col cols="12" md="4" >
                <v-row>
                  <v-col style="display: flex; align-items: center; justify-content: center;" >
                    <v-icon x-large>
                    mdi-thermometer
                  </v-icon>
                  <span class="card-light-grey text-h4">{{sensor.tmp}}°</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div class="text-h6">Temp</div>
                  </v-col>
                </v-row>
                
              </v-col>
              <v-col cols="12" md="4">
                <v-row>
                  <v-col style="display: flex; align-items: center; justify-content: center">
                    <img
                      :src="require('../assets/Pressure.svg')"
                      :width="40"
                      class="mr-1"
                    />
                    
                  <span class="card-light-grey text-h4 ml-1">{{sensor.pres}}</span><span class="text-h5">Pa</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div class="text-h6">Pressure</div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4">
                <v-row>
                  <v-col style="display: flex; align-items: center; justify-content: center">
                   <v-icon x-large>
                    {{sensor.heat==='0'?'mdi-radiator-off':'mdi-radiator'}}
                  </v-icon>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div class="text-h6">Heater</div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          
          
          
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card >차량감지여부</v-card>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12" md="12">
        <v-card>로그
          <v-data-table
            :headers="headers"
            :items="logdata"
            :items-per-page="5">
            </v-data-table>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>

  export default {
    name: 'HelloWorld',
    props:['sensor', 'logdata'],
    mounted(){

    },
    data: () => ({
              headers: [
          {
            text: 'Num',
            align: 'start',
            value: 'id',
          },
          { text: 'Type', value: 'data_type' },
          { text: 'Value', value: 'value' },
          { text: 'Datetime', value: 'datetime' }
        ],

    }),
  }
</script>
