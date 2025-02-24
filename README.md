# Webhooki Przygody Reksia Discord

:warning: **UWAGA!** Nie wolno umieszczać skopiowanych z Discorda webhooków bezpośrednio w żadnym pliku. Są to prywatne linki i należy przechowywać je w bezpieczny sposób. Takim sposobem jest wklejenie ich na listę ["Secrets"](https://github.com/Dove6/przygody-reksia-discord-webhooks/settings/secrets/actions) tego repozytorium. Można się do nich potem odwołać w plikach `targets.txt` po krótszej nazwie, np. `$RULES_WEBHOOK_URL` (uwaga na symbol dolara na początku).

## W jaki sposób są tu zapisane wiadomości?

Dane wiadomości przechowywane są w folderze [`data`](./data/). Każdy jego podfolder (np. [`info`](./data/info/)) przechowuje powiązany tematycznie zestaw wiadomości. Przyjmijmy, że są to foldery odpowiadające kanałom[^1].

W każdym folderze kanału poszczególne wiadomości zawarte są wewnątrz folderów ponumerowanych po kolei. Dla [`info`](./data/info/) np. [`001`](./data/info/001/), [`002`](./data/info/002/), [`003`](./data/info/003/) itd.[^2] Folder kanału zawiera też plik `targets.txt`, gdzie w kolejnych liniach wypisane są nazwy webhooków powiązanych z tym kanałem.

Teraz struktura folderu pojedynczej wiadomości:

- `content.md` - zawartość wiadomości; jest w formacie Markdown[^3]
- `references.txt` - linki do powiązanych wiadomości na Discordzie, na których ma być wykonana edycja; jeśli chcemy stworzyć nową wiadomość, to ten plik pomijamy (tylko :warning: **UWAGA**, bo trzeba pamiętać, żeby go stworzyć przy następnej okazji)
- `embeds` - podfolder opisujący kolejne embedy (struktura opisana niżej); znowu numerowane: `01`, `02`, `03` itd.[^2]
- `attachments` - podfolder na załączniki; tutaj po prostu wrzucamy pliki i numerki umieszczamy na początku ich nazwy, np. [`01_DoubleCounter_verify.png`](./data/verification/003/attachments/01_DoubleCounter_verify.png)

No i struktura embeda:

- `title.txt` - tytuł; jest w formacie Markdown[^3]
- `description.md` - treść embeda; jest w formacie Markdown[^3]
- `color.txt` - kolor ramki embeda; wartość w formacie hex, czyli np. `#FF0000` to czerwony - można sobie podejrzeć np. na [tej stronie](https://htmlcolorcodes.com/color-picker/)
- `url.txt` - link skojarzony z embedem
- `thumbnail.txt` - link do obrazka wyświetlanego z boku embeda w roli ikony

Większość z powyższych plików jest opcjonalna. Jeśli któryś okaże się niezbyt opcjonalny, to pipeline zacznie krzyczeć, ale tym już się będzie martwił autor niniejszego repozytorium.

## Skąd brać identyfikatory użytkowników, grup, kanałów, emotek...?

Wystarczy wpisać w wiadomości na Discordzie np. oznaczenie użytkownika, a następnie poprzedzić je znakiem ucieczki: `\`. Mamy do tego kanał [#testy-i-weryfikacje](https://discord.com/channels/822931925618524240/909039526599622696).

Przykłady:  
`\@dove6` -> `<@450069032968650762>`  
`\@Pani Administrator` -> `<@&1224305247695147079>`  
`\#testy-i-weryfikacje` -> `<#909039526599622696>`  
`\:szloch:` -> `<:szloch:909063765520171109>`

## No dobra, ale jak w ogóle edytować wiadomości?

Najprościej bezpośrednio przez GitHuba. W szczególności dla drobnych zmian. Powiedzmy na przykład, że chcemy usunąć jeden z aktywnych wątków.

1. Nawigujemy do odpowiedniego pliku. Tutaj: [`data/info/003/embeds/01/description.md`](./data/info/003/embeds/01/description.md)
2. Klikamy przycisk z ołówkiem ("Edit this file").
3. Modyfikujemy plik. Tutaj: usuwamy wybraną linię.
4. Zatwierdzamy, klikając zielony przycisk "Commit changes..." w prawym górnym rogu edytora.
5. W pole "Commit message" wpisujemy krótkie podsumowanie czytelne dla człowieka.
6. Zaznaczamy niżej "Create a new branch for this commit and start a pull request", a w pole tekstowe wpisujemy nazwę gałęzi. Krótką, unikalną i-najlepiej-bez-spacji-czy-polskich-znakow.
7. Kliamy zielony przycisk "Propose changes".
8. Na nowej stronie klikamy jeszcze zielony przycisk "Create pull request".

Jak się już stworzy pull request, to w zakładce "Files changed" można sobie podejrzeć zmiany w plikach, a zielonym przyciskiem "Merge pull request" się zatwierdza całość (to najlepiej niech zrobi inna osoba sprawdzająca).

Jeśli zmiana jest bardziej zaawansowana, to można sobie otworzyć edytor online:

1. Zamiast ikony ołówka klikamy ikonę strzałki w dół tuż przy niej. Wybieramy z listy "Open with..." pozycję "github.dev". Otwiera się edytor Visual Studio Code w wersji online. Po lewej jest eksplorator pliku, można dowolnie sobie nawigować, jak i dodawać/usuwać pliki/fodlery.
2. Po wykonanych edycjach wybieramy z lewej strony ikona gałęzi ("Kontrola źródła"). Trzeci pozycja, tuż pod lupą.
3. Nad polem "Komunikat" z prawej strony klikamy trzy kropki. Wybieramy "Gałąź" -> "Utwórz gałąź...".
4. Wpisujemy krotka-unikalna-nazwa-bez-polskich-znakow-i-spacji, po czym dajemy Enter.
5. Klikamy niebieski przycisk "Przełącz do gałęzi".
6. Teraz znowy wchodzimy w ikonę gałęzi, wpisujemy wiadomość podsumowującą zmiany w pole "Komunikat" i zatwierdzamy przez Ctrl-Enter.

No i można już zamknąć edytor. A pull request stworzyć ręcznie z poziomu GitHuba. Albo ewentualnie można nie zamykać edytora, tylko pull request stworzyć przez ikonę gałęzi. Nad komunikatem należy kliknąć w symbol gałęzi z plusem ("Utwórz żądanie ściągnięcia"). No i tam sie wypełnia jakiś opis, a potem klika niebieski przycisk "Create".

[^1]: Co nie jest do końca prawdą. Regulamin na przykład jest wrzucany równolegle na dwa kanały (jeden oryginalny i jedna kopia dla niezweryfikowanych).
[^2]: Nie ma znaczenia tak naprawdę, czy wszystkie numerki są zajęte i następują bezpośrednio po sobie. Wszystkie nazwy folderów są zbierane i sortowane alfabetycznie, więc to jest tylko takie uproszczenie dla edytującego.
[^3]: Pozwala to podejrzeć bezpośrednio na GitHubie, jak treść będzie *mniej więcej* (no nie w pełni, niestety) wyglądać na Discordzie. Chodzi o formatowanie (wytłuszczenie, kursywę, podkreślenie, przekreślenie), listy, nagłówki, niektóre emotki.
