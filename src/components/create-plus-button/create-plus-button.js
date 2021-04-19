import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './create-plus-button.styles';

export default function CreatePlusButton(props) {
  return (
    <TouchableOpacity style={styles.plusButton} onPress={props.onPress}>
      <Text style={{fontSize: 34, position: 'relative', top: -6, left: 1}}>+</Text>
    </TouchableOpacity>
  );
}