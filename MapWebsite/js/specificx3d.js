

function setSceneInTheMiddle(){
//    console.log((Math.max.apply(Math,xArray)-Math.min.apply(Math,xArray)));
//    console.log((Math.max.apply(Math,yArray)-Math.min.apply(Math,yArray)));
    var xWidth = (Math.max.apply(Math,xArray)-Math.min.apply(Math,xArray));
    var yWidth = (Math.max.apply(Math,yArray)-Math.min.apply(Math,yArray));
    var middlex = (Math.max.apply(Math,xArray)+Math.min.apply(Math,xArray))/2;
    var middley = (Math.max.apply(Math,yArray) + Math.min.apply(Math,yArray))/2;
    var middlepercent;
    if((yWidth/xWidth)>0.5){
        middlepercent=8/yWidth;
    }else{
        middlepercent=14/xWidth;
    }
//    console.log('middlepercent'+middlepercent);
//    console.log('middlepercent'+middlepercent);
    var middlexnew = middlex*middlepercent;
    var middleynew = middley*middlepercent;
    var middleOfFloorplan = "-"+middlexnew+" -"+middleynew  +" 0";
    var scale = middlepercent+" "+middlepercent+" "+middlepercent; 
//    console.log("translation"+middleOfFloorplan);
//    console.log("scale"+scale);
    $('X3D scene > transform').attr('translation', middleOfFloorplan );
    $('X3D scene > transform').attr('scale', scale );
}

function addModelX3D(data) {
//    return "<inline url="+data['modelX3DREF']+"></inline>";
    if(data.floorplanJSONref !== 'undefiend'){
        return '<inline url=uploads/modelX3D/'+data+'></inline>';
    }else return "";
}

function sphereWithPoint_NewPath(p) {
    var point = {};
    point.x = p.x;
    point.y = p.y;
    point.z = 0;
    
    var position = point.x + " "+ point.y+" "+ point.z;    

    return sphereString("NewPath",position, newPathRadius, "<Material diffuseColor='0.6 0.7 1' />");
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
    
    var tf = transform(point1,point2);
    
    var ap = x3dscenetransform.find('transform[DEF="ActualPosition"]');
    ap.attr('translation', tf.translation+ "0");
    ap.find('transform').attr('rotation', tf.rotation);
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
    
    var tf = transform(point1,point2);

    return zylinderString("StartEndPoint",tf.translation+ "0", tf.rotation, tf.length, robotinoRadius, "<ImageTexture  url='img/"+imagename+"'>");
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
    
    var tf = transform(point1,point2);
    
    return boxString("Floorplan",tf.translation+geojsonHeight/2, tf.rotation, geojsonWidth, tf.length, geojsonHeight, "<ImageTexture  url='img/wood.jpg'><ImageTexture/>");
};

function boxWithStartpointAndEndpoint_FloorplanPolygonDistanceLine(p1, p2) {
//Berechnung der Attribute des Bindungszylinders
    var point1 = {};
    point1.x = p1[0];
    point1.y = p1[1];
    point1.z = 0;

    var point2 = {};
    point2.x = p2[0];
    point2.y = p2[1];
    point2.z = 0;
    
    var tf = transform(point1,point2);
    
    return boxString("Floorplan",tf.translation+geojsonDistanceHeight/2, tf.rotation, geojsonWidth, tf.length, geojsonDistanceHeight, "<Material diffuseColor='0.7 0 0.3' transparency='0'/>");
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
    
    var tf = transform(point1,point2);
    
    return zylinderString("NewPath",tf.translation+ "0", tf.rotation, tf.length, newPathRadius, "<Material diffuseColor='0.6 0.7 1' />");
};

function sphereString(def, position, radius, appearance){
    return "<Transform DEF='"+def+"' translation='"+position+"'>" +
            "<Shape>" +
            "<Sphere radius='"+radius+"'/>" +
            "<Appearance>" +
            appearance+
            "</Appearance>" +
            "</Shape>" +
            "</Transform>";
}
function boxString(def, position, rotation, width, length, height, appearance){
    return "<Transform DEF='"+def+"' translation='" + position + "'>" + 
            "<Transform rotation='" + rotation + "'>" +
            "<Shape>" +
            "<Box size=' "+width+" "+length+" "+height+"' />" + 
            "<Appearance>" +
            appearance + //color is static
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "</Transform>";  
}

function zylinderString(def, position, rotation, height, radius, appearance){
    return "<Transform DEF='"+def+"' translation='" + position + "'>" + 
            "<Transform rotation='" + rotation + "'>" +
            "<Shape>" +
            "<Cylinder height='"+height+"' radius='"+radius+"' />" + 
            "<Appearance>" +
            appearance + 
            "</Appearance>" +
            "</Shape>" +
            "</Transform>" +
            "</Transform>";  
}

function transform(point1, point2) {

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
            + (point1.y + middle.y) + " ";
    //+ (point1.z + middle.z);

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
    
    var transform = {};
    transform.rotation = rotation;
    transform.translation = position;
    transform.length = length;
    return transform;
};