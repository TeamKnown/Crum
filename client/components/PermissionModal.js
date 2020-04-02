import Modal from 'react-native-modal'

import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View, Linking} from 'react-native'

export default function PermissionModal(props) {
  const goToSettings = () => {
    Linking.openURL('app-settings:')
  }

  return (
    <View style={styles.container}>
      <Modal
        isVisible={!props.isGranted}
        onBackdropPress={() => props.closeModal()}
      >
        <View style={styles.content}>
          <Text style={styles.contentTitle}>
            Hey 👾! Can Crum access your location while you are using the app?
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => props.closeModal()}
            >
              <Text style={styles.btnText} title="Close">
                Close
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => goToSettings()}>
              <Text style={styles.btnText} title="Settings">
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20
  },
  contentTitle: {
    fontSize: 18,
    marginBottom: '3%'
  },
  buttons: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btn: {
    borderColor: '#19ae9f',
    borderWidth: 2,
    flex: 2,
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(250,250,250,0.8)',
    padding: '3%',
    margin: '2%'
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500'
  }
})
