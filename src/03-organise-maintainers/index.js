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

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

const axios = require('axios');

module.exports = async function organiseMaintainers() {
  const response = await axios.post(
    'http://ambush-api.inyourarea.co.uk/ambush/intercept',
    {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    },
  );
  const { content } = response.data;

  const maintainers = [];
  for (i in content) {
    const packageName = content[i].package.name;
    const packageMaintainers = content[i].package.maintainers;
    for (let j in packageMaintainers) {
      const username = packageMaintainers[j].username;
      const existingMaintainer = maintainers.find(
        maintainer => maintainer.username === username,
      );
      if (existingMaintainer) {
        existingMaintainer.packageNames.push(packageName);
      } else {
        maintainers.push({ username, packageNames: [packageName] });
      }
    }
  }

  const userSorter = (a, b) => {
    const valueA = a.username;
    const valueB = b.username;

    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  };

  const sortedMaintainers = maintainers
    .map(maintainer => ({
      ...maintainer,
      packageNames: maintainer.packageNames.sort(),
    }))
    .sort(userSorter);
  return sortedMaintainers;
};
