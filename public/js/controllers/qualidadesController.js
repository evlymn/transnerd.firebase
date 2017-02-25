
modulo.controller('qualidadesController', function ($scope, $rootScope, $firebaseArray) {
    var childRef = "qualidades";
    var msgaddButtonLabel = "Adicionar nova qualidade";
    var databaseRef = firebase.database().ref();

    $scope.formIsOpen = false;
    $scope.items = [];

    resetFormObject();

    function resetFormObject() {
        $scope.item = {
            texto: ''
        }
    }

    getItemsFromDb();

    function getItemsFromDb() {
        $scope.items = $firebaseArray(databaseRef.child(childRef));
        console.log('get data ' + childRef);
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
            texto: $scope.item.texto
        }
        var newKey = firebase.database().ref().child(childRef).push().key;
        updateNode = {};
        updateNode['/' + childRef + '/' + newKey] = newItem;
        databaseRef.update(updateNode);
        toastr["success"]("Adicionado: " + $scope.item.texto);
        $scope.showHideForm();
    }

    $scope.remove = function (item) {
        databaseRef.child(childRef + "/" + item.$id).remove();
        console.log('item removido');
        toastr["warning"]("Removido: " + item.texto);
    }

    $scope.cancel = function () {
        $scope.showHideForm();
        toastr["warning"]("Cancelado");
    }

    $scope.fillFormObject = function (item) {
        $scope.item = {
            id: item.$id,
            timeid: item.timeid,
            texto: item.texto
        }
        $scope.formIsOpen = true;
    };

    $scope.addButtonLabel = function () {
        return $scope.formIsOpen ? ($scope.item.id ? 'Cancelar edição de :' + $scope.item.texto : 'Cancelar') : msgaddButtonLabel;
    }

    $scope.update = function () {
        var updateItem = {
            timeid: $scope.item.timeid,
            texto: $scope.item.texto
        };

        updateNode = {};
        updateNode['/' + childRef + '/' + $scope.item.id] = updateItem;
        databaseRef.update(updateNode);
        toastr["success"]("Atualizado: " + $scope.item.texto);
        console.log('atualizado');
        $scope.showHideForm();
        showHabilidade(null);
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