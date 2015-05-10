$("#floorplanjson").fileinput({
    allowedFileExtensions: ["json"],
    showUpload: false
});
$("#x3dmodel").fileinput({
    allowedFileExtensions: ["x3d"],
    showUpload: false
});
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

$('#sensorcomparison #aggregation .active input').val();

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