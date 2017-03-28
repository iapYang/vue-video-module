const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(path.resolve(__dirname, '../dist'), err => {
    if (err) {
        console.log(err);
    } else {
        console.log('publish to github page done');
    }
});
