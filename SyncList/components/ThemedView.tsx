import React from 'react'
import { View } from 'react-native'
import { useColorScheme } from 'react-native';

type ThemedViewProps = {
  children: React.ReactNode,
    style?: object
}

const ThemedView: React.FC<ThemedViewProps> = ({children,style}) => {
    const colorScheme = useColorScheme();
  return (
    <View style={colorScheme==='dark'?{backgroundColor: 'rgb(1, 0, 21)',...style}:{backgroundColor: 'white',...style}}>
      {children}
    </View>
  )
}


export default ThemedView
