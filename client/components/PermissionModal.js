import Modal from 'react-native-modal'

import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Linking,
  Button,
  Alert
} from 'react-native'

export default function PermissionModal(props) {
  const goToSettings = () => {
    Linking.openURL('app-settings:')
  }

  return (
    <View>
      <Modal isVisible={!props.isGranted}>
        <View style={styles.content}>
          <Text style={styles.contentTitle}>
            Hi 👋! Please change your location permissions if you'd like to use
            our app!
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
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

    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
})
