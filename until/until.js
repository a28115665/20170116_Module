exports.FindID = function(pSession){
    let _id = null;

    if(pSession['key'] != undefined){
        _id = pSession['key'].U_ID
    }

    return _id;
}