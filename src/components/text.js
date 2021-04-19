import React from 'react';
import {Text as RnText} from 'react-native';

export default function Text(props) {
  return (
    <RnText style = {{...props.style, fontFamily: props.style && props.style.fontWeight === 'bold' ? 'OpenSansBold' : 'OpenSans'}}>{props.children}</RnText>
  );
}
