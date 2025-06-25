import { CompositionRootConfig } from "../config/compositionRootConfig";
import { CompositionRoot } from "../compositionRoot";

const compositionRootConfig = new CompositionRootConfig("start");
const compositionRoot = CompositionRoot.createCompositionRoot(
  compositionRootConfig
);
const databaseConnection = compositionRoot.getDatabaseConnection();
const webServer = compositionRoot.getWebServer();

export async function bootstrap() {
  await databaseConnection.connect();
  await webServer.start();
}

export const database = databaseConnection;
export const app = webServer.getApplication();
