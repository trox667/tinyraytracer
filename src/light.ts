import { Vec3 } from "./vec3";

export class Light {
  public position: Vec3;
  public intensity: number;
  constructor(position: Vec3, intensity: number) {
    this.position = position;
    this.intensity = intensity;
  }
}
