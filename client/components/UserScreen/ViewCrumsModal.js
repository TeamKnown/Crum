/* eslint no-multi-spaces: 0 */
import * as React from 'react'
import {connect} from 'react-redux'
// import {
//   getSingleUser,
//   fetchUserCrumInstances,

// } from '../store'
import {imageThumbnails, background} from '../../../assets'
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
  Alert,
  ScrollView
} from 'react-native'

class ViewCrumsModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleGetCrum = this.handleGetCrum.bind(this)
  }
  state = {
    visible: false
  }

  async handleGetCrum(userId) {
    this.props.getSingleUser(userId)
    await this.props.getUserCrumInstances(userId)
  }

  setModalVisible(visible) {
    this.setState({
      visible: visible
    })
  }

  render() {
    if (this.state.modalVisible) {
      scrollYPos = this.state.screenHeight * 1
      this.scroller.scrollTo({x: 0, y: scrollYPos})
    }
    const {user, crumInstances, crums} = this.props

    return (
      <View>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => {
            this.handleGetCrum(user.id)
            this.setModalVisible(true)
          }}
        >
          <Text style={styles.heading}>crums</Text>
          <Text style={styles.heading}>dropped</Text>
          {user.id ? (
            <Text style={styles.count}>{user.totalCrums}</Text>
          ) : (
            <Text style={styles.count}>0</Text>
          )}
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.visible}
          onRequestClose={() => {
            Alert.alert('Modal closed')
          }}
        >
          <ImageBackground source={background} style={styles.root}>
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                {!crumInstances.length ? (
                  <Text style={styles.noCrums}>no crums</Text>
                ) : (
                  <Text style={styles.crumsTitle}>My Crums:</Text>
                )}
                <ScrollView style={styles.scrollBox}>
                  {crumInstances &&
                    crumInstances.length > 0 &&
                    crumInstances.map(crum => (
                      <View style={styles.instance} key={crum.id}>
                        <Image
                          source={imageThumbnails[crum.crum.name]}
                          style={styles.imageThumbs}
                          borderWidth={crum.isPrivate === true ? 2 : 0}
                        />
                        <View style={styles.instanceText}>
                          {crum.message.length > 24 ? (
                            <Text style={styles.each}>
                              {crum.message.slice(0, 24)}...
                            </Text>
                          ) : (
                            <Text style={styles.each}>{crum.message}</Text>
                          )}
                          {crum.status === 'floating' && (
                            <Text style={styles.each}>
                              Remaining: {crum.numLeft}
                            </Text>
                          )}
                          {crum.status === 'collected' && (
                            <Text style={styles.each}>
                              Collected by: {crum.recipient.userName}
                            </Text>
                          )}
                          {/* <Text>Dropped at: {crum.createdAt}</Text> */}
                        </View>
                      </View>
                    ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.btnDrop}
                  onPress={() => {
                    this.setModalVisible(!this.state.visible)
                  }}
                >
                  <Text style={styles.update} title="edit">
                    back
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%'
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    fontWeight: 'bold',
    fontFamily: 'APompadourBold',
    letterSpacing: 7
  },
  count: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    fontSize: 40
  },
  noCrums: {
    fontFamily: 'APompadourBold',
    letterSpacing: 7
  },
  crumsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'APompadourBold'
  },
  imageThumbs: {
    width: 40,
    height: 40,
    margin: 10,
    borderRadius: 3,
    borderColor: 0x26decb //0xbd7cde
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-evenly',
    borderColor: '#7c1e9f',
    height: '70%',
    borderRadius: 10,
    marginTop: 100
  },
  modalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollBox: {
    width: '100%',
    marginLeft: '5%'
  },
  instance: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 8,
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  each: {
    fontFamily: 'APompadour'
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
    marginTop: 8,
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  update: {
    color: '#19ae9f',
    fontFamily: 'APompadourBold',
    letterSpacing: 7
  }
})

const mapState = state => {
  return {
    user: state.user,
    crums: state.crums,
    crumInstances: state.crumInstancesDropped
  }
}

// const mapDispatch = dispatch => {
//   return {
//     getSingleUser: id => dispatch(getSingleUser(id))
//   }
// }

export default connect(mapState)(ViewCrumsModal)
