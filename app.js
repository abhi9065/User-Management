require("dotenv").config();

const express = require("express");
const app = express();
const ConnectDB = require("./db/connect")


const PORT = process.env.PORT || 1500;

const product_route = require("./route/product");
app.use(express.json())



app.get("/" , (req,res) =>{
    res.send("hi , i am alive")
})


app.get('/about', (req, res) => {
  res.send('This is the About page.')
})

app.use("/api/products" , product_route )



const Start = async() =>{
    try {
       await ConnectDB(process.env.MONGODB_URL)
       console.log(` i am connected to data`)
       app.listen(PORT, ()=>{
        console.log(`${PORT} i am connected`)
       }) 
    } catch (error) {
       console.log(error) 
    }
}

Start()