var x3dscene = $('X3D scene');
var x3dscenetransform = $('X3D scene > transform > group ');
var xArray = [];
var yArray = [];
var geojsonHeight = 0.3;
var geojsonWidth = 0.05;
var newPathRadius = 0.05;
var geojsonSpace = 0.2;
var robotinoRadius =0.4;

function buildNewSzenario(data) {
    console.log(data);
    var ap = x3dscenetransform.find('transform[DEF="ActualPosition"]');
    x3dscenetransform.empty();
    x3dscenetransform.append(ap);
    x3dscenetransform.append(addModelX3D(data));
    buildStartAndEndpoint(data);
    buildFloorplanJSON(data);
}

function setSceneInTheMiddle(){
    console.log('hiiii');
    console.log((Math.max.apply(Math,xArray)-Math.min.apply(Math,xArray)));
    console.log((Math.max.apply(Math,yArray)-Math.min.apply(Math,yArray)));
    var x = (Math.max.apply(Math,xArray)+Math.min.apply(Math,xArray))/2;
    var y = (Math.max.apply(Math,yArray) + Math.min.apply(Math,yArray))/2;
    x = x*(0.5);
    y = y*(0.5);
    var middleOfFloorplan = "-"+x+" -"+y+" 0";
    console.log("translation"+middleOfFloorplan);
    $('X3D scene > transform').attr('translation', middleOfFloorplan );
}

function buildStartAndEndpoint(data) {
    console.log('startpoint');
    console.log(data.startpoint);
    if(typeof((data.startpoint)!=='undefined')){
        x3dscenetransform.append(zylinderWithMiddlePoint_StartAndEndpoint((data.startpoint), 'startpoint.jpg'));
        x3dscenetransform.append(changePositionOfZylinderWithMiddlePoint_ActualPosition(data.startpoint));
    }
    if(typeof((data.endpoint)!=='undefined'))
        x3dscenetransform.append(zylinderWithMiddlePoint_StartAndEndpoint((data.endpoint), 'endpoint.jpg'));
}

function buildActualPosition(data) {
    $.each(data, function(i, v) {
        console.log(v);
        var actualPosition = v['actualPosition'];
        x3dscenetransform.append(changePositionOfZylinderWithMiddlePoint_ActualPosition(actualPosition['point']));
    }); 
}

function buildNewPath(data) {
    $.each(data, function(i, v) { 
        setNewPathsmaller();
        buildNewPath2(v);
    });  
}

function setNewPathsmaller(){
    x3dscenetransform.find('transform[DEF="NewPath"]').find('cylinder').attr('radius',newPathRadius*0.7);
    x3dscenetransform.find('transform[DEF="NewPath"]').find('material').attr('diffuseColor','0 1 1');
}
function buildNewPath2(v){
//        console.log(v);
        var newPath = v['newPath'];
        x3dscenetransform.append(sphereWithPoint_NewPath(newPath[0]));
        if(newPath.length>1){
            for (i = 0; i < newPath.length-1; i++) { 
                //console.log(newPath[i]);
                x3dscenetransform.append(zylinderWithStartpointAndEndpoint_NewPath(newPath[i],newPath[i+1]));
                x3dscenetransform.append(sphereWithPoint_NewPath(newPath[i+1]));
            }
        }   
}

//auf json zugreifen
function buildFloorplanJSON(data) {
  var flickerAPI = "uploads/floorplanJSON/"+data.floorplanJSONref;
  $.getJSON( flickerAPI)
    .done(function( data ) {
//       console.log(data);
//       console.log(data['features']);
       $.each(data['features'], function(i, v) {
           if(v['properties']['value']=='limit')
               console.log('limit');
           var polygon = v['geometry']['coordinates'][0];
           if(polygon.length>1){
                for (i = 0; i < polygon.length-1; i++) { 
//                    console.log(polygon[i]);
                    xArray.push(polygon[i][0]);
                    yArray.push(polygon[i][1]);
                    x3dscenetransform.append(boxWithStartpointAndEndpoint_FloorplanPolygonLine(polygon[i],polygon[i+1]));
               }
            }
       });
       setSceneInTheMiddle();
    });
}
function addModelX3D(data) {
//    return "<inline url="+data['modelX3DREF']+"></inline>";
    if(data.floorplanJSONref !== 'undefiend'){
    return '<inline url=uploads/modelX3D/'+data.modelX3Dref+'></inline>';
    }else return "";
}

function sphereWithPoint_NewPath(p) {
    var point = {};
    point.x = p.x;
    point.y = p.y;
    point.z = 0;
    var pointString = point.x + " "+ point.y+" "+ point.z;    
    var sphereString = 
            "<Transform DEF='NewPath' translation='"+pointString+"'>" +
            "<Shape>" +
            "<Sphere radius='"+newPathRadius+"'/>" +
            "<Appearance>" +
            "<Material diffuseColor='0.851 0.961 1'/>" +
            "</Appearance>" +
            "</Shape>" +
            "</Transform>";
//    console.log(sphereString);
    return sphereString;
};
function changePositionOfZylinderWithMiddlePoint_ActualPosition(mp) {
//Berechnung der Attribute des Bindungszylinders
    var point1 = {};
    point1.x = mp.x;
    point1.y = mp.y;
    point1.z = 0;

    var point2 = {};
    point2.x = mp.x;
    point2.y = mp.y;
    point2.z = 0.21;

// Vektor zwischen den Atomen
    var vector = {};
    vector.x = (point2.x - point1.x);
    vector.y = (point2.y - point1.y);
    vector.z = (point2.z - point1.z);
    
    var length = Math.sqrt(vector.x*vector.x + vector.y * vector.y + vector.z * vector.z);
//    console.log(length);
    
// halbierter Vektor zwischen den Atomen
    var middle = {};
    middle.x = vector.x / 2;
    middle.y = vector.y / 2;
    middle.z = vector.z / 2;

// Mittelpunkt zwischen den beiden Punkten
    var position = (point1.x + middle.x) + " "
            + (point1.y + middle.y) + " " + (point1.z + middle.z);

// Winkel zwischen middle und Y-Achse
    var help = middle.x * middle.x + middle.y * middle.y
            + middle.z * middle.z;
    var angle = Math.acos(middle.y / Math.sqrt(help));

// Bestimmung der Rotationsachse
    var rotation;
    if (middle.x == 0) {
        rotation = "1 0 0 ";
        // falls notwendig "richtig" herum drehen
        if (middle.z < 0)
            angle = (2 * Math.PI) - angle;
    }
    else {
        rotation = -middle.z / middle.x + " 0 1 ";
        // falls notwendig "richtig" herum drehen
        if (middle.x > 0)
            angle = (2 * Math.PI) - angle;
    }
// Angabe einer Rotation in X3D:
// 3 Koordinaten der Rotationsachse + Winkel
    rotation = rotation + angle;
    var ap = x3dscenetransform.find('transform[DEF="ActualPosition"]');
    ap.attr('translation', position);
    ap.find('transform').attr('rotation', rotation);
};

function zylinderWithMiddlePoint_StartAndEndpoint(mp, imagename) {
//Berechnung der Attribute des Bindungszylinders
    var point1 = {};
    point1.x = mp.x;
    point1.y = mp.y;
    point1.z = 0;

    var point2 = {};
    point2.x = mp.x;
    point2.y = mp.y;
    point2.z = 0.01;

// Vektor zwischen den Atomen
    var vector = {};
    vector.x = (point2.x - point1.x);
    vector.y = (point2.y - point1.y);
    vector.z = (point2.z - point1.z);
    
    var length = Math.sqrt(vector.x*vector.x + vector.y * vector.y + vector.z * vector.z);
//    console.log(length);
    
// halbierter Vektor zwischen den Atomen
    var middle = {};
    middle.x = vector.x / 2;
    middle.y = vector.y / 2;
    middle.z = vector.z / 2;

// Mittelpunkt zwischen den beiden Punkten
    var position = (point1.x + middle.x) + " "
            + (point1.y + middle.y) + " " + (point1.z + middle.z);

// Winkel zwischen middle und Y-Achse
    var help = middle.x * middle.x + middle.y * middle.y
            + middle.z * middle.z;
    var angle = Math.acos(middle.y / Math.sqrt(help));

// Bestimmung der Rotationsachse
    var rotation;
    if (middle.x == 0) {
        rotation = "1 0 0 ";
        // falls notwendig "richtig" herum drehen
        if (middle.z < 0)
            angle = (2 * Math.PI) - angle;
    }
    else {
        rotation = -middle.z / middle.x + " 0 1 ";
        // falls notwendig "richtig" herum drehen
        if (middle.x > 0)
            angle = (2 * Math.PI) - angle;
    }
// Angabe einer Rotation in X3D:
// 3 Koordinaten der Rotationsachse + Winkel
    rotation = rotation + angle;


    var zylinderString = 
            "<Transform translation='" + position + "'>" + //z is always null/static
            "<Transform rotation='" + rotation + "'>" +
            "<Shape>" +
            "<Cylinder height='"+length+"' radius='"+robotinoRadius*1.2+"' />" + //radius and heigt is static
            "<Appearance>"+
            "<ImageTexture  url='img/"+imagename+"'>" +
            "</ImageTexture>" +
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "</Transform>";
//    console.log(zylinderString);
    return zylinderString;
};
function boxWithStartpointAndEndpoint_FloorplanPolygonLine(p1, p2) {
//Berechnung der Attribute des Bindungszylinders
    var point1 = {};
    point1.x = p1[0];
    point1.y = p1[1];
    point1.z = 0;

    var point2 = {};
    point2.x = p2[0];
    point2.y = p2[1];
    point2.z = 0;

// Vektor zwischen den Atomen
    var vector = {};
    vector.x = (point2.x - point1.x);
    vector.y = (point2.y - point1.y);
    vector.z = (point2.z - point1.z);
    
    var length = Math.sqrt(vector.x*vector.x + vector.y * vector.y + vector.z * vector.z);
//    console.log(length);
    
// halbierter Vektor zwischen den Atomen
    var middle = {};
    middle.x = vector.x / 2;
    middle.y = vector.y / 2;
    middle.z = vector.z / 2;

// Mittelpunkt zwischen den beiden Punkten
    var position = (point1.x + middle.x) + " "
            + (point1.y + middle.y) + " " + (point1.z + middle.z);

// Winkel zwischen middle und Y-Achse
    var help = middle.x * middle.x + middle.y * middle.y
            + middle.z * middle.z;
    var angle = Math.acos(middle.y / Math.sqrt(help));

// Bestimmung der Rotationsachse
    var rotation;
    if (middle.x == 0) {
        rotation = "1 0 0 ";
        // falls notwendig "richtig" herum drehen
        if (middle.z < 0)
            angle = (2 * Math.PI) - angle;
    }
    else {
        rotation = -middle.z / middle.x + " 0 1 ";
        // falls notwendig "richtig" herum drehen
        if (middle.x > 0)
            angle = (2 * Math.PI) - angle;
    }
// Angabe einer Rotation in X3D:
// 3 Koordinaten der Rotationsachse + Winkel
    rotation = rotation + angle;


    var zylinderString = 
            "<Transform translation='" + position + "'>" + //z is always null/static
            "<Transform rotation='" + rotation + "'>" +
            "<Shape>" +
            "<Box size=' "+geojsonWidth+" "+length+" "+geojsonHeight+"' />" + //radius and heigt is static
            "<Appearance>" +
            "<ImageTexture  url='img/wood.jpg'><ImageTexture/>" + //color is static
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "</Transform>";
//    console.log(zylinderString);
    return zylinderString;
};

function zylinderWithStartpointAndEndpoint_NewPath(p1, p2) {
//Berechnung der Attribute des Bindungszylinders
    var point1 = {};
    point1.x = p1.x;
    point1.y = p1.y;
    point1.z = 0;

    var point2 = {};
    point2.x = p2.x;
    point2.y = p2.y;
    point2.z = 0;

// Vektor zwischen den Atomen
    var vector = {};
    vector.x = (point2.x - point1.x);
    vector.y = (point2.y - point1.y);
    vector.z = (point2.z - point1.z);
    
    var length = Math.sqrt(vector.x*vector.x + vector.y * vector.y + vector.z * vector.z);
//    console.log(length);
    
// halbierter Vektor zwischen den Atomen
    var middle = {};
    middle.x = vector.x / 2;
    middle.y = vector.y / 2;
    middle.z = vector.z / 2;

// Mittelpunkt zwischen den beiden Punkten
    var position = (point1.x + middle.x) + " "
            + (point1.y + middle.y) + " " + (point1.z + middle.z);

// Winkel zwischen middle und Y-Achse
    var help = middle.x * middle.x + middle.y * middle.y
            + middle.z * middle.z;
    var angle = Math.acos(middle.y / Math.sqrt(help));

// Bestimmung der Rotationsachse
    var rotation;
    if (middle.x == 0) {
        rotation = "1 0 0 ";
        // falls notwendig "richtig" herum drehen
        if (middle.z < 0)
            angle = (2 * Math.PI) - angle;
    }
    else {
        rotation = -middle.z / middle.x + " 0 1 ";
        // falls notwendig "richtig" herum drehen
        if (middle.x > 0)
            angle = (2 * Math.PI) - angle;
    }
// Angabe einer Rotation in X3D:
// 3 Koordinaten der Rotationsachse + Winkel
    rotation = rotation + angle;


    var zylinderString = 
            "<Transform DEF='NewPath' translation='" + position + "'>" + //z is always null/static
            "<Transform rotation='" + rotation + "'>" +
            "<Shape>" +
            "<Cylinder height='"+length+"' radius='"+newPathRadius+"' />" + //radius and heigt is static
            "<Appearance>" +
            "<Material diffuseColor='0.7 0.7 1' />" + //color is static
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "</Transform>";
//    console.log(zylinderString);
    return zylinderString;
};


function x3dExample() {

//Berechnung der Attribute des Bindungszylinders
    var point1 = {};
    point1.x = 0;
    point1.y = 0;
    point1.z = 0;

    var point2 = {};
    point2.x = 1;
    point2.y = 1;
    point2.z = 1;

// Vektor zwischen den Atomen
    var vector = {};
    vector.x = (point2.x - point1.x);
    vector.y = (point2.y - point1.y);
    vector.z = (point2.z - point1.z);
    
    var length = Math.sqrt(vector.x*vector.x + vector.y * vector.y + vector.z * vector.z);
//    console.log(length);
    
// halbierter Vektor zwischen den Atomen
    var middle = {};
    middle.x = vector.x / 2;
    middle.y = vector.y / 2;
    middle.z = vector.z / 2;

// Mittelpunkt zwischen den beiden Punkten
    var position = (point1.x + middle.x) + " "
            + (point1.y + middle.y) + " " + (point1.z + middle.z);

// Winkel zwischen middle und Y-Achse
    var help = middle.x * middle.x + middle.y * middle.y
            + middle.z * middle.z;
    var angle = Math.acos(middle.y / Math.sqrt(help));

// Bestimmung der Rotationsachse
    var rotation;
    if (middle.x == 0) {
        rotation = "1 0 0 ";
        // falls notwendig "richtig" herum drehen
        if (middle.z < 0)
            angle = (2 * Math.PI) - angle;
    }
    else {
        rotation = -middle.z / middle.x + " 0 1 ";
        // falls notwendig "richtig" herum drehen
        if (middle.x > 0)
            angle = (2 * Math.PI) - angle;
    }
// Angabe einer Rotation in X3D:
// 3 Koordinaten der Rotationsachse + Winkel
    rotation = rotation + angle;


    var string = 
            "<Transform translation='" + position + "'>" + //z is always null/static
            "<Transform rotation='" + rotation + "'>" +
            "<Shape>" +
            "<Cylinder height='"+length+"' radius='0.1' />" + //radius and heigt is static
            "<Appearance>" +
            "<Material diffuseColor='0.5 0.5 0.5' />" + //color is static
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "</Transform>" +
            "<Shape>" +
            "<Sphere radius='0.1'/>" +
            "<Appearance>" +
            "<Material diffuseColor='1 0 0'/>" +
            "</Appearance>" +
            "</Shape>" +
            "<Transform translation='1 0 0'>" +
            "<Shape>" +
            "<Sphere radius='0.1'/>" +
            "<Appearance>" +
            "<Material diffuseColor='1 0.5 0'/>" +
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "<Transform translation='0 1 0'>" +
            "<Shape>" +
            "<Sphere radius='0.1'/>" +
            "<Appearance>" +
            "<Material diffuseColor='1 0 0.5'/>" +
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "<Transform translation='0 0 1'>" +
            "<Shape>" +
            "<Sphere radius='0.1'/>" +
            "<Appearance>" +
            "<Material diffuseColor='0 0 1'/>" +
            "</Appearance>" +
            "</Shape>" +
            "</Transform>"+
            "<Transform translation='1 1 1'>" +
            "<Shape>" +
            "<Sphere radius='0.2'/>" +
            "<Appearance>" +
            "<Material diffuseColor='0.2 0.5 0.7'/>" +
            "</Appearance>" +
            "</Shape>" +
            "</Transform>"+
            //"<PointLight DEF='Lamp1' location='0 4 0' radius='30'/> "+
            //"<SpotLight DEF='Lamp' beamWidth='0.35' color='1 1 0' cutOffAngle='0.78' location='0 0 12' radius='18'/> "+
            "<Transform translation='0 -0.1 0'>" +
            "<Shape>" +
            "<Box size='3 .01 3'/>" +
            "<Appearance>" +
            "<Material diffuseColor='0.2 0.5 0.7'/>" +
            "</Appearance>" +
            "</Shape>" +
            "</Transform>";
//    console.log(string);
    return string;
};

