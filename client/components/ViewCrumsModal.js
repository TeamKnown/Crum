import * as React from 'react'
import {connect} from 'react-redux'
import {getSingleUser} from '../store'
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

class ViewCrumsModal extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    visible: false
  }

  setModalVisible(visible) {
    this.setState({
      visible: visible
    })
  }

  render() {
    const {user} = this.props
    console.log('user', user)
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
              <Text>e d i t</Text>
              <Text>u s e r</Text>

              <TouchableOpacity
                style={styles.btnDrop}
                onPress={() => {
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
    )
  }
}

const styles = StyleSheet.create({
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
    marginTop: 8
  }
})

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleUser: id => dispatch(getSingleUser(id))
  }
}

export default connect(mapState, mapDispatch)(ViewCrumsModal)
