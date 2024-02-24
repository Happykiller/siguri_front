class Config {
  mode:string;
  port:string;
  api_url:string;
  ws_url:string;

  constructor(){
    this.mode = process.env.APP_MODE;
    this.port = process.env.APP_PORT;
    this.api_url = process.env.APP_API_URL;
    this.ws_url = process.env.APP_WS_URL
  }
}

const config = new Config();

export default config;