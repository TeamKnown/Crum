/* eslint no-multi-spaces: 0 */
import * as React from 'react'
import {connect} from 'react-redux'
import {getSingleUser} from '../../store'
import {updateUserThunk} from '../../store'
import {LinearGradient} from 'expo-linear-gradient'
import {checkIphoneModel} from '../utils'
// import {} from '../store/'

import {
  Platform,
  Button,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Modal,
  Picker,
  TouchableHighlight,
  Alert
} from 'react-native'

class UserSettingsModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSelectMode = this.handleSelectMode.bind(this)
  }
  state = {
    visible: false,
    device: this.props.user.device
  }
  getiPhoneModel() {
    return checkIphoneModel()
  }

  setModalVisible(visible) {
    this.setState({
      visible: visible
    })
  }
  handleSelectMode(device) {
    this.setState({
      device: device
    })
  }

  handleSubmit(userId, info) {
    this.props.editUser(userId, info)
  }
  render() {
    const {user} = this.props

    return (
      <LinearGradient style={styles.btnCrum} colors={['#7c1e9f', '#bd7cde']}>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true)
            }}
          >
            <Text style={styles.settings} title="settings">
              settings
            </Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.visible}
            onRequestClose={() => {
              Alert.alert('Modal closed')
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <View style={styles.deviceContainer}>
                  <View style={styles.device}>
                    <Text style={styles.heading}>
                      Recommended Device Setting:
                    </Text>
                    {this.getiPhoneModel() === 'noAR' && (
                      <Text style={styles.type}>no AR</Text>
                    )}
                    {this.getiPhoneModel() === 'standard' && (
                      <Text style={styles.type}>standard</Text>
                    )}
                    {this.getiPhoneModel() === 'advanced' && (
                      <Text style={styles.type}>advanced</Text>
                    )}
                  </View>
                  <Text />
                  <Text style={styles.info}>
                    *AR functionality is only available on iPhone 6s or newer
                  </Text>
                  <Text style={styles.info}>
                    *Upgrade to Advanced Mode if using iPhone X or newer
                  </Text>
                </View>

                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={this.state.device}
                  onValueChange={this.handleSelectMode}
                >
                  <Picker.Item label="n o  A R" value="noAR" />
                  <Picker.Item label="s t a n d a r d" value="standard" />
                  <Picker.Item label="a d v a n c e d" value="advanced" />
                </Picker>
                <TouchableOpacity
                  style={styles.btnDrop}
                  onPress={() => {
                    this.handleSubmit(this.props.user.id, {
                      device: this.state.device
                    })
                    this.setModalVisible(!this.state.visible)
                  }}
                >
                  <Text style={styles.update} title="edit">
                    update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#7c1e9f',
    width: '90%',
    height: '70%',
    borderRadius: 10,
    marginTop: 100
  },

  modalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'APompadourBold'
  },
  settings: {
    color: 'white',
    fontFamily: 'APompadourBold',
    letterSpacing: 7
  },
  update: {
    color: '#19ae9f',
    fontFamily: 'APompadourBold',
    letterSpacing: 7
  },
  type: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    fontFamily: 'APompadour',
    fontSize: 40,
    letterSpacing: 7
  },

  btnDrop: {
    height: 60,
    width: '90%',
    backgroundColor: 'white',
    borderColor: '#19ae9f',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  btnCrum: {
    width: '47%',
    height: 60,
    backgroundColor: '#7c1e9f',
    // textAlign: 'center',   // april's comment: causes error
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  deviceContainer: {
    flex: 1
  },
  device: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    fontFamily: 'APompadour',
    textAlign: 'center'
  },

  picker: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%'
  },
  pickerItem: {
    height: 120,
    fontFamily: 'APompadourBold',
    letterSpacing: 7
  }
})

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    editUser: (userId, info) => {
      dispatch(updateUserThunk(userId, info))
    }
  }
}

export default connect(mapState, mapDispatch)(UserSettingsModal)
