Dokumentation om fildelare projekt

##Hur man startar
Du startar projektet genom att köra npm install för att ladda ner paket sen npm run dev för att starta local version av appen.

##Länk till figma:
https://www.figma.com/design/3MK0zNxaW4bT0TmdX14WTb/Fildelare?node-id=0-1&t=M0t6g62rE8UNtRK3-1

##Projektbeskrivning
Projektet använder ett api från themoviedb för att på startsidan visa upp populära filmer som du kan favorisera och titta i favorit listan samt söka efter filmer genom sökrutan. Använder asynkrona rop i getPopularMovies och SearchMovies för att se till att datan alltid finns när vi vill använda den använder även caching på getPopularMovies för att minimera antalet api-anrop som behöver göras.

##API
Jag använder ett api från themoviedb där jag hämtar det mest populära filmer just nu, använder axios paketet för att smidigare hantera anroper som är en get på deras popular endpoint där auth nyckel skickas med i headers objektet. För att söka använder jag search movie endpoint sen använder jag encodeURIConponent på min query för att se till att strängen i min query alltid är i rätt format så jag ej ska få errors om användaren skriver något knasigt. Om dessa api anrop inte går igenom skickas ett error i konsolen som berättar att anropet ej gått igenom.

##Använding
Att använda appen är väldigt simpelt den visar upp de mest populära filmerna som du kan välja att spara till favoriter som har en undersida där favoriterna listas up och detta görs genom localstorage, Appen har en sökfunktion där du kan söka efter filmer och de 9 mest relevanta filmerna dyker visas genom displayMovies.
