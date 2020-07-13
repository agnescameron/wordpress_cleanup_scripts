const fs = require('fs');

//get the JSON
const data = require('./database_dump.json');


const wp_posts = data.filter(table => table.name === 'wp_posts')[0].data;
const wp_terms = data.filter(table => table.name === 'wp_terms')[0].data;
const wp_term_taxonomy = data.filter(table => table.name === 'wp_term_relationships')[0].data;
const wp_term_relationships = data.filter(table => table.name === 'wp_term_taxonomy')[0].data;

//perhaps some terms are so specific as to be included in full text, others just title, others not at all
const not_searched = ["Main", "Presentations", "Publications", "Uncategorized", "Publication", "Research", "Talks", "Teaching", "Blog",]
const not_content = ["zone", "urban", "typology", "zines", "architecture", "workshop", "urbanism"]

let id_map = [];

//insert ignore doesn't insert duplicates
let insert_string = 'INSERT IGNORE INTO `wp_term_relationships` (`object_id`, `term_taxonomy_id`) VALUES ';


// delete if fuck up
// let insert_string = 'DELETE FROM `wp_term_relationships` WHERE (`object_id`, `term_taxonomy_id`) IN (';


//perhaps also posts from last 4 years?


//for each tag in tag_names
wp_terms.forEach(term => {
	if(!not_searched.includes(term.name)){
		wp_posts.forEach(post => {
			//post_title
			if(post.post_title.includes(term.name)){
				// console.log(post.post_title, term.name)
				const match = {
					object_id: post.ID,
					term_taxonomy_id: term.term_id,
				}
				id_map.push(match)
			}
			//post_content
			// else if(post.post_content.includes(term.name) && !not_content.includes(term.name)){
			// 	console.log(post.post_title, term.name)
			// }
		})
	}
})

//if there's a match, then get the id of both the tag and the post
id_map.forEach(rship => {
	const insert_statement = `(${rship.object_id}, ${rship.term_taxonomy_id}), `;
	insert_string = insert_string + insert_statement;
})

insert_string = insert_string.slice(0, -2) + ';'
console.log('id map contains', id_map.length, 'entries')

//if those have been found successfully, formulate an insert statement
fs.writeFile('insert_statement.txt', insert_string, function (err) {
  if (err) return console.log(err);
  console.log('successfully created insert statement');
});
