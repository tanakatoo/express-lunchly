/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({ id, customerId, numGuests, startAt, notes }) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  get numGuests() {

    return this._numGuests
  }
  set numGuests(num) {
    if (num < 1) {
      throw 'not enough guests'
    } else {
      this._numGuests = num
    }
  }

  get customerId() {
    return this._customer_id
  }
  set customerId(id) {
    throw 'cannot reassign customer id'
  }


  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
      `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
      [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }

  async save() {
    const results = await db.query(`
    INSERT INTO reservations (customer_id,num_guests, start_at, notes) VALUES ($1,$2,$3,$4) RETURNING *
    `, [this.customerId, this._numGuests, this.startAt, this.notes])
    return results.rows[0]
  }
}


module.exports = Reservation;
