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
    receiptImage TEXT,\
	FOREIGN KEY (userid) REFERENCES user(id)\
	);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * retrieves all the expenses data
	 * returns an Array which contains all the expenses data.
	 * This also sorts the Date field so that it is organised as DD/MM/YYYY
*/
	async all() {
		const sql = 'SELECT users.user, expenses.* FROM expenses, users\ WHERE expenses.userid = users.id;'
		const expenses = await this.db.all(sql)
		for (const index in expenses) {
			if (expenses[index].receiptImage === null) expenses[index].receiptImage = 'avatar.png'
			const dateTime = new Date(expenses[index].dateOfExpense)
			const date = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
			expenses[index].dateOfExpense = date
		}
		return expenses
	}
	async add(data) {
		console.log(data)
		try {
			const sql = `INSERT INTO expenses(userid, title, price, description, category, dateOfExpense, receiptImage)\
						VALUES(${data.account}, "${data.title}", "${data.price}",\
						"${data.description}", ${data.category}", ${data.dateOfExpense}", "${data.filename}")`
			console.log(sql)
			return true
		} catch (err) {
			console.log(err)
			throw err
		}
	}
	async close() {
		await this.db.close()
	}
}
export default Expenses
