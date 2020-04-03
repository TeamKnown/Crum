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
  crumInstanceNamer,
  outlineInstanceNamer,
  crumInstanceParser
} from '../utils'
import {
  Platform,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import {fetchCrums, fetchNearByCrumInstances, me} from '../../store/'
import DropCrumForm from './DropCrumForm'
import EditDeleteCrumForm from './EditDeleteCrumForm'
import NoARScreen from './NoARScreen'
import {images, background} from '../../../assets/'
import {createPlane, createPlaneOutline} from './Crums.js'
import * as Permissions from 'expo-permissions'
import CamPermissionModal from './CamPermissionModal'

let scene
class DisARScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      longitudeIdx: undefined, // longitudeIdx is the integer version of longitude it is the floor of (SCALER * longitude)
      latitudeIdx: undefined, // likewise, it is floor of (SCALER * latitude),
      crumInstances: [],
      dropCrumFormVisible: false,
      editDeleteCrumFormVisible: false,
      crumClickedParsed: {},
      errorMessage: null,
      contextCreated: false,
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
    }
  }

  closeModal = () => {
    this.setState({isGranted: true})
  }

  touch = new THREE.Vector2()
  raycaster = new THREE.Raycaster()

  componentDidMount = () => {
    this.requestCameraPermission()
    this.props.fetchCrums()
  }

  runHitTest = () => {
    this.raycaster.setFromCamera(this.touch, this.camera)
    const intersects = this.raycaster.intersectObjects([scene], true)
    if (intersects.length > 0) {
      let crumClicked = intersects[0].object.name
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
    this.setState({contextCreated: true})

    if (this.props.user.device === 'advanced') {
      AR.setWorldAlignment('gravityAndHeading')
      // The coordinate system's y-axis is parallel to gravity, its x- and z-axes are oriented to compass heading, and its origin is the initial position of the device. z:1 means 1 meter South, x:1 means 1 meter east. other options are alignmentCamera and gravity
    }
    this.renderer = new Renderer({gl, pixelRatio, width, height})
    scene = new THREE.Scene()
    scene.background = new BackgroundTexture(this.renderer)
    this.camera = new Camera(width, height, 0.01, 1000)

    scene.add(new THREE.AmbientLight(0xffffff))
  }

  onRender = delta => {
    this.renderer.render(scene, this.camera)
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.contextCreated) {
      return state
    }
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
          if (crumInstance.crum === null) continue
          let pos = computePos(crumInstance, props.locations)
          let plane = await createPlane(images[crumInstance.crum.name], pos)
          let planeName = crumInstanceNamer(crumInstance)
          plane.name = planeName
          scene.add(plane)

          if (crumInstance.recipientId === props.user.id) {
            let planeOutline = await createPlaneOutline(0x26decb, pos)
            let outlineName = outlineInstanceNamer(crumInstance)
            planeOutline.name = outlineName
            scene.add(planeOutline)
          }
          if (
            crumInstance.userId === props.user.id &&
            crumInstance.recipientId !== null
          ) {
            let planeOutline = await createPlaneOutline(0xbd7cde, pos)
            let outlineName = outlineInstanceNamer(crumInstance)
            planeOutline.name = outlineName
            scene.add(planeOutline)
          }
        }
      }

      const removeCrums = () => {
        for (const crumInstance of toRemove) {
          if (crumInstance.crum === null) continue
          let planeName = crumInstanceNamer(crumInstance)
          let planeToRemove = scene.getObjectByName(planeName)
          scene.remove(planeToRemove)

          if (
            crumInstance.recipientId === props.user.id ||
            (crumInstance.userId === props.user.id &&
              crumInstance.recipientId !== null)
          ) {
            let outlineName = outlineInstanceNamer(crumInstance)
            let outlineToRemove = scene.getObjectByName(outlineName)
            scene.remove(outlineToRemove)
          }
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
    const {user} = this.props
    const crumInstances = this.props.crumInstances
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
        <ImageBackground source={background} style={styles.root}>
          <View style={styles.root}>
            <View style={styles.root}>
              <View style={styles.root}>
                {user.device !== 'noAR' ? (
                  <TouchableOpacity
                    onPress={evt => {
                      this.updateTouch(evt)
                    }}
                    activeOpacity={1.0}
                    style={styles.root}
                  >
                    <GraphicsView
                      style={styles.root}
                      onContextCreate={this.onContextCreate}
                      onRender={this.onRender}
                      isArEnabled
                      isArCameraStateEnabled
                    />
                  </TouchableOpacity>
                ) : (
                  <NoARScreen />
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
  locations: state.locations,
  crumInstances: state.crumInstancesNearby
    .filter(
      crumInstance =>
        Math.abs(crumInstance.longitudeIdx - state.locations.longitudeIdx) <=
          3 &&
        Math.abs(crumInstance.latitudeIdx - state.locations.latitudeIdx) <= 3
    )
    .filter(
      crumInstance =>
        crumInstance.recipientId === state.user.id ||
        crumInstance.userId === state.user.id ||
        crumInstance.recipientId === null
    )
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
  root: {
    flex: 1,
    height: '100%'
  },
  imageThumbs: {
    width: 40,
    height: 40,
    margin: 10
  }
})
