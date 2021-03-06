const router = require('express').Router()
const Transaction = require('../models')

// storing data in memory
const payerBalances = {}
const transactions = []
let totalAvailablePoints = 0

// create new transaction
router.post('/transaction', async (req, res) => {
  const transaction = new Transaction(req.body.payer, req.body.points, req.body.timestamp)
  transactions.push(transaction)
  if (req.body.payer in payerBalances) {
    payerBalances[req.body.payer] = payerBalances[req.body.payer] + req.body.points
    totalAvailablePoints += req.body.points
  } else {
    payerBalances[req.body.payer] = req.body.points
    totalAvailablePoints += req.body.points
  }
  res.status(200).json(transaction)
})

// spend points
router.post('/spend', async (req, res) => {
  let pointsToSpend = req.body.points
  const pointsSpentByPayer = {}

  try {
    if (totalAvailablePoints >= pointsToSpend) {
      // sort transactions when points are being spent, by date
      transactions.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      // spend points
      totalAvailablePoints -= pointsToSpend
      // go through transactions starting at earliest date
      for (const transaction of transactions) {
        // check payer balance by transaction
        // consider using a boolean tag to mark if transactions have been spent
        const availablePoints = transaction.points - transaction.pointsSpent // points available on specific transaction
        if (availablePoints > 0 && pointsToSpend > 0) {
          // if there are available points for the transaction and points to spend > 0
          // then use the transaction
          pointsSpentByPayer[transaction.payer] = 0
          if (pointsToSpend >= availablePoints) {
            // if points to spend is greater than available points for this transaction
            transaction.pointsSpent += availablePoints
            pointsToSpend -= availablePoints
            payerBalances[transaction.payer] -= availablePoints
            pointsSpentByPayer[transaction.payer] -= availablePoints
          } else if (pointsToSpend < availablePoints) {
            // if points to spend is less than available points in transaction
            payerBalances[transaction.payer] -= pointsToSpend
            pointsSpentByPayer[transaction.payer] -= pointsToSpend
            transaction.pointsSpent += pointsToSpend
            pointsToSpend -= pointsToSpend
          }
        } else if (availablePoints < 0) {
          // if negative transaction value
          transaction.pointsSpent += transaction.points
          pointsToSpend -= transaction.points
          payerBalances[transaction.payer] -= transaction.pointsSpent
          pointsSpentByPayer[transaction.payer] -= availablePoints
        }
      }
      // transform object to specified output
      const pointsSpentByPayerArray = Object.entries(pointsSpentByPayer).map(([key, val]) => ({ payer: key, points: val }))
      res.status(200).json(pointsSpentByPayerArray)
    } else if (totalAvailablePoints < pointsToSpend) {
      // if total balance of points is less than points user wants to spend
      throw Error
    }
  } catch (err) {
    res.status(400).json('Not enough points to spend!')
  }
})

// get available balances
router.get('/balance', (req, res) => {
  res.status(200).json(payerBalances)
})

module.exports = router
