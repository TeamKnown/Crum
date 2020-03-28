import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView
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
import {auth, me} from '../store/user'
import PropTypes from 'prop-types'
import {DismissKeyBoard} from './DismissKeyBoard'
const {width, height} = Dimensions.get('window')

class DisSignInComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      check_textInputChange: false,
      password: '',
      userName: '',
      secureTextEntry: true,
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

  handleSignIn() {
    const {userName, password, validationError} = this.state
    this.setState({validationError: ''})

    if (userName === '')
      this.setState({validationError: 'Please enter your username'})
    else if (password === '')
      this.setState({validationError: 'Please enter your password'})
    else {
      this.props.auth(this.state.userName, this.state.password)
    }
  }

  textInputChange(value) {
    if (value.length > 4) {
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

  render() {
    const {error} = this.props

    return (
      <ImageBackground
        source={require('../../public/background.png')}
        style={{
          flex: 1,
          width: null,
          height: null
        }}
      >
        <KeyboardAwareScrollView style={styles.container}>
          <DismissKeyBoard>
            <SafeAreaView style={styles.container}>
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
                      placeholder="Your password..."
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
                <Text style={{color: '#19ae9f', marginTop: 15}}>
                  Forgot password?
                </Text>

                <View style={styles.button}>
                  <TouchableOpacity
                    onPress={() => this.handleSignIn()}
                    style={[
                      styles.signIn,
                      {
                        borderColor: '#19ae9f',
                        borderWidth: 1,
                        marginTop: -30
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
                        Sign In
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    style={[
                      styles.signIn,
                      {
                        borderColor: '#19ae9f',
                        borderWidth: 1,
                        marginTop: '3%'
                      }
                    ]}
                  >
                    <Text
                      style={
                        ([styles.textSign],
                        {
                          color: '#19ae9f'
                        })
                      }
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
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
    paddingBottom: '13%',
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
    marginTop: '13%'
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
    auth: (userName, password) => dispatch(auth(userName, password, 'login')),
    reset: () => dispatch(me())
  }
}

export default connect(mapState, mapDispatch)(DisSignInComponent)

DisSignInComponent.propTypes = {
  // name: PropTypes.string.isRequired,
  // displayName: PropTypes.string.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
