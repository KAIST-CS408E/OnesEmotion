import React from 'react';
import { View } from 'react-native';
import nlp from './utils/nlp.js';

export default class App extends React.Component {
  constructor() {
    super();
  }
  
  componentDidMount() {
    nlp.meaningless("만 6세 이하의 유치원생")
  }

  render() {
    return (<View/>);
  }
}
