export class MlPlakDistancePoint {
  constructor (pieceId, color, position, tag) {
    this.pieceId = pieceId
    this.color = color
    this.position = position
    this.id = 'point_' + pieceId + Math.random().toString(36).slice(2)
    this.pieceTag = tag
  }
}
