import * as config from "../../config";
const host = config.env == "prod" ? "https://yescelebrate.yesbank.in/" : "http://localhost:3000/";
export const environment = {
  production: true,
  host : host
  // host : 'http://192.168.0.211:8000/'
};
