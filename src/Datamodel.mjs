import mongoose from "mongoose";

class ElectionSchema {
    elecId = "";
    model() {
        return mongoose.model(this.elecId, new mongoose.Schema({
            index: Number,
            timestemp: Date,
            nonce: Number,
            data: {
                candidate: {
                    candiId: Number,
                    candiName: String
                  },
                  student: {
                    studentId: Number,
                    studentCode: String,
                    studentName: String
                  }
            },
            previous_hash: String,
            hash: String
        }), this.elecId, { overwriteModels: true });
    }
}

// const blockchainData = new mongoose.Schema({
//     index: Number,
//     timestemp: Date,
//     nonce: Number,
//     data: {
//         candiId: Number,
//         studentId: Number
//     },
//     previous_hash: String,
//     hash: String
// });

// function test() {
//     return mongoose.model('9', blockchainData);
// }

export default ElectionSchema;
// export default mongoose.model(electionSchema.elecId, electionSchema.blockchainInData);
// export default test