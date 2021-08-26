const router = require('express').Router()

class Transaction {
  constructor(payer, points) {
    this.payer = payer
    this.points = points
    this.timestamp = new Date(Date.now())
  }
}

const payerBalances = {}

const transactions = []

router.post('/', async (req, res) => {
  await transactions.push(new Transaction(req.body.payer, req.body.points))
  if (!req.body.payer in payerBalances) {
    payerBalances[req.body.payer] = req.body.points
  } else {
    payerBalances[req.body.payer] = payerBalances[req.body.payer] + req.body.points
  }
  res.status(200).json(payerBalances)
})

router.get('/', (req, res) => {
  res.status(200).json(transactions)
})

module.exports = router