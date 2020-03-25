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
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
// import {LinearGradient} from "react-native-linear-gradient"
import {LinearGradient} from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from 'react-native-elements'
import {connect} from 'react-redux'
import {auth} from '../store/user'
import UserProfile from './UserProfile'
import PropTypes from 'prop-types'
const DismissKeyBoard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)
const {width, height} = Dimensions.get('window')
class DisSignInComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      check_textInputChange: false,
      password: '',
      email: '',
      secureTextEntry: true
    }
  }

  async handleSignIn() {
    await this.props.auth(this.state.email, this.state.password)
  }

  textInputChange(value) {
    if (value.length !== 0) {
      this.setState({
        check_textInputChange: true,
        email: value
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
        <DismissKeyBoard>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.text_header}>CRUM</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
              {error && error.response && (
                <Text style={{color: 'red', alignSelf: 'center'}}>
                  {' '}
                  {error.response.data}{' '}
                </Text>
              )}

              <Text style={styles.text_footer}>E-MAIL</Text>
              <View style={styles.action}>
                <FontAwesome name="user-o" color="#05375a" size={20} />
                <TextInput
                  placeholder="Your email..."
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
                    placeholder="Your password..."
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
              <Text style={{color: '#009bd1', marginTop: 15}}>
                Forgot password?
              </Text>

              <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => this.handleSignIn()}
                  style={[
                    styles.signIn,
                    {
                      borderColor: '#4dc2f8',
                      borderWidth: 1,
                      marginTop: -50
                    }
                  ]}
                >
                  <LinearGradient
                    colors={['#5db8fe', '#39cff2']}
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
                      borderColor: '#4dc2f8',
                      borderWidth: 1,
                      marginTop: 15
                    }
                  ]}
                >
                  <Text
                    style={
                      ([styles.textSign],
                      {
                        color: '#4dc2f8'
                      })
                    }
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </View>
        </DismissKeyBoard>
      </ImageBackground>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: '#05375a'
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
    height: '50%'
  },
  footer: {
    flex: 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: 'purple',
    fontWeight: 'bold',
    fontSize: 90,
    fontFamily: 'FuturaBoldE'
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#05375a'
  },
  button: {
    alignItems: 'center',
    marginTop: 50
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
    auth: (email, password) => dispatch(auth(email, password, 'login'))
  }
}

export default connect(mapState, mapDispatch)(DisSignInComponent)

DisSignInComponent.propTypes = {
  // name: PropTypes.string.isRequired,
  // displayName: PropTypes.string.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
