import { StyleSheet, View } from 'react-native'
import React from 'react'

const PageContainer = props => {
  return (
    <View style={{...styles.container, ...props.style}}>
      {props.children}
    </View>
  )
}

export default PageContainer

const styles = StyleSheet.create({
    container : {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: 'white'
    }
});
