const { Schema, model, Types } = require("mongoose");

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "USER_REGISTER",
        "USER_LOGIN",
        "USER_LOGOUT",
        "VOTE_CAST",
        "ELECTION_CREATED",
        "ELECTION_UPDATED",
        "ELECTION_DELETED",
        "CANDIDATE_CREATED",
        "CANDIDATE_UPDATED",
        "CANDIDATE_DELETED",
        "ADMIN_ACTION",
      ],
    },
    user: {
      type: Types.ObjectId,
      ref: "Voter",
      required: true,
    },
    target: {
      type: Types.ObjectId,
      refPath: "targetModel",
    },
    targetModel: {
      type: String,
      enum: ["Voter", "Election", "Candidate", "Vote"],
    },
    details: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    deviceFingerprint: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Index for efficient querying
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = model("AuditLog", auditLogSchema);
