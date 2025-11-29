import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import logo from '@/assets/images/SyncList Logo.png'
import LoginForm from '@/components/LoginForm'
import ThemedView from '@/components/ThemedView'

const LoginScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={logo}
        alt='SyncList Logo'
        style={styles.imageLogo}
      />
      <Text style={styles.title}>Welcome to SyncList</Text>
      <LoginForm/>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  imageLogo: {
    width:100,
    height:100,
    marginBottom:10
  },
  title:{
    fontSize:25,
    fontWeight: 'bold',
    color: '#2A7886',
    marginBottom:10
  }
})

export default LoginScreen
