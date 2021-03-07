const express = require('express')
const router = express.Router()

const algoliaSearch = require('algoliasearch')

const client = algoliaSearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_SECRET,
)

//mongoose-algolia -> sync document to your algolia database
//algoliasearch -> search data in your algolia database

const index = client.initIndex(process.env.ALGOLIA_INDEX)


router.post('/search', async(req,res) => {
    try {
        let result = await index.search(req.body.title)
        res.json(result.hits)
    } catch (error) {
        res.json(error.message)
    }
})

module.exports = router