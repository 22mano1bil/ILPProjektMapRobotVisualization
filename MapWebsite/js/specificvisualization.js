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
    $('X3D').empty();
}

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