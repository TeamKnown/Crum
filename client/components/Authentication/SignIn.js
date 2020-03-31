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

import {connect} from 'react-redux'
import {auth, me} from '../../store/user'
import PropTypes from 'prop-types'
import {DismissKeyBoard} from '../DismissKeyBoard'
import {background} from '../../../assets/'
const {width, height} = Dimensions.get('window')

class DisSignInComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checkTextInputChange: false,
      password: '',
      userName: '',
      secureTextEntry: true,
      validationError: ''
    }
  }

  componentDidMount() {
    const {navigation} = this.props
    navigation.addListener('focus', () => this.props.reset())
  }

  handleSignIn() {
    const {userName, password} = this.state
    this.setState({validationError: ''})

    if (userName === '')
      this.setState({validationError: 'Please enter your username'})
    else if (password === '')
      this.setState({validationError: 'Please enter your password'})
    else {
      this.props.auth(this.state.userName, this.state.password)
    }
  }

  textInputChange(input) {
    input.length > 0
      ? this.setState({
          checkTextInputChange: true,
          userName: input
        })
      : this.setState({
          checkTextInputChange: false
        })
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
        source={background}
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
                <Text style={styles.textHeader}>crum</Text>
              </View>
              <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                {error && error.response && (
                  <Text style={styles.textError}>{error.response.data}</Text>
                )}

                <Text style={styles.textError}>
                  {this.state.validationError}
                </Text>

                <Text style={styles.textFooter}>Username</Text>
                <View style={styles.action}>
                  <FontAwesome name="user-o" color="#05375a" size={20} />
                  <TextInput
                    placeholder="u s e r n a m e"
                    style={styles.textInput}
                    onChangeText={text => this.textInputChange(text)}
                  />

                  {this.state.checkTextInputChange ? (
                    <Animatable.View animation="bounceIn">
                      <Feather name="check-circle" color="green" size={20} />
                    </Animatable.View>
                  ) : null}
                </View>

                <Text style={[styles.textFooter, styles.extraMarginTop]}>
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
                <Text style={styles.forgotPw} />

                <View style={styles.button}>
                  <TouchableOpacity
                    onPress={() => this.handleSignIn()}
                    style={[styles.signIn, styles.signInExtras]}
                  >
                    <LinearGradient
                      colors={['#19ae9f', '#26decb']}
                      style={styles.signIn}
                    >
                      <Text style={[styles.textSign, styles.whiteText]}>
                        Sign In
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    style={[styles.signIn, styles.signUpExtras]}
                  >
                    <Text style={[styles.textSign, styles.tealText]}>
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

let styles = StyleSheet.create({
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
  textHeader: {
    color: 'purple',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 90,
    fontFamily: 'FuturaBoldI'
  },
  textFooter: {
    color: '#05375a',
    fontSize: 18
  },
  textError: {
    color: 'red',
    alignSelf: 'center'
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
  signInExtras: {
    borderColor: '#19ae9f',
    borderWidth: 1,
    marginTop: -30
  },
  signUpExtras: {
    borderColor: '#19ae9f',
    borderWidth: 1,
    marginTop: 5
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  forgotPw: {
    color: '#19ae9f',
    marginTop: '3%'
  },
  extraMarginTop: {
    marginTop: '8%'
  },
  whiteText: {
    color: 'white'
  },
  tealText: {
    color: '#19ae9f'
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
  error: PropTypes.object
}
