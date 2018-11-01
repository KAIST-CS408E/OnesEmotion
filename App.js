import React from 'react';
import { View } from 'react-native';
import nlp from './utils/nlp.js';

export default class App extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    nlp.nounNumber("안녕하세요.");
  }

  render() {
    return (<View/>);
  }
}
