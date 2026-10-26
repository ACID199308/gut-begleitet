// Plain-language editorial content. Sources were consulted on 24 October 2026.
const moreConditions=[
['diabetes1','Diabetes Typ 1','Stoffwechsel','diabetes-typ-1','Das Immunsystem zerstört insulinbildende Zellen der Bauchspeicheldrüse. Der Körper braucht deshalb Insulin von außen.','Insulintherapie, Schulung und regelmäßige Kontrollen werden individuell abgestimmt.','Wie passe ich meinen Alltag an die Insulintherapie an?'],
['diabetes2','Diabetes Typ 2','Stoffwechsel','diabetes-typ-2','Die Körperzellen reagieren weniger gut auf Insulin. Später kann auch die Insulinproduktion abnehmen, sodass der Blutzucker steigt.','Behandlung umfasst passende Alltagsveränderungen und bei Bedarf Medikamente oder Insulin.','Welche Behandlungsziele passen zu meiner Situation?'],
['demenz','Alzheimer-Demenz','Gehirn & Nerven','alzheimer-demenz','Bei Alzheimer werden Nervenzellen zunehmend geschädigt. Gedächtnis, Orientierung und andere geistige Fähigkeiten lassen nach.','Medikamentöse und nichtmedikamentöse Behandlung sowie Unterstützung im Alltag werden gemeinsam geplant.','Welche Unterstützung erhält unsere Familie jetzt und später?'],
['copd','COPD','Atemwege','chronisch-obstruktive-lungenerkrankung-copd','Bei COPD sind die Atemwege dauerhaft verengt. Zusätzlich können Lungenbläschen geschädigt sein; das Ausatmen wird erschwert.','Inhalationstherapie, Bewegung, Schulung und Rauchstopp-Unterstützung sind wichtige Bausteine.','Wie erkenne ich eine Verschlechterung und wie reagiere ich?'],
['herzschwaeche','Herzschwäche (Herzinsuffizienz)','Herz & Kreislauf','herzschwaeche','Das Herz kann den Körper nicht ausreichend mit Blut versorgen oder füllt sich nicht ausreichend. Flüssigkeit kann sich zurückstauen.','Ursachenbehandlung, passende Medikamente und individuell abgestimmte Bewegung bilden zentrale Bausteine.','Welche Veränderungen muss ich frühzeitig melden?'],
['depression','Depression','Psychische Gesundheit','depression','Eine Depression verändert Stimmung, Antrieb und Denken. Körperliche Beschwerden sind ebenfalls möglich; sie ist eine behandelbare Erkrankung.','Psychotherapie und Medikamente kommen je nach Schweregrad, Verlauf und persönlichen Wünschen infrage.','Welche Behandlung und Unterstützung passen zu mir?'],
['arthrose','Arthrose','Gelenke & Bewegung','arthrose','Bei Arthrose verändert sich das gesamte Gelenk. Der schützende Knorpel wird geschädigt; Schmerzen und Bewegungseinschränkungen können entstehen.','Bewegung, Training und abgestimmte Schmerzbehandlung stehen im Mittelpunkt; manchmal kommt ein Gelenkersatz infrage.','Welche Belastung und Übungen sind für mein Gelenk geeignet?'],
['rheuma','Rheumatoide Arthritis','Gelenke & Bewegung','rheumatoide-arthritis','Das Immunsystem verursacht Entzündungen vor allem an der Gelenkinnenhaut. Unbehandelt können Gelenke dauerhaft geschädigt werden.','Eine frühzeitige rheumatologische Behandlung soll Entzündung kontrollieren und Gelenkfunktion erhalten.','Welche Therapie soll die Entzündung langfristig kontrollieren?']
];
for(const [id,name,group,path,body,care,question] of moreConditions)conditions[id]={name,group,source:'https://gesund.bund.de/'+path,publisher:'gesund.bund.de',body,care,daily:'Kontrolltermine, Behandlung und benötigte Unterstützung gemeinsam planen.',questions:[question,'An wen kann ich mich bei neuen Beschwerden wenden?'],phases:chronicPhases,steps:['Diagnose und persönliche Befunde verstehen.','Behandlungsziele und Möglichkeiten besprechen.','Alltag und Unterstützung an den Bedarf anpassen.','Verlauf und Behandlung regelmäßig überprüfen.'],tasks:['Individuellen Behandlungsplan klären','Fragen zum Alltag sammeln','Kontrolltermine und Ansprechpersonen festhalten']};
function knowledge(symptoms,diagnosis,treatment,course,life,relatives,warning,terms,extraSource){return {symptoms,diagnosis,treatment,course,life,relatives,warning,terms,extraSource}}
const knowledgeDetails={
schlaganfall:knowledge(
['Plötzliche einseitige Schwäche, hängender Mundwinkel oder Taubheit.','Sprach-, Seh- oder Gleichgewichtsstörungen; manchmal ungewohnt heftiger Kopfschmerz.'],
['Neurologische Untersuchung sowie CT oder MRT unterscheiden Gefäßverschluss und Blutung.','Gefäße, Herzrhythmus und Blutwerte helfen, Ursachen und weitere Risiken abzuklären.'],
['Bei einem Gefäßverschluss können je nach Zeitfenster und Befund eine Gerinnselauflösung oder Katheterbehandlung infrage kommen. Bei Blutungen gelten andere Verfahren.','Rehabilitation kann Bewegung, Sprache, Schlucken und Alltagsfähigkeiten trainieren.'],
'Die Erholung hängt von Ort und Ausmaß der Schädigung und weiteren Faktoren ab. Fortschritte können unterschiedlich schnell verlaufen; bleibende Einschränkungen sind möglich.',
['Schluckfähigkeit vor Essen und Trinken vom Team beurteilen lassen.','Medikamente, Nachsorge und Schutz vor einem weiteren Schlaganfall gemeinsam planen.'],
'Geduld und kurze, klare Gespräche helfen. Bei Sprachproblemen Zeit lassen und die betroffene Person in Entscheidungen einbeziehen.',
'Bei plötzlich neuen Lähmungen, Sprach- oder Sehstörungen sofort Notruf wählen – auch wenn sie nachlassen.',
[['Ischämisch','Durch einen Gefäßverschluss verursacht.'],['Aphasie','Störung der Sprache durch eine Hirnschädigung.']],
'https://www.gesundheitsinformation.de/schlaganfall.html'),
hiv:knowledge(
['Früh können grippeähnliche Beschwerden auftreten; eine Infektion kann auch lange unbemerkt bleiben.','Eine fortgeschrittene Immunschwäche begünstigt bestimmte Infektionen und andere Erkrankungen.'],
['Ein HIV-Suchtest und erforderlichenfalls Bestätigungstests sichern die Diagnose.','Viruslast und CD4-Zellzahl geben Hinweise auf Virusvermehrung und Zustand der Immunabwehr.'],
['Eine Kombination antiretroviraler Wirkstoffe unterdrückt die Virusvermehrung.','Bei AIDS müssen zusätzlich auftretende Erkrankungen behandelt werden.'],
'Unter wirksamer, fortgesetzter Therapie kann HIV eine langfristig gut behandelbare Erkrankung sein. Behandlung verhindert in vielen Fällen die Entwicklung von AIDS.',
['Einnahme und mögliche Wechselwirkungen mit der Schwerpunktpraxis besprechen.','HIV wird durch Händeschütteln, Umarmen oder gemeinsames Geschirr nicht übertragen.'],
'Vertraulichkeit respektieren. Die betroffene Person entscheidet selbst, wem sie ihre Diagnose mitteilt; Unterstützung ohne Schuldzuweisungen anbieten.',
'Nach einer möglichen frischen HIV-Exposition sofort medizinisch abklären lassen, ob eine PEP nötig ist. Nicht erst auf Symptome warten.',
[['Viruslast','Menge an HIV im Blut.'],['CD4-Zellen','Bestimmte Abwehrzellen des Immunsystems.']],
'https://www.gesundheit.gv.at/krankheiten/immunsystem/hiv-aids.html'),
parkinson:knowledge(
['Verlangsamte Bewegungen, Muskelsteifigkeit und oft Zittern in Ruhe.','Auch Schlaf, Stimmung, Verdauung oder Geruchssinn können beeinträchtigt sein.'],
['Neurologische Untersuchung, Krankengeschichte und Verlauf sind entscheidend.','Weitere Untersuchungen können andere Ursachen ähnlicher Beschwerden ausschließen.'],
['Medikamente beeinflussen den Dopaminhaushalt und lindern Beschwerden.','Physio-, Ergo- und Sprachtherapie unterstützen Funktionen. Bei ausgewählten Betroffenen kommen Pumpentherapien oder tiefe Hirnstimulation infrage.'],
'Parkinson schreitet meist langsam voran, aber sehr unterschiedlich. Die Wirkung von Medikamenten kann im Tagesverlauf schwanken und Anpassungen erfordern.',
['Wirkzeiten, Beweglichkeit und Nebenwirkungen für das ärztliche Gespräch notieren.','Sicheres Gehen, Hilfsmittel und Schluckprobleme früh ansprechen.'],
'Bewegungen Zeit geben und Selbstständigkeit unterstützen. Auch leise Sprache oder ein wenig bewegter Gesichtsausdruck sagen nichts über das Interesse der Person aus.',
'Neue ausgeprägte Schluckprobleme, Stürze oder starke Verwirrtheit zeitnah medizinisch abklären. Medikamente nicht eigenständig plötzlich absetzen.',
[['Dopamin','Botenstoff, der unter anderem Bewegung steuert.'],['On-/Off-Phasen','Zeiten besserer beziehungsweise schlechterer Beweglichkeit.']],
'https://www.gesundheitsinformation.de/parkinson.html'),
herzinfarkt:knowledge(
['Druck, Enge oder Schmerzen im Brustkorb, teilweise mit Ausstrahlung.','Auch Atemnot, Übelkeit, kalter Schweiß oder ungewöhnliche Schwäche sind möglich.'],
['EKG und wiederholte Bluttests, vor allem Troponin, helfen bei der Diagnose.','Eine Herzkatheteruntersuchung kann verschlossene Herzkranzgefäße sichtbar machen.'],
['Ein verschlossenes Gefäß wird häufig rasch per Herzkatheter eröffnet und gegebenenfalls mit einem Stent versorgt.','Medikamente und kardiologische Reha unterstützen Nachbehandlung und Schutz vor weiteren Ereignissen.'],
'Verbleibende Herzfunktion, schnelle Akutbehandlung und Begleiterkrankungen beeinflussen die Erholung. Eine Herzschwäche oder Rhythmusstörungen können Folgen sein.',
['Belastung und Rückkehr in Beruf oder Sport individuell abstimmen.','Gerinnungshemmende und andere verordnete Medikamente nicht eigenständig absetzen.'],
'Ängste nach einem Infarkt ernst nehmen. Begleitung bei Reha und Terminen anbieten, ohne die betroffene Person unnötig in ihrer Selbstständigkeit einzuschränken.',
'Bei Verdacht auf Herzinfarkt sofort Notruf wählen. Nicht selbst zur Klinik fahren und nicht auf Besserung warten.',
[['Troponin','Blutwert, der eine Herzmuskelschädigung anzeigen kann.'],['Stent','Kleine Gefäßstütze, die ein Gefäß offen hält.']]),
epilepsie:knowledge(
['Anfälle können Zuckungen, Bewusstlosigkeit oder kurze Abwesenheiten verursachen.','Auch ungewöhnliche Sinneswahrnehmungen oder einzelne Muskelbewegungen sind möglich.'],
['Eine genaue Ereignisbeschreibung ist wichtig; Angaben von Zeugen können helfen.','EEG misst elektrische Hirnaktivität. MRT kann strukturelle Ursachen zeigen.'],
['Anfallsvorbeugende Medikamente werden passend zur Anfallsform ausgewählt.','Bei unzureichender Wirkung können spezialisierte Zentren weitere Möglichkeiten prüfen.'],
'Mit Behandlung lassen sich Anfälle bei vielen Menschen kontrollieren. Andere haben weiter Anfälle und benötigen zusätzliche Unterstützung.',
['Anfallsplan und gegebenenfalls verordnete Notfallmedikation besprechen.','Schlaf, sichere Freizeitgestaltung, Beruf und Fahrtauglichkeit individuell klären.'],
'Bei einem Anfall vor Verletzungen schützen, Zeit messen, nicht festhalten und nichts in den Mund stecken.',
'Notruf bei einem ersten Anfall, mehr als fünf Minuten Dauer, mehreren Anfällen ohne Erholung, Atemproblemen oder schweren Verletzungen.',
[['EEG','Messung der elektrischen Aktivität des Gehirns.'],['Fokal','Von einem begrenzten Hirnbereich ausgehend.']],
'https://www.gesundheitsinformation.de/epilepsie.html'),
ms:knowledge(
['Sehstörungen, Kribbeln, Schwäche oder Gleichgewichtsprobleme sind möglich.','Fatigue und Probleme mit Blase oder Konzentration können ebenfalls auftreten.'],
['Neurologische Untersuchung und MRT suchen nach typischen Veränderungen.','Je nach Befund folgen Untersuchung des Nervenwassers und weitere Tests; andere Ursachen werden ausgeschlossen.'],
['Akute Schübe können gesondert behandelt werden. Verlaufsmodifizierende Medikamente sollen Krankheitsaktivität bremsen.','Beschwerdebezogene Therapien und Rehabilitation unterstützen Fähigkeiten und Lebensqualität.'],
'MS kann schubförmig oder fortschreitend verlaufen. Verlauf und Einschränkungen sind sehr verschieden; eine Diagnose erlaubt keine feste persönliche Prognose.',
['Energie einteilen und Fatigue ernst nehmen.','Neue Beschwerden, Infektionen und Medikamentennebenwirkungen mit dem Team besprechen.'],
'Schwankende Leistungsfähigkeit akzeptieren. Unsichtbare Beschwerden wie Fatigue sind keine fehlende Motivation.',
'Neue oder deutlich zunehmende neurologische Beschwerden zeitnah abklären; plötzlich einsetzende Ausfälle können auch andere Notfälle sein.',
[['Myelin','Schützende Hülle um Nervenfasern.'],['Schub','Neue oder zunehmende Beschwerden durch Krankheitsaktivität.']],
'https://www.gesundheitsinformation.de/glossar/multiple-sklerose.html'),
amnesie:knowledge(
['Erinnerungslücken oder Schwierigkeiten, neue Informationen zu behalten.'],
['Befragung, Gedächtnistests und je nach Ursache weitere Untersuchungen.'],
['Behandlung der zugrunde liegenden Ursache; passende Orientierungshilfen.'],
'Dauer und Erholung hängen von der Ursache ab. Amnesie und Demenz sind unterschiedliche Begriffe.',
['Verlässliche Tagesstruktur und schriftliche Erinnerungen besprechen.'],
'Ruhig unterstützen, ohne Erinnerungslücken vorwurfsvoll abzufragen.',
'Plötzlichen Gedächtnisverlust dringend abklären lassen; bei zusätzlichen neurologischen Ausfällen sofort Notfallhilfe.',
[['Retrograd','Erinnerungen vor einem Ereignis fehlen.'],['Anterograd','Neue Erinnerungen können nicht ausreichend gebildet werden.']]),
diabetes1:knowledge(
['Starker Durst, häufiges Wasserlassen, Gewichtsverlust und Müdigkeit.','Die Erkrankung kann sich rasch bemerkbar machen.'],
['Blutzuckermessungen und HbA1c prüfen den Zuckerstoffwechsel.','Antikörper und weitere Laborwerte können die Form einordnen.'],
['Insulin wird über Injektionen oder eine Pumpe zugeführt. Sensoren oder Messgeräte helfen bei der Kontrolle.','Schulungen vermitteln den Umgang mit Mahlzeiten, Bewegung und niedrigen oder hohen Werten.'],
'Typ 1 erfordert dauerhaft Insulin. Gute Betreuung und passende Kontrollen senken das Risiko für Folgeerkrankungen an Gefäßen, Augen, Nieren und Nerven.',
['Individuelle Zielwerte und Vorgehen bei Krankheit oder Sport vereinbaren.','Unterzuckerungszeichen und persönlichen Notfallplan kennen.'],
'Unterstützung nach Wunsch anbieten. Angehörige sollten für Notfallsituationen geschult sein und Selbstständigkeit respektieren.',
'Bewusstlosigkeit, schwere Verwirrtheit oder Erbrechen mit tiefer Atmung können Notfälle sein. Dann sofort Notfallhilfe holen.',
[['Insulin','Hormon, das die Aufnahme von Zucker in Zellen ermöglicht.'],['HbA1c','Laborwert für den längerfristigen Blutzuckerverlauf.']],
'https://www.gesundheitsinformation.de/diabetes-typ-1.html'),
diabetes2:knowledge(
['Oft über längere Zeit keine deutlichen Beschwerden.','Möglich sind Müdigkeit, Durst, häufiges Wasserlassen oder schlechter heilende Wunden.'],
['Blutzucker und HbA1c werden beurteilt; oft müssen auffällige Werte bestätigt werden.','Weitere Untersuchungen prüfen Begleiterkrankungen und mögliche Folgeschäden.'],
['Bewegung, passende Ernährung und gegebenenfalls Gewichtsmanagement sind wichtige Bausteine.','Medikamente werden nach Blutzucker, Herz- und Nierengesundheit sowie weiteren Faktoren ausgewählt; manchmal ist Insulin nötig.'],
'Der Verlauf ist beeinflussbar. Entscheidend sind individuelle Ziele und der Schutz vor Folgeerkrankungen, nicht ein für alle identischer Zielwert.',
['Augen, Nieren, Füße und Herz-Kreislauf-Risiken regelmäßig kontrollieren lassen.','Blutzuckermessen und Unterzuckerungsrisiko hängen von der Therapie ab.'],
'Gemeinsame alltagstaugliche Veränderungen unterstützen. Schuldzuweisungen helfen nicht; mehrere Faktoren tragen zur Entstehung bei.',
'Bei Bewusstseinsstörung oder schwerer Verwirrtheit sofort Notfallhilfe. Auffällige Werte nach dem vereinbarten Plan abklären.',
[['Insulinresistenz','Körperzellen sprechen schlechter auf Insulin an.'],['Remission','Werte liegen zeitweise ohne blutzuckersenkende Medikamente unter der Diabetesgrenze; Kontrollen bleiben nötig.']],
'https://www.gesundheitsinformation.de/diabetes-typ-2.html'),
demenz:knowledge(
['Zunehmende Probleme mit neuen Erinnerungen, Sprache oder Orientierung.','Planung und alltägliche Aufgaben werden schwieriger.'],
['Gespräche, Gedächtnistests und Angaben vertrauter Personen helfen bei der Einordnung.','Labor und Bildgebung prüfen andere Ursachen und unterstützen die Diagnose.'],
['Alltagsförderung, Bewegung, soziale Kontakte und Entlastung gehören zur Betreuung.','Medikamente können je nach Situation Symptome oder Verlauf beeinflussen. Bestimmte neuere Therapien eignen sich nur für ausgewählte frühe Stadien.'],
'Alzheimer verläuft fortschreitend. Geschwindigkeit und Unterstützungsbedarf unterscheiden sich; eine frühzeitige Planung kann helfen.',
['Vertraute Abläufe, sichere Umgebung und passende Orientierungshilfen nutzen.','Vorsorge, Vollmachten und Wünsche möglichst früh gemeinsam besprechen.'],
'Gefühle ernst nehmen, nicht ständig korrigieren und Überforderung vermeiden. Eigene Entlastung und Beratung gehören zur Versorgung.',
'Plötzliche starke Verwirrtheit ist nicht einfach normale Demenzentwicklung. Sie kann ein Delir oder eine andere akute Erkrankung sein und muss rasch abgeklärt werden.',
[['Demenz','Oberbegriff für Erkrankungen mit anhaltendem Verlust geistiger Fähigkeiten.'],['Delir','Akut auftretende Störung von Aufmerksamkeit und Bewusstsein.']],
'https://www.gesundheitsinformation.de/alzheimer-demenz.html'),
copd:knowledge(
['Länger anhaltender Husten, Auswurf und Atemnot, zunächst oft bei Belastung.','Beschwerden können sich bei Infekten plötzlich verschlechtern.'],
['Lungenfunktionstest mit Spirometrie und Befragung zu Beschwerden und Belastungen.','Zusätzliche Tests prüfen Schweregrad und andere mögliche Ursachen.'],
['Atemwegserweiternde Inhalationsmedikamente; weitere Mittel je nach Verlauf.','Rauchstopp-Unterstützung, körperliches Training, Atemtechniken und Rehabilitation. Sauerstoff nur bei entsprechender medizinischer Indikation.'],
'COPD ist chronisch. Behandlung kann Beschwerden und Verschlechterungen verringern; bereits entstandene Lungenschäden sind meist nicht rückgängig zu machen.',
['Inhalationstechnik regelmäßig überprüfen lassen.','Aktionsplan bei Verschlechterung und passende Impfungen mit dem Team besprechen.'],
'Aktivität in passendem Tempo unterstützen und Pausen ermöglichen. Gemeinsam lernen, wann ärztliche Hilfe nötig ist.',
'Bei schwerer Atemnot, bläulichen Lippen oder Bewusstseinsstörung sofort Notruf. Bei deutlicher Verschlechterung früh medizinische Hilfe suchen.',
[['Spirometrie','Messung von Luftmenge und Luftfluss beim Atmen.'],['Exazerbation','Deutliche akute Verschlechterung einer chronischen Erkrankung.']],
'https://www.gesundheitsinformation.de/chronisch-obstruktive-lungenerkrankung-copd.html'),
herzschwaeche:knowledge(
['Atemnot, verringerte Belastbarkeit, Müdigkeit oder geschwollene Beine.','Bei fortgeschrittener Erkrankung können Beschwerden auch in Ruhe auftreten.'],
['Herzultraschall prüft Pumpfunktion und Füllung.','EKG und Blutwerte unterstützen die Diagnose und Suche nach Ursachen.'],
['Medikamente und Behandlung der Ursache werden nach Form der Herzschwäche kombiniert.','Bei bestimmten Betroffenen sind implantierte Geräte oder weitere Eingriffe sinnvoll; angepasstes Training kann unterstützen.'],
'Der Verlauf hängt von Ursache und Form ab. Mit Behandlung sind lange stabile Phasen möglich; akute Verschlechterungen können auftreten.',
['Gewicht, Schwellungen und Beschwerden nach dem vereinbarten Plan beobachten.','Trinkmenge und Belastung individuell abstimmen; keine pauschale Flüssigkeitsbeschränkung auf eigene Faust.'],
'Bei Medikamentenplan und Terminen nach Wunsch helfen. Veränderungen aufmerksam wahrnehmen, ohne jede Aktivität einzuschränken.',
'Schwere neue Atemnot, Brustschmerz oder Bewusstlosigkeit sind Notfälle. Rasche Gewichtszunahme oder zunehmende Schwellungen zeitnah melden.',
[['Ödem','Flüssigkeitsansammlung im Gewebe.'],['Ejektionsfraktion','Anteil des Blutes, den eine Herzkammer pro Schlag auswirft.']],
'https://www.gesundheitsinformation.de/herzschwaeche.html'),
depression:knowledge(
['Anhaltend gedrückte Stimmung, Interessenverlust oder deutlich verminderter Antrieb.','Auch Schlaf, Konzentration, Appetit und körperliches Befinden können sich verändern.'],
['Ein ausführliches Gespräch prüft Beschwerden, Dauer und Auswirkungen.','Körperliche Ursachen und andere psychische Erkrankungen werden mitbedacht; ein Fragebogen allein ersetzt keine Diagnose.'],
['Psychotherapie und gegebenenfalls Antidepressiva werden nach Schweregrad und Situation eingesetzt.','Regelmäßige Verlaufskontrollen helfen, Wirkung und Nebenwirkungen einzuschätzen.'],
'Depressionen sind behandelbar. Episoden können unterschiedlich lange dauern und wiederkehren. Rückfallvorbeugung und Unterstützung sind wichtig.',
['Kleine realistische Schritte, regelmäßige Termine und entlastende Strukturen können helfen.','Medikamente nicht eigenständig abrupt absetzen.'],
'Zuhören und konkrete Hilfe anbieten. Aufforderungen wie „Reiß dich zusammen“ vermeiden; die Erkrankung ist keine Willensschwäche.',
'Bei akuter Selbstgefährdung oder unmittelbarer Gefahr sofort Notfallhilfe holen und die Person möglichst nicht allein lassen.',
[['Antidepressiva','Medikamente zur Behandlung unter anderem von Depressionen.'],['Rezidiv','Erneutes Auftreten einer Erkrankung nach Besserung.']],
'https://www.gesundheitsinformation.de/depression.html'),
arthrose:knowledge(
['Schmerzen bei Belastung oder nach Ruhephasen, Steifigkeit und eingeschränkte Beweglichkeit.','Zeitweise kann das Gelenk entzündet und geschwollen sein.'],
['Beschwerden und körperliche Untersuchung sind entscheidend.','Röntgen kann Veränderungen zeigen; Bildbefund und Schmerzstärke stimmen nicht immer überein.'],
['Gezieltes Training und Bewegung helfen, Funktion und Belastbarkeit zu erhalten.','Schmerzmittel werden unter Berücksichtigung ihrer Risiken gewählt. Ein Gelenkersatz kommt bei ausgeprägten Beschwerden nach individueller Abwägung infrage.'],
'Beschwerden können schwanken. Arthrose führt nicht zwangsläufig zu ständig zunehmenden Schmerzen oder einer Operation.',
['Gelenkverträgliche Aktivität und Erholung abwechseln.','Physiotherapie und geeignete Hilfsmittel bei Bedarf besprechen.'],
'Bewegung und Selbstständigkeit unterstützen. Tätigkeiten bei Bedarf anpassen, statt vorschnell alles abzunehmen.',
'Ein plötzlich stark schmerzendes, heißes oder deutlich geschwollenes Gelenk, besonders mit Fieber, muss rasch ärztlich abgeklärt werden.',
[['Knorpel','Gleitfähiges Gewebe an den Gelenkflächen.'],['Endoprothese','Künstlicher Gelenkersatz.']],
'https://www.gesundheitsinformation.de/arthrose.html'),
rheuma:knowledge(
['Schmerzhafte, geschwollene Gelenke, häufig an Händen und Füßen.','Längere Morgensteifigkeit und Erschöpfung sind typisch.'],
['Untersuchung der Gelenke, Entzündungswerte und bestimmte Antikörper.','Ultraschall oder weitere Bildgebung können Entzündung und Schäden beurteilen.'],
['Krankheitsmodifizierende Medikamente sollen Entzündung bremsen und Schäden verhindern.','Weitere Medikamente lindern Beschwerden; Physio- und Ergotherapie fördern Funktion und Alltag.'],
'Frühe Behandlung verbessert die Chancen auf geringe Krankheitsaktivität oder Remission. Schübe sind trotzdem möglich; regelmäßige Kontrollen bleiben wichtig.',
['Medikamentenkontrollen, Impfungen und Infektionsrisiken besprechen.','Aktivität, Gelenkschutz und Pausen an Beschwerden anpassen.'],
'Schmerzen und Fatigue ernst nehmen. Gemeinsam überlegen, welche Handgriffe oder Hilfsmittel den Alltag erleichtern.',
'Fieber oder Infektionszeichen unter immundämpfender Therapie zeitnah melden. Ein plötzlich stark gerötetes, heißes Gelenk muss abgeklärt werden.',
[['DMARD','Medikament, das den Krankheitsverlauf beeinflussen soll.'],['Remission','Sehr geringe oder nicht nachweisbare Krankheitsaktivität.']],
'https://www.gesundheitsinformation.de/rheumatoide-arthritis.html')
};
const cancerDetails={
brustkrebs:[['Tastbarer Knoten, Einziehung der Haut oder neue Veränderung der Brustwarze.','Frühe Tumoren verursachen oft keine Beschwerden.'],['Bildgebung wie Mammografie oder Ultraschall und Untersuchung einer Gewebeprobe.','Hormonrezeptoren und HER2-Status helfen bei der Therapieauswahl.'],['Operation und häufig Bestrahlung; je nach Eigenschaften Antihormon-, Chemo-, zielgerichtete oder Immuntherapie.'],'Stadium und Tumoreigenschaften beeinflussen den Verlauf. Die Nachsorge berücksichtigt auch Therapiefolgen.','Beweglichkeit von Arm und Schulter, Lymphödeme, Körperbild und Sexualität können nach der Behandlung wichtig sein.','Mit Entscheidungen zu Operation oder Brustaufbau respektvoll umgehen. Wünsche der betroffenen Person stehen im Mittelpunkt.','Hormonrezeptoren','Merkmale, die zeigen, ob Hormone das Tumorwachstum beeinflussen können.','https://gesund.bund.de/brustkrebs'],
darmkrebs:[['Blut im Stuhl, veränderte Stuhlgewohnheiten oder unerklärlicher Gewichtsverlust.','Frühe Stadien können unbemerkt bleiben.'],['Darmspiegelung mit Gewebeprobe.','Bildgebung klärt Ausbreitung; die genaue Lage in Dick- oder Enddarm ist wichtig.'],['Häufig Operation; je nach Stadium zusätzliche Medikamente. Bei Enddarmkrebs kann Bestrahlung hinzukommen.'],'Heilungschancen und Therapie hängen von Ausbreitung und weiteren Befunden ab. Ein Stoma kann vorübergehend oder dauerhaft nötig sein.','Ernährung, Verdauung und gegebenenfalls Stomaversorgung mit Fachpersonen besprechen.','Bei Bedarf Termine und Alltagsversorgung unterstützen; Scham rund um Verdauungsprobleme respektieren.','Stoma','Operativ angelegter künstlicher Darmausgang.','https://gesund.bund.de/darmkrebs'],
lungenkrebs:[['Anhaltender oder veränderter Husten, Bluthusten, Atemnot oder Gewichtsverlust.'],['CT und Gewebeuntersuchung sichern und klassifizieren den Befund.','Weitere Untersuchungen prüfen Ausbreitung und molekulare Tumoreigenschaften.'],['Je nach Form und Stadium Operation, Bestrahlung, Chemotherapie, Immuntherapie oder zielgerichtete Medikamente.'],'Kleinzellige und nicht-kleinzellige Tumoren unterscheiden sich. Persönliche Prognosen brauchen die vollständigen Befunde.','Atemnot, Schmerzen und Erschöpfung gezielt behandeln lassen; unterstützende Versorgung kann parallel zur Tumortherapie erfolgen.','Beschwerden ernst nehmen und Schuldzuweisungen vermeiden. Hilfe an den tatsächlichen Bedarf anpassen.','Molekulare Diagnostik','Untersuchung von Tumoreigenschaften, die für Medikamente relevant sein können.','https://gesund.bund.de/lungenkrebs'],
prostatakrebs:[['Anfangs häufig keine Beschwerden. Probleme beim Wasserlassen können auch andere Ursachen haben.'],['PSA-Wert, Untersuchung und gegebenenfalls MRT helfen bei der Abklärung.','Eine Gewebeprobe bestätigt die Diagnose und erlaubt die Risikoeinstufung.'],['Je nach Risiko aktive Überwachung, Operation, Bestrahlung oder Medikamente, etwa gegen die Wirkung männlicher Hormone.'],'Nicht jeder Tumor muss sofort behandelt werden. Nutzen und mögliche Folgen werden anhand des Risikos abgewogen.','Harnkontinenz, Sexualfunktion und Auswirkungen hormoneller Behandlung offen ansprechen.','Privatsphäre respektieren und bei Behandlungsentscheidungen zuhören, ohne zu drängen.','Aktive Überwachung','Engmaschige Kontrolle mit geplanter Behandlung bei bestimmten Veränderungen.','https://gesund.bund.de/prostatakrebs'],
hautkrebs:[['Neue, veränderte oder nicht heilende Hautstellen. Auffällige Pigmentmale sollen untersucht werden.'],['Hautärztliche Untersuchung und gegebenenfalls Dermatoskopie.','Entnommenes Gewebe zeigt die genaue Krebsart; weitere Diagnostik richtet sich danach.'],['Häufig operative Entfernung. Bei bestimmten fortgeschrittenen Formen kommen weitere lokale oder systemische Behandlungen infrage.'],'Melanom, Basalzell- und Plattenepithelkarzinom haben unterschiedliche Risiken und Nachsorgepläne.','Sonnenschutz und vereinbarte Hautkontrollen beachten; eine Checkliste ersetzt keine ärztliche Beurteilung.','Bei schwer einsehbaren Hautstellen nach Wunsch unterstützen. Veränderungen dokumentieren, aber nicht selbst diagnostizieren.','Dermatoskopie','Untersuchung der Haut mit einem speziellen Vergrößerungsinstrument.','https://gesund.bund.de/schwarzer-hautkrebs'],
leukaemie:[['Müdigkeit, Infektanfälligkeit oder Blutungsneigung sind möglich.'],['Blutbild; je nach Form weitere Blut- und Knochenmarkuntersuchungen.'],['Formabhängige Medikamente, Chemotherapie oder Stammzelltransplantation; nicht jede chronische Form wird sofort behandelt.'],'Akute und chronische Leukämien verlaufen verschieden.','Infektions- und Blutungszeichen nach dem individuellen Plan melden.','Hygienehinweise und gewünschte Unterstützung gemeinsam klären.','Knochenmark','Gewebe, in dem Blutzellen gebildet werden.',null],
lymphome:[['Vergrößerte Lymphknoten, Nachtschweiß, Fieber oder Gewichtsverlust sind möglich.'],['Gewebeuntersuchung bestimmt die Unterform; weitere Tests klären Ausbreitung.'],['Je nach Unterform Beobachtung, Medikamente, Chemo-, Immun- oder Strahlentherapie.'],'Aggressive und langsam wachsende Formen benötigen unterschiedliche Behandlung.','Infektionsrisiken und Belastbarkeit passend zur Therapie besprechen.','Erschöpfung respektieren und Kontakte nach Wunsch gestalten.','Lymphsystem','Teil des Abwehrsystems mit Lymphgefäßen und lymphatischen Organen.',null],
pankreas:[['Oberbauch- oder Rückenschmerzen, Gewichtsverlust oder Gelbsucht; anfangs oft keine eindeutigen Zeichen.'],['Bildgebung wie CT oder MRT und gegebenenfalls Endosonografie.','Je nach Behandlungssituation ist eine Gewebeprobe erforderlich.'],['Operation, wenn möglich; häufig medikamentöse Therapie. Beschwerden und Ernährungsprobleme werden begleitend behandelt.'],'Ausbreitung und Operabilität prägen die Planung. Auch eine frühzeitige palliative Mitbetreuung kann die Lebensqualität unterstützen.','Verdauungsenzyme, Ernährung, Schmerzen und gegebenenfalls Diabetes mit dem Team besprechen.','Beim Essen ohne Druck unterstützen und körperliche oder seelische Belastungen ernst nehmen.','Endosonografie','Ultraschalluntersuchung aus dem Inneren des Verdauungstrakts.','https://gesund.bund.de/bauchspeicheldruesenkrebs']
};
for(const [id,d] of Object.entries(cancerDetails)){knowledgeDetails[id]=knowledge(d[0],d[1],d[2],d[3],[d[4]],d[5],'Bei Fieber unter Krebstherapie oder neuen starken Beschwerden rasch das Behandlungsteam kontaktieren; schwere Atemnot oder Bewusstseinsstörung sind Notfälle.',[[d[6],d[7]]],d[8])}
knowledgeDetails.herzinfarkt.extraSource='https://www.gesundheit.gv.at/krankheiten/herz-kreislauf/herzinfarkt/diagnose.html';
knowledgeDetails.lymphome.extraSource='https://gesund.bund.de/non-hodgkin-lymphome';
function knowledgeSources(c,k){return [{title:c.publisher,url:c.source},...(k.extraSource?[{title:k.extraSource.includes('gesundheitsinformation.de')?'IQWiG · Gesundheitsinformation.de':k.extraSource.includes('gesundheit.gv.at')?'Gesundheitsportal Österreich':k.extraSource.includes('nhs.uk')?'NHS · Patienteninformation (Englisch)':'gesund.bund.de',url:k.extraSource}]:[])]}

knowledgeDetails["als"]={"symptoms":["Muskelschwäche, Muskelzuckungen und Steifigkeit.","Sprech-, Schluck- oder Atemprobleme sind möglich."],"diagnosis":["Neurologische Untersuchung und Messungen von Nerven- und Muskelfunktion; ähnliche Erkrankungen werden ausgeschlossen."],"treatment":["Ein spezialisiertes Team stimmt Medikamente, Hilfsmittel sowie Atem-, Ernährungs- und Kommunikationsunterstützung ab."],"course":"ALS schreitet fort; Tempo und Unterstützungsbedarf unterscheiden sich. Eine Heilung ist bisher nicht möglich.","life":["Hilfsmittel und erreichbare Versorgung früh besprechen.","Wünsche zu Ernährung, Beatmung und Begleitung ohne Zeitdruck klären."],"relatives":"Kommunikation ermöglichen, Entscheidungen respektieren und Pflege auf mehrere Schultern verteilen. Entlastung früh organisieren.","warning":"Neue Atemnot oder schwere Schluckprobleme dringend medizinisch abklären; schwere Atemnot ist ein Notfall.","terms":[["Motoneuronen","Nervenzellen, die Bewegungen steuern."]]};

knowledgeDetails["huntington"]={"symptoms":["Unwillkürliche Bewegungen und Probleme mit Koordination.","Veränderungen von Stimmung, Verhalten oder geistigen Fähigkeiten."],"diagnosis":["Neurologische Untersuchung und genetische Diagnostik mit Beratung. Eine vorsorgliche Testung gesunder Angehöriger braucht eine eigene, freiwillige Entscheidung."],"treatment":["Medikamente können Beschwerden lindern; Physio-, Ergo- und Sprachtherapie unterstützen Fähigkeiten."],"course":"Die Krankheit schreitet fort. Eine heilende Behandlung steht bisher nicht zur Verfügung.","life":["Kommunikation und Unterstützung an aktuelle Fähigkeiten anpassen.","Entscheidungen und persönliche Wünsche früh besprechen."],"relatives":"Genetische Fragen können die ganze Familie beschäftigen. Beratung und eigene Entlastung nutzen; niemanden zu einem Test drängen.","warning":"Bei deutlicher Verschlechterung von Schlucken, Verhalten oder Versorgung das Team kontaktieren. Bei unmittelbarer Gefahr Notruf wählen.","terms":[["Genetische Beratung","Beratung zu erblichen Erkrankungen und den Folgen einer Untersuchung."]]};

knowledgeDetails["niere"]={"symptoms":["Früh oft keine Beschwerden; später etwa Müdigkeit, Juckreiz oder Wassereinlagerungen."],"diagnosis":["Blut- und Urinwerte sowie gegebenenfalls Ultraschall klären Funktion, Ursache und Stadium."],"treatment":["Ursachen und Folgen behandeln, Medikamente und Ernährung anpassen. Bei schwerem Versagen kommen Dialyse oder Transplantation infrage."],"course":"Der Verlauf hängt von Ursache und Stadium ab. Nicht jede Nierenkrankheit führt zur Dialyse.","life":["Trinkmenge und Ernährung individuell abstimmen.","Auch frei verkäufliche Medikamente vor Einnahme auf Nierenverträglichkeit prüfen lassen."],"relatives":"Bei Terminen und Organisation nach Wunsch helfen. Dialyse kann den Familienalltag stark verändern; Aufgaben und Pausen gemeinsam planen.","warning":"Starke Atemnot oder Bewusstseinsstörungen sind Notfälle. Neue deutliche Schwellungen oder stark verminderte Urinmenge zeitnah abklären.","terms":[["Dialyse","Behandlung, die einen Teil der Reinigungsfunktion der Nieren übernimmt."]]};

knowledgeDetails["mecfs"]={"symptoms":["Schwere Erschöpfung, nicht erholsamer Schlaf und Konzentrationsprobleme.","Kreislaufbeschwerden, Schmerzen und Reizempfindlichkeit sind möglich."],"diagnosis":["Beschwerdebild einschließlich PEM sorgfältig beurteilen und andere Ursachen abklären."],"treatment":["Beschwerden gezielt behandeln und Belastungen individuell begrenzen. Pacing soll Überlastung vermeiden; keine feste Aktivitätssteigerung gegen die Beschwerden."],"course":"Schweregrad und Verlauf variieren. Einige Menschen benötigen umfassende Hilfe im Alltag.","life":["Auch Gespräche und Termine können belasten.","Ruhe, Reizreduktion und flexible Absprachen nach Bedarf ermöglichen."],"relatives":"Grenzen respektieren, Tätigkeiten übernehmen und Kontakte dosieren. Eigene Entlastung organisieren, ohne Aktivitätsdruck aufzubauen.","warning":"Neue oder ungewohnte Beschwerden nicht automatisch ME/CFS zuordnen. Bei akuter schwerer Verschlechterung medizinische Hilfe holen.","terms":[["PEM","Verstärkung der Beschwerden nach Belastung, teilweise zeitverzögert."],["Pacing","Belastung an die persönlichen Grenzen anpassen."]]};

knowledgeDetails["schizophrenie"]={"symptoms":["Stimmenhören, ungewöhnliche Überzeugungen oder ungeordnetes Denken.","Rückzug, Antriebsmangel und Konzentrationsprobleme können hinzukommen."],"diagnosis":["Psychiatrische Gespräche und Untersuchungen; körperliche Erkrankungen und Substanzeinflüsse werden mitbedacht."],"treatment":["Medikamente, Psychotherapie und psychosoziale Unterstützung werden gemeinsam abgestimmt. Aufklärung kann auch Angehörige einbeziehen."],"course":"Einige Menschen erleben wenige Episoden, andere brauchen längerfristige Unterstützung. Erholung und Teilhabe sind individuelle Ziele.","life":["Frühwarnzeichen und einen persönlichen Krisenplan besprechen.","Gewünschte Unterstützung und Privatsphäre respektieren."],"relatives":"Ruhig zuhören, Gefühle ernst nehmen und klare Grenzen vereinbaren. Angehörige dürfen selbst Beratung nutzen und müssen Krisen nicht allein auffangen.","warning":"Bei akuter Krise professionelle Hilfe suchen; bei unmittelbarer Gefahr für die Person oder andere sofort Notruf wählen.","terms":[["Psychose","Phase mit stark veränderter Wahrnehmung oder Einordnung der Wirklichkeit."]]};

knowledgeDetails["bipolar"]={"symptoms":["Depressiver Antriebsmangel oder ausgeprägter Tatendrang mit wenig Schlaf.","Gereiztheit, Selbstüberschätzung und riskante Entscheidungen sind möglich."],"diagnosis":["Psychiatrische Abklärung berücksichtigt frühere Episoden, körperliche Ursachen und Medikamente."],"treatment":["Medikamentöse Behandlung und Psychotherapie sollen akute Beschwerden lindern und neuen Episoden vorbeugen."],"course":"Der Verlauf ist unterschiedlich. Langfristige Begleitung kann Stabilität und Lebensqualität verbessern.","life":["Schlaf und Tagesrhythmus sowie persönliche Frühwarnzeichen besprechen.","Medikamente nicht eigenständig ändern."],"relatives":"In stabilen Phasen Absprachen zu Krisen, Finanzen und Unterstützung treffen. Eigene Grenzen und Beratungsbedarf ernst nehmen.","warning":"Bei deutlich verändertem Schlaf, starkem Antrieb oder schwerer Depression früh das Team kontaktieren. Bei unmittelbarer Gefahr sofort Notruf wählen.","terms":[["Hypomanie","Weniger stark ausgeprägte Phase mit gesteigertem Antrieb und veränderter Stimmung."]]};

knowledgeDetails.tourette={"symptoms":["Bewegungstics wie Blinzeln oder Schulterzucken und Lauttics wie Räuspern; sie müssen nicht gleichzeitig auftreten.","Unwillkürliches Aussprechen von Schimpfwörtern betrifft nur einen kleinen Teil der Betroffenen."],"diagnosis":["Fachpersonen beurteilen Beginn, Dauer und Art der Tics und schließen andere Ursachen aus. Begleitbeschwerden wie ADHS oder Zwänge werden berücksichtigt."],"treatment":["Bei Behandlungsbedarf helfen spezialisierte verhaltenstherapeutische Verfahren; bei stärkerer Belastung können Medikamente erwogen werden."],"course":"Tics schwanken. Bei vielen lassen sie mit zunehmendem Alter nach; bei manchen bleiben sie bestehen.","life":["Nicht zum dauernden Unterdrücken der Tics drängen.","Mit Zustimmung der betroffenen Person Pausen, Rückzugsmöglichkeiten und Unterstützung im Umfeld abstimmen."],"relatives":"Tics sind keine Provokation. Vorwürfe vermeiden, Wünsche respektieren und bei Überforderung eigene Beratung nutzen.","warning":"Schmerzhafte oder verletzende Tics und neue Beschwerden ärztlich abklären. Bei schwerer Verletzung oder unmittelbarer Gefahr Notruf wählen.","terms":[["Tic","Wiederkehrende, weitgehend unwillkürliche Bewegung oder Lautäußerung."]],"extraSource":"https://www.nhs.uk/conditions/tourette-syndrome/"};
