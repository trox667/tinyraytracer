import { Vec3 } from "./vec3";
import { Light } from "./light";
import { Sphere } from "./sphere";
import { cast_ray } from "./ray";

export const render = (
  width: number,
  height: number,
  spheres: Sphere[],
  lights: Light[]
): Array<Vec3> => {
  const fov = Math.PI / 2;
  const framebuffer: Array<Vec3> = new Array(width * height);
  const origin = new Vec3();

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const x =
        (((2 * (i + 0.5)) / width - 1) * Math.tan(fov / 2) * width) / height;
      const y = -((2 * (j + 0.5)) / height - 1) * Math.tan(fov / 2);
      const p = new Vec3(x, y, -1);
      const dir = p.normalize();
      framebuffer[i + j * width] = cast_ray(origin, dir, spheres, lights);
    }
  }

  return framebuffer;
};
