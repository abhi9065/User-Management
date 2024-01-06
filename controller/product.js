const GetAllProducts = async(req,res)=>{
    res.status(200).json({msg : "all product"})
 }
 
 const GetAllProductsTesting = async(req,res)=>{
     res.status(200).json({msg:"you are testing"})
 }
 
 
 
 module.exports = {GetAllProducts , GetAllProductsTesting};



 