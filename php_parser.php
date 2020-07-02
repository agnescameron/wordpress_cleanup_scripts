
<?php

function utf8_for_xml($string)
{
    return preg_replace ('/[^\x{0009}\x{000a}\x{000d}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', ' ', $string);
}


$newXML = fopen("php_cleaned.xml", "w") or die("Unable to open file!");

libxml_use_internal_errors(true);
$filename = 'export_not_clean.xml';
$string = file_get_contents($filename);

$xml = utf8_for_xml($string);

$select_start = '/^\[vc_row\].+\[vc_column_text\]\n<h1>/sm';
$select_end = '/<\/div>\n\[\/vc_column_text\].+\[\/vc_row\]$/sm';
$select_middle = '/\[\/vc_column_text\]\[vc_column_text\]/sm';

// $xml = preg_replace($select_start, '<h1>', $xml);
// $xml = preg_replace($select_end, '<\/div>', $xml);
// $xml = preg_replace($select_middle, '', $xml);
// $xml = preg_replace('/<\/div>\n\[\/vc_column_text\].+\[vc_column_text\]\n<div/sm', '</div><div',$xml);
$xml = preg_replace('/\[vc_.+[^\]]\]|\[\/vc_.+[^\]]\]/', '', $xml);

fwrite($newXML, $xml);
