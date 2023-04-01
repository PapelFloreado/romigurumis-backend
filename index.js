const express = require("express")
const morgan = require("morgan")
const mercadopago = require("mercadopago")
require("dotenv").config()

const server = express()

server.use(express.json())
server.use(morgan("dev"))

server.use((_req,res,next)=>{
    
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();    
})

mercadopago.configure({access_token: process.env.MERCADOPAGO_KEY})

server.post("/payment", (req, res)=>{
    const carrito = req.body
    const itemsMP = carrito.map((prod)=>{
        return {
            title: prod.title,
            category_id: toString(prod.id),
            quantity: prod.quantity,
            description: prod.description,
            picture_url: prod.img,
            unit_price: prod.price
        }
    })
    let preference = {
        items: itemsMP,
        back_urls:{
            success: "http://localhost:5173/success",
            failure: "http://localhost:5173/failure",
            pending: ""
        },
        notification_url: "https://romigurumis-backend-production.up.railway.app/",
        auto_return: "approved",
        binary_mode: true
    }
    mercadopago.preferences.create(preference)
        .then((response)=>res.status(200).send({response}))
        .catch(error=>res.status(400).send({error: error.message}))

})

server.listen(3001,()=>{
    console.log("Servidor corriendo en el puerto 3001")
})