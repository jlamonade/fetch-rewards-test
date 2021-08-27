const router = require('express').Router()

class Transaction {
  constructor(payer, points, timestamp) {
    this.payer = payer
    this.points = points
    this.timestamp = timestamp
    this.pointsSpent = 0
  }
}

const payerBalances = {}

const transactions = []



router.post('/', async (req, res) => {
  await transactions.push(new Transaction(req.body.payer, req.body.points, req.body.timestamp))
  if (!(req.body.payer in payerBalances)) {
    payerBalances[req.body.payer] = req.body.points
  } else {
    payerBalances[req.body.payer] = payerBalances[req.body.payer] + req.body.points
  }
  res.status(200).json(payerBalances)
})

router.post('/spend', async (req, res) => {
  let spendPoints = req.body.points // 4900
  // sort transactions when points are being spent, by date
  transactions.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  // spend points
  // go through transactions starting at earliest date
  for (const transaction of transactions) {
    // check payer balance
    if (payerBalances) {
      
    }
  }
    
    
    // if 0 then go to next payer
    // else spend all available points, do not let balance be negative
    // then go to next payer
  res.status(200).json(transactions)
})

router.get('/', (req, res) => {
  res.status(200).json(transactions)
})

module.exports = router