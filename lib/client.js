export class Client {
   
    tablica1 = []; // tablica do przechowywania planszy gracza 1
    tablica2 = []; // tablica do przechowywania planszy gracza 2
    Client1 = 0;
    Client2 = 0;
    Socket1 = null;
    Socket2 = null;
    stanGry = {
        gracz: 1,
        ruchyGracza1: [],
        ruchyGracza2: [],
        stanGracza1: [], 
        stanGracza2: [], 
        Client1: 0,
        Client2: 0,
    
    }; // gracz pierwszy wykonuje ruch

    get ClientCount() // licznik graczy
    {
        let count = 0;
        if(this.Client1 != 0) {
            count++;
        }
        if(this.Client2 != 0) {
            count++;
        }
        return count;
    }



    genStanGry(event){

        this.stanGry.Client1 = this.Client1;
        this.stanGry.Client2 = this.Client2;

        
        if(this.Socket1 != null) {
            let stanGry = {...this.stanGry}; // kopiowanie obiektu, aby uniknąć problemów z referencjami
            let daneGry = stanGry.stanGracza1
            let ruchyGracza = stanGry.ruchyGracza2;
            delete stanGry.ruchyGracza1;
            delete stanGry.ruchyGracza2;
            delete stanGry.stanGracza1;
            delete stanGry.stanGracza2;
            stanGry.ruchyGracza = ruchyGracza; // wysyłanie ruchów gracza 2          
            stanGry.wybranePola = daneGry; // wysyłanie tylko wybranych pól
            stanGry.selShip = 0;
            if(this.selShip2)
                stanGry.selShip = this.selShip2.filter(e=>!e.selected).length; // wysyłamy ilosc statków, które nie są zaznaczone
            this.Socket1.emit(event, stanGry);
        }
        if(this.Socket2 != null) {
            let stanGry = {...this.stanGry}; // kopiowanie obiektu, aby uniknąć problemów z referencjami
            let daneGry = stanGry.stanGracza2

            let ruchyGracza = stanGry.ruchyGracza2;
            delete stanGry.ruchyGracza1;
            delete stanGry.ruchyGracza2;
            delete stanGry.stanGracza1;
            delete stanGry.stanGracza2;
            stanGry.ruchyGracza = ruchyGracza; // wysyłanie ruchów gracza 2          
            stanGry.wybranePola = daneGry; // wysyłanie tylko wybranych pól
            stanGry.selShip =0;
            if(this.selShip1)
                stanGry.selShip = this.selShip1.filter(e=>!e.selected).length; // wysyłamy ilosc statków, które nie są zaznaczone
            this.Socket2.emit(event, stanGry); 
        }

    }

    ustawienieStatkow(){
        this.genStanGry('ustawienieStatkow'); // wysłanie stanu gry do obu graczy
      }

    wyslijStanGry(){
        // console.log("stanGry", this);
        this.genStanGry('stanGry');
    }

    aktualizujTabliceGracza(id){
        if(this.Client1 == id) {
            if(this.tablica1.length != 0) 
                this.Socket1.emit('modTablice', this.tablica1, this.selShip1);
        } else if(this.Client2 == id) {
            if(this.tablica1.length != 0) 
                this.Socket2.emit('modTablice', this.tablica2, this.selShip2);
        }
    }

    modyfikujPlansze(id, tablica, selShip) // modyfikacja planszy gracza 1
    {
        if(this.Client1 == id) {
            this.tablica1 = tablica;
            this.selShip1 = selShip; // aktualizacja statku
            this.stanGry.stanGracza1 = tablica; // dodanie ruchu gracza 1
            this.stanGry.Client1 = id;
            this.stanGry.gracz = 2; // zmiana gracza
        } else if(this.Client2 == id) { 
            this.tablica2 = tablica;
            this.selShip2 = selShip; // aktualizacja statku
            this.stanGry.gracz = 1; // zmiana gracza
            this.stanGry.stanGracza2 = tablica; // dodanie ruchu gracza 2
            this.stanGry.Client2 = id;
        }
       // console.log(id, tablica);
    }

    constructor(unqId, socket) {
        this.Socket1=socket;
        this.Client1=unqId;
    }

    dodajGracza(unqId, socket) {
        if(this.Client1 == unqId || this.Client2 == unqId) {
            return;
        }

        if(this.Client1 == 0) {
            this.Client1 = unqId;
            this.Socket1 = socket;
        } else if(this.Client2 == 0) {
            this.Client2 = unqId;
            this.Socket2 = socket;
        }
    }

    isId(userid) {
        if(this.Client1 == userid || this.Client2 == userid) {
            return true;
        }
        return false;
    }

  
}