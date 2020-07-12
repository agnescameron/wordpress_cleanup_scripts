//file to create a number of insert scripts


//get the JSON
let data = require('./database_dump.json');

//for each tag in tag_names
data.forEach(table => console.log(table.name))

// search each 


//post_title (if match then continue to id step)


//post_content


//if there's a match, then get the id of both the tag and the post


//if those have been found successfully, formulate an insert statement


//insert statement: check that the relationship does not already exist. 


//if it does not, then insert