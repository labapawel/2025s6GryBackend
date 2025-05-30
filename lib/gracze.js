const {Client} = require('./client.js'); // import klasy Client

class Gracze {
    gracze = []; // tablica graczy

    dodajGracza(unqId, socket){
        let gracz = this.gracze.filter(g => g.isId(unqId))[0];
        // console.log(gracz);
        
        if(!gracz) {

            let graczSam = this.gracze.filter(g => g.ClientCount==1)[0];
            // console.log("--------------------------------------------------------------------");
            // console.log(graczSam);
            
            if(graczSam) {
            
                graczSam.dodajGracza(unqId, socket);
                gracz = graczSam;
            } else 
            {
                gracz = new Client(unqId, socket);
                this.gracze.push(gracz);
            }
        } else
        {
            if(gracz.Client1 == unqId) {
                gracz.Socket1 = socket;
            } else if(gracz.Client2 == unqId) {
                gracz.Socket2 = socket;
            }
        }
      //  console.log(gracz.Client1, gracz.Client2);
        
        return gracz; // instancja gry

    }
}

module.exports = {
        Gracze
    };