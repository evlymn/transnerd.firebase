modulo.controller('sobreController', function ($scope, $rootScope, htmlService, databaseService) {
    var childRef = "sobres";
    $scope.htmlService = htmlService;
    $scope.isOpenSobreForm = false;
    $scope.sobreTextoEdit = "";
    $scope.sobreTexto = "";

    getFromDB();
    function getFromDB() {
        databaseService.retrievelimitToLastAsync(1, childRef).then(function (data) {
            $scope.sobres = data;
            $scope.$apply();
            console.log('get data ' + childRef);
        }, function (error) {
            console.log(error);
            console.log('erro ' + childRef);
        });
    }

    $scope.saveSobre = function () {
        pushToDb();
    };

    function pushToDb() {
        var sobre = {
            datacadastro: new Date().getTime(),
            texto: $scope.sobreTextoEdit
        };

        databaseService.createAsync(sobre, childRef).then(function (newKey) {
            console.info(childRef + ' item adicionado');
            toastr["success"]("Adicionado: " + newItem.texto);
            $scope.showHideSobreForm();
            $scope.$apply();
        }, function (error) {
            console.error(childRef + error);
            toastr["danger"]("Erro ao tentar adicionar: " + newItem.texto);
        })
    }

    $scope.showHideSobreForm = function () {
        if ($scope.isOpenSobreForm) {
            $scope.isOpenSobreForm = false;
            $scope.sobreTextoEdit = "";
        }
        else {
            $scope.isOpenSobreForm = true;
            angular.forEach($scope.sobres, function (value, key) {
                $scope.sobreTextoEdit = value.texto;
                return;
            });
        }
    };
});