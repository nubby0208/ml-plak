var values = {
    fixLength: false,
    fixAngle: false,
    showCircle: false,
    showAngleLength: true,
    showCoordinates: false
};
////////////////////////////////////////////////////////////////////////////////
// Variables
var vectorStart, vector, vectorPrevious;
var vectorItem, items, dashedItems;
var new_w = 0.75;
/// Objetos
var Dibujo = {
    Nombre_Dibujo : null,
    //User : myUser,
    grupos : [],
    texts : [],
    guides :[]
};
var Grupo ={
    nombre_grupo : "",
    color : "#000000",
    paths : [],
    texts_g : [],
}
var grupoSeleccionado = null;
var grados_actuales = 0;
// Variables para los asistentes
var DegreeAsistant = true;
var MoveLineAssitant = false;
var UnionAsistant= true; 
var txtPosition = 0; 
var CopyAssitant = false;
var GuideAssistant = false;
var MoveOnX = false;
var MoveOnY = false;
///////////////////Local storage of Design
var storedDesign = window.localStorage.getItem("ML-PLAk-CAD"); 
    if(storedDesign != null){ 
        var newDesign= JSON.parse(storedDesign);
        SetDesign(newDesign);
    }
//////////
var Temporal_Txts =[]
function init_Texts() {
    if(storedDesign == null){ 
        var  t1 = new PointText( new Point(view.center - 50));
        t1.content = "Bienvenido! Aqui algunas instrucciones: ";
        t1.justification = 'center';
        t1.fillColor = 'black';
        var  t2 = new PointText( new Point(view.center - 30));
        t2.content = "Para comenzar crea un nuevo grupo en el boton de la derecha :)";
        t2.justification = 'center';
        t2.fillColor = 'black';
        Temporal_Txts.push(t1,t2);
    }
}; 
init_Texts();

/// Cargar la cookie si existe en el explorador al iniciar
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
    } ;
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
        for(var i=0; i<Dibujo.grupos[grupoSeleccionado].paths.length;i++){
            for(var j=0; j<Dibujo.grupos[grupoSeleccionado].paths[i].children.length;j++){
                if(Dibujo.grupos[grupoSeleccionado].paths[i].children[j].contains(vectorItem.children[0].lastSegment.point)){
                    if ( j==0 || j ==2){
                        if (j ==0){
                            putLinesTogether(Dibujo.grupos[grupoSeleccionado].paths[i].children[j], 1);
                        }else{
                            putLinesTogether(Dibujo.grupos[grupoSeleccionado].paths[i].children[j], 1);
                        }
                    }
                }else if(Dibujo.grupos[grupoSeleccionado].paths[i].children[j].contains(vectorItem.children[0].firstSegment.point)){
                    if ( j==0 || j ==2){
                        if (j ==0){
                            putLinesTogether(Dibujo.grupos[grupoSeleccionado].paths[i].children[j], 0);
                            vectorStart.x = Dibujo.grupos[grupoSeleccionado].paths[i].children[j].position.x;
                            vectorStart.y = Dibujo.grupos[grupoSeleccionado].paths[i].children[j].position.y;
                        }else{
                            putLinesTogether(Dibujo.grupos[grupoSeleccionado].paths[i].children[j], 0);
                            vectorStart.x = Dibujo.grupos[grupoSeleccionado].paths[i].children[j].position.x;
                            vectorStart.y = Dibujo.grupos[grupoSeleccionado].paths[i].children[j].position.y;
                        }
                    }
                }
            }
        }
    }
    $('#Mesure').val(Math.floor(vectorItem.children[0].length));
}
function putLinesTogether(pathCircle, segmentIndex){
    vectorItem.children[0].insert(segmentIndex, pathCircle.position);
    vectorItem.children[0].removeSegment(segmentIndex + 1);
    if(vectorItem.children[1]){
        vectorItem.children[1].remove();
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
    }
}
////////////////////////////////////////////////////////////////////////////////
// Mouse Handling
/**Estas on funciones por defecto de manejo del mouse dentro de paperjs */
var dashItem;
function onMouseDown(event) {
        if (event.modifiers.control === false && Dibujo.grupos[grupoSeleccionado] != null){
            var end = vectorStart + vector;
            var create = false;
             if (vector && (event.modifiers.option || end && end.getDistance(event.point) < 10)) {
                create = false;
            } else {
                vectorStart = event.point;
            }
            processVector(event, true);
        }
        txtPosition = event.point;
}
function onMouseDrag(event) {
    if (event.modifiers.control === false && Dibujo.grupos[grupoSeleccionado] != null){
            if (!event.modifiers.shift && values.fixLength && values.fixAngle){
                vectorStart = event.point;
            }
            processVector(event, event.modifiers.shift);
    }else{
        var e = window.event || e;
        view.center -= event.delta/1.1;
        event.stopPropagation()
    }
}
function onMouseUp(event) {
    if (event.modifiers.control === false && Dibujo.grupos[grupoSeleccionado] != null){
            processVector(event, false);
            if (dashItem) {
                dashItem.dashArray = [1, 2];
                dashItem = null;
            }
            vectorPrevious = vector;
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
    if (MoveLineAssitant == false && DegreeAsistant == true) {
        MoveLineAssitant = true;
        $('#extraOptions').css("display", "none");
        $('#MovementOptions').css("display", "flex");
        $('#line_menu').css("width", "15%");
        GuideAssistant = false;
        CopyAssitant = false;
    }else{
        MoveLineAssitant = false;
        if(DegreeAsistant == false) {
            $('#MovementOptions').css("display", "nonde");
        }
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
$( '#Eraser' ).click(function() {
    for(var j=0; j<Dibujo.grupos.length; j++){ 
        for(var i=0; i< Dibujo.grupos[j].paths.length; i++){
            if(Dibujo.grupos[j].paths[i].selected == true){
                Dibujo.grupos[j].paths[i].remove();
                Dibujo.grupos[j].paths.splice(i, 1);
            }
        }
        for(var i=0; i< Dibujo.grupos[j].texts_g.length; i++){
            if(Dibujo.grupos[j].texts_g[i].selected == true){
                Dibujo.grupos[j].texts_g[i].remove();
                Dibujo.grupos[j].texts_g.splice(i, 1);
            }
        }
        for(var i=0; i< Dibujo.texts.length; i++){
            if(Dibujo.texts[i].selected == true){
                Dibujo.texts[i].remove();
                Dibujo.texts.splice(i, 1);
            }
        }
    }
    LinesDiv();
    SetLocalStorage(Dibujo, "ML-PLAk-CAD");
});
$( ".Design" ).click(function() {
    DibujarLineas(); 
    $("#length").focus();
    LinesDiv();     
});
//////////////////////////////-----------------------------
//----- creacion de grupos y gestion de grupos
$( "#Group" ).click(function() {
    if(Temporal_Txts[0] && Temporal_Txts[1]){
        Temporal_Txts[0].content = " Ahora selecciona las caracteristicas de la linea que pertenece al grupo y presiona editar!";
        Temporal_Txts[1].content = "No olvides darle nombre a tu grupo ;)";
    }
    $( ".Design" ).css("display", 'inline');
    var  newgroup = $.extend(true,{},Grupo);
    Dibujo.grupos.push(newgroup);
    /// se crea el html de  un nuevo grupo
    var g_id = Dibujo.grupos.length - 1;
    GroupDiv(g_id);
    LinesDiv();
    $("#length").focus();    
});
/// clear canvas completo con un boton*
$("#clear_canvas").click(function(){
    clearcanvas();
    for(var i=0; i<Dibujo.texts.length; i++){
        Dibujo.texts[i].remove();
    }
    $('#group_container').empty();
    $('#Lineas').empty();
    $("#length").focus();
});
//------------ change name
$( "#name_button" ).click(function() {
    Dibujo.Nombre_Dibujo = $('#name').val();
});
//------------ Insert Txt
$( "#InsertTextBtn" ).click(function() {
    var text;
    if(txtPosition != null){
        text = new PointText(new Point(txtPosition));
    }else{
        text = new PointText(new Point(viewe.center));
    }
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
            SetLocalStorage(Dibujo, "ML-PLAk-CAD");
        }
    } 
    Dibujo.texts.push(text); 
    SetLocalStorage(Dibujo, "ML-PLAk-CAD");
    $("#length").focus();
})
// ----- Undo
$( "#Undo" ).click(function() {
    var last_id = Dibujo.grupos[grupoSeleccionado].paths.length - 1;
    Dibujo.grupos[grupoSeleccionado].paths[last_id].remove();
    last_id = Dibujo.grupos[grupoSeleccionado].texts_g.length - 1;
    Dibujo.grupos[grupoSeleccionado].texts_g[last_id].remove();
    Dibujo.grupos[grupoSeleccionado].texts_g.pop();
    Dibujo.grupos[grupoSeleccionado].paths.pop();
    LinesDiv();
    $("#length").focus();
});
//Clone paths
$( "#clone_path" ).click(function() {
    GuideAssistant = false;
    $('#extraOptions').css("display", "flex");
    $('#line_menu').css("width", "22%");
    CopyAssitant = true;
});
$( "#Guide" ).click(function() {
    CopyAssitant = false;
    $('#extraOptions').css("display", "flex");
    $('#line_menu').css("width", "22%");
    GuideAssistant = true;
});
$( "#PlusSide" ).click(function() {
    if(CopyAssitant == true){
        ClonePathBySign(-1);
    }else if(GuideAssistant == true){
        CreateGuideLineBySign(-1);
    }
});
$( "#MinusSide" ).click(function() {
    if(CopyAssitant == true){
        ClonePathBySign(1);
    }else if(GuideAssistant == true){
        CreateGuideLineBySign(1);
    }
});
$( "#MoveOnX" ).click(function() {
    if(MoveOnX == false){
        MoveOnX = true;
        MoveOnY = false;
    }
});
$( "#MoveOnY" ).click(function() {
    if(MoveOnY == false){
        MoveOnY = true;
        MoveOnX = false;
    }
});
//Download as SVG
$( "#Get_SVG" ).click(function() {
downloadAsSVG();
});
$( "#HideMenu" ).click(function() {
    $( '#line_menu' ).css("display", "none");
});
//// function para crear divs de grupos
function GroupDiv(groupid){
    $('.GroupSelect').prop('checked', false);
    grupoSeleccionado = groupid;
    $( "#group_container" ).append("<div id='group'><div class='form-control w-input group-name-container'><input type='radio' class='form-check-input GroupSelect' name='GroupSelect' id='#GroupSelect_"+groupid+"' value="+groupid+" checked><input class='group-name' placeholder='Nombre Grupo' id='name-group_"+groupid+"' value="+Dibujo.grupos[groupid].nombre_grupo+"></div><div class='group-caracts'><input id='color-line-group_"+groupid+"' class='form-control btn btn-primary color-container' type='color' value="+Dibujo.grupos[groupid].color+"><button id='Group_edit_btn_"+groupid+"' class='Group_edit btn btn-primary' value='"+groupid+"'>Editar</button></div></div>");
    // Le asignamos a grupo de base los valores dentro del div de grupo
    Dibujo.grupos[grupoSeleccionado].color = $('#color-line-group_'+grupoSeleccionado).val();
    Dibujo.grupos[grupoSeleccionado].nombre_grupo = $('#name-group_'+grupoSeleccionado).val();
    //boton para editar lineas
    $( '#Group_edit_btn_'+groupid ).click(function() {
        var thisGroup = this.value;
        //se guarda en el objeto de grupos que esta dentro del Dibujo
        Dibujo.grupos[thisGroup].color = $('#color-line-group_'+thisGroup).val();
        Dibujo.grupos[thisGroup].nombre_grupo = $('#name-group_'+thisGroup).val();
       // SetGroupValues(Grupo.color, Grupo.nombre_grupo, thisGroup);
        //CargarLineasAlCanvas(Dibujo.grupos[thisGroup].lineas, thisGroup);
        for(var j=0; j<Dibujo.grupos[thisGroup].paths.length; j++){
            Dibujo.grupos[thisGroup].paths[j].children[1].set({
                strokeColor: Dibujo.grupos[thisGroup].color,
            });
        }
        LinesDiv();
        // dejamos cochada la casilla
        $('#GroupSelect_'+thisGroup).prop('checked', true); 
        //cambiamos el texto en la pantalla
        if(Temporal_Txts[0] && Temporal_Txts[1]){
            Temporal_Txts[0].content = " Ahora Puedes Comenzar a dibujar!!";
            Temporal_Txts[1].content = "Haz click en el lienzo y luego desliza el mouse, deberas pulsar en Dibujar linea para dejar marcada la linea";
        }
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
    if(Temporal_Txts != null){
        for(var i=0; i<Temporal_Txts.length; i++){
            Temporal_Txts[i].remove();
        }
    }
    var length = parseInt($("#length").val());
    if(grupoSeleccionado!=null){
        var from = vectorItem.children[0].firstSegment.point;
        var to = vectorItem.children[0].lastSegment.point;
        if(!isNaN(length)){
            switch(grados_actuales){
                case 0 :
                    to = new Point((vectorItem.children[0].firstSegment.point.x + length), vectorItem.children[0].firstSegment.point.y);
                break;
                case 45 :
                    to = new Point((vectorItem.children[0].firstSegment.point.x + (length/1.41479)), (vectorItem.children[0].firstSegment.point.y + (length/1.41479)));
                break;
                case 90 :
                    to = new Point(vectorItem.children[0].firstSegment.point.x, (vectorItem.children[0].firstSegment.point.y + length));
                break;
                case 135 :
                    to = new Point((vectorItem.children[0].firstSegment.point.x - (length/1.41479)), (vectorItem.children[0].firstSegment.point.y + (length/1.41479)));
                break;
                case 180 :
                    to = new Point((vectorItem.children[0].firstSegment.point.x - length), vectorItem.children[0].firstSegment.point.y);
                break;
                case -45 :
                    to = new Point((vectorItem.children[0].firstSegment.point.x + (length/1.41479)), (vectorItem.children[0].firstSegment.point.y - (length/1.41479)));
                break;
                case -90 :
                    to = new Point(vectorItem.children[0].firstSegment.point.x, (vectorItem.children[0].firstSegment.point.y - length));
                break;
                case -135 :
                    to = new Point((vectorItem.children[0].firstSegment.point.x - (length/1.41479)), (vectorItem.children[0].firstSegment.point.y - (length/1.41479)));
                break;
                case -180 :
                    to = new Point((vectorItem.children[0].firstSegment.point.x - length), vectorItem.children[0].firstSegment.point.y);
                break;
            }
        }
        createPath(from, to, grupoSeleccionado);
    }   
    SetLocalStorage(Dibujo, "ML-PLAk-CAD");
}
/// Fin butons
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/// Funciones
///-----clear canvas
function clearcanvas(){
    for(var j=0; j<Dibujo.grupos.length; j++){
        for(var i=0; i< Dibujo.grupos[j].paths.length; i++){
            Dibujo.grupos[j].paths[i].remove();
        }
        for(var i=0; i< Dibujo.grupos[j].texts_g.length; i++){
            Dibujo.grupos[j].texts_g[i].remove();
        }
    }
    LinesDiv();
    localStorage.removeItem("ML-PLAk-CAD");
}
//////////////////////////////////-------------------- quede con esto, no he tocado el zoom
//----- control de lineas
function LinesDiv(){
    if(grupoSeleccionado!=null){
        $('#Lineas').empty();
            $.each(Dibujo.grupos[grupoSeleccionado].paths, function( index, path ) {
            var hexColor = rgbToHex(path.children[1].strokeColor.toCSS());
            $( "#Lineas" ).append("<div id='linea'><a class='btn btn-primary line-number'>Linea "+(index+1)+"</a><div class='group-caracts'><input id='color-line_"+index+"' class='form-control btn btn-primary color-container line-changes-table-item' type='color' value="+hexColor+"><input class='form-control w-input line-changes-table-item' value="+Math.floor(path.children[1].length)+"></div><div class='group-caracts'><button class='btn btn-primary modify_line line-changes-table-item' value='"+index+"'>Edit</button></div></div>");
            $('a').css({
                "text-decoration": "none",
                "color": "white" 
            });
            $('.modify_line').click(function(){
                var id= this.value;
                var color = $('#color-line_'+id).val();
                var strokeWidth = $('#grosor-line_'+id).val();
                    for(var i=0; i<Dibujo.grupos[grupoSeleccionado].paths.length; i++){
                        if(id == i){
                            Dibujo.grupos[grupoSeleccionado].paths[i].children[1].set({
                                    strokeColor: color,
                                    strokeWidth: strokeWidth,
                                });
                                SetLocalStorage(Dibujo, "ML-PLAk-CAD");
                        }
                    }
            });  
        });
    }
    $("#length").focus();    
}
// Transform color from RGB to HEX
function rgbToHex(color) {
    color = ""+ color;
    if (!color || color.indexOf("rgb") < 0) {
        return;
    }

    if (color.charAt(0) == "#") {
        return color;
    }

    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
        r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);

    return "#"+ (
        (r.length == 1 ? "0"+ r : r) +
        (g.length == 1 ? "0"+ g : g) +
        (b.length == 1 ? "0"+ b : b)
    );
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
            for(var i=0; i<Dibujo.grupos.length; i++){
                for(var j=0; j<Dibujo.grupos[i].paths.length; j++){
                    if(Dibujo.grupos[i].paths[j].strokeWidth>1){
                    new_w= Dibujo.grupos[i].paths[j].strokeWidth / 1.05;
                    }
                    Dibujo.grupos[i].paths[j].set({
                        strokeWidth: new_w
                    });
                    Dibujo.grupos[i].grosor = new_w;
                }
            }
            for(var i=0; i<Dibujo.guides.length; i++){
                    if(Dibujo.guides[i].strokeWidth>1){
                    new_w= Dibujo.guides[i].strokeWidth / 1.05;
                    }
                    Dibujo.guides[i].set({
                        strokeWidth: new_w
                    });
            }
        }
        if (delta < 0) {
            newZoom = oldZoom / factor;
            for(var i=0; i<Dibujo.grupos.length; i++){
                for(var j=0; j<Dibujo.grupos[i].paths.length; j++){
                    if( newZoom < 1){
                        new_w= Dibujo.grupos[i].paths[j].children[1].strokeWidth * 1.05;
                    }
                    Dibujo.grupos[i].paths[j].set({
                        strokeWidth: new_w
                    });
                    Dibujo.grupos[i].grosor = new_w;
                }
            }
            for(var i=0; i<Dibujo.guides.length; i++){
                if(Dibujo.guides[i].strokeWidth>1){
                new_w= Dibujo.guides[i].strokeWidth * 1.05;
                }
                Dibujo.guides[i].set({
                    strokeWidth: new_w
                });
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////--------- Put design Stored into canvas
function SetDesign(cookie){
    $( ".Design" ).css("display", 'inline');
    Dibujo.Nombre_Dibujo = cookie.Nombre_Dibujo;
    $.each(cookie.grupos, function( index1, grupo ) {
        var  newgroup = $.extend(true,{},Grupo);
        newgroup.nombre_grupo = grupo.nombre_grupo;
        newgroup.color = grupo.color;   
        Dibujo.grupos.push(newgroup);
        $.each(grupo.paths, function( index2, array1 ) {
            createPath(grupo.paths[index2][1].children[1][1].segments[0], grupo.paths[index2][1].children[1][1].segments[1], index1);
        });
        GroupDiv(index1);
        LinesDiv();     
    });
    $.each(cookie.guides, function( index3, guide ) {
        var point1= new Point(guide[1].segments[0][0], guide[1].segments[0][1]) ;
        var point2= new Point(guide[1].segments[1][0], guide[1].segments[1][1]) 
        CreateGuideLine(point1, point2);
    });
    $.each(cookie.texts, function( index2, texto ) {
        var matrix = new Matrix(texto[1].matrix);
        var point = new Point()
        point = point.transform(matrix);
        writeText(point, texto[1].content, texto[1].sizefont, texto[1].justification, texto[1].color)
    });
}
///------ Function to create paths
function createPath(point1, point2, idGrupo){
    var Onepath = new Path.Line(point1,point2);
    Onepath.strokeWidth= Dibujo.grupos[idGrupo].grosor;
    Onepath.strokeColor = Dibujo.grupos[idGrupo].color;
    Onepath.miterLimit = 30;
    Onepath.strokeColor = Dibujo.grupos[idGrupo].color;
    // We're going to be working with a half of the length
    // of the path as the offset:
    var offset = Onepath.length / 2;
    var Circle_r = Onepath.length / 15;
    // Find the point on the path:
    var point = Onepath.getPointAt(offset);
    var text = new PointText(new Point(point));
    text.justification = 'right';
    text.fillColor = 'black';
    text.content = Math.floor(parseInt(Onepath.length));           
    // Grupo con los paths que conforman una linea
    var PathGroup = new Group(
        new Path.Circle(Onepath.firstSegment.point, Circle_r),
        Onepath,
        new Path.Circle(Onepath.lastSegment.point, Circle_r)
    );
    PathGroup.children[1].onMouseDown = function(event) {
        if (PathGroup.children[1].selected == true) {
            text.selected = false;
            PathGroup.children[1].selected = false;
            document.getElementById('line_menu').style.display ="none";
        }else{
            unselectAll();
            PathGroup.children[1].selected = true;
            text.selected = true;
            PlaceDiv(event.clientX,event.clientY);
        }
    }
    PathGroup.children[1].onMouseDrag = function(event) {
        if(MoveLineAssitant == true){
            if(DegreeAsistant == false){
                PathGroup.children[0].position += event.delta;
                PathGroup.children[1].position += event.delta;
                PathGroup.children[2].position += event.delta;
                text.position += event.delta;
                SetLocalStorage(Dibujo, "ML-PLAk-CAD");
            }
        }
    }  
    text.onMouseDown = function(event) {
        if (PathGroup.children[1].selected == true) {
            text.selected = false;
            PathGroup.children[1].selected = false;
            document.getElementById('line_menu').style.display ="none";
        }else{
            unselectAll();
            text.selected = true;
            PathGroup.children[1].selected = true;
            PlaceDiv(event.clientX,event.clientY);
        }
    }
    text.onMouseDrag = function(event) {
        if(MoveLineAssitant == true){
            if(DegreeAsistant == false){
                PathGroup.children[0].position += event.delta;
                PathGroup.children[1].position += event.delta;
                PathGroup.children[2].position += event.delta;
                text.position += event.delta;
                SetLocalStorage(Dibujo, "ML-PLAk-CAD");
            }else{
                if(MoveOnX == true){
                    PathGroup.children[0].position.x += event.delta.x;
                    PathGroup.children[1].position.x += event.delta.x;
                    PathGroup.children[2].position.x += event.delta.x;
                    text.position.x += event.delta.x;
                    SetLocalStorage(Dibujo, "ML-PLAk-CAD");
                }else if (MoveOnY == true){
                    PathGroup.children[0].position.y += event.delta.y;
                    PathGroup.children[1].position.y += event.delta.y;
                    PathGroup.children[2].position.y += event.delta.y;
                    text.position.y += event.delta.y;
                    SetLocalStorage(Dibujo, "ML-PLAk-CAD");
                }
            }
        }
    } 
    Dibujo.grupos[idGrupo].paths.push(PathGroup);
    Dibujo.grupos[idGrupo].texts_g.push(text);
    LinesDiv();
    SetLocalStorage(Dibujo, "ML-PLAk-CAD");
}
///--------Writing txt in canvas
function writeText(point, content, sizefont, justification, color){
    var text = new PointText(new Point(point));
    text.justification = justification;
    text.fillColor = color;
    text. fontSize = sizefont;
    text.content = content;
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
            var storage = JSON.stringify(Dibujo);
            window.localStorage.setItem("ML-PLAk-CAD", storage);
        }
    }   
    Dibujo.texts.push(text); 
}
// Dibujar lineas con el enter
tool.onKeyDown = function(event) {
    if (event.key == 'enter') {
        DibujarLineas(); 
        $("#length").focus();
        LinesDiv(); 
        return false;
    }
}
/// Change local storage
function SetLocalStorage(Object, NameStorageItem){
    var storage = JSON.stringify(Object);
    window.localStorage.setItem(NameStorageItem, storage);
}
// unselectAll paths and texts
function unselectAll(){
    for(var i=0; i<Dibujo.grupos.length; i++){
        for (var j = 0; j < Dibujo.grupos[i].paths.length; j++) {
           if(Dibujo.grupos[i].paths[j].children[1].selected == true){
                Dibujo.grupos[i].paths[j].children[1].selected = false;
           }                    
        }
        for (var j = 0; j < Dibujo.grupos[i].texts_g.length; j++) {
            if(Dibujo.grupos[i].texts_g[j].selected == true){
                Dibujo.grupos[i].texts_g[j].selected = false;
            }                    
         }
    }
}
// Download as SVG 
function downloadAsSVG() {
    var fileName = "paperjs_example.svg"
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
}
function PlaceDiv(ScreenX,ScreeY) { 
    var x = ScreenX; 
    var y = ScreeY; 
    var el = document.getElementById('line_menu');
    el.style.display = 'flex'; 
    el.style.position = "absolute"; 
    el.style.left = x + 'px !imoortant'; 
    el.style.top = y + 'px !important'; 
} 
function ClonePathBySign(factor){
    for(var i=0; i<Dibujo.grupos.length; i++){
        for (var j = 0; j < Dibujo.grupos[i].paths.length; j++) {
           if(Dibujo.grupos[i].paths[j].children[1].selected == true){
                var point1 = Dibujo.grupos[i].paths[j].children[1].firstSegment.point.clone();
                var point2 = Dibujo.grupos[i].paths[j].children[1].lastSegment.point.clone();
                if(point1.y != point2.y){
                    point1.x = point1.x + (parseInt($( '#CopyDistance' ).val()) * factor);
                    point2.x =   point2.x + (parseInt($( '#CopyDistance' ).val()) * factor);
                }else if(point1.x != point2.x){
                    point1.y =  point1.y +  (parseInt($( '#CopyDistance' ).val()) * factor);
                    point2.y =  point2.y + (parseInt($( '#CopyDistance' ).val()) * factor);
                }else{
                    point1 += (parseInt($( '#CopyDistance' ).val()) * factor);
                    point2 += (parseInt($( '#CopyDistance' ).val()) * factor);
                }
                createPath(point1, point2, grupoSeleccionado);
            }                    
        }

    }
}
function CreateGuideLineBySign(factor){
    for(var i=0; i<Dibujo.grupos.length; i++){
        for (var j = 0; j < Dibujo.grupos[i].paths.length; j++) {
           if(Dibujo.grupos[i].paths[j].children[1].selected == true){
                var point1 = Dibujo.grupos[i].paths[j].children[1].firstSegment.point.clone();
                var point2 = Dibujo.grupos[i].paths[j].children[1].lastSegment.point.clone();
                if(point1.y != point2.y){
                    point1.x = point1.x + (parseInt($( '#CopyDistance' ).val()) * factor);
                    point2.x =   point2.x + (parseInt($( '#CopyDistance' ).val()) * factor);
                    point1.y = point1.y - 100000000;
                    point2.y = point2.y + 100000000;
                }else if(point1.x != point2.x){
                    point1.y =  point1.y +  (parseInt($( '#CopyDistance' ).val()) * factor);
                    point2.y =  point2.y + (parseInt($( '#CopyDistance' ).val()) * factor);
                    point1.x = point1.x - 100000000;
                    point2.x = point2.x + 100000000;
                }
                CreateGuideLine(point1, point2);
            }                    
        }
    }
}
/// Funcion para crear lineas de guia
function CreateGuideLine(point1, point2){
    var Onepath = new Path.Line(point1,point2);
    Onepath.strokeWidth= new_w;
    Onepath.strokeColor = 'red';
    //Onepath.dashArray = [50, 40];
    Dibujo.guides.push(Onepath);
    SetLocalStorage(Dibujo, "ML-PLAk-CAD");
}