//in export not clean, get each of the slideshow elements
const fs = require('fs')
var parseString = require('xml2js').parseString;
const formatXml = require("xml-formatter");
var jsonxml = require('jsontoxml');

// const json = require('./wp_posts_local.json');
const prefix = 'http://wordsinspace.net/shannon'


async function transformPosts(xmlData){
  console.log('cleaning posts')
  for await (const post of xmlData.rss.channel[0].item) {
    // console.log(post['content:encoded'])
    post['content:encoded'][0] = post['content:encoded'][0].replace(/\]"<|\]“</, '\n');
    post['content:encoded'][0] = post['content:encoded'][0].replace(/\]\n<h1>.+<\/h1>\n\[/m, '][');
    post['content:encoded'][0] = post['content:encoded'][0].replace(/\[vc_.+[^\]]\]|\[\/vc_.+[^\]]\]/, '');

  // await data.replace(/\]"<|\]“</, '\n');
  // await data.replace(/\]\n<h1>.+<\/h1>\n\[/m, '][');

  }

  return xmlData;
}


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
        url = entry[0].guid[0]['_'].replace(/http:\/\/localhost:8888\/wp-content\/uploads\//, `${prefix}/wp-content/uploads/`)
  			replaceString = replaceString + `<img id='slideshowImg${index}' data-id="${img}" data-full-url="${url}" data-link="${prefix}/?attachment_id=${img}" class='wp-image-${img}' src="${url}">\n`
  		}
  		else {
        console.log(img, "is null")
  			urls.push(null)
  		}
  	})
  	urlArr.push(urls);
  	data = data.replace(`"${el}"`, `"]\n<!-- wp:gallery {"ids":[${imgs}]} -->\n` + replaceString + '<!-- /wp:gallery -->\n[vc_')
  }

  // matching images not in slideshows

//capture images (size specified) from the [][] plugin
  data = await data.replace(/\[mk_image src="([A-Za-z]+:\/\/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_:%&;\?\#\/.=]+)" image_height="(\d+)"\]/gm, '\n<img class="alignnone size-large" src="$1" height="$2"/>\n');
  data = await data.replace(/\[mk_image src="([A-Za-z]+:\/\/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_:%&;\?\#\/.=]+)"\]/gm, '\n<img class="alignnone size-large" src="$1"/>\n');


  //cleaning up
  data = await data.replace(/\]"</gm, ']\n"<');
  data = await data.replace(/\]“</gm, ']\n“<');
  data = await data.replace(/\]\r\n<h1>.+<\/h1>\r\n\[/gm, '][');
  data = await data.replace(/\[vc_.+[^\]]\]|\[\/vc_.+[^\]]\]/gm, '');

  fs.writeFile("js_cleaned.xml", data, function (err) {
  if (err) return console.log(err);
	})
}

fs.readFile('wordsinspace.xml', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }


//log the numbers in groups
const pattern = /\[mk_image_slideshow images="([\d+,]{1,})"/g;

  var matches, matchArr = [];
  while (matches = pattern.exec(data)) {
      matchArr.push(matches[1]);
  }
  matchImgs(matchArr, data);

});

