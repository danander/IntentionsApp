import React from 'react';
import { View, Modal} from 'react-native';

export default class Popup extends React.Component {
  render() {
    return(
      <Modal transparent>
        <View style={styles.popup}>
            {this.props.children}
        </View>
      </Modal>
    );
  }
}

var styles = {
  popup: {
  flex: 1,
  height: '100%',
  backgroundColor: '#303A62'
  }
};