import { Vec3 } from "./vec3";
import { Material } from "./material";
import { Sphere } from "./sphere";

interface Intersect {
  was_hit: boolean;
  hit: Vec3;
  n: Vec3;
  material: Material;
}

export const scene_intersect = (
  origin: Vec3,
  direction: Vec3,
  spheres: Sphere[]
): Intersect => {
  let sphere_dist = Number.MAX_VALUE;
  let hit = new Vec3();
  let n = new Vec3();
  let material: Material;
  spheres.forEach(sphere => {
    let dist_i = 0;
    let { t, res } = sphere.ray_intersect(origin, direction, dist_i);
    dist_i = t;
    if (res && dist_i < sphere_dist) {
      sphere_dist = dist_i;
      hit = origin.add(direction.scale(dist_i));
      n = hit.sub(sphere.center).normalize();
      material = sphere.material;
    }
  });

  return { was_hit: sphere_dist < 1000, hit, n, material };
};
