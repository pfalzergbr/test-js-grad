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

 *  With the results from this request, inside "content", count
 *  the number of packages that have a MAJOR semver version 
 *  greater than 10.x.x
 */

const axios = require('axios');

module.exports = async function countMajorVersionsAbove10() {
  const response = await axios.post(
    'http://ambush-api.inyourarea.co.uk/ambush/intercept',
    {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    },
  );

  //Destructure content from the response
  const { content } = response.data;

  let count = 0;
  for (i in content) {
    //Destructure the major version from a split string. Minor and patch versions are not used, but available for more fine grained search.
    const [majorVersion] = content[i].package.version.split('.');
    // Parse as an integer to be able to compare
    if (parseInt(majorVersion) >= 10) {
      count++;
    }
  }

  return count;
};
