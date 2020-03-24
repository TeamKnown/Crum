/* eslint-disable no-use-before-define */
import {AR} from 'expo'
import {GraphicsView} from 'expo-graphics'
import {Renderer, THREE} from 'expo-three'
// import {Asset} from 'expo-asset'
import {BackgroundTexture, Camera} from 'expo-three-ar'
import {connect} from 'react-redux'
import * as React from 'react'
import {computePos, SCALER} from './utils'
import {
  Platform,
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native'
import {
  getCurrentPosition,
  stopTracking,
  fetchCrums,
  postCrumInstance,
  fetchNearByCrumInstances
} from '../store/'
import {images, fonts} from '../../assets/'
import {createCube, createPlane, createText} from './Crums.js'

let renderer, scene, camera

class DisARScreen extends React.Component {
  constructor() {
    super()
    this.handleOpenModel = this.handleOpenModel.bind(this)
    this.handleTypeMessage = this.handleTypeMessage.bind(this)
  }
  state = {
    longitudeIdx: undefined, // longitudeIdx is the integer version of longitude it is the floor of (SCALER * longitude)
    latitudeIdx: undefined, // likewise, it is floor of (SCALER * latitude)
    modalVisible: false,
    message: '',
    imgName: '',
    loading: true
  }
  setModalVisible(modalVisible) {
    this.setState({
      modalVisible: modalVisible
    })
  }
  componentDidMount = () => {
    this.props.subscribeToLocationData() // this subscribed to update current locations every time interval
    this.props.fetchCrums()
  }
  componentWillUnmount = () => {
    this.props.unsubscribeToLocationData() // this unsubscribed to update current locations
  }
  handleOpenModel = () => {
    this.props.dropCrumInstances({
      longitude: this.props.locations.longitude,
      latitude: this.props.locations.latitude
    })
  }
  handleTypeMessage(event) {
    this.setState({
      message: event.nativeEvent.text
    })
  }
  // longitudeIdx is the integer version of longitude it is the floor of (SCALER * longitude)
  // likewise latitude is the floor of (SCALER * latitude)
  // we get longitudeIdx and latitude from REDUX store, and store it in our REACT state
  // when longitudeIdx or latitude in REDUX store changes, we update REACT state
  // we also requery the list of nearby crums
  // this is subject to future optimization and code refactoring
  // More at https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations
  static getDerivedStateFromProps(props, state) {
    if (
      Number.isInteger(props.locations.longitudeIdx) && //initially longitudeIdx and latitudeIdx are NaN
      Number.isInteger(props.locations.latitudeIdx) &&
      state.loading === true
    ) {
      console.log('remounting', 'state', state.longitudeIdx, state.latitudeIdx)
      return {
        ...state,
        loading: false
      }
    }
    if (
      Number.isInteger(props.locations.longitudeIdx) && //initially longitudeIdx and latitudeIdx are NaN
      Number.isInteger(props.locations.latitudeIdx) &&
      (props.locations.latitudeIdx !== state.latitudeIdx ||
        props.locations.longitudeIdx !== state.longitudeIdx)
    ) {
      props.fetchCrumInstances(
        props.locations.latitudeIdx,
        props.locations.longitudeIdx
      ) // fetch the list of nearby crums
      return {
        ...state,
        latitudeIdx: props.locations.latitudeIdx,
        longitudeIdx: props.locations.longitudeIdx,
        numCrum: props.locations.length,
        loading: true
      }
    } else {
      return state
    }
  }
  render() {
    const {locations, crumInstances, numCrum, crums} = this.props
    // console.log('CRUM INSTANCES AR VIEW:', numCrum)
    AR.setWorldAlignment('gravityAndHeading') // The coordinate system's y-axis is parallel to gravity, its x- and z-axes are oriented to compass heading, and its origin is the initial position of the device. z:1 means 1 meter South, x:1 means 1 meter east. other options are alignmentCamera and gravity
    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

    const onContextCreate = async ({gl, pixelRatio, width, height}) => {
      this.setState({loading: false})
      AR.setWorldAlignment('gravityAndHeading')
      renderer = new Renderer({gl, pixelRatio, width, height})
      scene = new THREE.Scene()
      scene.background = new BackgroundTexture(renderer)
      camera = new Camera(width, height, 0.01, 1000)

      crumInstances.forEach(async crumInstance => {
        const pos = computePos(crumInstance, locations)
        scene.add(
          await createPlane(0xffffff, images[crumInstance.crum.name], pos)
        )
      })

      scene.add(new THREE.AmbientLight(0xffffff))
    }

    const onResize = ({scale, width, height}) => {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(scale)
      renderer.setSize(width, height)
    }

    const onRender = delta => {
      // run every frame
      renderer.render(scene, camera)
    }

    return (
      <ImageBackground
        source={require('../../public/background.png')}
        style={{
          flex: 1,
          width: null,
          height: null
        }}
      >
        <View style={styles.main}>
          <View style={{flex: 1}}>
            {this.state.loading === false ? (
              <View style={{flex: 1, height: '100%'}}>
                <GraphicsView
                  style={{flex: 1}}
                  onContextCreate={onContextCreate}
                  onRender={onRender}
                  onResize={onResize}
                  isArEnabled
                  // isArRunningStateEnabled
                  isArCameraStateEnabled
                />
              </View>
            ) : (
              <Text style={{color: '#19ae9f'}} title="Drop!">
                wait
              </Text>
            )}
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.btnDrop}
                onPress={() => {
                  this.setModalVisible(true)
                }}
              >
                <Text style={{color: '#19ae9f'}} title="Drop!">
                  d r o p
                </Text>
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  this.handleOpenModel()
                  Alert.alert('Modal closed')
                }}
              >
                <View style={styles.container}>
                  <View style={styles.modal}>
                    <TextInput
                      required
                      id="message"
                      value={this.state.message}
                      onChange={this.handleTypeMessage}
                      textAlign="center"
                      style={styles.input}
                      placeholder="m e s s a g e"
                      autoComplete="message"
                      type="text"
                    />
                    <Text>Select Crum</Text>
                    <View
                      style={{
                        width: '80%',
                        height: '70%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}
                    >
                      {crums.map(crum => (
                        <TouchableOpacity
                          key={crum.id}
                          onPress={() => {
                            // console.log(this.state)
                            this.setState({
                              imgName: crum.name
                            })
                          }}
                        >
                          <Image
                            style={{width: 50, height: 50, margin: 6}}
                            borderColor={0xf44336}
                            borderWidth={
                              this.state.imgName === crum.name ? 10 : 0
                            }
                            source={images[crum.name]}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={styles.btnDrop}
                      onPress={() => {
                        // console.log('drop!!!', this.state)
                        this.setModalVisible(!this.state.modalVisible)
                      }}
                    >
                      <Text style={{color: '#19ae9f'}} title="Drop!">
                        d r o p
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const mapState = state => ({
  locations: {
    ...state.locations,
    longitudeIdx: Math.floor(state.locations.longitude * SCALER),
    latitudeIdx: Math.floor(state.locations.latitude * SCALER)
  },
  numCrum: state.crumInstances.length,
  crumInstances: state.crumInstances,
  crums: state.crums
})
const mapDispatch = dispatch => {
  return {
    subscribeToLocationData: () => {
      dispatch(getCurrentPosition())
    },
    unsubscribeToLocationData: () => {
      dispatch(stopTracking())
    },
    fetchCrums: () => {
      dispatch(fetchCrums())
    },
    fetchCrumInstances: (latitudeIdx, longitudeIdx) => {
      dispatch(fetchNearByCrumInstances(latitudeIdx, longitudeIdx))
    },
    dropCrumInstances: newCrum => {
      dispatch(postCrumInstance(newCrum))
    }
  }
}

const ARScreen = connect(mapState, mapDispatch)(DisARScreen)

export default ARScreen

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    paddingBottom: 10
  },
  modal: {
    flex: 1,
    width: '90%',
    height: '80%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#7c1e9f',
    alignSelf: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    margin: 20
  },
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  btnDrop: {
    height: 60,
    width: '90%',
    backgroundColor: 'white',
    borderColor: '#19ae9f',
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30
  },
  input: {
    height: 120,
    width: '90%',
    borderRadius: 10,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 2,
    alignItems: 'center',
    padding: 8,
    marginTop: 30
  }
})
