var io = io();

//// Emit ready event.
//io.emit('ready') 
//
//// Listen for the talk event.
//io.on('talk', function(data) {
//    alert(data.message)
//})  

// Listen for the actualPosition event.
io.on('actualPosition', function(data) {
    console.log(data);
})
// Listen for the newPath event.
io.on('newPath', function(data) {
    console.log(data);
})