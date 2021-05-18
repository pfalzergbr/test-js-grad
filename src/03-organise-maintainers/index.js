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
  // Iterate over packages. Set up variables for easeier read.
  for (i in content) {
    const packageName = content[i].package.name;
    const packageMaintainers = content[i].package.maintainers;
    // Nested loop iterating over package maintainers in packages.
    for (let j in packageMaintainers) {
      const username = packageMaintainers[j].username;
      // Checking existing maintainers array if user is already added. 
      const existingMaintainer = maintainers.find(
        maintainer => maintainer.username === username,
      );
      /*If already added, pushing the new package name to the packageNames array. 
        Initially, it was sorting here straight away, but that would result in one more nest of iteration.
        Sorting logic is handled together now, outside the loop. Only sorting all of them once should 
        improve bigO notation. at this point.
      */
       if (existingMaintainer) {
        existingMaintainer.packageNames.push(packageName);
      // Create a new user object if doesn`t yet exist.
      } else {
        maintainers.push({ username, packageNames: [packageName] });
      }
    }
  }
  // Extracted sorter function for better readability. 
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

// Thank you very much for reviewing my code! Looking forward to your feedback. 