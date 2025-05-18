**1. Gry zacinają mi się i lagują. Czasem obrazki rozjeżdżają się po ekranie (“smarowanie”). Jak temu zaradzić?** Skorzystaj z “wrappera” - pliku lub programu, który naprawi sposób, w jaki gra wyświetla grafikę. Obecnie polecane wrappery to [cnc-ddraw](https://discord.com/channels/822931925618524240/909046389227536426/1155563864147120308) oraz [DxWnd](https://www.przygodyreksia.aidemmedia.pl/pliki/kretes/forum/reksioforum/viewtopic.php?p=261312#p261312). Uwaga: należy stosować tylko jeden wrapper na raz.
**2. Gry nie uruchamiają mi się wcale lub uruchamiają się, ale wyłączają po pewnym czasie.** Przede wszystkim wypróbuj wbudowane w Windows [tryby zgodności](https://support.microsoft.com/pl-pl/windows/ustawianie-zgodno%C5%9Bci-starszych-aplikacji-lub-program%C3%B3w-z-systemem-windows-783d6dd7-b439-bdb0-0490-54eea0f45938), np. z systemem Windows XP (Service Pack 3). Uwaga: niektóre ustawienia zgodności mogą spowodować utratę zapisów - warto je zabezpieczyć.
Czasem pomaga reinstalacja gry, w szczególności z zaufanego obrazu płyty (patrz punkt 1 sekcji Przygody Reksia tego FAQ).
Jeśli gra wyłącza się po wyświetleniu komunikatu o brakującej płycie CD, należy zamontować pobrany plik ISO (w systemie Windows 10/11 za pomocą podwójnego kliknięcia) lub włożyć fizyczną płytę do napędu.
Niektóre crashe są spowodowane przez błędy w kodzie gry, na co można zaradzić łatkami (patrz, punkt 8 niżej).
**3. Podobno da się uruchomić grę w trybie okienkowym. Jak to zrobić?** Jeśli używasz wrapperów z punktu 1, możesz przełączyć się do trybu okienkowego poprzez:
- (cnc-ddraw) naciśnięcie klawiszy Alt-Enter, gdy gra jest uruchomiona,
- (DxWnd) zmianę opcji w DxWnd przed uruchomieniem gry.
Jeśli nie używasz wrapperów, dopisz do skrótu opcję -window zgodnie z instrukcją: https://discord.com/channels/822931925618524240/909046389227536426/931969299407577138.
**4. Chcę pokazać grę znajomym, ale Discord ma problem ze streamowaniem.** Powinno pomóc uruchomienie gry w trybie okienkowym (patrz punkt 3 wyżej).
**5. Przy instalacji gry pojawia się błąd sumy kontrolnej.** Oznacza to, że płyta lub obraz dysku, z którego instalujesz grę, są uszkodzone. Pobierz nowy obraz dysku z zaufanego źródła (patrz punkt 1 sekcji Przygody Reksia tego FAQ).
**6. Potrzebuję grafik/dźwięków z serii. W jaki sposób mogę je pozyskać?** Dźwięki (dialogi oraz SFX-y) dostępne są w katalogu instalacyjnym gry, w folderze wavs.
Grafiki oraz animacje należy wyciągnąć z plików gry za pomocą narzędzia [Anndrzem](https://github.com/mysliwy112/AM-transcoder). Dla wygody użytkowników gotowe wypakowane grafiki zostały umieszczone na [dysku Google](https://drive.google.com/drive/u/0/folders/1z0M8z1urpdIzxrJz_9HS-bBTSaxNMXXR), a animacje na stronie https://mysliwy112.github.io/.
Pamiętaj, by zawrzeć informacje o pochodzeniu grafik i dźwięków w swoich projektach. Najlepiej wspomnieć tytuł gry źródłowej, rok jej wydania oraz nazwę firmy AidemMedia.
**7. Gdzie znajdę zapisy?** Zapisy gier 2D znajdują się w katalogu instalacyjnym danej gry (lub w jego kopii w `VirtualStore`).
- Reksio i Skarb Piratów - plik `Piraci.ini` (lub `Template.ini`)
- Reksio i UFO - plik `Ufo.ini`
- Reksio i Czarodzieje - cały folder `common`
- Reksio i Wehikuł Czasu - cały folder `common`
- Reksio i Kapitan Nemo - cały folder `common\save`
- Reksio i Kretes w Akcji! - dwa całe foldery: `common\save` oraz `common\save_bd`
Zapis gry Reksio i Kretes: Tajemnica Trzeciego Wymiaru to plik `Default.prf` w folderze `%AppData%\AidemMedia\Rex3D`.
Zapisy z Miasta Sekretów/ City of Secrets można znaleźć w nazwanych zgodnie z nazwą gry folderach wewnątrz `%AppData%\Aidem Media`.
Zapisy z City of Secrets 2 można znaleźć w folderze `%LocalAppData%Low\Aidem Media Sp_ z o_ o_\City Of Secrets 2 Episode 1`.
