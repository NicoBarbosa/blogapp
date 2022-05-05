if(process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI: "mongodb+srv://NicoBarbosa:4286adgj@blogapp-prod.rft9y.mongodb.net/start"
  }
}else{
  module.exports = {
    mongoURI: 'mongodb://localhost/blogapp'
  }
}