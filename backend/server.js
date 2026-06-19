import app from "./src/app";
import connectDB from "./src/db/mongoose";

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});