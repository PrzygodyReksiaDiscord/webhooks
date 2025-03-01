# Webhooki Przygody Reksia Discord

:warning: **UWAGA!** Nie wolno umieszczać skopiowanych z Discorda webhooków bezpośrednio w żadnym pliku. Są to prywatne linki i należy przechowywać je w bezpieczny sposób. Takim sposobem jest wklejenie ich na listę ["Secrets"](https://github.com/Dove6/przygody-reksia-discord-webhooks/settings/secrets/actions) tego repozytorium. Można się do nich potem odwołać w plikach `targets.txt` po krótszej nazwie, np. `$RULES_WEBHOOK_URL` (uwaga na symbol dolara na początku).

## 1. W jaki sposób są tu zapisane wiadomości?

Dane wiadomości przechowywane są w folderze [`data`](./data/). Mają strukturę hierarchiczną, co (mam nadzieję) ułatwia nawigację.

### 1.1. Kanały

Każdy podfolder folderu [`data`](./data/) (np. [`info`](./data/info/)) przechowuje powiązany tematycznie zestaw wiadomości. Przyjmijmy, że odpowiada to definicji kanału[^1].

### 1.2. Poszczególne wiadomości

W każdym folderze kanału poszczególne wiadomości zawarte są wewnątrz folderów ponumerowanych po kolei. Dla [`info`](./data/info/) np. [`001_spis-tresci`](./data/info/001_spis-tresci/), [`002_kanaly`](./data/info/002_kanaly/), [`003_watki`](./data/info/003_watki/) itd.[^2] Folder kanału zawiera też plik `targets.txt`, gdzie w kolejnych liniach wypisane są nazwy webhooków powiązanych z tym kanałem.

### 1.3. Struktura pojedynczej wiadomości

W folderze powiązanym z konkretną wiadomością można znaleźć[^4] następujące pliki i podfoldery:

- `content.md` - zawartość wiadomości; jest w formacie Markdown[^3]
- `references.txt` - linki do powiązanych wiadomości na Discordzie, na których ma być wykonana edycja; jeśli chcemy stworzyć nową wiadomość, to ten plik pomijamy (tylko :warning: **UWAGA**, bo trzeba pamiętać, żeby go stworzyć przy następnej okazji)
- `embeds` - podfolder opisujący kolejne embedy (struktura opisana niżej); znowu numerowane: `01`, `02`, `03` itd.[^2]
- `attachments` - podfolder na załączniki; tutaj po prostu wrzucamy pliki i numerki umieszczamy na początku ich nazwy, np. [`01_DoubleCounter_verify.png`](./data/verification/003_instrukcja/attachments/01_DoubleCounter_verify.png)

### 1.4. Struktura embeda

W folderze powiązanym z pojedynczym embedem można znaleźć[^4] następujące pliki:

- `title.txt` - tytuł; jest w formacie Markdown[^3]
- `description.md` - treść embeda; jest w formacie Markdown[^3]
- `color.txt` - kolor ramki embeda; wartość w formacie hex, czyli np. `#FF0000` to czerwony - można sobie podejrzeć np. na [tej stronie](https://htmlcolorcodes.com/color-picker/)
- `url.txt` - link skojarzony z embedem
- `thumbnail.txt` - link do obrazka wyświetlanego z boku embeda w roli ikony

## 2. Skąd brać identyfikatory użytkowników, grup, kanałów, emotek...?

Wystarczy wpisać w wiadomości na Discordzie np. oznaczenie użytkownika, a następnie poprzedzić je znakiem ucieczki: `\`. Mamy do tego kanał [#testy-i-weryfikacje](https://discord.com/channels/822931925618524240/909039526599622696).

Przykłady:  
`\@dove6` -> `<@450069032968650762>`  
`\@Pani Administrator` -> `<@&1224305247695147079>`  
`\#testy-i-weryfikacje` -> `<#909039526599622696>`  
`\:szloch:` -> `<:szloch:909063765520171109>`

## 3. No dobra, ale jak w ogóle edytować wiadomości?

Działamy w obrębie GitHuba, co pozwala na śledzenie historii zmian i wzajemną kontrolę poprzez komentarze. Jednocześnie wymaga to jednak wpasowania się w ramy obowiązującego systemu. Niniejsza instrukcja ma za zadanie właśnie wyłożyć krok po kroku, w jaki sposób edytuje się tu rzeczy.

### 3.1. Własna gałąź

Gałąź (ang. *branch*) to taka prywatna[^5] piaskownica, w której możemy sobie wykonywać przeróżne zmiany do momentu, aż nam się spodoba, uznamy robotę za skończoną i będziemy mogli przedstawić pracę do oceny.

![Widok wyszukiwarki gałęzi w repozytorium](https://github.com/user-attachments/assets/e504580e-146c-4ef2-b7aa-e2b54bb67ccd)

Aby utworzyć nową gałąź, należy kliknąć przycisk z symbolem gałęzi w lewym górnym rogu strony (jak na obrazku powyżej). Wpisujemy wymyśloną dla gałęzi nazwę. Unikalną, ale najlepiej-krotka-i-bez-polskich-znakow. Nazwę musimy zapamiętać, żeby później móc na tę gałąź się przełączać i na niej pracować. Jak już wpiszemy nazwę, to klikamy "Create branch **...** from **main**":

![obraz](https://github.com/user-attachments/assets/f0a37cad-6cea-48a0-9d40-d2290cc7f2ee)

To, że pracujemy obecnie na konkretnej gałęzi możemy poznać po tym, że jej nazwa wyświetla się na przycisku gałęzi w lewym górnym rogu:

![obraz](https://github.com/user-attachments/assets/bf29011f-fbba-47c8-bf8b-54ee058d5f59)

Należy zwracać uwagę na to, żeby pracować na konkretnej gałęzi, a nie na głównej gałęzi `main`. Aby przełączyć się na wybraną gałąź, wpisujemy jej nazwę w wyszukiwarkę i wybieramy:

![obraz](https://github.com/user-attachments/assets/c01af304-7322-4c9d-9f41-bb53803b04a2)

### 3.2. Zarządzanie plikami

#### 3.2.1. Modyfikacja plików

Przyjmijmy, że chcemy zmienić kolor pierwszego embeda w drugiej wiadomości w FAQ. Szukamy odpowiedniego pliku ([data/faq/002_sekcja-wstepna/embeds/01/color.txt](./data/faq/002_sekcja-wstepna/embeds/01/color.txt)).  
:warning: **UWAGA!** Warto się upewnić, że jesteśmy na odpowiedniej gałęzi - widać to po lewej stronie:

![obraz](https://github.com/user-attachments/assets/fd17e2a4-5d19-4648-9d4b-e71cc8fa94dd)

Następnie klikamy ikonę ołówka "✏️" w prawym górnym rogu widoku zawartości pliku:

![obraz](https://github.com/user-attachments/assets/18b6bd0c-992c-431e-9672-dc7555626382)

i dokonujemy zmian w treści. Po wszystkim należy zapisać zmiany zielonym przyciskiem "Commit changes...":

![obraz](https://github.com/user-attachments/assets/4c8b16b6-d7e7-432f-ad9b-ec0d4e91179b)

W pole "Commit message" wpisujemy krótki, zwięzły opis zmian (normalnie po polsku), a w "Extended description" można dodać jakieś szczegóły, ale nie trzeba. Zatwierdzamy zielonym przyciskiem "Commit changes":

![obraz](https://github.com/user-attachments/assets/64b3c1da-9bfa-47b7-a87c-847adab10e31)

#### 3.2.2. Dodawanie plików (i folderów)

Jeśli chcemy stworzyć nowy plik, to przechodzimy do folderu, w którym ma być umieszczony, a następnie klikamy przycisk "Add file" i wybieramy "Create new file":

![obraz](https://github.com/user-attachments/assets/ab5392c7-c1f7-48eb-9a87-1ae407a8c253)

Otworzy nam się widok edytora. Pierwsze, co musimy zrobić, to podać nazwę nowego pliku:

![obraz](https://github.com/user-attachments/assets/1e56e9ab-ca06-40bd-bde0-218a3db8fae4)

⚠️ **UWAGA!** Ponieważ GitHub nie pozwala na tworzenie pustych folderów, jedynym sposobem na stworzenie nowego folderu jest wpisanie w nazwie pliku całej ścieżki z ukośnikami (`/`). Np. wpisanie `02/description.md` spowoduje utworzenie nowego folderu `02`, a w nim pliku `description.md`:

![obraz](https://github.com/user-attachments/assets/e3a51df2-ae6b-4f1c-bcfa-ac00279e3176)

Dalej procedura przebiega jak przy modyfikacji: wpisujemy coś w treść i zapisujemy poprzez "Commit changes...".

#### 3.2.3. Usuwanie plików

Musimy najpierw znaleźć dany plik. Jak już będziemy mieć widok na jego treść, to otwieramy menu "..." w prawym górnym rogu i wybieramy "Delete file":

![obraz](https://github.com/user-attachments/assets/0866575d-ed7b-4f44-a227-6111fffdfc3e)

⚠️ **UWAGA!** Usunięcie pliku również trzeba zapisać poprzez przycisk "Commit changes...".

### 3.3. Otwieranie dyskusji nad zmianami

Przechodzimy do strony z listą gałęzi: https://github.com/Dove6/przygody-reksia-discord-webhooks/branches

(Można na nią trafić, klikając na stronie głównej przycisk "Branches":

![obraz](https://github.com/user-attachments/assets/fb931478-3567-46ca-a5c1-c603cb7b11a3)

Korzystamy z wyszukiwarki, żeby znaleźć wybraną gałąź. Następnie klikamy na trzy kropki z prawej strony wpisu i wybieramy "New pull request":

![obraz](https://github.com/user-attachments/assets/0176bd09-6b57-49a8-a408-d3097df1c618)

W nowym oknie wyświetla nam się, że po ocenie gałąź zostanie włączona go gałęzi głównej `main`. Możemy dodać tytuł ("Add a title") oraz opis ("Add a description") pracy wykonanej na gałęzi. Po wszystkim klikamy "Create pull request":

![obraz](https://github.com/user-attachments/assets/648aa129-42f8-4004-a329-80318ee0960e)

Osoby oceniające można dodać z prawej strony, w sekcji "Reviewers". Należy nacisnąć ikonę zębatki i wyszukać osoby, a następnie je wklikać:

![obraz](https://github.com/user-attachments/assets/bc69b3af-bf3c-4eed-bf1f-fd84ee2aac16)

Sekcja "Assignees" to osoby odpowiedzialne za zmiany. Zwykle dodajemy tu siebie - przyciskiem "assign yourself":

![obraz](https://github.com/user-attachments/assets/884ad42b-0a27-482b-9d22-e7c19f0d415b)

Lista zmian widoczna jest w zakładce "Files changed":

![obraz](https://github.com/user-attachments/assets/0f8345c7-fd87-456a-9a8d-55ee576b62c6)

Gdy proces oceny zakończy się pomyślnie, pozostaje zatwierdzić wszystko przyciskiem "Merge pull request":

![obraz](https://github.com/user-attachments/assets/55472aee-5e8f-4b02-9647-6259aab52a94)

[^1]: Co nie jest do końca prawdą. Regulamin na przykład jest wrzucany równolegle na dwa kanały (jeden oryginalny i jedna kopia dla niezweryfikowanych).
[^2]: Nie ma znaczenia tak naprawdę, czy wszystkie numerki są zajęte i następują bezpośrednio po sobie. Wszystkie nazwy folderów są zbierane i sortowane alfabetycznie, więc to jest tylko takie uproszczenie dla edytującego.
[^3]: Pozwala to podejrzeć bezpośrednio na GitHubie, jak treść będzie *mniej więcej* (no nie w pełni, niestety) wyglądać na Discordzie. Chodzi o formatowanie (wytłuszczenie, kursywę, podkreślenie, przekreślenie), listy, nagłówki, niektóre emotki.
[^4]: Można, ale nie trzeba. Pozycje z listy są w większości opcjonalne. Jeśli któryś okaże się wymagany, to pipeline zacznie krzyczeć, ale tym już się będzie martwił autor niniejszego repozytorium.
[^5]: Oczywiście można pracować na jednej gałęzi wspólnie. Chodzi natomiast o to, że zmiany nie sa publicznie widoczne, dopóki siedzą sobie na swojej gałęzi. Dopiero po włączeniu ich do głównej gałęzi (`main`) webhooki dokonują aktualizacji wiadomości.
