modulo.controller('loginController', ['$scope', '$rootScope', '$firebaseArray', function ($scope, $rootScope, $firebaseArray) {
            $scope.showFormLogin = function () {
                if ($rootScope.login)
                    $rootScope.login = null;
                else
                    $rootScope.login = {};
            }

            function LoggedIn(firebaseUser, showT) {
                $scope.user = firebaseUser;
                $rootScope.login = null;
                $rootScope.logado = true;
                $scope.$apply();
                if (showT)
                    toastr["success"]("Você logou");
            }

            $scope.doLogin = function () {
                firebase.auth().signInWithEmailAndPassword($rootScope.login.email, $rootScope.login.senha)
                    .catch(function (error) {
                        toastr["danger"]("erro ao logar");
                        console.log(error)
                    })
                    .then(function (firebaseUser) {
                        LoggedIn(firebaseUser, true);
                    });
            }

            function LoggedOut(showT) {
                $scope.user = null;
                $rootScope.login = null;
                $rootScope.logado = false;
                $scope.$apply();
                if (showT)
                    toastr["warning"]("Você deslogou")
            }

            $scope.doLogout = function () {
                firebase.auth().signOut()
                    .then(function () {
                        LoggedOut(true);
                    }, function (error) {
                        toastr["danger"]("erro ao deslogar");
                        console.log(error);
                    });
            }

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    LoggedIn(user, false)
                } else {
                    LoggedOut(false)
                }
            });
        }]);