
<?php

$newXML = fopen("php_cleaned.xml", "w") or die("Unable to open file!");

libxml_use_internal_errors(true);
$filename = 'export_not_clean.xml';
$xml = file_get_contents($filename);

//goodbye gross unicode characters (this step required to prevent import bugs)
$xml = preg_replace ('/[^\x{0009}\x{000a}\x{000d}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', ' ', $xml);

//punctuation
$xml = preg_replace('/\]\r\n<h1>.+<\/h1>\r\n\[/', '][', $xml);

//duplicate titles
$xml = preg_replace('/\]\r\n<h1>.+<\/h1>\r\n\[/', '][', $xml);

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

fwrite($newXML, $xml);
