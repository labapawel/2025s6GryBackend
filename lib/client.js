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

    wyslijStanGry(){
        if(this.Socket1 != null) {
            this.Socket1.emit('stanGry', this.stanGry);
        }
        if(this.Socket2 != null) {
            this.Socket2.emit('stanGry', this.stanGry);
        }
    }

    aktualizujTabliceGracza(id){
        if(this.Client1 == id) {
            if(this.tablica1.length != 0) 
                this.Socket1.emit('modTablice', this.tablica1);
        } else if(this.Client2 == id) {
            if(this.tablica1.length != 0) 
                this.Socket2.emit('modTablice', this.tablica2);
        }
    }

    modyfikujPlansze(id, tablica) // modyfikacja planszy gracza 1
    {
        if(this.Client1 == id) {
            this.tablica1 = tablica;
            this.stanGry.Client1 = id;
        } else if(this.Client2 == id) {
            this.tablica2 = tablica;
            this.stanGry.Client2 = id;
        }
       // console.log(id, tablica);
    }

    constructor(unqId, socket) {
        this.Socket1=socket;
        this.Client1=unqId;
    }

    isId(userid) {
        if(this.Client1 == userid || this.Client2 == userid) {
            return true;
        }
        return false;
    }

  
}