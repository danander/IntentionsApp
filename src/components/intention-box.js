import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Text from './text';

export default function IntentionBox(props) {
  return (
    <TouchableOpacity onPress = {props.onPress} style = {{...styles.intentionTitleBox, backgroundColor: props.isWhite ? 'rgba(250, 250, 250, .95)' : 'rgba(255,251,251, .1)'}}>
      <Image source={props.source} style = {styles.icon}/>
      <Text style = {{...styles.text, color: props.isWhite ? '#303A62' : 'white'}}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = {

  intentionTitleBox: {
    marginLeft: 45, 
    flexDirection: 'row',
    backgroundColor: 'rgba(255,251,251, .1)',
    marginRight: 45,
    minHeight: 62,
    marginTop: 20,
    padding:15,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    paddingRight: 20
    },

  whiteIntentionTitleBox: {
    marginLeft: 45, 
    flexDirection: 'row',
    backgroundColor: 'white',
    marginRight: 45,
    height: 55,
    marginTop: 20,
    padding:10,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    }, 

  icon: {
    width: 29,
    height: 29,
    marginLeft: 10,
  },

  text: {
    fontSize: 20,
    flex: 1,
    marginLeft: 20,
    fontWeight: 'bold'
  },

  blueText: {
    fontSize: 20,
    color: '#303A62',
    flex: 1,
    marginLeft: 20,
    fontWeight: 'bold'
  }
};
