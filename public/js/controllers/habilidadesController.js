
modulo.controller('habilidadesController', function ($scope, $rootScope, databaseService) {
    var childRef = "habilidades";
    var msgaddButtonLabel = "Adicionar nova habilidade";

    $scope.formIsOpen = false;
    $scope.items = [];

    resetFormObject();

    function resetFormObject() {
        $scope.item = {
            texto: '',
            valor: 0.5
        }
    }

    getItemsFromDb();

    function getItemsFromDb() {
        databaseService.retrievelAllAsync(childRef).then(function (data) {
            $scope.items = data;
            $scope.$apply();
            $scope.items.$loaded().then(function () {
                showHabilidade(null);
            });
            console.log('get data ' + childRef);
        }, function (error) {
            console.log(error);
            console.log('erro ' + childRef);
        });
    }



    $scope.setSaveMethod = function () {
        if ($scope.item.id) {
            $scope.update();
        } else {
            $scope.add();
        }
    }

    $scope.add = function () {
        var newItem = {
            timeid: new Date().getTime(),
            texto: $scope.item.texto,
            valor: $scope.item.valor
        }
        databaseService.createAsync(newItem, childRef).then(function (newKey) {
            console.info(childRef + ' item adicionado');
            showHabilidade(newKey);
            toastr["success"]("Adicionado: " + newItem.texto);
        }, function (error) {
            console.error(childRef + error);
            toastr["danger"]("Erro ao tentar adicionar: " + newItem.texto);
        })
        $scope.showHideForm();
    }

    $scope.remove = function (id) {
        databaseService.deleteByIdAsync(id, childRef).then(function () {
            console.info('item removido');
            toastr["warning"]("Removido");
        }, function (error) {
            console.error(error);
            toastr["danger"]('Erro ao tentar remover');
        });
    }

    $scope.cancel = function () {
        $scope.showHideForm();
        toastr["warning"]("Cancelado");
    }

    $scope.fillFormObject = function (item) {
        $scope.item = {
            id: item.$id,
            timeid: item.timeid,
            texto: item.texto,
            valor: item.valor
        }
        $scope.formIsOpen = true;
    };

    $scope.addButtonLabel = function () {
        return $scope.formIsOpen ? ($scope.item.id ? 'Cancelar edição de :' + $scope.item.texto : 'Cancelar') : msgaddButtonLabel;
    }

    $scope.update = function () {
        var updateItem = {
            timeid: $scope.item.timeid,
            texto: $scope.item.texto,
            valor: $scope.item.valor
        };

        databaseService.updateByIdAsync($scope.item.id, updateItem, childRef).then(function (data) {
            toastr["success"]("Editado");
            console.log('Editado');
            $scope.showHideForm();
            showHabilidade(null);
            $scope.$apply();
        }, function (error) {
            console.error(error);
            toastr["danger"]('Erro ao tentar editar');
        })
    }

    $scope.showHideForm = function () {
        if ($scope.formIsOpen) {
            $scope.formIsOpen = false;
            resetFormObject();
        }
        else {
            $scope.formIsOpen = true;
        }
    };
});