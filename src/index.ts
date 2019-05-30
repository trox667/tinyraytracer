import * as fs from "fs";
import { add, sub, normalize, dot, scale } from "gl-vec3";

type Vec3 = number[];
interface SphereIntersect {
  t: number;
  res: boolean;
}

interface Cast {
  t: number;
  res: Vec3;
}

interface Intersect {
  was_hit: boolean;
  hit: Vec3;
  n: Vec3;
  material: Material;
}

class Material {
  public diffuse_color: Vec3 = [];
  constructor(diffuse_color?: Vec3) {
    this.diffuse_color = diffuse_color ? diffuse_color : [0, 0, 0];
  }
}

class Light {
  public position: Vec3;
  public intensity: number;
  constructor(position: Vec3, intensity: number) {
    this.position = position;
    this.intensity = intensity;
  }
}

class Sphere {
  public center: Vec3;
  public radius: number;
  public material: Material;

  constructor(center: Vec3, radius: number, material?: Material) {
    this.center = center;
    this.radius = radius;
    this.material = material ? material : new Material();
  }

  ray_intersect(origin: Vec3, direction: Vec3, t0: number): SphereIntersect {
    const L: Vec3 = [];
    sub(L, this.center, origin);

    const tca = dot(L, direction);
    const d2 = dot(L, L) - tca * tca;
    if (d2 > this.radius * this.radius) return { t: t0, res: false };
    const thc = Math.sqrt(this.radius * this.radius - d2);
    t0 = tca - thc;
    const t1 = tca + thc;
    if (t0 < 0) {
      return { t: t1, res: false };
    }
    return { t: t0, res: true };
  }
}

const scene_intersect = (
  origin: Vec3,
  direction: Vec3,
  spheres: Sphere[]
): Intersect => {
  let sphere_dist = Number.MAX_VALUE;
  let hit: Vec3 = [];
  let n: Vec3 = [];
  let material: Material;
  spheres.forEach(sphere => {
    let dist_i = 0;
    let { t, res } = sphere.ray_intersect(origin, direction, dist_i);
    dist_i = t;
    if (res && dist_i < sphere_dist) {
      sphere_dist = dist_i;
      let dir_dist_i: Vec3 = [];
      scale(dir_dist_i, direction, dist_i);
      add(hit, origin, dir_dist_i);
      let n_: Vec3 = [];
      sub(n_, hit, sphere.center);
      normalize(n, n_);
      material = sphere.material;
    }
  });

  return { was_hit: sphere_dist < 1000, hit, n, material };
};

const cast_ray = (
  origin: Vec3,
  direction: Vec3,
  spheres: Sphere[],
  lights: Light[]
) => {
  const { was_hit, hit, n, material } = scene_intersect(
    origin,
    direction,
    spheres
  );
  if (!was_hit) {
    return [0.2, 0.7, 0.8];
  }
  let diffuse_light_intensity = 0;
  lights.forEach(light => {
    let light_dir: Vec3 = [];
    let light_dir_: Vec3 = [];
    sub(light_dir_, light.position, hit);
    normalize(light_dir, light_dir_);
    diffuse_light_intensity += light.intensity * Math.max(0, dot(light_dir, n));
  });
  let res_color: Vec3 = [];
  scale(res_color, material.diffuse_color, diffuse_light_intensity);
  return res_color;
};

const render = (spheres: Sphere[], lights: Light[]) => {
  const width = 1024;
  const height = 768;
  const fov = Math.PI / 2;
  const framebuffer: Array<Vec3> = new Array(width * height);

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const x =
        (((2 * (i + 0.5)) / width - 1) * Math.tan(fov / 2) * width) / height;
      const y = -((2 * (j + 0.5)) / height - 1) * Math.tan(fov / 2);
      const dir: Vec3 = [];
      normalize(dir, [x, y, -1]);
      framebuffer[i + j * width] = cast_ray([0, 0, 0], dir, spheres, lights);
    }
  }

  const val_to_char = (value: number): number => {
    return Math.round(255 * Math.max(0.0, Math.min(1.0, value)));
  };

  const buf = new Uint8Array(width * height * 3);
  let c = 0;
  for (let i = 0; i < height * width; i++) {
    buf[c] = val_to_char(framebuffer[i][0]);
    c++;
    buf[c] = val_to_char(framebuffer[i][1]);
    c++;
    buf[c] = val_to_char(framebuffer[i][2]);
    c++;
  }

  const stream = fs.createWriteStream("./out.ppm");
  stream.once("open", fd => {
    stream.write(`P6\n${width} ${height}\n255\n`);
    stream.write(Buffer.from(buf.buffer));
  });
};

const main = () => {
  const ivory = new Material([0.4, 0.4, 0.3]);
  const red_rubber = new Material([0.3, 0.1, 0.1]);

  const spheres = [];
  spheres.push(new Sphere([-3, 0, -16], 2, ivory));
  spheres.push(new Sphere([-1, -1.5, -12], 2, red_rubber));
  spheres.push(new Sphere([-1.5, -0.5, -18], 3, red_rubber));
  spheres.push(new Sphere([7, 5, -18], 4, ivory));

  const lights = [];
  lights.push(new Light([-20, 20, 20], 1.5));

  render(spheres, lights);
};

main();
