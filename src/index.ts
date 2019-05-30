import * as fs from "fs";
import {fromValues} from "gl-vec3";

class Sphere {
  center: [];
  radius: number;
  // constructor()
}


const render = () => {
  const width = 1024;
  const height = 768;
  const framebuffer = new Array(width * height);

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      framebuffer[i + j * width] = [j / height, i / width, 0];
    }
  }

  const val_to_char = (value: number): number => {
    return Math.round(255 * Math.max(0.0, Math.min(1.0, value)));
  }

  const buf = new Uint8Array(width*height*3);
  let c = 0;
  for (let i = 0; i < height * width; i++) {
    buf[c] = val_to_char(framebuffer[i][0]); c++;
    buf[c] = val_to_char(framebuffer[i][1]); c++;
    buf[c] = val_to_char(framebuffer[i][2]); c++;
  }

  const stream = fs.createWriteStream("./out.ppm");
  stream.once("open", fd => {
    stream.write(`P6\n${width} ${height}\n255\n`);
    stream.write(Buffer.from(buf.buffer));
  });
};

const main = () => {
  render();
};

main();
