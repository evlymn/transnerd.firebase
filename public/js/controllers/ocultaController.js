modulo.controller('ocultaController', function ($scope, $rootScope, htmlService, databaseService) {
    var childRef = "ocultas";
    $scope.htmlService = htmlService;
    $scope.isOpenSobreForm = false;
    $scope.textoEdit = "";
    $scope.texto = "";
    $scope.titulo = "";

    getFromDB();
    function getFromDB() {
        databaseService.retrievelimitToLastAsync(1, childRef).then(function (data) {
            $scope.items = data;
            $scope.$apply();
            console.log('get data ' + childRef);
        }, function (error) {
            console.log(error);
            console.log('erro ' + childRef);
        });
    }

    $scope.save = function () {
        pushToDb();
    };

    function pushToDb() {
        var item = {
            timeid: new Date().getTime(),
            texto: $scope.textoEdit,
            titulo : $scope.tituloEdit
        };

        databaseService.createAsync(item, childRef).then(function (newKey) {
            console.info(childRef + ' item adicionado');
            toastr["success"]("Adicionado");
            $scope.showHideForm();
            $scope.$apply();
        }, function (error) {
            console.error(childRef + error);
            toastr["danger"]("Erro ao tentar adicionar");
        })
    }

    $scope.showHideForm = function () {
        if ($scope.isOpenSobreForm) {
            $scope.isOpenSobreForm = false;
            $scope.textoEdit = "";
             $scope.tituloEdit = "";
        }
        else {
            $scope.isOpenSobreForm = true;
            angular.forEach($scope.items, function (value, key) {
                $scope.textoEdit = value.texto;
                $scope.tituloEdit =value.titulo;
                return;
            });
        }
    };
});