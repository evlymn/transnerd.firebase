
modulo.service('databaseService', ['$firebaseArray', function ($firebaseArray) {

    var databaseRef = firebase.database().ref();
    var childRef = "";

    this.setChildRef = function (childRef) {
        this.childRef = childRef;
    };

    this.createAsync = async function (item) {
        var newKey = firebase.database().ref().child(this.childRef).push().key;
        newItem = {};
        newItem['/' + this.childRef + '/' + newKey] = item;
        databaseRef.update(newItem);
        return newKey;
    }

    this.deleteByIdAsync = async function (id) {
        databaseRef.child(this.childRef + "/" + id).remove();
    }

    this.updateByIdAsync = async function (id, item) {
        updateNode = {};
        updateNode['/' + this.childRef + '/' + id] = item;
        databaseRef.update(updateNode);
    }

    this.retrievelAllAsync = async function () {
        return $firebaseArray(databaseRef.child(this.childRef));
    }

}]);

