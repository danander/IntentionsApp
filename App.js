import React from 'react';
import _ from 'lodash';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import Text from './src/components/text';
import CreatePlusButton from './src/components/create-plus-button/create-plus-button';
import CreateIntentionPopup from './src/components/create-intention-popup/create-intention-popup';
import EditIntentionPopup from './src/components/edit-intention-popup/edit-intention-popup';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { whiteIcons } from './src/components/iconsObject';
import IntentionBox from './src/components/intention-box';
import OpenSans from './assets/OpenSans-Regular.ttf';
import OpenSansBold from './assets/OpenSans-Bold.ttf';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class App extends React.Component {

  state = {
    isCreating: false,
    intentionsArray: [],
    activeIntentionObject: false,
    activeTimePeriodObject: {key: 'daily', title: 'Daily', message: 'Today, I want to...'},
    isCreatingCustomIntention: false,
    fontsLoaded: false
  };

  createIntention = intentionObject => {
    var newIntentionsArray = [...this.state.intentionsArray, intentionObject];
    this.setState({intentionsArray: newIntentionsArray, isCreating: false, isCreatingCustomIntention: false});
    AsyncStorage.setItem('intentionsArrayString', JSON.stringify(newIntentionsArray))
  };

  updateIntention = updatedIntentionObject => {
    var newIntentionsArray = [...this.state.intentionsArray.filter(intentionObject => intentionObject.id !== updatedIntentionObject.id), updatedIntentionObject];
    this.setState({activeIntentionObject: false, intentionsArray: newIntentionsArray});
    AsyncStorage.setItem('intentionsArrayString', JSON.stringify(newIntentionsArray));
  };

  deleteIntention = () => {
    var newIntentionsArray = this.state.intentionsArray.filter(intentionObject => this.state.activeIntentionObject !== intentionObject)
    this.setState({intentionsArray: newIntentionsArray, activeIntentionObject: false});
    AsyncStorage.setItem('intentionsArrayString', JSON.stringify(newIntentionsArray));
  };

  creatingCustomIntention = () => {
    this.setState({isCreatingCustomIntention: true, isCreating: false})
  };

  async componentDidMount() {
    var intentionsArrayString = await AsyncStorage.getItem('intentionsArrayString');

    if (intentionsArrayString) {
       var intentionsArray = JSON.parse(intentionsArrayString);
       this.setState({intentionsArray: intentionsArray});
    };
    
    this._loadFontsAsync();
    this.schedulePushNotification()
  }

  async _loadFontsAsync() {
    await Font.loadAsync({OpenSans, OpenSansBold});

    this.setState({ fontsLoaded: true });
  }

  async schedulePushNotification() {
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: this.state.activeIntentionMessage,
      },
      trigger: { seconds: this.state.notificationTime },
    });
  }

  render() {

    var timePeriodsArray = [
      {key: 'daily', title: 'Daily', message: 'Today, I want to...'}, 
      {key: 'weekly', title: 'Weekly', message: 'This week, I want to...'}, 
      {key: 'longTerm', title: 'Long-term', message: 'Long-term, I want to...'}
    ];

    if (this.state.fontsLoaded) {
      return (
        <View style = {styles.myApp}>
          {timePeriodsArray.filter(timePeriodObject => timePeriodObject.key === this.state.activeTimePeriodObject.key).map(timePeriodObject => (
            <View style={{flex: 1}}>

              <View style = {{flexDirection: 'row'}}>
                <View style = {styles.timePeriodBar}>
                  <View style = {styles.timePeriodMessageContainer}>
                    <Text style = {styles.timePeriodMessage}>{timePeriodObject.message}</Text>
                  </View>
                  <View style = {styles.plusButtonContainer}>
                    <CreatePlusButton onPress = {() => this.setState({isCreating: true, activeTimePeriodObject: timePeriodObject})}/>
                  </View>
                </View>
              </View>

              <ScrollView style = {styles.intentionsContainer}>
                {this.state.intentionsArray.filter(intentionObject => timePeriodObject.key === intentionObject.timePeriodKey).map(intentionObject => (
                  <IntentionBox
                    text = {intentionObject.title} 
                    source = {whiteIcons[intentionObject.iconKey]} 
                    onPress = {() => this.setState({activeIntentionObject: intentionObject, activeTimePeriodObject: timePeriodObject, id: _.uniqueId('intention') })}/>
                ))}
              </ScrollView>
              
              <View style = {styles.navBarContainer}>
                <View style = {styles.navBar}>
                  {timePeriodsArray.map(timePeriodObject => (
                    <TouchableOpacity onPress = {() => this.setState({activeTimePeriodObject: timePeriodObject})} style = {{...styles.navTimePeriodContainer, backgroundColor: this.state.activeTimePeriodObject.key === timePeriodObject.key ? 'white' : 'transparent'}}>
                      <Text style = {{...styles.navTitle, color: this.state.activeTimePeriodObject.key === timePeriodObject.key ?  '#303A62' : 'white'}}>{timePeriodObject.title}</Text>
                    </TouchableOpacity>
                  ))}
                  </View>
              </View>
            
              {(this.state.activeIntentionObject || this.state.isCreatingCustomIntention) && (
                <EditIntentionPopup 
                  timePeriodObject = {timePeriodObject} 
                  activeIntentionObject = {this.state.activeIntentionObject} 
                  updateIntention = {this.updateIntention} 
                  deleteIntention = {this.deleteIntention} 
                  createIntention = {this.createIntention} 
                  intentionsArray = {this.state.intentionsArray} 
                  isCreatingCustomIntention = {this.state.isCreatingCustomIntention} 
                  activeTimePeriodObject = {this.state.activeTimePeriodObject} 
                  onClose = {() => this.setState({activeIntentionObject: false, isCreatingCustomIntention: false})} />
                  )}
              {/* to show one of the three create intention popups */}
              {this.state.isCreating && this.state.activeTimePeriodObject.key === timePeriodObject.key && (
                <CreateIntentionPopup createIntention = {this.createIntention} onClose = {() => this.setState({isCreating: false})} timePeriodObject = {timePeriodObject} creatingCustomIntention = {this.creatingCustomIntention}/> 
                )}
            </View>
          ))}
        </View>
      );
    } else {
      return <View/>;
    }
  }
}

const styles = StyleSheet.create({

  myApp: {
    backgroundColor: '#303A62',
    fontFamily: 'OpenSans',
    flex: 1
  },

  timePeriodBar: {
    borderRadius: 50,
    backgroundColor: 'rgba(255,251,251, .1)',
    borderTopRightRadius: 0,
    borderBottomRightRadius:0,
    marginLeft: 28,
    flexDirection: 'row',
    height: 60, 
    alignItems: 'center',
    marginTop: 99,
    flex: 1
  },  

  timePeriodMessage: {
    paddingLeft: 25,
    fontSize: 23,
    fontWeight: 'bold',
    color: '#fff',
  },

  timePeriodMessageContainer: {
    flex: 1
  },

  plusButtonContainer: {
    width: 55
  },

  intentionsContainer: {
    flex: 1
  },

  intentionTitleBox: {
    marginLeft: '15%', 
    flexDirection: 'row',
    backgroundColor: 'rgba(255,251,251, .1)',
    marginRight: 23,
    height: 50,
    justifyContent: 'center',
    marginTop: 21,
    padding:10,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },

  icon: {
    width: 32,
    height: 32,
    marginLeft: 12,
    marginRight: 30
  },

  userIntentionTitle: {
    fontSize: 20,
    color: 'white',
    flex: 1,
  },

  navBarContainer: {
    flexDirection: 'row'
  },

  navBar: {
    height: 40,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginBottom: 51,
    flex: 1,
    marginRight: 17,
    backgroundColor: 'rgba(255,251,251, .1)',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end'
  },

  navTimePeriodContainer: {
    width: 120,
    backgroundColor: 'black',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  }
});






























// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
// <View style={{
//   marginTop: 80,
//   paddingLeft: 35,
//   height: 100,
//   borderBottom: 'solid',
//   flex: 1, 

// }}>
//     <Text style = {{
//       textTransform: 'uppercase',
//       fontWeight: 'bold',
//       fontSize: 18
//     }}>
//         My intentions
//     </Text>
    
// </View>



    // <View style={styles.container}>
    //  <View style = {{width:10, height: 10, backgroundColor: 'pink'}}></View>
    //   <Text>Open up Dana.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
//   );
// }

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

