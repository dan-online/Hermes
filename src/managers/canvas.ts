import {
  Canvas,
  NodeCanvasRenderingContext2D,
  loadImage,
  registerFont,
  Image,
  createCanvas,
} from "canvas";
import Jimp from "jimp";
import path from "path";

export class CanvasManager extends Canvas {
  ctx: NodeCanvasRenderingContext2D;
  constructor(h: number, w: number) {
    super(w, h, "image");

    registerFont(
      path.resolve(__dirname, "..", "assets", "fonts", "Whitney.otf"),
      { family: "Default", weight: "800" }
    );

    this.ctx = this.getContext("2d");
  }
  wrapText(
    text: string,
    x: number,
    y: number,
    color = "black",
    fontSize = 50,
    maxWidth = 200,
    lineHeight = 20
  ): CanvasManager {
    this.ctx.font = fontSize + "px Default";
    this.ctx.fillStyle = color;
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, y);
    return this;
  }
  addText(
    text: string,
    x: number,
    y: number,
    color = "black",
    fontSize = 50
  ): CanvasManager {
    this.ctx.font = fontSize + "px Default";
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
    return this;
  }
  addProgress(
    progress: number,
    color: string,
    width: number,
    x: number,
    y: number
  ): CanvasManager {
    this.ctx.beginPath();
    this.ctx.lineWidth = 14;
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = "round";
    this.ctx.fillStyle = color;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + width * progress, y);
    this.ctx.stroke();
    return this;
  }
  async addImage(
    src: string | Image,
    x: number,
    y: number,
    w: number,
    h: number,
    circle?: boolean,
    grayscale?: boolean
  ): Promise<CanvasManager> {
    let image;
    if (typeof src == "string") {
      image = await loadImage(src);
    } else {
      image = src;
    }
    if (grayscale) {
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      const id = ctx.getImageData(0, 0, image.width, image.height);
      ctx.clearRect(0, 0, image.width, image.height);
      const data = id.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = y;
        data[i + 1] = y;
        data[i + 2] = y;
      }
      ctx.putImageData(id, 0, 0);
      image = canvas;
    }
    if (circle) {
      this.ctx.beginPath();
      this.ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI);
      this.ctx.clip();
    }
    this.ctx.drawImage(image, x, y, w, h);
    return this;
  }
  addBackgroundColor(color: string): CanvasManager {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
    return this;
  }
  async addBackgroundImage(image: string): Promise<CanvasManager> {
    const imageGuildRaw = await Jimp.read(image);
    const imageGuildPre = await imageGuildRaw
      .cover(this.width, this.height)
      .blur(10);

    const imageGuild = await imageGuildPre.getBufferAsync("image/png");
    const img = new Image();
    img.src = imageGuild;

    this.ctx.drawImage(img, 0, 0, this.width, this.height);
    this.addBackgroundColor("rgba(0,0,0,0.5)");
    return this;
  }
  export(): Buffer {
    return this.toBuffer("image/png", { resolution: 72 });
  }
}
