
modulo.controller('habilidadesController', function ($scope, $rootScope, $firebaseArray) {
    $scope.formIsOpen = false;
    $scope.habilidades = [];
    var databaseRef = firebase.database().ref();
    resetForm();

    function resetForm() {
        $scope.item = {
            texto: '',
            valor: 0.5
        }
    }
    
    getData();

    function getData() {
        $scope.habilidades = $firebaseArray(databaseRef.child("habilidades"));
        console.log('get data');
    }

    $scope.habilidades.$loaded().then(function () {
        showHabilidade();
    });

    $scope.save = function () {
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
        var newKey = firebase.database().ref().child('habilidades').push().key;
        updateNode = {};
        updateNode['/habilidades/' + newKey] = newItem;
        databaseRef.update(updateNode);
        console.log(newKey);
        $scope.showHideForm();

        showHabilidade(newKey);
    }

    $scope.remove = function (item) {
        databaseRef.child("habilidades/" + item.$id).remove();
        console.log('item removido');
        toastr["warning"]("Removido: " + item.texto);
    }

    $scope.cancel = function () {
        $scope.showHideForm();
        toastr["warning"]("Cancelado");
    }


    $scope.fillEditForm = function (item) {
        $scope.item = {
            id: item.$id,
            timeid: item.timeid,
            texto: item.texto,
            valor: item.valor
        }
        $scope.formIsOpen = true;
    };

    $scope.labelAddHabilidadeButton = function () {

        return $scope.formIsOpen ? ($scope.item.id ? 'Cancelar edição de :' + $scope.item.texto : 'Cancelar') : 'Adicionar nova habilidade';
    }

    $scope.update = function () {
        var updateItem = {
            timeid: $scope.item.timeid,
            texto: $scope.item.texto,
            valor: $scope.item.valor
        };

        updateNode = {};
        updateNode['/habilidades/' + $scope.item.id] = updateItem;
        databaseRef.update(updateNode);
        toastr["success"]("Atualizado: " + $scope.item.texto);
        console.log('atualizado');
        $scope.showHideForm();
        showHabilidade();
    }

    $scope.showHideForm = function () {
        if ($scope.formIsOpen) {
            $scope.formIsOpen = false;
            resetForm();
        }
        else {
            $scope.formIsOpen = true;
        }
    };
});