import React from 'react';
import _ from 'lodash';
import { View, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from './edit-intention-popup.styles';
import Popup from '../popup';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { whiteIcons } from '../iconsObject';
import whiteRecurIcon from '../../../icons/whiteRepeat.png';
import greyRecurIcon from '../../../icons/greyRepeat.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import Text from '../text';

export default class EditIntentionPopup extends React.Component {
  state = {
    updatedIntentionTitle: this.props.activeIntentionObject.title,
    editingIntentionTitle: false,
    createIntentionTitle: '',
    notificationTitle: '',
    enableTimePicker: false,
    date: new Date(),
  }
  
  render() {
    console.log(this.state);
    
    return(
      <Popup onClose = {this.props.onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style = {{flex: 1}}> 
            <View> 
              <View style = {styles.closeContainer}>
                <View style = {styles.close}>
                  <AntDesign name="close" size={30} color="white" style = {styles.closeButton} onPress = {this.props.onClose} />
                </View>
                <View style = {styles.trash}>
                  <EvilIcons name="trash" size={38} color="white" onPress = {() => this.props.deleteIntention(this.props.activeIntentionObject)}/>
                </View>
              </View>

              {this.props.isCreatingCustomIntention ? (
                <TextInput 
                  style = {styles.customTitle}
                  placeholder= {this.props.timePeriodObject.message}
                  placeholderTextColor = 'rgba(255,251,251, .4)'
                  value = {!this.state.editingIntentionTitle ? this.props.activeIntentionObject.title : this.state.updatedIntentionTitle}
                  onChangeText = {(text) => this.setState({createIntentionTitle: text, updatedIntentionTitle: text, editingIntentionTitle: true})} 
                  returnKeyType = 'done'
                />
              ) : (
                <TextInput 
                  style = {styles.activeIntentionTitle}
                  value = {!this.state.editingIntentionTitle ? this.props.activeIntentionObject.title : this.state.updatedIntentionTitle} 
                  onChangeText = {(text) => this.setState({updatedIntentionTitle: text, editingIntentionTitle: true})} 
                  returnKeyType = 'done'
                />
              )}

              <View style = {styles.contentRow}>
                <View style = {styles.iconContainer}>
                  <TouchableOpacity style = {styles.smallBox}>
                    <Image source = {whiteIcons[this.props.activeIntentionObject.iconKey] || whiteIcons.mood} style = {styles.icon}/>
                  </TouchableOpacity>
                  <Text style = {styles.text}>icon</Text>
                </View>

                <View style = {styles.recurringContainer}>
                  <TouchableOpacity style = {styles.smallBox}>
                      <Image source = {whiteRecurIcon} style = {styles.recurIcon}/>
                    </TouchableOpacity>
                    <Text style = {styles.text}>recurring</Text>
                </View>
              </View>

              <View style = {styles.remindersContainer}>
                <Text style = {{color: 'white', fontSize: 18}}>Reminders</Text>

                <View style = {styles.reminderBox}>

                  <TouchableOpacity style = {{marginLeft: 15, flex: 1}}>
                    <TextInput
                      style = {styles.addReminderText}
                      placeholder = 'Add a reminder'
                      placeholderTextColor = 'rgba(48, 58, 98, .6)'
                    />
                  </TouchableOpacity>

                  <View style = {{justifyContent: 'flex-end', marginRight: 15, flexDirection: 'row', flex: 1}}>
                  {this.state.enableTimePicker ? (
                    <DateTimePicker 
                      style = {{width: 90}}
                      value={this.state.date}
                      mode='time'
                      display='default'
                      onChange={(event, date) => this.setState({date:date})}
                      />
                    ) : (
                      <TouchableOpacity onPress = {() => this.setState({enableTimePicker: true})}>
                        <Text style = {styles.addReminderText}>Add a time</Text>
                      </TouchableOpacity>
                    )
                  } 
                  </View>
                </View>
              </View>
            </View>

            <View style = {{height: '100%', alignItems: 'flex-end', justifyContent: 'center'}}>
              <TouchableOpacity onPress = {() => {
                if (this.props.isCreatingCustomIntention) {
                  this.props.createIntention({
                    title: this.state.createIntentionTitle, 
                    timePeriodKey: this.props.timePeriodObject.key, 
                    id: _.uniqueId('intention'), 
                    iconKey: 'mood'
                  });
                }
                else {
                  this.props.updateIntention({
                    title: this.state.updatedIntentionTitle, 
                    timePeriodKey: this.props.activeTimePeriodObject.key, 
                    id: this.props.activeIntentionObject.id, 
                    iconKey: this.props.activeIntentionObject.iconKey
                  });
                }
              }}>
                <AntDesign style = {{marginRight: 35, marginBottom: 15}} name="pluscircle" size={55} color="white" />
              </TouchableOpacity>
            </View>
                
          </View>
        </TouchableWithoutFeedback>
      </Popup>
    );
  }
}
  


