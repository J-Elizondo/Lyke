<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $user_id
 * @property string $url
 * @property int $order
 * @property string|null $caption
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto whereCaption($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPhoto whereUserId($value)
 * @mixin \Eloquent
 */
class UserPhoto extends Model
{
    //
}
