//David Holcer ?

const app = require("./app");
const connectDB = require("./lib/mongodb");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});