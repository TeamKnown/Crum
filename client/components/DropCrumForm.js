/* eslint-disable complexity */
import {connect} from 'react-redux'
import * as React from 'react'
import {SCALER} from './utils'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native'
import {imageThumbnails} from '../../assets/'
import {postCrumInstance, getSingleUser} from '../store/'
import {ActionConst} from 'react-native-router-flux'

class DisDropCrumForm extends React.Component {
  constructor() {
    super()
    this.handleTypeMessage = this.handleTypeMessage.bind(this)
    this.handleDropCrum = this.handleDropCrum.bind(this)
  }
  state = {
    modalVisible: false,
    message: '',
    imgId: ''
  }
  setModalVisible(modalVisible) {
    this.setState({
      modalVisible: modalVisible
    })
  }
  handleTypeMessage(event) {
    this.setState({
      message: event.nativeEvent.text
    })
  }
  async handleDropCrum(crumInstance, userId, crumId) {
    this.setState({validationError: ''})
    console.log(JSON.stringify(crumInstance))
    console.log(JSON.stringify(crumId))
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
      // This is causing Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in %s.%s, the componentWillUnmount method, in DisDropCrumForm (created by ConnectFunction)
      // because this.props.postCrumInstance(crumInstance, userId, crumId) takes time, and setState might happen when this component is unmounted
      await this.props.postCrumInstance(crumInstance, userId, crumId)
      await this.props.getSingleUser(userId)
      this.props.hideDropCrumForm() //
      // this.setModalVisible(!this.state.modalVisible)   // removing this help remove the warning
    }
  }

  getiPhoneModel() {
    if (
      window.devicePixelRatio >= 3 &&
      ((window.innerHeight == 368 && window.innerWidth == 207) ||
        (window.innerHeight == 667 && window.innerWidth == 375) ||
        (window.innerHeight == 736 && window.innerWidth == 414) ||
        (window.innerHeight == 812 && window.innerWidth == 375) ||
        (window.innerHeight >= 812 && window.innerWidth >= 375))
    ) {
      return true
    } else {
      return false
    }
  }

  render() {
    // console.log('IPHONE MODEL', this.getiPhoneModel())
    // console.log('SCREEN PIXEL', window.devicePixelRatio)
    // console.log('SCREEN Height', window.innerHeight)
    // console.log('SCREEN Width', window.innerWidth)
    // console.log('SCREEN', Object.keys(window))
    const {locations, crums, user} = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnDrop}
          onPress={() => {
            this.setModalVisible(true)
          }}
        >
          <Text style={{color: '#19ae9f'}} title="Drop!">
            d r o p
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // this.handleOpenModel()
            Alert.alert('Modal closed')
          }}
        >
          <View style={styles.container}>
            <View style={styles.modal}>
              <TextInput
                required
                id="message"
                value={this.state.message}
                onChange={this.handleTypeMessage}
                textAlign="center"
                style={styles.input}
                placeholder="m e s s a g e"
                autoComplete="message"
                type="text"
              />
              <View style={styles.pngSelector}>
                {crums.map(crum => (
                  <TouchableOpacity
                    key={crum.id}
                    onPress={() => {
                      console.log('you selected this crum')
                      this.setState({
                        imgId: crum.id
                      })
                    }}
                  >
                    <Image
                      style={{width: 40, height: 40, margin: 6}}
                      borderColor="gray"
                      borderWidth={this.state.imgId === crum.id ? 2 : 0}
                      borderRadius={3}
                      source={imageThumbnails[crum.name]}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.btnDrop}
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
                  // this.props.hideDropCrumForm()
                  this.setModalVisible(!this.state.modalVisible)
                }}
              >
                <Text style={{color: '#19ae9f'}} title="Drop!">
                  d r o p
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    postCrumInstance: (crumInstance, userId, crumId) => {
      dispatch(postCrumInstance(crumInstance, userId, crumId))
    },
    getSingleUser: id => {
      dispatch(getSingleUser(id))
    }
  }
}

const DropCrumForm = connect(mapState, mapDispatch)(DisDropCrumForm)

export default DropCrumForm

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  modal: {
    width: '90%',
    height: '90%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#7c1e9f',
    alignSelf: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    marginBottom: 30
  },
  pngSelector: {
    width: '80%',
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  btnDrop: {
    height: 60,
    width: '90%',
    backgroundColor: 'white',
    borderColor: '#19ae9f',
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30
  },
  input: {
    height: 60,
    width: '90%',
    borderRadius: 10,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 2,
    alignItems: 'center',
    padding: 8,
    margin: 30
  }
})
