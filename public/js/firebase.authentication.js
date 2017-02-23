// //(function () {
//     modulo.controller('postCtrl', ['$scope','$firebaseArray',
//         function ($scope,$firebaseArray) {
//             function logou(firebaseUser, showT) {
//                 $scope.user = firebaseUser;
//                 $scope.oAuth = null;
//                 $scope.logado = true;
//                 $scope.$apply();
//                 if (showT)
//                     toastr["success"]("Você logou");
//             }

//             $scope.login = function () {
//                 firebase.auth().signInWithEmailAndPassword($scope.oAuth.email, $scope.oAuth.senha)
//                     .then(function (firebaseUser) {
//                         logou(firebaseUser, true);
//                     })
//                     .catch(function (error) {
//                         toastr["danger"]("erro ao logar");
//                         console.log(error)
//                     });
//             }

//             function deslogou(showT) {
//                 $scope.user = null;
//                 $scope.oAuth = null;
//                 $scope.logado = false;
//                 $scope.$apply();
//                 if (showT)
//                     toastr["warning"]("Você deslogou")
//             }

//             $scope.logout = function () {
//                 firebase.auth().signOut()
//                     .then(function () {
//                         deslogou(true);
//                     }, function (error) {
//                         toastr["danger"]("erro ao deslogar");
//                         console.log(error);
//                     });
//             }

//             firebase.auth().onAuthStateChanged(function (user) {
//                 if (user) {
//                     logou(user, false)
//                 } else {
//                     deslogou(false)
//                 }
//             });

//         }]);
// //})();