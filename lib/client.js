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
            this.stanGry.ruchyGracza1 = Array.from({length: this.selShip1?.length ?? 100}, (_, i)=> {});

            if(this.tablica1.length != 0) 
                this.Socket1.emit('modTablice', this.tablica1, this.selShip1);
        } else if(this.Client2 == id) {

            if(this.tablica1.length != 0) 
                this.Socket2.emit('modTablice', this.tablica2, this.selShip2);
        }
    }

    fillArray(length) {
        let x = [];
        for(let i=0; i<length; i++) {
            x.push({selected: false, bullseye: false});
        }
        return x;
    }

    // akcja gracza, klikanie pola gry
    akcjaGracza(userId, id){
          console.log('userId', userId, 'id', id);
        //  console.log(this.stanGry);

        if(this.Client1 == userId)
        {

            // console.log('----------------------------------------------');
            // console.log(this.stanGry.ruchyGracza1[id]);
            
            //this.stanGry.ruchyGracza1[id].shipItem.selected = true;
            this.stanGry.stanGracza1[id].checkedBox.selected=true
            this.stanGry.stanGracza2[id].checkedBox.shot = true;
            
            if(this.stanGry.stanGracza2[id] && this.stanGry.stanGracza2[id].ship ) { // sprawdzenie czy pole jest już zaznaczone
                console.log(this.stanGry.ruchyGracza2[id]);
                // początek statku
                let poczatekStatku = this.stanGry.stanGracza2[id].shipItem.startPosition;
                let kierunekStatku = this.stanGry.stanGracza2[id].shipItem.direction; // kierunek statku
                let dlugoscStatku = this.stanGry.stanGracza2[id].shipItem.size; // długość statku
                let zatopiony = true;
                if(!kierunekStatku){
                    for(let i=poczatekStatku; i<poczatekStatku+dlugoscStatku; i++) {
                        console.log('i', i, this.stanGry.stanGracza2[i].checkedBox.shot);
                        if(zatopiony && !this.stanGry.stanGracza2[i].checkedBox.shot) {
                            zatopiony = false;
                        }
                }
                      console.log('zatopiony 1', zatopiony);
                      if(zatopiony){
                        for(let i=poczatekStatku; i<poczatekStatku+dlugoscStatku; i++) {
                            this.stanGry.stanGracza1[i].shot = true; // zaznaczenie całego statku
                        }

                      }  
                    }

                // trafiony statek
                this.stanGry.stanGracza2[id].shipItem.bullseye = true; // jeśli tak to ustawiamy bullseye
                // informacja o trafieniu`
                this.stanGry.stanGracza1[id].checkedBox.bullseye = true; // jeśli tak to ustawiamy bullseye
            }

            this.stanGry.gracz = 2; // zmiana gracza

        } else if(this.Client2 == userId) { 

            this.stanGry.stanGracza2[id].checkedBox.selected=true;
            this.stanGry.stanGracza1[id].checkedBox.shot = true;

             if(this.stanGry.stanGracza1[id] && this.stanGry.stanGracza1[id].ship ) { // sprawdzenie czy pole jest już zaznaczone
                console.log(this.stanGry.ruchyGracza1[id]);
                this.stanGry.stanGracza1[id].shipItem.bullseye = true; // jeśli tak to ustawiamy bullseye
                this.stanGry.stanGracza2[id].checkedBox.bullseye = true; // jeśli tak to ustawiamy bullseye

                let poczatekStatku = this.stanGry.stanGracza1[id].shipItem.startPosition;
                let kierunekStatku = this.stanGry.stanGracza1[id].shipItem.direction; // kierunek statku
                let dlugoscStatku = this.stanGry.stanGracza1[id].shipItem.size; // długość statku
                let zatopiony = true;
                if(!kierunekStatku){
                    for(let i=poczatekStatku; i<poczatekStatku+dlugoscStatku; i++) {
                        console.log('i', i, this.stanGry.stanGracza1[i].checkedBox.shot);
                        if(zatopiony && !this.stanGry.stanGracza1[i].checkedBox.shot) {
                            zatopiony = false;
                        }
                      }  
                      console.log('zatopiony 2', zatopiony);
                      if(zatopiony){
                        for(let i=poczatekStatku; i<poczatekStatku+dlugoscStatku; i++) {
                            this.stanGry.stanGracza2[i].shot = true; // zaznaczenie całego statku
                        }

                    }
                }
            }
            this.stanGry.gracz = 1; // zmiana gracza
        }
    } 


    modyfikujPlansze(id, tablica, selShip) // modyfikacja planszy gracza 1
    {
        if(this.Client1 == id) {
            this.stanGry.ruchyGracza1 = this.fillArray(selShip?.length ?? 100); // resetowanie ruchów gracza 1
            this.tablica1 = tablica;
            this.selShip1 = selShip; // aktualizacja statku
            this.stanGry.stanGracza1 = tablica; // dodanie ruchu gracza 1
            this.stanGry.Client1 = id;
            this.stanGry.gracz = 2; // zmiana gracza
        } else if(this.Client2 == id) { 
            this.stanGry.ruchyGracza2 = this.fillArray(selShip?.length ?? 100); // resetowanie ruchów gracza 2
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