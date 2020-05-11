var Transaction = require('../../models/transaction.model');

module.exports.index = async function(req, res) {
  var transactions = await Transaction.find();
  
  res.json(transactions);
};

module.exports.postCreate = async function(req, res) {
  var transaction = await Transaction.create(req.body);
  
  res.json(transaction);
};

module.exports.complete = async function(req, res) {
  var id = req.params.id;
  
  await Transaction.findByIdAndUpdate(id, {
    isComplete: true
  });
  
  var transactions = await Transaction.findById(id); 
  
  res.json(transactions);
};