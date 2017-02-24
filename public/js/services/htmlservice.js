
modulo.service('htmlService', ['$sce', function ($sce) {
    this.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);