//file to create a number of insert scripts


//get the JSON
const data = require('./database_dump.json');


const wp_posts = data.filter(table => table.name === 'wp_posts')[0].data;
const wp_terms = data.filter(table => table.name === 'wp_terms')[0].data;
const wp_term_taxonomy = data.filter(table => table.name === 'wp_term_relationships')[0].data;
const wp_term_relationships = data.filter(table => table.name === 'wp_term_taxonomy')[0].data;

const not_searched = ["Main", "Presentations", "Publications"]

//perhaps some terms are so specific as to be included in full text, others just title, others not at all

//for each tag in tag_names
wp_terms.forEach(term => {
	if(!not_searched.includes(term.name)){
		wp_posts.forEach(post => {
			if(post.post_title.includes(term.name)){
				console.log(post.post_title, term.name)
			}
			else if(post.post_content.includes(term.name)){
				console.log(post.post_title, term.name)
			}
		})
	}
})

// search each 

//post_title (if match then continue to id step)


//post_content


//if there's a match, then get the id of both the tag and the post


//if those have been found successfully, formulate an insert statement


//insert statement: check that the relationship does not already exist. 


//if it does not, then insert