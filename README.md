# Εφαρμογή Κράτησης Εστιατορίων - CN6035

## Περιγραφή

Αυτή είναι μια εφαρμογή για κινητές συσκευές που αναπτύχθηκε στο πλαίσιο του μαθήματος "Mobile & Distributed Systems" (CN6035). Επιτρέπει στους χρήστες να δημιουργούν λογαριασμό, να συνδέονται, να βλέπουν μια λίστα διαθέσιμων εστιατορίων, να κάνουν κράτηση τραπεζιού και να βλέπουν το ιστορικό των κρατήσεών τους.

## Αρχιτεκτονική Συστήματος

Το σύστημα ακολουθεί μια αρχιτεκτονική Client-Server:
* **Frontend (Client):** Μια εφαρμογή React Native (CLI) γραμμένη σε TypeScript.
* **Backend (Server):** Ένα REST API υλοποιημένο με Node.js και Express.js.
* **Database:** Μια σχεσιακή βάση δεδομένων MariaDB.
* **Authentication:** Η ταυτοποίηση των χρηστών γίνεται με JSON Web Tokens (JWT).

## Τεχνολογίες που Χρησιμοποιήθηκαν

* **Frontend:**
    * React Native
    * TypeScript
    * Axios (για HTTP requests)
    * React Navigation (για πλοήγηση)
    * `@react-native-async-storage/async-storage` (για τοπική αποθήκευση του token)
    * `@react-native-community/datetimepicker` (για επιλογή ημερομηνίας/ώρας)
* **Backend:**
    * Node.js
    * Express.js
    * MariaDB (μέσω του `mariadb` npm package)
    * JSON Web Token (`jsonwebtoken`)
    * `bcryptjs` (για hashing κωδικών)
    * `cors`
    * `dotenv`
* **Βάση Δεδομένων:**
    * MariaDB (συνήθως μέσω XAMPP)
* **Version Control:**
    * Git & GitHub

## Βασικές Λειτουργίες

* Εγγραφή νέου χρήστη.
* Σύνδεση χρήστη με email και password (επιστροφή JWT).
* Προβολή λίστας διαθέσιμων εστιατορίων (προστατευμένο endpoint).
* Δημιουργία νέας κράτησης σε εστιατόριο (προστατευμένο endpoint).
* Προβολή ιστορικού κρατήσεων του συνδεδεμένου χρήστη (προστατευμένο endpoint).
* Logout χρήστη.
* Πλοήγηση με Bottom Tabs μετά τη σύνδεση (Εστιατόρια, Προφίλ).

---

## Οδηγίες Εγκατάστασης & Εκτέλεσης

### Απαιτήσεις Περιβάλλοντος

* [Node.js](https://nodejs.org/) (έκδοση 18.x ή νεότερη προτείνεται)
* [XAMPP](https://www.apachefriends.org/index.html) (ή άλλη εγκατάσταση MariaDB/MySQL)
* [Android Studio](https://developer.android.com/studio) (για το Android SDK, NDK, και εργαλεία build)
    * Βεβαιωθείτε ότι το Android SDK Location είναι σωστά ρυθμισμένο (π.χ., `G:\Android\Sdk`).
    * Βεβαιωθείτε ότι το NDK (Side by side) είναι εγκατεστημένο μέσω του SDK Manager.
* Ρυθμισμένες μεταβλητές περιβάλλοντος:
    * `ANDROID_HOME` να δείχνει στο Android SDK Location (π.χ., `G:\Android\Sdk`).
    * Το `Path` να περιλαμβάνει:
        * `%ANDROID_HOME%\platform-tools`
        * `%ANDROID_HOME%\emulator` (αν χρησιμοποιείτε εξομοιωτή)
        * `C:\Windows\System32\wbem` (για την εντολή `wmic`)
* Μια φυσική συσκευή Android ή ένας ρυθμισμένος εξομοιωτής.
* [Git](https://git-scm.com/)

---

### Backend Setup

1.  **Εκκινήστε το XAMPP Control Panel:** Ξεκινήστε τις υπηρεσίες Apache και MySQL.
2.  **Δημιουργία Βάσης Δεδομένων:**
    * Ανοίξτε το phpMyAdmin (συνήθως από το XAMPP Control Panel -> MySQL -> Admin).
    * Δημιουργήστε μια νέα βάση δεδομένων με όνομα `restaurant_booking_db` και κωδικοποίηση `utf8mb4_general_ci`.
    * Επιλέξτε τη βάση `restaurant_booking_db` και πηγαίνετε στην καρτέλα "SQL".
    * Αντιγράψτε και εκτελέστε τις εντολές SQL από το αρχείο `backend/database_schema.sql` (Αυτό το αρχείο πρέπει να το δημιουργήσεις εσύ, βάζοντας μέσα τις `CREATE TABLE` εντολές και τα `INSERT` για τα εστιατόρια που σου είχα δώσει παλαιότερα).
3.  **Ρύθμιση του Project:**
    * Ανοίξτε ένα terminal και πλοηγηθείτε στον φάκελο `backend` του project (`G:\RestaurantApp\backend`).
    * Δημιουργήστε ένα αρχείο `.env` αντιγράφοντας το περιεχόμενο από το `backend/.env.example` (Πρέπει να δημιουργήσεις ένα αρχείο `.env.example` χωρίς τις πραγματικές τιμές).
        * **Παράδειγμα `.env.example`:**
            ```env
            DB_HOST=localhost
            DB_USER=root
            DB_PASSWORD=YOUR_MARIADB_PASSWORD_IF_ANY
            DB_DATABASE=restaurant_booking_db
            DB_PORT=3036 # Ή όποιο port χρησιμοποιεί η MariaDB σου
            JWT_SECRET=YOUR_VERY_OWN_JWT_SUPER_SECRET
            ```
    * Συμπληρώστε τις σωστές τιμές στο δικό σας `.env` αρχείο.
    * Τρέξτε `npm install` για να εγκαταστήσετε τις εξαρτήσεις.
4.  **Εκκίνηση του Backend Server:**
    * Τρέξτε `npm start`.
    * Ο server θα πρέπει να τρέχει στο `http://localhost:5000` και να συνδεθεί επιτυχώς στη βάση.

---

### Frontend Setup

1.  **Ρύθμιση Περιβάλλοντος:** Βεβαιωθείτε ότι έχετε ακολουθήσει τις οδηγίες εγκατάστασης για React Native CLI από την [επίσημη τεκμηρίωση](https://reactnative.dev/docs/environment-setup) (Development OS: Windows, Target OS: Android), λαμβάνοντας υπόψη ότι το SDK σας είναι στο `G:\Android\Sdk`.
2.  **Ρύθμιση Project:**
    * Ανοίξτε ένα terminal και πλοηγηθείτε στον φάκελο `frontend` του project (`G:\RestaurantApp\frontend`).
    * Βεβαιωθείτε ότι το αρχείο `android/local.properties` υπάρχει και περιέχει τη σωστή διαδρομή προς το SDK:
        ```properties
        sdk.dir = G\:\\Android\\Sdk 
        ```
        (ή `sdk.dir = G:/Android/Sdk`)
    * **ΚΡΙΣΙΜΟ:** Ανοίξτε το αρχείο `src/api/api.ts` και αλλάξτε το `YOUR_COMPUTER_IP` στην `const API_URL` με την τρέχουσα τοπική IP διεύθυνση του υπολογιστή που τρέχει τον backend server (π.χ., `http://192.168.1.5:5000/api`).
    * Τρέξτε `npm install` για να εγκαταστήσετε τις εξαρτήσεις.
3.  **Εκκίνηση της Εφαρμογής:**
    * Βεβαιωθείτε ότι μια φυσική συσκευή Android είναι συνδεδεμένη και αναγνωρίζεται (`adb devices`).
    * Τρέξτε `npx react-native run-android`.
    * Ένας Metro Bundler θα ξεκινήσει σε νέο παράθυρο. Μην τον κλείσετε.
    * Η εφαρμογή θα πρέπει να εγκατασταθεί και να ξεκινήσει στη συσκευή.

---

## (Προαιρετικά) API Endpoints

* `POST /api/users/register` - Εγγραφή νέου χρήστη
* `POST /api/users/login` - Σύνδεση χρήστη
* `GET /api/restaurants` - (Προστατευμένο) Λήψη λίστας εστιατορίων
* `POST /api/reservations` - (Προστατευμένο) Δημιουργία νέας κράτησης
* `GET /api/reservations/myreservations` - (Προστατευμένο) Λήψη κρατήσεων του συνδεδεμένου χρήστη

---