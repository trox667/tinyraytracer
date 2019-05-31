import { Vec3 } from "./vec3";
import { Material } from "./material";
import { Light } from "./light";
import { Sphere } from "./sphere";
import { render } from "./renderer";
import { write_ppm } from "./writer_ppm";

const main = () => {
  const width = 1024;
  const height = 768;

  const ivory = new Material(new Vec3(0.4, 0.4, 0.3));
  const red_rubber = new Material(new Vec3(0.3, 0.1, 0.1));

  const spheres = [];
  spheres.push(new Sphere(new Vec3(-3, 0, -16), 2, ivory));
  spheres.push(new Sphere(new Vec3(-1, -1.5, -12), 2, red_rubber));
  spheres.push(new Sphere(new Vec3(-1.5, -0.5, -18), 3, red_rubber));
  spheres.push(new Sphere(new Vec3(7, 5, -18), 4, ivory));

  const lights = [];
  lights.push(new Light(new Vec3(-20, 20, 20), 1.5));

  const framebuffer = render(width, height, spheres, lights);
  write_ppm(width, height, framebuffer);
};

main();
