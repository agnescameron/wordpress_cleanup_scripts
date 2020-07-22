//in export not clean, get each of the slideshow elements
fs = require('fs')
const json = require('./wp_posts_local.json');
let i=0;
let j=0;

//log the numbers in groups
const pattern = /\[mk_image_slideshow images="(\d+),"|"(\d+),(\d+)"|"(\d+),(\d+),(\d+)"/g;

fs.readFile('export_not_clean.xml', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  const arr = [...data.match(pattern)]


  arr.forEach(el => {
  	const imgs = el.replace(/"/g, '').split(',')
  	imgs.forEach(img => {
  		let entry = json.data.filter(post => post.ID === img)
  		if(entry.length){
  			console.log(entry[0].guid);
  			i++;
  		}
  		j++
  	})
  })
  console.log('found', i, 'images out of', j)
});

