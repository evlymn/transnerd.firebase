
        

        modulo.controller('postController', ['$scope', '$rootScope', '$sce', '$firebaseArray', 'htmlService',
            function ($scope, $rootScope, $sce, $firebaseArray, htmlService) {
                $scope.htmlService = htmlService;
                var databaseRef = firebase.database().ref();
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
                    $scope.postagens = $firebaseArray(databaseRef.child("postagens"));
                     console.log('get posts from database');
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
                    resetPostObject();
                }

                function pushPost(post) {
                    databaseRef.child("postagens").push(post);
                    toastr["success"]("Adicionado: " + post.titulo);
                }
                $scope.remove = function (item) {
                    databaseRef.child("postagens/" + item.$id).remove();
                    console.log('item removido');
                    toastr["warning"]("Removido: " + item.titulo);
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
                    var postUpdate = {};
                    postUpdate['/postagens/' + $scope.post.id] = post;
                    databaseRef.update(postUpdate);
                    toastr["success"]("Registro atualizado: " + post.titulo);
                    console.log('atualizado');
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
            }]);