const Discord = require('discord.js');
//const auth = require('./auth.json');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }

    if (msg.content.startsWith('!owsr')) {
        const msgSplit = msg.content.split(' ');
        console.log(msgSplit.length + ' ' + msgSplit);
        if (msgSplit.length === 1) {
            console.log('utlisateur non defini');
            msg.reply('Precisez un BattleTag');
        } else {
            const user = msgSplit[1].replace(/[-.#]/g, "-"); //ow-api utilise un "-" à la place d'un "#" pour le battletag
            console.log(user);

            //Envoi de la requête à l'api ow
            var client = new HttpClient();
            //var url = 'https://ow-api.com/v1/stats/pc/eu/' + user + '/profile';
            var url = 'https://ow-api.com/v1/stats/pc/eu/' + user + '/complete';
            console.log('url de la requête : ' + url);

            try{
                client.get(url, function (response) {
                    
                    
                    var fileSystem=new ActiveXObject("Scripting.FileSystemObject");
                    var monfichier=fileSystem.OpenTextFile("log.txt", 2 ,true);
                    monfichier.WriteLine(response);
                    monfichier=fileSystem.OpenTextFile("log.txt", 1 ,true);
                    //alert(monfichier.ReadAll()); // imprime: "tutoriels en folie"
                    monFichier.Close();
                    
                    
                    // do something with response
                    response = JSON.parse(response);

                    //console.log(response.name + ' ' + response.level);
                
                    const won = response.competitiveStats.games.won;
                    const played = response.competitiveStats.games.played;
                    var ratio = Number.parseFloat(won / played * 100).toPrecision(4);


                    const embedStats = new Discord.RichEmbed();
                    embedStats.setAuthor(response.name, response.ratingIcon);
                    embedStats.setTitle('Ranked stats');
                    embedStats.setThumbnail(response.icon);
                    embedStats.setColor(0xCCCCCC);
                    embedStats.setTimestamp();
                    embedStats.addField('SR', response.rating, true);
                    embedStats.addField('Win ratio', ratio + '% (' + won + '/' + played + ')', true);
                    embedStats.setFooter('owsr made by CactusPin.');
                

                
                    msg.reply(embedStats);
                });
            }
            catch (error) {
                console.log(error);
                msg.reply('Impossible d\'afficher les stats.');
            }
        }
        

        
    }



});

client.login(process.env.TOKEN).catch(console.error);


var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
        var anHttpRequest = new XMLHttpRequest();
        //anHttpRequest.responseType = 'json';
        anHttpRequest.responseType = 'text';
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
                try{
                    aCallback(anHttpRequest.responseText);
                } catch (error) {
                    console.error('Erreur lors du callback. \nDetail : ' + error);
                    //throw "Impossible d\'afficher les statistiques";
                }
            }
        }

        try{
            anHttpRequest.open("GET", aUrl, true);
        } catch (error) {
            console.error('Erreur lors de l\'open de la requete.\nDetail : ' + error);
        }
        try{
            anHttpRequest.send(null);
        } catch (error) {
            console.error('Erreur lors du send de la requete.\nDetails : ' + error);
        }
    }
}

