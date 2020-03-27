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
  SafeAreaView,
  Modal,
  Alert
} from 'react-native'
import {images} from '../../assets'
import {putCrumInstance, deleteCrumInstance, getSingleUser} from '../store'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
class DisCommentCrumForm extends React.Component {
  constructor(props) {
    super()
    this.handleTypeMessage = this.handleTypeMessage.bind(this)
    this.handleDeleteCrum = this.handleDeleteCrum.bind(this)
    this.handleEditCrum = this.handleEditCrum.bind(this)
    this.state = {
      modalVisible: true,
      message: props.crumInstance.message,
      imgId: '',
      validationError: ''
    }
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
  handleDeleteCrum(crumInstance, userId) {
    this.props.DeleteCrumInstance(crumInstance, userId)
    this.props.hideCommentCrumForm()
    // this.setModalVisible(!this.state.modalVisible)
  }
  handleEditCrum(crumInstance, userId) {
    if (crumInstance.message === '')
      this.setState({validationError: 'Message cannot be empty'})
    else {
      this.props.EditCrumInstance(crumInstance, userId)
      this.props.hideCommentCrumForm()
      // this.setModalVisible(!this.state.modalVisible)
    }
  }
  render() {
    const {user, hideCommentCrumForm, crumInstance} = this.props
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal closed')
          }}
        >
          <SafeAreaView style={{flex: 1}}>
            <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
              <View style={{flex: 1}}>
                <View style={styles.modal}>
                  <View style={styles.modalPngSelector}>
                    <Image
                      style={{width: 320, height: 320, margin: 6}}
                      // borderColor="gray"
                      // borderWidth={2}
                      borderRadius={3}
                      source={images[crumInstance.crum.name]}
                    />
                  </View>
                  <View style={styles.modalInput}>
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
                  </View>
                  <Text
                    style={{color: 'red', textAlign: 'left', marginLeft: 10}}
                  >
                    {this.state.validationError}
                  </Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        this.handleEditCrum(
                          {
                            message: this.state.message,
                            id: crumInstance.id
                          },
                          user.id
                        )
                      }}
                    >
                      <Text style={{color: '#19ae9f'}} title="EditDelete!">
                        cannot edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        this.handleDeleteCrum(
                          {
                            id: crumInstance.id
                          },
                          user.id
                        )
                      }}
                    >
                      <Text style={{color: '#19ae9f'}} title="EditDelete!">
                        cannot collect
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        this.props.hideCommentCrumForm()
                      }}
                    >
                      <Text style={{color: '#19ae9f'}} title="EditDelete!">
                        never mind
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
    EditCrumInstance: (crumInstance, userId) => {
      dispatch(putCrumInstance(crumInstance))
      dispatch(getSingleUser(userId))
    },
    DeleteCrumInstance: (crumInstance, userId) => {
      dispatch(deleteCrumInstance(crumInstance))
      dispatch(getSingleUser(userId))
    }
  }
}

const CommentCrumForm = connect(mapState, mapDispatch)(DisCommentCrumForm)

export default CommentCrumForm

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  modal: {
    // height: '100%',
    // position: 'relative',
    display: 'flex',
    width: '93%',
    flexDirection: 'column',
    backgroundColor: 'rgba(250,250,250,0.8)',
    borderColor: '#7c1e9f',
    alignSelf: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    marginBottom: '10%',
    marginTop: '20%',
    padding: 5
  },
  modalPngSelector: {
    display: 'flex',
    width: '100%',
    flexBasis: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
    // flexWrap: 'wrap',
    // borderColor: 'gray',
    // borderWidth: 1
  },
  modalButtons: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexBasis: '16%',
    display: 'flex',
    flexDirection: 'row'
    // borderColor: 'gray',
    // borderWidth: 1
  },
  btn: {
    display: 'flex',
    height: 60,
    flex: 3,
    flexBasis: '30%',
    backgroundColor: 'white',
    borderColor: '#19ae9f',
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  modalInput: {
    justifyContent: 'center',
    flexBasis: '16%',
    display: 'flex'
    // borderColor: 'gray',
    // borderWidth: 1
  },
  input: {
    height: 60,
    borderRadius: 10,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 2,
    alignItems: 'center',
    margin: 5
  }
})
