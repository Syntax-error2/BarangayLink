<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/api/login', 'POST', [
    'email' => 'resident1@barangaylink.com',
    'password' => 'password123'
]);
$request->headers->set('Accept', 'application/json');
$response = $kernel->handle($request);
echo $response->getContent();
