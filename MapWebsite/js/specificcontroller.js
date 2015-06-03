
function initSzenariosHTML(json){
    var initJSON = json;
    if(initJSON['szenarios'] != null){
        var szenarios = $('#szenarioname');
        szenarios.find('option').remove();
        $.each(initJSON['szenarios'], function(i, v) {
                szenarios.append("<option value=" + v['_id'] + ">" + v['szenarioname'] + "</option>");
        });
        szenarios.selectpicker('refresh');
    }
}

function initFilesHTML(json){
    if(json['floorplanJSON'] != null){
        var floorplanJSONselect = $('#downloadFloorplanJSONSelect');
        floorplanJSONselect.find('option').remove();
        $.each(json['floorplanJSON'], function(i, v) {
            floorplanJSONselect.append("<option value=" + v + ">" + v + "</option>");
        });
        floorplanJSONselect.selectpicker('refresh');
    }  
    if(json['modelX3D'] != null){
        var modelX3Dselect = $('#downloadModelX3DSelect');
        modelX3Dselect.find('option').remove();
        $.each(json['modelX3D'], function(i, v) {
            modelX3Dselect.append("<option value=" + v + ">" + v + "</option>");
        });
        modelX3Dselect.selectpicker('refresh');
    }     
}

$("#floorplanjson").fileinput({
    allowedFileExtensions: ["json"],
    uploadUrl: "/uploadFloorplanJSON", // server upload action
    uploadAsync: true,
    maxFileCount: 1
});
$("#x3dmodel").fileinput({
    allowedFileExtensions: ["x3d"],
    uploadUrl: "/uploadModelX3D", // server upload action
    uploadAsync: true,
    maxFileCount: 1
});

$('#downloadModelX3D').click(function () {
    var modelX3D = $('#downloadModelX3DSelect').find('option:selected').val();
    console.log(modelX3D);
    $('#downloadModelX3D').attr('download', modelX3D).attr('href','uploads/modelX3D/'+modelX3D);
});

$('#downloadFloorplanJSON').click(function () {
    alert('lklkl');
    var floorplanJSON = $('#downloadFloorplanJSONSelect').find('option:selected').val();
    console.log(floorplanJSON);
    $('#downloadFloorplanJSON').attr('download', floorplanJSON).attr('href','uploads/floorplanJSON/'+floorplanJSON);
});