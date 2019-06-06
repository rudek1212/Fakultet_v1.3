Wymagany dotnet core sdk 2.2
Wymagany mircosoft sql express 

Konfiguracja połączenia z bazą danych znajduje się w pliku DocsDbContext, 
domyślnie próbuje się połączyć z localdb.
https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb?view=sql-server-2017

Uruchomienie:

dotnet build 
dotnet ef database update
dotnet run

W konsoli wyswietli się adres aplikacji
swagger jest pod adresem /swagger, przykładowo localhost:5000/swagger

Dane administratora:
admin@docs.pl/1qaz!QAZ


Na swaggerze należy wykonać akcje /Auth/authenticate, zwróci ona jsona z tokenem. Następnie trzeba ten token wprowadzić do nagłówków. By to zrobić na swaggerze w celu testowania api należy kliknąć przycisk "Authorize" i w polu Value: wprowadzić wartość "Bearer {tokenzpoprzedniejakcji}".

Po tym kroku jest się traktowanym jako użytkownik którego dane zostały wprowadzone w akcji /Auth/authenticate

Do wysyłania maili jest używany sendgrid, użyłem swojego konta, w kodzie jest wpisywany tylko klucz do api sendgrida który możecie podmienić na swój.
Jest on w lini 112 pliku Startup.cs
!!!! Uwaga maile często trafiają do spamu. Bo nie mamy zbyt legitnego adresu ;P


Wartości FileType i FileState są enumami. Więc po stronie api są interpretowane jako int'y. Oto ich wartości:
public enum FileType
    {
        Proposal=0,
        Complaint=1,
        Claim=2,
        Decision=3
    }

public enum FileState
    {
        Created = 0,
        Confirmed = 1,
        Sent = 2,
        Signed = 3,
        Rejected = 4
    }

Kontroler ExternalUser jest dla zwykłych użytkowników i tych bez konta, jeśli nie ma konta należy podać {accessToken} jeśli użytkownik jest zalogowany, nie jest to potrzebne należy tam podać pustą wartość.