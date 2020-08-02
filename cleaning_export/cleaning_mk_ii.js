//in export not clean, get each of the slideshow elements
const fs = require('fs')
var parseString = require('xml2js').parseString;


const json = require('./wp_posts_local.json');

async function matchImgs (matchArr, data) {
	let urlArr = [];
  let xmlData;

  await parseString(data, function(err, result){
    console.log('success!')
    xmlData = result;
  });

  const xmlPosts = xmlData.rss.channel[0].item;

  for await (const el of matchArr) {
  	const imgs = el.split(',')
  	let urls = [];
  	let replaceString = '';
  	imgs.forEach( (img, index) => {
  		let entry = xmlPosts.filter(post => post['wp:post_id'][0] === img)
  		if(entry.length){
  			urls.push(entry[0].guid[0]['_'])
  			replaceString = replaceString + `<img id='slideshowImg${index}' class='fromSlideshow' src="${entry[0].guid[0]['_'].replace(/http:\/\/localhost:8888\/wp-content\/uploads\//, 'https://testingvii.wordsinspace.net/wp-content/uploads/')}">\n`
  		}
  		else {
        console.log(img, "is null")
  			urls.push(null)
  		}
  	})
  	urlArr.push(urls);
  	data = data.replace(`"${el}"`, '"]\n<div class="slideshow">\n' + replaceString + '</div>\n[vc_')
  }
  fs.writeFile("js_cleaned.xml", data, function (err) {
  if (err) return console.log(err);
	})
}

//log the numbers in groups
const pattern = /\[mk_image_slideshow images="([\d+,]{1,})"/g;

fs.readFile('export_ii.xml', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var matches, matchArr = [];
  while (matches = pattern.exec(data)) {
      matchArr.push(matches[1]);
  }

  matchImgs(matchArr, data);
  console.log(matchArr)
});

