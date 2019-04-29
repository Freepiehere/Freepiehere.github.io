import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    State_Crime:[]
  }
  componentDidMount() {
    this.getStateCrime();
  }

  getStateCrime = _ => {
    axios.get('/State_Crime')
    .then((data) => {
      console.log(data.data.State_Crime)
      //Error on this line: Undefined: State_Crime
      this.setState({State_Crime: data.data.State_Crime});
    })
    // .then(({response}) => this.setState({users: response.users}))
    .catch(error => console.log(error));
  }
  showStateCrime = crime_stat => <div> key={crime_stat.State}>{crime_stat.Violent_Crime_rate}</div>

  render()  {
    const { State_Crime } = this.state;
    return (
      //Error on this line: TypeError: State_Crime.map is not a function
      <div className="App">
        
        {State_Crime.map(this.showStateCrime)}
      </div>
    );
  }
}

export default App;
