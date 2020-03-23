import React from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Alert
} from 'react-native'

export default class DropModal extends React.Component {
  constructor() {
    super()
    // this.handleEdit = this.handleEdit.bind(this)
    this.state = {
      visible: false
    }
  }

  setModalVisible(visible) {
    this.setState({
      visible: visible
    })
  }
  render() {
    return (
      <View style={styles.main}>
        <Modal
          animationType="none"
          transparent={false}
          visible={this.state.visible}
          onRequestClose={() => {
            Alert.alert('Modal closed')
          }}
        >
          <View style={styles.container}>
            <View style={styles.modal}>
              <Text>Select Crum</Text>
              <TouchableOpacity
                style={styles.btnDrop}
                onPress={() => {
                  this.setModalVisible(!this.state.visible)
                }}
              >
                <Text style={{color: '#19ae9f'}} title="Drop!">
                  d r o p
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true)
          }}
        >
          <Text>Show</Text>
        </TouchableHighlight>
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
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderColor: '#7c1e9f',
    width: '90%',
    height: '60%',
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    marginTop: 100
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
    marginTop: 16
  },
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
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
