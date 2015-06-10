function skalarprodukt(vector1, vector2){
    return vector1.x*vector2.x+vector1.y*vector2.y;
}

function betrag(vector){
    return Math.sqrt(vector.x*vector.x+vector.y*vector.y);
}

var point1 = {};
point1.x = 2;
point1.y = 3;

var point2 = {};
point2.x = 4;
point2.y = 9;

var point3 = {};
point3.x = 7;
point3.y = 10;

//console.log("final",getOuterPoint(point1, point2, point3,1));

function getOuterPoint(point1a, point2a, point3a, distance){
//    console.log("points", point1a, point2a, point3a);
//    console.log("points", point1a[0], point2a[1], point3a);
    var point1 = {};
    point1.x = point1a[0];
    point1.y = point1a[1];

    var point2 = {};
    point2.x = point2a[0];
    point2.y = point2a[1];

    var point3 = {};
    point3.x = point3a[0];
    point3.y = point3a[1];
    
//    console.log("points", point1, point2, point3);
    
    var vectorA = {};
    vectorA.x = point2.x-point1.x;
    vectorA.y = point2.y-point1.y;

    var vectorB = {};
    vectorB.x = point3.x-point2.x;
    vectorB.y = point3.y-point2.y;

//    console.log("vertorA,vectorB",vectorA,vectorB);



    var vectorU = {};
    vectorU.x = vectorA.x/betrag(vectorA);
    vectorU.y = vectorA.y/betrag(vectorA);

    var vectorV = {};
    vectorV.x = vectorB.x/betrag(vectorB);
    vectorV.y = vectorB.y/betrag(vectorB);

//    console.log("vertorU,vectorV",vectorU,vectorV);

    var vectorR = {};
    vectorR.x = vectorU.x + vectorV.x;
    vectorR.y = vectorU.y + vectorV.y;

//    console.log("vectorR",vectorR);



    var uuv = skalarprodukt(vectorU,vectorR);

    var vectorUVUUV = {};
    vectorUVUUV.x = vectorR.x / uuv;
    vectorUVUUV.y = vectorR.y / uuv;

//    console.log("vectorUVUUV",vectorUVUUV);

    var vectorR90UVUUV = {};
    vectorR90UVUUV.x = vectorUVUUV.y;
    vectorR90UVUUV.y = vectorUVUUV.x*-1;

//    console.log("vectorR90UVUUV",vectorR90UVUUV);

    var outerPoint = {};
    outerPoint.x = point2.x+vectorR90UVUUV.x*distance;
    outerPoint.y = point2.y+vectorR90UVUUV.y*distance;

    return [outerPoint.x,outerPoint.y];
}