<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SendOtpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'phone' => [
                'required',
                'string',
                'regex:/^\+?[1-9]\d{1,14}$/', // E.164 international phone format
            ],
            'country_code' => 'required|string|max:5',
        ];
    }

    /**
     * Retrieves an array of validation messages for mobile i18n language files.
     *
     * @return array An associative array of validation rules and their corresponding messages.
     */
    public function messages(): array
    {
        // To use mobile i18n language files.
        return [
            'phone.regex' => 'enter_valid_phone_number_format',
        ];
    }
}
