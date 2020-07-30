const fs = require('fs');
const parseString = require('xml2js').parseString;


async function addThumbnails(data){
	let xmlData;

	await parseString(data, function(err, result){
		console.log('success!')
		xmlData = result;
	});

	const xmlPosts = xmlData.rss.channel[0].item;

	for await (const post of xmlPosts) {
		for await (const meta of post['wp:postmeta']){
			if(meta['wp:meta_key'][0] === '_thumbnail_id'){
				console.log(meta['wp:meta_value'][0])
				const thumnum = meta['wp:meta_value'][0]
				let entry = xmlPosts.filter(post => post['wp:post_id'][0] === thumnum)
				console.log(entry[0].guid[0]['_'])
			}
		}
	}
}

fs.readFile('export_not_clean.xml', 'utf8', function (err,data) {
	if (err) {
		return console.log(err);
	}

	addThumbnails(data)

});