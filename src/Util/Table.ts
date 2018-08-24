import ParseData from './ParseData';
import App from '../App';

class Table {

    private rows; // Each row of the table, represents one team.

    constructor(round, prevTables: Table[]) {
        this.rows = [];

        if (prevTables.length > 0) { // We have previous results.
            const lastTable = prevTables.pop(); // Get the last table.
            prevTables.push(lastTable); // I really wish there was a peek function.

            let newRows = this.parseRound(round, []); // Parse the round.

            lastTable.getRows().forEach(row => { // Go through the previous table.
                let played: boolean = false; // The team hasn't played this round.
                newRows.forEach(newRow => { // Go through each team.
                    if (row.name === newRow.name) { // Is this the team we're looking for?.
                        if (played === true) { // Have they played this round?
                            this.rows.some(r => {
                                if (r.name === newRow.name) { // If so, find their entry so we don't get a duplicate when we add them.
                                    row = r;
                                    return true;
                                }
                                return false;
                            });
                        }
                        
                        const teamName = row.name; // Get properties.
                        const newPlayed = row.played + newRow.played; // Add to the existing ones.
                        const newWon = row.won + newRow.won;
                        const newLost = row.lost + newRow.lost;
                        const newGoalsFor = row.goalsFor + newRow.goalsFor;
                        const newGoalsAgainst = row.goalsAgainst + newRow.goalsAgainst;
                        const newGoalDifference = row.goalDifference + newRow.goalDifference;
                        const newPts = row.pts + newRow.pts;

                        const finalRow = { // Create the final row.
                            position: 0,
                            name: teamName,
                            played: newPlayed,
                            won: newWon,
                            lost: newLost,
                            goalsFor: newGoalsFor,
                            goalsAgainst: newGoalsAgainst,
                            goalDifference: newGoalDifference,
                            pts: newPts
                        };
                        
                        if (played === false) {
                            this.rows.push(finalRow);
                        }
                        played = true;
                    }
                });
                if (played === false) { // If they haven't played, it's fairly simple.
                    const rowCopy = {
                        position: row.position,
                        name: row.name,
                        played: row.played,
                        won: row.won,
                        lost: row.lost,
                        goalsFor: row.goalsFor,
                        goalsAgainst: row.goalsAgainst,
                        goalDifference: row.goalDifference,
                        pts: row.pts
                    };

                    this.rows.push(rowCopy);
                }
            });
        }

        else { // No previous tables implies this is the first round.
            this.rows = this.parseRound(round, this.rows); // Simple case.
        }

        const teams: string[] = App.teams; // Get all the teams.

        if (this.rows.length < teams.length && prevTables.length === 0) { // Lets add a blank entry for all teams. It helps with byes.

            const teamsInRows: string[] = []; 

            this.rows.forEach(row => {
                teamsInRows.push(row.name);
            });

            teams.forEach(team =>  {
                if (teamsInRows.indexOf(team) == -1) { // Is the team in array?
                    const teamObj = { // If not, add a blank entry.
                        position: 0,
                        name: team,
                        played: 0,
                        won: 0,
                        lost: 0,
                        goalsFor: 0,
                        goalsAgainst: 0,
                        goalDifference: 0,
                        pts: 0
                    };

                    this.rows.push(teamObj);
                }
            });

            //console.log(teamsInRows);
        }

        this.orderTable(); // Order the table.
    }

    // Parses a round, and assigns points and goals.
    private parseRound(round, rows) {
        round.forEach(game => {
            const homeTeam: string = game.homeTeam; // Get things we need.
            const awayTeam: string = game.awayTeam;
            const homeScore: number = ParseData.parseForScore(game, true);
            const awayScore: number = ParseData.parseForScore(game, false);

            if (homeScore > awayScore) { // Home win. Home team gets points.
                const homeTeamObj = {
                    position: 0,
                    name: homeTeam,
                    played: 1,
                    won: 1,
                    lost: 0,
                    goalsFor: homeScore,
                    goalsAgainst: awayScore,
                    goalDifference: homeScore - awayScore,
                    pts: 2
                };

                const awayTeamObj = {
                    position: 0,
                    name: awayTeam,
                    played: 1,
                    won: 0,
                    lost: 1,
                    goalsFor: awayScore,
                    goalsAgainst: homeScore,
                    goalDifference: awayScore - homeScore,
                    pts: 0
                };

                rows.push(homeTeamObj);
                rows.push(awayTeamObj);
            }

            else if (homeScore < awayScore) { // Away win.
                const homeTeamObj = {
                    position: 0,
                    name: homeTeam,
                    played: 1,
                    won: 0,
                    lost: 1,
                    goalsFor: homeScore,
                    goalsAgainst: awayScore,
                    goalDifference: homeScore - awayScore,
                    pts: 0
                };

                const awayTeamObj = {
                    position: 0,
                    name: awayTeam,
                    played: 1,
                    won: 1,
                    lost: 0,
                    goalsFor: awayScore,
                    goalsAgainst: homeScore,
                    goalDifference: awayScore - homeScore,
                    pts: 2
                };

                rows.push(homeTeamObj);
                rows.push(awayTeamObj);
            }
        });

        return rows;
    }

    // Orders table with custom compare.
    private orderTable() {
        this.rows.sort(Table.compare);
    }

    // Ordering rules: Sort by points, then goal difference, then goals for, then goals against, then by alphabetical order.
    static compare(a, b) {

        if (a.pts > b.pts) {
            return -1;
        }

        else if (a.pts < b.pts) {
            return 1;
        }

        else {
            if (a.goalDifference > b.goalDifference) {
                return -1;
            }

            else if (a.goalDifference < b.goalDifference) {
                return 1;
            }

            else {
                if (a.goalsFor > b.goalsFor) {
                    return -1;
                }

                else if (a.goalsFor < b.goalsFor) {
                    return 1;
                }
                else {
                    if (a.homeTeam < b.homeTeam) {
                        return -1;
                    }

                    else {
                        return 1;
                    }
                }
            }
        }
    }

    getRows() {
        return this.rows;
    }
}
export default Table;