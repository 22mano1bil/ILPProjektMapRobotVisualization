var io = io();

$('#watchSzenarioSubmit').click(function () {
    var szenarioID = $('#szenarioname option:selected').val();
    console.log(szenarioID);
    io.emit('switchSzenario', szenarioID);
});

// Listen for the actualPosition event.
io.on('szenario', function (data) {
    console.log('szenario');
    console.log(data);
    buildNewSzenario(data);
});

function buildNewSzenario(data) {
    $('X3D scene').empty();
    $('X3D scene').append(addx3dModel(data));
    $('X3D scene').append(addFloorplan(data));
    $('X3D scene').append(x3dExample());
}
$('X3D scene').append(addFloorplan());

//auf json zugreifen
function addFloorplan() {
  var flickerAPI = "uploads/floorplan_test1.json";
  $.getJSON( flickerAPI)
    .done(function( data ) {
//       console.log(data);
       console.log(data['features']);
       $.each(data['features'], function(i, v) {
           if(v['properties']['value']=='limit')
               console.log('limit');
       });
    });
}
function addx3dModel(data) {
//    return "<inline url="+data['modelX3DREF']+"></inline>";
    return "<inline url=Deer.x3d></inline>";
}

function sphereWithPoint(p) {
//Berechnung der Attribute des Bindungszylinders
    var point = {};
    point.x = p.x;
    point.y = p.y;
    point.z = 0;
    
    var pointString = point.x + " "+ point.y+" "+ point.z;    
    var sphereString = 
            "<Transform translation='"+pointString+"'>" +
            "<Shape>" +
            "<Sphere radius='0.2'/>" +
            "<Appearance>" +
            "<Material diffuseColor='0.1 0.7 0.3'/>" +
            "</Appearance>" +
            "</Shape>" +
            "</Transform>";
    console.log(sphereString);
    $('X3D scene').append(sphereString);
    return sphereString;
};

function zylinderWithMiddlePoint(mp) {
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
    console.log(length);
    
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
            "<Cylinder height='"+length+"' radius='0.4' />" + //radius and heigt is static
            "<Appearance>" +
            "<Material diffuseColor='0.5 0.5 1' />" + //color is static
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "</Transform>";
    console.log(zylinderString);
    $('X3D scene').append(zylinderString);
    return zylinderString;
};

function zylinderWithStartpointAndEndpoint(p1, p2) {
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
    console.log(length);
    
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
            "<Cylinder height='"+length+"' radius='0.1' />" + //radius and heigt is static
            "<Appearance>" +
            "<Material diffuseColor='0.5 0.5 0.5' />" + //color is static
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "</Transform>";
    console.log(zylinderString);
    $('X3D scene').append(zylinderString);
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
    console.log(length);
    
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
    console.log(string);
    return string;
};


// Listen for the actualPosition event.
io.on('actualPosition', function (data) {
    console.log('actualPosition');
    console.log(data);
})

// Listen for the actualPosition event.
io.on('actualPositionArray', function (data) {
    console.log('actualPosition');
    console.log(data);
    $.each(data, function(i, v) {
        console.log(v);
        var actualPosition = v['actualPosition'];
        zylinderWithMiddlePoint(actualPosition['point']);
    });  
})

// Listen for the newPath event.
io.on('newPath', function (data) {
    console.log('newPath');
    console.log(data);
})

// Listen for the newPath event.
io.on('newPathArray', function (data) {
    console.log('newPathArray');
    console.log(data);
    $.each(data, function(i, v) {
        console.log(v);
        var newPath = v['newPath'];
        sphereWithPoint(newPath[0]);
        if(newPath.length>1){
            for (i = 0; i < newPath.length-1; i++) { 
                //console.log(newPath[i]);
                zylinderWithStartpointAndEndpoint(newPath[i],newPath[i+1]);
                sphereWithPoint(newPath[i+1]);
            }
        }
    });  
});