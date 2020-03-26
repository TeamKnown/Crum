import * as React from 'react'
import {connect} from 'react-redux'
import {getSingleUser, fetchUserCrumInstances} from '../store'
import {images} from '../../assets/'
// import {} from '../store/'

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
import crumInstancesReducer from '../store/crumInstances'

class ViewCrumsModal extends React.Component {
  constructor(props) {
    super(props)
    // this.handleGetCrum = this.handleGetCrum.bind(this)
  }
  state = {
    visible: false
  }
  componentDidMount() {
    this.props.getSingleUser(this.props.user.id)
    this.props.getUserCrumInstances(this.props.user.id)
  }

  // handleGetCrum(userId) {
  //   this.props.getUserCrumInstances(userId)
  // }

  setModalVisible(visible) {
    this.setState({
      visible: visible
    })
  }

  render() {
    const {user, crums} = this.props
    console.log('user', user)
    const {crumInstances} = this.props
    console.log('userCrums', crumInstances)

    return (
      <View>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => {
            this.setModalVisible(true)
          }}
        >
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
              <Text>m y c r u m s</Text>
              {crumInstances.map(crum => (
                <View style={styles.instance}>
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      margin: 6,
                      borderColor: 'black',
                      borderWidth: 2
                    }}
                  />
                  <Text>{crum.message}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.btnDrop}
                onPress={() => {
                  this.setModalVisible(!this.state.visible)
                }}
              >
                <Text style={{color: '#19ae9f'}} title="edit">
                  b a c k
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

  modalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  instance: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 8
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
  }
})

const mapState = state => {
  return {
    user: state.user,
    crums: state.crums,
    crumInstances: state.crumInstances
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleUser: id => dispatch(getSingleUser(id)),
    getUserCrumInstances: userId => {
      dispatch(fetchUserCrumInstances(userId))
    }
  }
}

export default connect(mapState, mapDispatch)(ViewCrumsModal)
