// Local development only: starts a throwaway MySQL server and prints the
// DATABASE_URL to put in .env.local. Data is lost when this process stops.
//   npm run dev:db
import { createDB } from "mysql-memory-server";

const db = await createDB({ dbName: "guruhealthline", port: 3307 });
console.log(`MySQL ready. Put this in .env.local:\nDATABASE_URL=mysql://${db.username}@127.0.0.1:${db.port}/${db.dbName}`);
console.log("Press Ctrl+C to stop.");

const stop = async () => {
  await db.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
setInterval(() => {}, 1 << 30);
