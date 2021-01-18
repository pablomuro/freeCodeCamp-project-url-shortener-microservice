'use strict';
const { promisify } = require('util');
const dns = require('dns');

const dnsLookup = promisify(dns.lookup)

module.exports = function (app, myDBMap) {

  function validateUrl(url) {
    const regex = /^(?:http|https):\/\/((?:[\w-]*\.[\w-]*)+)(?:\/\w*)*/
    const match = url.match(regex)
    if (!match) {
      throw new Error()
    }
    return match[1]
  }


  app.route('/api/shorturl/:url?')
    .get((req, res) => {
      const url = req.params.url
      if (!url) {
        return res.send('Not found')
      }

      const redirectUrl = myDBMap.get(Number(url))

      if (!redirectUrl) {
        return res.json({
          error: "No short URL found for the given input"
        })
      }

      res.redirect(redirectUrl);
    });
  app.route('/api/shorturl/new')
    .post(async (req, res) => {
      let url = req.body.url
      try {
        const hostname = validateUrl(url)
        await dnsLookup(hostname)
        const short_url = myDBMap.size + 1
        myDBMap.set(short_url, url)
        return res.json({
          original_url: url,
          short_url: short_url
        })
      } catch (error) {
        console.log(error)
        return res.json({ error: 'invalid url' })
      }

    });


};
