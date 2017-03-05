
modulo.controller('experienciasController',
    function ($scope, $rootScope, $sce, htmlService, databaseService, logService) {
        var childRef = "experiencias";
        $scope.htmlService = htmlService;
        $scope.children = null;
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
            $scope.formObject = null;
            $scope.formObject = {
                datainicio: new Date(),
                datasaida: new Date()
            };
        }

        function getDataFromDB() {
            databaseService.retrievelAllAsync(childRef).then(function (data) {
                $scope.children = data;
                $scope.$apply();
                $scope.children.$loaded().then(function () {
                    logService.logRef(childRef, 'children carregados');
                });
            }, function (error) {
                console.log(error);
            });
        }

        $scope.createChildFromForm = function () {
            var child = {
                datainicio: moment($scope.formObject.datainicio).valueOf(),
                timeid: moment($scope.formObject.timeid).valueOf(),
                texto: angular.isUndefined($scope.formObject.texto) ? '' : $scope.formObject.texto,
                empresa: angular.isUndefined($scope.formObject.empresa) ? '' : $scope.formObject.empresa,
                cargo: angular.isUndefined($scope.formObject.cargo) ? '' : $scope.formObject.cargo,
            };
            if ($scope.formObject.datasaida)
                child.datasaida = moment($scope.formObject.datasaida).valueOf();

            if ($scope.formObject.id) {
                updateToDb(child);
            }
            else {
                saveToDb(child);
            }
        }

        function saveToDb(child) {
            databaseService.createAsync(child, childRef).then(function (newKey) {
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

        $scope.updateFormObject = function (child) {
            $scope.formOpen = true;
            $scope.formObject = {
                id: child.$id,
                datainicio: new Date(child.datainicio),
                datasaida: child.datasaida ? new Date(child.datasaida) : null,
                timeid: new Date(child.timeid).getTime(),
                texto: angular.isUndefined(child.texto) ? '' : child.texto,
                cargo: angular.isUndefined(child.empresa) ? '' : child.cargo,
                empresa: angular.isUndefined(child.empresa) ? '' : child.empresa
            }
        }

        function updateToDb(child) {
            $scope.formOpen = null;
            databaseService.updateByIdAsync($scope.formObject.id, child, childRef).then(function (data) {
                toastr["success"]("Editado");
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

        $scope.formatDatePeriod = function (dataInicio, dataSaida) {

            if (dataInicio > dataSaida)
                return "";

            var nowOrNever = dataSaida ? moment(dataSaida) : moment();
            var periodo = parseInt(nowOrNever.diff(moment(dataInicio), 'months', true));

            if (periodo == 0) {
                periodo = parseInt(nowOrNever.diff(moment(dataInicio), 'days', true));
                periodo = periodo + (periodo > 0 ? (periodo == 1 ? ' dia' : ' dias') : '');
            }
            else {
                periodo = periodo + (periodo == 1 ? ' mês' : ' meses');
            }

            var returnText = moment(dataInicio).format('MMMM [de] YYYY');

            if (dataSaida && (moment(dataInicio).year() == moment(dataSaida).year()))
                returnText = moment(dataInicio).format('MMMM');

            if (dataSaida)
                returnText += moment(dataSaida).format(' [até] MMMM [de] YYYY') + ' ' + " - <b>" + periodo + "</b>";
            else
                returnText += " - <b>" + periodo + " (atual)</b>";

            return returnText;
        }

        $scope.formatDate = function (date, format) {
            return moment(date).format(format)
        }



        $scope.convertToDate = function (stringDate) {
            var dateOut = new Date(stringDate);
            dateOut.setDate(dateOut.getDate() + 1);
            return dateOut;
        };
    });