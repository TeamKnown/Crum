import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView
} from 'react-native'

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import {LinearGradient} from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from 'react-native-elements'
import {connect} from 'react-redux'
import {auth, me} from '../../store/user'
// import UserProfile from './UserProfile'
import PropTypes from 'prop-types'
import {DismissKeyBoard} from '../DismissKeyBoard'
const {width, height} = Dimensions.get('window')

class DisSignUpComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      check_textInputChange: false,
      userName: '',
      password: '',
      password_confirm: '',
      secureTextEntry: true,
      secureTextEntry_confirm: true,
      validationError: ''
    }
  }

  componentDidMount() {
    const {navigation} = this.props
    navigation.addListener('focus', () =>
      // run function that updates the data on entering the screen
      this.props.reset()
    )
  }

  handleSignUp() {
    const {userName, password, password_confirm, validationError} = this.state
    this.setState({validationError: ''})

    if (userName === '')
      this.setState({validationError: 'Please enter your username'})
    else if (password === '')
      this.setState({validationError: 'Please enter your password'})
    else if (password_confirm === '' || password_confirm !== password)
      this.setState({validationError: 'Passwords must match'})
    else {
      this.props.auth(this.state.userName, this.state.password)
    }
  }

  textInputChange(value) {
    if (value.length !== 0) {
      this.setState({
        check_textInputChange: true,
        userName: value
      })
    } else {
      this.setState({
        check_textInputChange: false
      })
    }
  }

  secureTextEntry() {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry
    })
  }

  secureTextEntry_confirm() {
    this.setState({
      secureTextEntry_confirm: !this.state.secureTextEntry_confirm
    })
  }

  render() {
    const {error} = this.props
    let diffPasswordError

    return (
      <ImageBackground
        source={require('../../../assets/background.png')}
        style={{
          flex: 1
        }}
      >
        <KeyboardAwareScrollView style={styles.container}>
          {/* <ScrollView> */}
          <DismissKeyBoard>
            <SafeAreaView style={styles.container}>
              <View style={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.text_header}>crum</Text>
                </View>
                <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                  {error && error.response && (
                    <Text style={{color: 'red', alignSelf: 'center'}}>
                      {' '}
                      {error.response.data}{' '}
                    </Text>
                  )}

                  <Text style={{color: 'red', textAlign: 'center'}}>
                    {this.state.validationError}
                  </Text>

                  <Text style={{color: 'red', alignSelf: 'center'}}>
                    {diffPasswordError}
                  </Text>

                  <Text style={styles.text_footer}>Username</Text>
                  <View style={styles.action}>
                    <FontAwesome name="user-o" color="#05375a" size={20} />
                    <TextInput
                      placeholder="u s e r n a m e"
                      style={styles.textInput}
                      onChangeText={text => this.textInputChange(text)}
                    />

                    {this.state.check_textInputChange ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="green" size={20} />
                      </Animatable.View>
                    ) : null}
                  </View>

                  {/* password */}
                  <Text
                    style={[
                      styles.text_footer,
                      {
                        marginTop: 35
                      }
                    ]}
                  >
                    Password
                  </Text>
                  <View style={styles.action}>
                    <Feather name="lock" color="#05375a" size={20} />
                    {this.state.secureTextEntry ? (
                      <TextInput
                        placeholder="p a s s w o r d"
                        secureTextEntry={true}
                        style={styles.textInput}
                        value={this.state.password}
                        onChangeText={text =>
                          this.setState({
                            password: text
                          })
                        }
                      />
                    ) : (
                      <TextInput
                        placeholder="p a s s w o r d"
                        style={styles.textInput}
                        value={this.state.password}
                        onChangeText={text =>
                          this.setState({
                            password: text
                          })
                        }
                      />
                    )}
                    <TouchableOpacity onPress={() => this.secureTextEntry()}>
                      {this.state.secureTextEntry ? (
                        <Feather name="eye-off" color="gray" size={20} />
                      ) : (
                        <Feather name="eye" color="gray" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.text_footer,
                      {
                        marginTop: 35
                      }
                    ]}
                  >
                    Confirm Password
                  </Text>
                  <View style={styles.action}>
                    <Feather name="lock" color="#05375a" size={20} />
                    {this.state.secureTextEntry_confirm ? (
                      <TextInput
                        placeholder="p a s s w o r d"
                        secureTextEntry={true}
                        style={styles.textInput}
                        value={this.state.password_confirm}
                        onChangeText={text =>
                          this.setState({
                            password_confirm: text
                          })
                        }
                      />
                    ) : (
                      <TextInput
                        placeholder="p a s s w o r d"
                        style={styles.textInput}
                        value={this.state.password_confirm}
                        onChangeText={text =>
                          this.setState({
                            password_confirm: text
                          })
                        }
                      />
                    )}

                    <TouchableOpacity
                      onPress={() => this.secureTextEntry_confirm()}
                    >
                      {this.state.secureTextEntry_confirm ? (
                        <Feather name="eye-off" color="gray" size={20} />
                      ) : (
                        <Feather name="eye" color="gray" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.button}>
                    <TouchableOpacity
                      onPress={() => this.handleSignUp()}
                      style={[
                        styles.signIn,
                        {
                          borderColor: '#4dc2f8',
                          borderWidth: 1
                        }
                      ]}
                    >
                      <LinearGradient
                        colors={['#19ae9f', '#26decb']}
                        style={styles.signIn}
                      >
                        <Text
                          style={[
                            styles.textSign,
                            {
                              color: 'white'
                            }
                          ]}
                        >
                          Sign Up
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.textPrivate}>
                    <Text style={styles.color_textPrivate}>
                      By signing up you agree to our
                    </Text>
                    <Text
                      style={[
                        styles.color_textPrivate,
                        {
                          fontWeight: 'bold'
                        }
                      ]}
                    >
                      {' '}
                      Terms of Service
                    </Text>
                    <Text style={styles.color_textPrivate}> and </Text>
                    <Text
                      style={[
                        styles.color_textPrivate,
                        {
                          fontWeight: 'bold'
                        }
                      ]}
                    >
                      Privacy Policy
                    </Text>
                  </View>
                </Animatable.View>
              </View>
            </SafeAreaView>
          </DismissKeyBoard>
        </KeyboardAwareScrollView>
      </ImageBackground>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: '5%',
    paddingBottom: '10%',
    alignItems: 'center',
    height: '50%'
  },
  footer: {
    flex: 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: '5%',
    paddingVertical: '5%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  text_header: {
    color: 'purple',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 90,
    fontFamily: 'FuturaBoldI'
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: '2%',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: '2%'
  },
  textInput: {
    flex: 1,
    paddingLeft: '3%',
    color: '#05375a',
    marginTop: '1%',
    marginBottom: '1%'
  },
  button: {
    alignItems: 'center',
    marginTop: '7%'
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '2%'
  },
  color_textPrivate: {
    color: 'gray',
    fontSize: 11
  }
})

const mapState = state => {
  return {
    user: state.user,
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    auth: (userName, password) => dispatch(auth(userName, password, 'signup')),
    reset: () => dispatch(me())
  }
}

export default connect(mapState, mapDispatch)(DisSignUpComponent)

DisSignUpComponent.propTypes = {
  // name: PropTypes.string.isRequired,
  // displayName: PropTypes.string.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
