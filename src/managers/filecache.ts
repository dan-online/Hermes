import { readdir, readFile, writeFile, unlink } from "fs/promises";
import path from "path";

export class FileCacheManager {
  dir: string;
  constructor() {
    this.dir = path.resolve(__dirname, "..", "assets", "cache");
    return this;
  }
  async check(id: string, variator: any): Promise<null | Promise<Buffer>> {
    const files = await readdir(this.dir);

    const found = files.find((x) => x.startsWith(id));

    if (found) {
      const variationFound = found.split("-")[found.split("-").length - 1];

      if (variationFound.split(".")[0] != variator) {
        await unlink(path.resolve(this.dir, found));
        return null;
      }
      return readFile(path.resolve(this.dir, found));
    } else {
      return null;
    }
  }
  async add(id: string, buffer: Buffer): Promise<string> {
    await writeFile(path.resolve(this.dir, id), buffer);
    return id;
  }
}
