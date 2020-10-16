<?php

namespace App\Http\Controllers\Account\Permissions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{
    User as UserModel,
};

class UserController extends Controller {
    private $columns = [
        "uuid",
        "email",
        "first_name",
        "last_name",
        "locale",
        "is_rtl",
        "timezone",
        "locale_iso_format",
        "created_at",
        "updated_at",
    ];

    /**
     * Show users page.
     *
     * @return View
     */
    function show_page() {
        return view("account.permissions.users");
    }

    /**
     * Show users page.
     *
     * @return array
     */
    function index(Request $request) {
        $data = $request->validate([
            "page" => "required|numeric",
            "sorts" => "required|array",
            "q" => "",
        ]);

        $query = UserModel::query();

        if (!empty($data["q"])) {
            $query->where("email", "like", "%{$data['q']}%")
                ->orWhere("first_name", "like", "%{$data['q']}%")
                ->orWhere("last_name", "like", "%{$data['q']}%");
        }

        foreach ($data["sorts"] as $sort) {
            $query->orderBy($sort["name"], $sort["dir"] ?? "asc");
        }

        $items = $query->paginate(config("app.per_page"));

        return $this->_normalize($items);
    }

    /**
     * Normalize the users.
     *
     * @param Collection $users
     * @return array
     */
    function _normalize($users) {
        $items = $users->map(function($user) {
            return $user->only($this->columns);
        });

        $total = UserModel::count();
        $page = request()->get("page");

        return [
            "items" => $items,
            "total" => $total,
            "next_page" => $total === config("app.per_page") ? $page + 1 : $page,
        ];
    }
}
