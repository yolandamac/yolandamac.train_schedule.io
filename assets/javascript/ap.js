
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB6opHZHzjdKdAQVceao5syd2OQ96aipzs",
    authDomain: "train-schedule-51c8b.firebaseapp.com",
    databaseURL: "https://train-schedule-51c8b.firebaseio.com",
    projectId: "train-schedule-51c8b",
    storageBucket: "train-schedule-51c8b.appspot.com",
  };
  firebase.initializeApp(config);

  // //Runs the clock in the table
  setInterval(function(){
    $("#current-time").html(moment().format('hh:mm:ss A'))
  }, 1000);

  // Global Variables
  var trainName = "";
  var trainDestination = "";
  var trainTime = "";
  var trainFrequency = "";
  var nextArrival = "";
  var minutesAway = "";

  var database = firebase.database();

  database.ref().on("child_added", function(snapshot) {

  //  create local variables to store the data from the firebase database
    var trainDiff = 0;
    var frequency = snapshot.val().frequency;
    var currentTime = "";
    var diffTime = "";
    var firstTimeConverted = "";
    var firstTime = snapshot.val().firstTrain;;
    var tRemainder = "";

  // calculate the difference in time from 'now' and the first train
    // trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    // console.log("FIRST TIME CONVERTED: " + firstTimeConverted);

    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % frequency;
    // console.log("TIME REMAINDER: " + tRemainder);

    var tMinutesTillTrain = frequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "m").format("hh:mm A");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


  // append to table of trains, inside tbody, with a new row of the train data
    $("#train-table > tbody").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + nextTrain + "</td>" +
        "<td>" + tMinutesTillTrain + "</td></tr>");

  });


  // Button for adding Trains
    $("#add-train-btn").on("click", function(event) {
      event.preventDefault();

  // Store user input and remove white spaces
  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = moment($("#first-train").val().trim(), "HH:mm").format("HH:mm");
  var frequency = $('#frequency').val().trim();


  // Create local "temporary" variables for holding train data
  var trainTimeConverted = moment(firstTrain, "hh:mm").subtract("1, years");
  var timeDiff = moment().diff(moment(trainTimeConverted), "minutes");
  var timeRemainder = timeDiff % frequency;
  var minutesTillTrain = frequency - timeRemainder;
  var nextTrain = moment().add(minutesTillTrain, "m").format("hh:mm A");
  
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    nextTrain: nextTrain,
    minutesTillTrain: minutesTillTrain
  };

  // Upload form data to firebase
    database.ref().push(newTrain);

  //  alert that train was added
    alert("Thank you for adding a train!");

  //  empty form once submitted
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
  });
