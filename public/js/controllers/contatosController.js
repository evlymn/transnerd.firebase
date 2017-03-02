
modulo.controller('contatosController', function ($scope, $rootScope, databaseService) {
    var childRef = "contatos";
    $scope.formOpen = false;
    $scope.children = [];
    $scope.formObject = {};
    resetFormObject();

    function resetFormObject() {
        $scope.formObject = {
            tipo: 'number',
            descricao: null,
            contato: null,
            telefone:null,
            url:null,
            email:null
        }
    }

    $scope.createChildFromForm = function () {
        var child = {
            timeid: $scope.formObject.timeid ? $scope.formObject.timeid : moment().valueOf(),
            contato: $scope.formObject.contato,
            tipo: $scope.formObject.tipo,
            descricao: $scope.formObject.descricao
        }

        if ($scope.formObject.id) {
            $scope.updateToDb(child);
        } else {
            $scope.saveToDb(child);
        }
    }

    getItemsFromDb();

    function getItemsFromDb() {
        databaseService.retrievelAllAsync(childRef).then(function (data) {
            $scope.children = data;
            $scope.$apply();
            $scope.children.$loaded().then(function () {
                console.log($scope.children);
            });
        }, function (error) {
            console.log(error);
        });
    }

    $scope.saveToDb = function (child) {
        databaseService.createAsync(child, childRef).then(function (newKey) {
            console.info(childRef + ' item adicionado');
            toastr["success"]("Adicionado: " + newItem.texto);
        }, function (error) {
            console.error(childRef + error);
            toastr["danger"]("Erro ao tentar adicionar: " + newItem.texto);
        })

        $scope.showHideForm();
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

    $scope.updateToDb = function (child) {
        databaseService.updateByIdAsync($scope.formObject.id, child, childRef).then(function () {
            toastr["success"]("Editado");
            $scope.showHideForm();
        }, function (error) {
            console.error(error);
            toastr["danger"]('Erro ao tentar editar');
        })
    }

    $scope.cancelUpdate = function () {
        $scope.showHideForm();
        toastr["warning"]("Cancelado");
    }

    $scope.updateFormObject = function (child) {
        $scope.formObject = {
            id: child.$id,
            timeid: child.timeid,
            tipo: child.tipo,
            descricao: child.descricao,
            contato: child.contato,
            telefone: isNaN(child.contato) ? null : parseInt(child.contato),
            url: child.contato,
            email: child.contato
        }
        $scope.formOpen = true;
    };

    $scope.showHideForm = function () {
        if ($scope.formOpen) {
            $scope.formOpen = false;
            resetFormObject();
        }
        else {
            $scope.formOpen = true;
        }
    };

    $scope.$watch('formObject.url', function () {
        $scope.formObject.contato = $scope.formObject.url;
    });

    $scope.$watch('formObject.telefone', function () {
        $scope.formObject.contato = $scope.formObject.telefone ? $scope.formObject.telefone.toString() : '';
    });

    $scope.$watch('formObject.email', function () {
        $scope.formObject.contato = $scope.formObject.email;
    });

    $scope.setContatoInputType = function (tipo) {
        if ($scope.formObject.id) {
            $scope.formObject.telefone = null;
            $scope.formObject.url = null;
            $scope.formObject.email = null;
        }
        else
            resetFormObject();

        $scope.formObject.tipo = tipo;
        document.querySelector('#contatourlInput').value = '';
        document.querySelector('#contatonumberInput').value = '';
        document.querySelector('#contatoemailInput').value = '';
        angular.element(document.querySelector('#contatoDescInput')).focus();
    }

    $scope.getShowHideFormButtonText = function () {
        return $scope.formOpen ? 'Cancelar contato' : 'Adicionar novo contato';
    }

    $scope.formatContatoUrl = function (url) {
        url = url.toLowerCase().replace('https://www.', '').replace('http://www.', '').replace('https://', '').replace('http://', '');
        if (url.toLowerCase().indexOf("youtube.com/channel") !== -1)
            url = "youtube.com/channel";

        return url;
    }

    $scope.getContatoIcon = function (url, tipo) {
        var icone = 'fa fa-address-card';

        if (tipo == 'url') {
            if (url.toLowerCase().indexOf("medium.com") !== -1)
                icone = 'fa fa-medium';
            else if (url.toLowerCase().indexOf("youtube.com") !== -1)
                icone = 'fa fa-youtube';
            else if (url.toLowerCase().indexOf("facebook.com") !== -1)
                icone = 'fa fa-facebook-official';
            else if (url.toLowerCase().indexOf("github.com") !== -1)
                icone = 'fa fa-github';
            else if (url.toLowerCase().indexOf("linkedin.com") !== -1)
                icone = 'fa fa-linkedin-square';
            else if (url.toLowerCase().indexOf("plus.google.com") !== -1)
                icone = 'fa fa-google-plus';
            else if (url.toLowerCase().indexOf("bitbucket.org") !== -1)
                icone = 'fa fa-bitbucket';
            else if (url.toLowerCase().indexOf("twitter.com") !== -1)
                icone = 'fa fa-twitter'
            else if (url.toLowerCase().indexOf("instagram.com") !== -1)
                icone = 'fa fa-instagram'
            else if (url.toLowerCase().indexOf("skype:") !== -1)
                icone = 'fa fa-skype'
        } else if (tipo == 'number') {
            icone = 'fa fa-phone';
        } else if (tipo == 'email') {
            icone = 'fa fa-envelope-o';
        }
        return icone;
    }
});