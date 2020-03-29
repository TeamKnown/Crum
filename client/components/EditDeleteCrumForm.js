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
  Alert,
  ScrollView
} from 'react-native'
import {images} from '../../assets/'
import {
  putCrumInstance,
  deleteCrumInstance,
  getSingleUser,
  postCommentInstance
} from '../store/'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
class DisEditDeleteCrumForm extends React.Component {
  constructor(props) {
    super()
    this.handleTypeMessage = this.handleTypeMessage.bind(this)
    this.handleTypeComment = this.handleTypeComment.bind(this)
    this.handleDeleteCrum = this.handleDeleteCrum.bind(this)
    this.handleEditCrum = this.handleEditCrum.bind(this)
    this.handleAddComment = this.handleAddComment.bind(this)
    this.state = {
      modalVisible: true,
      message: props.crumInstance.message,
      comment: '',
      imgId: '',
      validationError: '',
      selfEditing: false
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

  handleTypeComment(event) {
    this.setState({
      comment: event.nativeEvent.text
    })
  }

  handleAddComment(commentInstance, crumInstanceId) {
    if (this.state.comment === '')
      this.setState({validationError: 'Comment cannot be empty'})
    else {
      this.props.postCommentInstance(commentInstance, crumInstanceId)
      this.setState({validationError: ''})
      this.setState({comment: ''})
    }

    // this.props.hideEditDeleteCrumForm()
    // this.setModalVisible(!this.state.modalVisible)
  }
  handleDeleteCrum(crumInstance, userId) {
    this.props.deleteCrumInstance(crumInstance, userId)
    this.props.hideEditDeleteCrumForm()
    // this.setModalVisible(!this.state.modalVisible)
  }
  handleEditCrum(crumInstance, userId) {
    if (!this.state.selfEditing) {
      this.setState({selfEditing: true})
      return
    }

    if (crumInstance.message === '')
      this.setState({validationError: 'Message cannot be empty'})
    else {
      this.props.editCrumInstance(crumInstance, userId)
      this.setState({selfEditing: false})
      this.setState({validationError: ''})
      // this.props.hideEditDeleteCrumForm()
      // this.setModalVisible(!this.state.modalVisible)
    }
  }
  render() {
    const {user, hideEditDeleteCrumForm, crumInstance} = this.props
    const self = user.id === +crumInstance.user.id
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
                  <View style={styles.modalPngTitle}>
                    <View style={styles.modalTitle}>
                      <TextInput
                        required
                        multiline={true}
                        id="message"
                        editable={this.state.selfEditing}
                        value={this.state.message}
                        onChange={this.handleTypeMessage}
                        textAlign="center"
                        style={
                          this.state.selfEditing
                            ? styles.title
                            : styles.disabledTitle
                        }
                        placeholder=""
                        autoComplete="text"
                        type="text"
                      />
                    </View>
                    <View style={styles.modalPng}>
                      <Image
                        style={styles.modalPng}
                        borderRadius={3}
                        source={images[crumInstance.crum.name]}
                      />
                    </View>
                  </View>
                  <View style={styles.modalComments}>
                    <ScrollView
                      style={{
                        flex: 1,
                        width: '100%'
                      }}
                    >
                      {crumInstance.CommentInstances.map(comment => (
                        <Text key={comment.id}>
                          {comment.message}
                          {'\n'}
                        </Text>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.modalInput}>
                    <TextInput
                      required
                      id="comment"
                      // editable={false}
                      value={this.state.comment}
                      onChange={this.handleTypeComment}
                      textAlign="center"
                      style={{
                        color: 'black'
                      }}
                      placeholder="Leave your comment here"
                      autoComplete="text"
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
                        this.handleAddComment(
                          {message: this.state.comment},
                          crumInstance.id
                        )
                      }}
                    >
                      <Text style={{color: '#19ae9f'}} title="EditDelete!">
                        comment
                      </Text>
                    </TouchableOpacity>

                    {self && (
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
                          edit
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.modalButtons}>
                    {self && (
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
                          collect
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        this.props.hideEditDeleteCrumForm()
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
    editCrumInstance: (crumInstance, userId) => {
      dispatch(putCrumInstance(crumInstance))
      dispatch(getSingleUser(userId))
    },
    deleteCrumInstance: (crumInstance, userId) => {
      dispatch(deleteCrumInstance(crumInstance))
      dispatch(getSingleUser(userId))
    },
    postCommentInstance: (commentInstance, userId, commentId) => {
      dispatch(postCommentInstance(commentInstance, userId, commentId))
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
  modalPngTitle: {
    display: 'flex',
    width: '100%',
    flexBasis: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  modalTitle: {
    flex: 1,
    minWidth: 160,
    minHeight: 160,
    maxWidth: 160,
    maxHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  disabledTitle: {
    minWidth: 160,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 28
  },

  title: {
    minWidth: 160,
    // minHeight: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 2
  },

  modalPng: {
    flex: 1,
    maxWidth: 160,
    maxHeight: 160,
    width: 160,
    height: 160
  },

  modalComments: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    flexBasis: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  modalButtons: {
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'gray'
  },
  btn: {
    display: 'flex',
    height: 60,
    flex: 3,
    flexBasis: '20%',
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
    flexBasis: '6%',
    display: 'flex',
    borderColor: 'white',
    borderWidth: 1,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  },

  input: {
    flex: 1,
    height: 60,
    borderRadius: 10,
    borderColor: 'grey',
    backgroundColor: 'white',
    color: 'black',
    // borderWidth: 2,
    alignItems: 'center'
    // margin: 5
  },
  inputDisabled: {
    justifyContent: 'center',
    flexBasis: '16%',
    display: 'flex',
    borderColor: 'red'
    // borderWidth: 0,
    // fontSize: 20
  }
})
