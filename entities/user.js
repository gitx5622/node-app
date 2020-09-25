var User = {
    ID: Int32Array,
    FirstName: String,
    LastName: String,
    Username: [String],
    Email: String,
    PasswordHash: String,
    Token: String ,
    CreatedAt: {type: Date, default:Date.now},
    UpdatedAt: {type: Date, default:Date.now}
};

module.exports = User;