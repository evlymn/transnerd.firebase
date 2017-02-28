modulo.controller('tituloController', function ($scope, $rootScope, htmlService, databaseService) {
    var childRef = "titulos";
    $scope.htmlService = htmlService;
    $scope.isOpenForm = false;
    $scope.textoEdit = "";
    $scope.texto = "<h1>Título</h1>";

    $scope.options = {
        toolbar:
        [
            ['view', ['codeview']],
        ]
    };

    getFromDB();
    function getFromDB() {
        databaseService.retrievelimitToLastAsync(1, childRef).then(function (data) {
            console.log(data);
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
            texto: $scope.textoEdit
        };

        databaseService.createAsync(item, childRef).then(function (newKey) {
            console.log(newKey);
            console.info(childRef + ' item adicionado');
            toastr["success"]("Adicionado: " + newItem.texto);
            $scope.showHideForm();
            $scope.$apply();
        }, function (error) {
            console.error(childRef + error);
            toastr["danger"]("Erro ao tentar adicionar: " + newItem.texto);
        })
    }

    $scope.showHideForm = function () {
        if ($scope.isOpenForm) {
            $scope.isOpenForm = false;
            $scope.textoEdit = "";
        }
        else {
            $scope.isOpenForm = true;
            angular.forEach($scope.items, function (value, key) {
                $scope.textoEdit = value.texto;
                return;
            });
        }
    };
});