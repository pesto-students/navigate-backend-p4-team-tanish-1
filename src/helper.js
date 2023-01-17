function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
}

module.exports = { toTimestamp }