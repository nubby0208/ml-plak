
$('#piece-scale').on('change', function (){
    tool.setPieceScale(this.value);
});


$('#fixed-camera-check').on('change', function (){
    tool.toggleFixedCamera(this.checked);
});

$('#meshes-visibility-check').on('change', function (){
    tool.togglePiecesVisibility(!this.checked);
});

$('#edge-color').on('change', function (){
    tool.setEdgeColor(this.value.replace('#','0x'));
});

$('#input-light-bias').on('change', function (evt){
    tool.room.light.shadow.bias = $(evt.currentTarget).val() ;
});

$('#edit-position-button').on('click', function(){
  if ($('#edit-position-button').text().trim() == 'Mover' ){
    editor.startDragModule();
  } else {
    editor.stopDragModule();
  }
});

$('#add-point-1').on('click', function(){
   editor.startAddingDistancePointToPiece("A");
});

$('#add-distance-btn').on('click', function(){
  editor.addDistance();
});

$('#add-point-2').on('click', function(){
  editor.startAddingDistancePointToPiece("B");
});

$("#tab-distance-streight-line").on("click", function(e) {
  if ($(this).hasClass("disabled")) {
    e.preventDefault();
    return false;
  }
});

$('#edit-rotation-button').on('click', function(){
  if ($('#edit-rotation-button').text().trim() == 'Rotar' ){
    editor.startRotationModule();
  } else {
    editor.stopRotationModule();
  }
});

$('#editor-clear-selection').on('click', function(){
  editor.clearSelection();
});

$("#distance-fixed-x").on('change', () => editor.updateFixedX());
$("#distance-fixed-y").on('change', () => editor.updateFixedY());
$("#distance-fixed-z").on('change', () => editor.updateFixedZ());

$('#btn-export').on('click', function(){
  $("#models-load-tab .spinner").show();
  $("#models-load-tab .content").hide
  tool.exportToObj.call(tool, filename, function(){
    $("#models-load-tab .spinner").hide();
    $("#models-load-tab .content").show();
  });
});

$('#btn-export-dae').on('click', function(){
  $("#models-load-tab .spinner").show();
  $("#models-load-tab .content").hide();
  tool.exportToObjDAE.call(tool, filename, function(){
    $("#models-load-tab .spinner").hide();
    $("#models-load-tab .content").show();
  });
});

$('#btn-export-img').on('click', function(){
  var img = tool.exportIMG.call(tool, filename);
});

$('#btn-export-bd').on('click', function(){

  var img = tool.getCurrentIMG.call(tool);


  //console.log(proyecto_name);
  uploadImageServer(filename, proyecto_name, img);//app.js


  var alert = '<div class="alert alert-success alert-dismissible">';
  alert += ' <a iD="alertClose" href="#" class="close">&times;</a>';
  alert += '<strong>Success!</strong> La Imagen Fue Exportada Satisfactoriamente';
  alert += '</div>';
  $("#alert_export").empty();
  $("#alert_export").append(alert);

  $("#alertClose").click(function(){
      $("#alert_export div").alert("close");
  });

  setInterval(function(){  $("#alertClose").click(); }, 5000);

});

//--- codigo muerto?
$('#models-table tbody').on('change', 'tr td input, tr td select', updateModel);

$('#models-table tbody').on('click', '.btn-remove-model', function(){
  var search = $(this).parentsUntil('tbody');
  var row = $(search[search.length-1]);
  var tag = $(row.children()[0]).html();
  tool.removeModel(tag);
  row.remove();
  $('#'+tag+'Tab').remove();
  $('#nav-'+tag).remove();
});
//--

$('#input-main-light').on('change', function(evt){
  tool.setLightIntensity($(evt.target).val());
});


$('.viewer-options').on('change', 'input', function(){
  editor.updateViewer();
})

$('.camera-view-option').change(function(evt){
  var value = $(evt.currentTarget).is(':checked');
  $('.camera-view-option').removeProp('checked');
  if (value){
    $(evt.currentTarget).prop('checked', 'checked');
  }
  editor.updateCamera();
})

$('#btn-create-room').on('change', function (evt){
  if ($(this).is(':checked')){
    var params = {};
    var w = $("#input-room-width").val();
    var h = $("#input-room-height").val();
    var l = $("#input-room-length").val();
    params.wallColor  = $('#input-wall-color').val();
    params.ceilColor  = $('#input-ceil-color').val();
    params.floorColor = $('#input-floor-color').val();
    tool.createRoom(w,h,l,params,true);
    $("#input-main-light").val(0.5);
    $("#input-main-light").trigger('change');
    $('#room-attributes').show();
  }
  else{
    $('#room-attributes').hide();
    tool.removeRoom();
  }
});


$('#btn-add-room-element').on('click', function (){
  if (!tool.room){
    $("#btn-create-room").trigger("click");
  }
  var template = roomTable.find(".row-template")[0];
  var newRow = $(template).clone();
  newRow.attr('tag', stringGen(10))
  newRow.removeClass("row-template");
  newRow.show();
  var typeInput = newRow.children("td:first");
  typeInput.html($("#object-editor-select").val());
  roomTable.append(newRow);
  $('#room-table tbody tr:last td:nth-child(2) input').trigger('change');

});

$('#room-table').on('click', '.btn-remove-room-element, .btn-remove-room-element span', function (evt){
  var parents = $(evt.target).parentsUntil("tbody");
  var row = $(parents[parents.length-1]);
  var t = row.attr('tag');
  tool.removeRoomElement( { tag : t } );
  row.remove();
});

$('#room-table').on('change', 'tbody tr td input', updateRoomElement);

// room update events
$('#input-room-width, #input-room-height, #input-room-length').on('change', function (){
  var w = $("#input-room-width").val()
  var h = $("#input-room-height").val()
  var l = $("#input-room-length").val()
  tool.updateRoom({dimension:{
    width: w,height:h,length:l,
  }})
});

$('#input-wall-color, #input-ceil-color, #input-floor-color, #input-light-color, #input-light-intensity').on('change', function (){
  var wc = $("#input-wall-color").val()
  var fc = $("#input-floor-color").val()
  var cc = $("#input-ceil-color").val()
  var lightColor = $("#input-light-color").val()
  var lightIntensity = $("#input-light-intensity").val()
  tool.updateRoom({
    color:{
      wall: wc.replace("#", "0x"),
      floor: fc.replace("#", "0x"),
      ceil: cc.replace("#", "0x"),
    },
    light:{
      color: lightColor.replace("#", "0x"),
      intensity: lightIntensity,
    }
  })
});


$('#username').on('change', function(){

  var username = $(this).val();
  window.localStorage.setItem('user3d', JSON.stringify(username) )
  window.location.reload()

});

//------------------------- Marcadores -------------------------
// Eventos relacionados con los marcadores de texto.
//
//

$('#btn-add-text-marker').on('click',function(event){
  $('#markerEditorModal').modal('show');
});

$('#addMarkerTo3dView').on('click',function(event){

  $('#markerEditorModal').modal('hide');

  var text  = $('#markerText').val();
  var color = $('#markerColor').val();
  var size  = $('#markerTextSize').val();

  if($.isNumeric(size)){
    size = parseInt(size,10);
  }

  if(size < 10 || size > 250){
    size = 100;
  }

  if( (!text || $.trim(text).length === 0 ) ){
    text = "No asignado";
  }

  text = $.trim(text);

  if( (!color || $.trim(color).length === 0 ) ){
    color = "#00ff00";
  }else if ( !( /^#[0-9A-F]{6}$/i.test('#aabbcc') ) ){
    //solo se usan colores con 7 caracteres.
    color = "#00ff00";
  }

    $( "#viewer" ).focus();
    mlPlakMarkers.beginMarkerCreationProcess(text,size,color);
});


$('#markerEditorModal').on('hidden.bs.modal', function (e) {
   //console.log("Modal de marcadores cerrado");
})


$('#btn-move-text-marker').on('click',function(event){
    mlPlakMarkers.activateMouseHelperDrag();
});

$('#btn-remove-text-marker').on('click',function(event){
  mlPlakMarkers.beginMArkerDetetionProcess();
});


$('#scaleOnExport').change(function() {
  var b = $(this).prop('checked');
  tool.scaleOnExport = b;
});

$('#toggleMarkerVisibility').change(function() {
  var b = $(this).prop('checked');
  mlPlakMarkers.toggleMarkerVisibility(b);
});

$('#btn-save-scene').click(function() {
  appSaveCurentUserProjectScene();
});

$('#btn-load-scene').click(function(){
  appLoadCurrentUserProjectScene();
});

$('#btn-live-data').change(function() {
  var b = $(this).prop('checked');
  activateLiveData(b);
});

$("#captionText").on("change keyup paste",function() {
   tool.hud.setBottomCaptionText($(this).val().trim());
});

$('#clearCaption').click(function(){
  $("#captionText").val('');
  $("#captionText").change();
});

$("#input-caption-text-color").on('change', function (){
    tool.hud.setCaptionTextColor($(this).val().trim());
});

$("#input-caption-background-color").on('change', function (){
    tool.hud.setCaptionBackgroundColor($(this).val().trim());
});

$("#input-caption-background-opacity").on('change', function (){
    tool.hud.setCaptionOpacity($(this).val().trim());
});

$("#input-caption-text-size").on('change', function (){
    tool.hud.setCaptionTextSize(parseInt($(this).val().trim(),10));
});

$("#input-caption-offset").on('change', function (){
    tool.hud.setCaptiontextVerticalOffset(parseInt($(this).val().trim(),10));
});
