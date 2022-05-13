const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const authRouter = require("./routes/auth.routes")
const app = express() // creating a server
const PORT = config.get('serverPort')

app.use(express.json())
app.use("/api/auth", authRouter)

//function that connects to the DB and launches the server
const start = async  () => {
    try {                      // block to catch potential errors
        mongoose.connect(config.get("dbUrl"))

        app.listen(PORT, () => {
            console.log("Server started on port", PORT)
        })
    } catch (e) {

    }
}

start()