
modulo.controller('avatarController', function ($scope, $rootScope, $firebaseArray, databaseService) {
    var childRef = "avatares";
    $scope.newImage = '';
    $scope.croppedAvatar = '';
    $scope.filename = '';
    $scope.totalUp = 0;
    $scope.avatares = [];
 
    getFromDB();
    function getFromDB() {
        databaseService.retrievelimitToLastAsync(1, childRef).then(function (data) {
            $scope.avatares = data;
            $scope.$apply();
            console.log('get data ' + childRef);
        }, function (error) {
            console.log(error);
            console.log('erro ' + childRef);
        });
    }

    var handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        console.log(file.type);
        if (file.type != 'image/jpg' && file.type != 'image/png' && file.type != 'image/jpeg') {
            toastr["warning"]("Tipo de arquivo não permitido");
            return false
        }

        $scope.filename = file.name;
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.newImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };

    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

    $scope.putImage = function () {
        $scope.enviando = true;
        var storageRef = firebase.storage().ref();
        console.log($scope.filename);
        var imageRef = storageRef.child('avatar/' + $scope.filename);
        var uploadTask = imageRef.putString($scope.croppedAvatar, 'data_url');
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                $scope.totalUp = progress;
                console.log('Upload is ' + progress + '% done');
                $scope.$apply();
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                console.log(error);
            }, function () {
                var downloadURL = uploadTask.snapshot.downloadURL;
                console.log(downloadURL);
                pushAvatar(downloadURL)
                $scope.enviando = false;
                $scope.$apply();
            });
    }

    function pushAvatar(url) {
        var avatar = {
            datacadastro: new Date().getTime(),
            avatarUrl: url
        };
      databaseService.createAsync(avatar, childRef).then(function (newKey) {
            console.info(childRef + ' item adicionado');
            toastr["success"]("Adicionado: " + newItem.texto);
        }, function (error) {
            console.error(childRef + error);
            toastr["danger"]("Erro ao tentar adicionar: " + newItem.texto);
        })  
        
        $scope.openAvatarEdit();
    }


    $scope.showAvatarEditDiv = function () {
        return $rootScope.logado && $scope.editAvatar
    }

    $scope.openAvatarEdit = function () {
        if ($scope.editAvatar) {
            $scope.editAvatar = null;
            $scope.croppedAvatar = null;

            $scope.newImage = null;
        }
        else
            $scope.editAvatar = true;
    }
});