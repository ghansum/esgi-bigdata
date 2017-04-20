var app = angular.module('bigdata', []);

app.controller('mainCtrl', function ($scope, $http, $window, $q) {

	$scope.data = [];

	$http({
	  method: 'GET',
	  url: 'http://localhost:3000/api'
	}).then(function successCallback(response) {
		  $scope.data = response.data.results;
	    console.log("DATA : ", response.data.results);

	  }, function errorCallback(err) {
			console.log("ERROR : ", err);

	 });


});
