import * as React from 'react'
import {connect} from 'react-redux'
import {
  getSingleUser,
  fetchUserDroppedCrumInstances,
  fetchUserCollectedCrumInstances
} from '../../store'
import {logout} from '../../store/user'
import EditUserModalForm from './EditUserModalForm'
import ViewCrumsModal from './ViewCrumsModal'
import CollectedCrumsModal from './CollectedCrumsModal'
import UserSettingsModal from './UserSettingsModal'
// import DeviceInfo from 'react-native-device-info'
import {LinearGradient} from 'expo-linear-gradient'
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
import {useFocusEffect} from '@react-navigation/native'
import {purpleCrumIcon} from '../../../assets'
function UserProfile(props) {
  useFocusEffect(
    React.useCallback(() => {
      props.getSingleUser(props.user.id)
      props.getCollectedCrumInstances(props.user.id)
      props.getUserCrumInstances(props.user.id)
      return () => {}
    }, [props.user.id])
  )

  const {user} = props

  return (
    <View style={styles.main}>
      <View style={styles.topContainer}>
        <Image source={purpleCrumIcon} style={styles.profilePic} />
      </View>
      <View style={styles.container}>
        <View style={styles.bottomContainer}>
          <View style={styles.editButtons}>
            <Text style={styles.heading}>username</Text>
            <View>
              <EditUserModalForm />
            </View>
          </View>
          {user.id ? (
            <Text style={styles.text}>{user.userName}</Text>
          ) : (
            <Text style={styles.text}>P L A C E H O L D E R</Text>
          )}
          <View style={styles.crumCollections}>
            <ViewCrumsModal />
            <CollectedCrumsModal />
          </View>
        </View>
        <View style={styles.buttons}>
          <LinearGradient
            style={styles.btnLogout}
            colors={['#19ae9f', '#26decb']}
          >
            <TouchableOpacity onPress={() => props.logout()}>
              <Text style={styles.logout}>logout</Text>
            </TouchableOpacity>
          </LinearGradient>
          <UserSettingsModal style={styles.btnCrum} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    paddingBottom: '4%'
  },
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profilePic: {
    width: 220,
    height: 220,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 12,
    marginTop: '15%'
  },
  heading: {
    fontFamily: 'APompadourBold',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    fontWeight: 'bold',
    letterSpacing: 7
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    fontFamily: 'APompadour'
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    paddingBottom: '4%'
  },
  crumCollections: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttons: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editButtons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around'
  },
  btnLogout: {
    width: '47%',
    height: 60,
    backgroundColor: '#19ae9f',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  logout: {
    color: 'white',
    fontFamily: 'APompadourBold',
    letterSpacing: 7
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
  }
})

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleUser: id => dispatch(getSingleUser(id)),
    logout: () => dispatch(logout()),
    getCollectedCrumInstances: userId => {
      dispatch(fetchUserCollectedCrumInstances(userId))
    },
    getUserCrumInstances: userId => {
      dispatch(fetchUserDroppedCrumInstances(userId))
    }
  }
}

export default connect(mapState, mapDispatch)(UserProfile)
