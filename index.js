require('dotenv').config()
const db = process.env.DBURL

const pull = require('pull-stream/pull')
const drain = require('pull-stream/sinks/drain')
const asyncMap = require('pull-stream/throughs/async-map')
const Notify = require('pull-notify')
const notify = Notify()

const follow = require('follow')
const request = require('request')

const express = require('express')
const app = express()

app.get('*', (req, res) => res.send({ name: 'Distribitor'}))
app.listen(process.env.PORT || 3000)

request(db + '/_local/foo', { json: true }, (e,r,doc) => {
  const feed = follow({ url: db, include_docs: true, since: doc.seq })

  feed.on('error', err => {
    //
    console.error('Since Follow always retries on errors, this must be serious')
    console.log(err.message)
    throw err
  })

  feed.on('change', notify)

})


// pull-stream pipeline
pull(
  notify.listen(),
  // handle change doc
  // process document here
  // set sequence id
  asyncMap((chg, cb) => {
    request.put(db + '/_local/foo', { json: { seq: chg.seq }}, (e,r,b) => {
      if (e) { return cb(e) }
      cb(null, chg)
    })
  }),
  // sink
  drain((chg) => console.log('processed: ' + chg.seq))
)
