import React from 'react';
import { shape, number, string } from 'prop-types';

export function fakeCheckIfOnlineAjax(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(id % 2 === 0); // "return" a boolean
    }, 1000);
  });
}

// ONLINE STATUS
// 0- discuss the constructor and the render method
// 1- implement a setOnlineStatus method to update state.isOnline
// 2- implement componentDidMount to setOnlineStatus
// 3- check if online status updates correctly when changing friends
// 4- implement componentDidUpdate to setOnlineStatus when friend changes
// 5- finish up componentDidUpdate comparing old props with new props
// 6- show to avoid componentDidUpdate altogether using a key
// 7- demonstrate componentWillUnmount
// REFRESH BUTTON
// 1- implement refresh with componentWillReceiveProps
// 2- refactor to use only componentDidUpdate
// 3- refactor to use a key combining friend.id and a random id
export default class Friend extends React.Component {
  constructor(props) {
    /*
    WHAT CAN YOU GENERALY DO INSIDE THE CONSTRUCTOR:
    Initialize state
    Initialize variables
    Bind methods

    DON'T DO - setState!
    */

    console.log('constructor of Friend runs!');

    super(props);
    this.state = {
      isOnline: props.isOnline,
    };
  }

  componentDidMount() {
    console.log('componentDid-MOUNT run and called setState');
    fakeCheckIfOnlineAjax(this.props.friend.id)
      .then(data => this.setState({ isOnline: data }));
  }

  componentDidUpdate(prevState) {
    /*
    Inside componentDidUpdate you CAN NOT run UNCONDITIONAL setState,
    because it creates infinite loop (didUpdate - render - didUpdate -...)

    fakeCheckIfOnlineAjax(this.props.friend.id)
      .then(data => this.setState({ isOnline: data }));

    THIS is what would you get in CONSOLE:
      constructor of Friend runs! 				            Friend.jsx:36:4
      Render run 						                          Friend.jsx:86:4
      componentDid-MOUNT run and called setState 		  Friend.jsx:45:4
      Render run 						                          Friend.jsx:86:4
      componentDid-UPDATE run and called setState 		Friend.jsx:63:4
      Render run 						                          Friend.jsx:86:4
      componentDid-UPDATE run and called setState 		Friend.jsx:63:4
      Render run 						                          Friend.jsx:86:4
      componentDid-UPDATE run and called setState 		Friend.jsx:63:4
      Render run 						                          Friend.jsx:86:4
      componentDid-UPDATE run and called setState 		Friend.jsx:63:4
      Render run

    That's why you need  to add a condition to check previous State.
    componentDidUpdate takes prevState as an argument

    */
    const hasFriendChanged = prevState.friend.id !== this.props.friend.id;
    console.log('componentDid-UPDATE run and called setState');

    if (hasFriendChanged) {
      fakeCheckIfOnlineAjax(this.props.friend.id)
        .then(data => this.setState({ isOnline: data }));
    }
  }

  componentWillUnmount() {
    console.log('Friend is about to unmount');
  }

  render() {
    /*
    WHAT CAN YOU GENERALY DO INSIDE THE RENDER METHOD:
    Return JSX
    It is meant to be a pure function = have no side effect

    DON'T DO:
    setState!!! = INFINITE LOOP - setState calls render method and render method will update state
    Dont create side-effects

    */
    console.log('Render run');

    const { isOnline } = this.state;
    const { friend } = this.props;

    return (
      <div>
        <h3>{friend.name}</h3>

        <div style={{ color: isOnline ? 'green' : 'red' }}>
          is {!isOnline && 'NOT '}online
          {isOnline && ' :)'}
        </div>
      </div>
    );
  }
}

Friend.propTypes = {
  friend: shape({
    id: number.isRequired,
    name: string.isRequired,
  }).isRequired,
};
