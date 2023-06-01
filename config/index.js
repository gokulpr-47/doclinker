import { config } from "dotenv";

// if (process.env.NODE_ENV !== "production") {
//   config({ path: "./.dev.env" });
// } else {
//   config({ path: "./.env" });
// }

config({ path: "./.env" });

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export { PORT, MONGO_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };
