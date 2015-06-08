var point1 = {};
point1.x = 2;
point1.y = 1;

var point2 = {};
point2.x = 1;
point2.y = 1;


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


console.log("<Transform translation='" + translation.x + " " + translation.y + " 0'>" + //z is always null/static
        "<Transform rotation='0 0 " + rotation.z + " " + winkel + "'>" +
        "<Shape>" +
        "<Cylinder height='1' radius='0.5' />" + //radius and heigt is static
        "<Appearance>" +
        "<Material diffuseColor='0.5 0.5 0.5' />" + //color is static
        "</Appearance>" +
        "</Shape>" +
        "</Transform>" +
        "</Transform>");


