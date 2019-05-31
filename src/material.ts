import { Vec3 } from "./vec3";

type Vec2 = number[];

export class Material {
  public albedo: number[] = [1, 0];
  public diffuse_color = new Vec3();
  public specular_exponent: number = 0;

  constructor(albedo?: Vec2, diffuse_color?: Vec3, specular?: number) {
    this.albedo = albedo ? albedo : this.albedo;
    this.diffuse_color = diffuse_color ? diffuse_color : this.diffuse_color;
    this.specular_exponent = specular ? specular : this.specular_exponent;
  }
}
