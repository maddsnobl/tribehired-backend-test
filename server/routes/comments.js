const express = require('express')
const axios = require('axios')
const {  getComments } = require('../services')
const { responseHandler } = require('../utils')

let router = express.Router()

// Search API to filter through comments
const stringFields = ['name', 'email', 'body']

router.get('/comments', async (req, res) => {
	const { query } = req
  const { data: comments } = await axios.get(getComments)

	const [sampleComment] = comments
	const commentKeys = Object.keys(sampleComment)

	const filtered = comments.reduce((arr, comment) => {
		let filteredComment = null

		commentKeys.forEach((key) => {
			if (Object.prototype.hasOwnProperty.call(query, key)) {
				const searchTerm = query[key] // user search term - can be numeric (id) or string
				const refItem = comment[key] // search against this

				// Handle string fields first
				if (stringFields.includes(key)) {
					if (refItem.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) > -1) {
						filteredComment = comment
					}
				} else if (Number(searchTerm) === refItem) {
						filteredComment = comment
				}
			}
		})

		// only push candidate results
		if (filteredComment) {
			arr.push(filteredComment)
		}
		return arr
	}, [])

	res.json(responseHandler({
		comments: (filtered.length > 0) ? filtered : comments,
		total: (filtered.length > 0) ? filtered.length : comments.length,
	},
	{
		message: 'Returned filtered comments'
	}))
})

module.exports.router = router