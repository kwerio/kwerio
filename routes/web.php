<?php

use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\{
    MetadataController,
    LogoutController,
    ProfileController,
    Account\Permissions\UserController,
    Account\Permissions\ApiUserController,
    Account\Permissions\GroupController,
};

$domain = config("app.domain");

Route::get("/", [WelcomeController::class, "show_index_page"]);

Route::domain("{tenant}.{$domain}")->group(function() {
    Route::middleware(["auth"])->group(function() {
        Route::prefix("api")->group(function() {
            Route::get("/metadata", [MetadataController::class, "index"]);
        });

        Route::get("/logout", [LogoutController::class, "logout"]);
        Route::get("/profile", [ProfileController::class, "show_index_page"]);
    });

    Route::middleware(["auth", "root"])->group(function() {
        // ---------------------------------------------------------- ACCOUNT -- #
        Route::prefix("account")->group(function() {
            // ---------------------------------------- ACCOUNT / PERMISSIONS -- #
            Route::prefix("permissions")->group(function() {
                Route::get("/groups", [GroupController::class, "show_index_page"]);
                Route::get("/groups/create", [GroupController::class, "show_create_page"]);
                Route::get("/groups/{uuid}", [GroupController::class, "show_update_page"]);

                Route::get("/users", [UserController::class, "show_index_page"]);
                Route::get("/users/create", [GroupController::class, "show_create_page"]);
                Route::get("/users/{uuid}", [GroupController::class, "show_update_page"]);

                Route::get("/api-users", [ApiUserController::class, "show_index_page"]);
                Route::get("/api-users/create", [ApiUserController::class, "show_create_page"]);
                Route::get("/api-users/{uuid}", [ApiUserController::class, "show_update_page"]);
            });
        });
    });
});
