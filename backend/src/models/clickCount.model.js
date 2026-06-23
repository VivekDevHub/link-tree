// Importing modules
import mongoose from "mongoose";

// Defining the click count schema
const clickCountSchema = new mongoose.Schema(
    {
        linkId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Link",
            required : true
        },
        username : {
            type : String,
            required : true,
            trim : true
        }
    },
    {
        timestamps : true
    }
);

// Indexing linkId and username for faster queries
clickCountSchema.index({ linkId: 1 });
clickCountSchema.index({ username: 1 });

// Exporting the click count model
const ClickCount = mongoose.model("ClickCount", clickCountSchema);
export default ClickCount;