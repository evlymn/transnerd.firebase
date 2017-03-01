modulo.service('logService', function () {
    this.logRef = function (ref, message) {
        console.info('[' + ref + ']\n' + message)
    };
});