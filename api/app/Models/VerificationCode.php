<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $phone_number
 * @property string $code
 * @property string $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode wherePhoneNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class VerificationCode extends Model
{

    protected $fillable = [
        'phone_number',
        'code',
        'expires_at',
    ];
}
