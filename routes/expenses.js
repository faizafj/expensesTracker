
import Router from 'koa-router'

const router = new Router({ prefix: '/expenses' })

import Expenses from '../modules/expenses.js'
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('expenses router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/expenses')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
	const expenses = await new Expenses(dbName)
	try {
		const records = await expenses.all()
		console.log(records)
		ctx.hbs.records = records
		await ctx.render('expenses', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})
router.get('/details/:id', async ctx => {
	const expenses = await new Expenses(dbName)
	try {
		console.log(`record: ${ctx.params.id}`)
		ctx.hbs.expense = await expenses.getByID(ctx.params.id)
		console.log(ctx.hbs)
		ctx.hbs.id = ctx.params.id
		await ctx.render('details', ctx.hbs)
	}	catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/add', async ctx => {
	await ctx.render('add', ctx.hbs)
})

router.post('/add', async ctx => {
	const expenses = await new Expenses(dbName)
	try {
		ctx.request.body.account = ctx.session.userid
		if (ctx.request.files.avatar.name) {
			ctx.request.body.filePath = ctx.request.files.avatar.path
			ctx.request.body.fileName = ctx.request.files.avatar.name
			ctx.request.body.fileType = ctx.request.files.avatar.type
		}
		await expenses.add(ctx.request.body)
		return ctx.redirect('/expenses?msg=New Expense Added')
	} catch (err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	} finally {
		expenses.close()
	}
})


export default router
