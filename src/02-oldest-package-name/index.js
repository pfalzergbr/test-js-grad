/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */
const axios = require('axios');

module.exports = async function oldestPackageName() {
  const response = await axios.post(
    'http://ambush-api.inyourarea.co.uk/ambush/intercept',
    {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    },
  );
  const { content } = response.data;
  /* Set up a name and an oldest date variable to set in the for loop.
  Name will be set together with any date that is older than the previous ones. */
  let name = '';
  let oldestDate = Date.now();

  for (i in content) {
    // Convert the date from the fetched data to a Date, consistent with the oldest date starting point
    const packageDate = new Date(content[i].package.date).getTime();
    const packageName = content[i].package.name;
    if (packageDate < oldestDate) {
      oldestDate = packageDate;
      name = packageName;
    }
  }
  return name;
};
