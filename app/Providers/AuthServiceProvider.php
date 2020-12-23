<?php

namespace App\Providers;

use Database\Seeders\AbilitiesTableSeeder;
use Kwerio\AccessTokenGuard;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;

use Illuminate\Support\Facades\{
    Gate,
    Auth,
};

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Auth::extend("access-token", function($app, $name, array $config) {
            return new AccessTokenGuard();
        });

        $this->_register_abilities();
    }

    /**
     * Register abilities.
     */
    private function _register_abilities() {
        $abilitiesTableSeeder = resolve(AbilitiesTableSeeder::class);

        foreach ($abilitiesTableSeeder->abilities as $ability => $description) {
            Gate::define($ability, function(User $user) use($ability) {
                return $user->has_abilities($ability);
            });
        }
    }
}
