<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\SystemModels\Tenant;
use App\Models\{
    Module as ModuleModel,
    Group,
};

class TenantMigrateCommand extends Command {
    protected $signature = "tenant:migrate {tenant} {--m|modules=} {--s|seed}";
    protected $description = "Migrate tenant database";

    /**
     * Execute the console command.
     */
    function handle() {
        $tenant = Tenant::switch($this->argument("tenant"));

        $this->_migrate_tenant_core($tenant);
        $this->_migrate_tenant_modules($tenant);
        $this->_seed($tenant);
    }

    private function _migrate_tenant_core($tenant) {
        $this->line("");
        $this->comment("[ {$tenant->db_name} ]  Migrating tenant core");
        $this->call("migrate");
    }

    private function _migrate_tenant_modules($tenant) {
        $modules = explode(",", $this->option("modules") ?? "");
        $modules[] = "Home";

        foreach ($modules as $module) {
            $this->line("");
            $this->comment("[ {$tenant->db_name} ]  Migrating module {$module}");

            $path = "modules/{$module}/database/migrations";

            $this->call("migrate", [
                "--path" => $path,
            ]);

            $this->__install_module($module);
        }
    }

    private function _seed($tenant) {
        if (!$this->option("seed")) return;

        $this->call("db:seed");
    }

    private function __install_module($module) {
        ModuleModel::updateOrCreate(["uid" => $module], [
            "uid" => $module,
        ]);

        Group::updateOrCreate(["slug" => $module], [
            "slug" => $module,
            "name" => $module,
        ]);
    }
}
