import Mongoose from "mongoose";

const applicationSchema = new Mongoose.Schema({
    jobId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

const Application = Mongoose.model("Application", applicationSchema) || Mongoose.models.Application;

export default Application;
