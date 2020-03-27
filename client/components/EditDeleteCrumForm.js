import {connect} from 'react-redux'
import * as React from 'react'
import {SCALER, crumInstanceParser} from './utils'
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
import {images} from '../../assets/'
import {
  postCrumInstance,
  putCrumInstance,
  deleteCrumInstance,
  getSingleUser
} from '../store/'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
class DisEditDeleteCrumForm extends React.Component {
  constructor() {
    super()
    this.handleTypeMessage = this.handleTypeMessage.bind(this)
    this.handleDeleteCrum = this.handleDeleteCrum.bind(this)
    this.handleEditCrum = this.handleEditCrum.bind(this)
  }
  state = {
    modalVisible: true,
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
  handleDeleteCrum(crumInstance, userId) {
    this.props.DeleteCrumInstance(crumInstance, userId)
  }
  handleEditCrum(crumInstance, userId) {
    this.props.EditCrumInstance(crumInstance, userId)
  }
  render() {
    const {
      locations,
      crums,
      user,
      hideEditDeleteCrumForm,
      crumInstance
    } = this.props
    // const crumClickedParsed = crumInstanceParser(this.props.crumClicked)
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity
          style={styles.btnEditDelete}
          onPress={() => {
            this.setModalVisible(true)
          }}
        >
          <Text style={{color: '#19ae9f'}} title="EditDelete!">
            d r o p
          </Text>
        </TouchableOpacity> */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // this.handleOpenModel()
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
                      // borderWidth={this.state.imgId === crum.id ? 2 : 0}
                      borderRadius={3}
                      source={images[crumInstance.crum.name]}
                    />
                    <Text style={{color: '#19ae9f'}} title="EditDelete!">
                      {JSON.stringify(crumInstance)}
                    </Text>
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
                        this.props.hideEditDeleteCrumForm()
                        this.setModalVisible(!this.state.modalVisible)
                      }}
                    >
                      <Text style={{color: '#19ae9f'}} title="EditDelete!">
                        edit
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
                        this.props.hideEditDeleteCrumForm()
                        this.setModalVisible(!this.state.modalVisible)
                      }}
                    >
                      <Text style={{color: '#19ae9f'}} title="EditDelete!">
                        collect
                      </Text>
                    </TouchableOpacity>
                    {/* <Text style={{color: '#19ae9f'}} title="EditDelete!">
                {JSON.stringify(Object.keys(this.props))}
              </Text> */}
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        hideEditDeleteCrumForm()
                        this.setModalVisible(!this.state.modalVisible)
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

const EditDeleteCrumForm = connect(mapState, mapDispatch)(DisEditDeleteCrumForm)

export default EditDeleteCrumForm

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderColor: 'gray',
    borderWidth: 1
  },
  modalButtons: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexBasis: '16%',
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1
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
    display: 'flex',
    borderColor: 'gray',
    borderWidth: 1
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
