<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBarangRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, |array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kode_barang' => 'required|unique:barang',
            'nama_barang' => 'required',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'harga_beli' => 'required|numeric',
            'harga_jual' => 'required|numeric'
        ];
    }
}
