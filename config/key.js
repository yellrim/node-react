if(process.env.NODE_ENV === "porduction"){
    module.exports = require('./prod');
}else{
    module.exports = require('./dev');
}