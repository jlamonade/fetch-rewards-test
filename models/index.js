class Transaction {
  constructor (payer, points, timestamp) {
    this.payer = payer
    this.points = points
    this.timestamp = timestamp
    this.pointsSpent = 0
  }
}

module.exports = Transaction
