import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

const app = express();
app.use(express.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/v1/healthcheck", (req, res) => {
    res.json({
        status: "ok",
    });
});

const puerto =  3000;
app.listen(puerto, () => {
    console.log("El servidor inicio en el puerto " + puerto);
});


