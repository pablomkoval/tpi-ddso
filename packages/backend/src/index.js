import express from "express";

const app = express();
app.use(express.json());

app.get("/v1/healthcheck", (req, res) => {
    res.json({
        status: "ok",
    });
});

const puerto = 3000;
app.listen(puerto, () => {
    console.log("El servidor inicio en el puerto " + puerto);
});
