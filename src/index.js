import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data from './data.json';

const colors = {
  "b0": "#E2E2E6",
  "b1": "#f2e7fe",
  "b2": "#dfc5ff",
  "b3": "#caa3ff",
  "b4": "#b381ff",
  "b5": "#985eff",
  "b6": "#673ab7"
};

const startYear = 1998;

function numberWithCommas(x) {

  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  } else {
    return ""
  }
}

class Tooltip extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      displayTooltip: false
    }
    this.hideTooltip = this.hideTooltip.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
  }
  
  hideTooltip () {
    this.setState({displayTooltip: false})
    
  }
  showTooltip () {
    this.setState({displayTooltip: true})
  }

  render() {
    let message = this.props.message,
        position = this.props.position,
        regnum = this.props.regnum,
        currency = this.props.currency;
    return (
      <span className='tooltip'
          onMouseLeave={this.hideTooltip}
        >
        {this.state.displayTooltip &&
        <div className={`tooltip-bubble tooltip-${position}`}>
          <div className='tooltip-message'><b>{message}</b> <br /> {regnum} {currency}</div>
        </div>
        }
        <span 
          className='tooltip-trigger'
          onMouseOver={this.showTooltip}
          >
          {this.props.children}
        </span>
      </span>
    )
  }
}

class Tile extends React.Component {
  render() {
  
  let bin = "b"+this.props.value.bins,
      regnum = numberWithCommas(this.props.value.value);

  return (
    <div
        style={{
            gridColumnStart: this.props.value.column,
            gridColumnEnd: this.props.value.column+1,
            gridRowStart: this.props.value.row,
            gridRowEnd: this.props.value.row+1,
            backgroundColor: colors[bin]
        }}
    >
      
      <Tooltip 
        message={this.props.value.region} 
        position={ this.props.value.column > 10 ? "left" : "right" } 
        regnum={regnum}
        currency={this.props.value.currency}>

        <div className='tile'>
          <div 
            className='regAbbr' 
            style={{color: bin === "b6" | bin === "b5" ? "#E2E2E6" : "#3E3E59"}}
          >
            {this.props.value.reg_abbr}
          </div>
        </div>

      </Tooltip>
    </div>
    );
}}

class Legend extends React.Component {
  render() {
  return (
    <div id="legend">
      {Object.keys(colors).slice(1,).map((d, i) => {
          let num = data.legend[this.props.value][i+1].value;

          return (
              <div style={{backgroundColor: colors[d]}}>
                <div className="legendTile">
                  {numberWithCommas(num)}
                </div>
              </div>
          )
      })}
    </div>
    );
}}

class Map extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        data: data.data
      };
  }

  renderTile(d) {
    return <Tile value={d} />;
  }

  renderTiles(year) {
    return (
      <div id="maprf">
        {this.state.data[year].map((d, _) => {
          return (
              this.renderTile(d)
          )
        })}
        <div id='bigNumber'>
          <h1>{year}</h1>
        </div>
      </div>
  )}

  render() {
    return(
      this.renderTiles(this.props.year)
    )
  }

}

function GetMap(props) {
  return (
    <div id="container">
      <Map year={props.year} />
    </div>
  )
}

class Chart extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        defyear: startYear,
        data: data.data,
        years: Array.from({ length: 2019 - startYear + 1 }, (_, i) => i+startYear)
      };
  }

  renderLegend(year) {
      return <Legend value={year} />
  }

  renderTiks(years) {
    return (
      years.map((d, i) => {
        if (i===0 | i===years.length-1) {
          return ( <p>{d}</p> )
        } else {
          return ( <p>'</p> )
        }
      })
    )
  }

  handleChange(event) {
    this.setState({defyear: event.target.value});
  }

  render() {
      return (
          <div id="mainContainer">
            <h1>Валовой региональный продукт <br /> на душу населения</h1>
            <GetMap year={this.state.defyear} />
            {this.renderLegend(this.state.defyear)}
            <div id='inputContainer'>
            <input
              id='input'
              type='range'
              min={startYear} max='2019'
              value={this.state.defyear}
              list="steplist"
              onChange={(event) => this.handleChange(event)}
            step='1'/>
            <div className="sliderticks" id="sliderticks">
                {this.renderTiks(this.state.years)}
            </div>
            </div>
          </div>
      );
}}

ReactDOM.render(<Chart />, document.getElementById("root"));
