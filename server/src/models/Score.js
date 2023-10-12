const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  playedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  difficulty: {
    type: Schema.Types.ObjectId,
    ref: "Difficulty",
    required: true,
  }, // flower / bamboo / tree / oni / hidden oni
  song: { type: Schema.Types.ObjectId, ref: "Song", required: true }, // song should reference game
  scoreValue: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  songName: { type: String, required: true },
  difficulty: { type: String, enum: difficultyEnum, required: true },
  score: { type: Number, required: true },
  grade: { type: String, enum: gradeEnum, required: true },
  clear: { type: String, enum: clearEnum, required: true },
  stats: {
    good: { type: Number, required: true },
    ok: { type: Number, required: true },
    bad: { type: Number, required: true },
    drumroll: { type: Number, required: true },
  },
  maxCombo: { type: Number, required: true },
  version: { type: String, enum: versionEnum, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
