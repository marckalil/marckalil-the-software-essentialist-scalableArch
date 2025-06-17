import { server } from "./bootstrap";

const port = Number(process.env.PORT || 3000);
server.start(port);
