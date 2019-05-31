import { Vec3 } from "./vec3";
import { Light } from "./light";
import { Sphere } from "./sphere";
import { scene_intersect } from "./scene";

export const cast_ray = (
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
    return new Vec3(0.2, 0.7, 0.8);
  }
  let diffuse_light_intensity = 0;
  lights.forEach(light => {
    let light_dir = light.position.sub(hit).normalize();

    diffuse_light_intensity += light.intensity * Math.max(0, light_dir.dot(n));
  });
  let res_color = material.diffuse_color.scale(diffuse_light_intensity);
  return res_color;
};
