"use strict";

import firebase from 'firebase';

class DatabaseModule {

    static database: firebase.database.Database;

    constructor() {
        const config = { // Our firebase details.
            apiKey: "AIzaSyAFp_OF_jdw8ku-KmTCG2OkYbB5T313hF0",
            authDomain: "netball-a028f.firebaseapp.com",
            databaseURL: "https://netball-a028f.firebaseio.com",
            projectId: "netball-a028f",
            storageBucket: "netball-a028f.appspot.com",
            messagingSenderId: "17303721152"
        };
        
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        
        DatabaseModule.database = firebase.database();
    }
    
    static writeToDb() {
        //Database.database.ref('users/' + 321321).set({
            //username: "test",
           // email: "Test"
        //});
    }

    static readFromDb(): Promise<Map<string, any>> {

        const years: Map<string, any> = new Map(); // We make a map of year to games played in that year.

         return DatabaseModule.database.ref().once('value').then(function(snapshot) {
            snapshot.forEach(function(year) {
                let games = []; // A list of games in that year.
                year.forEach(function(game) {
                    const data = new Map(); // A map of the data for each game.
                    game.forEach(function(child) {
                        data.set(child.key, child.val());
                    });
                    games.push(data); 
                });
                years.set(year.key, games); // Put the games in that year in the map.
            });
        }).then(() => {return years;});
    }
}

export default DatabaseModule;
