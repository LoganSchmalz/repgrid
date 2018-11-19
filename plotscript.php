<?php
session_start();
$elements = $_POST['elements'];
$constructs = $_POST['constructs'];
$notconstructs = $_POST['notconstructs'];
$scores = $_POST['scores'];
$ratingL = $_POST['ratingL'];
$ratingR = $_POST['ratingR'];
//$array = ['userName' => $name, 'computedString' => $computedString];
echo session_id();
?>