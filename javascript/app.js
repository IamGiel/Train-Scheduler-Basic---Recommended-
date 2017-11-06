console.log("connected");

$(document).ready(function(){
     
  var dateToday = moment().format(" h : mm a");
  $("#dateToday").text(dateToday);
  console.log(dateToday);

 // Initialize Firebase
   var config = {
    apiKey: "AIzaSyAKSPvuBUX2FiSh_kZBLEAxD8rLa3NOhSE",
    authDomain: "trainscheduler-cdfd2.firebaseapp.com",
    databaseURL: "https://trainscheduler-cdfd2.firebaseio.com",
    projectId: "trainscheduler-cdfd2",
    storageBucket: "trainscheduler-cdfd2.appspot.com",
    messagingSenderId: "225125769865"
  };
  firebase.initializeApp(config);

  // variables
  var database = firebase.database();
  var employeeName = "";
  var role = "";
  var frequency = "";
  var nextArrival = "";
  var currentDate = moment().format("X");
  var randomFormat = moment().format("X")
  var convertedDate = moment(currentDate, randomFormat);


  //onclick
  $("#submit").on("click", function (event){
      event.preventDefault();

      employeeName = $("#employee-name").val().trim();
      role = $("#role-of").val().trim();//has to be a ("#data-format") so ("#role") will not work
      firstArrival = moment($("#first-arrival").val().trim(), "H:mm").format("H:mm");
      frequency = $("#start-date").val().trim();
      
      console.log("minutes first arrived: " + firstArrival);
      $("#employee-name").val("");
      $("#role-of").val("");
      $("#start-date").val("");
      $("#monthly-rate").val("");
      $("#first-arrival").val("");  

      database.ref().push({
            employeeName:employeeName,
            role:role,
            firstArrival:firstArrival,
            frequency:frequency
           
      })
      $(".table > #tbody").append("<tr><td>" + employeeName + "</td><td>" + role + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td></tr>"); 
  });
  //pull
  database.ref().orderByChild("frequency").on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());
      var frequency = childSnapshot.val().frequency;
      var firstTime = childSnapshot.val().firstArrival;
      var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
      var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
      var tRemainder = diffTime % frequency;
      console.log(tRemainder);
      var tMinutesTillTrain = frequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
      var nextTrain = currentTime.add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      $(".table > tbody").append("<tr><td>" + childSnapshot.val().employeeName + "</td><td>" + childSnapshot.val().role + "</td><td>" + firstTime  + "</td><td>" + frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
      
  })

});


