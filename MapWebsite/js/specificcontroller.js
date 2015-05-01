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
$('#submitFiles').click(function() {
    if ((typeof $('#floorplanjson')[0].files[0].name !== 'undefined') &&
            endsWith($('#floorplanjson')[0].files[0].name, '.json')) {
        var data = new FormData();

        var floorplanjson = $('#floorplanjson')[0].files;
        data.append('floorplanjson', floorplanjson[0]);

        if ((typeof $('#x3dmodel')[0].files[0].name !== 'undefined') &&
                endsWith($('#x3dmodel')[0].files[0].name, '.x3d')) {
            var x3dmodel = $('#x3dmodel')[0].files;
            data.append('x3dmodel', x3dmodel[0]);
        }

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
    }
    return false;
});


