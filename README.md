# EasyBook — Full-stack platforma za događaje i rezervacije

**EasyBook** je moderna, full-stack web aplikacija za pregled događaja, upravljanje izvođačima i online rezervacije. Korisnici lako pronalaze i rezervišu događaje (koncerti, festivali, predstave, konferencije, izložbe), dok administratori imaju jasan panel za upravljanje celom platformom.

![Logo](./images/logo.png)

---

## Funkcionalnosti

### Korisnik
- Registracija i prijava.
- Lista događaja sa **pretragom**, **filtrima** i **sortiranjem** po ceni.
- Detalji događaja + prikaz izvođača.
- **Kreiranje rezervacije** (modal), status podrazumevano **`neplaceno`**.
- Stranica **Moje rezervacije** (kartice, 3 u redu): brisanje i ostavljanje **recenzije**.
- Prikaz **svih recenzija** za konkretan događaj (scroll kutija).

### Zaposleni (admin)
- **Dashboard**: slider + KPI kartice + grafici (**Recharts**) sa statistikama rezervacija.
- **Menadžment događaja**: paginirane kartice, kreiranje/izmena/brisanje (modal), polje `link_slike`.
- **Menadžment izvođača**: moderna tabela (pretraga, sortiranje, **paginacija po 5**), modal za kreiranje/izmenu, polje `link_slike`.
- **Rezervacije (admin pregled)**: tabela sa paginacijom (5 po strani), modal *Detalji*, **promena statusa** (plaćeno ↔ neplaćeno), **CSV export**.

---

## Arhitektura i tehnologije

### Frontend
- **React.js** (SPA, React Router, hooks).
- **Recharts** (bar/line grafici na dashboard-u).
- **react-slick** (responsive carousel).
- Stranice: `Pocetna`, `Dogadjaji`, `DogadjajDetalji`, `MojeRezervacije`, `Dashboard`, `MenadzmentDogadjaja`, `MenadzmentIzvodjaca`, `Rezervacije`.
- Komponente: `NavigacioniMeni`, `Futer`, `Button`, `Kartica`.
- Prilagođeni hooks: `useEvents`, `useEventDetails`, `usePerformers`, `usePerformer`, `useTop5Izvodjaca`.

### Backend
- **Laravel** (REST API, validacija, Eloquent relacije, resursi).
- Resursi (`DogadjajResource`, `IzvodjacResource`, `RezervacijaResource`) standardizuju izlaz i dodaju izvedena polja (npr. **ukupna cena**).
- Kontroleri:
  - Događaji/Izvođači: CRUD sa ograničenjima po ulozi.
  - Rezervacije: kreiranje (korisnik), listanje i menjanje statusa (zaposleni), **statistika** i **CSV export**.
- Autentikacija: Bearer token (frontend šalje token u `Authorization` zaglavlju).

### Baza podataka
- **MySQL** sa migracijama i fabrikama.
- Tabele: `users`, `izvodjaci`, `dogadjaji`, `rezervacije` (+ relacije).
- Dodatna polja:
  - `dogadjaji.link_slike` — `longText`
  - `izvodjaci.link_slike` — `longText`

---

## Integracije (javni web servisi)
- **Pexels API** — dinamične slike (landscape) za događaje i avatar zaposlenog u navigaciji.
  - Potreban API ključ:
    ```env
    # Backend .env
    PEXELS_API_KEY=your_pexels_key

    # Frontend .env
    REACT_APP_PEXELS_API_KEY=your_pexels_key
    ```
- **Deezer API** — Top 5 muzičkih izvođača (bez API ključa). 
  - Korišćen JSONP/proxy pristup u hook-u `useTop5Izvodjaca` zbog CORS u lokalnom razvoju.

---

## Korisničke uloge
- **Obični korisnik**: vidi i pretražuje događaje, rezerviše (status *neplaćeno*), upravlja svojim rezervacijama i recenzijama.
- **Zaposleni (admin)**: Dashboard, menadžment događaja/izvođača, pregled svih rezervacija, promena statusa, CSV export, statistika.

---

## UX i dizajn
- Konzistentna paleta (**narandžaste nijanse**), moderan font, čitljiv layout.
- Kartice, tabele sa paginacijom, modalni prozori, breadcrumbs u detaljima, jasne CTA akcije.
- Grafici i KPI kartice pružaju brz uvid u performanse platforme.

---

## Tipičan tok rada
1. **Prijava** → token se čuva na frontendu (sessionStorage).
2. **Korisnik** pregleda događaje, otvara detalje, rezerviše preko modala.
3. **Moje rezervacije**: brisanje, recenzije, pregled ukupne cene (cena * broj karata).
4. **Admin** koristi **Dashboard**, upravlja događajima/izvođačima, vidi sve rezervacije, menja status (*plaćeno/neplaćeno*), preuzima **CSV** i gleda **statistiku**.

---

## Napomene
- Pexels ključ je obavezan za slike; Deezer je javni, ali u lokalnom razvoju se koristi JSONP/proxy zbog CORS.
- CSV export rezervacija je izložen posebnom admin rutom; frontend ga preuzima kao fajl.
- U resursima i kontrolerima postoje dodatna polja i rute za **statističke** preglede.

---

## Instalacija i pokretanje
---------------------------

1. Klonirajte repozitorijum:
```bash
    git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-eventbookingapp_20221033_20200487.git
```
2. Pokrenite backend:
```bash
   cd event-booking-app-backend
   composer install
   php artisan migrate:fresh --seed
   php artisan serve
```
    
3. Pokrenite frontend:
```bash
   cd event-booking-app-frontend
   npm install
   npm start
```
    
4.  Frontend pokrenut na: [http://localhost:3000](http://localhost:3000) Backend API pokrenut na: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)