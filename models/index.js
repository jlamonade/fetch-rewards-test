class Transaction {
  // transaction 'model' for storing transactions to memory
  // if using a database, also have an owner field
  // consider using a boolean field so that the transaction can be filtered out in the query
  // the db routes will create queries that filter by user index
  constructor (payer, points, timestamp) {
    this.payer = payer
    this.points = points
    this.timestamp = timestamp
    this.pointsSpent = 0
  }
}

module.exports = Transaction
