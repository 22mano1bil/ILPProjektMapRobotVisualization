$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/init',
        dataType: 'json',
        success: function(json) {
            console.log(json);
            initGroupAndFloors(json);
        }
    });
});

var initJSON;
function initGroupAndFloors(json){
    initJSON = json;
    updateGroups();
}
function updateGroups(){
    if(initJSON['groups'] != null){
        var groups = $('#groupname');
        groups.find('option').remove();
        $.each(initJSON['groups'], function(i, v) {
            groups.append("<option value=" + v['_id'] + ">" + v['groupname'] + "</option>");
           
        });
        groups.selectpicker('refresh');
        
        updateSzenarios();
    }  
}
$('#groupname').on('change', function(){
    updateSzenarios();
});
function updateSzenarios(){
    if(initJSON['szenarios'] != null){
        var groupid = $('#groupname').find('option:selected').val();
        var szenarios = $('#szenarioname');
        szenarios.find('option').remove();
        $.each(initJSON['szenarios'], function(i, v) {
            if (v['_group_id'] == groupid){
                szenarios.append("<option value=" + v['_id'] + ">" + v['szenarioname'] + "</option>");
            }
        });
        szenarios.selectpicker('refresh');
    }
}

////$("#floorplanjson").fileinput({
//    allowedFileExtensions: ["json"],
//    showUpload: false
//});
//$("#x3dmodel").fileinput({
//    allowedFileExtensions: ["x3d"],
//    showUpload: false
//});
//function endsWith(str, suffix) {
//    return str.indexOf(suffix, str.length - suffix.length) !== -1;
//}

$('#createwatch').click(function() { 
    var lastmodi = $(this).find('.active input').val();
    if (lastmodi=='create'){
    $('#create').hide();
    $('#watch').show();
    }
    if (lastmodi=='watch'){
    $('#watch').hide();
    $('#create').show();
    }    
});



/*deprecated since upload isn't working anymore with express.io*/
$('#submitFiles').click(function() {
    if ((typeof $('#floorplanjson')[0].files[0].name !== 'undefined') &&
            endsWith($('#floorplanjson')[0].files[0].name, '.json')) {
        upload();
//        var data = new FormData();
//
//        var floorplanjson = $('#floorplanjson')[0].files;
//        data.append('floorplanjson', floorplanjson[0]);
//
//        if ((typeof $('#x3dmodel')[0].files[0].name !== 'undefined') &&
//                endsWith($('#x3dmodel')[0].files[0].name, '.x3d')) {
//            var x3dmodel = $('#x3dmodel')[0].files;
//            data.append('x3dmodel', x3dmodel[0]);
//        }
//
//        $.ajax({
//            url: '/api/photo',
//            type: 'POST',
//            data: data,
//            async: true,
//            cache: false,
//            contentType: false,
//            enctype: 'multipart/form-data',
//            processData: false,
//            success: function(response) {
//            console.log(response);
//            }
//        });
//        console.log('Uploaded');
    }
    return false;
});
$('#submitFloormapJSON').click(function() {
    if ((typeof $('#floorplanjson')[0].files[0].name !== 'undefined') &&
            endsWith($('#floorplanjson')[0].files[0].name, '.json')) {
        var data = new FormData();

        var floorplanjson = $('#floorplanjson')[0].files;
        data.append('floorplanjson', floorplanjson[0]);
        console.log(floorplanjson);
        $.ajax({
            url: '/api/photo',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            success: function(response) {
            console.log(response);
            }
        });
    }
    return false;
});

   var client = new XMLHttpRequest();
  
   function upload() 
   {
        var data = new FormData();

        var floorplanjson = $('#floorplanjson')[0].files;
        data.append('floorplanjson', floorplanjson[0]);
        console.log(floorplanjson);

      client.open("post", "/api/photo", true);
      client.setRequestHeader("Content-Type", "multipart/form-data");
      client.send(data);  /* Send to server */ 
   }
     
   /* Check the response status */  
//   client.onreadystatechange = function() 
//   {
//      if (client.readyState == 4 && client.status == 200) 
//      {
//         alert(client.statusText);
//      }
//   }
