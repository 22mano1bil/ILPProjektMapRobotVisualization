// Mongoose import
var mongoose = require('mongoose');
var config = require(__dirname + '/../config.json');
var models = require('./models');

// Mongoose Model definitions
var Szenario = models.Szenario;
var ActualPosition = models.ActualPosition;
var NewPath = models.NewPath;


var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("To delete Szenario and related NewPaths and ActualPositions, input szenarioname: ", function(answer) {
  // TODO: Log the answer in a database
  console.log("You said zenarioname:", answer);
  deleteSzenario(answer);
  rl.close();
});

function deleteSzenario(deleteSzenarioname){
// Mongoose connection to MongoDB (ted/ted is readonly)
    mongoose.connect(config.dbpath + config.dbname, function (error) {
        if (error) {
            console.log(error);
        }else{
            Szenario.remove({ szenarioname:  deleteSzenarioname},function(err,docs){
                if (error) {
                    console.log(error);
                }else{
                    console.log("removed Szenario of: " + deleteSzenarioname);
                }
            });
            ActualPosition.remove({ szenarioname:  deleteSzenarioname},function(err,docs){
                if (error) {
                    console.log(error);
                }else{
                    console.log("removed ActualPositions of: " + deleteSzenarioname);
                }
            });
            NewPath.remove({ szenarioname:  deleteSzenarioname},function(err,docs){
                if (error) {
                    console.log(error);
                }else{
                    console.log("removed NewPaths of: " + deleteSzenarioname);
                }
            });
        }
    });
    mongoose.connection.close();
}