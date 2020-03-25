import * as React from 'react'
import {connect} from 'react-redux'
import {getSingleUser} from '../store'
import {logout} from '../store/user'
import {updateUserThunk} from '../store/'

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

class UserProfile extends React.Component {
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

  async handleSignOut() {
    await this.props.logout()
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
    console.log('state', this.state)
    return (
      <View style={styles.main}>
        <View style={styles.topContainer}>
          <Image
            source={require('../../public/defaultProfile1.png')}
            style={{
              width: 220,
              height: 220,
              marginRight: 10,
              marginBottom: 12,
              marginTop: '15%'
            }}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.bottomContainer}>
            <View style={styles.editButtons}>
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                  fontWeight: 'bold'
                }}
              >
                u s e r n a m e
              </Text>
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
                animationType="none"
                transparent={false}
                visible={this.state.visible}
                onRequestClose={() => {
                  Alert.alert('Modal closed')
                }}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modal}>
                    <Text>e d i t</Text>
                    <Text>u s e r</Text>
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
                        e d i t
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            {user.id ? (
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16
                }}
              >
                {user.userName}
              </Text>
            ) : (
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16
                }}
              >
                P L A C E H O L D E R
              </Text>
            )}
            <Text
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16,
                fontWeight: 'bold'
              }}
            >
              c r u m s d r o p p e d
            </Text>
            {user.id ? (
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                  fontSize: 40
                }}
              >
                {user.totalCrums}
              </Text>
            ) : (
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                  fontSize: 40
                }}
              >
                0
              </Text>
            )}
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.btnLogout}
              onPress={() => this.handleSignOut()}
            >
              <Text style={{color: 'white'}}>logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCrum}
              onPress={() => {
                this.setModalVisible(true)
              }}
            >
              <Text style={{color: 'white'}} title="update">
                m y c r u m s
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    paddingBottom: 10
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderColor: '#7c1e9f',
    width: '90%',
    height: '70%',
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    marginTop: 100
  },
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    paddingBottom: '4%'
  },
  buttons: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editButtons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around'
  },
  btnLogout: {
    width: '47%',
    height: 60,
    backgroundColor: '#19ae9f',
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  btnCrum: {
    width: '47%',
    height: 60,
    backgroundColor: '#7c1e9f',
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
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
    marginTop: 8
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
    margin: 8
  }
})

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleUser: id => dispatch(getSingleUser(id)),
    logout: () => dispatch(logout()),
    editUser: (userId, info) => {
      dispatch(updateUserThunk(userId, info))
    }
  }
}

export default connect(mapState, mapDispatch)(UserProfile)
