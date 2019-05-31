import { Vec3 } from "./vec3";
import { Light } from "./light";
import { Sphere } from "./sphere";
import { scene_intersect } from "./scene";

export const reflect = (i: Vec3, n: Vec3): Vec3 => {
  return i.sub(n.scale(2).mul(i.mul(n)));
};

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
  let specular_light_intensity = 0;
  lights.forEach(light => {
    const light_dir = light.position.sub(hit).normalize();
    const light_distance = light.position.sub(hit).length();

    const shadow_orig =
      light_dir.mul(n).length() < 0
        ? hit.sub(n.scale(1e-3))
        : hit.add(n.scale(1e-3));
    const { was_hit: shadow_was_hit, hit: shadow_pt } = scene_intersect(
      shadow_orig,
      light_dir,
      spheres
    );
    if (
      !shadow_was_hit ||
      shadow_pt.sub(shadow_orig).length() >= light_distance
    ) {
      diffuse_light_intensity +=
        light.intensity * Math.max(0, light_dir.dot(n));
      specular_light_intensity +=
        Math.pow(
          Math.max(
            0,
            reflect(light_dir.scale(-1), n)
              .scale(-1)
              .dot(direction)
          ),
          material.specular_exponent
        ) * light.intensity;
    }
  });
  const vec_1 = new Vec3(1, 1, 1);
  let res_color = material.diffuse_color
    .scale(diffuse_light_intensity * material.albedo[0])
    .add(vec_1.scale(specular_light_intensity * material.albedo[1]));

  return res_color;
};
