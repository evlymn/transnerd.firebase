


modulo.controller('postController',
    function ($scope, $rootScope, $sce, htmlService, databaseService) {
        var childRef = "postagens";
        $scope.htmlService = htmlService;
        $scope.postagens = [];

        resetPostObject();
        getPostFromDB();


        $scope.showPostForm = function () {
            if ($scope.postForm)
                $scope.postForm = null;
            else
                $scope.postForm = true;
        };

        function resetPostObject() {
            $scope.post = {
                data: new Date(),
                datacadastro: new Date().getTime().toString()
            };

            console.log('post object resetado');
        }

        function getPostFromDB() {
            databaseService.retrievelAllAsync(childRef).then(function (data) {
                $scope.postagens = data;
                $scope.$apply();
                console.log('get data ' + childRef);
            }, function (error) {
                console.log(error);
                console.log('erro ' + childRef);
            });
        }

        $scope.savePost = function () {
            var post = {
                data: $scope.post.data.toUTCString(),
                datacadastro: $scope.post.data.getTime(),
                texto: angular.isUndefined($scope.post.texto) ? '' : $scope.post.texto,
                titulo: angular.isUndefined($scope.post.titulo) ? '' : $scope.post.titulo,
                local: angular.isUndefined($scope.post.local) ? '' : $scope.post.local,
            };

            if ($scope.post.id) {
                updatePost(post);
            }
            else {
                pushPost(post);
            }

        }

        function pushPost(newItem) {
            databaseService.createAsync(newItem, childRef).then(function (newKey) {
                console.info(childRef + ' item adicionado');
                toastr["success"]("Adicionado");
                $scope.showPostForm();
                resetPostObject();
                $scope.$apply();

            }, function (error) {
                console.error(childRef + error);
                toastr["danger"]("Erro ao tentar adicionar");
                $scope.$apply();
                $scope.showPostForm();
                resetPostObject();
            })
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

        $scope.updatePostObject = function (item) {
            $scope.postForm = true;
            resetPostObject();
            $scope.post.id = item.$id;
            console.log($scope.post.id);
            $scope.post.data = new Date(item.data);
            $scope.post.datacadastro = new Date(item.data).getTime(),
                $scope.post.texto = angular.isUndefined(item.texto) ? '' : item.texto;
            $scope.post.titulo = angular.isUndefined(item.titulo) ? '' : item.titulo;
            $scope.post.local = angular.isUndefined(item.local) ? '' : item.local;
        }

        function updatePost(post) {
            $scope.postForm = null;

            databaseService.updateByIdAsync($scope.post.id, post, childRef).then(function (data) {
                toastr["success"]("Editado");
                console.log('Editado');
                $scope.$apply();
            }, function (error) {
                console.error(error);
                toastr["danger"]('Erro ao tentar editar');
            })
        }

        $scope.cancelUpdate = function () {
            $scope.postForm = null;
            resetPostObject();
            toastr["warning"]("Update cancelado");
            console.log('update cancelado');
        }

        $scope.convertToDate = function (stringDate) {
            var dateOut = new Date(stringDate);
            dateOut.setDate(dateOut.getDate() + 1);
            return dateOut;
        };
    });