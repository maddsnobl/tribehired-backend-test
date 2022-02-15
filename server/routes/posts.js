const express = require('express')
const axios = require('axios')
const {
  getComments,
  getAllPosts,
} = require('../services')

let router = express.Router()

// Get the popular posts
router.get('/popular-posts', async (req, res) => {
  const { data: posts } = await axios.get(getAllPosts)
  const { data: comments } = await axios.get(getComments)

	// Compile post with comment counts first
	const postWithCount = posts.reduce((arr, post)=> {
		// Reshape post obj, add total comments count as prop
		const postObj = Object.entries(post).reduce((obj, [key, val]) => {
			const newObj = {
				...obj,
				[`post_${key}`]: val,
			}

			obj = newObj
			return obj
		}, { total_number_of_comments: 0 })

		// Tally comment count for each post
		comments.forEach((comment) => {
			if (comment.postId === postObj.post_id) {
				postObj.total_number_of_comments += 1
			}
		})

		arr.push(postObj)
		return arr
	}, [])

	const sorted = postWithCount.sort((a, b) => a.total_number_of_comments < b.total_number_of_comments ? 1 : -1)

	res.json({
		meta: {
			code: 200,
			error: null,
			message: 'Fetched popular posts'
		},
		data: {
			popular_posts: sorted,
			total: sorted.length,
		}
	})
})

module.exports.router = router