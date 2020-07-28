const fs = require('fs');

//get the JSON
const data = require('./database_dump.json');


const wp_posts = data.filter(table => table.name === 'wp_posts')[0].data;
const wp_terms = data.filter(table => table.name === 'wp_terms')[0].data;
const wp_term_taxonomy = data.filter(table => table.name === 'wp_term_relationships')[0].data;
const wp_term_relationships = data.filter(table => table.name === 'wp_term_taxonomy')[0].data;

let post_ids = [];
let blog_term_id = 2;

//insert ignore doesn't insert duplicates
let insert_string = 'INSERT IGNORE INTO `wp_term_relationships` (`object_id`, `term_taxonomy_id`) VALUES ';

//filter the ones that are actually posts
wp_posts.forEach(post => {
	if (post.post_type === 'post' && post.post_title) post_ids.push(post.ID)
})

console.log('number of posts is', post_ids.length)
//make each of them a category 'blog'

//if there's a match, then get the id of both the tag and the post
post_ids.forEach(post => {
	const insert_statement = `(${post}, 319), `;
	insert_string = insert_string + insert_statement;
})

//if those have been found successfully, formulate an insert statement
fs.writeFile('insert_categories.txt', insert_string, function (err) {
  if (err) return console.log(err);
  console.log('successfully created insert statement');
});
