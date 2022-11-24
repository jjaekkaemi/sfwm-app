import axios from "axios";
let Http = null
Http = axios.create({
      baseURL: `http://211.34.247.114:8081`,
    });

export default {
    install(Main) {
      Main.prototype.$http = Http;
    },
};
  