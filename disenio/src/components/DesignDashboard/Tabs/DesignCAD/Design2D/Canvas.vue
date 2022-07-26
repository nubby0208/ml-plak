<template>
    <div class='canvasKeeper'>
      <!--El canvas tiene el height y el width en pixeles porque si se cambia a partir del estilo la renderizacion del canvas se rompe y los graficos que veamos seran feos y no acordes a la posicion del mouse -->
        <canvas :id='canvasId' class='canvas-style' v-on:mousedown='mouseDown()' height='700' width='1500'
        @wheel='ControlScroll'
        />
    </div>
</template>

<script>
import { HTTP } from '@/plugins/HTTP.js'

// Here is all of the logic of paperjs
// if you want to change the way the app makes the designs, mayor changes must be here

const paper = require('paper')
const JsPDF = require('jspdf')
const domtoimage = require('dom-to-image')

export default {
  name: 'Canvas',
  props: ['canvasId', 'Dibujo', 'SelectedOption'],
  data: () => ({
    path: null,
    SquarePath: null,
    Circlepath: null,
    scope: null,
    new_w: 0.75,
    dashItem: null,
    angleText: null,
    AngleCircle: null,
    Angle: 0,
    TemporalLength: 0,
    ZoomWidth: 0.75,
    extensionPaths: null,
    allowExtension: false,
    mousePosition: null,
    ChargingDesign: true,
    arrowPath: null,
    TemporalCircle: null,
    TemporalSquare: null,
    Path_Abs: null,
    Path_Ord: null,
    MouseFinalPosition: null,
    FontSize: 12,
  }),
  methods: {
    crearCuadro(valor){
      console.log(valor.x);
      let Width = valor.ancho;
      let Heigth = valor.alto;
      let square
      let self = this;
      let topLeft = new paper.Point(valor.x, valor.y);
      console.log(topLeft);
      square = new paper.Path.Rectangle([valor.x, (valor.y*-1)], [Width, (Heigth*-1)])
      
      this.UpdateSelectedColor()
      square.strokeColor = self.CurrentColor ? self.CurrentColor:"#000000";
      square.onMouseDown = function (event) {
        if(square.selected == false){
          self.UnselectAllLines()
        }
        self.SetSelectionOnLine(square)
      }

      // this.tool.onMouseDrag = function(e) {
      //   if (self.Dibujo.MoveLineAssitant === true) {
      //     square.position = rect.position + e.point - e.lastPoint;
      //   }
      // }
      let Text = this.CreateText(square,12)
      let SquareGroup = self.CreateSquareGroup(square, Text)
      this.UpdateSelectedColor()
      let SquareData = {
        topLeft: [square.bounds.topLeft.x,square.bounds.topLeft.y],
        BottomRight: [square.bounds.bottomRight.x,square.bounds.bottomRight.y],
        color: self.CurrentColor,
      }
      if (self.ChargingDesign === true) {
        this.$emit('InsertSquareOnArray', SquareGroup, null)
      }else{
        this.$emit('InsertSquareOnArray', SquareGroup, SquareData)
      }
    },
    crearLinea(valor){
      this.scope.activate();
      const start = new paper.Point([valor.x, Number((valor.y*-1))]);
      const end = new paper.Point();
      end.angle = valor.angulo;
      end.length = valor.size;

      console.log(start, end);
      // let angle = end.subtract(start).angle;
      // console.log(angle);
      this.PathStroke(this.scope, start, end, this.CurrentColor ? this.CurrentColor:"#000000");
      this.UpdateCADStatus();
    },
    crearCirculo(valor){
        let CircleData = {}
        let self = this
        this.UpdateSelectedColor()
        CircleData = {
          center: [valor.x, Number((valor.y*-1))],
          radio: Math.floor(valor.radio),
          color: this.CurrentColor,
        }

        var myCircle = new paper.Path.Circle(CircleData.center, CircleData.radio)
        myCircle.strokeColor = CircleData.color
        this.SetCirlceProperties(myCircle)
        this.$emit('focuslengthButton')
        this.$emit('InsertCircleOnArray', myCircle, CircleData)
        this.UpdateCADStatus()
      
    },
    reset () {
      this.scope.project.activeLayer.removeChildren()
      this.UpdateCADStatus()
    },
    // Aun No esta funcional
    DownloadProyectPDF () {
      let canvas = document.getElementById(this.$props.canvasId)
      let img = canvas.toDataURL('image/png')
      let doc = new JsPDF('p', 'pt', 'a4')
      doc.addImage(img, 'PNG', 30, -550, 835, 545, 'TEST', 'NONE', 270)
      doc.save('TestPDF.pdf')
    },
    ExportJPEGToServer () {
      let canvas = document.getElementById(this.$props.canvasId)
      let node = document.getElementsByClassName('canvasKeeper')[0]
      canvas.style = 'border: 0px solid black; border-radius: 0px; box-shadow: none;'
      node.style = 'padding: 20px 0px;background-color: white;'
      let that = this
      domtoimage.toJpeg(node).then(function (dataUrl) {
        let info = that.$store.state.info
        HTTP.post('/api/v2/images', {
          base64: dataUrl,
          project_name: info.token_project
        }).then(result => {
          that.$noty.success('La imagen se ha subido con exito')
        }).catch(result => {
          that.$noty.error('Error al subir imagen al servidor. Intentelo nuevamente.')
        })
      }).finally(() => {
        node.style = 'background-color: white;'
        canvas.style = 'border: 1px solid black; border-radius: 10px; box-shadow: 0 10px 8px -8px black;'
      })
    },
    design () {
      this.scope.activate()
      if (this.angleText !== null) {
        this.angleText.remove()
        this.AngleCircle.remove()
        this.TemporalLength.remove()
      }
      if (this.$props.SelectedOption === "DesignTool") {
        this.PathProcess(this.scope, this.path.firstSegment.point, this.path.lastSegment.point, this.CurrentColor)
      }
      this.UpdateCADStatus()
    },
    // Creates a group in the Object Dibujo
    CreateGroup () {
      this.Grupo.id += 1
      let group = this.Grupo
      this.Dibujo.grupos.push(group)
      this.UpdateCADStatus()
    },
    UpdateCADStatus () {
      const getCircularReplacer = () => {
        const seen = new WeakSet()
        return (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return
            }
            seen.add(value)
          }
          return value
        }
      }
      this.$store.commit('SetDesignObject', JSON.stringify(this.$props.Dibujo))
      this.$store.commit('SetStatusCanvasCAD', JSON.stringify(this.$data, getCircularReplacer()))
    },
    // Removes the paths that make the guides for the paths
    RemoveTemporalPaths(){
      if(this.path != null){
        this.path.remove()
      }
      // Remove the dashed path and the angle
      if (this.angleText !== null) {
        this.angleText.remove()
        this.AngleCircle.remove()
        this.TemporalLength.remove()
        this.arrowPath.remove()
      }
      if (this.TemporalCircle !== null) {
        this.TemporalCircle.remove()
      }
      if (this.TemporalSquare !== null) {
        this.TemporalSquare.remove()
      }
    },
    InsertText (Text, FontSize) {
      this.scope.activate()
      let self = this
      let position = new paper.Point()
      if (this.mousePosition !== null) {
        position = this.mousePosition.firstSegment.point
      } else {
        position = this.scope.view.center
      }
      let TxtInsert = new paper.PointText(position)
      TxtInsert.content = Text
      TxtInsert.fontSize = FontSize
      TxtInsert.strokeColor = self.CurrentColor
      TxtInsert.onMouseDown = function (event) {
        self.SetSelectionOnLine(TxtInsert)
      }
      TxtInsert.onMouseDrag = function (event) {
        TxtInsert.position = event.point
      }
      this.$emit('InsertTextInObject', TxtInsert)
      this.UpdateCADStatus()
    },
    InterpolatePaths (PathsArray, isGuide, factor) {
      let self = this
      let localFactor = parseFloat(factor)
      switch (factor) {
        case '0.25':
          for (let i = 0; i < 3; i++) {
            self.DrawInterpolation(PathsArray, isGuide, localFactor)
            localFactor += 0.25
          }
          break
        case '0.125':
          for (let j = 0; j < 7; j++) {
            self.DrawInterpolation(PathsArray, isGuide, localFactor)
            localFactor += 0.125
          }
          break
        case '0.0625':
          for (let k = 0; k < 15; k++) {
            self.DrawInterpolation(PathsArray, isGuide, localFactor)
            localFactor += 0.0625
          }
          break
        default :
          self.DrawInterpolation(PathsArray, isGuide, localFactor)
          break
      }
    },
    DrawInterpolation (PathsArray, isGuide, factor) {
      let myPath3 = new paper.Path()
      myPath3.strokeColor = 'black'
      myPath3.interpolate(PathsArray[0].children[1], PathsArray[1].children[1], factor)
      if (isGuide === true) {
        this.GuideLineStroke(myPath3.firstSegment.point, myPath3.lastSegment.point)
      } else {
        this.PathStroke(this.scope, myPath3.firstSegment.point, myPath3.lastSegment.point, this.CurrentColor)
      }
      myPath3.remove()
    },
    pathCreate (scope) {
      scope.activate()
      let CanDesign
      this.$props.Dibujo.grupos.forEach(grupo => {
        if (grupo.selected === true) {
          CanDesign = true
        }
      })
      if (CanDesign === true) {
        return new paper.Path({
          strokeColor: this.CurrentColor,
          strokeJoin: 'round',
          strokeWidth: this.ZoomWidth
        })
      }
    },
    // Crea una tool que se encarga de permitir el uso de paperjs en el canvas
    // No se puede hacer casi nada sin una tool creada
    createTool (scope) {
      scope.activate()
      this.removeTool()
      return new paper.Tool()
    },
    // Solo Procesa el path que llega al dibujarse con el mouse
    PathProcess (scope, from, to, color) {
      scope.activate()
      let self = this
      let length
      if (self.Dibujo.LengthSetter !== '' && self.Dibujo.LengthSetter !== null) {
        length = parseInt(this.Dibujo.LengthSetter, 10)
      } else if (self.path) {
        length = self.path.length
      }
      // Gestion de Angulos fijos
      if (self.$props.Dibujo.FixedAngles === true) {
        switch (this.Angle) {
          case 0 :
            to = new paper.Point((from.x + length), from.y)
            break
          case 45 :
            to = new paper.Point((from.x + (length / 1.41479)), (from.y + (length / 1.41479)))
            break
          case 90 :
            to = new paper.Point(from.x, (from.y + length))
            break
          case 135 :
            to = new paper.Point((from.x - (length / 1.41479)), (from.y + (length / 1.41479)))
            break
          case 180 :
            to = new paper.Point((from.x - length), from.y)
            break
          case -45 :
            to = new paper.Point((from.x + (length / 1.41479)), (from.y - (length / 1.41479)))
            break
          case -90 :
            to = new paper.Point(from.x, (from.y - length))
            break
          case -135 :
            to = new paper.Point((from.x - (length / 1.41479)), (from.y - (length / 1.41479)))
            break
          case -180 :
            to = new paper.Point((from.x - length), from.y)
            break
        }
      }
      this.PathStroke(scope, from, to, color)
    },
    //Solo Dibuja el Circulo de guia cuando se usa el mouse
    ProcessCirclePath (scope) {
      if (this.$props.Dibujo.grupos.length > 0) {
        this.scope.activate()
        if (this.angleText !== null) {
          this.RemoveTemporalPaths()
        }
        this.tool = this.createTool(this.scope)
        let self = this
        this.tool.onMouseMove = function(event){
          self.SetPositionValues(event)
        }
        this.tool.onMouseDrag = (event) => {
          if(!event.modifiers.control){
            self.TemporalCircle = new paper.Path.Circle({
              position: event.downPoint, 
              radius: event.downPoint.subtract(event.point).length,
              dashArray: [2, 2],
              strokeColor: 'red'
            })
  
            self.TemporalCircle.removeOn({
                drag: true,
                down: true,
            })
            self.$emit('focuslengthButton')
            self.SetPositionValues(event)
            self.$emit('UpdateLength', (self.TemporalCircle.bounds.width/2))
          }else{
            self.scope.view.center = this.scope.view.center.subtract((event.delta.divide(1.1)))
          }
        }
      }
    },
    // Solo procesa el cuadrado de guia
    ProcessSquarePath () {
      if (this.$props.Dibujo.grupos.length > 0) {
        this.scope.activate()
        if (this.angleText !== null) {
          this.RemoveTemporalPaths()
        }
        if(this.mousePosition !== null){
          this.mousePosition.remove()
        }
        this.tool = this.createTool(this.scope)
        let self = this
        this.tool.onMouseMove = function(event){
          self.SetPositionValues(event)
        }
        this.tool.onMouseDown = (event) => {
          self.mousePosition = new paper.Path.Circle(event.downPoint, 3)
        }
        this.tool.onMouseDrag = (event) => {
          if(!event.modifiers.control){
            self.TemporalSquare = new paper.Path.Rectangle({
              from: self.mousePosition.position, 
              to: event.lastPoint,
              strokeColor: 'red'
            })
            self.MouseFinalPosition = event.lastPoint
            self.TemporalSquare.removeOn({
                drag: true,
                down: true,
            })
            self.$emit('focuslengthButton')
            self.SetPositionValues(event)
            self.$emit('UpdateLength', self.TemporalSquare.length)
          }else{
            self.scope.view.center = this.scope.view.center.subtract((event.delta.divide(1.1)))
          }
        }
      }else{
        if(window.confirm("Para poder comenzar a dibujar necesitas tener al menos un grupo creado deseas crear un grupo?")){
          this.$emit('crearGrupo');
        }
      }
    },
    // Inserta el path definitivo de las lineas en el lienzo
    PathStroke (scope, from, to, color) {
      scope.activate()
      let self = this
      let ThisPath = new paper.Path.Line(from, to)
      // we create the paths for the autoselection zone and the path that will be stroked
      let WholeLine = new paper.Group(
        new paper.Path.Circle(from, (ThisPath.length / 15)),
        new paper.Path.Line(from, to),
        new paper.Path.Circle(to, (ThisPath.length / 15))
      )
      WholeLine.children[1].strokeWidth = this.ZoomWidth
      WholeLine.children[1].strokeColor = color
      let PathLengthTxt = new paper.PointText(WholeLine.children[1].getPointAt(WholeLine.children[1].length / 2))
      PathLengthTxt.content = Math.floor(WholeLine.children[1].length)
      // Selection on the lines and movement of lines
      // these are paperjs functions
      // With them we can controle how lines behave
      // I put conditions with every asistant
      // So that they behave in the given case
      WholeLine.children[1].onMouseDown = function (event) {
        if(WholeLine.selected == false){
          self.UnselectAllLines()
        }
        self.SetSelectionOnLine(WholeLine.children[1])
        self.SetSelectionOnLine(PathLengthTxt)
      }
      WholeLine.children[1].onMouseDrag = function (event) {
        if (self.Dibujo.MoveLineAssitant === true) {
          PathLengthTxt.position = event.point.add(10)
          WholeLine.position = event.point
        }
      }
      PathLengthTxt.onMouseDown = function (event) {
        if(WholeLine.selected == false){
          self.UnselectAllLines()
        }
        self.SetSelectionOnLine(WholeLine.children[1])
        self.SetSelectionOnLine(PathLengthTxt)
      }
      PathLengthTxt.onMouseDrag = function (event) {
        if (self.Dibujo.MoveLineAssitant === true) {
          PathLengthTxt.position = event.point.add(10)
          WholeLine.position = event.point
        }
      }
      WholeLine.addChild(PathLengthTxt)
      ThisPath.remove()
      if (this.path) {
        this.path.remove()
      }
      if (this.ChargingDesign === false) {
        let LineData = {
          PathGroupIndex: null,
          PointStart: from,
          PointEnd: to,
          color: color
        }
        this.$emit('InsertLineOnArray', WholeLine, LineData)
      } else if (this.ChargingDesign === true) {
        this.$emit('InsertLineOnArray', WholeLine, PathLengthTxt, null)
      }
    },
    // Strokes the defined Guide
    GuideLineStroke (pointA, pointB) {
      let self = this
      let Onepath = new paper.Path.Line(pointA, pointB)
      Onepath.strokeWidth = this.new_w
      Onepath.strokeColor = 'red'
      Onepath.scale(100)
      Onepath.dashArray = [50, 40]
      Onepath.onMouseDrag = function (event) {
        if (self.Dibujo.MoveLineAssitant === true && Onepath.selected === true) {
          Onepath.position = event.point
        }
      }
      if (this.ChargingDesign === false) {
        let GuideData = {
          GuideIndex: null,
          PointStart: pointA,
          PointEnd: pointB,
          color: Onepath.strokeColor
        }
        this.$emit('InsertGuideOnArray', Onepath, GuideData)
      } else {
        this.$emit('InsertGuideOnArray', Onepath, null)
      }
      this.UpdateCADStatus()
    },
    // Clones the selected line
    CloneLine (GuideDistance, factor) {
      let self = this
      let Distance = GuideDistance * factor
      this.Dibujo.grupos.forEach(grupo => {
        if (grupo.selected === true) {
          grupo.PaperGroups.forEach(linea => {
            if (linea.children[1].selected === true) {
              let from = linea.children[1].firstSegment.point.clone()
              let to = linea.children[1].lastSegment.point.clone()
              if (from.x !== to.x) {
                from.y += Distance
                to.y += Distance
                self.PathStroke(self.scope, from, to, linea.children[1].strokeColor)
              } else if (from.y !== to.y) {
                from.x += Distance
                to.x += Distance
                self.PathStroke(self.scope, from, to, linea.children[1].strokeColor)
              } else {
                from.x += Distance
                from.y += Distance
                to.x += Distance
                to.y += Distance
                self.PathStroke(self.scope, from, to, linea.children[1].strokeColor)
              }
            }
          })
        }
      })
      this.UpdateCADStatus()
    },
    // Change the color of the selected line
    ChangeColorSelectedLine (color) {
      this.Dibujo.grupos.forEach(grupo => {
        grupo.PaperGroups.forEach(linea => {
          if (linea.selected === true) {
            linea.children[1].strokeColor = color
          }
        })
      })
    },
    // Unselect All Lines on Object
    UnselectAllLines () {
      this.Dibujo.grupos.forEach(grupo => {
        grupo.PaperGroups.forEach(linea => {
          if (linea.selected === true) {
            linea.selected = false
          }
        })
        grupo.texts.forEach(text => {
          if (text.selected === true) {
            text.selected = false
          }
        })
      })
    },
    // Selection tools
    SetSelectionOnLine (Line) {
      if (Line.selected === true) {
        Line.selected = false
        this.$emit('LineUnselected')
      } else if (this.$props.SelectedOption === "LineMenu") {
        Line.selected = true
        this.$emit('LineSelected')
      }
    },
    SetSelectionOnSquare(Square){
      if (Square.selected === true) {
        Square.selected = false
        this.$emit('SquareUnselected')
      } else if (this.$props.SelectedOption === "LineMenu") {
        Square.selected = true
        this.$emit('SquareSelected')
      }
    },
    SetSelectionOnCircle(Circle){
      if (Circle.selected === true) {
        Circle.selected = false
        this.$emit('CircleUnselected')
      } else if (this.$props.SelectedOption === "LineMenu") {
        Circle.selected = true
        this.$emit('CircleSelected')
      }
    },
    // Loads the design to the canvas
    LoadDesignToCanvas (scope) {
      let that = this
      that.$props.Dibujo.grupos.forEach(grupo => {
        // vaciamos los arrays de los objetos paper
        // Para poder tener los index en el mismo orden
        grupo.PaperGroups = []
        grupo.PaperSquares = []
        grupo.PaperCircles = []
        grupo.PaperGuides = []
        grupo.lineas.forEach(LineData => {
          let Start = new paper.Point(LineData.PointStart[1], LineData.PointStart[2])
          let End = new paper.Point(LineData.PointEnd[1], LineData.PointEnd[2])
          that.PathStroke(scope, Start, End, LineData.color)
        })
        grupo.Guides.forEach(GuideData => {
          let Start = new paper.Point(GuideData.PointStart[1], GuideData.PointStart[2])
          let End = new paper.Point(GuideData.PointEnd[1], GuideData.PointEnd[2])
          that.GuideLineStroke(Start, End)
        })
        grupo.Circles.forEach(CircleData => {
          that.DesignCircle(CircleData)
        })
        grupo.Squares.forEach(SquareData => {
          var from = new paper.Point(SquareData.topLeft[0], SquareData.topLeft[1])
          var to = new paper.Point(SquareData.BottomRight[0], SquareData.BottomRight[1])
          this.DesignSquare(from, to, SquareData.color)
        })
      })
      this.ChargingDesign = false
    },
    // hacer engrosar las guias igualmente
    ChangeZoom  (oldZoom, delta, c, p) {
      let factor = 1.05
      let newZoom
      if (delta < 0) {
        newZoom = oldZoom * factor
        this.$props.Dibujo.grupos.forEach(grupo => {
          grupo.PaperGroups.forEach(linea => {
            if (linea.strokeWidth > 1) {
              this.ZoomWidth = linea.strokeWidth / 1.07
            }
            linea.strokeWidth = this.ZoomWidth
          })
          grupo.PaperGuides.forEach(Guide => {
            if (Guide.strokeWidth > 1) {
              this.ZoomWidth = Guide.strokeWidth / 1.07
            }
            Guide.strokeWidth = this.ZoomWidth
            Guide.scale(0.95)
          })
        })
      } else if (delta > 0) {
        newZoom = oldZoom / factor
        this.$props.Dibujo.grupos.forEach(grupo => {
          grupo.PaperGroups.forEach(linea => {
            if (linea.strokeWidth < 300 && newZoom < 1) {
              this.ZoomWidth = linea.strokeWidth * 1.07
            }
            linea.strokeWidth = this.ZoomWidth
          })
          grupo.PaperGuides.forEach(Guide => {
            if (Guide.strokeWidth < 300 && newZoom < 1) {
              this.ZoomWidth = Guide.strokeWidth * 1.07
            }
            Guide.strokeWidth = this.ZoomWidth
            Guide.scale(1.05)
          })
        })
      }
      let beta = oldZoom / newZoom
      p.add(new paper.Point(7.5, 7.5))
      let pc = p.subtract(c)
      let a = p.subtract(pc.multiply(beta)).subtract(c)
      return [newZoom, a]
    },
    // Controls the zoom  on scroll
    ControlScroll (event) {
      event.preventDefault()
      let e = window.event || event
      let delta = event.deltaY
      let mousePosition = new paper.Point(e.offsetX, e.offsetY)
      let viewPosition = this.scope.view.viewToProject(mousePosition)
      let _ref1 = this.ChangeZoom(this.scope.view.zoom, delta, this.scope.view.center, viewPosition)
      let newZoom = _ref1[0]
      let offset = _ref1[1]
      this.scope.view.zoom = newZoom
      this.scope.view.center = this.scope.view.center.add(offset)
    },
    // Creates a tool for general functions
    SetOtherOptionsTool(){
      let self = this 
      this.tool = this.createTool(this.scope)
      this.tool.onMouseMove = function(event) {
        // Whenever the user moves the mouse,
        // Set the values on the inputs for x an y
        self.SetPositionValues(event)
      }
      this.tool.onMouseDrag = (event) => {
        if (event.modifiers.control) {
          self.scope.view.center = this.scope.view.center.subtract((event.delta.divide(1.1)))
        }
      }
    },
    // funcionar par guias tambien
    // las guias tienen que expandirse al hacer zoom
    EraseSelectedLine () {
      this.scope.activate()
      let self = this
      self.Dibujo.grupos.forEach(grupo => {
        if (self.Dibujo.LineSelected === true) {
          self.DeleteObjectFromArray(grupo.PaperGroups, false, true, false)
          self.DeleteObjectFromArray(grupo.texts)
          this.$emit('LineUnselected')
        }
        if (self.Dibujo.GuideSelected === true) {
          self.DeleteObjectFromArray(grupo.PaperGuides, true, false, false)
        }
        if(self.Dibujo.SquareSelected === true){
          grupo.PaperSquares.forEach(Square => {
            if (Square.selected === true) {
              let SquareDataIndex = grupo.PaperSquares.indexOf(Square)
              grupo.Squares.splice(SquareDataIndex, 1)
              Square.remove()
            }
          });
          this.$emit('SquareUnselected') 
        }
        if (self.Dibujo.CircleSelected === true) {
          console.log("ok")
          grupo.PaperCircles.forEach(Circle => {
            if (Circle.selected === true) {
              Circle.remove()
              let CircleDataIndex = grupo.PaperCircles.indexOf(Circle)
              grupo.Circles.splice(CircleDataIndex, 1)
            }
          });
          this.$emit('CircleUnselected') 
        }
      })
      self.UpdateCADStatus()
    },
    DeleteObjectFromArray (array, isGuideData, isLineData, isSquareData) {
      let self = this
      array.forEach(function (object, index) {
        if (object.selected === true) {
          if (isGuideData === true) {
            self.Dibujo.grupos.forEach(grupo => {
              grupo.Guides.forEach(function (GuideData, indexGuide) {
                if (GuideData.GuideIndex === index) {
                  grupo.Guides.splice(indexGuide, 1)
                }
              })
            })
          } else if (isLineData === true) {
            self.Dibujo.grupos.forEach(grupo => {
              grupo.lineas.forEach(function (LineData, indexLine) {
                if (LineData.PathGroupIndex === index) {
                  grupo.lineas.splice(indexLine, 1)
                }
              })
            })
          } else if (isSquareData === true) {
            self.Dibujo.grupos.forEach(grupo => {
              grupo.Squares.forEach(function (SquareData, ArrayIndex) {
                if (ArrayIndex === index) {
                  grupo.Squaress.splice(ArrayIndex, 1)
                }
              })
            })
          }
          object.remove()
          array.splice(index, 1)
        }
      })
    },
    // arreglar la guia vertical
    CreateGuide (GuideDistance, factor) {
      let self = this
      self.scope.activate()
      let Distance = GuideDistance * factor
      this.Dibujo.grupos.forEach(grupo => {
        if (grupo.selected === true) {
          grupo.PaperGroups.forEach(linea => {
            if (linea.children[1].selected === true) {
              let pointA = linea.children[1].firstSegment.point.clone()
              let pointB = linea.children[1].lastSegment.point.clone()
              pointA = pointA.add(Distance)
              pointB = pointB.add(Distance)
              self.GuideLineStroke(pointA, pointB)
            }
          })
        }
      })
    },
    // Removes the tool so that we can work with another one
    removeTool(){
      if(this.tool){
        this.tool.remove()    
      }
      this.tool = null
    },
    // Handles the mouseDown event
    mouseDown () {
      if (this.$props.SelectedOption === "CustomSquareTools"){
      }else if (this.$props.SelectedOption === "DesignTool"){
        this.DrawTemporalLineVector()
      }else if (this.$props.SelectedOption === "SquareTool"){
        this.ProcessSquarePath()
      }else if (this.$props.SelectedOption === "CircleTool"){  
        this.ProcessCirclePath()
      }else if (this.$props.SelectedOption === "TextTool"){
        this.ShowTextInput()
      }else{

        // if(this.$props.Dibujo.grupos.length < 1){
        //   if(window.confirm("Para poder comenzar a dibujar necesitas tener al menos un grupo creado deseas crear un grupo?")){
        //     this.$emit('crearGrupo');
        //   }
        // }else{
        //   alert("Debes seleccionar al menos un tipo de herramienta");
        // }
      }

      this.$emit('focuslengthButton')
    },
    // Gives The position of the click
    // We use this for the texts
    ShowTextInput(){
      this.tool = this.createTool(this.scope)
      let self = this
      this.tool.onMouseDown = (event) => {
        if(this.mousePosition !== null){
          this.mousePosition.remove()
        }
        let position = new paper.Point(event.point)
        self.mousePosition = new paper.Path.Circle(position,5)
        if(!event.modifiers.control){
          self.$emit('ShowTextInput')
        }
      }
      this.tool.onMouseDrag = (event) => {
        if(event.modifiers.control){
          self.scope.view.center = this.scope.view.center.subtract((event.delta.divide(1.1)))
        }
      }
    },
    UpdateSelectedColor(){
      // Set Current Color
      this.$props.Dibujo.grupos.forEach(grupo => {
        if (grupo.selected === true) {
          this.CurrentColor = grupo.color
        }
      })
    },
    //Designs the Line Model for the path design
    DrawTemporalLineVector () {
      this.scope.activate()
      this.UpdateSelectedColor()
      // Remove the dashed path and the angle
      if (this.angleText !== null) {
        this.angleText.remove()
        this.AngleCircle.remove()
        this.TemporalLength.remove()
        this.arrowPath.remove()
      }
      // in order to access functions in nested tool
      let self = this
      // create drawing tool
      this.tool = this.createTool(this.scope)
      // letiables for the angles and the Unions
      let newpointStart = new paper.Point()
      let newpointEnd = new paper.Point()
      this.tool.onMouseDown = (event) => {
        if (!event.modifiers.control) {
          if (self.extensionPaths !== null && self.extensionPaths.children[0].contains(event.point)) {
            self.allowExtension = true
          } else if (this.$props.Dibujo.grupos.length > 0) {
            newpointStart = event.point
            if (self.mousePosition !== null) {
              self.mousePosition.remove()
            }
            self.mousePosition = new paper.Path.Circle(newpointStart, 3)
            self.mousePosition.fillColor = 'black'
            if (self.path !== null) {
              self.path.remove()
            }
            // init path
            self.path = self.pathCreate(self.scope)
            // Set Current Color
            self.path.insert(0, event.point)
            if (this.$props.Dibujo.UnionAssitant === true) {
              this.$props.Dibujo.grupos.forEach(grupo => {
                if (grupo.selected === true) {
                  grupo.PaperGroups.forEach(path => {
                    if (path.children[0].contains(event.point)) {
                      newpointStart = new paper.Point(path.children[0].position.x, path.children[0].position.y)
                      self.path.insert(0, newpointStart)
                    } else if (path.children[2].contains(event.point)) {
                      newpointStart = new paper.Point(path.children[2].position.x, path.children[2].position.y)
                      self.path.insert(0, newpointStart)
                    }
                  })
                }
              })
            }
            // add point to path
            self.path.removeSegment(1)
          }
        }
        // Guides Selection On Mouse Down
        self.$props.Dibujo.grupos.forEach(grupo => {
          grupo.PaperGuides.forEach(Guide => {
            if (Guide.intersects(self.mousePosition)) {
              if (Guide.selected !== true) {
                Guide.selected = true
                self.$props.Dibujo.GuideSelected = true
                self.mousePosition.remove()
              } else {
                self.$props.Dibujo.GuideSelected = false
                Guide.selected = false
              }
            }
          })
        })
      }
      this.tool.onMouseMove = function(event) {
        // Whenever the user moves the mouse,
        // Set the values on the inputs for x an y
        self.SetPositionValues(event)
      }
      this.tool.onMouseDrag = (event) => {
        let self = this
        if (self.mousePosition !== null) {
          self.mousePosition.remove()
        }
        if (event.modifiers.control) {
          self.scope.view.center = this.scope.view.center.subtract((event.delta.divide(1.1)))
        } else if (this.$props.Dibujo.grupos.length > 0) {
          self.path.removeSegment(1)
          self.path.insert(1, event.point)
          let length
          if (self.Dibujo.LengthSetter !== '' && self.Dibujo.LengthSetter !== null) {
            length = parseInt(this.Dibujo.LengthSetter, 10)
          } else {
            length = self.path.length
          }
          let to
          // Gestion de Angulos fijos
          if (self.$props.Dibujo.FixedAngles === true) {
            switch (this.Angle) {
              case 0 :
                to = new paper.Point((self.path.firstSegment.point.x + length), self.path.firstSegment.point.y)
                break
              case 45 :
                to = new paper.Point((self.path.firstSegment.point.x + (length / 1.41479)), (self.path.firstSegment.point.y + (length / 1.41479)))
                break
              case 90 :
                to = new paper.Point(self.path.firstSegment.point.x, (self.path.firstSegment.point.y + length))
                break
              case 135 :
                to = new paper.Point((self.path.firstSegment.point.x - (length / 1.41479)), (self.path.firstSegment.point.y + (length / 1.41479)))
                break
              case 180 :
                to = new paper.Point((self.path.firstSegment.point.x - length), self.path.firstSegment.point.y)
                break
              case -45 :
                to = new paper.Point((self.path.firstSegment.point.x + (length / 1.41479)), (self.path.firstSegment.point.y - (length / 1.41479)))
                break
              case -90 :
                to = new paper.Point(self.path.firstSegment.point.x, (self.path.firstSegment.point.y - length))
                break
              case -135 :
                to = new paper.Point((self.path.firstSegment.point.x - (length / 1.41479)), (self.path.firstSegment.point.y - (length / 1.41479)))
                break
              case -180 :
                to = new paper.Point((self.path.firstSegment.point.x - length), self.path.firstSegment.point.y)
                break
            }
            self.path.removeSegment(1)
            self.path.insert(1, to)
          }
          newpointEnd = event.point
          // Union Automatica de las lineas Y creacion del path
          if (self.$props.Dibujo.UnionAssitant === true) {
            this.$props.Dibujo.grupos.forEach(grupo => {
              if (grupo.selected === true) {
                grupo.PaperGroups.forEach(path => {
                  if (path.children[0].contains(event.point)) {
                    newpointEnd = new paper.Point(path.children[0].position.x, path.children[0].position.y)
                    self.path.removeSegment(1)
                    self.path.insert(1, newpointEnd)
                  } else if (path.children[2].contains(event.point)) {
                    newpointEnd = new paper.Point(path.children[2].position.x, path.children[2].position.y)
                    self.path.removeSegment(1)
                    self.path.insert(1, newpointEnd)
                  }
                })
              }
            })
          }
          let vector = new paper.Point()
          vector = newpointEnd.subtract(newpointStart)
          // quitamos todos los items temporales si uno de ellos existe
          if (self.angleText !== null) {
            self.angleText.remove()
            self.AngleCircle.remove()
            self.TemporalLength.remove()
            self.extensionPaths.remove()
            self.arrowPath.remove()
          }
          // Gestion de la letiable que guarda los angulos
          self.Angle = Math.floor(vector.angle)
          if (self.$props.Dibujo.FixedAngles === true) {
            if (this.Angle > 0) {
              if (this.Angle <= 30) {
                this.Angle = 0
              }
              if (this.Angle >= 30) {
                if (this.Angle <= 60) {
                  this.Angle = this.Angle = 45
                }
                if (this.Angle >= 60) {
                  if (this.Angle <= 120) {
                    this.Angle = 90
                  }
                  if (this.Angle > 120) {
                    if (this.Angle <= 150) {
                      this.Angle = 135
                    }
                    if (this.Angle > 150) {
                      this.Angle = 180
                    }
                  }
                }
              }
            }
            if (this.Angle < 0) {
              if (this.Angle < 0 && this.Angle >= -30) {
                this.Angle = 0
              } else if (this.Angle < -30) {
                if (this.Angle >= -60) {
                  this.Angle = -45
                }
                if (this.Angle < -60) {
                  if (this.Angle >= -120) {
                    this.Angle = -90
                  }
                  if (this.Angle < -120) {
                    if (this.Angle >= -150) {
                      this.Angle = -135
                    }
                    if (this.Angle < -150) {
                      this.Angle = -180
                    }
                  }
                }
              }
            }
          }
          // Items temporales
          self.TemporalLength = new paper.PointText(self.path.getPointAt(self.path.length / 2))
          self.TemporalLength.content = Math.floor(self.path.length)
          self.AngleCircle = new paper.Path.Circle(newpointStart, 25)
          self.AngleCircle.strokeColor = 'black'
          self.AngleCircle.dashArray = [1, 2]
          self.angleText = new paper.PointText(newpointStart)
          self.angleText.content = self.Angle.toString() + '°'
          let PointA = new paper.Point(self.path.lastSegment.point.x, self.path.lastSegment.point.y)
          self.arrowPath = new paper.Group(
            new paper.Path.Line(PointA, (PointA.subtract(15))),
            new paper.Path.Line(PointA, (PointA.subtract(15)))
          )
          self.arrowPath.children[0].rotate((self.Angle - 15), self.path.lastSegment.point)
          self.arrowPath.children[1].rotate((self.Angle + 285), self.path.lastSegment.point)
          self.arrowPath.strokeColor = 'black'
          self.$emit('UpdateLength', self.path.length)
          // Path para extender el path de base con el mouse
          self.extensionPaths = new paper.Group(
            new paper.Path.Circle(self.path.lastSegment.point, 30)
          )
          // Whenever the user moves the mouse,
          // Set the values on the inputs for x an y
          self.SetPositionValues(event)

        }
      }
    },
    SetPositionValues(event){
      // Whenever the user moves the mouse,
      // Set the values on the inputs for x an y
      this.$props.Dibujo.CurrentPointX = Math.round(event.point.x)
      this.$props.Dibujo.CurrentPointY = Math.round(event.point.y)
    },
    // Designs The square from the Temporal square 
    DesignSquare(from, to, color){
      let self = this
      if (this.ChargingDesign === false) {
        if (this.$props.Dibujo.Width !== '' && this.$props.Dibujo.Heigth !== ''){
          let Width = this.$props.Dibujo.Width
          let Heigth = this.$props.Dibujo.Heigth
          let square
          if(this.MouseFinalPosition.y > this.mousePosition.firstSegment.point.y && this.MouseFinalPosition.x > this.mousePosition.firstSegment.point.x){
            square = new paper.Path.Rectangle(this.TemporalSquare.bounds.topLeft, [Width, Heigth])
          }else if( this.MouseFinalPosition.y > this.mousePosition.firstSegment.point.y && this.MouseFinalPosition.x < this.mousePosition.firstSegment.point.x){
            square = new paper.Path.Rectangle(this.TemporalSquare.bounds.topRight, [Heigth, Width])
            square.rotate(90,this.TemporalSquare.bounds.topRight)
          }else if( this.MouseFinalPosition.y < this.mousePosition.firstSegment.point.y && this.MouseFinalPosition.x < this.mousePosition.firstSegment.point.x) {
            square = new paper.Path.Rectangle(this.TemporalSquare.bounds.bottomRight, [Width, Heigth])
            square.rotate(180,this.TemporalSquare.bounds.bottomRight)
          }else{
            square = new paper.Path.Rectangle(this.TemporalSquare.bounds.bottomLeft, [Heigth, Width])
            square.rotate(270,this.TemporalSquare.bounds.bottomLeft)
          }
          this.UpdateSelectedColor()
          square.strokeColor = this.CurrentColor;
          square.onMouseDown = function (event) {
            if(square.selected == false){
              self.UnselectAllLines()
            }
            self.SetSelectionOnLine(square)
          }
          this.tool.onMouseDrag = function(e) {
            if (self.Dibujo.MoveLineAssitant === true) {
              square.position = rect.position + e.point - e.lastPoint;
            }
          }
          let Text = this.CreateText(square,12)
          let SquareGroup = self.CreateSquareGroup(square, Text)
          this.UpdateSelectedColor()
          let SquareData = {
            topLeft: [square.bounds.topLeft.x,square.bounds.topLeft.y],
            BottomRight: [square.bounds.bottomRight.x,square.bounds.bottomRight.y],
            color: this.CurrentColor,
          }
          if (self.ChargingDesign === true) {
            this.$emit('InsertSquareOnArray', SquareGroup, null)
          }else{
            this.$emit('InsertSquareOnArray', SquareGroup, SquareData)
          }
        }else{
          this.UpdateSelectedColor()
          let SquareData = {
            topLeft: new paper.Point(this.TemporalSquare.firstSegment.point.x,this.TemporalSquare.firstSegment.point.y),
            BottomRight: new paper.Point(this.TemporalSquare.segments[2].point.x,this.TemporalSquare.segments[2].point.y),
            color: this.CurrentColor,
          }
          let square = new paper.Path.Rectangle(SquareData.topLeft, SquareData.BottomRight);
          square.strokeColor = SquareData.color;
          SquareData = {
            topLeft: [square.bounds.topLeft.x,square.bounds.topLeft.y],
            BottomRight: [square.bounds.bottomRight.x,square.bounds.bottomRight.y],
            color: this.CurrentColor,
          }
          let Text = this.CreateText(square,12)
          let SquareGroup = self.CreateSquareGroup(square, Text)
          if (self.ChargingDesign === true) {
            this.$emit('InsertSquareOnArray', SquareGroup, null)
          }else{
            this.$emit('InsertSquareOnArray', SquareGroup, SquareData)
          }
        }
        this.UpdateCADStatus()
      }else{
        let square = new paper.Path.Rectangle(from, to)
        square.strokeColor = color
        let Text = this.CreateText(square)
        let SquareGroup = self.CreateSquareGroup(square, Text)
        this.$emit('InsertSquareOnArray', SquareGroup, null)
      }
    },
    CreateSquareGroup(square, Text){
      let self = this
      let SquareGroup = new paper.Group()
      SquareGroup.addChild(square)
      SquareGroup.addChild(Text)
      SquareGroup.onMouseDrag = function (e) {
        if (self.Dibujo.MoveLineAssitant === true) {
          SquareGroup.position = e.point.add(10)
        }
      }
      return SquareGroup
    },
    // Set the texts for the square
    CreateText(squarePath, FontSize) {
      let self = this
      let TextObject = new paper.Group()
      TextObject.addChild(new paper.PointText(squarePath.bounds.topCenter))
      TextObject.addChild(new paper.PointText(squarePath.bounds.leftCenter))
      TextObject.addChild(new paper.PointText(squarePath.bounds.bottomCenter))
      TextObject.addChild(new paper.PointText(squarePath.bounds.rightCenter))
      TextObject.children[0].content = TextObject.children[2].content = Math.floor(squarePath.bounds.width)   
      TextObject.children[1].content = TextObject.children[3].content = Math.floor(squarePath.bounds.height)
      TextObject.onMouseDown = function (event) {
        self.SetSelectionOnSquare(TextObject)
        self.SetSelectionOnSquare(squarePath)
      }
      return TextObject
    },
    TextPropertiesSetter(Text, squarePath){
      //!text.fontSize = FontSize
      let Self = this
      Text.onMouseDown = function (event) {
        Self.SetSelectionOnSquare(Text)
        Self.SetSelectionOnSquare(squarePath)
      }
    },
    // Designs the circle from the Temporal circle
    DesignCircle(CicleDataLoad){
      if (this.ChargingDesign === false){
        let CircleData = {}
        let self = this
        this.UpdateSelectedColor()
        if (this.$props.Dibujo.Radio !== ''){
          CircleData = {
            center: [this.TemporalCircle.position.x,this.TemporalCircle.position.y],
            radio: Math.floor(this.$props.Dibujo.Radio),
            color: this.CurrentColor,
          }
        }else{
          CircleData = {
            center:  [this.TemporalCircle.position.x,this.TemporalCircle.position.y],
            radio: Math.floor(this.TemporalCircle.length/(2*3.14)),
            color: this.CurrentColor,
          }
        }
        var myCircle = new paper.Path.Circle(CircleData.center, CircleData.radio)
        myCircle.strokeColor = CircleData.color
        this.SetCirlceProperties(myCircle)
        this.$emit('focuslengthButton')
        this.$emit('InsertCircleOnArray', myCircle, CircleData)
        this.UpdateCADStatus()
      } else {
        var center = new paper.Point(CicleDataLoad.center[0],CicleDataLoad.center[1])
        var radio = CicleDataLoad.radio
        var myCircle = new paper.Path.Circle(center,radio);
        myCircle.strokeColor = CicleDataLoad.color;
        this.SetCirlceProperties(myCircle)
        this.$emit('InsertCircleOnArray', myCircle, null)
      }
    },
    SetCirlceProperties(CirclePath){
      let self = this
      CirclePath.onMouseDown = function (event) {
        self.SetSelectionOnCircle(CirclePath)
      }
      CirclePath.onMouseDrag = function (e) {
        if (self.Dibujo.MoveLineAssitant === true) {
          CirclePath.position = e.point.add(10)
        }
      }
    },
    // Designs the cartesian plan in the canvas
    DesignCenterCartesianPlan(){
      this.scope.activate()
      let center = new paper.Point(0,0)
      this.scope.view.center = center
      let Point_A_Abs = new paper.Point(0,-85000)
      let Point_B_Abs = new paper.Point(0,85000)
      let Point_A_Ord = new paper.Point(-85000,0)
      let Point_B_Ord = new paper.Point(85000,0)
      this.Path_Abs = new paper.Path.Line(Point_A_Abs,Point_B_Abs)
      this.Path_Ord = new paper.Path.Line(Point_A_Ord,Point_B_Ord)
      this.Path_Abs.strokeColor = 'black'
      this.Path_Ord.strokeColor = 'black'
      
    },
    HideOrShowCoordinateAxis(){
      this.Path_Abs.visible = !this.Path_Abs.visible
      this.Path_Ord.visible = !this.Path_Ord.visible
    }
  },
  mounted () {
    this.scope = new paper.PaperScope()
    this.scope.setup(this.canvasId)
    this.LoadDesignToCanvas(this.scope)
    this.ChargingDesign = false
    this.DesignCenterCartesianPlan()

    this.$root.$on("crearCuadro", (valor) => {
      this.crearCuadro(valor);
    });
    
    this.$root.$on("crearLinea", (valor) => {
      this.crearLinea(valor);
    });

    let center = new paper.Point(0, 0);
    this.$root.$on("moverCanvasMouse", (valor) => {
      this.tool = this.createTool(this.scope);

      let self = this

      this.tool.onMouseDrag = (event) => {
        if(valor){
          self.scope.view.center = this.scope.view.center.subtract((event.delta.divide(1.1)))
        }
      }
      
    });

    this.$root.$on("moverCanvas", (valor) => {
      switch (valor.e) {
        case 37:
          // Izquierda
          center.x += 10;
          this.scope.view.center = center;
        break;

        case 39:
          // Derecha
          center.x -= 10;
          this.scope.view.center = center;
        break;

        case 38:
          // Arriba
          center.y += 10;
          this.scope.view.center = center;
        break;

        case 40:
          // Abajo
          center.y -= 10;
          this.scope.view.center = center;
        break;
      
        default:
        break;
      }
    });

    this.$root.$on("crearCirculo", (valor) => {
      this.crearCirculo(valor);
    });
}
}
</script>

<style scoped>
.canvas-style {
    cursor: crosshair;
    border: 1px solid black;
    border-radius: 10px;
    margin: auto;
    box-shadow: 0 10px 8px -8px black;
}
</style>