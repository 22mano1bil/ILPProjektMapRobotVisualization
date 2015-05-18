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
        $.ajax({
        type: 'GET',
        url: '/initFiles',
        dataType: 'json',
        success: function(json) {
            console.log(json);
            initFiles(json);
        }
    });
});
function initFiles(json){
    if(json['floorplanJSON'] != null){
        var floorplanJSONselect = $('#downloadFloorplanJSONSelect');
        floorplanJSONselect.find('option').remove();
        $.each(json['floorplanJSON'], function(i, v) {
            floorplanJSONselect.append("<option value=" + v + ">" + v + "</option>");
        });
        floorplanJSONselect.selectpicker('refresh');
    }  
    if(json['modelX3D'] != null){
        var floorplanJSONselect = $('#downloadModelX3DSelect');
        floorplanJSONselect.find('option').remove();
        $.each(json['modelX3D'], function(i, v) {
            floorplanJSONselect.append("<option value=" + v + ">" + v + "</option>");
        });
        floorplanJSONselect.selectpicker('refresh');
    }     
}
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

$("#floorplanjson").fileinput({
    allowedFileExtensions: ["json"],
    uploadUrl: "http://localhost:7088/uploadFloorplanJSON", // server upload action
    uploadAsync: true,
    maxFileCount: 1
});
$("#x3dmodel").fileinput({
    allowedFileExtensions: ["x3d"],
    uploadUrl: "http://localhost:7088/uploadModelX3D", // server upload action
    uploadAsync: true,
    maxFileCount: 1
});

$('#downloadModelX3D').click(function () {
    var modelX3D = $('#downloadModelX3DSelect').find('option:selected').val();
    console.log(modelX3D);
    $.fileDownload('uploads/modelX3D/'+modelX3D);
});

$('#downloadFloorplanJSON').click(function () {
    var floorplanJSON = $('#downloadFloorplanJSONSelect').find('option:selected').val();
    console.log(floorplanJSON);
    $.fileDownload('uploads/modelX3D/'+floorplanJSON);
});