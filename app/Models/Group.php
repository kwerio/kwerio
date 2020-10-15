<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Group extends Model {
    use HasFactory, Traits\LocalizeDatetimeAttributes;

    protected $guarded = [];
    protected $hidden = ["pivot"];
    protected $with = ["modules"];

    public static function boot() {
        parent::boot();

        static::creating(function($model) {
            if (!$model->uuid) {
                $model->uuid = Str::uuid();
            }
        });
    }

    function modules() {
        return $this->belongsToMany(Module::class);
    }
}
