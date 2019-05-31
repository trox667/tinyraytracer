export class Vec3 {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(x?: number, y?: number, z?: number) {
    this.x = x ? x : this.x;
    this.y = y ? y : this.y;
    this.z = z ? z : this.z;
  }

  dot(other: Vec3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other: Vec3): Vec3 {
    const res = new Vec3();
    res.x = this.y * other.z - this.z * other.y;
    res.y = this.z * other.x - this.x * other.z;
    res.z = this.x * other.y - this.y * other.x;
    return res;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  add(other: Vec3): Vec3 {
    const res = new Vec3();
    res.x = this.x + other.x;
    res.y = this.y + other.y;
    res.z = this.z + other.z;
    return res
  }

  sub(other: Vec3): Vec3 {
    const res = new Vec3();
    res.x = this.x - other.x;
    res.y = this.y - other.y;
    res.z = this.z - other.z;
    return res
  }

  scale(t: number): Vec3 {
    const res = new Vec3();
    res.x = this.x * t;
    res.y = this.y * t;
    res.z = this.z * t;
    return res;
  }

  mul(other: Vec3): Vec3 {
    const res = new Vec3();
    res.x = this.x * other.x;
    res.y = this.y * other.y;
    res.z = this.z * other.z;
    return res;
  }

  normalize(): Vec3 {
    const res = new Vec3();
    const l = this.length();
    res.x = this.x / l;
    res.y = this.y / l;
    res.z = this.z / l;
    return res;
  }
}
