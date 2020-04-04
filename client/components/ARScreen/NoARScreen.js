/* eslint-disable complexity */
/* eslint-disable no-use-before-define */
/* eslint no-multi-spaces: 0 */
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
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native'
import {fetchCrums, fetchNearByCrumInstances, me} from '../../store/'
import DropCrumForm from './DropCrumForm'
import EditDeleteCrumForm from './EditDeleteCrumForm'
import {imageThumbnails, background} from '../../../assets/'
import {createPlane} from './Crums.js'
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

    THREE.suppressExpoWarnings(true)
    this.props.fetchCrums()
  }
  componentWillUnmount = () => {
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

  // longitudeIdx is the integer version of longitude it is the floor of (SCALER * longitude), likewise latitude is the floor of (SCALER * latitude)
  // we get longitudeIdx and latitude from REDUX store, and store it in our REACT state
  // when longitudeIdx or latitude in REDUX store changes, we update REACT state
  // we also requery the list of nearby crums
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
          if (crumInstance.crum === null) continue
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
    const crumInstances = this.props.crumInstances

    if (this.state.isGranted === false) {
      return (
        <CamPermissionModal
          isGranted={this.state.isGranted}
          closeModal={this.closeModal}
        />
      )
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.crumsTitle}>Nearby Crums:</Text>
              <ScrollView style={styles.scrollBox}>
                {crumInstances &&
                  crumInstances.length > 0 &&
                  crumInstances.map(crum => (
                    <View style={styles.instance} key={crum.id}>
                      <Image
                        source={imageThumbnails[crum.crum.name]}
                        style={styles.imageThumbs}
                      />
                      <View style={styles.instanceText}>
                        {crum.message.length > 24 ? (
                          <Text style={styles.each}>
                            {crum.message.slice(0, 24)}...
                          </Text>
                        ) : (
                          <Text style={styles.each}>{crum.message}</Text>
                        )}
                        <Text style={styles.each}>
                          By: {crum.user.userName}
                        </Text>
                      </View>
                    </View>
                  ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.btnDrop}
                onPress={() => {
                  this.showDropCrumForm()
                }}
              >
                <Text style={styles.drop} title="Drop!">
                  drop new crum
                </Text>
              </TouchableOpacity>

              {this.state.dropCrumFormVisible && (
                <DropCrumForm
                  hideDropCrumForm={this.hideDropCrumForm}
                  opaque={true}
                />
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
          </View>
        </View>
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

const NoARScreen = connect(mapState, mapDispatch)(DisARScreen)

export default NoARScreen

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%'
  },
  imageThumbs: {
    width: 40,
    height: 40,
    margin: 10
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    borderColor: '#7c1e9f',
    borderRadius: 10,
    marginTop: 100
  },
  container: {
    paddingBottom: '16%'
  },
  modalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '4%'
  },
  crumsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'APompadourBold'
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
  instanceText: {
    flexDirection: 'column'
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
  drop: {
    color: '#19ae9f',
    fontFamily: 'APompadourBold',
    letterSpacing: 7
  }
})
