# Gut begleitet

Eine lokale Android-App für Betroffene und Angehörige: Krankheiten verstehen, Versorgung und Entlastung planen sowie Unterlagen und Kontakte griffbereit halten.

## Android installieren

[Signierte APK herunterladen](https://github.com/ACID199308/gut-begleitet/raw/refs/heads/main/install/gut-begleitet-1.0.1.apk)

1. APK auf das Smartphone laden und öffnen.
2. Falls Android danach fragt, die Installation aus dieser Quelle zulassen.
3. „Gut begleitet“ öffnen. Es werden kein Konto und kein eigener Server benötigt.

Voraussetzung: Android 8.0 oder neuer mit aktuellem Android System WebView. Die APK ist für Android. Das iOS-Projekt für iPhone und iPad liegt unter `ios/`; die Installation auf einem echten Gerät benötigt eine Apple-Signierung.

## Lokal statt Hintergrundserver

- Alle Inhalte, die zwei Vorsorge-PDFs und die Oberfläche sind in der APK enthalten.
- Die Android-App deklariert **keine INTERNET-Berechtigung**. Sie startet keinen Webserver und verwendet kein Backend, Tracking oder Werbenetzwerk.
- Die vorhandene Oberfläche wird lokal im Android System WebView dargestellt. Das ist eine lokale Android-Verpackung der bestehenden Oberfläche, keine vollständige Neuentwicklung der Oberfläche in Kotlin/Compose.
- Persönliche Angaben liegen im privaten App-Speicher (WebView LocalStorage / IndexedDB), Dokumente ebenfalls lokal. Die App fügt keine eigene Datenverschlüsselung hinzu; für den Geräteschutz gelten die Android-Einstellungen.
- Quellen und offizielle Antragsseiten werden ausschließlich nach Antippen im externen Browser geöffnet. Dafür braucht der externe Browser eine Internetverbindung.
- Downloads und Kalenderexporte verwenden die Android-Dateiauswahl. PDF- und Bildvorschauen werden lokal angezeigt.
- Kamerafotos entstehen über die Kamera-App des Smartphones. Es ist kein Zugriff auf ein Serverkonto nötig.
- Die App nimmt nicht automatisch Anträge vor und führt keine Hintergrund-Serverdienste aus.

## Funktionen

30 Krankheitsthemen, krankheitsbezogenes Lexikon, Wegbegleitung, Pflegeorientierung für Deutschland/Österreich/Schweiz, Hilfe und Antragswege einschließlich Rentenversicherung, Planer mit Kalenderexport, Entlastungsplanung, Fortschritte und Rückschläge, Kontakte und Versicherungsnummer sowie lokale Dokumentenablage mit Kamera-Import.

Die Vorlagen für Patientenverfügung (Textbausteine) und Vorsorgevollmacht stammen unverändert vom Bundesjustizministerium und beziehen sich auf Deutschland. Hinweise und Originalquellen bleiben in der App sichtbar.

## Daten und Updates

Browser-/Synology-Daten werden **nicht automatisch** in die installierte Android-App übertragen. Ein Update mit derselben Paketkennung und demselben Signierschlüssel behält normalerweise den App-Speicher. Deinstallation oder „App-Daten löschen“ entfernt ihn. Originale und Sicherungskopien wichtiger Unterlagen separat aufbewahren.

Für Kalenderhinweise außerhalb der App einen exportierten Termin importieren und die Kalender-Erinnerung prüfen. Die App selbst versendet keine eigenen Hintergrundbenachrichtigungen.

## Projektstruktur

- `web/src/`: bearbeitbare Inhalte, Oberfläche und lokale Funktionen
- `web/index.html`: gebündelte Webversion
- `android/app/src/main/`: Android-Aktivitäten, Manifest und Ressourcen
- `android/android-bridge.js`: lokale Anbindung für Kamera-/Dateiauswahl und Export
- `scripts/build-web.mjs`: bündelt die Weboberfläche
- `scripts/build-android.mjs`: baut und signiert die Android-APK
- `scripts/check.mjs`: Funktions- und Strukturprüfungen
- `install/`: veröffentlichte signierte APK

## Selbst bauen

Benötigt werden Node.js, ein JDK 17 und Android SDK Platform 35 sowie Build Tools 35.0.0. Die Werkzeuge stammen von den offiziellen Anbietern. Es gibt keine npm-Laufzeitabhängigkeiten und keinen Gradle-Download beim App-Start.

```powershell
$env:JAVA_HOME = 'C:\Pfad\zum\jdk-17'
$env:ANDROID_SDK_ROOT = 'C:\Pfad\zum\Android\Sdk'
$env:GUT_KEYSTORE = 'C:\Privat\gut-begleitet.p12'
$env:GUT_KEYSTORE_PASSWORD = 'DEIN_LOKALES_PASSWORT'
node scripts/build-web.mjs
node scripts/check.mjs
node scripts/build-android.mjs
```

Der Signierschlüssel benötigt den Alias `gutbegleitet`. Schlüssel und Passwort gehören nicht ins Repository. Für Updates der veröffentlichten APK muss derselbe Signierschlüssel verwendet werden. Eine neue Versionsnummer und `versionCode` im Manifest setzen und den Ausgabedateinamen im Buildskript entsprechend anpassen.

## Prüfung

Die APK wurde kompiliert, ausgerichtet und mit APK-Signaturen v2/v3 signiert. Das Manifest wird auf fehlende Netzwerkberechtigungen geprüft. Die JavaScript-Funktionen werden automatisiert geprüft. Kamera, Dateiauswahl und Darstellung müssen zusätzlich auf realen Zielgeräten geprüft werden; aus einem erfolgreichen Build folgt kein abgeschlossener Gerätetest.

Die medizinischen und sozialrechtlichen Informationen dienen der Orientierung und ersetzen keine persönliche Beratung oder Entscheidung der zuständigen Stellen.

## Quellen und Rechte

Die Inhalte enthalten Links zu ihren offiziellen Grundlagen. Eingebettete amtliche PDF-Vorlagen sind unveränderte Fremddokumente; deren Rechte und Quellenangaben bleiben erhalten. Die Veröffentlichung dieses Repositorys vergibt für diese Dokumente keine zusätzliche Lizenz. Für den Projektcode wurde bislang keine gesonderte Open-Source-Lizenz ausgewählt.

## iOS-App

Die gleiche lokale Oberfläche ist als iOS-App mit Swift und WKWebView enthalten, einschließlich des App-Icons. Persönliche Angaben und Dokumente werden über eine native lokale Ablage gespeichert. PDF-/Bildvorschauen laufen mit Quick Look; Datei-Exporte mit der iOS-Dateiauswahl und Kalendereinträge mit EventKitUI. Es gibt keinen lokalen Webserver, kein Backend und keinen verpflichtenden Online-Login. Externe Quellen öffnen nur auf Wunsch in einer anderen App.

```sh
node scripts/build-web.mjs
node scripts/prepare-ios.mjs
open ios/GutBegleitet.xcodeproj
```

In Xcode unter „Signing & Capabilities“ die eigene Apple-ID beziehungsweise das eigene Team wählen. Das Projekt verwendet keine fremden Zertifikate. Die mitgelieferte Kennung `de.acid199308.gutbegleitet` muss bei Bedarf für das eigene Team angepasst werden.

Unter GitHub Actions wird auf einem macOS-Runner ein unsignierter **Simulator-Build** erzeugt, im iPhone-Simulator gestartet und die lokale Speicherung geprüft. Ein Simulator-Paket ist **nicht auf einem echten iPhone installierbar** und keine IPA für TestFlight. Eine signierte Geräteversion setzt passende Apple-Signierungsdaten und einen Mac-/Xcode-Bauweg voraus. Eine Apple-ID auf dem iPhone allein ersetzt diesen Schritt nicht.

Offizielle Hinweise: [Xcode – App auf einem Gerät starten](https://help.apple.com/xcode/mac/current/en.lproj/dev5a825a1ca.html). Es wurde kein kostenpflichtiges Apple-Konto eröffnet und nichts an Apple zur Veröffentlichung gesendet.

### iPhone-Paket für eigene Signierung

GitHub Actions baut zusätzlich ein unsigniertes arm64-Gerätepaket: `GutBegleitet-iOS-unsigniert.ipa`. Dieses Paket läuft auf einem echten iPhone erst nach persönlicher Apple-Signierung. Es ist keine direkt installierbare oder für TestFlight freigegebene Datei. Der Simulator-Test ersetzt keinen Test der Kamera und Dateiauswahl auf einem echten iPhone.

Ohne eigenen Mac ist beispielsweise eine persönliche Installation über [AltStore Classic und Windows](https://faq.altstore.io/altstore-classic/how-to-install-altstore-windows) möglich. Dazu richtet man AltServer auf dem Windows-PC ein und importiert die IPA anschließend in AltStore auf dem verbundenen iPhone. Die Apple-Anmeldung erfolgt dabei selbst in AltServer/AltStore; Zugangsdaten gehören nicht ins Repository oder in den Chat. Bei einem kostenlosen Apple-Konto muss die Freigabe nach sieben Tagen erneuert werden ([AltStore-Hinweise](https://faq.altstore.io/altstore-classic/your-altstore)). AltServer wird zum Installieren/Erneuern benötigt; Gut begleitet selbst benötigt im Betrieb keinen Server. Dieser Installationsweg wurde hier nicht auf einem echten iPhone getestet.
