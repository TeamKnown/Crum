/* eslint-disable complexity */
import {connect} from 'react-redux'
import * as React from 'react'
import {SCALER, userNameExists} from '../utils'
import SwitchSelector from 'react-native-switch-selector'
import NumericInput from 'react-native-numeric-input'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  ScrollView
} from 'react-native'
import {imageThumbnails} from '../../../assets/'
import {postCrumInstance, getSingleUser} from '../../store/'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const sendModeOptions = [
  {label: 'secret crum', value: 'secret crum'},
  {label: 'public crum', value: 'public crum'}
]

class DisDropCrumForm extends React.Component {
  constructor() {
    super()
    this.handleTypeMessage = this.handleTypeMessage.bind(this)
    this.handleTypeRecipient = this.handleTypeRecipient.bind(this)
    this.handleTypeCount = this.handleTypeCount.bind(this)
    this.handleTypeOption = this.handleTypeOption.bind(this)
    this.handleDropCrum = this.handleDropCrum.bind(this)
    this.state = {
      modalVisible: true,
      message: '',
      recipient: '',
      imgId: '',
      validationError: '',
      sendMode: 'secret crum', // 'for all'
      num: 1 // 'for all'
    }
  }

  handleTypeMessage(event) {
    this.setState({
      message: event.nativeEvent.text
    })
  }

  handleTypeRecipient(event) {
    this.setState({
      recipient: event.nativeEvent.text
    })
  }

  handleTypeCount(event) {
    this.setState({
      num: event
    })
  }

  handleTypeOption(event) {
    this.setState({
      sendMode: event
    })
  }

  async handleDropCrum(crumInstance, userId, crumId) {
    this.setState({validationError: ''})
    if (crumInstance.message === '')
      this.setState({validationError: 'Please enter a message'})
    else if (
      crumInstance.latitude === undefined ||
      crumInstance.longitude === undefined
    )
      this.setState({
        validationError: 'Please wait until location data is loaded'
      })
    else if (crumId === '')
      this.setState({
        validationError: 'Please select a crum'
      })
    else if (this.state.recipient === this.props.user.userName) {
      this.setState({
        validationError: 'Recipient cannot be self'
      })
    } else if (
      this.state.recipient === '' &&
      this.state.sendMode === 'secret crum'
    ) {
      this.setState({
        validationError: 'Recipient must be specified'
      })
    } else {
      let toMany = this.state.sendMode === 'public crum'
      let recipientExists = await userNameExists(this.state.recipient)
      if (recipientExists || toMany) {
        this.props.postCrumInstance(crumInstance, userId, crumId)
        this.props.hideDropCrumForm()
      } else {
        this.setState({
          validationError: 'Recipient does not exist'
        })
      }
    }
  }

  render() {
    const {locations, crums, user, hideDropCrumForm} = this.props
    return (
      <View style={styles.container}>
        <Modal
          style={styles.root}
          animationType="fade"
          transparent={!this.props.opaque}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal closed')
          }}
        >
          <SafeAreaView style={styles.root}>
            <KeyboardAwareScrollView contentContainerStyle={styles.root}>
              <View style={styles.root}>
                <View style={styles.modal}>
                  <View style={styles.modalPngSelector}>
                    <ScrollView
                      contentContainerStyle={{
                        flexWrap: 'wrap',
                        alignItems: 'stretch',
                        flexDirection: 'row',
                        paddingLeft: 7
                      }}
                      style={{
                        flex: 1
                      }}
                    >
                      {crums.map(crum => (
                        <TouchableOpacity
                          key={crum.id}
                          onPress={() => {
                            this.setState({
                              imgId: crum.id
                            })
                          }}
                        >
                          <Image
                            style={{width: 40, height: 40, margin: 6}}
                            borderColor={
                              this.state.imgId === crum.id
                                ? 'gray'
                                : 'rgba(250,250,250,0)'
                            }
                            borderWidth={2}
                            borderRadius={3}
                            source={imageThumbnails[crum.name]}
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.modalInputOptionSelector}>
                    <SwitchSelector
                      style={{margin: 10}}
                      selectedColor="black"
                      buttonColor="white"
                      textColor="gray"
                      backgroundColor="rgba(250,250,250,0)"
                      options={sendModeOptions}
                      initial={0}
                      onPress={this.handleTypeOption}
                    />
                  </View>
                  {this.state.sendMode === 'secret crum' && (
                    <View style={styles.modalInputRecipient}>
                      <TextInput
                        required
                        id="recipient"
                        value={this.state.recipient}
                        onChange={this.handleTypeRecipient}
                        textAlign="center"
                        style={{
                          color: 'black',
                          fontFamily: 'APompadour'
                        }}
                        placeholder="r e c i p i e n t"
                        autoComplete="recipient"
                        type="text"
                      />
                    </View>
                  )}
                  {this.state.sendMode === 'public crum' && (
                    <View style={styles.modalInputCount}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center'
                        }}
                      >
                        <NumericInput
                          value={this.state.num}
                          totalHeight={35}
                          totalWidth={170}
                          rounded={true}
                          minValue={1}
                          maxValue={100}
                          rightButtonBackgroundColor="rgba(255,255,255,0.5)"
                          leftButtonBackgroundColor="rgba(255,255,255,0.5)"
                          style={{margin: 10, borderWidth: 5}}
                          onChange={this.handleTypeCount}
                        />
                      </View>
                    </View>
                  )}
                  <View style={styles.modalInputMessage}>
                    <TextInput
                      required
                      id="message"
                      value={this.state.message}
                      onChange={this.handleTypeMessage}
                      textAlign="center"
                      style={{
                        color: 'black',
                        fontFamily: 'APompadour'
                      }}
                      placeholder="m e s s a g e *"
                      autoComplete="message"
                      type="text"
                    />
                  </View>

                  <Text style={styles.validation}>
                    {this.state.validationError}
                  </Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        this.handleDropCrum(
                          {
                            message: this.state.message,
                            recipient:
                              this.state.sendMode === 'secret crum'
                                ? this.state.recipient
                                : '',
                            numLeft:
                              this.state.sendMode === 'secret crum'
                                ? 1
                                : this.state.num,
                            numDropped:
                              this.state.sendMode === 'secret crum'
                                ? 1
                                : this.state.num,
                            latitude: locations.latitude,
                            longitude: locations.longitude,
                            isPrivate: this.state.sendMode === 'secret crum'
                          },
                          user.id,
                          this.state.imgId
                        )
                      }}
                    >
                      <Text style={styles.button} title="Drop!">
                        drop
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        hideDropCrumForm()
                      }}
                    >
                      <Text style={styles.button} title="Drop!">
                        back
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}

const mapState = state => ({
  isLoggedIn: !!state.user.id,
  user: state.user,
  locations: state.locations,
  crumInstances: state.crumInstancesNearby,
  crums: state.crums
})
const mapDispatch = dispatch => {
  return {
    postCrumInstance: async (crumInstance, userId, crumId) => {
      await dispatch(postCrumInstance(crumInstance, userId, crumId))
      await dispatch(getSingleUser(userId))
    }
  }
}

const DropCrumForm = connect(mapState, mapDispatch)(DisDropCrumForm)

export default DropCrumForm

const styles = StyleSheet.create({
  root: {flex: 1},
  container: {
    flex: 1,
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  modal: {
    flex: 1,
    alignSelf: 'center',
    alignContent: 'center',
    width: '93%',
    borderColor: '#7c1e9f',
    shadowColor: 'grey',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: '5%',
    marginTop: '20%',
    padding: 5
  },
  modalPngSelector: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    display: 'flex',
    width: '100%',
    minHeight: '70%',
    maxHeight: '70%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  modalButtons: {
    minHeight: '12%',
    maxHeight: '12%',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'gray'
  },
  btn: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    display: 'flex',
    height: '90%',
    flex: 3,
    flexBasis: '20%',
    borderColor: '#19ae9f',
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  button: {
    fontFamily: 'APompadourBold',
    color: '#19ae9f',
    letterSpacing: 4
  },
  modalInputOptionSelector: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    minHeight: '10%',
    maxHeight: '10%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  modalInputMessage: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    minHeight: '10%',
    maxHeight: '10%',
    justifyContent: 'center',
    display: 'flex',
    borderColor: 'white',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  },
  modalInputRecipient: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    minHeight: '10%',
    maxHeight: '10%',
    justifyContent: 'center',
    display: 'flex',
    borderColor: 'white',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  modalInputCount: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    minHeight: '10%',
    maxHeight: '10%',
    alignItems: 'stretch',
    justifyContent: 'center',
    display: 'flex',
    borderColor: 'white',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  each: {
    fontFamily: 'APompadour'
  },
  validation: {color: 'red', textAlign: 'left', marginLeft: 10}
})
