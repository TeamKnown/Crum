/* eslint-disable complexity */
/* eslint-disable no-use-before-define */
import {AR} from 'expo'
import {GraphicsView} from 'expo-graphics'
import {Renderer, THREE} from 'expo-three'
import {BackgroundTexture, Camera} from 'expo-three-ar'
import {connect} from 'react-redux'
import * as React from 'react'
import {
  computePos,
  SCALER,
  crumInstanceNamer,
  crumInstanceParser
} from '../utils'
import {
  Platform,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Vibration,
  Text,
  TouchableOpacity
} from 'react-native'
import {
  getCurrentPosition,
  stopTracking,
  fetchCrums,
  fetchNearByCrumInstances,
  // fetchCrumInstanceDetail,
  me
} from '../../store/'
import DropCrumForm from './DropCrumForm'
import EditDeleteCrumForm from './EditDeleteCrumForm'
import {images, fonts} from '../../../assets/'
import {createPlane} from './Crums.js'
import * as Permissions from 'expo-permissions'
import CamPermissionModal from './CamPermissionModal'

// import {Constants, Location, Permissions} from 'expo'
// if you get error ativeModule.RNDeviceInfo is null
// run this command:
//npx react-native-clean-project clean-project-auto
// react-native link react-native-device-info
// import DeviceInfo from 'react-native-device-info'
// import {getUniqueId, getManufacturer} from 'react-native-device-info'
// import {request, PERMISSIONS} from 'react-native-permissions'

let scene
class DisARScreen extends React.Component {
  constructor(props) {
    super()
    this.state = {
      longitudeIdx: undefined, // longitudeIdx is the integer version of longitude it is the floor of (SCALER * longitude)
      latitudeIdx: undefined, // likewise, it is floor of (SCALER * latitude),
      crumInstances: [],
      dropCrumFormVisible: false,
      editDeleteCrumFormVisible: false,
      crumClickedParsed: {},
      errorMessage: null,
      isGranted: true
    }

    this.updateTouch = this.updateTouch.bind(this)
    this.hideDropCrumForm = this.hideDropCrumForm.bind(this)
    this.showDropCrumForm = this.showDropCrumForm.bind(this)
    this.hideEditDeleteCrumForm = this.hideEditDeleteCrumForm.bind(this)
  }

  requestCameraPermission = async () => {
    let {status} = await Permissions.askAsync(Permissions.CAMERA)

    if (status !== 'granted') {
      this.setState({
        isGranted: false
      })
    } else {
      this.setState({isGranted: true})
      // this.props.subscribeToLocationData()
    }
  }

  closeModal = () => {
    this.setState({isGranted: true})
  }

  // getiPhoneModel = () => {
  //   function _getiPhoneModel() {
  //     if (
  //       window.devicePixelRatio >= 3 &&
  //       ((window.innerHeight == 368 && window.innerWidth == 207) ||
  //         (window.innerHeight == 667 && window.innerWidth == 375) ||
  //         (window.innerHeight == 736 && window.innerWidth == 414) ||
  //         (window.innerHeight == 812 && window.innerWidth == 375) ||
  //         (window.innerHeight >= 812 && window.innerWidth >= 375))
  //     ) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   }
  //   // const deviceInfo1 = 'getModel:  ' + DeviceInfo.getModel()
  //   // console.log('IPHONE MODEL', deviceInfo1)
  //   console.log('IPHONE MODEL', _getiPhoneModel())
  //   console.log('SCREEN PIXEL', window.devicePixelRatio)
  //   console.log('SCREEN Height', window.innerHeight)
  //   console.log('SCREEN Width', window.innerWidth)
  // }

  touch = new THREE.Vector2()
  raycaster = new THREE.Raycaster()

  componentDidMount = () => {
    // this.getiPhoneModel()

    this.requestCameraPermission()

    THREE.suppressExpoWarnings(true)
    this.props.fetchCrums()
  }
  componentWillUnmount = () => {
    // this.props.unsubscribeToLocationData()

    THREE.suppressExpoWarnings(false)
  }

  runHitTest = () => {
    this.raycaster.setFromCamera(this.touch, this.camera)
    const intersects = this.raycaster.intersectObjects([scene], true)
    if (intersects.length > 0) {
      let crumClicked = intersects[intersects.length - 1].object.name
      let crumClickedParsed = crumInstanceParser(crumClicked)
      this.setState({
        editDeleteCrumFormVisible: true,
        crumClickedParsed: crumClickedParsed
      })
    } else {
      this.setState({dropCrumFormVisible: true})
    }
  }
  updateTouch = evt => {
    let {height, width} = Dimensions.get('window')
    let x = evt.nativeEvent.locationX
    let y = evt.nativeEvent.locationY
    this.touch.x = (x / width) * 2 - 1
    this.touch.y = -(y / height) * 2 + 1
    this.runHitTest()
  }
  hideDropCrumForm = () => {
    this.setState({dropCrumFormVisible: false})
  }
  showDropCrumForm = () => {
    this.setState({dropCrumFormVisible: true})
  }
  hideEditDeleteCrumForm = () => {
    this.setState({editDeleteCrumFormVisible: false})
  }

  onContextCreate = async ({gl, pixelRatio, width, height}) => {
    this.setState({loading: false})
    // AR.setWorldAlignment('gravityAndHeading')
    // console.log('on contect create')
    // console.log(pixelRatio, width, height)
    this.renderer = new Renderer({gl, pixelRatio, width, height})
    scene = new THREE.Scene()
    scene.background = new BackgroundTexture(this.renderer)
    this.camera = new Camera(width, height, 0.01, 1000)

    scene.add(new THREE.AmbientLight(0xffffff))
    // console.log('end on contect create')
  }

  onRender = delta => {
    this.renderer.render(scene, this.camera)
  }

  // longitudeIdx is the integer version of longitude it is the floor of (SCALER * longitude), likewise latitude is the floor of (SCALER * latitude)
  // we get longitudeIdx and latitude from REDUX store, and store it in our REACT state
  // when longitudeIdx or latitude in REDUX store changes, we update REACT state
  // we also requery the list of nearby crums
  // this is subject to future optimization and code refactoring
  // More at https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations

  // Warning: THREE.Matrix3: .getInverse() can't invert matrix, determinant is 0 without any object
  static getDerivedStateFromProps(props, state) {
    const toAdd = props.crumInstances.filter(
      crumInstance =>
        !state.crumInstances.map(item => item.id).includes(crumInstance.id)
    )
    const toRemove = state.crumInstances.filter(
      crumInstance =>
        !props.crumInstances.map(item => item.id).includes(crumInstance.id)
    )

    if (scene !== undefined && (toAdd.length > 0 || toRemove.length > 0)) {
      const addCrums = async () => {
        // console.log('Too ADD')
        // console.log(JSON.stringify(toAdd))
        for (const crumInstance of toAdd) {
          // console.log('crum:', JSON.stringify(crumInstance.crum))
          if (crumInstance.crum === null) continue
          // console.log('crum continused:', JSON.stringify(crumInstance.crum))
          let pos = computePos(crumInstance, props.locations)
          let plane = await createPlane(
            0xffffff,
            images[crumInstance.crum.name],
            pos
          )
          let planeName = crumInstanceNamer(crumInstance)
          plane.name = planeName
          scene.add(plane)
          let newObj = scene.getObjectByName(planeName)
        }
      }

      const removeCrums = () => {
        // console.log('Too DELETE')
        // console.log(toRemove)
        for (const crumInstance of toRemove) {
          if (crumInstance.crum === null) continue
          let planeName = crumInstanceNamer(crumInstance)
          let planeToRemove = scene.getObjectByName(planeName)
          scene.remove(planeToRemove)
        }
      }
      addCrums()
      removeCrums()

      return {
        ...state,
        crumInstances: props.crumInstances.map(crumInstance => ({
          ...crumInstance
        }))
      }
    } else if (
      Number.isInteger(props.locations.longitudeIdx) && //initially longitudeIdx and latitudeIdx are NaN
      Number.isInteger(props.locations.latitudeIdx) &&
      (props.locations.latitudeIdx !== state.latitudeIdx ||
        props.locations.longitudeIdx !== state.longitudeIdx)
    ) {
      props.fetchCrumInstances(
        props.locations.latitudeIdx,
        props.locations.longitudeIdx
      )
      return {
        ...state,
        latitudeIdx: props.locations.latitudeIdx,
        longitudeIdx: props.locations.longitudeIdx
      }
    } else {
      return state
    }
  }
  render() {
    const {locations, crumInstances, crums} = this.props
    if (this.props.user.device === 'advanced') {
      AR.setWorldAlignment('gravityAndHeading')
    } // The coordinate system's y-axis is parallel to gravity, its x- and z-axes are oriented to compass heading, and its origin is the initial position of the device. z:1 means 1 meter South, x:1 means 1 meter east. other options are alignmentCamera and gravity
    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

    if (this.state.isGranted === false) {
      return (
        <CamPermissionModal
          isGranted={this.state.isGranted}
          closeModal={this.closeModal}
        />
      )
    } else {
      return (
        <ImageBackground
          source={require('../../../public/background.png')}
          style={{
            flex: 1,
            width: null,
            height: null
          }}
        >
          <View style={styles.main}>
            <View style={{flex: 1}}>
              <View style={{flex: 1, height: '100%', width: '100%'}}>
                {this.props.user.device !== 'noAR' ? (
                  <TouchableOpacity
                    onPress={evt => {
                      this.updateTouch(evt)
                    }}
                    activeOpacity={1.0}
                    style={{flex: 1}}
                  >
                    <GraphicsView
                      style={{flex: 1}}
                      onContextCreate={this.onContextCreate}
                      onRender={this.onRender}
                      isArEnabled
                      isArCameraStateEnabled
                    />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{flex: 1}}
                    opacity={this.state.dropCrumFormVisible ? 0 : 1}
                  >
                    <TouchableOpacity
                      style={{
                        ...styles.btn
                      }}
                      onPress={() => {
                        this.showDropCrumForm()
                      }}
                    >
                      <Text
                        style={{
                          color: '#19ae9f'
                        }}
                        title="Drop!"
                      >
                        d r o p
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {this.state.dropCrumFormVisible && (
                <DropCrumForm hideDropCrumForm={this.hideDropCrumForm} />
              )}
              {this.state.editDeleteCrumFormVisible && (
                <EditDeleteCrumForm
                  crumInstance={
                    crumInstances.filter(
                      i => i.id === +this.state.crumClickedParsed.crumInstanceId
                    )[0]
                  }
                  hideEditDeleteCrumForm={this.hideEditDeleteCrumForm}
                />
              )}
            </View>
            {this.state.dropCrumFormVisible && (
              <DropCrumForm hideDropCrumForm={this.hideDropCrumForm} />
            )}
            {this.state.editDeleteCrumFormVisible && (
              <EditDeleteCrumForm
                crumInstance={
                  crumInstances.filter(
                    i => i.id === +this.state.crumClickedParsed.crumInstanceId
                  )[0]
                }
                hideEditDeleteCrumForm={this.hideEditDeleteCrumForm}
              />
            )}
          </View>
        </ImageBackground>
      )
    }
  }
}

const mapState = state => ({
  isLoggedIn: !!state.user.id,
  user: state.user,
  locations: {
    ...state.locations,
    longitudeIdx: Math.floor(state.locations.longitude * SCALER),
    latitudeIdx: Math.floor(state.locations.latitude * SCALER)
  },
  crumInstances: state.crumInstances
})
const mapDispatch = dispatch => {
  return {
    getUser: () => {
      dispatch(me())
    },
    fetchCrums: () => {
      dispatch(fetchCrums())
    },
    fetchCrumInstances: (latitudeIdx, longitudeIdx) => {
      dispatch(fetchNearByCrumInstances(latitudeIdx, longitudeIdx))
    }
  }
}

const ARScreen = connect(mapState, mapDispatch)(DisARScreen)

export default ARScreen

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%'
  },
  btn: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    alignSelf: 'center',
    display: 'flex',
    width: '80%',
    height: '10%',
    borderColor: 'black',
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 20,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
