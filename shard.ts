import dotenv from "dotenv";
import path from "path";
import { ShardingManager } from "discord.js";

dotenv.config();

const manager = new ShardingManager(path.resolve(__dirname, "index.js"), {
  token: process.env.TOKEN,
  totalShards: process.env.SHARDS ? parseInt(process.env.SHARDS) : 4,
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));
manager.spawn();
