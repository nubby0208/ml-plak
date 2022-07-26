class MlPlakDistancePoint {
  constructor(pieceId, color, position) {
    this.pieceId = pieceId;
    this.color = color;
    this.position = position;
    this.id = "point_" + pieceId + Math.random().toString(36).slice(2);
  }
}
