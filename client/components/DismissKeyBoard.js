import React from 'react'
import {Keyboard, TouchableWithoutFeedback} from 'react-native'

export const DismissKeyBoard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)
