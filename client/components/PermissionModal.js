import Modal from 'react-native-modal'

import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Linking,
  Button,
  TouchableOpacity
} from 'react-native'

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
            Hi 👾! Would you like to allow "Crum" to access your location while
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
  container: {},
  content: {
    backgroundColor: 'white',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: '3%'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
