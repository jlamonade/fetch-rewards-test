const router = require('express').Router()
const Transaction = require('../models')

const payerBalances = { totalAvailablePoints: 0 }

const transactions = []

router.post('/', async (req, res) => {
  await transactions.push(new Transaction(req.body.payer, req.body.points, req.body.timestamp))
  if (req.body.payer in payerBalances) {
    payerBalances[req.body.payer] = payerBalances[req.body.payer] + req.body.points
    payerBalances.totalAvailablePoints += req.body.points
  } else {
    payerBalances[req.body.payer] = req.body.points
    payerBalances.totalAvailablePoints += req.body.points
  }
  console.log(payerBalances.totalAvailablePoints)
  res.status(200).json(payerBalances.totalAvailablePoints)
})

router.post('/spend', async (req, res) => {
  // TODO implement check to see if there are enough points to spend
  let pointsToSpend = req.body.points // 4700
  // sort transactions when points are being spent, by date
  transactions.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  // spend points
  // go through transactions starting at earliest date
  if (payerBalances.totalAvailablePoints > pointsToSpend) {
    payerBalances.totalAvailablePoints -= pointsToSpend
    for (const transaction of transactions) {
      // check payer balance
      const availablePoints = transaction.points - transaction.pointsSpent // points available on specific transaction
      console.log(transaction.payer, availablePoints)
      if (availablePoints > 0 && pointsToSpend > 0) { // if not 0
        if (pointsToSpend >= availablePoints) {
          transaction.pointsSpent += availablePoints
          pointsToSpend -= availablePoints
          payerBalances[transaction.payer] -= availablePoints
        } else if (pointsToSpend < availablePoints) {
          payerBalances[transaction.payer] -= pointsToSpend
          transaction.pointsSpent += pointsToSpend
          pointsToSpend -= transaction.pointsSpent
        } else if (transaction.points < 0 && availablePoints > 0) {
          transaction.pointsSpent += transaction.points
          pointsToSpend -= transaction.points
          payerBalances[transaction.payer] -= transaction.pointsSpent
        }
      }
    }
  }
  console.log(transactions)
  // if 0 then go to next payer
  // else spend all available points, do not let balance be negative
  // then go to next payer
  res.status(200).json(payerBalances)
})

router.get('/', (req, res) => {
  res.status(200).json(payerBalances)
})

module.exports = router
