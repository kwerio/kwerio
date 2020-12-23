<?php

namespace Kwerio\Metadata;

use Illuminate\Support\Str;

trait InteractsWithMenu {
    private $applications = [];
    private $permissions = [];
    private $settings = [];

    /**
     * Set user accessable menu.
     */
    function menu() {
        $this->_build_applications();
        $this->_build_permissions();
        $this->_build_settings();

        $this->attributes["menu"] = [
            "open" => false,
            "data" => [
                [
                    "id" => Str::uuid(),
                    "text" => "Applications",
                    "children" => $this->applications,
                ],
                [
                    "id" => Str::uuid(),
                    "text" => "Account",
                    "children" => array_values(array_filter([
                        $this->permissions,
                        $this->settings,
                    ], function($menu) { return !empty($menu); })),
                ],
            ],
        ];

        return $this;
    }

    /**
     * Build applications menu.
     */
    private function _build_applications() {
        $user = request()->user();

        $this->applications = collect(config("modules"))
            ->filter(function($module) use($user) {
                return !($user->can_access_modules($module["uid"]) && (bool) $module["hidden"]);
            })
            ->map(function($module) {
                return [
                    "id" => Str::uuid(),
                    "position" => $module["position"],
                    "uid" => $module["uid"],
                    "text" => $module["name"],
                    "link" => $module["slug"],
                    "hidden" => $module["hidden"],
                    "icon" => $module["icon"],
                ];
            })
            ->sortBy("position")
            ->values();
    }

    /**
     * Build permissions menu.
     */
    private function _build_permissions() {
        $user = request()->user();

        if ($user->is_root()) {
            $groups = [];
            $users = [];
            $access_tokens = [];

            if ($user->canAny(["root/user_list", "root/user_create"])) {
                $users = [
                    "id" => Str::uuid(),
                    "text" => "Users",
                    "link" => "/account/permissions/users",
                ];
            }

            if ($user->canAny(["root/group_list", "root/group_create"])) {
                $groups = [
                    "id" => Str::uuid(),
                    "text" => "Groups",
                    "link" => "/account/permissions/groups",
                ];
            }

            if ($user->canAny(["root/access_token_list", "root/access_token_create"])) {
                $access_tokens = [
                    "id" => Str::uuid(),
                    "text" => "Access Tokens",
                    "link" => "/account/permissions/access-tokens",
                ];
            }

            if (empty($groups) && empty($users) && empty($access_tokens)) {
                return [];
            }

            $this->permissions = [
                "id" => Str::uuid(),
                "text" => "Permissions",
                "icon" => "lock",
                "link" => "#",
                "open" => false,
                "children" => array_values(array_filter([
                    $groups,
                    $users,
                    $access_tokens,
                ], function($item) { return !empty($item); })),
            ];
        }
    }

    /**
     * Build settings menu.
     */
    private function _build_settings() {
        if (request()->user()->is_root()) {
            $this->settings = [
                "id" => Str::uuid(),
                "text" => "Settings",
                "icon" => "settings",
                "link" => "#",
                "open" => false,
                "children" => [
                    [
                        "id" => Str::uuid(),
                        "text" => "Services",
                        "link" => "/account/settings/services",
                    ],
                    [
                        "id" => Str::uuid(),
                        "text" => "Styling",
                        "link" => "/account/settings/styling",
                    ],
                    [
                        "id" => Str::uuid(),
                        "text" => "Account",
                        "link" => "/account/settings/account",
                    ]
                ],

            ];
        }
    }
}
