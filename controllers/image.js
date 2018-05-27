

const handleImage = (req, res, db)=>{
  db.select('*').from('users')
    .where('id', '=', req.body.id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=>{
      res.json(entries[0])
    })
    .catch(err=>res.status(400).json('fail to count'))
}

module.exports ={
  handleImage
}
