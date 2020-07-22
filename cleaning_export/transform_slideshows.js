//in export not clean, get each of the slideshow elements
fs = require('fs')
const json = require('./wp_posts_local.json');
let i=0;
let j=0;


async function matchImgs (matchArr, data) {
	let urlArr = [];

  for await (const el of matchArr) {
  	const imgs = el.replace(/"/g, '').split(',')
  	let urls = [];
  	let replaceString = '';
  	imgs.forEach(img => {
  		let entry = json.data.filter(post => post.ID === img)
  		if(entry.length){
  			urls.push(entry[0].guid)
  			replaceString = replaceString + `<img class='fromSlideshow' src="${entry[0].guid}">\n`
  			i++;
  		}
  		else {
  			urls.push(null)
  		}
  		j++
  	})
  	urlArr.push(urls);
  	data = data.replace(el, '"]\n' + replaceString + '[vc_')
  }
  fs.writeFile("js_cleaned.xml", data, function (err) {
  if (err) return console.log(err);
	})
}

//log the numbers in groups
const pattern = /\[mk_image_slideshow images="(\d+),"|"(\d+),(\d+)"|"(\d+),(\d+),(\d+)"/g;

fs.readFile('export_not_clean.xml', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  const matchArr = [...data.match(pattern)]
  matchImgs(matchArr, data);
});

