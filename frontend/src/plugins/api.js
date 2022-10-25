import axios from "axios";
const Http = axios.create({
    baseURL: "http://localhost:8081",
});

export default {
    install(Main) {
      Main.prototype.$http = Http;
    },
};
  