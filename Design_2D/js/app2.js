    
    var URL_BASE = window.location.href.split('.com')[0]+'.com/server'; // For Staging and Production
    // var URL_BASE = 'http://127.0.0.1:8000'; // For Dev
    URL_BASE += '/api/CAD_Designer/';

var urlParams = new URLSearchParams(window.location.search);
var myUser = urlParams.get('user');
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Interface
// Todas mis variables para su uso global
var values = {
    fixLength: false,
    fixAngle: false,
    showCircle: false,
    showAngleLength: true,
    showCoordinates: false
};
////////////////////////////////////////////////////////////////////////////////
// Variables
var index_linea = 0;
var vectorStart, vector, vectorPrevious;
var vectorItem, items, dashedItems;
// Objetos
var Dibujo = {
    Nombre_Dibujo : null,
    User : myUser,
    grupos : []
};
var linea ={
    index : 0,
    x1:null,
    y1:null,
    x2:null,
    y2:null,
    color:"black",
    width: 0,
    tamano : 0
}
var Grupo ={
    nombre_grupo : "",
    color : "#000000",
    grosor :  1,
    lineas : []
}
var Paths_and_tx = {
    paths : paths,
    texts : textos
}
// esta variable cambia el width del path
var new_w = 0.75;
var paths =[];
var textos =[];
var Objeto_Edit =  null;
var groupid = 0;
var grupoSeleccionado = null;
var grados_actuales = 0;
// Variables para los asistentes
var DegreeAsistant = true;
var MoveLineAssitant = false;
var UnionAsistant= true;  

//////////////////////////////////////////////////////////////////////////////
//// Object when data comes back
var Objeto_Regresado=[]
/// Cargar la cookie si existe en el explorador al iniciar
window.onload=checkCookie();
// Funciones para generar el vector rojo de guia, y medidas de guia junto con grados
function processVector(event, drag) {  
        vector = event.point - vectorStart;
        if (vectorPrevious) {
            if (values.fixLength && values.fixAngle) {
                vector = vectorPrevious;
            } else if (values.fixLength) {
                vector.length = vectorPrevious.length;
            } else if (values.fixAngle) {
                vector = vector.project(vectorPrevious);
            }
        }
        drawVector(drag);
}
function Verificarlength(length){
    if(!isNaN(length)){
        linea.x2 = linea.x1 + length;
    }
    if(!isNaN(length)){
        linea.y2 = linea.y1 + length;
    }
}
// Se dibuja el vector rojo de guia
function drawVector(drag) {
    if(DegreeAsistant == true){
        if (vector.angle > 0){
            if (vector.angle <=30){
                grados_actuales = vector.angle = 0;
            }
            if(vector.angle >30){
                if (vector.angle <=60){
                    grados_actuales = vector.angle = 45;
                }
                if(vector.angle >60 ){
                    if (vector.angle <=120){
                        grados_actuales = vector.angle = 90;
                    }
                    if(vector.angle >120){
                        if (vector.angle <=150){
                            grados_actuales = vector.angle = 135;
                        }
                        if(vector.angle >150){
                            grados_actuales = vector.angle = 180;
                        }
                    } 
                
                } 
            }   
        }
        if (vector.angle < 0){
            if (vector.angle >=-30){
                grados_actuales = vector.angle = 0;
            }
            if(vector.angle < -30){
                if (vector.angle >= -60){
                    grados_actuales = vector.angle = -45;
                }
                if(vector.angle < -60 ){
                    if (vector.angle >= -120){
                        grados_actuales = vector.angle = -90;
                    }
                    if(vector.angle < -120){
                        if (vector.angle >= -150){
                            grados_actuales =  vector.angle = -135;
                        }
                        if(vector.angle < -150){
                            grados_actuales =  vector.angle = -180;
                        }
                    } 
                
                } 
            }   
        }  
    } 
    if (items) {
        for (var i = 0, l = items.length; i < l; i++) {
            items[i].remove();
        }
    }
    if (vectorItem)
        vectorItem.remove();
    items = [];
    var arrowVector = vector.normalize(10);
    var end = vectorStart + vector;
    linea.x2 = end.x;
    linea.y2 = end.y;
    vectorItem = new Group(
        new Path(vectorStart, end),
        new Path(
            end + arrowVector.rotate(135),
            end,
            end + arrowVector.rotate(-135)
        )
    );
    vectorItem.strokeWidth = new_w;
    vectorItem.strokeColor = '#e4141b';
    vectorItem.miterLimit = 30;
    // Display:
    dashedItems = [];
    // Draw Circle
    if (values.showCircle) {
        dashedItems.push(new Path.Circle(vectorStart, vector.length));
    }
    // Draw Labels
    if (values.showAngleLength) {
        drawAngle(vectorStart, vector, !drag);
        if (!drag)
            drawLength(vectorStart, end, vector.angle < 0 ? -1 : 1, true);
    }
    var quadrant = vector.quadrant;
    if (values.showCoordinates && !drag) {
        drawLength(vectorStart, vectorStart + [vector.x, 0],
                [1, 3].indexOf(quadrant) != -1 ? -1 : 1, true, vector.x, 'x: ');
        drawLength(vectorStart, vectorStart + [0, vector.y],
                [1, 3].indexOf(quadrant) != -1 ? 1 : -1, true, vector.y, 'y: ');
    }
    for (var i = 0, l = dashedItems.length; i < l; i++) {
        var item = dashedItems[i];
        item.strokeColor = 'black';
        item.dashArray = [1, 2];
        items.push(item);
    }
    // Update palette
    values.x = vector.x;
    values.y = vector.y;
    values.length = vector.length;
    values.angle = vector.angle;
    if(UnionAsistant == true){
        for(var i=0; i<paths.length;i++){
            var offset1 = paths[i].length / 15;
            var circle1 = new Path.Circle(paths[i].firstSegment.point, offset1);
            var circle2 = new Path.Circle(paths[i].lastSegment.point, offset1);
            if(circle1.contains(vectorItem.children[0].lastSegment.point)){
                    vectorItem.children[0].insert(1, paths[i].firstSegment);
                    vectorItem.children[0].removeSegment(2);
                    if(vectorItem.children[1]){
                        vectorItem.children[1].remove();
                    }
                    linea.x2 = circle1.position.x;
                    linea.y2 = circle1.position.y;
            }else if(circle1.contains(vectorItem.children[0].firstSegment.point)){
                vectorItem.children[0].insert(0, paths[i].firstSegment);
                vectorItem.children[0].removeSegment(1);
                vectorStart.x = circle1.position.x;
                vectorStart.y = circle1.position.y;
            }else if(circle2.contains(vectorItem.children[0].firstSegment.point)){
                vectorItem.children[0].insert(0, paths[i].lastSegment);
                vectorItem.children[0].removeSegment(1);
                vectorStart.x = circle2.position.x;
                vectorStart.y = circle2.position.y;
            }else if(circle2.contains(vectorItem.children[0].lastSegment.point)){
                    vectorItem.children[0].insert(1, paths[i].lastSegment);
                    vectorItem.children[0].removeSegment(2);
                    if(vectorItem.children[1]){
                        vectorItem.children[1].remove();
                    }
                    linea.x2 = circle2.position.x;
                    linea.y2 = circle2.position.y;
            }else{
                vectorItem.addChild(new Path(
                    end + arrowVector.rotate(135),
                    end,
                    end + arrowVector.rotate(-135)
                ));
            }
        }
    }
}
// Se dibuja el angulo del vector
function drawAngle(center, vector, label) {
    var radius = 25, threshold = 10;
    var from = new Point(radius, 0);
    var through = from.rotate(vector.angle / 2);
    var to = from.rotate(vector.angle);
    var end = center + to;
    dashedItems.push(new Path.Line(center,
            center + new Point(radius + threshold, 0)));
    dashedItems.push(new Path.Arc(center + from, center + through, end));
    var arrowVector = to.normalize(7.5).rotate(vector.angle < 0 ? -90 : 90);
    dashedItems.push(new Path([
            end + arrowVector.rotate(135),
            end,
            end + arrowVector.rotate(-135)
    ]));
    if (label) {
        // Angle Label
        var text = new PointText(center + through.normalize(radius + 10) + new Point(0, 3));
        text.content = Math.floor(vector.angle * 100) / 100 + '\xb0';
        items.push(text);
    }
}
// Se dibuja la longitud del vector rojo
function drawLength(from, to, sign, label, value, prefix) {
    var lengthSize = 5;
    if ((to - from).length < lengthSize * 4)
        return;
    var vector = to - from;
    var awayVector = vector.normalize(lengthSize).rotate(90 * sign);
    var upVector = vector.normalize(lengthSize).rotate(45 * sign);
    var downVector = upVector.rotate(-90 * sign);
    var lengthVector = vector.normalize(vector.length / 2 - lengthSize * Math.SQRT2);
    var line = new Path();
    line.add(from + awayVector);
    line.lineBy(upVector);
    line.lineBy(lengthVector);
    line.lineBy(upVector);
    var middle = line.lastSegment.point;
    line.lineBy(downVector);
    line.lineBy(lengthVector);
    line.lineBy(downVector);
    dashedItems.push(line);
    if (label) {
        // Length Label
        var textAngle = Math.abs(vector.angle) > 90
                ? textAngle = 180 + vector.angle : vector.angle;
        // Label needs to move away by different amounts based on the
        // vector's quadrant:
        var away = (sign >= 0 ? [1, 4] : [2, 3]).indexOf(vector.quadrant) != -1
                ? 8 : 0;
        var text = new PointText(middle + awayVector.normalize(away + lengthSize));
        text.rotate(textAngle);
        text.justification = 'center';
        value = value || vector.length;
        text.content = (prefix || '') + Math.floor(value * 1000) / 1000;
        items.push(text);
        linea.tamano=text.content;
    }
}
////////////////////////////////////////////////////////////////////////////////
// Mouse Handling
/**Estas on funciones por defecto de manejo del mouse dentro de paperjs */
var dashItem;
var savePath;
function onMouseDown(event) {
    if (event.modifiers.control === false){
        var end = vectorStart + vector;
        var create = false;
        if (event.modifiers.shift && vectorItem) {
            vectorStart = end;
            create = true;
        } else if (vector && (event.modifiers.option
                || end && end.getDistance(event.point) < 10)) {
            create = false;
        } else {
            vectorStart = event.point;
        }
        if (create) {
            dashItem = vectorItem;
            vectorItem = null;
        }
        if(vectorStart){
            linea.x1 = vectorStart.x;
            linea.y1 = vectorStart.y;
        }
        processVector(event, true);
    }
}
function onMouseDrag(event) {
    if (event.modifiers.control === false){
            if (!event.modifiers.shift && values.fixLength && values.fixAngle){
                vectorStart = event.point;
                if(vectorStart){
                    linea.x1 = vectorStart.x;
                    linea.y1 = vectorStart.y;
                }
            }
            processVector(event, event.modifiers.shift);
        }else{
            var e = window.event || e;
            view.center -= event.delta/1.1;
            event.stopPropagation()
        }
}
function onMouseUp(event) {
    if (event.modifiers.control === false){
            processVector(event, false);
            if (dashItem) {
                dashItem.dashArray = [1, 2];
                dashItem = null;
            }
            vectorPrevious = vector;
            linea.x1 = vectorStart.x;
            linea.y1 = vectorStart.y;
        }

}
function onMouseMove(event){
    for(var i=0; i<paths.length;i++){
        var s1 = paths[i].firstSegment.point;
        var s2 = paths[i].lastSegment.point;
            if(event.point == s1){
                vectorStart = s1;
            }else if(s2){
                end = s2;
            }
        }
}
///////////////////////////////////////////////////////////////////////
//////////Botones
//// Asistente de Grados
$(document).on('click','#DegreeAsistant', function(){     
        if (this.checked) {
            DegreeAsistant = true;
        }else{
            DegreeAsistant = false;
        }         
    });
//// Asistente de Movimiento de lineas
$(document).on('click','#MoveAsistant', function(){     
    if (this.checked) {
        MoveLineAssitant = true;
    }else{
        MoveLineAssitant = false;
    }         
});
/// Asistente de union de lineas
$(document).on('click','#UnionAsistant', function(){     
    if (this.checked) {
        UnionAsistant = true;
    }else{
        UnionAsistant = false;
    }         
});
/// borrador
$(document).on('click','#Eraser', function(){     
    for(var i=0; i<paths.length; i++){
        if (paths[i].selected == true) {
            paths[i].remove();
        }
        if (textos[i].selected == true) {
            textos[i].remove();
        }
    }
});
/// Dibujar linea
$( ".Design" ).click(function() {
    DibujarLineas();      
});
//////////////////////////////-----------------------------
//----- creacion de grupos y gestion de grupos
$( "#Group" ).click(function() {
    $( ".Design" ).css("display", 'inline');
    var  newgroup = $.extend(true,{},Grupo);
    //newgroup.grosor = 1;
    // grupo.grosor = newgroup.grosor;
    Dibujo.grupos[groupid]=newgroup;
    /// se crea el html de  un nuevo grupo
    GroupDiv(groupid);    
    groupid++;
});
/////---------------- Nuew design button
$("#New-design").click(function(){
    for(var i=0; i<textos.length; i++){
        var t = textos[i];
        t.remove();
    }
    clearcanvas();
    Dibujo = {
        Nombre_Dibujo : null,
        User : myUser,
        grupos : []
    };
    linea ={
        index : 0,
        x1:null,
        y1:null,
        x2:null,
        y2:null,
        color:"black",
        width: 0,
        tamano : 0
    }
    Grupo ={
        nombre_grupo : "",
        color : "#000000",
        grosor :  1,
        lineas : []
    }  
    index_linea =0;
    paths =[];
    textos =[];
    Objeto_Edit =  null;
    groupid = 0;
    grupoSeleccionado = null;
    $('#group_container').empty();
    $('#Lineas').empty();
    var cookie = null;
    setCookie("ML-PLAk-CAD",cookie, 2);
});
// ----- Undo
$( "#Undo" ).click(function() {
    LinesDiv();
    undo();
});
////////////////////////////////////////////////////////////////////////////////
/* Estas funciones estan deshabilitadas hasta que se sincronise el modulo con el centro de diseno, debera editarse entonces la comunicacion que existe ahora con la db*/
///------------ ajax
//--------------save data
$('#Send_Data').on("click", function (evt) {
    evt.preventDefault();
    if(Dibujo.Nombre_Dibujo == null || Dibujo.Nombre_Dibujo == " " ){
        alert("DEBE DARLE NOMBE A SU DIBUJO PARA GUARDARLO!!!!!!");
    }else{
        $.ajax({
            type: 'POST',
            url: URL_BASE + "store",
            crossDomain: true,
            dataType: "text",
            data: {dibujo: JSON.stringify(Dibujo)} ,
            success: function(response) {
                Objeto_Edit = response;
                return  response;
            },
            error: function(response,t, ts){
                console.log("error saving design");
            }
        });
    }
});
//---------------Obtain Data
//  Obtain Dibujos by user
var Objeto_A_Usar= [];
$('#Obtain_Data').on("click", function (evt){
    evt.preventDefault();
    $.ajax({
        type: 'POST',
        url: URL_BASE + "charge",
        crossDomain: true,
        data: {user : myUser},
        success: function(response) {
            Objeto_Regresado = response;
            $( "#results" ).empty();
            $( "#results" ).css("display" , "inline" );
            $.each(Objeto_Regresado, function( index, dibujo ) {
                $( "#results" ).append( "<div class=results-container><p class='Dibujos btn btn-primary'>Nombre del  Dibujo : " +dibujo.Nombre_Dibujo +"  "+"</p><div class='edit_erase'><button class='MyCAD_Id buttons btn btn-success' type=button value="+dibujo.id+">Obtener Dibujo </button><button class='Erase_Design buttons btn btn-success' type=button value="+dibujo.id+">Borrar Dibujo</button></div></div>" );
            });
            $('body').css("overflow", "scroll");
            //clickear permite recuperar las lineas del dibujo seleccionado
            $(".MyCAD_Id").on("click", function (evt){
                clearcanvas();
                $( "#results" ).css("display" , "none" );
                $('#Lineas').empty();
                $('#group_container').empty();
                paths = [];
                var id = this.value;
                Objeto_Edit = id;
                $.ajax({
                    type: 'POST',
                    url: URL_BASE + "show",
                    crossDomain: true,
                    dataType: "text",
                    data: {MyId : id},
                    success: function(response) {
                        Objeto_A_Usar = JSON.parse(response);
                        LoadDesignCADFromDB(Objeto_A_Usar);
                        var cookie = JSON.stringify(Dibujo);
                        setCookie("ML-PLAk-CAD",cookie, 2);
                        return  response;
                    },
                error: function(response){
                        console.log("error saving design");
                    }
                });
                
            });
            ///////////////////////////
            ////////////- ELiminar un dibujo de la DB
            $('.Erase_Design').on("click", function (evt){
                evt.preventDefault();
                var id = this.value;
                clearcanvas();
                $('#Lineas').empty();
                $('#results').empty();
                $.ajax({
                    type: 'POST',
                    url: URL_BASE + "destroy",
                    crossDomain: true,
                    dataType: "text",
                    data: {id: id} ,
                    success: function(response) {
                    return  response;
                    },
                error: function(response){
                    console.log("error saving design");
                    }
                });
            });
            return  response;
        },
        error: function(response,t, ts){
            console.log("error saving design");
            }
    });
});
//// Edicion del dibujo
$('#Editar_Dibujo').on("click", function (evt){
    evt.preventDefault();
    var id = Objeto_Edit;
    $.ajax({
        type: 'POST',
        url: URL_BASE + "edit",
        crossDomain: true,
        dataType: "text",
        data: {dibujo: JSON.stringify(Dibujo), id: id} ,
        success: function(response) {
          return  response;
        },
       error: function(response){
          console.log("error saving design");
        }
    });
});
//////////////////////////////////////////////////////////////////////////////// 
//// Fin ajax
//------------ change color
$( "#color_change" ).click(function() {
    linea.color = $('#favcolor').val();
});
/// clear canvas completo con un boton*
$("#clear_canvas").click(function(){
    clearcanvas();
    for(var i=0; i<textos.length; i++){
        var t = textos[i];
        t.remove();
    }
    $('#group_container').empty();
    $('#Lineas').empty();
    var cookie = null;
    setCookie("ML-PLAk-CAD",cookie, 2);
});
//------------ change name
$( "#name_button" ).click(function() {
    Dibujo.Nombre_Dibujo = $('#name').val();
});
//------------ Insert Txt
$( "#InsertTextBtn" ).click(function() {
    var text = new PointText(new Point(view.center));
    text.justification = 'right';
    text.fillColor = 'black';
    text. fontSize = $( "#TxtFont" ).val();
    text.content = $( "#InsertTextctn" ).val();
    text.onMouseDown = function(event) {
        if (text.selected == true) {
            text.selected = false;
        }else{
            text.selected = true;
        }
    }
    text.onMouseDrag = function(event) {
        if(MoveLineAssitant == true){
            text.position += event.delta;
            var cookie = JSON.stringify(Dibujo);
            setCookie("ML-PLAk-CAD",cookie, 2);
        }
    }
    text.push(textos); 
})
/// Fin butons
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/// Funciones
///-----clear canvas
function clearcanvas(){
    for(var i=0; i< paths.length; i++){
        paths[i].remove();
    }
    for(var i=0; i< textos.length; i++){
        textos[i].remove();
    }
    LinesDiv();
}
//////////////////////////////////--------------------
//----- control de lineas
function LinesDiv(){
    if(grupoSeleccionado!=null){
        $('#Lineas').empty();
            $.each(Dibujo.grupos[grupoSeleccionado].lineas, function( index, linea ) {
            var strokeColor = linea.color;
            //var strokeWidth = value.width;
            var length = linea.tamano;
            $( "#Lineas" ).append("<div id='linea'><a class='btn btn-primary line-number'>Linea "+(index+1)+"</a><div class='group-caracts'><select id='grosor-line_"+index+"' class='form-control line-changes-table-item'><option  value="+1+">"+linea.width+"</option><option value="+1+">Delgada</option><option value="+3+">Mediana</option><option value="+6+">Gruesa</option></select><input id='color-line_"+index+"' class='form-control btn btn-primary color-container line-changes-table-item' type='color' value="+strokeColor+"></div><div class='group-caracts'><input class='form-control w-input line-changes-table-item' value="+length+"><button class='btn btn-primary modify_line line-changes-table-item' value='"+index+"'>Editar</button></div></div>");
            $('a').css({
                "text-decoration": "none",
                "color": "white" 
            });
            $('.modify_line').click(function(){
                var id= this.value;
                var color = Dibujo.grupos[grupoSeleccionado].lineas[id].color = $('#color-line_'+id).val();
                var strokeWidth = $('#grosor-line_'+id).val();
                //paths[id].strokeColor =color;
               // paths[id].strokeWidth =strokeWidth;
                    for(var i=0; i<paths.length; i++){
                        if(Dibujo.grupos[grupoSeleccionado].lineas[id].index == i){
                            paths[i].set({
                                strokeColor: color,
                                strokeWidth: strokeWidth,
                            });
                        }
                    }
            });  
        });
    }
}
//Load Lines to the canvas
function CargarLineasAlCanvas(ObjetoADibujar, idGroup){
    for(var j=0; j<ObjetoADibujar.length;j++){
        var color = Grupo.color;
        var x1 = Dibujo.grupos[idGroup].lineas[j].x1;
        var x2 = Dibujo.grupos[idGroup].lineas[j].x2;
        var y1 = Dibujo.grupos[idGroup].lineas[j].y1;
        var y2 = Dibujo.grupos[idGroup].lineas[j].y2;
        var width = Grupo.grosor;
        var index = Dibujo.grupos[idGroup].lineas[j].index;
        strokePath(index,x1,y1,x2,y2,color,width);
   }
}
//// function para crear divs de grupos
function GroupDiv(groupid){
    $('.GroupSelect').prop('checked', false);
    grupoSeleccionado = groupid;
    $( "#group_container" ).append("<div id='group'><div class='form-control w-input group-name-container'><input type='radio' class='form-check-input GroupSelect' name='GroupSelect' id='#GroupSelect_"+groupid+"' value="+groupid+" checked><input class='group-name' placeholder='Nombre Grupo' id='name-group_"+groupid+"' value="+Dibujo.grupos[groupid].nombre_grupo+"></div><div class='group-caracts'><input id='color-line-group_"+groupid+"' class='form-control btn btn-primary color-container' type='color' value="+Dibujo.grupos[groupid].color+"><select id='grosor-line-group_"+groupid+"' class='form-control'><option  value="+1+">Grosor de Linea</option><option value="+1+">Delgada</option><option value="+3+">Mediana</option><option value="+6+">Gruesa</option></select></div><div class='group-caracts' ><button id='Group_edit_btn_"+groupid+"' class='Group_edit btn btn-primary' value='"+groupid+"'>Editar</button></div></div>");
    // Le asignamos a grupo de base los valores dentro del div de grupo
    Dibujo.grupos[grupoSeleccionado].color = $('#color-line-group_'+grupoSeleccionado).val();
    Dibujo.grupos[grupoSeleccionado].nombre_grupo = $('#name-group_'+grupoSeleccionado).val();
    Dibujo.grupos[grupoSeleccionado].grosor = $('#grosor-line-group_'+grupoSeleccionado).val();
    //boton para editar lineas
    $( '#Group_edit_btn_'+groupid ).click(function() {
        var thisGroup = this.value;
        //se guarda en el objeto de grupos que esta dentro del Dibujo
        Dibujo.grupos[thisGroup].color = $('#color-line-group_'+thisGroup).val();
        Dibujo.grupos[thisGroup].nombre_grupo = $('#name-group_'+thisGroup).val();
        Dibujo.grupos[thisGroup].grosor = $('#grosor-line-group_'+thisGroup).val();
        // Se guarda en el objeto con el que se edita en el canvas directamente
        Grupo.color = $('#color-line-group_'+thisGroup).val();
        Grupo.nombre_grupo = $('#name-group_'+thisGroup).val();
        Grupo.grosor = $('#grosor-line-group_'+thisGroup).val();
        //CargarLineasAlCanvas(Dibujo.grupos[thisGroup].lineas, thisGroup);
        for(var j=0; j<Dibujo.grupos[thisGroup].lineas.length; j++){
            for(var i=0; i<paths.length; i++){
                if(Dibujo.grupos[thisGroup].lineas[j].index == i){
                    paths[i].set({
                        strokeColor: Grupo.color,
                        strokeWidth: Grupo.grosor,
                    });
                }
            }
            Dibujo.grupos[thisGroup].lineas[j].color = Grupo.color;
            Dibujo.grupos[thisGroup].lineas[j].width = Grupo.grosor;
        }
        LinesDiv();
        // dejamos cochada la casilla
        $('#GroupSelect_'+thisGroup).prop('checked', true); 
    });
    // se selecciona el grupo con el que vamos a trabajar
  $(document).on('click','.GroupSelect', function(){     
    $('.GroupSelect').prop('checked', false);
    $(this).prop('checked', true); 
    if (this.checked) {
        grupoSeleccionado = this.value;
        LinesDiv();
    }         
    });
}
////------------Stoke lines in canvas from button
function DibujarLineas(){
    var length = parseInt($("#length").val());
    if(grupoSeleccionado!=null){
        linea.x1 = vectorStart.x;
        linea.y1 = vectorStart.y;
        linea.index = index_linea;
        var from = new Point(linea.x1, linea.y1);
        var to = new Point(linea.x2, linea.y2);
        if(!isNaN(length)){
            switch(grados_actuales){
                case 0 :
                    to = new Point((linea.x1 + length), linea.y2);
                break;
                case 45 :
                    to = new Point((linea.x1 + (length/1.41479)), (linea.y1 + (length/1.41479)));
                break;
                case 90 :
                    to = new Point(linea.x2, (linea.y1 + length));
                break;
                case 135 :
                    to = new Point((linea.x1 - (length/1.41479)), (linea.y1 + (length/1.41479)));
                break;
                case 180 :
                    to = new Point((linea.x1 - length), linea.y2);
                break;
                case -45 :
                    to = new Point((linea.x1 + (length/1.41479)), (linea.y1 - (length/1.41479)));
                break;
                case -90 :
                    to = new Point(linea.x2, (linea.y1 - length));
                break;
                case -135 :
                    to = new Point((linea.x1 - (length/1.41479)), (linea.y1 - (length/1.41479)));
                break;
                case -180 :
                    to = new Point((linea.x1 - length), linea.y2);
                break;
            }
        }
        savePath = new Path.Line(from,to);
        savePath.strokeWidth= Dibujo.grupos[grupoSeleccionado].grosor;
        savePath.strokeColor = Dibujo.grupos[grupoSeleccionado].color;
        savePath.miterLimit = 30;
        linea.color = Dibujo.grupos[grupoSeleccionado].color;
        linea.tamano = Math.floor(savePath.length);
        var localine = CloneLine(linea);
        Dibujo.grupos[grupoSeleccionado].lineas.push(localine);
        TextForLength(savePath);
    }
}
/// write line length on canvas
function TextForLength(path){
    // We're going to be working with a half of the length
    // of the path as the offset:
    var offset = path.length / 2;
    // Find the point on the path:
    var point = path.getPointAt(offset);
    var text = new PointText(new Point(point));
    index_linea++;
    text.justification = 'right';
    text.fillColor = 'black';
    text.content = Math.floor(parseInt(path.length));
    path.onMouseDown = function(event) {
        if (path.selected == true) {
            text.selected = false;
            path.selected = false;
        }else{
            text.selected = true;
            path.selected = true;
        }
    }
    text.onMouseDown = function(event) {
        if (path.selected == true) {
            text.selected = false;
            path.selected = false;
        }else{
            text.selected = true;
            path.selected = true;
        }
    }
    path.onMouseDrag = function(event) {
        if(MoveLineAssitant == true){
            path.position += event.delta;
            text.position += event.delta;
            var cookie = JSON.stringify(Dibujo);
            setCookie("ML-PLAk-CAD",cookie, 2);
        }
    }  
    text.onMouseDrag = function(event) {
        if(MoveLineAssitant == true){
            path.position += event.delta;
            text.position += event.delta;
            var cookie = JSON.stringify(Dibujo);
            setCookie("ML-PLAk-CAD",cookie, 2);
        }
    }            
    paths.push(path);
    textos.push(text);
    var cookie = JSON.stringify(Dibujo);
    setCookie("ML-PLAk-CAD",cookie, 1/2);
    LinesDiv();
}
//////////////////////////////////////////////////////////////////////////////////
//----------------Clone Object to create a new reference
function CloneLine(OneLine) {
    var clone ={};
    for( var key in OneLine ){
        if(OneLine.hasOwnProperty(key)){ //ensure not adding inherited props
            clone[key]=OneLine[key];
        }
    }
    return clone;
}
////////////////////////////////////////////////////////////////////////////////
//------------ undo function
function undo() {
    var path_to_r = paths.pop();
    paths.splice(index_linea--, 1);
    path_to_r.remove();
    var text_to_r = textos.pop();
    textos.splice(index_linea--, 1);
    text_to_r.remove();
}
/*
*       Aqui hay dos funciones porque el objeto que se obtiene desde la base de datos tiene un par de indices mas que el que retorna la cookie
        Esto es porque el objeto de la db es transformado de un array asociativo de php
 */
///// si el objeto no esta en formato JSON directamente pero viene de php
function LoadDesignCADFromDB(Design){
    //entramos al objeto
    $.each(Design, function( index, col ) {
        if(index == 0){
            //tomamos los datos del dibujo
            Dibujo.Nombre_Dibujo = col.Nombre_Dibujo;
            Dibujo.User = col.User;
        }else if(index == 1){
            // relacionamos cada grupo con sus lineas
            var index_temp = 0
            $.each(col, function( i_g, grupo ) {
                Dibujo.grupos[index_temp] = CloneLine(grupo);
                Dibujo.grupos[index_temp].lineas = [];
                // entramos al objeto de todas las lineas
                    $.each(Objeto_A_Usar[2], function( i_l, lineas ) {
                        //vamos linea por linea
                        var i=0;
                            $.each(lineas, function( i_l, linea ) {
                                //ponemos cada linea por cada grupo
                                    if(linea.idGrupo == grupo.id){
                                        Dibujo.grupos[index_temp].lineas[i] = CloneLine(linea);
                                        strokePath(i,linea.x1,linea.y1,linea.x2,linea.y2,linea.color,linea.width);
                                    }
                                    i++;
                            });
                    });
                GroupDiv(index_temp);
                index_temp++;
            });
        }
    });
}
///// si el objeto esta en JSON guardado en el explorador como en una cookie
function LoadDesignCADFromObject_JSON(Design){
    if(Design !=null){
        //entramos al objeto
        //tomamos los datos del dibujo
        Dibujo.Nombre_Dibujo = Design.Nombre_Dibujo;
        Dibujo.User = Design.User;
        // relacionamos cada grupo con sus lineas
        var index_temp = 0;
        $.each(Design.grupos, function( i_g, grupo ) {
            Dibujo.grupos[index_temp] = CloneLine(grupo);
            Dibujo.grupos[index_temp].lineas = [];
            // entramos al objeto de todas las lineas
            $.each(grupo.lineas, function( i_l, linea ) {
                //vamos linea por linea
                //ponemos cada linea por cada grupo
                Dibujo.grupos[index_temp].lineas[i_l] = CloneLine(linea);
                strokePath(i_l,linea.x1,linea.y1,linea.x2,linea.y2,linea.color,1);
            });
            groupid++;
            GroupDiv(index_temp);
            index_temp++;
        });
    }
}
//-----stroke path 
function strokePath(index,x1,y1,x2,y2,color,width){
    var path_to_stroke = new Path();
    path_to_stroke.add(new Point(x1, y1));
    path_to_stroke.add(new Point(x2, y2));
    path_to_stroke.strokeColor = color;
    path_to_stroke.strokeWidth = width;
    paths[index]=path_to_stroke;
    paths[index].onMouseDown = function(event) {
        if(this.selected != true){
            this.selected = true;
        }
    }
    paths[index].onMouseUp = function(event) {
        if(this.selected == true){
            this.selected = false;
        }
    }
    paths[index].onMouseDrag = function(event) {
        paths[index].position += event.delta;
        var cookie = JSON.stringify(Dibujo);
        setCookie("ML-PLAk-CAD",cookie, 2);
        paths[index]=paths[index];
    }
    TextForLength(paths[index]);
    LinesDiv();
}
//----------------------------zoom
/**Aqui dentro tambien se gestiona la funcionalidad de poner mas gruesas o mas delgadas las lineas en zoom o dezoom */
////-------------------------------
if (canvas.addEventListener)
{
    // IE9, Chrome, Safari, Opera
    canvas.addEventListener("mousewheel", MouseWheelHandler, false);
    // Firefox
    canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}
// IE 6/7/8
else
{
    canvas.attachEvent("onmousewheel", MouseWheelHandler);
}
function changeZoom(oldZoom, delta, c, p) {
        var factor;
        var newZoom;
        factor = 1.05;
        if (delta > 0) {
            newZoom = oldZoom * factor;
            for(var i=0; i<paths.length; i++){
                if(paths[i].strokeWidth>1){
                   new_w= paths[i].strokeWidth / 1.05;
                }else{
                    new_w = 1;
                }
                paths[i].set({
                    strokeWidth: new_w
                });
                Dibujo.grupos[grupoSeleccionado].grosor = new_w;
            }
        }
        if (delta < 0) {
            newZoom = oldZoom / factor;
            for(var i=0; i<paths.length; i++){
                /* this is to limit the width of the stroke on dezoomming, if you want to set it upper, just change the 3500  */
                if(paths[i].strokeWidth<200 && newZoom < 1){
                    new_w= paths[i].strokeWidth * 1.05;
                }else if (newZoom < 1){
                    new_w = 350;
                }
                paths[i].set({
                    strokeWidth: new_w
                });
                Dibujo.grupos[grupoSeleccionado].grosor = new_w;
            }
        }
        beta = oldZoom / newZoom;
        p.add(new Point(7.5, 7.5));
        pc = p.subtract(c);
        a = p.subtract(pc.multiply(beta)).subtract(c);
        return [newZoom, a];
      };   
function MouseWheelHandler(e)
{
    // cross-browser wheel delta
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    var mousePosition = new paper.Point(e.offsetX, e.offsetY);
    var viewPosition = view.viewToProject(mousePosition);
    _ref1 = changeZoom(view.zoom, delta, view.center, viewPosition);
    var newZoom = _ref1[0];
    var offset = _ref1[1];
    view.zoom = newZoom;           
    view.center = view.center.add(offset);        
    return false;
}
////////////////////////////
////--------- Control del centro del lienzo con el teclado
$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
            var center = new Point(paper.view.center.x - 10, paper.view.center.y);
            paper.view.center = center;
        break;

        case 38: // up
            var center = new Point(paper.view.center.x, paper.view.center.y - 10);
            paper.view.center = center;
        break;

        case 39: // right
            var center = new Point(paper.view.center.x + 10, paper.view.center.y);
            paper.view.center = center;
        break;

        case 40: // down
            var center = new Point(paper.view.center.x, paper.view.center.y + 10);
            paper.view.center = center;
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
/// Cookies para cargar el dibujo en caso de defecto
function setCookie(cname, cvalue, exdays) {
var d = new Date();
d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
var expires = "expires="+d.toUTCString();
document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
    c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
    }
}
return "";
}

function checkCookie() {
var cookie = getCookie("ML-PLAk-CAD");
if (cookie != "") {
    $( ".Design" ).css("display", 'inline');
    cookie = read_cookie("ML-PLAk-CAD");
    LoadDesignCADFromObject_JSON(cookie);
} else {
    cookie = JSON.stringify(Dibujo);
    if (cookie != "" && cookie != null) {
    setCookie("ML-PLAk-CAD", cookie, 365);
    }
}
} 

function read_cookie(name) {
var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
result && (result = JSON.parse(result[1]));
return result;
}

