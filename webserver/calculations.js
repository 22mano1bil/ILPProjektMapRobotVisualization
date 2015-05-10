


function OVLength()
{
  console.log(Math.sqrt(this.x*this.x+this.y*this.y));
  return Math.sqrt(this.x*this.x+this.y*this.y);
}
function OVUnitV()
{
  return VMultiplicationWithNumber(1/this.length,this);
}

function OV(x,y)
{
  this.x = x;
  this.y = y;
  this.length = Math.sqrt(this.x*this.x+this.y*this.y);
  this.unitV = VMultiplicationWithNumber(1/this.length,this);
}

function VAddition(vectorA, vectorB)
{
  return new OV(vectorA.x+vectorB.x,vectorA.y+vectorB.y);
}

function VSubtraction(vectorA, vectorB)
{
  return new OV(vectorA.x-vectorB.x,vectorA.y-vectorB.y);
}

function VMultiplication2Vectors(vectorA, vectorB)
{
  return new OV(vectorA.x*vectorB.x,vectorA.y*vectorB.y);
}

function VMultiplicationWithNumber(number,vectorA)
{
  return new OV(number*vectorA.x,number*vectorA.y);
}

var a = new OV(7.2, 4.3);

console.log(a.unitV.x);