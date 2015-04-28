$("#floorplanjson").fileinput({
    allowedFileExtensions: ["json"],
    showUpload: false
});
$("#x3dmodel").fileinput({
    allowedFileExtensions: ["json"],
    showUpload: false
});

$('#submitFiles').click(function() {
    var data = new FormData();
    var file = $('#floorplanjson')[0].files;
    data.append('floorplanjson', file[0]);
    var file = $('#x3dmodel')[0].files;
    data.append('x3dmodel', file[0]);
    $.ajax({
        url: '/api/photo',
        type: 'POST',
        data: data,
        async: false,
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        success: function(response) {
            console.log(response);
        }
    });
    return false;
});


