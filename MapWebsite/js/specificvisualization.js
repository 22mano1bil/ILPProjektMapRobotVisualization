var io = io();

$('#watchSzenarioSubmit').click(function() { 
    var szenarioID = $('#szenarioname option:selected').val();
    io.emit('switchSzenario', szenarioID);
});

// Listen for the actualPosition event.
io.on('szenario', function(data) {
    console.log('szenario');
    console.log(data);
    buildNewSzenario(data);
})

function buildNewSzenario(data){
    $('X3D scene').append(zylinderExample());
}

function zylinderExample(){
var point1 = {};
point1.x = 5;
point1.y = 5;

var point2 = {};
point2.x = 5;
point2.y = 5;


var translation = {};
translation.x = (point1.x + point1.x) / 2;
translation.y = (point2.y + point2.y) / 2;

var rotation = {};
rotation.z = (point1.x - point2.x);

var vektora = {};
vektora.x = point1.x - point2.x;
vektora.y = point1.y - point2.y;
vektora.z = 0;

var vektorb = {};
vektorb.x = 0;
vektorb.y = 0;
vektorb.z = rotation.z;

var winkeloben = vektora.x * vektorb.x + vektora.y * vektorb.y + vektora.z * vektorb.z;
var winkelunten = Math.sqrt(vektora.x * vektora.x + vektora.y * vektora.y + vektora.z * vektora.z) *
        Math.sqrt(vektorb.x * vektorb.x + vektorb.y * vektorb.y + vektorb.z * vektorb.z);
console.log(winkeloben);
console.log(winkelunten);
var winkel = Math.acos(winkeloben / winkelunten);
console.log(winkel);


return"<Transform translation='" + translation.x + " " + translation.y + " 0'>" + //z is always null/static
        "<Transform rotation='0 0 " + rotation.z + " " + winkel + "'>" +
        "<Shape>" +
        "<Cylinder height='1' radius='0.5' />" + //radius and heigt is static
        "<Appearance>" +
        "<Material diffuseColor='0.5 0.5 0.5' />" + //color is static
        "</Appearance>" +
        "</Shape>" +
        "</Transform>" +
        "</Transform>"+
        "<Shape>"+
"<Sphere radius='1'/>"+
"<Appearance>"+
"<Material diffuseColor='1 0 0'/>"+
"</Appearance>"+
"</Shape>"+
"<Transform translation='1 0 0'>"+
        "<Shape>"+
"<Sphere radius='1'/>"+
"<Appearance>"+
"<Material diffuseColor='1 0.5 0'/>"+
"</Appearance>"+
"</Shape>"+
        "</Transform>"+
"<Transform translation='0 1 0'>"+
        "<Shape>"+
"<Sphere radius='1'/>"+
"<Appearance>"+
"<Material diffuseColor='1 0 0.5'/>"+
"</Appearance>"+
"</Shape>"+
        "</Transform>"+
        "<Transform translation='0 0 1'>"+
        "<Shape>"+
"<Sphere radius='1'/>"+
"<Appearance>"+
"<Material diffuseColor='0 0 1'/>"+
"</Appearance>"+
"</Shape>"+
"</Transform>";
};

// Listen for the actualPosition event.
io.on('actualPosition', function(data) {
    console.log('actualPosition');
    console.log(data);
})

// Listen for the actualPosition event.
io.on('actualPositionArray', function(data) {
    console.log('actualPosition');
    console.log(data);
})

// Listen for the newPath event.
io.on('newPath', function(data) {
    console.log('newPath');
    console.log(data);
})

// Listen for the newPath event.
io.on('newPathArray', function(data) {
    console.log('newPathArray');
    console.log(data);
})