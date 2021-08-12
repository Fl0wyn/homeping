<?php
$data = $_SERVER['REMOTE_ADDR'];
header('Content-Type: application/json');
echo json_encode($data);
