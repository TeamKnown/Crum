import * as React from 'react'
import {connect} from 'react-redux'
import {getSingleUser} from '../store'
import {updateUserThunk} from '../store/'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
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
  TouchableHighlight,
  Alert
} from 'react-native'

class EditUserModalForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleTypeUser = this.handleTypeUser.bind(this)
    this.handleTypeEmail = this.handleTypeEmail.bind(this)
    // this.handleTypePassword= this.handleTypePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  state = {
    visible: false,
    userName: this.props.user.userName,
    email: this.props.user.email
    // password: this.props.user.password
  }

  setModalVisible(visible) {
    this.setState({
      visible: visible
    })
  }

  handleTypeUser(event) {
    this.setState({
      userName: event.nativeEvent.text
    })
  }
  handleTypeEmail(event) {
    this.setState({
      email: event.nativeEvent.text
    })
  }
  // handleTypePassword(event) {
  //   this.setState({
  //     password: event.nativeEvent.password
  //   })
  // }

  handleSubmit(userId, info) {
    this.props.editUser(userId, info)
  }
  render() {
    const {user} = this.props
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true)
          }}
        >
          <Image
            source={require('../../public/editIcon3.png')}
            style={{
              width: 15,
              height: 15,
              marginBottom: '14%',
              marginLeft: 7
            }}
          />
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
              <View style={styles.inputForm}>
                <Text style={styles.text_footer}>Username</Text>
                <View style={styles.action}>
                  <FontAwesome name="user-o" color="#05375a" size={20} />
                  <TextInput
                    id="userName"
                    name="userName"
                    value={this.state.userName}
                    onChange={this.handleTypeUser}
                    textAlign="center"
                    style={styles.input}
                    placeholder="u s e r n a m e"
                    type="text"
                  />
                </View>

                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                  <FontAwesome name="user-o" color="#05375a" size={20} />
                  <TextInput
                    id="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleTypeEmail}
                    textAlign="center"
                    style={styles.input}
                    placeholder="e m a i l"
                    type="text"
                  />
                </View>
              </View>
              {/*<TextInput
                    required
                    id="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleTypePassword}
                    textAlign="center"
                    style={styles.input}
                    placeholder='p a s s w o r d'
                    type="password"
                  />*/}
              <TouchableOpacity
                style={styles.btnDrop}
                onPress={() => {
                  this.handleSubmit(this.props.user.id, {
                    userName: this.state.userName,
                    email: this.state.email
                    // password: this.state.password
                  })
                  this.setModalVisible(!this.state.visible)
                }}
              >
                <Text style={{color: '#19ae9f'}} title="edit">
                  u p d a t e i n f o
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
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

  btnDrop: {
    height: 60,
    width: '90%',
    backgroundColor: 'white',
    borderColor: '#19ae9f',
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  input: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    paddingLeft: '3%',
    marginTop: '1%',
    marginBottom: '1%'
  },
  inputForm: {
    width: '90%',
    backgroundColor: 'white'
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%'
  },
  action: {
    flexDirection: 'row',
    marginTop: '2%',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: '2%'
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

export default connect(mapState, mapDispatch)(EditUserModalForm)
