import * as React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native'
import Expo from 'expo'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'

import {withState} from 'recompose'
import crumInstancesReducer from '../store/crumInstances'
export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {signedIn: false, name: '', photoUrl: ''}
  }

  render() {
    return (
      <ImageBackground
        source={require('../../assets/background.png')}
        style={{
          flex: 1,
          width: null,
          height: null
        }}
      >
        <View style={styles.main}>
          <View style={styles.logo}>
            <Image
              source={require('../../assets/crum.png')}
              style={{width: '100%'}}
            />
          </View>
          <View style={styles.container}>
            <TextInput
              required
              id="userName"
              textAlign="center"
              style={styles.input}
              placeholder="u s e r n a m e"
              autoComplete="userName"
              type="text"
            />
            <TextInput
              required
              type="password"
              id="password"
              textAlign="center"
              style={styles.input}
              placeholder="p a s s w o r d"
              autoComplete="current-password"
              secureTextEntry
            />
            <TouchableOpacity style={styles.btnLogin}>
              <Text style={{color: 'white'}}>l o g i n</Text>
            </TouchableOpacity>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.btn} type="submit">
                <Text style={{color: 'white'}}>s i g n u p</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} href="/auth/google">
                <Text style={{color: 'white'}}>G o o g l e l o g i n</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    paddingBottom: 10
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-end',
    alignItems: 'center',
    height: '50%'
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
  },
  buttons: {
    height: '100%',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnLogin: {
    width: '90%',
    height: 60,
    backgroundColor: '#19ae9f',
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    margin: 8
  },
  btn: {
    width: '47%',
    height: 60,
    backgroundColor: '#7c1e9f',
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  }
})
