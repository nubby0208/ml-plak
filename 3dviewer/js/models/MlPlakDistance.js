class MlPlakDistance {
  constructor() {
    this.id = "distance_" + Math.random().toString(36).slice(2);
    this.pointA = null;
    this.pointB = null;
    this.distance = 0.0;
    this.color = "#006CAA";
    this.fixedX = false;
    this.fixedY = false;
    this.fixedZ = false;
  }

  setPointA(pieceId, color, position) {
    const pos = new THREE.Vector3(position.x, position.y, position.z);
    this.pointA = new MlPlakDistancePoint(pieceId, color, pos);
    if(this.pointB) {
      this.distance = this.getDistance();
    }
  }

  setPointB(pieceId, color, position) {
    const pos = new THREE.Vector3(position.x, position.y, position.z);
    this.pointB = new MlPlakDistancePoint(pieceId, color, pos);
    if(this.pointA) {
      this.distance = this.getDistance();
    }
  }

  getDistance() {
    const pa = new THREE.Vector3();
    pa.copy(this.pointA.position);
    pa.multiplyScalar(10);
    const pb = new THREE.Vector3();
    pb.copy(this.pointB.position);
    pb.multiplyScalar(10);
    return Math.round(pa.distanceTo(pb));
  }

  fixed(x, y, z) {
    this.fixedX = x;
    this.fixedY = y;
    this.fixedZ = z;
  }

  isFixed() {
    return this.fixedX || this.fixedY || this.fixedZ;
  }
}
