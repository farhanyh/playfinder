import "./bot";
import { connectDatabase } from "./database";

(async () => {
  await connectDatabase();
})();
