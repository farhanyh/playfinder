import "./bot";
import { connectDatabase } from "./database";
import "./server";

(async () => {
  await connectDatabase();
})();
