import App from '../App';
import Table from './Table'

class ParseData {
    
    // Get the table for countries, including domestic games.
    static getTableByCountry(round: number, year: string) {
        
        const k = ParseData.getTableData(round, year); // Get a table of all teams.
        
        const finalRound = k[round - 1]; // Get the final round.
        const countriesTable = [];

        countriesTable.push({ // New Zealand teams.
            position: 0,
            name: "New Zealand",
            played: 0,
            won: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            pts: 0
        });

        countriesTable.push({ // Australian teams.
            position: 0,
            name: "Australia",
            played: 0,
            won: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            pts: 0
        });

        finalRound.getRows().forEach(row => { // Go through each team in the table.
            if (App.teams.indexOf(row.name) < 5) { // New Zealand team.
                const old = countriesTable[0]; // Get the team.
                old.played += row.played; // Update country table.
                old.won += row.won;
                old.lost += row.lost;
                old.goalsFor += row.goalsFor;
                old.goalsAgainst += row.goalsAgainst;
                old.goalDifference += row.goalDifference;
                old.pts += row.pts;
                countriesTable[0] = old;
            }

            else { // Australian team.
                const old = countriesTable[1];
                old.played += row.played; // Get the team.
                old.won += row.won;
                old.lost += row.lost;
                old.goalsFor += row.goalsFor;
                old.goalsAgainst += row.goalsAgainst;
                old.goalDifference += row.goalDifference;
                old.pts += row.pts;
                countriesTable[1] = old;
            }
        });

        countriesTable.sort(Table.compare); // Sort the countries with custom comparator.

        for (let i = 0, n = countriesTable.length; i < n; ++i) { // Set the positions for each country.
            countriesTable[i].position = i + 1;
        }

        return countriesTable;
    }

    // Get a table of countries only counting international games.
    static getInternationalPerformanceByCountry(round: number, yearOfTable: string) {
        const teamTable = this.getInternationalPerformanceByTeam(round, yearOfTable); // Get the table by teams.
        const finalRound = teamTable[teamTable.length - 1]; // Get the final round.
        const countriesTable = [];

        countriesTable.push({ // NZ teams.
            position: 0,
            name: "New Zealand",
            played: 0,
            won: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            pts: 0
        });

        countriesTable.push({ // Aus teams.
            position: 0,
            name: "Australia",
            played: 0,
            won: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            pts: 0
        });

        finalRound.getRows().forEach(row => {
            if (App.teams.indexOf(row.name) < 5) { // Is an NZ team.
                const old = countriesTable[0]; // Get team.
                old.played += row.played; // Update fields.
                old.won += row.won;
                old.lost += row.lost;
                old.goalsFor += row.goalsFor;
                old.goalsAgainst += row.goalsAgainst;
                old.goalDifference += row.goalDifference;
                old.pts += row.pts;
                countriesTable[0] = old;
            }

            else {
                const old = countriesTable[1]; // Is an Aus team.
                old.played += row.played;
                old.won += row.won;
                old.lost += row.lost;
                old.goalsFor += row.goalsFor;
                old.goalsAgainst += row.goalsAgainst;
                old.goalDifference += row.goalDifference;
                old.pts += row.pts;
                countriesTable[1] = old;
            }
        });

        countriesTable.sort(Table.compare); // Sort table.

        for (let i = 0, n = countriesTable.length; i < n; ++i) { // Set positions.
            countriesTable[i].position = i + 1;
        }

        return countriesTable;
    }

    static getInternationalPerformanceByTeam(round: number, yearOfTable: string) {
        const maxRounds: number = 17; // Maximum number of rounds.

        const years = ["2008", "2009", "2010", "2011", "2012", "2013"]; // All the years.

        const rounds: Map<string, {}[]> = new Map();

        years.forEach(e => { 
            if (e === yearOfTable) { // Is this the right year?.
                App.years.forEach(function (games, year) {
                    if (year === yearOfTable) { // Check for valid year.
                        if (maxRounds > round && round > 0) { // Check for valid round.
                            games.forEach(game => { // Go through games.
                                const gameRound: string = game.get("Round"); // Get the round.
                                if (parseInt(gameRound) <= round) { // Make sure round is ok.
                                    if (rounds.get(gameRound) === undefined) { // Check if the array exists.
                                        const k: {}[] = []; // Empty array.
                                        rounds.set(gameRound, k); // Add to map.
                                    }

                                    const teams: string[] = App.teams; // Get an array of all teams.

                                    const awayTeam = game.get("Away Team"); // Get the relevant teams.
                                    const homeTeam = game.get("Home Team");

                                    if (teams.indexOf(awayTeam) < 5 && teams.indexOf(homeTeam) >= 5) { // Aus home team, nz away team.

                                        const gameObj = { // Construct game.
                                            "awayTeam": game.get("Away Team"),
                                            "date": game.get("Date"),
                                            "homeTeam": game.get("Home Team"),
                                            "round": gameRound,
                                            "score": game.get("Score"),
                                            "time": game.get("Time"),
                                            "venue": game.get("Venue")
                                        };
                                        
                                        rounds.get(gameRound).push(gameObj); // Push the game.
                                    }

                                    else if (teams.indexOf(homeTeam) < 5 && teams.indexOf(awayTeam) >= 5) { // Aus away team, nz home team.
                                        
                                        const gameObj = { // Construct game.
                                            "awayTeam": game.get("Away Team"),
                                            "date": game.get("Date"),
                                            "homeTeam": game.get("Home Team"),
                                            "round": gameRound,
                                            "score": game.get("Score"),
                                            "time": game.get("Time"),
                                            "venue": game.get("Venue")
                                        };

                                        rounds.get(gameRound).push(gameObj); // Push the game.
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });

        return ParseData.buildTable(rounds); // Build the table.
    }

    // Get a teams performance (i.e. wins and losses).
    static teamPerformance(num: number): any { // Num is index of the team in the array in App.
        let team: string = App.teams[num]; // Get the team
        const years = new Map();
        App.years.forEach(function (games, year) { // GO through each year.
            let results: boolean[] = []; // Hold true for win, false for loss.
            games.forEach(game => { // Go through each game.
                    let home: boolean;
                    
                    if (game.get("Home Team") === team) { 
                        home = true;
                    }
                   
                    else if (game.get("Away Team") === team) {
                        home = false;
                    }
                    
                    if (home === true || home === false) {
                        results.push(ParseData.win(game.get("Score"), home));
                    }
                }
            );


            years.set(year, results);
        });

        return years;
    }

    // Get an array of games for a specific team.
    static getGameObjects(team: string, yearNum: number): {}[] {
       
        const gameObjs: {}[] = [];
    
        const findYear = yearNum.toString(); // Get a string rep of the year.

        App.years.forEach(function (games, year) { // Go through each year.
            if (year === findYear) { // Is the year equal?
                games.forEach(game => { // Go through each game.
                    
                    if (game.get("Home Team") === team) { // Correct team?
                        const win = ParseData.win(game.get("Score"), true); // Is it a win?

                        const gameObj = { // Create game object.
                            "awayTeam": game.get("Away Team"),
                            "date": game.get("Date"),
                            "homeTeam": game.get("Home Team"),
                            "score": game.get("Score"),
                            "time": game.get("Time"),
                            "venue": game.get("Venue"),
                            "home": true,
                            "win": win
                        };

                        gameObjs.push(gameObj); // Add game.
                    }

                    else if (game.get("Away Team") === team) { // Correct team?
                        
                        const win = ParseData.win(game.get("Score"), false);
                        
                        const gameObj = { // Create game object.
                            "awayTeam": game.get("Away Team"),
                            "date": game.get("Date"),
                            "homeTeam": game.get("Home Team"),
                            "score": game.get("Score"),
                            "time": game.get("Time"),
                            "venue": game.get("Venue"),
                            "home": false,
                            "win": win
                        };

                        gameObjs.push(gameObj); // Add game.
                    }

                });
            }
        });

        return gameObjs; // Return games.
    }

    // Get the goals scored by a team in a year.
    static getGoalsScored(num: number, findYear: string): number[] {
        let team: string = App.teams[num]; // Get the team.
        let scores: number[] = []; // Hold scores.

        App.years.forEach(function (games, year) { // For each year.
            if (year === findYear) { // Year correct?
                games.forEach(game => { // Each game.
                    if (game.get("Home Team") === team) { // Correct team?
                        const score: number = ParseData.parseForScore(game, true); // Get score.
                        if (!isNaN(score)) { // Check for parsing error or bye.
                            scores.push(score);
                        }
                    }

                    else if (game.get("Away Team") === team) {
                        const score: number = ParseData.parseForScore(game, false);
                        if (!isNaN(score)) { // Check for parsing error or bye.
                            scores.push(score);
                        }
                    }
                });
            }
        });



        return scores;
    }

    // Did the team win?
    static win(score: string, home: boolean): boolean {
        const regex: RegExp = /(–|-)+/g; // Split on - or – .

        const scores = score.split(regex); // Split.
        const homeWin = scores[0] > scores[2]; // Compare.

        return (homeWin === true && home === true) || (homeWin === false && home === false);
    }

    // Parse the score of a game.
    static parseForScore(game: any, home: boolean): number {
        let rawScore: string;

        try {
            rawScore = game.get("Score"); // Get the score.
        }

        catch (TypeError) { // Some kind of error?
            rawScore = game.score;
        }

        const regex: RegExp = /(–|-)+/g; // Split on - or – .

        if (rawScore.length !== 0) { // Blank score implies bye.

            let isDraw: boolean = false;

            if (rawScore.startsWith("draw")) { // Check for draws.
                isDraw = true;
            }

            let scoreSplit: string[] = rawScore.split(regex); // Split on our regex.

            let score: string;

            if (home) { // Is it a home game?
                
                if (isDraw) { // Is it a draw? (Special case).
                    const tmp = scoreSplit[0].split(" ");
                    score = tmp[1]; // If so, we need the second part of the string.
                }

                else {
                    score = scoreSplit[0]; // Home team should be first.
                }
            }

            else {
                score = scoreSplit[2]; // They were the away team in this case. 
            }

            try {
                score = score.trim();  // Remove white space.    
                const scoreNum = parseInt(score); // Parse the score to a num
                return scoreNum;
            }

            catch (TypeError) { // Problem with the regex?
                return NaN;
            }
        }

        return NaN;
    }

    // Get a table of the results from a year.
    static getTableData(round: number, yearOfTable: string) {

        const maxRounds: number = 18; // Maximum number of rounds.

        const years = ["2008", "2009", "2010", "2011", "2012", "2013"];

        const rounds: Map<string, {}[]> = new Map();

        years.forEach(e => { // For each year.
            if (e === yearOfTable) { // Correct year?
                App.years.forEach(function (games, year) {
                    if (year === yearOfTable) { // Check for valid year.
                        if (maxRounds > round && round > 0) { // Check for valid round.
                            games.forEach(game => {
                                const gameRound: string = game.get("Round");
                                if (parseInt(gameRound) <= round) { // Make sure round is bounded well.
                                    if (rounds.get(gameRound) === undefined) { // Check if the array exists.

                                        const k: {}[] = []; 
                                        rounds.set(gameRound, k); // Add to map.
                                    }
                                    const gameObj = { // Create game object.
                                        "awayTeam": game.get("Away Team"),
                                        "date": game.get("Date"),
                                        "homeTeam": game.get("Home Team"),
                                        "round": gameRound,
                                        "score": game.get("Score"),
                                        "time": game.get("Time"),
                                        "venue": game.get("Venue")
                                    };
                                    rounds.get(gameRound).push(gameObj);
                                }
                            });
                        }
                    }
                });
            }
        });

        return ParseData.buildTable(rounds); // Build the table.
    }

    static buildTable(rounds: Map<string, {}[]>) {
        const data: Table[] = []; // The primary table.

        rounds.forEach(round => {
            data.push(new Table(round, data)); // Create a new table.
        });

        data.forEach(e => {
            const rows = e.getRows();

            for (let i = 0, n = rows.length; i < n; ++i) { // Set the position.
                rows[i].position = i + 1;
            }
        });

        return data;
    }
}

export default ParseData;