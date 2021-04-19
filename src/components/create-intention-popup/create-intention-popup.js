import React from 'react';
import _ from 'lodash';
import { View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import styles from './create-intention-popup.styles';
import CreatePlusButton from '../create-plus-button/create-plus-button';
import Popup from '../popup';
import { whiteIcons, blueIcons } from '../iconsObject';
import IntentionBox from '../intention-box';
import Text from '../text';

var categories = {
  daily: {
    sleep: {title: 'Sleep', intentionTitles: ['Get to bed early', 'Stop eating three hours before bed', 'Meditate before bed']},
    movement: {title: 'Movement', intentionTitles: ['Move for a half hour', 'Do 20 minutes of yoga', 'Go for a run']},
    mindfulness: {title: 'Mindfulness', intentionTitles: ['Meditate for 10 minutes', 'Notice how my body feels', 'Take a walk without my cell phone']},
    screenTime: {title: 'Screen Time', intentionTitles: ['Limit social media to a half hour', 'No screens past 9 PM', 'Read before bed instead']}, 
    productivity: {title: 'Productivity', intentionTitles: ['Stretch every hour for 5 minutes', 'Focus on one task at a time', 'Turn off notifications']},
    food: {title: 'Food', intentionTitles: ['Eat one meal with no distractions', 'Notice how my food tastes and feels throughout the meal', 'Get enough protein']}
  },
  weekly: {
    sleep: {title: 'Rest', intentionTitles: ['Get 8 hours of sleep every night', 'Feel rested', 'Do something relaxing every night']},
    movement: {title: 'Movement', intentionTitles: ['Move for 30 minutes every day', 'Feel energized', 'Do a different kind of movement this week']},
    mindfulness: {title: 'Mindfulness', intentionTitles: ['Meditate every day for ten minutes', 'Eliminate distractions', 'Be more present with my kids']},
    screenTime: {title: 'Screen Time', intentionTitles: ['Keep screen time to a minimum', `No screens before bed`, 'Charge my phone in a different room']},
    productivity: {title: 'Productivity'},
    food: {title: 'Food'}
  }, 
  longTerm: {
    occupation: {title: 'Occupation', intentionTitles: ['Help others', 'Have a meaningful career', 'Create something of value']},
    connections: {title: 'Connections', intentionTitles: ['Be appreciative of my loved ones', 'Take care of my family', 'Create community']},
    mood: {title: 'Mood', intentionTitles: ['Be happy', 'Be positive', 'Cultivate peace in my life']},
    experience: {title: 'Experience', intentionTitles: ['Travel the world', 'Step out of my comfort zone', 'Do things that scare me', 'Do things that future me would be proud of'] },
    health: {title: 'Health', intentionTitles: ['Live a long life', 'Feel good in my skin', 'Live an active life']},
    milestones: {title: 'Milestones', intentionTitles: ['Run a 10k', 'Have kids', 'Start a business' ]}
  }
};

export default class CreateIntentionPopup extends React.Component {
  state = {
    activeCategory: false,
    activeCategoryKey: 'mindfulness'
  }

  render() {
    var categoriesEntriesArray = Object.entries(categories[this.props.timePeriodObject.key]);
    
    return(
      <Popup>
        {this.state.activeCategory ? (
          <View>
            <View style = {styles.categoryContainer}>
              <TouchableOpacity>
                <AntDesign name="leftcircleo" size={26} color="#303A62" style={{marginLeft: 7}} onPress = {() => this.setState({activeCategory:undefined})}/>
              </TouchableOpacity>
              <Text style = {styles.categoryText}>{this.state.activeCategory.title}</Text>
            </View>

            {this.state.activeCategory.intentionTitles.map(intentionTitle => ( 
              <IntentionBox text= {intentionTitle}
                source = {whiteIcons[this.state.activeCategoryKey]}
                onPress = {() => {
                  this.props.createIntention({
                    title: intentionTitle,
                    timePeriodKey: this.props.timePeriodObject.key,
                    id: _.uniqueId('intention'), 
                    iconKey: this.state.activeCategoryKey
                  });
                }}
              />
            ))}
          </View>
        ) : (
          <View> 
            <View style = {styles.closeContainer}>
              <AntDesign name="close" size={30} color="white" style = {styles.closeButton} onPress = {this.props.onClose} />
            </View>

            <TouchableOpacity>
              <View style= {styles.createButtonContainer}>
                <Text style = {styles.createButtonText}>Create an intention</Text>
                <View style = {styles.plusButton} >
                  <CreatePlusButton onPress = {() => this.props.creatingCustomIntention()}/>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.chooseContainer}>
              <View>
                <Text style={styles.chooseText}>or choose from a category below</Text>
                <View style = {styles.lineContainer}>
                  <View style = {styles.line} />
                </View>
              </View>  
            </View>

            {categoriesEntriesArray.map(([key, category], index) => (
              <IntentionBox 
                isWhite = {true} 
                key = {index} 
                source = {blueIcons[key]}  
                text = {category.title} 
                onPress={() => this.setState({activeCategory: category, activeCategoryKey: key})}
              /> 
            ))}
          </View>
        )}
      </Popup>
    );
  }
}