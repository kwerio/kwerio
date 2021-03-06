<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ApiUser extends Model {
    use HasFactory,
        Traits\LocalizeDatetimeAttributes,
        Traits\InteractsWithGroup,
        Traits\InteractsWithModule,
        Traits\InteractsWithAbility,
        Traits\Authorizable;

    protected $guarded = [];

    protected $casts = [
        "is_hashed" => "boolean",
    ];

    public static function boot() {
        parent::boot();

        static::creating(function($model) {
            if (!$model->uuid) {
                $model->uuid = Str::uuid();
            }
        });
    }

    function user() {
        return $this->belongsTo(User::class);
    }
}
