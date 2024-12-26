<?php

namespace App\Http\Controllers;

use App\Models\Dogadjaj;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\DogadjajResource;

class DogadjajController extends Controller
{
    /**
     * Prikaz svih događaja (dostupno svim korisnicima).
     */
    public function index()
    {
        $dogadjaji = Dogadjaj::with('izvodjac')->get();
        return DogadjajResource::collection($dogadjaji);
    }

    /**
     * Prikaz određenog događaja (dostupno svim korisnicima).
     */
    public function show($id)
    {
        $dogadjaj = Dogadjaj::with('izvodjac')->findOrFail($id);
        return new DogadjajResource($dogadjaj);
    }

    /**
     * Dodavanje novog događaja (dostupno samo radnicima).
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu dodavati nove događaje.'], 403);
        }

        $validated = $request->validate([
            'naziv' => 'required|string|max:255',
            'datum' => 'required|date|after:today',
            'lokacija' => 'required|string|max:255',
            'tip_dogadjaja' => 'required|in:koncert,festival,predstava,konferencija,izlozba',
            'opis' => 'nullable|string|max:5000',
            'cena' => 'required|numeric|min:0',
            'izvodjac_id' => 'required|exists:izvodjaci,id',
        ]);

        $dogadjaj = Dogadjaj::create($validated);

        return response()->json(['message' => 'Događaj uspešno kreiran.', 'dogadjaj' => new DogadjajResource($dogadjaj)], 201);
    }

    /**
     * Ažuriranje svih informacija o događaju (dostupno samo radnicima).
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu ažurirati događaje.'], 403);
        }

        $dogadjaj = Dogadjaj::findOrFail($id);

        $validated = $request->validate([
            'naziv' => 'string|max:255',
            'datum' => 'date|after:today',
            'lokacija' => 'string|max:255',
            'tip_dogadjaja' => 'in:koncert,festival,predstava,konferencija,izlozba',
            'opis' => 'nullable|string|max:5000',
            'cena' => 'required|numeric|min:0',
            'izvodjac_id' => 'exists:izvodjaci,id',
        ]);

        $dogadjaj->update($validated);

        return response()->json(['message' => 'Događaj uspešno ažuriran.', 'dogadjaj' => new DogadjajResource($dogadjaj)]);
    }

    /**
     * Ažuriranje samo datuma događaja (dostupno samo radnicima).
     */
    public function updateDate(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu menjati datum događaja.'], 403);
        }

        $dogadjaj = Dogadjaj::findOrFail($id);

        $validated = $request->validate([
            'datum' => 'required|date|after:today',
        ]);

        $dogadjaj->update(['datum' => $validated['datum']]);

        return response()->json(['message' => 'Datum događaja uspešno ažuriran.', 'dogadjaj' => new DogadjajResource($dogadjaj)]);
    }

       /**
     * Brisanje događaja (dostupno samo radnicima).
     */
    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu brisati događaje.'], 403);
        }

        $dogadjaj = Dogadjaj::findOrFail($id);

        $dogadjaj->delete();

        return response()->json(['message' => 'Događaj uspešno obrisan.']);
    }
    /**
     * Pretraga događaja na osnovu naziva sa paginacijom.
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'naziv' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:50', // Broj rezultata po stranici
        ]);

        $query = Dogadjaj::query();

        if (!empty($validated['naziv'])) {
            $query->where('naziv', 'like', '%' . $validated['naziv'] . '%');
        }

        $perPage = $validated['per_page'] ?? 10; // Podrazumevano 10 rezultata po stranici

        $dogadjaji = $query->with('izvodjac')->paginate($perPage);

        return DogadjajResource::collection($dogadjaji);
    }

}
