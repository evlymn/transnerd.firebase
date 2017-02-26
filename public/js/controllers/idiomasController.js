
modulo.controller('idiomasController', function ($scope, $rootScope, databaseService) {
    var childRef = "idiomas";
    var msgaddButtonLabel = "Adicionar novo idioma";
    var databaseRef = firebase.database().ref();
    databaseService.setChildRef(childRef);
    $scope.formIsOpen = false;
    $scope.items = [];

    resetFormObject();

    function resetFormObject() {
        $scope.item = {
            texto: '',
            valor: 10
        }
    }

    $scope.setSaveMethod = function () {
        if ($scope.item.id) {
            $scope.update();
        } else {
            $scope.add();
        }
    }

    getItemsFromDb();

    function getItemsFromDb() {
        databaseService.retrievelAllAsync().then(function (data) {
            $scope.items = data;
            $scope.$apply();
            console.log('get data ' + childRef);
        }, function (error) {
            console.log(error);
            console.log('erro ' + childRef);
        });
    }

    $scope.add = function () {
        var newItem = {
            timeid: new Date().getTime(),
            texto: $scope.item.texto,
            valor: $scope.item.valor
        }

        databaseService.createAsync(newItem).then(function (newKey) {
            console.info(childRef + ' item adicionado');
            console
            toastr["success"]("Adicionado: " + newItem.texto);
        }, function (error) {
            console.error(childRef + error);
            toastr["danger"]("Erro ao tentar adicionar: " + newItem.texto);
        })

        $scope.showHideForm();
    }

    $scope.remove = function (id) {
        databaseService.deleteByIdAsync(id).then(function () {
            console.info('item removido');
            toastr["warning"]("Removido");
        }, function (error) {
            console.error(error);
            toastr["danger"]('Erro ao tentar remover');
        });
    }

    $scope.update = function () {
        var updateItem = {
            timeid: $scope.item.timeid,
            texto: $scope.item.texto,
            valor: $scope.item.valor
        };
        databaseService.updateByIdAsync($scope.item.id, updateItem).then(function () {
            toastr["success"]("Editado");
            console.log('Editado');
            $scope.showHideForm();
            showHabilidade(null);
        }, function (error) {
            console.error(error);
            toastr["danger"]('Erro ao tentar editar');
        })
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