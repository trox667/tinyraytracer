import { Vec3 } from "./vec3";
import { Material } from "./material";

interface SphereIntersect {
  t: number;
  res: boolean;
}

export class Sphere {
  public center: Vec3;
  public radius: number;
  public material: Material;

  constructor(center: Vec3, radius: number, material?: Material) {
    this.center = center;
    this.radius = radius;
    this.material = material ? material : new Material();
  }

  ray_intersect(origin: Vec3, direction: Vec3, t0: number): SphereIntersect {
    const L = this.center.sub(origin);
    const tca = L.dot(direction);

    const d2 = L.dot(L) - tca * tca;
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
