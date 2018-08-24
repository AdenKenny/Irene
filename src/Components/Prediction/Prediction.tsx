import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import List from '../List/List';
import App from '../../App';
import PredictionBar from '../PredictionBar/PredictionBar';
import FinalPrediction from './FinalPrediction';
import PredictionOption from './PredictionOption';
import MainPage from '../../MainPage';
import Answers from '../Answers/Answers';
import ParseData from '../../Util/ParseData';
import Chart from '../Chart/Chart';
import TeamRadarChart from '../RadarChart/TeamRadarChart';
import TeamTable from '../TeamTable/TeamTable';
import TheLineChart from '../LineChart/TheLineChart';
import HeatMap from '../HeatMap/HeatMap';

class Prediction extends React.Component {

    private rounds: string[];
    private questions: Map<string, Function>;
    private predictions: PredictionOption;
    private list;
    private input;
    private answers;

    constructor(props) {
        super(props);
        this.rounds = [];
        for (let j = 1; j <= App.rounds; j++) {
            this.rounds.push("Round " + j);
        }

        this.questions = new Map();
        this.questions.set("How had %team% performed after %round% in %year%", this.performance.bind(this));
        this.questions.set("How did New Zealand and Australian teams fare against one another in %year%", this.interCountry.bind(this));
        this.questions.set("What were the results of %team% in different home venues", this.homeVenues.bind(this));
        this.questions.set("What were the results of %team% in different away venues", this.awayVenues.bind(this));
        this.questions.set("How did teams perform in international fixtures in %year%", this.international.bind(this));
        this.questions.set("How did teams perform in all fixtures in %year%", this.allInternational.bind(this));
        this.questions.set("How did table positions change over the year in %year%", this.lineChart.bind(this));
        this.questions.set("What did the table look like after %round% in %year%", this.showTable.bind(this));
        this.questions.set("What was the performance for %team% over all their games", this.heatMap.bind(this));

        this.predictions = new PredictionOption("", []);
        this.questions.forEach((k, question) => {
            const words = question.split(" ");
            let last = true;
            let options;
            for (let i = words.length - 1; i >= 0; i--) {
                let os;
                if (words[i] === "%team%") {
                    os = App.teams;
                }
                else if (words[i] === "%year%") {
                    os = App.yearNames;
                }
                else if (words[i] === "%round%") {
                    os = this.rounds;
                }
                else {
                    os = [words[i]];
                }
                if (last === true) {
                    options = os.map(o => {
                        return new FinalPrediction(o + "?");
                    });
                    last = false;
                }
                else {
                    const newOptions = os.map(o => {
                        return new PredictionOption(o, options);
                    });
                    options = newOptions;
                }
            }
            this.predictions.add(options);
        });
        this.predictions.merge();
        this.predictions = this.predictions.reduce();
    }

    inputListener(input) {
        var unordered = this.predictions.getOptions(input.toLowerCase());
        var ordered = [];
        var other = [];
        unordered.forEach(o => {
            if (input.length <= o.length && o.substring(0, input.length).toLowerCase() === input.toLowerCase()) {
                ordered.push(o);
            }
            else {
                other.push(o);
            }
        });
        other.forEach(o => {
            ordered.push(o);
        });
        ordered = ordered.map(p => {
            if (p.endsWith("?")) {
                return p;
            }
            return p.substring(0, p.length - 1) + "...";
        });
        this.list.setPredictions(ordered);
    }

    dirKey(isUp) {
        this.list.dirKey(isUp);
    }

    pressed(input) {
        if (input === undefined) {
            return;
        }
        if (input.endsWith("?")) {
            this.list.setPredictions([]);
            this.input.setInput("");
            this.parsePrediction(input);
            return;
        }
        else {
            input = input.substring(0, input.length - 3) + " ";
        }
        this.input.setInput(input);
        this.inputListener(input);
    }

    enter() {
        this.pressed(this.list.getCurrent());
    }

    render() {
        return (
            <div>
                <Answers ref={(child) => { if (child !== null) { this.answers = child; } }} />
                <div className="Intro5">
                    <div className="autocomplete">
                        <PredictionBar ref={(child) => { if (child !== null) { this.input = child; this.input.setParent(this); } }} />
                        <List ref={(child) => { if (child !== null) { this.list = child; this.list.setParent(this); } }} />
                    </div>
                </div>
            </div>
        );
    }

    parsePrediction(prediction) {
        let finished = false;
        this.questions.forEach((func, question) => {
            if (finished === true) {
                return;
            }
            const split = question.split("%");
            const teams = [];
            const rounds = [];
            const years = [];
            let pos = 0;
            let problem = false;
            split.some(s => {
                if (s === "team") {
                    let found = false;
                    App.teams.some(team => {
                        if (prediction.substring(pos, pos + team.length) === team) {
                            teams.push(team);
                            pos = pos + team.length;
                            found = true;
                            return true;
                        }
                        return false;
                    });
                    if (found === false) {
                        problem = true;
                        return true;;
                    }
                }
                else if (s === "round") {
                    let found = false;
                    this.rounds.some(round => {
                        if (prediction.charAt(pos + round.length) === ' ' && prediction.substring(pos, pos + round.length) === round) {
                            rounds.push(round);
                            pos = pos + round.length;
                            found = true;
                            return true;
                        }
                        return false;
                    });
                    if (found === false) {
                        problem = true;
                        return true;
                    }
                }
                else if (s === "year") {
                    let found = false;
                    App.years.forEach((v, year) => {
                        if (found === false && prediction.substring(pos, pos + year.length) === year) {
                            years.push(year);
                            pos = pos + year.length;
                            found = true;
                        }
                    });
                    if (found === false) {
                        problem = true;
                        return true;
                    }
                }
                else {
                    if (prediction.substring(pos, pos + s.length) === s) {
                        pos = pos + s.length;
                    }
                    else {
                        problem = true;
                        return true;
                    }
                }
                return false;
            });
            if (problem === false) {
                func(prediction, teams, rounds, years);
                finished = true;
            }
        });
    }

    performance(question, teams: string[], rounds: string[], years: string[]) {
        let round = Number(rounds[0].split(" ")[1]);
        const cls = this;
        ParseData.getTableData(round, years[0])[round - 1].getRows().some(row => {
            if (row.name === teams[0]) {
                const result = teams[0] + " were " + Prediction.suffix(row.position) + " after " + rounds[0] + " of " + years[0] +
                    ", with " + row.pts + " point" + Prediction.plural(row.pts) + 
                    ". They had played " + row.played + " game" + Prediction.plural(row.played) +
                    ", with " + row.won + " win" + Prediction.plural(row.won) + 
                    " and " + row.lost + " loss" + Prediction.pluralE(row.lost) + 
                    ". They had a goal difference of " + row.goalDifference +
                    ", scoring " + row.goalsFor + " and conceding " + row.goalsAgainst + ".";
                cls.answers.setElement(
                    <div>
                        <h1>{question}</h1>
                        <p>{result}</p>
                    </div>
                );
                return true;
            }
            return false;
        });
    }

    interCountry(question, teams, rounds, years) {
        const datum = ParseData.getInternationalPerformanceByCountry(14, years[0]);

        this.answers.setElement(
            <div>
                <h1>{question}</h1>
                <TeamRadarChart data={datum} country={true} ></TeamRadarChart>
            </div>
        );

    }

    allInternational(question, teams, rounds, years) {
        const table = ParseData.getTableData(14, years[0]);
        const datum = table[table.length - 1].getRows();

        this.answers.setElement(
            <div>
                <h1>{question}</h1>
                <TeamRadarChart data={datum} country={false}></TeamRadarChart>
            </div>
        );

        console.log(question);
    }

    international(question, teams, rounds, years) {
        const table = ParseData.getInternationalPerformanceByTeam(14, years[0]);
        const datum = table[table.length - 1].getRows();

        this.answers.setElement(
            <div>
                <h1>{question}</h1>
                <TeamRadarChart data={datum} country={false}></TeamRadarChart>
            </div>
        );
    }

    lineChart(question, teams, rounds, years) {
        const datum = ParseData.getTableData(17, years[0]);

        this.answers.setElement(
            <div>
                <h1>{question}</h1>
                <TheLineChart data={datum}></TheLineChart>
            </div>
        );
    }

    showTable(question, teams, rounds, years) {
        const table = ParseData.getTableData(Number(rounds[0].split(" ")[1]), years[0]);
        const datum = table[table.length - 1].getRows();

        this.answers.setElement(
            <div>
                <h1>{question}</h1>
                <TeamTable data={datum}></TeamTable>
            </div>
        );
    }

    heatMap(question, teams, rounds, years) { //uses teams and years
        const data = ParseData.teamPerformance(App.teams.indexOf(teams[0]));

        console.log(data);

        const datum = Array.from(data.values());

        const allYears : number[] = Array.from(data.keys()).map(Number);

        this.answers.setElement(
            <div>
                <h1>{question}</h1>
                <HeatMap data={datum}></HeatMap>
            </div>
        );
    }

    homeVenues(question, teams: string[]) {
        this.venues(question, teams[0], true);
    }

    awayVenues(question, teams: string[]) {
        this.venues(question, teams[0], false);
    }

    venues(question, team, home) {
        const map: Map<string, {won, played}> = new Map();

        App.years.forEach(year => {
            year.forEach(game => {
                const venue: string = game.get("Venue");
                if (venue.length !== 0 && game.get((home ? "Home Team" : "Away Team")) === team) {
                    const win = ParseData.parseForScore(game, home) > ParseData.parseForScore(game, !home);

                    let results;
                    if (map.has(venue)) {
                        const previous = map.get(venue);
                        results = {
                            played: previous.played + 1,
                            won: previous.won + (win ? 1 : 0)
                        };
                    }
                    else {
                        results = {
                            played: 1,
                            won: (win ? 1 : 0)
                        };
                    }
                    map.set(venue, results);
                }
            });
        });

        const entries: {name, played, won}[] = [];
        map.forEach((v, k) => {
            entries.push({
                name: k,
                played: v.played,
                won: v.won
            });
        });
        entries.sort(Prediction.played);

        this.answers.setElement(
            <div>
                <h1>{question}</h1>
                <Chart data={entries}/>
            </div>
        );
    }

    static played (a, b) {
        if (a.played > b.played) {
            return -1;
        }
        return 1;
    }

    static plural(num) {
        if (num === 1) {
            return "";
        }
        return "s";
    }

    static pluralE(num) {
        if (num === 1) {
            return "";
        }
        return "es";
    }

    static suffix(num: number) {
        const over10 = num % 10;
        const over100 = num % 100;
        if (over10 == 1 && over100 != 11) {
            return num + "st";
        }
        if (over10 == 2 && over100 != 12) {
            return num + "nd";
        }
        if (over10 == 3 && over100 != 13) {
            return num + "rd";
        }
        return num + "th";
    }
}

export default Prediction;