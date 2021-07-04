import { Image } from "canvas";
import http from "https";

export default function (url: string): Promise<Image> {
  return new Promise((r, rej) => {
    http
      .get(url)
      .on("response", function (res) {
        const chunks: any[] = [];
        res.on("data", function (data) {
          chunks.push(data);
        });
        res.on("end", function () {
          const img = new Image();
          img.src = Buffer.concat(chunks);
          r(img);
        });
      })
      .on("error", function (err) {
        rej(err);
      });
  });
}
