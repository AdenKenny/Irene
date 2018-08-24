import * as React from 'react';
import './App.css';

import DatabaseModule from './Modules/DatabaseModule';
import MainPage from './MainPage';
import ParseData from './Util/ParseData';
import ReactDOM from 'react-dom';

import Prediction from './Components/Prediction/Prediction';
import TeamTable from './Components/TeamTable/TeamTable';
import TeamRadarChart from './Components/RadarChart/TeamRadarChart';

class App extends React.Component {
  
  static teams: string[];
  static yearNames: string[];
  static rounds: number;
  static years: Map<string, any>;
  //static stadiums: Map<string, string>;

  static mainPage: JSX.Element;

    componentDidMount() {
        document.title = "Irene by SWAG"; // Set the page title.
    }

  constructor(props, state) {
    super(props, state);
    const db: DatabaseModule = new DatabaseModule();

    App.teams = ["Central Pulse", "Northern Mystics", "Waikato Bay of Plenty Magic", "Southern Steel", "Canterbury Tactix", // New Zealand teams.
                  "New South Wales Swifts", "Adelaide Thunderbirds", "Melbourne Vixens", "West Coast Fever", "Queensland Firebirds"]; // Aus teams.
    App.rounds = 13;
    App.yearNames = ["2008", "2009", "2010", "2011", "2012", "2013"]; // The years we're worried about.

    DatabaseModule.readFromDb().then(years => {
        App.years = years;
    });

    this.state = {
        element: (<div></div>)
    };
    
  }
  
  public render(): JSX.Element {
    return MainPage.getPage();;
  }

}

export default App;