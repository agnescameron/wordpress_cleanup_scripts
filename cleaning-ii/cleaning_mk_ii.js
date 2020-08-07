//in export not clean, get each of the slideshow elements
const fs = require('fs')
var parseString = require('xml2js').parseString;
const formatXml = require("xml-formatter");
var jsonxml = require('jsontoxml');

// const json = require('./wp_posts_local.json');
const prefix = 'http://wordsinspace.net/shannon';


async function matchImgs (matchArr, data) {
	let urlArr = [];
  let xmlData;

  await parseString(data, function(err, result){
    console.log('success!')
    xmlData = result;
  });

  // //get rid of the headings first
  data = await data.replace(/\]\r\n<h1.+<\/h1>\r\n/gm, ']');
  data = await data.replace(/\]\n<h1.+<\/h1>\n/gm, ']');
  data = await data.replace('<h1>Mapping Urban Media Infrastructures (2019)</h1>', '');

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
  			replaceString = replaceString + `<li class="blocks-gallery-item"><figure><img id='slideshowImg${index}' data-id="${img}" data-full-url="${url}" data-link="${prefix}/?attachment_id=${img}" class='wp-image-${img}' src="${url}"/></figure></li>\n`
  		}
  		else {
        console.log(img, "is null")
  			urls.push(null)
  		}
  	})
  	urlArr.push(urls);
  	data = data.replace(`"${el}"`,`"]\n<!-- wp:gallery {"ids":[${imgs}]} -->\n<figure class="wp-block-gallery columns-3 is-cropped">\n
  <ul class="blocks-gallery-grid">\n` + replaceString + '</ul></figure><!-- /wp:gallery -->\n[vc_')
    //`"]\n ${replaceString}\n[vc_'`) //
  }

  // matching images not in slideshows

// //capture images (size specified) from the [][] plugin
  data = await data.replace(/\[mk_image src="([A-Za-z]+:\/\/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_:%&;\?\#\/.=]+)" image_height="(\d+)"\]/gm, '\n<img class="alignnone size-large" src="$1" height="$2"/>\n');
  data = await data.replace(/\[mk_image src="([A-Za-z]+:\/\/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_:%&;\?\#\/.=]+)"\]/gm, '\n<img class="alignnone size-large" src="$1"/>\n');


  // //cleaning up
  data = await data.replace(/\]"</gm, ']\n"<');
  data = await data.replace(/\]“</gm, ']\n“<');
  data = await data.replace(/[t"]\]([^\[^\]^>])/g, ']\n$1');
  data = await data.replace(/\[vc_.+[^\]]\]|\[\/vc_.+[^\]]\]/gm, '');


  data = await data.replace(/<h1/gm, '<h2');
  data = await data.replace(/<\/h1>/gm, '<\/h2>');

  //getting rid of span colours
  data = await data.replace(/style="color: #\d\d\d\d\d\d/g, 'class="colorEmphasis"');

  //getting rid of spans
  // data = await data.replace(/<span.[^>]+>|<\/span>/, '');

  data = await data.replace(/<!\[CDATA\]>/g, '<![CDATA[]]>');

  //punctuation
  data = await data.replace(/&#039;/g, "'");
  data = await data.replace(/&#034;/g, '"');

// rewrite bad paths
  data = await data.replace(/\.\.\.\//g, "http://localhost:8888/"); ///\.\.\.\/\d+\/\d+\/\d+\//g

  // unicode something
  data = await data.replace(/[^\u{0009}\u{000a}\u{000d}\u{0020}-\u{D7FF}\u{E000}-\u{FFFD}]+/ug, '')

  //getting rid of weird portfolio divs
  data = await data.replace(/(<div class=".+">\n){6,}/g, '<p>')
  data = await data.replace(/(<\/div>\n){6,}/g, '</p>')

  //bolded, coloured, and indented text
  data = await data.replace(/style="font-weight[^>]+padding[^>]+;"/g, 'class="indented emphasised"');
  data = await data.replace(/style="font-weight[^>]+;"/g, 'class="emphasised"');
  data = await data.replace(/style="font-weight[^>]+;"/g, 'class="emphasised"');
  data = await data.replace(/style="color[^>]+;"/g, 'class="indented"');

  data = await data.replace(/style="[\sml][^>]+;"/g, '')
  data = await data.replace(/style="font-weight[^>]+;"/g, '')

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

