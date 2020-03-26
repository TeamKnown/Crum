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
import {postCrumInstance} from '../store/'
import {images, imageThumbnails} from '../../assets/'

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
  handleDropCrum(crumInstance, userId, crumId) {
    this.props.dropCrumInstance(crumInstance, userId, crumId)
  }
  render() {
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
                      this.setState({
                        imgId: crum.id
                      })
                    }}
                  >
                    <Image
                      style={{width: 40, height: 40, margin: 6}}
                      borderColor={0xf44336}
                      borderWidth={this.state.imgId === crum.id ? 10 : 0}
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
    dropCrumInstance: (crumInstance, userId, crumId) => {
      dispatch(postCrumInstance(crumInstance, userId, crumId))
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
