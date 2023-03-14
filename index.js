const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const data = require("./data");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.listen(port, () => console.log(`App listening on port ${port}!`))

app.get("/totalRecovered", async (req, res) => {
    try {
        const data = await connection.find();
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            total += data[i].recovered;
        }
        res.status(200).json({
            data: { _id: "total", recovered: total },
        })
    } catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}
)

app.get("/totalActive", async (req, res) => {
    try {
        const data = await connection.find();
        let cases = 0;
        for (let i = 0; i < data.length; i++) {
            cases += data[i].infected - data[i].recovered;
            //console.log(cases);
        }
        res.status(200).json({
            data: { _id: "total", active: cases },
        })
    } catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}
)

app.get("/totalDeath", async (req, res) => {
    try {
        const data = await connection.find();
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            total += data[i].death;
            //console.log(data[i].recovered);
        }
        res.status(200).json({
            data: { _id: "total", death: total },
        })
    } catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}
)

app.get("/hotspotStates", async (req, res) => {
    try {
        const data = await connection.find();
        let rate = 0;
        let states = [];
        for (let i = 0; i < data.length; i++) {

            // ((infected - recovered)/infected)
            rate = ((data[i].infected - data[i].recovered)/data[i].infected);
            if(rate > 0.1){
                states.push({state: data[i].state, rate: rate .toFixed(5)} )
            }
            //console.log(data[i].recovered);
        }
        res.status(200).json({
            data: states,
        })
    } catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}
)


app.get("/healthyStates", async(req, res) => {
    try {
        const data = await connection.find();
        let mortality  = 0;
        let states = [];
        for (let i = 0; i < data.length; i++) {

            mortality  = data[i].death / data[i].infected;
            if(mortality < 0.005){
                states.push({state: data[i].state, mortality : mortality.toFixed(5)} )
            }
        }
        res.status(200).json({
            data: states,
        })
    } catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}
)

module.exports = app;