
<?php

$newXML = fopen("php_cleaned.xml", "w") or die("Unable to open file!");

libxml_use_internal_errors(true);
$filename = 'js_cleaned.xml';
$xml = file_get_contents($filename);

//goodbye gross unicode characters (this step required to prevent import bugs)
$xml = preg_replace ('/[^\x{0009}\x{000a}\x{000d}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', ' ', $xml);

//rewrite image urls (temporary)
// $xml = preg_replace('/localhost:8888\/wp-content\//', 'localhost:8888/wordpress_x/wp-content/', $xml);

$xml = preg_replace('/\]"</', ']put_newline_here"<', $xml);
$xml = preg_replace('/\]“</', ']put_newline_here”<', $xml);

//punctuation
$xml = preg_replace('/&#039;/', "'", $xml);
$xml = preg_replace('/&#034;/', '"', $xml);

//duplicate titles
$xml = preg_replace('/\]\r\n<h1>.+<\/h1>\r\n\[/m', '][', $xml);
$xml = preg_replace('/\]\r\n<h1\sclass=".+">.+<\/h1>\r\n\[/m', '][', $xml);

//capture images (size specified) from the [][] plugin
$xml = preg_replace('/\[mk_image src="([A-Za-z]+:\/\/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_:%&;\?\#\/.=]+)" image_height="(\d+)"\]/m', 'put_newline_here<img class="alignnone size-large" src="\1" height="\2"/>put_newline_here', $xml);

//capture images (no size specified) from the [][] plugin
$xml = preg_replace('/\[mk_image src="([A-Za-z]+:\/\/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_:%&;\?\#\/.=]+)"\]/m', 'put_newline_here<img class="alignnone size-large" src="\1"/>put_newline_here', $xml);

// for some reason best known to the PHP gods, newlines need to be wrapped in double quotes
// and capture groups in single quotes
$xml = preg_replace('/put_newline_here/m', "\n", $xml);

//finally get rid of the [][] junk
$xml = preg_replace('/\[vc_.+[^\]]\]|\[\/vc_.+[^\]]\]/', '', $xml);

//clean up uneven brackets where too much was deleted
$xml = preg_replace('/<!\[CDATA\]>/', '<![CDATA[]]>', $xml);

// final removal of duplicate titles
$xml = preg_replace("/<!\[CDATA\[\n<h1>.+<\/h1>/", '<![CDATA[', $xml);
$xml = preg_replace("/\.jpg\">\n\n<h1>.+<\/h1>/", '.jpg">', $xml);
$xml = preg_replace("/\.png\">\n\n<h1>.+<\/h1>/", '.png">', $xml);

// rewrite bad paths
$xml = preg_replace('/\.\.\.\//', "https://wordsinspace.net/shannon/", $xml);

//weird, single, xml error
$xml = preg_replace('/>\]><\/content:encoded>/', '>]]></content:encoded>', $xml);

fwrite($newXML, $xml);
