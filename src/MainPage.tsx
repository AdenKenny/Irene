import React, { Component } from 'react';
import App from './App';

import logo from './Assets/netball.png';

import './MainPage.css';

import Prediction from './Components/Prediction/Prediction';
import StatisticsModule from './Modules/StatisticsModule';
import DatabaseModule from './Modules/DatabaseModule';
import ParseData from './Util/ParseData';
import Intro from './Components/Intro/Intro';
import FadeText from './Components/FadeText/FadeText';
import Answers from './Components/Answers/Answers';

class MainPage {
  static getPage(): JSX.Element {
    
    return <div className="MainPage">
      <header className="App-header">
        <img src={logo} className="Logo" />
        <h1 className="App-title">Irene</h1>
      </header>
      <div className="Intro">
          <Prediction/>
      </div>
    </div>
  }

  // Lets check to see if teams have mean scores that are statistically different. 
  static doStats(): void {

    const teams: string[] = App.teams; // Get the names of the teams.
    let n = teams.length; // The number of teams.

    let teamScores: number[][] = []; // Let's hold the team scores.

    const year = "2011";

    for (let i = 0; i < n; ++i) {
        teamScores.push(ParseData.getGoalsScored(i, year)); // Stick the data in the array.
        
        let total: number = 0;

        ParseData.getGoalsScored(i, year).forEach(e => {
            total += e;
        });

        console.log(teams[i] + " scored " + total + " goals in total");
    }

    let normallyDistributed: number[][] = []; // We'll put all the values we want here.
    let normallyDistributedTeams: string[] = []; // Store the names of teams.
    const alpha: number = 0.05; // Our confidence interval. 5% as a standard.

    for (let i = 0; i < n; ++i) { // Test for normality of scores. Is an assumption of ANOVA.
      const result: any = StatisticsModule.shapiroWilk(teamScores[i]); // Shapiro-Wilk test.
      if (result.p > alpha) { // Scores are normally distributed.
        normallyDistributed.push(teamScores[i]);
        normallyDistributedTeams.push(teams[i]);
      }
    }

    n = normallyDistributed.length; // Update the length, we're using the length of the normally distributed.

    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
        if (i !== j) {
          const samples = [normallyDistributed[i], normallyDistributed[j]];
          const levenes = StatisticsModule.levene(samples); // Levene's test. Tests variance which is an ANOVA assumption.
          if (levenes.pVal > alpha) { // The two teams have equal variance.
            const anova = StatisticsModule.anova(samples); // We can now do an ANOVA.
            if (anova.pVal < alpha) { // Statistically significant.
              console.log("Statistically significant difference in mean goals scored between " + normallyDistributedTeams[i] + " and " + normallyDistributedTeams[j]);
            }

            else { // Statistically insignificant.
              //console.log("Statistically insignificant difference in mean goals scored between " + normallyDistributedTeams[i] + " and " + normallyDistributedTeams[j]);
            }
          }

          else { // Variances are not equal. We need Brown-Forsythe's test, ANOVA won't work.
            const pVal = StatisticsModule.brownForsythe(samples); // Brown-Forsythe test is acceptable.
            if (pVal < alpha) {
              console.log("Statistically significant difference in mean goals scored between " + normallyDistributedTeams[i] + " and " + normallyDistributedTeams[j]);
            }

            else {
              //console.log("Statistically insignificant difference in mean goals scored between " + normallyDistributedTeams[i] + " and " + normallyDistributedTeams[j]);
            }
          }
        }
      }
    }
  }
}
export default MainPage;