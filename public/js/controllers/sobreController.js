modulo.controller('sobreController', function ($scope, $rootScope, $firebaseArray, htmlService) {
    $scope.htmlService = htmlService;
    $scope.isOpenSobreForm = false;
    $scope.sobreTextoEdit = "";
    $scope.sobreTexto = "";

    var databaseRef = firebase.database().ref();


    getFromDB();
    function getFromDB() {
        $scope.sobres = $firebaseArray(databaseRef.child("sobres").orderByKey().limitToLast(1));
    }

    
    $scope.saveSobre = function () {
        pushToDb();
    };
    
    function pushToDb() {
        var sobre = {
            datacadastro: new Date().getTime(),
            texto: $scope.sobreTextoEdit
        };

        databaseRef.child("sobres").push(sobre);
        toastr["success"]("Sobre editado");
    }

    $scope.showHideSobreForm = function () {
        if ($scope.isOpenSobreForm) {
            $scope.isOpenSobreForm = false;
            $scope.sobreTextoEdit = "";
        }
        else {
            $scope.isOpenSobreForm = true;
            $scope.sobreTextoEdit = $scope.sobreTexto;
        }
    };
});