/* eslint-disable complexity */
import {connect} from 'react-redux'
import * as React from 'react'
import {SCALER} from '../utils'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert
} from 'react-native'
import {imageThumbnails} from '../../../assets/'
import {postCrumInstance, getSingleUser} from '../../store/'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

class DisDropCrumForm extends React.Component {
  constructor() {
    super()
    this.handleTypeMessage = this.handleTypeMessage.bind(this)
    this.handleDropCrum = this.handleDropCrum.bind(this)
  }
  state = {
    modalVisible: true,
    message: '',
    imgId: '',
    validationError: ''
  }
  handleTypeMessage(event) {
    this.setState({
      message: event.nativeEvent.text
    })
  }
  handleDropCrum(crumInstance, userId, crumId) {
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
    else {
      this.props.postCrumInstance(crumInstance, userId, crumId)
      this.props.hideDropCrumForm()
    }
  }

  render() {
    const {locations, crums, user, hideDropCrumForm} = this.props
    return (
      <View style={styles.container}>
        <Modal
          style={styles.root}
          animationType="fade"
          transparent={true}
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
                  </View>
                  <View style={styles.modalInput}>
                    <TextInput
                      required
                      id="message"
                      value={this.state.message}
                      onChange={this.handleTypeMessage}
                      textAlign="center"
                      style={{
                        color: 'black'
                      }}
                      placeholder="m e s s a g e"
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
                            latitude: locations.latitude,
                            longitude: locations.longitude
                          },
                          user.id,
                          this.state.imgId
                        )
                      }}
                    >
                      <Text title="Drop!">drop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        hideDropCrumForm()
                      }}
                    >
                      <Text title="Drop!">never mind</Text>
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
  locations: {
    ...state.locations,
    longitudeIdx: Math.floor(state.locations.longitude * SCALER),
    latitudeIdx: Math.floor(state.locations.latitude * SCALER)
  },
  crumInstances: state.crumInstances,
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
    minHeight: '90%',
    maxHeight: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
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
    borderColor: 'white',
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  modalInput: {
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
  validation: {color: 'red', textAlign: 'left', marginLeft: 10}
})
