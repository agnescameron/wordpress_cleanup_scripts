//file to create a number of insert scripts


//get the JSON
const data = require('./database_dump.json');


const wp_posts = data.filter(table => table.name === 'wp_posts')[0].data;
const wp_terms = data.filter(table => table.name === 'wp_terms')[0].data;
const wp_term_taxonomy = data.filter(table => table.name === 'wp_term_relationships')[0].data;
const wp_term_relationships = data.filter(table => table.name === 'wp_term_taxonomy')[0].data;

//perhaps some terms are so specific as to be included in full text, others just title, others not at all
const not_searched = ["Main", "Presentations", "Publications"]
const not_content = ["zone", "urban", "typology", "zines", "architecture", "workshop", "urbanism"]


let id_map = [];
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

console.log(id_map)

//if there's a match, then get the id of both the tag and the post


//if those have been found successfully, formulate an insert statement


//insert statement: check that the relationship does not already exist. 


//if it does not, then insert