/* eslint-disable complexity */
import {connect} from 'react-redux'
import * as React from 'react'
import {SCALER, userCollectedThis, howLongAgo} from '../utils'
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
import {images} from '../../../assets/'
import {
  putCrumInstance,
  deleteCrumInstance,
  getSingleUser,
  collectCrumInstance,
  postCommentInstance
} from '../../store/'
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
  }
  handleDeleteCrum(crumInstance, userId) {
    this.props.deleteCrumInstance(crumInstance, userId)
    this.props.hideEditDeleteCrumForm()
  }

  async handleCollectCrum(crumInstance, userId) {
    let recipientCollectedThis = await userCollectedThis(
      this.props.user.id,
      this.props.crumInstance.id
    )
    if (!recipientCollectedThis) {
      this.props.collectCrumInstance(crumInstance, userId)
      if (this.props.crumInstance.numLeft === 1) {
        this.props.hideEditDeleteCrumForm()
      }
    } else {
      this.setState({
        validationError: 'You already collected this one'
      })
    }
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
    }
  }
  render() {
    const {user, crumInstance} = this.props
    const self = user.id === +crumInstance.userId
    const isRecipient = user.id === +crumInstance.recipientId
    const isForAll = !crumInstance.recipientId
    let timePassed = howLongAgo(crumInstance.createdAt)
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
          <SafeAreaView style={styles.root}>
            <KeyboardAwareScrollView contentContainerStyle={styles.root}>
              <View style={styles.root}>
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
                        s
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
                    {crumInstance.recipientId &&
                      crumInstance.recipientId === this.props.user.id && (
                        <Text style={styles.subtitle}>Just for you</Text>
                      )}
                    {crumInstance.recipientId &&
                      crumInstance.userId === this.props.user.id && (
                        <Text style={styles.subtitle}>Just for them</Text>
                      )}
                    {!crumInstance.recipientId && (
                      <Text
                        style={styles.subtitle}
                      >{`Number Left: ${crumInstance.numLeft} / ${crumInstance.numDropped}`}</Text>
                    )}
                    <Text
                      style={styles.subtitle}
                    >{`Dropped ${timePassed}`}</Text>
                    <Text style={styles.subtitle}>Comments:</Text>
                    <ScrollView
                      style={{
                        flex: 1,
                        width: '100%'
                      }}
                    >
                      {crumInstance.CommentInstances.length > 0 ? (
                        <View>
                          {crumInstance.CommentInstances.map(comment => (
                            <Text key={comment.id}>{comment.message}</Text>
                          ))}
                        </View>
                      ) : (
                        <Text style={styles.text}>
                          No one has commented on this crum, add one now!
                        </Text>
                      )}
                    </ScrollView>
                  </View>

                  <View style={styles.modalInput}>
                    <TextInput
                      required
                      id="comment"
                      value={this.state.comment}
                      onChange={this.handleTypeComment}
                      textAlign="center"
                      style={{
                        color: 'black',
                        fontFamily: 'APompadour'
                      }}
                      placeholder="Leave your comment here"
                      autoComplete="text"
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
                        this.handleAddComment(
                          {message: this.state.comment},
                          crumInstance.id
                        )
                      }}
                    >
                      <Text
                        style={self ? styles.buttonTight : styles.button}
                        title="EditDelete!"
                      >
                        comment
                      </Text>
                    </TouchableOpacity>

                    {(isRecipient || isForAll) && (
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                          this.handleCollectCrum(
                            {
                              id: crumInstance.id
                            },
                            user.id
                          )
                        }}
                      >
                        <Text
                          style={self ? styles.buttonTight : styles.button}
                          title="EditDelete!"
                        >
                          collect
                        </Text>
                      </TouchableOpacity>
                    )}
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
                        <Text
                          style={self ? styles.buttonTight : styles.button}
                          title="EditDelete!"
                        >
                          edit
                        </Text>
                      </TouchableOpacity>
                    )}
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
                        <Text
                          title="EditDelete!"
                          style={self ? styles.buttonTight : styles.button}
                        >
                          delete
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        this.props.hideEditDeleteCrumForm()
                      }}
                    >
                      <Text
                        title="EditDelete!"
                        style={self ? styles.buttonTight : styles.button}
                      >
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
    editCrumInstance: (crumInstance, userId) => {
      dispatch(putCrumInstance(crumInstance))
      dispatch(getSingleUser(userId))
    },
    deleteCrumInstance: async (crumInstance, userId) => {
      await dispatch(deleteCrumInstance(crumInstance))
      await dispatch(getSingleUser(userId))
    },
    collectCrumInstance: async (crumInstance, userId) => {
      await dispatch(collectCrumInstance(crumInstance))
      await dispatch(getSingleUser(userId))
    },

    postCommentInstance: (commentInstance, userId, commentId) => {
      dispatch(postCommentInstance(commentInstance, userId, commentId))
    }
  }
}

const EditDeleteCrumForm = connect(mapState, mapDispatch)(DisEditDeleteCrumForm)

export default EditDeleteCrumForm

const styles = StyleSheet.create({
  root: {flex: 1},
  container: {
    position: 'absolute'
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
  modalPngTitle: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    flex: 1,
    minHeight: '45%',
    maxHeight: '45%',
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
  modalPng: {
    flex: 10,
    maxWidth: 160,
    maxHeight: 160,
    width: 160,
    height: 160
  },
  disabledTitle: {
    minWidth: 160,
    display: 'flex',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 28
  },

  title: {
    minWidth: 160,
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

  modalComments: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    flex: 1,
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    minHeight: '45%',
    maxHeight: '45%',

    alignItems: 'flex-start',
    borderColor: 'white',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 15
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
    flexBasis: '15%',
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
  buttonTight: {
    fontFamily: 'APompadourBold',
    color: '#19ae9f',
    letterSpacing: 0,
    fontSize: 12
  },
  modalInput: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    flex: 1,
    minHeight: '10%',
    maxHeight: '10%',
    justifyContent: 'center',
    display: 'flex',
    borderColor: 'white',
    borderWidth: 1,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  },
  validation: {color: 'red', textAlign: 'left', marginLeft: 10},
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'APompadourBold'
  },
  text: {
    fontFamily: 'APompadour'
  }
})
