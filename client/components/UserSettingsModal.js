import * as React from 'react'
import {connect} from 'react-redux'
import {getSingleUser} from '../store'
import {updateUserThunk} from '../store/'
import {LinearGradient} from 'expo-linear-gradient'
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

class UserSettingsModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  state = {
    visible: false
  }

  setModalVisible(visible) {
    this.setState({
      visible: visible
    })
  }

  handleSubmit(userId, info) {
    this.props.editUser(userId, info)
  }
  render() {
    const {user} = this.props
    return (
      <LinearGradient style={styles.btnCrum} colors={['#7c1e9f', '#bd7cde']}>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true)
            }}
          >
            <Text style={{color: 'white'}} title="settings">
              s e t t i n g s
            </Text>
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
                <Text>e d i t s e t t i n g s</Text>

                <TouchableOpacity
                  style={styles.btnDrop}
                  onPress={() => {
                    this.setModalVisible(!this.state.visible)
                  }}
                >
                  <Text style={{color: '#19ae9f'}} title="edit">
                    u p d a t e
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </LinearGradient>
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
    // textAlign: 'center',   // april's comment: causes error
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  btnCrum: {
    width: '47%',
    height: 60,
    backgroundColor: '#7c1e9f',
    // textAlign: 'center',   // april's comment: causes error
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
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

export default connect(mapState, mapDispatch)(UserSettingsModal)
