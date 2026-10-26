# Gut begleitet

Eine lokale Android-App für Betroffene und Angehörige: Krankheiten verstehen, Versorgung und Entlastung planen sowie Unterlagen und Kontakte griffbereit halten.

## Android installieren

[Signierte APK herunterladen](https://github.com/ACID199308/gut-begleitet/raw/refs/heads/main/install/gut-begleitet-1.0.0.apk)

1. APK auf das Smartphone laden und öffnen.
2. Falls Android danach fragt, die Installation aus dieser Quelle zulassen.
3. „Gut begleitet“ öffnen. Es werden kein Konto und kein eigener Server benötigt.

Voraussetzung: Android 8.0 oder neuer mit aktuellem Android System WebView. Die APK ist für Android; für iPhones wird eine gesonderte iOS-App benötigt.

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
