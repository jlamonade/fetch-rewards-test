const router = require('express').Router()
const Transaction = require('../models')

const payerBalances = {}

const transactions = []

router.post('/', async (req, res) => {
  await transactions.push(new Transaction(req.body.payer, req.body.points, req.body.timestamp))
  if (!(req.body.payer in payerBalances)) {
    payerBalances[req.body.payer] = req.body.points
  } else {
    payerBalances[req.body.payer] = payerBalances[req.body.payer] + req.body.points
  }
  res.status(200).json(transactions)
})

router.post('/spend', async (req, res) => {
  let pointsToSpend = req.body.points // 4700
  // sort transactions when points are being spent, by date
  transactions.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  console.log(transactions)
  console.log(payerBalances)
  // spend points
  // go through transactions starting at earliest date
  for (const transaction of transactions) {
    // check payer balance
    const availablePoints = Math.abs(transaction.points - transaction.pointsSpent) // 500
    // console.log(availablePoints, transaction.points)
    if (availablePoints > 0 && pointsToSpend >= availablePoints) {
      transaction.pointsSpent += transaction.points
      pointsToSpend -= transaction.pointsSpent
    } else if (availablePoints > 0 && pointsToSpend < availablePoints) {
      transaction.pointsSpent += pointsToSpend
      pointsToSpend -= transaction.pointsSpent
    } else if (availablePoints > 0 && transaction.points < 0) {
      transaction.pointsSpent += transaction.points
      pointsToSpend -= transaction.points
    }
    payerBalances[transaction.payer] -= transaction.pointsSpent
  }
  console.log(transactions)
  // if 0 then go to next payer
  // else spend all available points, do not let balance be negative
  // then go to next payer
  res.status(200).json(payerBalances)
})

router.get('/', (req, res) => {
  res.status(200).json(transactions)
})

module.exports = router
