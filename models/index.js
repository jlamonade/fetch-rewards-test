class Transaction {
  // transaction 'model' for storing transactions to memory
  constructor (payer, points, timestamp) {
    this.payer = payer
    this.points = points
    this.timestamp = timestamp
    this.pointsSpent = 0
  }
}

module.exports = Transaction
