module.exports = function (){
    if (!process.env.TOKEN_SECRET){
        throw new Error("FATAL ERROR: Token secret is not defined");
    }
}
