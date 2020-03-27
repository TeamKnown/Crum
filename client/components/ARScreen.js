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
} from './utils'
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
} from '../store/'
import DropCrumForm from './DropCrumForm'
import EditDeleteCrumForm from './EditDeleteCrumForm'
import {images, fonts} from '../../assets/'
import {createPlane} from './Crums.js'
// import {request, PERMISSIONS} from 'react-native-permissions'

let scene
class DisARScreen extends React.Component {
  constructor() {
    super()
    this.updateTouch = this.updateTouch.bind(this)
    this.hideDropCrumForm = this.hideDropCrumForm.bind(this)
    this.hideEditDeleteCrumForm = this.hideEditDeleteCrumForm.bind(this)
  }

  state = {
    longitudeIdx: undefined, // longitudeIdx is the integer version of longitude it is the floor of (SCALER * longitude)
    latitudeIdx: undefined, // likewise, it is floor of (SCALER * latitude),
    crumInstances: [],
    dropCrumFormVisible: false,
    editDeleteCrumFormVisible: false,
    crumClickedParsed: {}
  }
  // requestLocationPermission = async () => {
  //   if (Platform.OS === 'ios') {
  //     let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
  //     if (response === 'granted') {
  //       this.props.subscribeToLocationData()
  //     }
  //   }
  // }

  touch = new THREE.Vector2()
  raycaster = new THREE.Raycaster()

  componentDidMount = () => {
    THREE.suppressExpoWarnings(true)
    this.props.subscribeToLocationData()
    this.props.fetchCrums()
  }
  componentWillUnmount = () => {
    this.props.unsubscribeToLocationData()
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
  hideDropCrumForm = () => {
    this.setState({dropCrumFormVisible: false})
  }
  hideEditDeleteCrumForm = () => {
    this.setState({editDeleteCrumFormVisible: false})
  }

  updateTouch = evt => {
    let {height, width} = Dimensions.get('window')
    let x = evt.nativeEvent.locationX
    let y = evt.nativeEvent.locationY
    this.touch.x = (x / width) * 2 - 1
    this.touch.y = -(y / height) * 2 + 1
    this.runHitTest()
  }

  onContextCreate = async ({gl, pixelRatio, width, height}) => {
    this.setState({loading: false})
    // AR.setWorldAlignment('gravityAndHeading')
    this.renderer = new Renderer({gl, pixelRatio, width, height})
    scene = new THREE.Scene()
    scene.background = new BackgroundTexture(this.renderer)
    this.camera = new Camera(width, height, 0.01, 1000)

    scene.add(new THREE.AmbientLight(0xffffff))
  }

  onResize = ({scale, width, height}) => {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(scale)
    this.renderer.setSize(width, height)
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
        for (const crumInstance of toAdd) {
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
          console.log('ADDED NEW CRUM: ', newObj.name)
        }
      }

      const removeCrums = () => {
        for (const crumInstance of toRemove) {
          // console.log('OLD CRUM TO REMOVE', JSON.stringify(crumInstance))
          let planeName = crumInstanceNamer(crumInstance)
          let planeToRemove = scene.getObjectByName(planeName)
          scene.remove(planeToRemove)
          console.log('REMOVED OLD CRUM', planeToRemove.name)
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
    // console.log('CRUM INSTANCES AR VIEW:', numCrum)
    // AR.setWorldAlignment('gravityAndHeading') // The coordinate system's y-axis is parallel to gravity, its x- and z-axes are oriented to compass heading, and its origin is the initial position of the device. z:1 means 1 meter South, x:1 means 1 meter east. other options are alignmentCamera and gravity
    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

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
            <View style={{flex: 1, height: '100%', width: '100%'}}>
              <TouchableOpacity
                disabled={false}
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
                  onResize={this.onResize}
                  isArEnabled
                  isArCameraStateEnabled
                />
              </TouchableOpacity>
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
          {/* <Text>{JSON.stringify(crumInstances.map(i => i.id))}</Text> */}
        </View>
      </ImageBackground>
    )
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
    }
    // fetchCrumInstanceDetail: id => {
    //   // dispatch(fetchCrumInstanceDetail(id))
    // }
  }
}

const ARScreen = connect(mapState, mapDispatch)(DisARScreen)

export default ARScreen

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%'
  }
})
