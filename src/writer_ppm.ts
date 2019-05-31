import * as fs from "fs";
import { Vec3 } from "./vec3";

export const write_ppm = (
  width: number,
  height: number,
  framebuffer: Array<Vec3>
) => {
  const val_to_char = (value: number): number => {
    return Math.round(255 * Math.max(0.0, Math.min(1.0, value)));
  };

  const buf = new Uint8Array(width * height * 3);
  let c = 0;
  for (let i = 0; i < height * width; i++) {
    let cur = framebuffer[i];
    const max = Math.max(cur.x, Math.max(cur.y, cur.z));
    if(max > 1) cur = cur.scale(1/max);
    buf[c] = val_to_char(cur.x);
    c++;
    buf[c] = val_to_char(cur.y);
    c++;
    buf[c] = val_to_char(cur.z);
    c++;
  }

  const stream = fs.createWriteStream("./out.ppm");
  stream.once("open", fd => {
    stream.write(`P6\n${width} ${height}\n255\n`);
    stream.write(Buffer.from(buf.buffer));
  });
};
