
modulo.controller('postController',
    function ($scope, $rootScope, $sce, htmlService, databaseService) {
        var childRef = "postagens";
        $scope.htmlService = htmlService;
        $scope.children = [];
        $scope.moment = moment;
        resetFormObject();
        getDataFromDB();

        $scope.showHideForm = function () {
            resetFormObject();
            if ($scope.formOpen)
                $scope.formOpen = null;
            else
                $scope.formOpen = true;
        };

        function resetFormObject() {
            $scope.formObject = {
                data: new Date(),
                datacadastro: new Date().getTime().toString()
            };
        }

        function getDataFromDB() {
            databaseService.retrievelAllAsync(childRef).then(function (data) {
                $scope.children = data;
                $scope.$apply();
                $scope.children.$loaded().then(function () {
                    console.log('postagens carregadas');
                });
                console.log('get data ' + childRef);
            }, function (error) {
                console.log(error);
                console.log('erro ' + childRef);
            });
        }

        $scope.createChildFromForm = function () {
            var child = {
                data: $scope.formObject.data.toUTCString(),
                datacadastro: $scope.formObject.data.getTime(),
                texto: angular.isUndefined($scope.formObject.texto) ? '' : $scope.formObject.texto,
                titulo: angular.isUndefined($scope.formObject.titulo) ? '' : $scope.formObject.titulo,
                local: angular.isUndefined($scope.formObject.local) ? '' : $scope.formObject.local,
            };

            if ($scope.formObject.id) {
                updateToDb(child);
            }
            else {
                saveToDb(child);
            }
        }

        function saveToDb(newItem) {
            databaseService.createAsync(newItem, childRef).then(function (newKey) {
                console.info(childRef + ' item adicionado');
                toastr["success"]("Adicionado");
                $scope.showHideForm();
                resetFormObject();
                $scope.$apply();

            }, function (error) {
                console.error(childRef + error);
                toastr["danger"]("Erro ao tentar adicionar");
                $scope.$apply();
                $scope.showHideForm();
                resetFormObject();
            })
        }

        $scope.removeFromDb = function (id) {
            databaseService.deleteByIdAsync(id, childRef).then(function () {
                console.info('item removido');
                toastr["warning"]("Removido");
            }, function (error) {
                console.error(error);
                toastr["danger"]('Erro ao tentar remover');
            });
        }

        $scope.updateFormObject = function (item) {
            $scope.formOpen = true;
            resetFormObject();
            $scope.formObject = {
                id: item.$id,
                data: new Date(item.data),
                datacadastro: new Date(item.data).getTime(),
                texto: angular.isUndefined(item.texto) ? '' : item.texto,
                titulo: angular.isUndefined(item.titulo) ? '' : item.titulo,
                local: angular.isUndefined(item.local) ? '' : item.local
            }
        }

        function updateToDb(post) {
            $scope.formOpen = null;

            databaseService.updateByIdAsync($scope.formObject.id, post, childRef).then(function (data) {
                toastr["success"]("Editado");
                console.log('Editado');
                $scope.$apply();
            }, function (error) {
                console.error(error);
                toastr["danger"]('Erro ao tentar editar');
            })
        }

        $scope.cancelUpdate = function () {
            $scope.formOpen = null;
            resetFormObject();
            toastr["warning"]("Update cancelado");
            console.log('update cancelado');
        }

        $scope.convertToDate = function (stringDate) {
            var dateOut = new Date(stringDate);
            dateOut.setDate(dateOut.getDate() + 1);
            return dateOut;
        };
        $scope.getTextToShowHideFormButton = function () {
            return formOpen ? 'Cancelar postagem' : 'Adicionar nova postagem';
        }
    });