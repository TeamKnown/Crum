import * as React from 'react'
import {connect} from 'react-redux'
import {
  Platform,
  Button,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity
} from 'react-native'

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    // this.handleEdit = this.handleEdit.bind(this)
  }
  // componentDidMount() {
  //   this.props.getSingleUser(this.props.match.params.id)
  // }
  // handleEdit = id => {
  //   this.props.history.push(`/users/${id}/edit`)
  // }
  render() {
    const {userName, email, password} = this.props
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
            <Text
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16
              }}
            >
              u s e r n a m e:
            </Text>
            {userName ? (
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16
                }}
              >
                {userName}
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
                marginTop: 16
              }}
            >
              c r u m s d r o p p e d:
            </Text>
            <Text
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16
              }}
            >
              {}
            </Text>
          </View>
          <TouchableOpacity style={styles.btnCrums}>
            <Text
              style={{color: 'white'}}
              title="update"
              onPress={this.handleClick}
            >
              m y c r u m s
            </Text>
          </TouchableOpacity>
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
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '10%'
  },
  btnCrums: {
    height: 60,
    width: '90%',
    backgroundColor: '#7c1e9f',
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  }
})
