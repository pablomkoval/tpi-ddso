import express from "express";

const healthcheckRouter = express.Router();

healthcheckRouter.get("/", (req, res) => {
    res.json({
        status: "ok",
    });
});

export default healthcheckRouter;
