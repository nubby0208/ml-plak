import * as THREE from 'three'
import { MlPlakDistancePoint } from './MlPlakDistancePoint'

export class MlPlakDistance {
    constructor(color = "#006CAA") {
        this.id = 'distance_' + Math.random().toString(36).slice(2)
        this.pointA = null
        this.pointB = null
        this.distance = 0.0
            //
        this.color = color
        this.fixedX = false
        this.fixedY = false
        this.fixedZ = false
        this.fontSize = 16
        this.pEjeX=0.0
        this.pEjeY=0.0
        this.pEjeZ=0.0
    }

    async setPointA(pieceId, color, position, tag) {
        const pos = new THREE.Vector3(position.x, position.y, position.z)
        this.pointA = new MlPlakDistancePoint(pieceId, color, pos, tag)

        if (this.pointB) {
            this.distance = this.getDistance()
            let positionPoint = await this.getPointMiddle(this.pointA.position, this.pointB.position)
            this.pEjeX = positionPoint.x 
            this.pEjeY = positionPoint.y 
            this.pEjeZ = positionPoint.z 
            // console.log(`calcula la distancia en el punto A, ${JSON.stringify(positionPoint)}, puntos: ${JSON.stringify(this.pointA.position, this.pointB.position)}, **3D/classes/models/MlPlakDistance.js `)

        }
    }

    setPointB(pieceId, color, position, tag) {
        const pos = new THREE.Vector3(position.x, position.y, position.z)
        this.pointB = new MlPlakDistancePoint(pieceId, color, pos, tag)

        if (this.pointA) {
            this.distance = this.getDistance()
            let positionPoint = this.getPointMiddle(this.pointA.position, this.pointB.position)
            this.pEjeX = positionPoint.x
            this.pEjeY = positionPoint.y
            this.pEjeZ = positionPoint.z
            // console.log(`calcula la distancia en el punto B, ${JSON.stringify(positionPoint)},  puntos: ${JSON.stringify(this.pointA.position, this.pointB.position)}, **3D/classes/models/MlPlakDistance.js `)

            
        }
    }


    setFontSize(valor) {
        console.log(`setFontSize,  valor: ${valor}, **3D/classes/models/MlPlakDistance.js `)
        this.fontSize = valor
    }
    
    setEjeX(valor) {
        console.log(`setEjeX,  valor: ${valor}, **3D/classes/models/MlPlakDistance.js `)
        this.pEjeX = valor
    }

    setEjeY(valor) {
        console.log(`setEjeY,  valor: ${valor}, **3D/classes/models/MlPlakDistance.js `)
        this.pEjeY = valor
    }

    setpEjeZ(valor) {
        console.log(`setEjeX,  valor: ${valor}, **3D/classes/models/MlPlakDistance.js `)
        this.pEjeZ = valor
    }


    setIsPointBselected(valor) {
        this.isPointBselected = valor
    }

    getIsPointBselected() {
        return this.isPointBselected
    }


    // Ver porque se multiplica escalarmente por 10
    getDistance() {
        const pa = new THREE.Vector3()
        pa.copy(this.pointA.position)

        const pb = new THREE.Vector3()
        pb.copy(this.pointB.position)

        pa.multiplyScalar(10)
        pb.multiplyScalar(10)

        return Math.round(pa.distanceTo(pb))
    }



    getPointMiddle(pointA, pointB){

        var middle = new THREE.Vector3();
        // * 10 para pasarlo a milimitro
        middle.x = ((pointA.x + pointB.x) / 2) * 10;
        middle.y = ((pointA.y + pointB.y) / 2) * 10;
        middle.z = ((pointA.z + pointB.z) / 2) * 10;
        
        return middle
    }


    fixed(x, y, z) {
        this.fixedX = x
        this.fixedY = y
        this.fixedZ = z
    }

    isFixed() {
        return this.fixedX || this.fixedY || this.fixedZ
    }
}