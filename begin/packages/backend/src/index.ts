import { server } from "./shared/bootstrap";

const port = Number(process.env.PORT || 3000);
server.start(port);
