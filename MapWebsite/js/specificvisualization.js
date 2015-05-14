var io = io();

$('#watchSzenarioSubmit').click(function () {
    var szenarioID = $('#szenarioname option:selected').val();
    io.emit('switchSzenario', szenarioID);
});

// Listen for the actualPosition event.
io.on('szenario', function (data) {
    console.log('szenario');
    console.log(data);
    buildNewSzenario(data);
});

function buildNewSzenario(data) {
    $('X3D scene').append(zylinderExample());
}
function zylinderExample() {

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


    var string = "<Transform translation='" + position + "'>" + //z is always null/static
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
})