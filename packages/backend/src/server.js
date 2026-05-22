import app from "./app.js";

const puerto =  3000;

app.listen(puerto, () => {
    console.log("El servidor inicio en el puerto " + puerto);
});