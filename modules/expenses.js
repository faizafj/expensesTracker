/** @module Expenses */

import sqlite from 'sqlite-async'


/**
 * Expenses
 * ES6 module that manages the Expenses input by the user.
 */
class Expenses {
	/**
   * Create an expenses object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS expenses (\
	referenceNumber INTEGER PRIMARY KEY AUTOINCREMENT,\
	userid INTEGER,\
	title TEXT NOT NULL,\
	price INTEGER NOT NULL,\
	category TEXT NOT NULL,\
	description TEXT NOT NULL,\
	dateOfExpense TEXT DEFAULT CURRENT_TIMESTAMP,\
	FOREIGN KEY (userid) REFERENCES user(id)\
	);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * retrieves all the expenses
	 * returns an Array which contains all the expenses data.
*/
	async all() {
		const sql = 'SELECT users.user, expenses.* FROM expenses, users\ WHERE expenses.userid;'
		const expenses = await this.db.all(sql)
		return expenses
	}
}

export default Expenses
