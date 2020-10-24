import React from 'react';
import ReactDOM from 'react-dom';
import Files from "react-files";
import './index.css';

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Instructions: this.props.value,
            result: []
        }
    }
    renderTableData=  () => { //render values from result
        return this.state.result.map(value=> {
            return (
                <tr>
                    <td>{value.step}</td>
                    <td>{value.roombaLocation[0]} , {value.roombaLocation[1]}</td>
                    <td>{value.action}</td>
                    <td>{value.ttlDirtCollected}</td>
                    <td>{value.ttlWallHits}</td>
                
                </tr>
                )
        })
    }
    render() { //process steps and save results to Instructions
        //console.log(this.state.Instructions);
        var roomDimensions= this.state.Instructions.roomDimensions;
        var initialRoombaLocation= this.state.Instructions.initialRoombaLocation;
        var dirtLocations= this.state.Instructions.dirtLocations;
        var drivingInstructions = this.state.Instructions.drivingInstructions;
        //var result = [];
            
        const eastWall = roomDimensions[0];
        const southWall = roomDimensions[1];
        var currRoombaLocation = initialRoombaLocation;
        var wallHits = 0;
        var dirtCollected = 0;
        var distanceTraveled =0;
        
        function getIndex(loc){
            return dirtLocations.findIndex(obj => obj[0] === loc[0] && obj[1] === loc[1])
        }
        
        var initialIndexOfDirt = getIndex(currRoombaLocation); //check if start on dirt
            if(initialIndexOfDirt !== -1){
                dirtCollected++;
                dirtLocations.splice(initialIndexOfDirt,1);
        }
        
        this.state.result.push({step: 1, roombaLocation: [currRoombaLocation[0], currRoombaLocation[1]], action: " ", ttlDirtCollected: dirtCollected, ttlWallHits: 0}); //create the initial row
        //console.log(result);
        
        for(let i = 0; i<drivingInstructions.length; i++){
            
            var currentInstruction = drivingInstructions[i].toUpperCase(); //standardize for minor typos
            var previous = [currRoombaLocation[0],currRoombaLocation[1]];
            //console.log(currRoombaLocation);
            switch(currentInstruction) {
                case "N":
                    currRoombaLocation[1]++;
                    break;
                case "S":
                    currRoombaLocation[1]--;
                    break;
                case "W":
                    currRoombaLocation[0]--;
                    break;
                case "E":
                    currRoombaLocation[0]++;
                    break;
                default:
                    console.log("Invalid Direction");
            }
            
            if(currRoombaLocation[0]<0 || currRoombaLocation[0] >= eastWall || currRoombaLocation[1]<0 || currRoombaLocation[1] >= southWall){ //check if hit wall
                currRoombaLocation = previous;
                wallHits ++;
            }
            else{
                distanceTraveled++;
            }
            var indexOfDirt = getIndex(currRoombaLocation); //check if moved to dirt
            if(indexOfDirt !== -1){
                dirtCollected++;
                dirtLocations.splice(indexOfDirt,1);
            }
            this.state.result.push({step: i+2, roombaLocation: [currRoombaLocation[0], currRoombaLocation[1]], action: currentInstruction, ttlDirtCollected: dirtCollected, ttlWallHits: wallHits, ttlDistanceTraveled: distanceTraveled}); //save iteration
            //console.log(result);
        }
        console.log(this.state.result);
        
        return (
            <div>
            <table>
                <tr>
                    <th>Step</th>
                    <th>Roomba Location</th>
                    <th>Action</th>
                    <th>Total Dirt Collected</th>
                    <th>Total Wall Hits</th>
                </tr>
            {this.renderTableData()}
            </table>
            <p>Final Position: {currRoombaLocation[0]} , {currRoombaLocation[1]}</p>
            <p>Total Dirt Collected: {dirtCollected} </p>
            <p>Total Distance Traveled: {distanceTraveled} </p>
            <p>Total Wall Hits: {wallHits} </p>
        </div>
    );
    }
}

class JSONButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonFile: {},
            fileSent: false
            
        };

        this.fileReader = new FileReader();
        this.fileReader.onload = event => {
        this.setState({ jsonFile: JSON.parse(event.target.result) }, () => {
        //console.log(this.state.jsonFile);
        this.setState({fileSent: true});
      });
    };
  }
    
  renderTable() {
      return <Table value={this.state.jsonFile} />;
  }
    
  render() {
    return (
    <React.Fragment>
      <div className="files">
        <Files
          className="files-dropzone"
          onChange={file => {
            this.fileReader.readAsText(file[0]);
          }}
          onError={err => console.log(err)}
          accepts={[".json"]}
          multiple
          maxFiles={1}
          maxFileSize={10000000}
          minFileSize={0}
          clickable
        >
          Drop files here or click to upload
        </Files>
      </div>
    {
        this.state.fileSent?
        <div className ="Table">
            {this.renderTable()}
        </div>
        :
        <div></div>
    }
    </React.Fragment>
    );
  }
}

// ==================================
ReactDOM.render(
    <JSONButton />, document.getElementById('root')
);