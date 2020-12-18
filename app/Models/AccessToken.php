<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AccessToken extends Model {
    use HasFactory, Traits\LocalizeDatetimeAttributes;

    protected $guarded = [];

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
