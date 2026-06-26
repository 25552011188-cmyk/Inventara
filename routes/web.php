<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/login');
});
Route::get('/login', function () {
    return redirect('http://localhost:5173/login');
})->name('login');