# Zirkus-Empathico-App

## Aktualisieren der Testumgebung

* Ladescreen (reset des Levelstatus) <http://empathie.erstmal.com/dist/>
* Startscreen (beibehalten des Levelstatus) <http://empathie.erstmal.com/dist/main.html#start>

Das Login ist `empathie` und das Passwort ist `fuchs`.

Das Testsystem aktualisiert sich **automatisch**, sobald jemand was in den `master`-Entwicklungszweig einfügt. Sollte es
dennoch nötig sein, kann man das System [manuell](http://empathie.erstmal.com/area51/update.php) aktualisieren.

## Aufsetzen der Entwicklungsumgebung

Anforderungen:

* Nodejs v0.12.0 (<http://nodejs.org/>)
* Sass 3.3.14 (Ruby-Dependency über: `bundle install`, sobald Gemfile des Projekts vorhanden)
* Compass 1.0.0 (Ruby-Dependency über: `bundle install`, sobald Gemfile des Projekts  vorhanden)
* Sass-Globbing 3.3.14 (Ruby-Dependency über: `bundle install`, sobald Gemfile des Projekts vorhanden)
* Java 1.8 (<https://java.com>)
* Android SDK (<https://developer.android.com/sdk/index.html#Other>)
* Git (<https://git-scm.com/downloads>)

Unter **Windows** die Pfade korrekt setzen:

``` console
$ setx ANDROID_HOME <PATH TO ANDROID SDK>
$ setx JAVA_HOME <PATH TO JDK>
$ setx ANT_HOME <PATH TO ANT>
$ setx PATH %PATH%;%ANT_HOME%/bin
```

Testen, dass die richtigen Versionen installiert sind:

``` console
$ node --version
v0.12.0
$ java -version
java version "1.8.0_25"
$ adb version
Android Debug Bridge version 1.0.32
$ git --version
git version 2.5.1
$ sass -r sass-globbing -v
Sass 3.4.18 (Selective Steve)
$ compass --version
Compass 1.0.3 (Polaris)
``` 

Erst danach: Aufsetzen der Arbeitskopie:

``` console
$ git clone git@github.com:DracoBlue/empathie.git empathie
$ cd empathie
$ npm install
$ node_modules/.bin/bower install
```

## Synchronisieren der Videos

Vom UNI-Server ist es möglich die aktuelle Liste der Videos zu bekommen. Diese müssen dann unter `source/media/videos`
gespeichert werden. Sonst kann die App die **Videos NICHT finden**!

## Im Chrome testen

Zu erst mit grunt den Build-Modus starten

``` console
$ node_modules/.bin/grunt build
...
Running "connect:livereload" (connect) task
Started connect web server on 0.0.0.0:9002.
```

und danach die URL <http://0.0.0.0:9002> im Chrome-Browser aufrufen.


## Aktualisieren des Android-Tablets

### Komplett aktualisieren

Einfach das Tablet anschließen und danach den folgenden Befehl ausführen:

``` console
$ node_modules/.bin/grunt setup-tablet
``` 

### Nur HTML/JS aktualisieren

``` console
$ node_modules/.bin/grunt dev
$ node_modules/.bin/grunt cordova:run
```

### Nur Assets aktualisieren

``` console
$ node_modules/.bin/grunt cordova:syncAssets
```

## Tests ausführen

Vorher mocha installieren:

``` console
$ npm install -g mocha
```

Dann ausführen:

``` console
$ mocha

 data/Tasks
    ✓ minigame of level should be the same of task
    ✓ alternatives must not include the emotion
    ✓ must have a person to match task and level

  data/Persons
    1) check if all images exist

  data/Contexts
    ✓ check if all images exist

  4 passing (94ms)
  1 failing
```

## Optimierung der Bilder

Sobald sich neue Bilder im source/media/images Ordner befinden, empfiehlt es sich:

``` console
$ node_modules/.bin/grunt imagemin:source
```

einmalig auszuführen. Dadurch werden die Bilder mit 7-fachem Optimierungslevel von imageoptim optimiert. Die
Bilder sollten erst danach committed werden.

## Technischer Flow der Aufgabe

`LevelPage` startet die States in folgender Reihenfolge:

1. `MiniGameTwoPlayingVideoState` stellt das Video da bis es 6 Sekunden angezeigt wurde
2. `ShowOptionsNextToVideoState` startet danach automatisch
    - Klick der User richtig, wird zur `LevelWonPage` weitergeleitet (es gibt die besondere Belohnung)
    - Klickt der User falsch, wird `ShowFirstHintState` gestartet
3. Im `ShowFirstHintState`
    - Klick der User jetzt richtig, wird zur `LevelWonPage` weitergeleitet (es gibt die besondere Belohnung nicht)
    - Klickt der User noch mal falsch, wird `ShowSecondHintState` gestartet
4. Im `ShowSecondHintState`
    - Klick der User jetzt erst richtig, wird zur `LevelWonPage` weitergeleitet (es gibt die besondere Belohnung nicht)
    - Klickt der User dann noch mal falsch, wird `ShowCorrectionState` gestartet
5. Klickt der User auf das übrig gebliebene Gesicht oder den Weiter-Button wird er wieder zu einer Aufgabe in dem Level
  weitergleitet



## FAQ

* Fehlermeldung: "No Device"
  - Den Befehl `adb devices` ausführen. Wenn dann kein Gerät angezeigt wird, den adb-server mit `adb kill-server` und danach `adb start-server` neustarten.


