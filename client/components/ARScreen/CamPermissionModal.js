import Modal from 'react-native-modal'

import React from 'react'
import {StyleSheet, Text, View, Linking, Button} from 'react-native'

export default function PermissionModal(props) {
  const goToSettings = () => {
    Linking.openURL('app-settings:')
  }

  return (
    <View>
      <Modal
        isVisible={!props.isGranted}
        onBackdropPress={() => props.closeModal()}
      >
        <View style={styles.content}>
          <Text style={styles.contentTitle}>
            Hi 🍞! Would you like to allow "Crum" to access your camera 📷 while
            you are using the app?
          </Text>

          <View style={styles.buttons}>
            <Button onPress={() => props.closeModal()} title="Close" />
            <Button onPress={() => goToSettings()} title="Settings" />
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  contentTitle: {
    fontSize: 18,
    marginBottom: '3%'
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
