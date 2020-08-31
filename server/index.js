const { Application, genesisBlockDevnet, configDevnet } = require("lisk-sdk");



configDevnet.app.label = "Snake";
configDevnet.app.version = "1.0.0";
configDevnet.components.storage.password = "password";
configDevnet.modules.http_api.access.public = true;
configDevnet.app.genesisConfig.BLOCK_TIME = 5;
configDevnet.app.genesisConfig.MAX_TRANSACTIONS_PER_BLOCK= 10;

const app = new Application(genesisBlockDevnet, configDevnet);


app
  .run()
  .then(() => app.logger.info("App started..."))
  .catch((error) => {
    console.error("Faced error in application", error);
    process.exit(1);
  });
