var app = angular.module('raceApp', []);


// 🧑‍💻 Admin Controller
app.controller('adminCtrl', function($scope, $http) {

    $scope.addParticipant = function() {

        $http.post('http://localhost:3000/api/add', $scope.participant)
        .then(function(response) {
            $scope.message = "Record Added Successfully!";
            $scope.participant = {};
        })
        .catch(function(error) {
            $scope.message = "Error adding record!";
        });
    };
});


// 🏆 Scoreboard Controller
app.controller('scoreCtrl', function($scope, $http) {

    function loadData() {
        $http.get('http://localhost:3000/api/ranking')
        .then(function(response) {
            $scope.participants = response.data;
        });
    }

    loadData();

    // Auto refresh every 5 seconds
    setInterval(loadData, 5000);
});