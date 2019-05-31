import { Vec3 } from "./vec3";

export class Material {
  public diffuse_color = new Vec3();
  constructor(diffuse_color?: Vec3) {
    this.diffuse_color = diffuse_color ? diffuse_color : this.diffuse_color;
  }
}
