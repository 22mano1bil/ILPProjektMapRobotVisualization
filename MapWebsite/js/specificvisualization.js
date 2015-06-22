var x3dscene = $('X3D scene');
var x3dscenetransform = $('X3D scene > transform > group ');
var xArray = [];
var yArray = [];
var geojsonHeight = 0.1;
var geojsonDistanceHeight = 0.1;
var geojsonWidth = 0.05;
//var geojsonHeight = 0.008;
//var geojsonWidth = 0.0000001;
var newPathRadius = 0.05;
var robotinoRadius =0.23;

function buildNewSzenario(data) {
//    console.log(data);
    var ap = x3dscenetransform.find('transform[DEF="ActualPosition"]');
    x3dscenetransform.empty();
    x3dscenetransform.append(ap);
    x3dscenetransform.append(addModelX3D(data.modelX3Dref));
    buildStartAndEndpoint(data);
    buildFloorplanJSON(data.floorplanJSONref);
}


function buildStartAndEndpoint(data) {
//    console.log('startpoint');
//    console.log(data.startpoint);
    if(typeof((data.startpoint)!=='undefined')){
        x3dscenetransform.append(zylinderWithMiddlePoint_StartAndEndpoint((data.startpoint), 'startpoint.jpg'));
        x3dscenetransform.append(changePositionOfZylinderWithMiddlePoint_ActualPosition(data.startpoint));
    }
    if(typeof((data.endpoint)!=='undefined'))
        x3dscenetransform.append(zylinderWithMiddlePoint_StartAndEndpoint((data.endpoint), 'endpoint.jpg'));
}

function buildActualPosition(data) {
    $.each(data, function(i, v) {
//        console.log(v);
        var actualPosition = v['actualPosition'];
        x3dscenetransform.append(changePositionOfZylinderWithMiddlePoint_ActualPosition(actualPosition['point']));
    }); 
}

function buildNewPath(data) {
    $.each(data, function(i, v) { 
        x3dscenetransform.find('transform[DEF="NewPath"]').find('material').attr('transparency','0.7').attr('diffuseColor','0 0 0.3');
        var newPath = v['newPath'];
        x3dscenetransform.append(sphereWithPoint_NewPath(newPath[0]));
        if(newPath.length>1){
            for (i = 0; i < newPath.length-1; i++) { 
//                console.log(zylinderWithStartpointAndEndpoint_NewPath(newPath[i],newPath[i+1]));
                x3dscenetransform.append(zylinderWithStartpointAndEndpoint_NewPath(newPath[i],newPath[i+1]));
                x3dscenetransform.append(sphereWithPoint_NewPath(newPath[i+1]));
            }
        }  
    });  
}

//auf json zugreifen
function buildFloorplanJSON(data) {
  var flickerAPI = "uploads/floorplanJSON/"+data;
  $.getJSON( flickerAPI)
    .done(function( data ) {
//       console.log(data);
//       console.log(data['features']);
       $.each(data['features'], function(i, v) {
           console.log(i);
//           if(v['properties']['value']=='limit')
//               console.log('limit');
           var polygon = v['geometry']['coordinates'][0];
           if(polygon.length>3){
                for (var i = 0; i < polygon.length-1; i++) { 
//                    console.log(polygon[i]);
                    xArray.push(polygon[i][0]);
                    yArray.push(polygon[i][1]);
//                    console.log(boxWithStartpointAndEndpoint_FloorplanPolygonLine(polygon[i],polygon[i+1]));
                    x3dscenetransform.append(boxWithStartpointAndEndpoint_FloorplanPolygonLine(polygon[i],polygon[i+1]));
               }
               var polygonDistance = buildPolygonDistance(polygon);
               for (var i = 0; i < polygonDistance.length-1; i++) { 
//                    xArray.push(polygonDistance[i][0]);
//                    yArray.push(polygonDistance[i][1]);
//                    console.log(boxWithStartpointAndEndpoint_FloorplanPolygonLine(polygon[i],polygon[i+1]));
                    x3dscenetransform.append(boxWithStartpointAndEndpoint_FloorplanPolygonDistanceLine(polygonDistance[i],polygonDistance[i+1]));
               }
            }
       });
       setSceneInTheMiddle();
    });
}

function buildPolygonDistance(polygon){
    var polygonDistance=[];
    for (var i = 0; i < polygon.length-2; i++) { 
        polygonDistance.push(getOuterPoint(polygon[i], polygon[i+1], polygon[i+2], robotinoRadius));
    }
    polygonDistance.push(getOuterPoint(polygon[polygon.length-2], polygon[0], polygon[1], robotinoRadius));
    polygonDistance.push(getOuterPoint(polygon[0], polygon[1], polygon[2], robotinoRadius));
    return polygonDistance;
}

