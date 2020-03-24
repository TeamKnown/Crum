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
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert
} from 'react-native'

export default class UserProfile extends React.Component {
  constructor() {
    super()
    // this.handleEdit = this.handleEdit.bind(this)
  }
  state = {
    visible: false
  }
  setModalVisible(visible) {
    this.setState({
      visible: visible
    })
  }
  // componentDidMount() {
  //   this.props.getSingleUser(this.props.match.params.id)
  // }
  // handleEdit = id => {
  //   this.props.history.push(`/users/${id}/edit`)
  // }
  handleChange(event) {
    this.setState({
      userName: event.nativeEvent.text,
      email: event.nativeEvent.text,
      password: event.nativeEvent.text
    })
  }
  render() {
    const {user} = this.props
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
            <View style={styles.buttons}>
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                  fontWeight: 'bold'
                }}
              >
                u s e r n a m e
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(true)
                }}
              >
                <Image
                  source={require('../../public/editIcon3.png')}
                  style={{
                    width: 15,
                    height: 15,
                    marginBottom: '14%',
                    marginLeft: 7
                  }}
                />
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
                    <TextInput
                      id="userName"
                      value={this.state.userName}
                      onChange={this.handleChange}
                      textAlign="center"
                      style={styles.input}
                      placeholder={this.state.userName}
                      type="text"
                    />
                    <TextInput
                      id="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      textAlign="center"
                      style={styles.input}
                      placeholder={this.state.email}
                      type="text"
                    />
                    <TextInput
                      required
                      id="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      textAlign="center"
                      style={styles.input}
                      placeholder={this.state.password}
                      type="password"
                    />
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
            {user ? (
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16
                }}
              >
                {user.userName}
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
                marginTop: 16,
                fontWeight: 'bold'
              }}
            >
              c r u m s d r o p p e d
            </Text>
            {user ? (
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                  fontSize: 40
                }}
              >
                {user.crumInstances.length}
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
          </View>
          <TouchableOpacity
            style={styles.btnCrums}
            onPress={() => {
              this.setModalVisible(true)
            }}
          >
            <Text style={{color: 'white'}} title="update">
              m y c r u m s
            </Text>
          </TouchableOpacity>
          {/*<Modal
            animationType="none"
            transparent={false}
            visible={this.state.visible}
            onRequestClose={() => {
              Alert.alert('Modal closed')
            }}
          >
            <View style={styles.modalContainer}>
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
                </Modal>*/}
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
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '4%'
  },
  btnCrums: {
    height: 60,
    width: '90%',
    backgroundColor: '#7c1e9f',
    textAlign: 'center',
    borderRadius: 10,
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around'
  }
})
