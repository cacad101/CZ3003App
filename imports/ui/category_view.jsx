import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import {IncidentType_db} from '../api/incidentType.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'
import IncidentType from './incidentType.jsx';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class Category extends TrackerReact(React.Component) {

  constructor() {
    super();
    const subscription = Meteor.subscribe('incidentType', {onReady: function() {
      this.setState({
        ready: userSubscription.ready() && userAuxSubscription.ready() && subscription.ready()
      })
    }.bind(this)});

    const userSubscription = Meteor.subscribe('userData',{onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready() && subscription.ready()
        });
      }.bind(this)});

      const userAuxSubscription = Meteor.subscribe('userAux', {onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready() && subscription.ready()
        })
      }.bind(this)})

    this.state = {
      userID : Meteor.userId(),
      ready : userSubscription.ready() && userAuxSubscription.ready() && subscription.ready(),
      subscription: subscription
    }
  }

  renderIncidentTypes() {
    if(this.state.ready && !!this.state.userID) {
      return this.props.incidentType_data.map((incidentType_data) => (
        <IncidentType key={incidentType_data._id} incidentType={incidentType_data} userID={this.state.userID}/>
      ));
    }
  }

  componentWillUnmount() {
    this.state.subscription.stop();
  }

  editFormatter(cell, row, UserID){
    return  <div>
              <button className="subscribe"onClick={function() {
                Meteor.call('incidentType.addSubscriber', cell, UserID)
                alert("Subscribed!")
                console.log("WHAAAT", row.subscribers);
              }} >SUBSCRIBE</button>
              <Link to = {`/category/${cell}/0`} activeClassName="active"><button >Edit</button></Link>
              <button className="delete" onClick={function() {
                IncidentType_db.remove(cell);
              }} >Delete</button>
            </div>;
  }

  render() {
    //  {this.state.ready ? this.renderIncidentTypes() : null}
    categoryData = this.props.incidentType_data;
    console.log("ASS", categoryData);
    return (<div>
              <BootstrapTable data={categoryData} striped={true} hover={true} pagination={true} search={true}>
                <TableHeaderColumn dataField="_id" isKey={true} hidden={true}>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="name" dataSort={true}>Category Name</TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataSort={true}>Description</TableHeaderColumn>
                <TableHeaderColumn dataField="_id" dataFormat={this.editFormatter} formatExtraData={this.state.userID}>Action</TableHeaderColumn> 
              </BootstrapTable>         
            </div>);
  }
};


export default createContainer(({params}) => {
  const incidentType_data = IncidentType_db.find({}).fetch();
  const category_id = params.incidentType_id;
  return {        
         incidentType_data,
         category_id,
       };
}, Category);