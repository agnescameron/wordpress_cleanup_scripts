//in export not clean, get each of the slideshow elements
const fs = require('fs')
var parseString = require('xml2js').parseString;


const json = require('./wp_posts_local.json');
let i=0;
let j=0;


async function matchImgs (matchArr, data) {
	let urlArr = [];
  let xmlData;

  await parseString(data, function(err, result){
    console.log('success!')
    xmlData = result;
  });

  console.log(xmlData.rss.channel[0].item[0].guid[0]['_'])
  const xmlPosts = xmlData.rss.channel[0].item;

  for await (const post of xmlPosts) {
    console.log(post['wp:post_id'][0])
  }

  for await (const el of matchArr) {
  	const imgs = el.replace(/"/g, '').split(',')
  	let urls = [];
  	let replaceString = '';
  	imgs.forEach(img => {
  		let entry = xmlPosts.filter(post => post['wp:post_id'][0] === img)
  		if(entry.length){
  			urls.push(entry[0].guid[0]['_'])
  			replaceString = replaceString + `<img class='fromSlideshow' src="${entry[0].guid[0]['_']}">\n`
  			i++;
  		}
  		else {
        console.log(img, "is null")
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

