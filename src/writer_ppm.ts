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
    buf[c] = val_to_char(framebuffer[i].x);
    c++;
    buf[c] = val_to_char(framebuffer[i].y);
    c++;
    buf[c] = val_to_char(framebuffer[i].z);
    c++;
  }

  const stream = fs.createWriteStream("./out.ppm");
  stream.once("open", fd => {
    stream.write(`P6\n${width} ${height}\n255\n`);
    stream.write(Buffer.from(buf.buffer));
  });
};
