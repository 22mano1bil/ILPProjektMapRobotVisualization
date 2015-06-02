var io = io();

//ONLOAD
// Listen for the actualPosition event.
io.on('hello', function (data) {
    alert(data['hello'])
});

io.on('initSzenario', function (data) {
    console.log(data)
    initSzenario(data);
});

io.on('initFiles', function (data) {
    initFiles(data);
});


//Events
$('#watchSzenarioSubmit').click(function () {
    var szenarioID = $('#szenarioname option:selected').val();
    console.log(szenarioID);
    io.emit('switchSzenario', szenarioID);
});

// Listen for the actualPosition event.
io.on('szenario', function (data) {
    console.log('szenario');
    console.log(data);
    buildNewSzenario(data[0]);
});

// Listen for the actualPosition event.
io.on('actualPosition', function (data) {
    console.log('actualPosition');
    console.log(data);
})

// Listen for the actualPosition event.
io.on('actualPositionArray', function (data) {
    console.log('actualPosition');
    console.log(data);
    buildActualPosition(data);
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
    buildNewPath(data);
});