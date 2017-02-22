# CouchDB Distributor Server

This server follows the changes feed of a couchdb database
then puts the change doc into a pull stream pipeline.

You can add pull-stream maps to handle events like
recording analytic data, or sending emails or sms events.

Then once the change is handled, a sequence id is stored
in a local document in the couchdb db database.

When the server is re-started it will resume at the last
sequence checkpoint.

## Usage

* run `npm install`
* Add your db url to the ENV variable `DB`
* run `npm start`

## License

MIT
