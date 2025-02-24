# Webhooki Przygody Reksia Discord

:warning: **UWAGA!** Nie wolno umieszczać skopiowanych z Discorda webhooków bezpośrednio w żadnym pliku. Są to prywatne linki i należy przechowywać je w bezpieczny sposób. Takim sposobem jest wklejenie ich na listę ["Secrets"](https://github.com/Dove6/przygody-reksia-discord-webhooks/settings/secrets/actions) tego repozytorium. Można się do nich potem odwołać w plikach `targets.txt` po krótszej nazwie, np. `$RULES_WEBHOOK_URL` (uwaga na symbol dolara na początku).

## Jak edytować wiadomości?

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

[^1]: Co nie jest do końca prawdą. Regulamin na przykład jest wrzucany równolegle na dwa kanały (jeden oryginalny i jedna kopia dla niezweryfikowanych).
[^2]: Nie ma znaczenia tak naprawdę, czy wszystkie numerki są zajęte i następują bezpośrednio po sobie. Wszystkie nazwy folderów są zbierane i sortowane alfabetycznie, więc to jest tylko takie uproszczenie dla edytującego.
[^3]: Pozwala to podejrzeć bezpośrednio na GitHubie, jak treść będzie *mniej więcej* (no nie w pełni, niestety) wyglądać na Discordzie. Chodzi o formatowanie (wytłuszczenie, kursywę, podkreślenie, przekreślenie), listy, nagłówki, niektóre emotki.
