<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Ability extends Model {
    use HasFactory;

    protected $guarded = [];

    public static function boot() {
        parent::boot();

        self::creating(function($model) {
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid();
            }
        });
    }

    function module() {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get users who have this ability.
     *
     * @return BelongsToMany
     */
    function users() {
        return $this->belongsToMany(User::class);
    }

    /**
     * Get groups who have this ability.
     *
     * @return BelongsToMany
     */
    function groups() {
        return $this->belongsToMany(Group::class);
    }

    /**
     * Get all abilities normalized.
     *
     * @return array
     */
    static function all_normalized() {
        $abilities = Ability::get()->map(function($item) {
            return [
                "uuid" => $item->uuid,
                "name" => $item->name,
                "description" => $item->description,
                "created_at" => $item->created_at,
                "updated_at" => $item->updated_at,
            ];
        });

        return [
            "items" => $abilities,
            "total" => Ability::count(),
        ];
    }
}
