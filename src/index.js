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
      {/* <div className='tile'></div> */}
      <Tooltip 
        message={this.props.value.region} 
        position={ this.props.value.column > 10 ? "left" : "right" } 
        regnum={regnum}
        currency={this.props.value.currency}>

        <div 
          className='regAbbr' 
          style={{color: bin == "b6" | bin == "b5" ? "#E2E2E6" : "#3E3E59"}}
        >
          {this.props.value.reg_abbr}
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

class Chart extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        defyear: startYear,
        data: data.data,
      };
  }

  renderLegend(year) {
      return <Legend value={year} />
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
      </div>
  )}

  handleChange(event) {
    this.setState({defyear: event.target.value});
  }

  render() {
      return (
          <div id="container"> 
            <h1>Валовой региональный продукт <br /> на душу населения</h1>
            {this.renderTiles(this.state.defyear)}
            {this.renderLegend(this.state.defyear)}
            <input
              id='input'
              type='range'
              min={startYear} max='2019'
              onChange={(event) => this.handleChange(event)}
            step='1'/>
          </div>
      );
}}

ReactDOM.render(<Chart />, document.getElementById("root"));
