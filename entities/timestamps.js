var Timestamps = {
    CreatedAt: {type: Date, default:Date.now()},
    UpdatedAt: {type: Date, default:Date.now()}
};

if (Timestamps) {
    Timestamps.UpdatedAt = Date.now()
    if (Timestamps.CreatedAt === 0) {
        Timestamps.CreatedAt === Timestamps.UpdatedAt
    }

}


module.exports = Timestamps;