var io = io();

//ONLOAD
// Listen for the actualPosition event.
io.on('hello', function (data) {
    alert(data['hello']);
});

io.on('promptSzenario', function (data) {
    console.log('promptSzenario');
    console.log(data);
    var x;
    if (confirm("New live szenario \""+data.szenarioname+"\" online, do you want to watch it now?") == true) {
        console.log(data._id)
        $('html,body').animate({scrollTop: $("#visualization").offset().top},'slow');
        io.emit('switchSzenario', data._id);
    }
});

io.on('initSzenariosHTML', function (data) {
    console.log('initSzenarios');
    console.log(data);
    initSzenariosHTML(data);
});

io.on('initFilesHTML', function (data) {
    console.log('initFiles');
    console.log(data);
    initFilesHTML(data);
});


//Events
$('#watchSzenarioSubmit').click(function () {
    var szenarioID = $('#szenarioname option:selected').val();
    console.log(szenarioID);
    io.emit('switchSzenario', szenarioID);
});

$('#watchDummyroboterSzenarioSubmit').click(function () {
    io.emit('dummyroboter');
});

// Listen for the actualPosition event.
io.on('initSzenario', function (data) {
    console.log('szenario');
    console.log(data);
    buildNewSzenario(data[0]);
});

// Listen for the actualPosition event.
io.on('actualPosition', function (data) {
    console.log('actualPosition');
    console.log(data);
    buildActualPosition(data);
})

// Listen for the newPath event.
io.on('newPath', function (data) {
    console.log('newPathArray');
    console.log(data);
    buildNewPath(data);
});