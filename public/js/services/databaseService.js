
modulo.service('databaseService', ['$firebaseArray', function ($firebaseArray) {

    var databaseRef = firebase.database().ref();
    
    this.createAsync = async function (item, childRef) {
        var newKey = firebase.database().ref().child(this.childRef).push().key;
        newItem = {};
        newItem['/' + childRef + '/' + newKey] = item;
        databaseRef.update(newItem);
        return newKey;
    }

    this.deleteByIdAsync = async function (id,childRef) {
        databaseRef.child(childRef + "/" + id).remove();
    }

    this.updateByIdAsync = async function (id, item,childRef) {
        updateNode = {};
        updateNode['/' + childRef + '/' + id] = item;
        databaseRef.update(updateNode);
    }

    this.retrievelAllAsync = async function (childRef) {
        return $firebaseArray(databaseRef.child(childRef));
    }

}]);

