<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $barangayId = $request->user()->barangay_id;
        $documents = Document::where("barangay_id", $barangayId)
            ->with("uploader:id,first_name,last_name,profile_photo_path")
            ->orderBy("created_at", "desc")
            ->get();
            
        return response()->json($documents);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "file" => "required|file|max:10240",
            "description" => "nullable|string"
        ]);

        if ($validator->fails()) {
            return response()->json(["errors" => $validator->errors()], 422);
        }

        $file = $request->file("file");
        $path = $file->store("documents", "public");
        
        $size = $file->getSize();
        $sizeFormatted = $size > 1048576 ? round($size / 1048576, 2) . " MB" : round($size / 1024, 2) . " KB";

        $document = Document::create([
            "barangay_id" => $request->user()->barangay_id,
            "uploaded_by" => $request->user()->id,
            "title" => $request->title,
            "description" => $request->description,
            "file_path" => "/storage/" . $path,
            "file_type" => $file->getClientOriginalExtension(),
            "file_size" => $sizeFormatted,
            "is_public" => $request->boolean("is_public", false),
        ]);

        return response()->json($document->load("uploader:id,first_name,last_name,profile_photo_path"), 201);
    }

    public function destroy(Document $document)
    {
        $relativePath = str_replace("/storage/", "", $document->file_path);
        if (Storage::disk("public")->exists($relativePath)) {
            Storage::disk("public")->delete($relativePath);
        }
        
        $document->delete();
        return response()->json(["message" => "Document deleted"]);
    }
}
