
const handleProfile = (req, res, db)=>{
 db.select('*').from('users')
   .where('id', '=', req.params.id)
   .then(user=>{
     if(user.length){
       return res.json(user[0])
     }else{
       res.status(400).json('user not find')
     }
   })
   .catch(err=>res.status(400).json('unable to find the user'))
}


module.exports ={
  handleProfile
}
